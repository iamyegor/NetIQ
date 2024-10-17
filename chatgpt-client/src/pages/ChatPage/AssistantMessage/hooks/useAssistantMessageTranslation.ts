import { useMemo } from "react";

const translations = [
    {
        locale: "en",
        copy: "Copy",
        regenerate: "Regenerate",
    },
    {
        locale: "ru",
        copy: "Скопировать",
        regenerate: "Пересоздать",
    },
];

export default function useAssistantMessageTranslation() {
    const currentLanguage = window.uiLanguage;

    return useMemo(
        () =>
            translations.find((translation) => translation.locale === currentLanguage) ??
            translations[0],
        [currentLanguage],
    );
}
