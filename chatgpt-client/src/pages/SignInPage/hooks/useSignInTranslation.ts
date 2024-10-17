import { useMemo } from "react";

const translations = [
    {
        locale: "en",
        signIn: "Sign In",
        email: "Email",
        password: "Password",
        forgotPassword: "Forgot password?",
        recoverAccess: "Recover access",
        enter: "Sign in",
        noAccount: "Don't have an account?",
        register: "Register",
    },
    {
        locale: "ru",
        signIn: "Вход в аккаунт",
        email: "Email",
        password: "Пароль",
        forgotPassword: "Забыли пароль?",
        recoverAccess: "Восстановить доступ",
        enter: "Войти",
        noAccount: "Еще нет аккаунта?",
        register: "Зарегистрироваться",
    },
];

export default function useSignInTranslation() {
    const currentLanguage = window.uiLanguage;

    return useMemo(
        () =>
            translations.find((translation) => translation.locale === currentLanguage) ??
            translations[0],
        [currentLanguage],
    );
}
