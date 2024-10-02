import Head from "next/head";
import Image from "next/image";
import Footer from "../components/footer";
import { FiCheck, FiChevronRight, FiLoader } from "react-fi";
import { useState } from "react";
import Modal from "../components/modal";
import {} from "react-code-blocks/dist";
import Page from "../components/Page";
import CodeBlock from "../components/CodeBlock";

const UploadButton = ({ onChange }) => (
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
            <svg
                class="h-8 w-8 text-red-500"
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
            Upload IDL
        </label>
    </div>
);

const UploadForm = ({ onSubmit, onChange }) => {
    return (
        <form
            onSubmit={onSubmit}
            className="flex flex-col items-center border border-[#CCD8FF] p-10 py-20 w-full bg-[#F6F8FF] rounded-lg gap-4"
        >
            <div className="grow text-[#657082]">
                Search for you favourite dApps, get verified discriminators,{" "}
                <br />
                input account mappings, fully functional parsers
            </div>
            <UploadButton onChange={onChange} />
        </form>
    );
};

export default function Home(props) {
    const [modalConfig, setModalConfig] = useState({ show: false });
    const [dappDetailsInProgress, setDappDetailsInProgress] = useState(false);
    const [dappDetails, setDappDetails] = useState(null);
    const [verified, setVerified] = useState(false);

    function sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    const onMediaFileChange = async (event) => {
        setVerified(false);
        let files = event.target.files;
        let file = files[0];
        const reader = new FileReader();

        reader.onload = async function (e) {
            try {
                const json = JSON.parse(e.target.result);
                const options = {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(json),
                };
                let response = await fetch("/api/parse-idl", options);
                let body = await response.json();
                setDappDetails(body);
            } catch (error) {
                console.log("error", error);
            }
        };
        reader.readAsText(file);
    };

    const handleSubmit = async (event) => {
        setVerified(false);
        event.preventDefault();
        if (dappDetailsInProgress) {
            return;
        }

        setDappDetailsInProgress(true);
        await sleep(1500);

        let elem = document.getElementById("dapp-address");
        let dappAddress = elem.value;

        const options = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ dapp_address: dappAddress }),
        };
        let response = await fetch("/api/fetch-parser", options);
        let body = await response.json();
        setDappDetails(body);
        setDappDetailsInProgress(false);
        setVerified(true);
    };

    return (
        <Page>
            <main className="flex items-center justify-center">
                <div className="flex flex-col min-w-full px-32 items-center mt-20">
                    <UploadForm
                        onChange={onMediaFileChange}
                        onSubmit={handleSubmit}
                    />

                    {!!dappDetails &&
                        !!dappDetails.instruction_discriminators && (
                            <>
                                <CodeBlock
                                    title="Instruction Discriminators"
                                    text={dappDetails.instruction_discriminators.join(
                                        "\n"
                                    )}
                                    verified={verified}
                                />
                            </>
                        )}

                    {!!dappDetails && !!dappDetails.event_discriminators && (
                        <>
                            <CodeBlock
                                title="Event Discriminators"
                                text={dappDetails.event_discriminators.join(
                                    "\n"
                                )}
                                verified={verified}
                            />
                        </>
                    )}

                    {!!dappDetails && !!dappDetails.input_account_mappings && (
                        <>
                            <CodeBlock
                                title="Input Account Mappings"
                                text={dappDetails.input_account_mappings.join(
                                    "\n"
                                )}
                                verified={verified}
                            />
                        </>
                    )}

                    {!!dappDetails && !!dappDetails.python_parser && (
                        <>
                            <CodeBlock
                                title="Python Parser"
                                text={dappDetails.python_parser}
                                verified={verified}
                            />
                        </>
                    )}
                </div>
                {modalConfig.show && <Modal modalConfig={modalConfig} />}
            </main>
            <div className="my-2"></div>
        </Page>
    );
}
