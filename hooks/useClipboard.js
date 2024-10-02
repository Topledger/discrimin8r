import usePortal from "./usePortal";
import { useCallback } from "react";

const defaultOptions = {
    onError: () => console.log("Failed to copy.", "use-clipboard"),
};

const useClipboard = (options = defaultOptions) => {
    const el = usePortal("clipboard");

    const copyText = (el, text) => {
        if (!el || !text) return;
        const selection = window.getSelection();
        if (!selection) return;

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
        if (el) {
            el.textContent = "";
        }
    };

    const copy = useCallback(
        (text) => {
            copyText(el, text);
        },
        [el]
    );

    return { copy };
};

export default useClipboard;
