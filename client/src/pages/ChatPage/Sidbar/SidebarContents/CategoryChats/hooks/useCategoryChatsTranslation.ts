import { useMemo } from "react";

const translations = [
    {
        locale: "en",
        categoryTitle: "Category",
        deleteConfirmationTitle: "Are you sure you want to continue?",
        deleteConfirmationDescription:
            "This action cannot be undone. This will permanently delete your chat and all of its messages.",
        deleteButton: "Delete",
    },
    {
        locale: "ru",
        categoryTitle: "Категория",
        deleteConfirmationTitle: "Вы точно хотите продолжить?",
        deleteConfirmationDescription:
            "Это действие нельзя отменить. Это навсегда удалит ваш чат и все его сообщения.",
        deleteButton: "Удалить",
    },
];

export default function useCategoryChatsTranslation() {
    const currentLanguage = window.uiLanguage;
    return useMemo(
        () =>
            translations.find((translation) => translation.locale === currentLanguage) ??
            translations[0],
        [currentLanguage],
    );
}
