import React, { useState, useCallback } from "react";
import { twMerge } from "tailwind-merge";
import dynamic from 'next/dynamic'; // Import dynamic from Next.js

// Import CodeMirror components *statically* for type checking/intellisense (optional but good practice)
// But we will load the component itself dynamically
// import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { EditorView, lineNumbers } from '@codemirror/view';
import { foldGutter } from "@codemirror/language";
import { tags } from '@lezer/highlight';
import { createTheme } from '@uiw/codemirror-themes';

import styles from "./CodeBlock.module.scss";
import useClipboard from "../hooks/useClipboard";

// Dynamically import ReactJson with no SSR
const ReactJson = dynamic(() => import('react-json-view'), { ssr: false });

// Dynamically import CodeMirror with no SSR
const DynamicCodeMirror = dynamic(
    () => import('@uiw/react-codemirror').then(mod => mod.default),
    { ssr: false }
);

// Define a custom light theme for CodeMirror to match the UI
const myTheme = createTheme({
    theme: 'light',
    settings: {
        background: '#FFFFFF',
        foreground: '#1F2937',
        caret: '#1F2937',
        selection: '#E5E7EB',
        selectionMatch: '#D1D5DB',
        lineHighlight: '#F9FAFB', // Highlight for active line
        gutterBackground: '#F9FAFB', // Line number background
        gutterForeground: '#9CA3AF', // Line number color
        gutterBorder: '#E5E7EB', // Separator line
    },
    styles: [
        // Match colors similar to the previous theme
        { tag: tags.keyword, color: '#7C3AED' },
        { tag: tags.comment, color: '#6B7280', fontStyle: 'italic' },
        { tag: [tags.name, tags.deleted, tags.character, tags.propertyName, tags.macroName], color: '#1F2937' },
        { tag: [tags.function(tags.variableName), tags.labelName], color: '#2563EB' },
        { tag: [tags.color, tags.constant(tags.name), tags.standard(tags.name)], color: '#1F2937' },
        { tag: [tags.definition(tags.name), tags.separator], color: '#1F2937' },
        { tag: [tags.typeName, tags.className, tags.number, tags.changed, tags.annotation, tags.modifier, tags.self, tags.namespace], color: '#DC2626' },
        { tag: [tags.operator, tags.operatorKeyword, tags.url, tags.escape, tags.regexp, tags.link, tags.special(tags.string)], color: '#7C3AED' },
        { tag: [tags.meta, tags.comment], color: '#6B7280' },
        { tag: tags.strong, fontWeight: 'bold' },
        { tag: tags.emphasis, fontStyle: 'italic' },
        { tag: tags.strikethrough, textDecoration: 'line-through' },
        { tag: tags.link, color: '#6B7280', textDecoration: 'underline' },
        { tag: tags.heading, fontWeight: 'bold', color: '#1F2937' },
        { tag: [tags.atom, tags.bool, tags.special(tags.variableName)], color: '#1F2937' },
        { tag: [tags.processingInstruction, tags.string, tags.inserted], color: '#059669' },
        { tag: tags.invalid, color: '#DC2626' },
    ],
});

const CodeBlock = ({ title, text, verified, isJson = false, isPythonParser = false }) => {
    const { copy } = useClipboard();
    const [copied, setCopied] = useState(false);

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
        <div className={twMerge("w-full rounded border border-[#E5E7EB] overflow-hidden shadow-sm", styles.codeBlock)}>
            <div className="bg-[#F9FAFB] text-[13px] px-4 border-b border-[#E5E7EB] w-full text-[#576EB7] font-medium h-[40px] flex items-center justify-between">
                {title}
                {text && (
                    <button
                        onClick={handleCopy}
                        disabled={copied}
                        className={twMerge(
                            "font-normal inline-flex items-center gap-2 text-[#657082] hover:text-[#576EB7] transition-colors",
                            copied ? "text-[#059669]" : "text-[#657082]"
                        )}
                    >
                        {!copied ? (
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
                        ) : (
                            <svg className="h-4 w-4 text-[#059669]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                        {!copied ? "Copy" : "Copied"}
                    </button>
                )}
            </div>
            {isJson ? (
                <div className="bg-white p-4 max-h-[30rem] overflow-auto">
                    <ReactJson
                        src={typeof text === 'string' ? JSON.parse(text) : text}
                        theme="rjv-default"
                        collapsed={2}
                        enableClipboard={false}
                        displayDataTypes={false}
                        displayObjectSize={true}
                        name={false}
                        style={{
                            backgroundColor: 'transparent',
                            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                            fontSize: '13px',
                            lineHeight: '1.6'
                        }}
                        groupArraysAfterLength={5}
                        indentWidth={2}
                        collapseStringsAfterLength={50}
                    />
                </div>
            ) : (
                // Use Dynamically loaded CodeMirror
                <DynamicCodeMirror
                    value={String(text || '')}
                    height="30rem"
                    extensions={[
                        python(),
                        lineNumbers(),
                        foldGutter(),
                        EditorView.lineWrapping,
                        EditorView.theme({
                            "&": { fontSize: "13px", fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace", lineHeight: "1.6" },
                            ".cm-content": { padding: "0.5rem 0" },
                            ".cm-line": { paddingLeft: "1rem", paddingRight: "1rem" },
                            ".cm-scroller": { overflow: "auto" },
                            ".cm-foldPlaceholder": {
                                backgroundColor: "#E5E7EB",
                                color: "#657082",
                                border: "none",
                                padding: "0 0.5em",
                                margin: "0 0.2em",
                                borderRadius: "3px",
                                cursor: "pointer",
                            }
                        }, { dark: false })
                    ]}
                    theme={myTheme}
                    readOnly={true}
                    basicSetup={{
                        lineNumbers: true,
                        highlightActiveLineGutter: true,
                        highlightSpecialChars: true,
                        history: false,
                        drawSelection: true,
                        dropCursor: false,
                        allowMultipleSelections: false,
                        indentOnInput: false,
                        syntaxHighlighting: true,
                        bracketMatching: true,
                        closeBrackets: false,
                        autocompletion: false,
                        rectangularSelection: false,
                        crosshairCursor: false,
                        highlightActiveLine: true,
                        highlightSelectionMatches: true,
                        closeBracketsKeymap: false,
                        defaultKeymap: false,
                        searchKeymap: false,
                        historyKeymap: false,
                        foldKeymap: true,
                        completionKeymap: false,
                        lintKeymap: false,
                        foldGutter: true
                    }}
                />
            )}
            <div className={footerClass}>
                {isPythonParser ? "Generated Python Parser" : (verified ? "Verified" : "IDL Data")}
            </div>
        </div>
    );
};

export default CodeBlock;
