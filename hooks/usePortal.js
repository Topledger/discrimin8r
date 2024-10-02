import { useEffect, useState } from "react";

export const getId = () => {
    return Math.random().toString(32).slice(2, 10);
};

const isBrowser = () => {
    return Boolean(
        typeof window !== "undefined" &&
            window.document &&
            window.document.createElement
    );
};

const createElement = (id) => {
    const el = document.createElement("div");
    el.setAttribute("id", id);
    return el;
};

const usePortal = (selectId = getId()) => {
    const id = `zeit-ui-${selectId}`;
    const [elSnapshot, setElSnapshot] = useState(
        isBrowser ? createElement(id) : null
    );

    useEffect(() => {
        const hasElement = document.querySelector(`#${id}`);
        const el = hasElement || createElement(id);

        if (!hasElement) {
            document.body.appendChild(el);
        }
        setElSnapshot(el);
    }, []);

    return elSnapshot;
};

export default usePortal;
