import { useEffect, useState, useRef } from "react";

const usePortal = (id = "default") => {
    const [portal, setPortal] = useState(null);
    const cleanup = useRef(null);

    useEffect(() => {
        // Only run on client side
        if (typeof window === "undefined") return;

        const portalId = `zeit-ui-${id}`;
        let element = document.getElementById(portalId);
        let shouldRemove = false;

        if (!element) {
            shouldRemove = true;
            element = document.createElement("div");
            element.id = portalId;
            document.body.appendChild(element);
        }

        setPortal(element);
        cleanup.current = shouldRemove;

        return () => {
            if (cleanup.current && element?.parentElement) {
                element.parentElement.removeChild(element);
            }
        };
    }, [id]);

    if (typeof window === "undefined") return null;
    return portal;
};

export default usePortal;
