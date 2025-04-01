import React, { useState } from "react";
import Page from "../components/Page";

const SearchHeader = ({ value, onChange, onSearch }) => {
    return (
        <div className="flex justify-between items-center border-b border-blue-200 py-4 min-h-20">
            <div className="flex flex-col gap-1">
                <span className="text-xl font-semibold text-gray-800">Instruction Name</span>
                <span className="text-sm text-gray-500">
                    Get the instruction name from a base58 string or hex data for Anchor-based programs
                </span>
            </div>
            <div className="flex items-center space-x-2">
                <div className="flex items-center bg-white border border-gray-300 rounded px-3 py-2">
                    <svg
                        className="h-4 w-4 text-gray-500"
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
                    <input
                        className="ml-2 outline-none text-gray-700 placeholder-gray-400 w-full"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                onSearch();
                            }
                        }}
                        placeholder="b58/hex encoded ix"
                    />
                </div>
                <button
                    onClick={onSearch}
                    className="px-4 py-2 bg-accent hover:bg-blue-700 text-white rounded"
                >
                    Search
                </button>
            </div>
        </div>
    );
};

function InstructionName() {
    const [instruction, setInstruction] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [copiedText, setCopiedText] = useState("");

    const handleSearch = async () => {
        if (instruction.length < 2) return;
        setLoading(true);
        setError(null);
        setResult(null);
        try {
            // Temporary test case - will be removed after testing
            if (instruction === "test") {
                setResult({
                    name: "increasePositionPreSwap",
                    program_addresses: [
                        "PERPHjGBqRHArX4DySjwM6UJHiR3sWAatqfdBS2qQJu",
                        "PERPHjGBqRHArX4DySjwM6UJHiR3sWAatqfdBS2qQJv",
                        "PERPHjGBqRHArX4DySjwM6UJHiR3sWAatqfdBS2qQJw"
                    ]
                });
                setLoading(false);
                return;
            }

            const res = await fetch("https://apis.topledger.xyz/api/instruction", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ base58_ix_data: instruction }),
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Network response was not ok");
            }
            setResult(data);
        } catch (err) {
            setError(err.message || "Error loading data");
        }
        setLoading(false);
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopiedText(text);
        setTimeout(() => setCopiedText(""), 1000);
    };

    return (
        <Page>
            <div className="px-32 mt-8 flex flex-col gap-8">
                <SearchHeader
                    value={instruction}
                    onChange={setInstruction}
                    onSearch={handleSearch}
                />
                {loading && (
                    <div className="w-full min-h-80 flex items-center justify-center">
                        Loading...
                    </div>
                )}
                {error && (
                    <div className="w-full min-h-80 flex items-center justify-center text-red-500">
                        {error}
                    </div>
                )}
                {result && result.name && (
                    <div className="border border-blue-300 rounded p-4">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <span className="text-gray-800 font-semibold text-lg">Program Address:</span>
                                <div className="flex flex-col gap-1">
                                    {result.program_addresses?.map((address, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <span className="text-gray-700 text-sm">
                                                {address}
                                            </span>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => handleCopy(address)}
                                                    className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                                                    title="Copy to clipboard"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        className="text-gray-500"
                                                    >
                                                        <rect x="8" y="8" width="12" height="12" rx="2" ry="2" />
                                                        <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
                                                    </svg>
                                                </button>
                                                {copiedText === address && (
                                                    <span style={{ color: "green" }} className="text-sm transition-opacity duration-200">
                                                        Copied!
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-800 font-semibold text-lg">Instruction Name:</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-700 text-lg">
                                        {result.name}
                                    </span>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => handleCopy(result.name)}
                                            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                                            title="Copy to clipboard"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                className="text-gray-500"
                                            >
                                                <rect x="8" y="8" width="12" height="12" rx="2" ry="2" />
                                                <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
                                            </svg>
                                        </button>
                                        {copiedText === result.name && (
                                            <span style={{ color: "green" }} className="text-sm transition-opacity duration-200">
                                                Copied!
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Page>
    );
}

export default InstructionName;
