import { useMemo } from "react";

const translations = [
    {
        locale: "en",
        signUp: "Sign Up",
        email: "Email",
        password: "Password",
        confirmPassword: "Confirm Password",
        register: "Register",
        alreadyRegistered: "Already registered?",
        signIn: "Sign in to your account",
    },
    {
        locale: "ru",
        signUp: "Регистрация",
        email: "Email",
        password: "Пароль",
        confirmPassword: "Подтвердите пароль",
        register: "Зарегистрироваться",
        alreadyRegistered: "Уже зарегистрированы?",
        signIn: "Войдите в аккаунт",
    },
];

export default function useSignUpTranslation() {
    const currentLanguage = window.uiLanguage;

    return useMemo(
        () =>
            translations.find((translation) => translation.locale === currentLanguage) ??
            translations[0],
        [currentLanguage],
    );
}
import { register } from "react-scroll/modules/mixins/scroller";
