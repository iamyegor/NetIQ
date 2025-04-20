const signInActionTranslations = {
    en: {
        allFieldsRequired: "All fields must be filled",
        invalidLoginOrPassword: "Invalid email or password",
        unexpectedError: "An unexpected error occurred",
    },
    ru: {
        allFieldsRequired: "Все поля должны быть заполнены",
        invalidLoginOrPassword: "Неверный email или пароль",
        unexpectedError: "Произошла непредвиденная ошибка",
    },
};

type SignInActionTranslations = typeof signInActionTranslations.en;

export function getSignInActionTranslation(): SignInActionTranslations {
    const locale = window.uiLanguage;
    return (
        signInActionTranslations[locale as keyof typeof signInActionTranslations] ||
        signInActionTranslations.en
    );
}
