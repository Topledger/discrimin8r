import { useState, useRef, useEffect, useCallback } from "react";
import Modal from "../components/modal";
import { } from "react-code-blocks/dist";
import Page from "../components/Page";
import CodeBlock from "../components/CodeBlock";

const UploadButton = ({ onChange, isLoading }) => (
    <div className="">
        <input
            id="idl-file"
            type="file"
            name="media_file"
            onChange={(event) => onChange(event)}
            accept="application/json"
            className="hidden"
        />
        <label
            htmlFor="idl-file"
            className="mr-2 text-ltp cursor-pointer flex items-center gap-4 bg-[#EAEFFF] border border-[#CCD8FF] rounded-lg p-4 px-6"
        >
            {isLoading ? (
                <svg
                    className="h-6 w-6 text-[#888] animate-[spin_2s_linear_infinite]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
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
            ) : (
                <svg
                    className="h-8 w-8 text-red-500"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path stroke="none" d="M0 0h24v24H0z" />
                    <path d="M7 18a4.6 4.4 0 0 1 0 -9h0a5 4.5 0 0 1 11 2h1a3.5 3.5 0 0 1 0 7h-1" />
                    <polyline points="9 15 12 12 15 15" />
                    <line x1="12" y1="12" x2="12" y2="21" />
                </svg>
            )}
            Upload IDL
        </label>
    </div>
);

const UploadForm = ({ onChange, isLoading }) => {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

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
            onChange({ target: { files: [file] } });
        }
    }, [onChange]);

    const handleClick = useCallback((e) => {
        // Prevent click if clicking on the file input
        if (e.target === fileInputRef.current) {
            return;
        }
        fileInputRef.current?.click();
    }, []);

    const handleFileChange = useCallback((e) => {
        const file = e.target.files[0];
        if (file && file.type === "application/json") {
            onChange(e);
        }
    }, [onChange]);

    return (
        <form
            className={`relative flex flex-col items-center border-2 border-dashed rounded transition-all duration-200 p-10 py-20 w-full gap-4 cursor-pointer ${isDragging ? "border-[#576EB7] bg-[#F6F8FF]" : "border-[#CCD8FF] bg-[#F6F8FF]"
                }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
        >
            <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                aria-label="IDL file input"
            />
            <div className="flex flex-col items-center justify-center">
                {isLoading ? (
                    <svg
                        className="w-12 h-12 mb-4 text-[#576EB7] animate-[spin_2s_linear_infinite]"
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
                ) : (
                    <svg
                        className={`w-12 h-12 mb-4 ${isDragging ? "text-[#576EB7]" : "text-[#657082]"}`}
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
                )}
                <div className="text-center">
                    <p className="text-lg font-medium text-[#657082]">
                        {isLoading ? "Processing..." : "Drag and drop your IDL file here"}
                    </p>
                    <p className="text-sm text-[#657082] mt-1">
                        or click to browse files
                    </p>
                </div>
            </div>
        </form>
    );
};

export default function Home(props) {
    const [modalConfig, setModalConfig] = useState({ show: false });
    const [dappDetailsInProgress, setDappDetailsInProgress] = useState(false);
    const [dappDetails, setDappDetails] = useState(null);
    const [verified, setVerified] = useState(false);
    const resultRef = useRef(null);

    useEffect(() => {
        if (dappDetails?.python_parser && resultRef.current && !dappDetailsInProgress) {
            setTimeout(() => {
                resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    }, [dappDetails, dappDetailsInProgress]);

    const onMediaFileChange = async (event) => {
        setVerified(false);
        let files = event.target.files;
        let file = files[0];
        const reader = new FileReader();
        reader.onload = async function (e) {
            try {
                setDappDetailsInProgress(true);
                const json = JSON.parse(e.target.result);
                const options = {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(json),
                };
                let response = await fetch("https://apis.topledger.xyz/api/parse-idl", options);
                let body = await response.json();
                setDappDetails(body);
                setDappDetailsInProgress(false);
            } catch (error) {
                console.log("error", error);
                setDappDetailsInProgress(false);
            }
        };
        reader.readAsText(file);
    };

    return (
        <Page title="Upload IDL" subtitle="Upload the Anchor IDL to get fully functional python parser">
            <div className="flex flex-col items-center gap-10 w-full">
                <UploadForm
                    onChange={onMediaFileChange}
                    isLoading={dappDetailsInProgress}
                />
                {!!dappDetails && !!dappDetails.python_parser && (
                    <div ref={resultRef} className="w-full">
                        <CodeBlock
                            title="Python Parser"
                            text={dappDetails.python_parser}
                            verified={verified}
                        />
                    </div>
                )}
            </div>
            {modalConfig.show && <Modal modalConfig={modalConfig} />}
        </Page>
    );
}
