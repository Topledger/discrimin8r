import React, { useState } from "react";
import Page from "../components/Page";

const VerifyForm = ({
    dappAddress,
    setDappAddress,
    blockSlot,
    setBlockSlot,
    onFileChange,
    onVerify,
}) => {
    return (
        <div className="flex flex-col space-y-4 bg-white p-6 rounded shadow">
            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Dapp Address
                </label>
                <input
                    type="text"
                    value={dappAddress}
                    onChange={(e) => setDappAddress(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            onVerify();
                        }
                    }}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-800"
                    placeholder="Enter dapp address"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Block Slot
                </label>
                <input
                    type="number"
                    value={blockSlot}
                    onChange={(e) => setBlockSlot(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            onVerify();
                        }
                    }}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-800"
                    placeholder="Enter block slot"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">
                    IDL File
                </label>
                <input
                    type="file"
                    accept=".json"
                    onChange={onFileChange}
                    className="mt-1 block w-full text-gray-800"
                />
            </div>
            <button
                onClick={onVerify}
                className="mt-4 px-4 py-2 bg-accent hover:opacity-90 text-white rounded"
            >
                Verify
            </button>
        </div>
    );
};

function VerifyIDL() {
    const [dappAddress, setDappAddress] = useState("");
    const [blockSlot, setBlockSlot] = useState("");
    const [idl, setIdl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const onFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
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

    const onVerify = async () => {
        // Ensure all fields are provided
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
                }),
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
        <Page>
            <div className="px-32 mt-8 flex flex-col gap-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Verify IDL</h1>
                    <p className="text-gray-600">
                        Validate an Anchor-based IDL file for a given program address and block slot
                    </p>
                </div>
                <VerifyForm
                    dappAddress={dappAddress}
                    setDappAddress={setDappAddress}
                    blockSlot={blockSlot}
                    setBlockSlot={setBlockSlot}
                    onFileChange={onFileChange}
                    onVerify={onVerify}
                />
                {loading && (
                    <div className="w-full flex items-center justify-center text-gray-700">
                        Verifying...
                    </div>
                )}
                {error && (
                    <div className="w-full flex items-center justify-center text-red-600">
                        {error}
                    </div>
                )}
                {result && (
                    <div className="border border-blue-300 rounded p-4">
                        {result.success ? (
                            <div>
                                <p className="text-gray-800 text-lg font-semibold">
                                    ✅ Verification Successful
                                </p>
                                <pre className="mt-2 text-sm text-gray-700 overflow-auto">
                                    {JSON.stringify(result.data, null, 2)}
                                </pre>
                            </div>
                        ) : (
                            <div>
                                <p className="text-red-600 text-lg font-semibold">
                                    ❌ Verification Failed
                                </p>
                                <p className="mt-2 text-sm text-red-500">{result.error}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Page>
    );
}

export default VerifyIDL;
