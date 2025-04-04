import React, { useState } from "react";
import Page from "../components/Page";
import useStore from "../store"; // Import the Zustand store

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

    // Global state from Zustand
    const instruction = useStore((state) => state.discriminatorInput);
    const setInstruction = useStore((state) => state.setDiscriminatorInput);
    const result = useStore((state) => state.discriminatorResult);
    const setResult = useStore((state) => state.setDiscriminatorResult);

    const handleSearch = async () => {
        if (instruction.length < 2) return;
        setLoading(true);
        setError(null);
        setResult(null); // Clear previous result from the store
        try {
            const res = await fetch("https://apis.topledger.xyz/api/discriminator", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ix_name: instruction })
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Network response was not ok");
            }
            setResult(data); // Set result in the store
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
        <Page title="Instruction Discriminator" subtitle="Get the byte array of the discriminator for an Instruction">
            <div className="flex flex-col items-center gap-10 w-full mt-12">
                <SearchHeader
                    value={instruction} // Read from store
                    onChange={setInstruction} // Write to store
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
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-lg">{error}</span>
                        </div>
                    </div>
                )}
                {result && result.discriminator && (
                    <div className="w-full max-w-2xl border border-[#CCD8FF] rounded p-8 bg-[#F6F8FF] shadow-sm">
                        <div className="flex flex-col gap-8">
                            <div className="flex flex-col gap-2">
                                <span className="text-[#657082] font-medium text-sm">Discriminator</span>
                                <div className="flex items-center gap-2 bg-white border border-[#CCD8FF] px-4 py-3 rounded shadow-sm">
                                    <span className="text-[#657082] text-sm font-medium flex-1 tracking-wide">
                                        {result.discriminator}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleCopy(result.discriminator)}
                                            className="p-2 hover:bg-[#EAEFFF] rounded transition-colors"
                                            title="Copy to clipboard"
                                            aria-label="Copy discriminator"
                                        >
                                            {copiedText === result.discriminator ? (
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
                    </div>
                )}
            </div>
        </Page>
    );
}

export default InstructionDiscriminator;
