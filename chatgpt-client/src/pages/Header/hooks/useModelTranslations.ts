import { useMemo } from "react";

const modelTranslations = [
    {
        locale: "en",
        models: {
            "gpt-4o": {
                name: "GPT-4o",
                description: "The smartest model",
            },
            "gpt-4o-mini": {
                name: "GPT-4o mini",
                description: "Very fast model",
            },
        },
    },
    {
        locale: "ru",
        models: {
            "gpt-4o": {
                name: "GPT-4o",
                description: "Самая умная модель",
            },
            "gpt-4o-mini": {
                name: "GPT-4o mini",
                description: "Очень быстрая модель",
            },
        },
    },
];

export type ModelTranslation = (typeof modelTranslations)[0]["models"];

export default function useModelTranslations() {
    const currentLanguage = window.uiLanguage;

    return useMemo(() => {
        return (
            modelTranslations.find((translation) => translation.locale === currentLanguage)
                ?.models ?? modelTranslations[0].models
        );
    }, [currentLanguage]);
}
