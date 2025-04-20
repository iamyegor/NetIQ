import { useMemo } from "react";

const translations = [
    {
        locale: "en",
        codeSent: "Code was successfully sent!",
    },
    {
        locale: "ru",
        codeSent: "Код был успешно отправлен!",
    },
];

export default function useResendCodeTranslation() {
    const currentLanguage = window.uiLanguage;

    return useMemo(
        () =>
            translations.find((translation) => translation.locale === currentLanguage) ??
            translations[0],
        [currentLanguage],
    );
}
