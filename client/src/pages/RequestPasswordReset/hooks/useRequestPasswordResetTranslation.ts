import { useMemo } from "react";

const translations = [
    {
        locale: "en",
        title: "Reset your password",
        subtitle: "Enter the email address where we'll send password reset instructions",
        emailLabel: "Email",
        emailPlaceholder: "For example: myemail@example.com",
        submitButton: "Send",
    },
    {
        locale: "ru",
        title: "Восстановите пароль",
        subtitle: "Укажите почту на которую мы отправим инструкцию по восстановлению пароля",
        emailLabel: "Пароль",
        emailPlaceholder: "Например: myemail@example.com",
        submitButton: "Отправить",
    },
];

export default function useRequestPasswordResetTranslation() {
    const currentLanguage = window.uiLanguage;
    return useMemo(
        () =>
            translations.find((translation) => translation.locale === currentLanguage) ??
            translations[0],
        [currentLanguage],
    );
}
