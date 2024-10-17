const translations = {
    en: {
        shortCode: "Code must be 5 characters long",
    },
    ru: {
        shortCode: "Код должен быть длиной 5 символов",
    },
};

type SignInActionTranslations = typeof translations.en;

export function getConfirmEmailErrorTranslatino(): SignInActionTranslations {
    const locale = window.uiLanguage;
    return translations[locale as keyof typeof translations] || translations.en;
}
