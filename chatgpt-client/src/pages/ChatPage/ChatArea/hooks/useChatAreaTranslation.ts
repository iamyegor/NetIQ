import { useMemo } from "react";

const translations = [
    {
        locale: "en",
        hello: "Hello, What can I help with?",
    },
    {
        locale: "ru",
        hello: "Привет, Чем могу помочь?",
    },
];

export default function useChatAreaTranslation() {
    const currentLanguage = window.uiLanguage;

    return useMemo(() => {
        return (
            translations.find((translation) => translation.locale === currentLanguage) ??
            translations[0]
        );
    }, [currentLanguage]);
}
