import { useLayoutEffect } from "react";

export function useCallbackResize(callback) {
    useLayoutEffect(() => {
        window.addEventListener("resize", callback);
        callback();
        return () => window.removeEventListener("resize", callback);
    }, []);
}
