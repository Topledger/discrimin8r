import React, { useState, useEffect } from "react";
import Page from "../components/Page";
import useStore from "../store"; // Import the Zustand store
import dynamic from 'next/dynamic'; // Import dynamic from Next.js

// Dynamically import ReactJson with no SSR
const ReactJson = dynamic(() => import('react-json-view'), { ssr: false });

const SearchHeader = ({ value, onChange, onSearch }) => {
    return (
        <div className="flex flex-col items-center gap-10 w-full max-w-2xl">
            <div className="flex items-center space-x-3 w-full">
                <div className="flex-1 relative">
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                onSearch();
                            }
                        }}
                        className="w-full px-4 py-3 pl-11 border border-[#CCD8FF] rounded focus:border-[#576EB7] focus:ring-1 focus:ring-[#576EB7] transition-all duration-200 shadow-sm text-base text-[#657082] tracking-wide"
                        placeholder="Enter instruction name (e.g., initialize)"
                        aria-label="Instruction name input"
                    />
                    <svg
                        className="h-5 w-5 text-[#657082] absolute left-4 top-1/2 -translate-y-1/2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>
                <button
                    onClick={onSearch}
                    className="px-6 py-3 bg-accent text-white rounded hover:opacity-80 transition-all duration-200 whitespace-nowrap font-bold text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!value.trim()}
                >
                    Search
                </button>
            </div>
        </div>
    );
};

