import { useEffect } from "react";

export type Language = "en" | "ru";

declare global {
    interface Window {
        uiLanguage: Language;
    }
}

export default function useDetectLanguage() {
    useEffect(() => {
        function detectLanguage() {
            const primaryLanguage =
                navigator.language ||
                (Array.isArray(navigator.languages) ? navigator.languages[0] : "en");

            const isRussianPreferred = primaryLanguage.startsWith("ru");

            const detectedLanguage: Language = isRussianPreferred ? "ru" : "en";

            window.uiLanguage = detectedLanguage;
        }

        detectLanguage();
    }, []);
}
