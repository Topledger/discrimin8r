import React, { useState, useEffect } from "react";
import Page from "../components/Page";

const S3_BUCKET_URL = "https://tl-discriminator.s3.ap-southeast-2.amazonaws.com";
const BASE_PREFIX = "projectwise-decoded-instructions/";

function DownloadData() {
    const [searchText, setSearchText] = useState("");
    const [folders, setFolders] = useState([]);
    const [currentPath, setCurrentPath] = useState("");
    const [currentItems, setCurrentItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [navigationPath, setNavigationPath] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [error, setError] = useState(null);

    // Fetch data from S3 using the XML API
    const fetchS3Data = async (prefix = BASE_PREFIX) => {
        setLoading(true);
        setError(null);

        try {
            const url = `${S3_BUCKET_URL}?list-type=2&prefix=${encodeURIComponent(prefix)}&delimiter=/`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const text = await response.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(text, "text/xml");

            // Check for errors in XML
            const errorElement = xmlDoc.querySelector("Error");
            if (errorElement) {
                const code = errorElement.querySelector("Code")?.textContent;
                const message = errorElement.querySelector("Message")?.textContent;
                throw new Error(`S3 Error: ${code} - ${message}`);
            }

            // Parse folders (CommonPrefixes)
            const folderElements = xmlDoc.querySelectorAll("CommonPrefixes");
            const folders = Array.from(folderElements).map(element => {
                const fullPrefix = element.querySelector("Prefix").textContent;
                const name = fullPrefix.replace(prefix, "").replace("/", "");
                return {
                    name,
                    type: "folder",
                    prefix: fullPrefix,
                    isFolder: true
                };
            });

            // Parse files (Contents)
            const contentElements = xmlDoc.querySelectorAll("Contents");
            const files = Array.from(contentElements)
                .filter(element => {
                    const key = element.querySelector("Key").textContent;
                    return key !== prefix; // Exclude the prefix itself
                })
                .map(element => {
                    const key = element.querySelector("Key").textContent;
                    const size = parseInt(element.querySelector("Size").textContent);
                    const lastModified = element.querySelector("LastModified").textContent;
                    const name = key.replace(prefix, "");

                    return {
                        name,
                        type: "file",
                        key,
                        size: formatBytes(size),
                        rawSize: size,
                        lastModified: new Date(lastModified),
                        isFolder: false
                    };
                });

            return { folders, files };
        } catch (error) {
            console.error("S3 fetch error:", error);
            setError(error.message);
            return { folders: [], files: [] };
        } finally {
            setLoading(false);
        }
    };

    // Load initial data
    useEffect(() => {
        fetchS3Data();
    }, []);

    // Handle folder navigation
    const handleFolderClick = async (folder) => {
        setSelectedFiles([]);
        setNavigationPath(prev => [...prev, folder]);
        setCurrentPath(folder.prefix);

        const data = await fetchS3Data(folder.prefix);
        setCurrentItems([...data.folders, ...data.files]);
    };

    // Handle breadcrumb navigation
    const handleBreadcrumbClick = async (index = -1) => {
        setSelectedFiles([]);

        if (index === -1) {
            // Go to root
            setNavigationPath([]);
            setCurrentPath("");
            const data = await fetchS3Data();
            setFolders(data.folders);
            setCurrentItems([]);
        } else {
            // Go to specific breadcrumb
            const newPath = navigationPath.slice(0, index + 1);
            setNavigationPath(newPath);
            const targetFolder = newPath[newPath.length - 1];
            setCurrentPath(targetFolder.prefix);

            const data = await fetchS3Data(targetFolder.prefix);
            setCurrentItems([...data.folders, ...data.files]);
        }
    };

    // Handle file selection
    const handleFileSelect = (file, checked) => {
        if (checked) {
            setSelectedFiles(prev => [...prev, file]);
        } else {
            setSelectedFiles(prev => prev.filter(f => f.key !== file.key));
        }
    };

    // Handle select all
    const handleSelectAll = (checked) => {
        const files = currentItems.filter(item => item.type === "file");
        if (checked) {
            setSelectedFiles(files);
        } else {
            setSelectedFiles([]);
        }
    };

    // Download selected files
    const downloadSelectedFiles = () => {
        selectedFiles.forEach(file => {
            const downloadUrl = `${S3_BUCKET_URL}/${encodeURIComponent(file.key)}`;
            window.open(downloadUrl, '_blank');
        });
        setSelectedFiles([]);
    };

    // Download single file
    const downloadFile = (file) => {
        const downloadUrl = `${S3_BUCKET_URL}/${encodeURIComponent(file.key)}`;
        window.open(downloadUrl, '_blank');
    };

    // Search filter
    const search = (item) => {
        if (!searchText || searchText.length < 2) return true;
        return item.name.toLowerCase().includes(searchText.toLowerCase());
    };

    // Format bytes helper
    const formatBytes = (bytes, decimals = 1) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    // Format date helper
    const formatDate = (date) => {
        if (!date) return 'Unknown';
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Set initial folders when data loads
    useEffect(() => {
        if (!currentPath) {
            fetchS3Data().then(data => setFolders(data.folders));
        }
    }, [currentPath]);

    const isInFolder = currentPath !== "";
    const displayItems = isInFolder ? currentItems : folders;
    const filteredItems = displayItems.filter(search);
    const files = filteredItems.filter(item => item.type === "file");
    const hasFiles = files.length > 0;

    return (
        <Page
            title="Download Data"
            subtitle={isInFolder ? "Folder contents" : "Browse project-wise decoded instruction data"}
            searchValue={searchText}
            onSearchChange={setSearchText}
            showSearch={true}
            breadcrumbPath={navigationPath}
            onBreadcrumbClick={handleBreadcrumbClick}
        >
            <div className="flex flex-col items-center gap-6 w-full" style={{ padding: '0.5rem 0' }}>
                {/* Loading State */}
                {loading && (
                    <div className="w-full flex items-center justify-center" style={{ minHeight: '320px' }}>
                        <svg
                            className="animate-spin"
                            style={{
                                height: '2rem',
                                width: '2rem',
                                color: '#085ED4'
                            }}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
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

                {/* Error State */}
                {error && (
                    <div
                        className="w-full"
                        style={{
                            backgroundColor: '#ffebeb',
                            border: '1px solid #FF4000',
                            borderRadius: '0.5rem',
                            padding: '1rem'
                        }}
                    >
                        <div className="flex items-center gap-2">
                            <svg
                                className="flex-shrink-0"
                                style={{ width: '1.25rem', height: '1.25rem', color: '#FF4000' }}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span style={{ color: '#FF4000', fontWeight: '500' }}>Error loading S3 data</span>
                        </div>
                        <p style={{ color: '#FF4000', fontSize: '0.875rem', marginTop: '0.25rem' }}>{error}</p>
                    </div>
                )}

                {/* Content */}
                {!loading && !error && (
                    <div className="w-full">
                        {/* Select All Checkbox and Download Button (only show when in folder with files) */}
                        {isInFolder && hasFiles && (
                            <div className="mb-4 flex items-center justify-between gap-4">
                                <div
                                    style={{
                                        //backgroundColor: '#ffffff',
                                        //border: '1px solid #CCD8FF',
                                        //borderRadius: '0.5rem',
                                        padding: '1rem',
                                        flex: '0 0 auto'
                                    }}
                                >
                                    <label className="flex items-center gap-2" style={{ color: '#53535f', fontSize: '0.875rem' }}>
                                        <input
                                            type="checkbox"
                                            checked={selectedFiles.length === files.length && files.length > 0}
                                            onChange={(e) => handleSelectAll(e.target.checked)}
                                            style={{
                                                width: '1rem',
                                                height: '1rem',
                                                accentColor: '#085ED4'
                                            }}
                                        />
                                        Select all {files.length} files
                                    </label>
                                </div>

                                {/* Download Selected Files Button */}
                                {selectedFiles.length > 0 && (
                                    <button
                                        onClick={downloadSelectedFiles}
                                        className="flex items-center gap-2 transition-all duration-200 hover:opacity-80"
                                        style={{
                                            backgroundColor: '#085ED4',
                                            color: 'white',
                                            padding: '0.5rem 1rem',
                                            borderRadius: '0.5rem',
                                            fontWeight: '600',
                                            fontSize: '0.875rem',
                                            border: 'none',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeWidth="2" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                        </svg>
                                        Download {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''}
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Items List */}
                        {filteredItems.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {filteredItems.map((item) => (
                                    <div
                                        key={item.name}
                                        className="flex items-center justify-between transition-all duration-200"
                                        style={{
                                            backgroundColor: '#ffffff',
                                            border: '1px solid #CCD8FF',
                                            borderRadius: '0.5rem',
                                            padding: '1.5rem',
                                            cursor: item.type === "folder" ? 'pointer' : 'default'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (item.type === "folder") {
                                                e.currentTarget.style.borderColor = '#085ED4';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.borderColor = '#CCD8FF';
                                        }}
                                    >
                                        <div className="flex items-center gap-3 flex-1">
                                            {/* Checkbox for files */}
                                            {item.type === "file" && (
                                                <input
                                                    type="checkbox"
                                                    checked={selectedFiles.some(f => f.key === item.key)}
                                                    onChange={(e) => handleFileSelect(item, e.target.checked)}
                                                    style={{
                                                        width: '1rem',
                                                        height: '1rem',
                                                        accentColor: '#085ED4'
                                                    }}
                                                />
                                            )}

                                            {/* Icon */}
                                            <div className="flex-shrink-0">
                                                {item.type === "folder" ? (
                                                    <svg
                                                        style={{ width: '1.5rem', height: '1.5rem', color: '#085ED4' }}
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0121.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                                                    </svg>
                                                ) : (
                                                    <svg
                                                        style={{ width: '1.5rem', height: '1.5rem', color: '#085ED4' }}
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0-1.125-.504-1.125-1.125V11.25a9 9 0 00-9-9z" />
                                                    </svg>
                                                )}
                                            </div>

                                            {/* Item Info */}
                                            <div
                                                className="flex-1"
                                                style={{ cursor: item.type === "folder" ? 'pointer' : 'default' }}
                                                onClick={() => item.type === "folder" ? handleFolderClick(item) : downloadFile(item)}
                                            >
                                                <div style={{ color: '#53535f', fontWeight: '500' }}>{item.name}</div>
                                                {item.type === "file" && (
                                                    <div className="flex items-center gap-4" style={{ fontSize: '0.75rem', color: '#53535f', marginTop: '0.25rem' }}>
                                                        <span>{item.size}</span>
                                                        <span>Modified {formatDate(item.lastModified)}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Action Icons */}
                                        <div className="flex items-center gap-2">

                                            {item.type === "folder" && (
                                                <svg
                                                    style={{ width: '1.5rem', height: '1.5rem', color: '#53535f' }}
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                                </svg>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div
                                className="text-center"
                                style={{
                                    backgroundColor: '#ffffff',
                                    border: '1px solid #CCD8FF',
                                    borderRadius: '0.5rem',
                                    padding: '3rem 1.5rem',
                                    color: '#53535f'
                                }}
                            >
                                <svg
                                    className="mx-auto mb-4"
                                    style={{ width: '3rem', height: '3rem', color: '#CCD8FF' }}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0121.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                                </svg>
                                <p style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>No items found</p>
                                <p style={{ fontSize: '0.875rem' }}>
                                    {searchText ? 'Try adjusting your search terms' : 'This folder appears to be empty'}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Page>
    );
}

export default DownloadData; 