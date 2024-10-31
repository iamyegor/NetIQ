import { useMemo } from "react";

const modelSelectorTranslations = [
    {
        locale: "en",
        selectModel: "Select model",
        upgrade: "Upgrade",
        chooseModel: "Choose a model",
        models: {
            "gpt-4o": {
                description: "The smartest model",
            },
            "gpt-4o-mini": {
                description: "Very fast model",
            },
        },
    },
    {
        locale: "ru",
        selectModel: "Выберите модель",
        upgrade: "Улучшить",
        chooseModel: "Выбрать модель",
        models: {
            "gpt-4o": {
                description: "Самая умная модель",
            },
            "gpt-4o-mini": {
                description: "Очень быстрая модель",
            },
        },
    },
];

export type ModelSelectorTranslation = (typeof modelSelectorTranslations)[0];

export default function useModelSelectorTranslation() {
    const currentLanguage = window.uiLanguage;

    return useMemo(() => {
        return (
            modelSelectorTranslations.find(
                (translation) => translation.locale === currentLanguage,
            ) ?? modelSelectorTranslations[0]
        );
    }, [currentLanguage]);
}
