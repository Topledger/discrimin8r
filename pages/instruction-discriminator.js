import React, { useState } from "react";
import Page from "../components/Page";

const SearchHeader = ({ value, onChange, onSearch }) => {
    return (
        <div className="flex justify-between items-center border-b border-blue-200 py-4 min-h-20">
            <div className="flex flex-col gap-1">
                <span className="text-xl font-semibold text-gray-800">Instruction Discriminator</span>
                <span className="text-sm text-gray-500">
                    Get bytes array of discriminator for a Instruction Name
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

function InstructionDiscriminator() {
    const [instruction, setInstruction] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

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
            if (!res.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await res.json();
            setResult(data);
        } catch (err) {
            setError("Error loading data");
        }
        setLoading(false);
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
                    <div className="w-full min-h-80 flex items-center justify-center">
                        {error}
                    </div>
                )}
                {result && result.discriminator && (
                    <div className="border border-blue-300 rounded p-4">
                        <p className="text-gray-800 text-lg font-semibold">
                            {result.discriminator}
                        </p>
                    </div>
                )}
            </div>
        </Page>
    );
}

export default InstructionDiscriminator;
