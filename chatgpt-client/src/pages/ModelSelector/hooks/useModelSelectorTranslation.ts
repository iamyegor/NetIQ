import { useMemo } from "react";

const modelSelectorTranslations = [
    {
        locale: "en",
        selectModel: "Select model",
        upgrade: "Upgrade",
        chooseModel: "Choose a model",
    },
    {
        locale: "ru",
        selectModel: "Выберите модель",
        upgrade: "Улучшить",
        chooseModel: "Выбрать модель",
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
