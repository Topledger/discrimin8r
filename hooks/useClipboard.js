import usePortal from "./usePortal";
import { useCallback } from "react";

const defaultOptions = {
    onError: () => console.log("Failed to copy.", "use-clipboard"),
};

const useClipboard = (options = defaultOptions) => {
    const el = usePortal("clipboard");

    const copyText = useCallback((text) => {
        if (typeof window === "undefined" || !el || !text) return;
        
        try {
            if (navigator.clipboard && window.isSecureContext) {
                // Use modern Clipboard API when available
                navigator.clipboard.writeText(text).catch(() => {
                    fallbackCopyText(text);
                });
            } else {
                fallbackCopyText(text);
            }
        } catch (e) {
            options.onError && options.onError();
        }

        function fallbackCopyText(text) {
            const selection = window.getSelection();
            if (!selection || !el) return;

            el.style.whiteSpace = "pre";
            el.textContent = text;

            const range = window.document.createRange();
            selection.removeAllRanges();
            range.selectNode(el);
            selection.addRange(range);

            try {
                window.document.execCommand("copy");
            } catch (e) {
                options.onError && options.onError();
            }

            selection.removeAllRanges();
            el.textContent = "";
        }
    }, [el, options]);

    return { copy: copyText };
};

export default useClipboard;
