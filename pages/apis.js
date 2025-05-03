import React, { useState } from "react";
import Page from "../components/Page";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-python";

const API_KEY = "AAbhjhhssygvsdgavbjh";
const API_LIST = [
    {
        name: "Get Instruction Name",
        endpoint: "/api/instruction",
        baseUrl: "https://apis.topledger.xyz",
        description: "Get human readable name of Instruction from a base58 encoded instruction string.",
        longDescription: "This endpoint allows you to decode a base58 encoded instruction string and retrieve its human-readable name. Useful for debugging, analytics, and program inspection.",
        responseExample: `{
  "ix_name": "InstantCreateTpsl"
}`,
        samples: {
            curl: `curl --location --request POST 'https://apis.topledger.xyz/api/instruction' \
-H 'Content-Type: application/json' \
--data-raw '{"base58_ix_data":"2StQVACzTWUPEccroZ9Th44KySzoYpvqqeEfcxJk2WpR93ezcQjgLUMhnHfKHa7Yo1vKy"}'`,
            python: `import requests\n\nresponse = requests.post(\n    'https://apis.topledger.xyz/api/instruction',\n    headers={'Content-Type': 'application/json'},\n    json={\n        'base58_ix_data': '2StQVACzTWUPEccroZ9Th44KySzoYpvqqeEfcxJk2WpR93ezcQjgLUMhnHfKHa7Yo1vKy'\n    }\n)\ndata = response.json()`,
            js: `const response = await fetch('https://apis.topledger.xyz/api/instruction', {\n    method: 'POST',\n    headers: {\n        'Content-Type': 'application/json'\n    },\n    body: JSON.stringify({\n        base58_ix_data: '2StQVACzTWUPEccroZ9Th44KySzoYpvqqeEfcxJk2WpR93ezcQjgLUMhnHfKHa7Yo1vKy'\n    })\n});\nconst data = await response.json();`
        }
    },
    {
        name: "Get Instruction Discriminator",
        endpoint: "/api/discriminator",
        baseUrl: "https://apis.topledger.xyz",
        description: "Get bytes array of discriminator for an Instruction Name.",
        longDescription: "This endpoint returns the 8-byte discriminator for a specified instruction name, along with a list of the IDLs and their associated program addresses where that instruction is defined.",
        responseExample: `{
  "discriminator": [117, 98, 66, 127, 30, 50, 73, 185],
  "mapping_results": [
    {
      "program_address": "SomeProgramAddress11111111111111111111111111111111",
      "idl_json": { /* ...IDL JSON... */ }
    },
    {
      "program_address": "AnotherProgramAddress22222222222222222222222222222222",
      "idl_json": { /* ...IDL JSON... */ }
    }
  ]
}`,
        samples: {
            curl: `curl --location --request POST 'https://apis.topledger.xyz/api/discriminator' \
-H 'Content-Type: application/json' \
--data-raw '{"ix_name":"InstantCreateTpsl"}'`,
            python: `import requests\n\nresponse = requests.post(\n    'https://apis.topledger.xyz/api/discriminator',\n    headers={'Content-Type': 'application/json'},\n    json={\n        'ix_name': 'InstantCreateTpsl'\n    }\n)\ndata = response.json()`,
            js: `const response = await fetch('https://apis.topledger.xyz/api/discriminator', {\n    method: 'POST',\n    headers: {\n        'Content-Type': 'application/json'\n    },\n    body: JSON.stringify({\n        ix_name: 'InstantCreateTpsl'\n    })\n});\nconst data = await response.json();`
        }
    },
    {
        name: "Verify IDL",
        endpoint: "/api/verify-idl",
        baseUrl: "https://apis.topledger.xyz",
        description: "Validate any IDL file for a given dapp_address & a block_slot number.",
        longDescription: "This endpoint lets you validate an Interface Definition Language (IDL) file for a specific dapp address and block slot. It helps ensure your IDL matches the deployed program and can be used for verification and auditing.",
        responseExample: `{
  "success": true,
  "error": null,
  "data": [ ... ]
}`,
        samples: {
            curl: `curl --location --request POST 'https://apis.topledger.xyz/api/verify-idl' \
-H 'Content-Type: application/json' \
--data-raw '{"dapp_address":"PERPHjGBqRHArX4DySjwM6UJHiR3sWAatqfdBS2qQJu","block_slot":328410405,"idl":{...}}'`,
            python: `import requests\n\nresponse = requests.post(\n    'https://apis.topledger.xyz/api/verify-idl',\n    headers={'Content-Type': 'application/json'},\n    json={\n        'dapp_address': 'PERPHjGBqRHArX4DySjwM6UJHiR3sWAatqfdBS2qQJu',\n        'block_slot': 328410405,\n        'idl': { ... }\n    }\n)\ndata = response.json()`,
            js: `const response = await fetch('https://apis.topledger.xyz/api/verify-idl', {\n    method: 'POST',\n    headers: {\n        'Content-Type': 'application/json'\n    },\n    body: JSON.stringify({\n        dapp_address: 'PERPHjGBqRHArX4DySjwM6UJHiR3sWAatqfdBS2qQJu',\n        block_slot: 328410405,\n        idl: { ... }\n    })\n});\nconst data = await response.json();`
        }
    },
];

