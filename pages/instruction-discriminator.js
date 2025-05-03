import React, { useState } from "react";
import Page from "../components/Page";
import useStore from "../store";
import dynamic from 'next/dynamic';

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
    // Local state
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [copiedText, setCopiedText] = useState("");
    const [copiedIdl, setCopiedIdl] = useState({});
    const [expandedIdl, setExpandedIdl] = useState({});
    const [apiData, setApiData] = useState(null);

    // Input state from store
    const instruction = useStore((state) => state.discriminatorInput);
    const setInstruction = useStore((state) => state.setDiscriminatorInput);

    // Simple fetch function
    const handleSearch = async () => {
        if (instruction.length < 2) return;

        setLoading(true);
        setError(null);
        setApiData(null);

        try {
            const response = await fetch("https://apis.topledger.xyz/api/discriminator", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ix_name: instruction })
            });

            const data = await response.json();

            if (!response.ok || data.error) {
                throw new Error(data.error || `API Error: ${response.statusText}`);
            }

            if (!data.discriminator) {
                throw new Error("Discriminator not found for this instruction name.");
            }

            // Store the raw API response
            setApiData(data);
            console.log("API response:", data); // For debugging

        } catch (err) {
            setError(err.message || "Error loading data");
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopiedText(text);
        setCopiedIdl({});
        setTimeout(() => setCopiedText(""), 1000);
    };

    const handleCopyIdl = (index) => {
        if (!apiData?.mapping_results?.[index]?.idl_json) return;

        const idlString = typeof apiData.mapping_results[index].idl_json === 'string'
            ? apiData.mapping_results[index].idl_json
            : JSON.stringify(apiData.mapping_results[index].idl_json, null, 2);

        navigator.clipboard.writeText(idlString);
        setCopiedIdl({ ...copiedIdl, [index]: true });
        setCopiedText("");
        setTimeout(() => setCopiedIdl({ ...copiedIdl, [index]: false }), 1000);
    };

    const handleDownloadIdl = (index) => {
        if (!apiData?.mapping_results?.[index]?.idl_json) return;

        const idlString = typeof apiData.mapping_results[index].idl_json === 'string'
            ? apiData.mapping_results[index].idl_json
            : JSON.stringify(apiData.mapping_results[index].idl_json, null, 2);

        const blob = new Blob([idlString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${instruction || 'idl'}_${apiData.mapping_results[index].program_address}.json`;
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

    const getIDLName = (idlJson) => {
        if (!idlJson) return "Unknown";

        try {
            const idl = typeof idlJson === 'string' ? JSON.parse(idlJson) : idlJson;
            let name = "Unknown";

            if (idl.name) {
                name = idl.name;
            } else if (idl.instructions && idl.instructions.length > 0 && idl.instructions[0].name) {
                name = idl.instructions[0].name;
            }

            if (name !== "Unknown") {
                return name.replace(/_/g, ' ');
            }

            return name;
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

                {/* Loading state */}
                {loading && (
                    <div className="w-full flex items-center justify-center p-10">
                        <div className="flex items-center gap-2">
                            <div className="text-[#888]">Loading...</div>
                        </div>
                    </div>
                )}

                {/* Error state */}
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

                {/* Empty discriminator result */}
                {apiData?.discriminator?.length === 0 && (
                    <div className="w-full flex items-center justify-center p-10">
                        <div className="flex items-center gap-3 text-red-500 bg-red-50 px-6 py-4 rounded-lg">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="#c96262">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-md text-[#c96262]">Discriminator not found for this instruction name</span>
                        </div>
                    </div>
                )}

                {/* Discriminator display */}
                {apiData?.discriminator && apiData.discriminator.length > 0 && (
                    <div className="w-full max-w-2xl border border-[#CCD8FF] rounded p-8 bg-[#F6F8FF] shadow-sm">
                        <div className="flex flex-col gap-2">
                            <span className="text-[#657082] font-medium text-sm">Discriminator</span>
                            <div className="flex items-center gap-2 bg-white border border-[#CCD8FF] px-4 py-3 rounded shadow-sm">
                                <span className="text-[#657082] text-sm font-medium flex-1 tracking-wide font-mono">
                                    {/* Display discriminator array with commas between values */}
                                    {apiData.discriminator && Array.isArray(apiData.discriminator)
                                        ? `[${apiData.discriminator.join(', ')}]`
                                        : apiData.discriminator}
                                </span>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleCopy(apiData.discriminator && Array.isArray(apiData.discriminator)
                                            ? `[${apiData.discriminator.join(', ')}]`
                                            : apiData.discriminator)}
                                        className="p-2 hover:bg-[#EAEFFF] rounded transition-colors"
                                        title="Copy to clipboard"
                                        aria-label="Copy discriminator"
                                    >
                                        {copiedText === (apiData.discriminator && Array.isArray(apiData.discriminator)
                                            ? `[${apiData.discriminator.join(', ')}]`
                                            : apiData.discriminator) ? (
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

                {/* Program details */}
                {apiData?.mapping_results?.length > 0 && (
                    <div className="w-full max-w-2xl border border-[#CCD8FF] rounded p-8 bg-[#F6F8FF] shadow-sm">
                        <div className="flex flex-col gap-6">
                            <div className="flex justify-between items-center">
                                <span className="text-[#657082] font-medium text-sm">Program Details</span>
                                <span className="text-[#657082] text-sm">
                                    {apiData.mapping_results.length} {apiData.mapping_results.length === 1 ? 'program' : 'programs'}
                                </span>
                            </div>
                            <div className="flex flex-col gap-4">
                                {apiData.mapping_results.map((item, index) => (
                                    <div key={index} className="flex flex-col gap-0  overflow-hidden bg-[#F6F8FF] p-2">

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
