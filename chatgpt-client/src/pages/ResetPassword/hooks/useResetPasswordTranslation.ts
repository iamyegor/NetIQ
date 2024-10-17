import { useMemo } from "react";

const translations = [
    {
        locale: "en",
        title: "Reset your password",
        subtitle: "Enter a new password for your account",
        newPasswordPlaceholder: "Enter new password",
        confirmPasswordPlaceholder: "Repeat password",
        submitButton: "Change password",
    },
    {
        locale: "ru",
        title: "Восстановите пароль",
        subtitle: "Введите новый пароль для вашего аккаунта",
        newPasswordPlaceholder: "Введите новый пароль",
        confirmPasswordPlaceholder: "Повторите пароль",
        submitButton: "Изменить пароль",
    },
];

export default function useResetPasswordTranslation() {
    const currentLanguage = window.uiLanguage;

    return useMemo(
        () =>
            translations.find((translation) => translation.locale === currentLanguage) ??
            translations[0],
        [currentLanguage],
    );
}
