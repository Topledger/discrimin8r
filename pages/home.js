import Head from "next/head";
import Image from "next/image";
import Footer from "../components/footer";
import {FiCheck, FiChevronRight, FiLoader} from "react-fi";
import {useState} from "react";
import Modal from "../components/modal";
import {CopyBlock} from 'react-code-blocks';

export default function Home(props) {
    const baseURL = "http://localhost:8081";
    const [modalConfig, setModalConfig] = useState({show: false});
    const [dappDetailsInProgress, setDappDetailsInProgress] = useState(false);
    const [dappDetails, setDappDetails] = useState(null);
    const [verified, setVerified] = useState(false);

    const renderCodeBlock = (title, text) => {
        return (<div className="m-4">
            <div className="bg-[#d6e7ff] text-xl mb-1 px-2 rounded w-fit">
                {title}
            </div>
            <CopyBlock
                text={text}
                language="python"
                showLineNumbers={true}
                wrapLongLines={false}
                customStyle={{
                    height: '16.1rem',
                    width: '50vw',
                    overflow: 'scroll',
                    border: '1px solid #0000001a',
                    background: 'white'
                }}/>
            {verified && <div className="w-full text-center border-lbr mb-1 border-b border-l border-r rounded-b text-xs bg-bgsuccess text-success px-2">Verified</div>}
            {!verified &&
                <div className="w-full text-center border-lbr mb-1 border-b border-l border-r rounded-b text-xs bg-lbt px-2">Generated from IDL JSON</div>}
        </div>);
    }

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
                    method: "POST", headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(json),
                };
                let response = await fetch(`${baseURL}/parse-idl`, options);
                let body = await response.json();
                setDappDetails(body);
            } catch (error) {
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
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({dapp_address: dappAddress})
        };
        let response = await fetch(`${baseURL}/fetch-parser`, options);
        let body = await response.json();
        setDappDetails(body);
        setDappDetailsInProgress(false);
        setVerified(true);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gratify">
            <Head>
                <title>discrimin8r</title>
            </Head>

            <div className="mt-4 flex">
                <div className="grow"></div>
                <Image
                    src="./images/topledger-full.svg"
                    width={0}
                    height={0}
                    priority
                    className="w-36 h-auto mb-10"
                    alt="Topledger"
                />
                <div className="grow"></div>
            </div>

            <main className="grow flex items-center justify-center">
                <div
                    className="mt-8 px-8 pt-8 pb-4 w-[80vw] md:p-16 pb-16 rounded bg-lbp dark:bg-dbp flex flex-col items-center shadow-md">
                    <h1 className="font-bold text-2xl md:text-4xl mb-8">
                        discrimin🎱r
                    </h1>
                    <div className="text-lg mt-2 mb-8">Search for you favourite dApps, get verified discriminators,
                        input account mappings, fully functional parsers in just a click!
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="mt-8 py-2 h-8 flex items-center justify-center rounded w-full">
                        <div className="grow"></div>
                        <div className="rounded flex flex-col">
                            <input
                                id="idl-file"
                                type="file"
                                name="media_file"
                                onChange={(event) => onMediaFileChange(event)}
                                accept="application/json"
                                className="hidden"
                            />
                            <label htmlFor="idl-file"
                                   className="mr-2 py-1 px-4 rounded-full bg-dtp border border-lbr text-ltp cursor-pointer">
                                Upload your IDL
                            </label>
                        </div>
                        <div className="grow"></div>
                    </form>
                    <div className="mt-8">OR</div>
                    <form
                        onSubmit={handleSubmit}
                        className="mt-8 py-2 h-8 flex items-center justify-center rounded w-1/2">
                        <input id="dapp-address" type="text" required
                               className="w-full h-10 border border-lbr pl-4 pr-2 rounded"
                               placeholder="dApp - metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"/>
                        <div className="grow"></div>
                        <button type="submit"
                                className="ml-2 w-1/4 h-10 text-lts font-bold bg-lbs border border-lbr rounded cursor-pointer hover:bg-lbt flex">
                            {dappDetailsInProgress && <FiLoader size="1rem" className="m-auto animate-spin"/>}
                            {!dappDetailsInProgress && <FiChevronRight size="1.5rem" className="m-auto"/>}
                        </button>
                    </form>

                    <br/>
                    <br/>

                    {!!dappDetails && !!dappDetails.instruction_discriminators && <>
                        {renderCodeBlock('Instruction Discriminators', dappDetails.instruction_discriminators.join("\n"))}
                    </>}

                    {!!dappDetails && !!dappDetails.event_discriminators && <>
                        {renderCodeBlock('Event Discriminators', dappDetails.event_discriminators.join("\n"))}
                    </>}

                    {!!dappDetails && !!dappDetails.input_account_mappings && <>
                        {renderCodeBlock('Input Account Mappings', dappDetails.input_account_mappings.join("\n"))}
                    </>}

                    {!!dappDetails && !!dappDetails.python_parser && <>
                        {renderCodeBlock('Python Parser', dappDetails.python_parser)}
                    </>}
                </div>
                {modalConfig.show && <Modal modalConfig={modalConfig}/>}
            </main>
            <div className="my-2"></div>
            <Footer/>
        </div>
    );
}
