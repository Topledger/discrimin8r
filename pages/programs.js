import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import Page from "../components/Page";
import CodeBlock from "../components/CodeBlock";
import { twMerge } from "tailwind-merge";

const PROGRAM_LIST = [
    {
        name: "metaplex",
        displayName: "Metaplex",
        address: "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s",
    },
    {
        name: "metaplex",
        displayName: "Metaplex",
        address: "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s",
    },
    {
        name: "metaplex",
        displayName: "Manish",
        address: "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s",
    },
];

const SearchInput = ({ placeholder, onChange, value }) => (
    <span className="inline-flex h-[40px] p-2.5 bg-white items-center gap-1 rounded">
        <svg
            class="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
        </svg>

        <input
            className="h-6 outline-transparent min-w-56"
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
        />
    </span>
);

const SearchHeader = ({ selectedProgram, onChange, onReset }) => {
    return (
        <div className="flex justify-between border-b border-[#C3CFFF] py-4 min-h-20">
            <div
                className={twMerge(
                    "flex flex-col gap-1 text-[18px] text-[#374151]",
                    selectedProgram ? "font-bold" : ""
                )}
            >
                <span>
                    <span
                        onClick={onReset}
                        className={selectedProgram ? "cursor-pointer" : ""}
                    >
                        Solana programs
                    </span>
                    {selectedProgram ? (
                        <>
                            {" / "}
                            <span className="font-normal">
                                {selectedProgram.displayName}
                            </span>
                        </>
                    ) : (
                        ""
                    )}
                </span>
                {!selectedProgram && (
                    <span className="text-[12px] text-[#4F5A6C]">
                        Search for your favourite dApps
                    </span>
                )}
            </div>
            {!selectedProgram && (
                <SearchInput
                    placeholder="Search by name or address"
                    onChange={onChange}
                />
            )}
        </div>
    );
};

function Programs() {
    const [selectedProgram, setSelectedProgram] = useState();
    const [searchText, setSearchText] = useState("");
    const { data: dappDetails } = useQuery({
        queryKey: ["ProgramData", selectedProgram?.address],
        queryFn: () => {
            return fetch("/api/fetch-parser", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ dapp_address: selectedProgram.address }),
            }).then((res) => res.json());
        },
        enabled: !!selectedProgram?.address,
    });

    const search = (program) => {
        if (!searchText || searchText?.length < 2) return true;

        return (
            program.displayName.toLowerCase().includes(searchText) ||
            program.address.toLowerCase().includes(searchText)
        );
    };

    return (
        <Page>
            <div className="px-32 mt-20">
                <SearchHeader
                    selectedProgram={selectedProgram}
                    onChange={setSearchText}
                    onReset={() => setSelectedProgram(null)}
                />
                {!selectedProgram && (
                    <ul className="list-none mt-5 flex flex-col gap-4">
                        {PROGRAM_LIST.filter(search).map((program) => (
                            <li
                                onClick={() => setSelectedProgram(program)}
                                className="cursor-pointer"
                            >
                                <div className="border-2 border-[#C2C2FF] py-5 px-8 rounded flex flex-col gap-1">
                                    <span className="text-[#374151] text-[18px] font-semibold">
                                        {program.displayName}
                                    </span>
                                    <span className="text-[#4F5A6C] text-[14px]">
                                        {program.address}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
                {selectedProgram && (
                    <>
                        {!!dappDetails &&
                            !!dappDetails.instruction_discriminators && (
                                <>
                                    <CodeBlock
                                        title="Instruction Discriminators"
                                        text={dappDetails.instruction_discriminators.join(
                                            "\n"
                                        )}
                                        verified={true}
                                    />
                                </>
                            )}

                        {!!dappDetails &&
                            !!dappDetails.event_discriminators && (
                                <>
                                    <CodeBlock
                                        title="Event Discriminators"
                                        text={dappDetails.event_discriminators.join(
                                            "\n"
                                        )}
                                        verified={true}
                                    />
                                </>
                            )}

                        {!!dappDetails &&
                            !!dappDetails.input_account_mappings && (
                                <>
                                    <CodeBlock
                                        title="Input Account Mappings"
                                        text={dappDetails.input_account_mappings.join(
                                            "\n"
                                        )}
                                        verified={true}
                                    />
                                </>
                            )}

                        {!!dappDetails && !!dappDetails.python_parser && (
                            <>
                                <CodeBlock
                                    title="Python Parser"
                                    text={dappDetails.python_parser}
                                    verified={true}
                                />
                            </>
                        )}
                    </>
                )}
            </div>
        </Page>
    );
}

export default Programs;
