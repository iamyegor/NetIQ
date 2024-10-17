import { useMemo } from "react";

const inputAreaTranslations = [
    {
        locale: "en",
        writeMessage: "Write a message...",
        reloadChat: "Reload chat",
    },
    {
        locale: "ru",
        writeMessage: "Напишите сообщение...",
        reloadChat: "Перезагрузить чат",
    },
];

export type InputAreaTranslation = (typeof inputAreaTranslations)[0];

export default function useInputAreaTranslations() {
    const currentLanguage = window.uiLanguage;

    return useMemo(() => {
        return (
            inputAreaTranslations.find((translation) => translation.locale === currentLanguage) ??
            inputAreaTranslations[0]
        );
    }, [currentLanguage]);
}