function CopyEndpointModal({ open, onClose, api, onCopy, copied }) {
    if (!open || !api) return null;
    const https = `${api.baseUrl}${api.endpoint}`;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20">
            <div className="bg-white border border-[#CCD8FF] rounded p-8 w-full max-w-lg shadow-sm relative">
                <button
                    className="absolute top-4 right-4 bg-[#F6F8FF] border border-[#CCD8FF] rounded p-2 hover:bg-[#EAEFFF]"
                    onClick={onClose}
                    aria-label="Close"
                >
                    <svg width="20" height="20" fill="none" stroke="#657082" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M6 18L18 6" /></svg>
                </button>
                <h2 className="text-lg font-medium text-[#576EB7] mb-8">Copy endpoint</h2>
                <div className="mb-6">
                    <div className="text-[#657082] font-medium text-sm mb-2">HTTPS Endpoint</div>
                    <div className="flex items-center gap-2 bg-white border border-[#CCD8FF] px-4 py-3 rounded shadow-sm">
                        <span className="flex-1 text-[#657082] text-sm font-medium tracking-wide font-mono">
                            {https}
                        </span>
                        <button onClick={() => onCopy(https)} className="p-2 hover:bg-[#EAEFFF] rounded transition-colors" title="Copy HTTPS endpoint">
                            {copied === https ? (
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
    );
}

function ApiInfoModal({ open, onClose, api, tab, setTab, onCopy, copied }) {
    if (!open || !api) return null;
    const tabList = [
        { key: 'curl', label: 'cURL' },
        { key: 'python', label: 'Python' },
        { key: 'js', label: 'JavaScript' }
    ];
    const getHighlighted = (code, lang) => {
        if (typeof window !== 'undefined' && Prism.languages[lang]) {
            return Prism.highlight(code, Prism.languages[lang], lang);
        }
        return code;
    };
    const langMap = { curl: 'bash', python: 'python', js: 'javascript' };
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20">
            <div className="bg-white border border-[#CCD8FF] rounded p-8 w-full max-w-lg shadow-sm relative">
                <button
                    className="absolute top-4 right-4 bg-[#F6F8FF] border border-[#CCD8FF] rounded p-2 hover:bg-[#EAEFFF]"
                    onClick={onClose}
                    aria-label="Close"
                >
                    <svg width="20" height="20" fill="none" stroke="#657082" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M6 18L18 6" /></svg>
                </button>
                <h2 className="text-lg font-medium text-[#576EB7] mb-4">{api.name}</h2>
                <div className="text-[#657082] text-[14px] mb-4">{api.longDescription}</div>
                <div className="rounded-[8px] overflow-hidden bg-[#23272F] mt-2">
                    <div className="px-4 pt-2 bg-[#23272F]">
                        <div className="flex items-center gap-4 mb-1">
                            {tabList.map(t => (
                                <button
                                    key={t.key}
                                    onClick={() => setTab(t.key)}
                                    className={`px-0 py-0 font-mono text-xs focus:outline-none transition-all border-none shadow-none bg-transparent ${tab === t.key ? 'text-[#6DD6A7] font-bold' : 'text-[#A3AED0]'}`}
                                    style={{ borderRadius: 0 }}
                                >
                                    {t.label}
                                </button>
                            ))}
                            <button onClick={() => onCopy(api.samples[tab])} className="ml-auto p-2 hover:bg-[#353945] rounded transition-colors" title="Copy code sample">
                                {copied === api.samples[tab] ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="#6DD6A7"
                                        className="text-[#6DD6A7]"
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
                                        stroke="#657082"
                                        className="text-[#657082]"
                                    >
                                        <rect x="8" y="8" width="12" height="12" rx="2" ry="2" />
                                        <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        <div className="border-b border-[#353945] w-full mb-4" />
                    </div>
                    <div className="px-6 pb-6 bg-[#23272F]">
                        <div className="flex items-start gap-2 h-[220px] min-h-[240px]">
                            <pre className={`flex-1 text-xs font-mono whitespace-pre-wrap break-all bg-transparent text-[#f8f8f2] overflow-auto h-full ${tab === 'curl' || tab === 'python' ? 'leading-6' : ''}`} style={tab === 'curl' || tab === 'python' ? { margin: 0, lineHeight: '1.6' } : { margin: 0 }}>
                                <code dangerouslySetInnerHTML={{ __html: getHighlighted(api.samples[tab], langMap[tab]) }} />
                            </pre>
                        </div>
                    </div>
                </div>
                {/* Response label and container below codeblock */}
                <div className="mt-4 px-0">
                    <div className="text-[#A3AED0] text-sm mb-2 font-medium">Response</div>
                    <div className="rounded-[8px] overflow-hidden bg-[#23272F]">
                        <div className="px-6 pb-6 pt-4 bg-[#23272F] h-[120px] min-h-[120px]">
                            <pre className="minimal-scrollbar text-xs font-mono text-[#f8f8f2] whitespace-pre-wrap break-all bg-transparent m-0 leading-6 h-full overflow-auto">{api.responseExample}</pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function APIs() {
    const [search, setSearch] = useState("");
    const [copied, setCopied] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedApi, setSelectedApi] = useState(null);
    const [infoModalOpen, setInfoModalOpen] = useState(false);
    const [infoApi, setInfoApi] = useState(null);
    const [tab, setTab] = useState('python');
    const filtered = API_LIST.filter(api => api.name.toLowerCase().includes(search.toLowerCase()));

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(text);
        setTimeout(() => setCopied(null), 1000);
    };

    const openModal = (api) => {
        setSelectedApi(api);
        setModalOpen(true);
    };

    const openInfoModal = (api) => {
        setInfoApi(api);
        setTab('python');
        setInfoModalOpen(true);
    };

    return (
        <Page title="Access Discriminator using API end points" subtitle="Explore, test and integrate discriminator with your Solana programs or DAPPs using our open source and maintained APIs" >
            <div className="w-full p-0">
                {/* API Cards */}
                <div className="px-0 pb-0 pt-2">
                    <div className="flex flex-col gap-5">
                        {filtered.map(api => (
                            <div key={api.endpoint} className="flex items-center justify-between border border-[#CCD8FF] bg-white rounded-[8px] px-6 py-5 shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className="bg-[#F6F8FF] rounded-full p-2 border border-[#CCD8FF]">
                                        <svg className="w-6 h-6 text-[#576EB7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-[#2B3674] font-semibold text-base mb-1">{api.name}</div>
                                        <div className="text-[#657082] text-sm font-normal">{api.description}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {/* Document icon */}
                                    <button onClick={() => openInfoModal(api)} className="p-0 m-0 bg-transparent border-none hover:bg-transparent focus:outline-none" title="API Info">
                                        <svg className="w-5 h-5 text-[#576EB7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 3h6a2 2 0 012 2v2m0 0V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15h6M9 11h6" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => openModal(api)}
                                        className="flex items-center gap-2 border border-[#D3D7EC] text-[#576EB7] px-4 py-2 rounded-[8px] font-medium text-sm hover:bg-[#EAEFFF] transition"
                                    >
                                        Copy endpoint
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <CopyEndpointModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    api={selectedApi}
                    onCopy={handleCopy}
                    copied={copied}
                />
                <ApiInfoModal
                    open={infoModalOpen}
                    onClose={() => setInfoModalOpen(false)}
                    api={infoApi}
                    tab={tab}
                    setTab={setTab}
                    onCopy={handleCopy}
                    copied={copied}
                />
            </div>
        </Page>
    );
}

export default APIs; 