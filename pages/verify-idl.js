import React, { useState, useCallback, useRef, useEffect } from "react";
import Page from "../components/Page";

const FileUpload = ({ onFileChange, fileName }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type === "application/json") {
            onFileChange({ target: { files: [file] } });
        }
    }, [onFileChange]);

    return (
        <div
            className={`relative border-2 border-dashed rounded transition-all duration-200 ${isDragging ? "border-[#576EB7] bg-[#F6F8FF]" : "border-[#CCD8FF]"
                }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <input
                type="file"
                accept=".json"
                onChange={onFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                aria-label="IDL file input"
            />
            <div className="flex flex-col items-center justify-center p-8">
                <svg
                    className={`w-12 h-12 mb-4 ${isDragging ? "text-[#576EB7]" : "text-[#657082]"
                        }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                </svg>
                <div className="text-center">
                    <p className="text-base font-medium text-[#657082] tracking-wide">
                        {fileName || "Drag and drop your IDL file here"}
                    </p>
                    <p className="text-xs text-[#657082] mt-1 tracking-wide">
                        or click to browse files
                    </p>
                </div>
            </div>
        </div>
    );
};

const VerifyForm = ({ dappAddress, setDappAddress, blockSlot, setBlockSlot, onFileChange, onVerify, loading, error, fileName }) => {
    return (
        <div className="flex flex-col items-center gap-10 w-full max-w-2xl">
            <div className="flex flex-col gap-6 w-full">
                <div className="flex flex-col gap-2">
                    <label className="text-[#657082] font-medium text-xs tracking-wide">Dapp Address</label>
                    <input
                        type="text"
                        value={dappAddress}
                        onChange={(e) => setDappAddress(e.target.value)}
                        className="w-full px-4 py-3 border border-[#CCD8FF] rounded focus:border-[#576EB7] focus:ring-1 focus:ring-[#576EB7] transition-all duration-200 shadow-sm text-base text-[#657082] tracking-wide"
                        placeholder="Enter dapp address"
                        aria-label="Dapp address input"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-[#657082] font-medium text-xs tracking-wide">Block Slot</label>
                    <input
                        type="text"
                        value={blockSlot}
                        onChange={(e) => setBlockSlot(e.target.value)}
                        className="w-full px-4 py-3 border border-[#CCD8FF] rounded focus:border-[#576EB7] focus:ring-1 focus:ring-[#576EB7] transition-all duration-200 shadow-sm text-base text-[#657082] tracking-wide"
                        placeholder="Enter block slot"
                        aria-label="Block slot input"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-[#657082] font-medium text-xs tracking-wide">IDL File</label>
                    <FileUpload onFileChange={onFileChange} fileName={fileName} />
                </div>
                <button
                    onClick={onVerify}
                    className="w-full px-6 py-3 bg-accent text-white rounded hover:opacity-80 transition-all duration-200 whitespace-nowrap font-bold text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading || !dappAddress.trim() || !blockSlot.trim()}
                >
                    {loading ? (
                        <div className="flex items-center justify-center gap-2">
                            <svg
                                className="h-5 w-5 animate-[spin_2s_linear_infinite]"
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
                            <span>Verifying...</span>
                        </div>
                    ) : (
                        "Verify"
                    )}
                </button>
                {error && (
                    <div className="flex items-center gap-3 text-red-500 bg-red-50 px-6 py-4 rounded">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-base tracking-wide">{error}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

function VerifyIDL() {
    const [dappAddress, setDappAddress] = useState("");
    const [blockSlot, setBlockSlot] = useState("");
    const [idl, setIdl] = useState(null);
    const [fileName, setFileName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);
    const resultRef = useRef(null);

    useEffect(() => {
        if (result?.success && resultRef.current) {
            resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [result]);

    const onFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name);
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const parsed = JSON.parse(event.target.result);
                    setIdl(parsed);
                } catch (err) {
                    setError("Invalid JSON file.");
                }
            };
            reader.readAsText(file);
        }
    };

    const handleVerify = async () => {
        if (!dappAddress || !blockSlot || !idl) {
            setError("Please provide all required inputs.");
            return;
        }
        setLoading(true);
        setError(null);
        setResult(null);
        try {
            const res = await fetch("https://apis.topledger.xyz/api/verify-idl", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    dapp_address: dappAddress,
                    block_slot: Number(blockSlot),
                    idl: idl,
                })
            });
            if (!res.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await res.json();
            setResult(data);
        } catch (err) {
            setError("Error verifying IDL.");
        }
        setLoading(false);
    };

    return (
        <Page title="Verify IDL" subtitle="Verify your IDL file against a deployed program">
            <div className="flex flex-col items-center gap-10 w-full mt-12">
                <VerifyForm
                    dappAddress={dappAddress}
                    setDappAddress={setDappAddress}
                    blockSlot={blockSlot}
                    setBlockSlot={setBlockSlot}
                    onFileChange={onFileChange}
                    onVerify={handleVerify}
                    loading={loading}
                    error={error}
                    fileName={fileName}
                />
                {result && (
                    <div ref={resultRef} className="w-full max-w-2xl border border-[#CCD8FF] rounded p-8 bg-white shadow-sm">
                        {result.success ? (
                            <div className="flex flex-col gap-6">
                                <div className="flex items-center gap-2">
                                    <svg className="h-6 w-6 text-[#62B890]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-[#62B890] text-base font-semibold tracking-wide">Verification Successful</span>
                                </div>
                                <div className="flex flex-col gap-4">
                                    {result.data && (
                                        <div className="flex flex-col gap-4">
                                            <span className="text-[#657082] font-semibold text-base tracking-wide">Instructions:</span>
                                            <div className="bg-[#F6F8FF] border border-[#CCD8FF] px-6 py-4 rounded shadow-sm overflow-x-auto">
                                                <pre className="text-xs text-[#657082] font-mono leading-relaxed tracking-wide">
                                                    {JSON.stringify(result.data, null, 2)}
                                                </pre>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                <span className="text-red-500 text-base font-semibold tracking-wide">Verification Failed</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Page>
    );
}

export default VerifyIDL;
