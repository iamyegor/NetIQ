import { useMemo } from "react";

const inputAreaTranslations = [
    {
        locale: "en",
        writeMessage: "Write a message...",
        reloadChat: "Reload chat",
        developer: {
            title: "Developer:",
            name: "DENIS",
            link: "https://www.upwork.com/freelancers/~01069602500635941a?mp_source=share",
        },
    },
    {
        locale: "ru",
        writeMessage: "Напишите сообщение...",
        reloadChat: "Перезагрузить чат",
        developer: {
            title: "Разработчик:",
            name: "GDIGITAL",
            link: "https://kwork.ru/user/gd1g1tal",
        },
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
