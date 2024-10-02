import React, { useState, useCallback } from "react";
import { twMerge } from "tailwind-merge";
import { CopyBlock } from "react-code-blocks";

import styles from "./CodeBlock.module.scss";
import useClipboard from "../hooks/useClipboard";

const CodeBlock = ({ title, text, verified }) => {
    const { copy } = useClipboard();
    const [copied, setCopied] = useState();

    const handleCopy = useCallback(() => {
        if (text) {
            copy(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
        }
    }, [copy, text]);

    const footerClass = twMerge(
        "w-full text-center border rounded-b text-[14px] px-2 h-[49px] flex items-center justify-center border-[#ddd]",
        verified ? "bg-[#D7FFEC] text-[#62B890] border-[#A8F1CF]" : "bg-lbt"
    );
    return (
        <div className={twMerge("m-4 w-full", styles.codeBlock)}>
            <div className="bg-[#d6e7ff] text-[14px] px-2 border border-[#CCD8FF] rounded-tl rounded-tr w-full text-[#576EB7] font-semibold h-[49px] flex items-center justify-between">
                {title}
                {text && (
                    <button
                        onClick={handleCopy}
                        disabled={copied}
                        className={twMerge(
                            "font-normal inline-flex items-center gap-1",
                            text ? "text-[#576EB7]" : "text-[#aaaaaa]"
                        )}
                    >
                        {!copied && (
                            <svg
                                class="h-2.5"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <rect
                                    x="9"
                                    y="9"
                                    width="13"
                                    height="13"
                                    rx="2"
                                    ry="2"
                                />
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                            </svg>
                        )}
                        {!copied ? "Copy" : "Copied"}
                    </button>
                )}
            </div>
            <CopyBlock
                text={text}
                language="python"
                showLineNumbers={true}
                wrapLongLines={false}
                className="bg-[#F6F8FF] overflow-auto"
                customStyle={{
                    height: "16.1rem",
                    width: "w-full",
                    background: "#F6F8FF",
                    overflow: "auto",
                }}
            />
            <div className={footerClass}>
                {verified ? "Verified" : "Generated from IDL JSON"}
            </div>
        </div>
    );
};

export default CodeBlock;