function InstructionDiscriminator() {
    // Local state for transient UI states
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [copiedText, setCopiedText] = useState("");
    const [copiedIdl, setCopiedIdl] = useState({}); // State for IDL copy confirmation by index
    const [expandedIdl, setExpandedIdl] = useState({}); // State for expanded IDL sections

    // Global state from Zustand
    const instruction = useStore((state) => state.discriminatorInput);
    const setInstruction = useStore((state) => state.setDiscriminatorInput);
    const result = useStore((state) => state.discriminatorResult);
    const setResult = useStore((state) => state.setDiscriminatorResult);

    const handleSearch = async () => {
        if (instruction.length < 2) return;
        setLoading(true);
        setError(null);
        setResult(null);
        try {
            const res = await fetch("https://apis.topledger.xyz/api/discriminator", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ix_name: instruction })
            });
            const data = await res.json();

            if (!res.ok || data.error) {
                throw new Error(data.error || `API Error: ${res.statusText}`);
            }

            if (!data.discriminator) {
                throw new Error("Discriminator not found for this instruction name.");
            }

            // Transform the data to match our expected format
            const transformedData = {
                discriminator: data.discriminator,
                mapping_results: data.mapping_results || []
            };

            setResult(transformedData);
        } catch (err) {
            setError(err.message || "Error loading data");
            setResult(null);
        }
        setLoading(false);
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopiedText(text);
        setCopiedIdl({}); // Reset IDL copy state
        setTimeout(() => setCopiedText(""), 1000);
    };

    const handleCopyIdl = (index) => {
        if (!result?.mapping_results || !result.mapping_results[index]?.idl_json) return;
        const idlString = typeof result.mapping_results[index].idl_json === 'string'
            ? result.mapping_results[index].idl_json
            : JSON.stringify(result.mapping_results[index].idl_json, null, 2);
        navigator.clipboard.writeText(idlString);
        setCopiedIdl({ ...copiedIdl, [index]: true });
        setCopiedText(""); // Reset other copy state
        setTimeout(() => setCopiedIdl({ ...copiedIdl, [index]: false }), 1000);
    };

    const handleDownloadIdl = (index) => {
        if (!result?.mapping_results || !result.mapping_results[index]?.idl_json) return;
        const idlString = typeof result.mapping_results[index].idl_json === 'string'
            ? result.mapping_results[index].idl_json
            : JSON.stringify(result.mapping_results[index].idl_json, null, 2);
        const blob = new Blob([idlString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${instruction || 'idl'}_${result.mapping_results[index].program_address}.json`; // Use instruction name and program address for filename
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const toggleIdlExpansion = (index) => {
        setExpandedIdl({
            ...expandedIdl,
            [index]: !expandedIdl[index]
        });
    };

    const formatByteArray = (byteArray) => {
        if (!byteArray || !Array.isArray(byteArray)) return "Invalid byte array";

        // Format each byte as a two-digit hexadecimal number
        const formattedBytes = byteArray.map(byte => {
            // Convert to hex and ensure it's two digits
            const hex = byte.toString(16).toUpperCase();
            return hex.padStart(2, '0');
        });

        // Return as a properly formatted byte array string
        return `[${formattedBytes.join(', ')}]`;
    };

    const getIDLName = (idlJson) => {
        if (!idlJson) return "Unknown";

        try {
            // If it's a string, try to parse it
            const idl = typeof idlJson === 'string' ? JSON.parse(idlJson) : idlJson;
            let name = "Unknown";

            // Try to get the name from the IDL
            if (idl.name) {
                name = idl.name;
            }
            // If no name, try to get the first instruction name
            else if (idl.instructions && idl.instructions.length > 0 && idl.instructions[0].name) {
                name = idl.instructions[0].name;
            }

            // Replace underscores with spaces if a name was found
            if (name !== "Unknown") {
                return name.replace(/_/g, ' ');
            }

            return name; // Return "Unknown" if no name was found
        } catch (e) {
            return "Unknown";
        }
    };

    return (
        <Page title="Instruction Discriminator" subtitle="Get the discriminator, program addresses, and IDL for an Instruction">
            <div className="flex flex-col items-center gap-10 w-full mt-12">
                <SearchHeader
                    value={instruction}
                    onChange={setInstruction}
                    onSearch={handleSearch}
                />
                {loading && (
                    <div className="w-full flex items-center justify-center p-10">
                        <div className="flex items-center gap-2">
                            <div className="text-[#888]">Loading...</div>
                        </div>
                    </div>
                )}
                {error && (
                    <div className="w-full flex items-center justify-center p-10">
                        <div className="flex items-center gap-3 text-red-500 bg-red-50 px-6 py-4 rounded-lg">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="#c96262">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-md text-[#c96262]">{error}</span>
                        </div>
                    </div>
                )}
                {result?.discriminator?.length === 0 && (
                    <div className="w-full flex items-center justify-center p-10">
                        <div className="flex items-center gap-3 text-red-500 bg-red-50 px-6 py-4 rounded-lg">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="#c96262">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-md text-[#c96262]">Discriminator not found for this instruction name</span>
                        </div>
                    </div>
                )}
                {result?.discriminator?.length > 0 && (
                    <div className="w-full max-w-2xl border border-[#CCD8FF] rounded p-8 bg-[#F6F8FF] shadow-sm">
                        <div className="flex flex-col gap-2">
                            <span className="text-[#657082] font-medium text-sm">Discriminator</span>
                            <div className="flex items-center gap-2 bg-white border border-[#CCD8FF] px-4 py-3 rounded shadow-sm">
                                <span className="text-[#657082] text-sm font-medium flex-1 tracking-wide font-mono">
                                    {formatByteArray(result.discriminator)}
                                </span>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleCopy(formatByteArray(result.discriminator))}
                                        className="p-2 hover:bg-[#EAEFFF] rounded transition-colors"
                                        title="Copy to clipboard"
                                        aria-label="Copy discriminator"
                                    >
                                        {copiedText === formatByteArray(result.discriminator) ? (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="18"
                                                height="18"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="#22C55E"
                                                className="text-[#22C55E]"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        ) : (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="18"
                                                height="18"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                className="text-[#657082]"
                                            >
                                                <rect x="8" y="8" width="12" height="12" rx="2" ry="2" />
                                                <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {result?.mapping_results?.length > 0 && (
                    <div className="w-full max-w-2xl border border-[#CCD8FF] rounded p-8 bg-[#F6F8FF] shadow-sm">
                        <div className="flex flex-col gap-4">
                            <div className="flex justify-between items-center">
                                <span className="text-[#657082] font-medium text-sm">Program Details</span>
                                <span className="text-[#657082] text-sm">
                                    {result.mapping_results.length} {result.mapping_results.length === 1 ? 'program' : 'programs'}
                                </span>
                            </div>
                            <div className="flex flex-col gap-4">
                                {result.mapping_results.map((item, index) => (
                                    <div key={index} className="flex flex-col gap-2 border border-[#CCD8FF] rounded overflow-hidden bg-[#F6F8FF] shadow-sm p-4">
                                        <span className="text-[#657082] text-xs font-normal tracking-wide mb-1">
                                            {getIDLName(item.idl_json)}
                                        </span>
                                        <div className="flex items-center gap-2 bg-white px-4 py-3 border border-[#CCD8FF] rounded shadow-sm">
                                            <span className="text-[#657082] text-sm font-medium tracking-wide font-mono flex-1">
                                                {item.program_address}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleCopy(item.program_address)}
                                                    className="p-2 hover:bg-[#EAEFFF] rounded transition-colors"
                                                    title="Copy to clipboard"
                                                    aria-label={`Copy program address ${index + 1}`}
                                                >
                                                    {copiedText === item.program_address ? (
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="18"
                                                            height="18"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="#22C55E"
                                                            className="text-[#22C55E]"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                                d="M5 13l4 4L19 7"
                                                            />
                                                        </svg>
                                                    ) : (
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="18"
                                                            height="18"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            className="text-[#657082]"
                                                        >
                                                            <rect x="8" y="8" width="12" height="12" rx="2" ry="2" />
                                                            <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
                                                        </svg>
                                                    )}
                                                </button>
                                                {item.idl_json && (
                                                    <button
                                                        onClick={() => toggleIdlExpansion(index)}
                                                        className={`px-3 py-1 text-xs font-medium rounded transition-colors ${expandedIdl[index]
                                                            ? "bg-[#EAEFFF] text-[#576EB7]"
                                                            : "text-[#576EB7] hover:bg-[#EAEFFF]"
                                                            }`}
                                                    >
                                                        {expandedIdl[index] ? "Hide IDL" : "View IDL"}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        {expandedIdl[index] && item.idl_json && (
                                            <div className="bg-[#F6F8FF] border border-[#CCD8FF] rounded">
                                                <div className="flex justify-between items-center rounded-t border-b border-[#CCD8FF] px-4 py-2 bg-[#fffFFF]">
                                                    <span className="text-[#657082] font-medium text-sm">IDL JSON</span>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleCopyIdl(index)}
                                                            className="p-2 hover:bg-[#EAEFFF] rounded transition-colors"
                                                            title="Copy IDL JSON"
                                                            aria-label="Copy IDL JSON"
                                                        >
                                                            {copiedIdl[index] ? (
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width="18"
                                                                    height="18"
                                                                    viewBox="0 0 24 24"
                                                                    fill="none"
                                                                    stroke="#22C55E"
                                                                    className="text-[#22C55E]"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth="2"
                                                                        d="M5 13l4 4L19 7"
                                                                    />
                                                                </svg>
                                                            ) : (
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width="18"
                                                                    height="18"
                                                                    viewBox="0 0 24 24"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    className="text-[#657082]"
                                                                >
                                                                    <rect x="8" y="8" width="12" height="12" rx="2" ry="2" />
                                                                    <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
                                                                </svg>
                                                            )}
                                                        </button>
                                                        <button
                                                            onClick={() => handleDownloadIdl(index)}
                                                            className="p-2 hover:bg-[#EAEFFF] rounded transition-colors"
                                                            title="Download IDL JSON"
                                                            aria-label="Download IDL JSON"
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="18"
                                                                height="18"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                className="text-[#657082]"
                                                            >
                                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                                <polyline points="7 10 12 15 17 10" />
                                                                <line x1="12" y1="15" x2="12" y2="3" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="bg-white p-4 max-h-96 rounded-b overflow-auto text-xs">
                                                    <ReactJson
                                                        src={typeof item.idl_json === 'string' ? JSON.parse(item.idl_json) : item.idl_json}
                                                        theme="rjv-default"
                                                        collapsed={2}
                                                        enableClipboard={false}
                                                        displayDataTypes={false}
                                                        displayObjectSize={true}
                                                        name={false}
                                                        style={{ backgroundColor: 'transparent', fontFamily: 'monospace' }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Page>
    );
}

export default InstructionDiscriminator;
