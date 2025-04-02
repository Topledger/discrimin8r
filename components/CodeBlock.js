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
        "w-full text-center text-[13px] px-4 h-[40px] flex items-center justify-center border rounded-b",
        verified ? "bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]" : "bg-[#F9FAFB] text-[#657082] border-[#E5E7EB]"
    );

    return (
        <div className={twMerge("w-full rounded overflow-hidden shadow-sm", styles.codeBlock)}>
            <div className="bg-[#F9FAFB] text-[13px] px-4 border border-[#E5E7EB] w-full text-[#576EB7] font-medium h-[40px] flex items-center justify-between">
                {title}
                {text && (
                    <button
                        onClick={handleCopy}
                        disabled={copied}
                        className={twMerge(
                            "font-normal inline-flex items-center gap-2 text-[#657082] hover:text-[#576EB7] transition-colors",
                            text ? "text-[#657082]" : "text-[#aaaaaa]"
                        )}
                    >
                        {!copied && (
                            <svg
                                className="h-4 w-4"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
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
                className="bg-white overflow-auto"
                customStyle={{
                    height: "30rem",
                    width: "w-full",
                    background: "#FFFFFF",
                    overflow: "auto",
                    fontSize: "13px",
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                    lineHeight: "1.6",
                    padding: "1rem 1.5rem",
                    tabSize: "4",
                }}
                theme={{
                    lineNumberColor: "#9CA3AF",
                    lineNumberBgColor: "#F9FAFB",
                    backgroundColor: "#FFFFFF",
                    textColor: "#1F2937",
                    substringColor: "#1F2937",
                    // Keywords and control structures
                    keywordColor: "#7C3AED", // Purple for keywords
                    builtInColor: "#7C3AED", // Purple for built-in functions
                    functionColor: "#2563EB", // Blue for function names
                    // Strings and literals
                    stringColor: "#059669", // Green for strings
                    literalColor: "#DC2626", // Red for literals
                    numberColor: "#DC2626", // Red for numbers
                    // Classes and types
                    classColor: "#2563EB", // Blue for class names
                    typeColor: "#2563EB", // Blue for type annotations
                    // Variables and parameters
                    variableColor: "#1F2937", // Dark gray for variables
                    parameterColor: "#1F2937", // Dark gray for parameters
                    // Decorators and attributes
                    decoratorColor: "#7C3AED", // Purple for decorators
                    attributeColor: "#059669",
                    // Comments and docstrings
                    commentColor: "#6B7280", // Gray for comments
                    docTagColor: "#059669", // Green for docstring tags
                    // Operators and symbols
                    operatorColor: "#1F2937", // Dark gray for operators
                    symbolColor: "#1F2937", // Dark gray for symbols
                    // Special elements
                    selectorTagColor: "#DC2626", // Red for HTML-like tags
                    selectorIdColor: "#2563EB", // Blue for IDs
                    selectorClassColor: "#059669", // Green for classes
                    // Additional elements
                    bulletColor: "#1F2937",
                    codeColor: "#1F2937",
                    additionColor: "#059669",
                    regexpColor: "#DC2626",
                    templateVariableColor: "#1F2937",
                    linkColor: "#1F2937",
                    selectorAttributeColor: "#1F2937",
                    selectorPseudoColor: "#1F2937",
                    quoteColor: "#1F2937",
                    templateTagColor: "#1F2937",
                    deletionColor: "#DC2626",
                    titleColor: "#1F2937",
                    sectionColor: "#1F2937",
                    metaKeywordColor: "#1F2937",
                    metaColor: "#1F2937",
                }}
            />
            <div className={footerClass}>
                {verified ? "Verified" : "Generated from IDL JSON"}
            </div>
        </div>
    );
};

export default CodeBlock;
