import { useState, useEffect } from "react";

const translations = [
    {
        locale: "en",
        copy: "Copy",
    },
    {
        locale: "ru",
        copy: "Скопировать",
    },
];

export default function useCodeHighlightTranslation() {
    const [translation, setTranslation] = useState(translations[0]);

    useEffect(() => {
        const currentLanguage = window.uiLanguage;
        if (currentLanguage) {
            setTranslation(
                translations.find((translation) => translation.locale === currentLanguage) ||
                    translations[0],
            );
        }
    }, []);

    return translation;
}
