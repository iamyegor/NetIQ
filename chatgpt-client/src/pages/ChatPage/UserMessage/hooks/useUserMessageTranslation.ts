import { useState, useEffect } from "react";

const translations = [
    {
        locale: "en",
        cancel: "Cancel",
        send: "Send",
    },
    {
        locale: "ru",
        cancel: "Отменить",
        send: "Отправить",
    },
];

export default function useUserMessageTranslation() {
    const [translation, setTranslation] = useState(translations[0]);

    useEffect(() => {
        if (window.uiLanguage) {
            setTranslation(
                translations.find((translation) => translation.locale === window.uiLanguage) ||
                    translations[0],
            );
        }
    }, [window.uiLanguage]);

    return translation;
}
