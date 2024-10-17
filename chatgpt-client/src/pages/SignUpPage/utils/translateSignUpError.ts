const errorTranslations = {
    en: {
        "form.all.fields.required": "All fields must be filled",
        "passwords.do.not.match": "Passwords do not match",
        "unexpected.error": "An unexpected error occurred",
        "password.has.invalid.signature":
            "Your password must contain at least one lowercase letter, one uppercase letter, and one number or special character.",
        "password.has.invalid.length": "Invalid password length",
        "email.has.invalid.signature": "Email contains an invalid signature",
        "email.is.too.long": "Email is too long",
        "email.is.already.taken": "Email is already taken",
    },
    ru: {
        "form.all.fields.required": "Все поля должны быть заполнены",
        "passwords.do.not.match": "Пароли не совпадают",
        "unexpected.error": "Произошла непредвиденная ошибка",
        "password.has.invalid.signature":
            "Ваш пароль должен содержать как минимум одну строчную букву, одну заглавную букву и одну цифру или специальный символ.",
        "password.has.invalid.length": "Недопустимая длина пароля",
        "email.has.invalid.signature": "Электронная почта содержит неверную подпись",
        "email.is.too.long": "Электронная почта слишком длинная",
        "email.is.already.taken": "Электронная почта уже занята",
    },
};

export function translateSignUpError(key: string): string {
    const locale = window.uiLanguage;

    const translations =
        errorTranslations[locale as keyof typeof errorTranslations] || errorTranslations.en;
    return translations[key as keyof typeof translations] || key;
}
