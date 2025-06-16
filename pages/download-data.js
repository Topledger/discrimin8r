import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Page from "../components/Page";

function DownloadData() {
    const [searchText, setSearchText] = useState("");
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [folderContents, setFolderContents] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [navigationPath, setNavigationPath] = useState([]);

    // Fetch folders from S3
    const { data: s3Data, isLoading: s3Loading, error: s3Error } = useQuery({
        queryKey: ["s3-folders"],
        queryFn: async () => {
            const response = await fetch("/api/s3-folders");
            if (!response.ok) {
                throw new Error("Failed to fetch S3 data");
            }
            return response.json();
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    // Fetch folder contents when a folder is selected
    const { data: folderData, isLoading: folderLoading } = useQuery({
        queryKey: ["s3-folder-contents", selectedFolder?.prefix],
        queryFn: async () => {
            if (!selectedFolder?.prefix) return null;
            const response = await fetch(`/api/s3-folders?prefix=${encodeURIComponent(selectedFolder.prefix)}`);
            if (!response.ok) {
                throw new Error("Failed to fetch folder contents");
            }
            return response.json();
        },
        enabled: !!selectedFolder?.prefix,
        staleTime: 1000 * 60 * 2, // 2 minutes
    });

    const search = (folder) => {
        if (!searchText || searchText?.length < 2) return true;

        return (
            folder.name.toLowerCase().includes(searchText.toLowerCase()) ||
            (folder.description && folder.description.toLowerCase().includes(searchText.toLowerCase()))
        );
    };

    const handleFolderClick = (folder) => {
        setSelectedFolder(folder);
        setSelectedFiles([]); // Clear selected files when navigating
        setNavigationPath(prev => [...prev, folder]);
    };

    const handleBreadcrumbClick = (index = -1) => {
        if (index === -1) {
            // Clicked on root (title)
            setSelectedFolder(null);
            setNavigationPath([]);
        } else {
            // Clicked on specific breadcrumb
            const newPath = navigationPath.slice(0, index + 1);
            setNavigationPath(newPath);
            setSelectedFolder(newPath[newPath.length - 1] || null);
        }
        setSelectedFiles([]);
    };

    const handleFileSelect = (file, checked) => {
        if (checked) {
            setSelectedFiles(prev => [...prev, file]);
        } else {
            setSelectedFiles(prev => prev.filter(f => f.key !== file.key));
        }
    };

    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedFiles([...files]);
        } else {
            setSelectedFiles([]);
        }
    };

    const downloadSelectedFiles = async () => {
        if (selectedFiles.length === 0) return;

        try {
            // Check if we're in demo mode
            if (s3Data?.message) {
                alert(`Demo Mode: Download functionality requires AWS S3 configuration.`);
                return;
            }

            // Download each selected file
            for (const file of selectedFiles) {
                const response = await fetch('/api/s3-download', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        key: file.key,
                        fileName: file.name
                    })
                });

                if (response.ok) {
                    const { downloadUrl } = await response.json();
                    window.open(downloadUrl, '_blank');
                }
            }

            // Clear selection after download
            setSelectedFiles([]);
        } catch (error) {
            console.error('Download error:', error);
            alert('Failed to download files. Please try again.');
        }
    };

    const handleDownload = async (item) => {
        try {
            // Check if we're in demo mode
            if (s3Data?.message) {
                alert(`Demo Mode: Download functionality requires AWS S3 configuration.\n\nTo enable downloads:\n1. Copy env-template.txt to .env.local\n2. Add your AWS credentials\n3. Restart the server`);
                return;
            }

            // For folders, we might want to create a zip or just download individual files
            // For now, let's handle individual files
            if (item.type === 'file') {
                const response = await fetch('/api/s3-download', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        key: item.key || item.prefix,
                        fileName: item.name
                    })
                });

                if (!response.ok) {
                    throw new Error('Failed to generate download URL');
                }

                const { downloadUrl } = await response.json();
                window.open(downloadUrl, '_blank');
            } else {
                // For folders, show a message or implement bulk download
                alert(`Folder download for "${item.name}" - Individual files can be downloaded from the folder view.`);
            }
        } catch (error) {
            console.error('Download error:', error);
            alert('Failed to download file. Please try again.');
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Unknown';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Get folders from S3 data
    const folders = s3Data?.success ? s3Data.data.folders : [];
    const files = folderData?.success ? folderData.data.files : [];
    const subFolders = folderData?.success ? folderData.data.folders : [];

    // Show loading state
    const showLoading = s3Loading || (selectedFolder && folderLoading);

    // Show error state
    if (s3Error && !s3Loading) {
        console.error('S3 Error:', s3Error);
    }

    return (
        <Page
            title="Download Data"
            subtitle={selectedFolder ? "Folder contents" : "Browse project-wise decoded instruction data"}
            searchValue={searchText}
            onSearchChange={setSearchText}
            showSearch={!selectedFolder}
            breadcrumbPath={navigationPath}
            onBreadcrumbClick={handleBreadcrumbClick}
        >
            <div className="flex flex-col items-center gap-10 w-full mt-8">
                {showLoading && (
                    <div className="w-full min-h-80 flex items-center justify-center">
                        <svg
                            className="h-7 w-7 text-[#aaa] animate-[spin_3s_linear_infinite]"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line x1="12" y1="2" x2="12" y2="6" />
                            <line x1="12" y1="18" x2="12" y2="22" />
                            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
                            <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
                            <line x1="2" y1="12" x2="6" y2="12" />
                            <line x1="18" y1="12" x2="22" y2="12" />
                            <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
                            <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
                        </svg>
                    </div>
                )}

                {!selectedFolder && !showLoading && (
                    <>
                        {/* Error State */}
                        {s3Error && (
                            <div className="w-full bg-red-50 border border-red-200 rounded-[8px] p-6 mb-4">
                                <div className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                    </svg>
                                    <div>
                                        <h3 className="text-red-700 font-medium text-sm mb-1">Connection Error</h3>
                                        <p className="text-red-600 text-sm">
                                            Unable to connect to AWS S3. Please check your environment configuration and credentials.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Mock Data Notice */}
                        {s3Data?.message && (
                            <div className="w-full bg-yellow-50 border border-yellow-200 rounded-[8px] p-6 mb-4">
                                <div className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z" />
                                    </svg>
                                    <div>
                                        <h3 className="text-yellow-800 font-medium text-sm mb-1">Demo Mode</h3>
                                        <p className="text-yellow-700 text-sm mb-2">
                                            {s3Data.message}
                                        </p>
                                        <p className="text-yellow-600 text-xs">
                                            To connect to real AWS S3 data, copy <code className="bg-yellow-100 px-1 rounded">env-template.txt</code> to <code className="bg-yellow-100 px-1 rounded">.env.local</code> and configure your AWS credentials.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}



                        {/* Folder List */}
                        <div className="space-y-3 w-full">
                            {folders.filter(search).map((folder) => (
                                <div key={folder.name} className="flex items-center justify-between p-3 bg-[#F6F8FF] border border-[#CCD8FF] rounded hover:border-[#576EB7] transition-all duration-200">
                                    <div className="flex items-center gap-3 cursor-pointer flex-1" onClick={() => handleFolderClick(folder)}>
                                        <svg className="w-5 h-5 text-[#576EB7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                                        </svg>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[#657082] font-medium text-sm">{folder.name}</span>
                                                <span className="text-[#657082] text-xs bg-white px-2 py-1 rounded border border-[#CCD8FF]">
                                                    {folder.files} files
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-xs text-[#657082] mt-1">
                                                <span>{folder.size}</span>
                                                <span>Modified {formatDate(folder.lastModified)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <svg className="w-5 h-5 text-[#657082]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                    </svg>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {selectedFolder && !showLoading && (
                    <div className="w-full">
                        {/* Folder Details 
                        <div className="bg-[#F6F8FF] border border-[#CCD8FF] rounded-[8px] p-6 mb-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <svg className="w-8 h-8 text-[#576EB7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                                    </svg>
                                    <div>
                                        <h3 className="text-[#576EB7] font-medium text-lg mb-1">{selectedFolder.name}</h3>
                                        <p className="text-[#657082] text-sm mb-2">{selectedFolder.description || 'S3 folder'}</p>
                                        <div className="flex items-center gap-6 text-sm text-[#657082]">
                                            <span><strong>{selectedFolder.files}</strong> files</span>
                                            <span><strong>{selectedFolder.size}</strong> total size</span>
                                            <span>Last modified <strong>{formatDate(selectedFolder.lastModified)}</strong></span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDownload(selectedFolder)}
                                    className="px-6 py-3 bg-[#576EB7] text-white font-medium rounded hover:bg-[#4457A1] transition-colors flex items-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                    </svg>
                                    Download Folder
                                </button>
                            </div>
                        </div> */}

                        {/* Folder and File Listing */}
                        <div className="bg-white border border-[#CCD8FF] rounded-[8px] p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-[#576EB7] font-medium">{selectedFolder.name}</h4>
                                {/* Show Download icon only when files are selected */}
                                {selectedFiles.length > 0 && (
                                    <svg
                                        onClick={downloadSelectedFiles}
                                        className="w-6 h-6 text-[#576EB7] cursor-pointer hover:text-[#4457A1] transition-colors"
                                        title={`Download ${selectedFiles.length} selected file${selectedFiles.length > 1 ? 's' : ''}`}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                    </svg>
                                )}
                            </div>
                            <hr className="my-4" />

                            {/* Show subfolders and files */}
                            {(subFolders && subFolders.length > 0) || (files && files.length > 0) ? (
                                <div className="space-y-3">
                                    {/* Select All checkbox - only show when files are present */}
                                    {files && files.length > 0 && subFolders.length === 0 && (
                                        <div className="flex items-center gap-3 p-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedFiles.length === files.length && files.length > 0}
                                                onChange={(e) => handleSelectAll(e.target.checked)}
                                                className="w-4 h-4 text-[#576EB7] bg-gray-100 border-gray-300 rounded focus:ring-[#576EB7] focus:ring-2"
                                            />
                                            <span className="text-[#657082] font-medium text-sm">
                                                Select All ({files.length} files)
                                            </span>
                                        </div>
                                    )}

                                    {/* Subfolders */}
                                    {subFolders.map((folder) => (
                                        <div key={folder.prefix} className="flex items-center justify-between p-3 bg-[#F6F8FF] border border-[#CCD8FF] rounded hover:border-[#576EB7] transition-all duration-200">
                                            <div className="flex items-center gap-3 cursor-pointer flex-1" onClick={() => handleFolderClick(folder)}>
                                                <svg className="w-5 h-5 text-[#576EB7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                                                </svg>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[#657082] font-medium text-sm">{folder.name}</span>
                                                        <span className="text-[#657082] text-xs bg-white px-2 py-1 rounded border border-[#CCD8FF]">
                                                            {folder.files} files
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-xs text-[#657082] mt-1">
                                                        <span>{folder.size}</span>
                                                        <span>Modified {formatDate(folder.lastModified)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <svg className="w-5 h-5 text-[#657082]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                            </svg>
                                        </div>
                                    ))}

                                    {/* Files */}
                                    {files.map((file) => (
                                        <div key={file.key} className="flex items-center justify-between p-3 bg-[#F6F8FF] border border-[#CCD8FF] rounded hover:border-[#576EB7] transition-all duration-200">
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedFiles.some(f => f.key === file.key)}
                                                    onChange={(e) => handleFileSelect(file, e.target.checked)}
                                                    className="w-4 h-4 text-[#576EB7] bg-gray-100 border-gray-300 rounded focus:ring-[#576EB7] focus:ring-2"
                                                />
                                                <svg className="w-5 h-5 text-[#576EB7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0-1.125-.504-1.125-1.125V11.25a9 9 0 00-9-9z" />
                                                </svg>
                                                <div>
                                                    <span className="text-[#657082] font-medium text-sm">{file.name}</span>
                                                    <div className="flex items-center gap-4 text-xs text-[#657082] mt-1">
                                                        <span>{file.size}</span>
                                                        <span>Modified {formatDate(file.lastModified)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-[#657082]">
                                    <svg className="w-12 h-12 mx-auto mb-4 text-[#CCD8FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                                    </svg>
                                    <p>Navigate through folders to find files</p>
                                    <p className="text-sm mt-1">Your data is organized in nested folders - click folders to explore deeper</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </Page>
    );
}

export default DownloadData; 