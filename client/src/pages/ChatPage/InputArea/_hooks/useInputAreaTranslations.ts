import { useMemo } from "react";

const inputAreaTranslations = [
    {
        locale: "en",
        writeMessage: "Ask AI something...",
        reloadChat: "Reload chat",
        developer: {
            title: "Developer:",
            name: "EGOR",
            link: "https://www.upwork.com/freelancers/~01bd409a4f52eaa764",
        },
    },
    {
        locale: "ru",
        writeMessage: "Спросите что-то у ИИ...",
        reloadChat: "Перезагрузить чат",
        developer: {
            title: "Разработчик:",
            name: "EGOR",
            link: "https://www.upwork.com/freelancers/~01bd409a4f52eaa764",
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
