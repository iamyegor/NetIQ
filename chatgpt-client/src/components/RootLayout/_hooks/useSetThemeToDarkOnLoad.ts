import { useEffect } from "react";

export default function useSetThemeToDarkOnLoad() {
    useEffect(() => {
        const htmlElement = document.documentElement;
        htmlElement.classList.toggle("dark");
    }, []);
}
