import { useMemo } from "react";

const translations = [
    {
        locale: "en",
        confirmEmail: "Confirm Email",
        enterCode: "Enter the code we sent to",
        confirm: "Confirm",
        back: "Back",
        resendCode: "Resend Code",
        countdown: "You will be able resend code in",
    },
    {
        locale: "ru",
        confirmEmail: "Подтвердите почту",
        enterCode: "Введите код который мы прислали на",
        confirm: "Подтвердить",
        back: "Назад",
        resendCode: "Отправить код повторно",
        countdown: "Отправить код повторно через",
    },
];

export default function useConfirmEmailTranslation() {
    const currentLanguage = window.uiLanguage;

    return useMemo(
        () =>
            translations.find((translation) => translation.locale === currentLanguage) ??
            translations[0],
        [currentLanguage],
    );
}
