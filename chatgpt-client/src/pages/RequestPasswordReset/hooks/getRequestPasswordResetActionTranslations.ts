const translations = {
    en: {
        successMessage: "An email with password reset instructions has been sent to your address.",
        alreadyRequestedError:
            "Password reset has already been requested. Please check your email and spam folder.",
        generalError:
            "Error requesting password reset. Please check that the user with this email is registered and try again.",
    },
    ru: {
        successMessage: "На почту было отправлено письмо с инструкциями по сбросу пароля.",
        alreadyRequestedError: "Сброс пароля уже запрошен, проверьте вашу почту и папку спам.",
        generalError:
            "Ошибка при запросе сброса пароля. Проверьте, что пользователь с такой почтой зарегистрирован и попробуйте снова.",
    },
};

export default function getRequestPasswordResetActionTranslations(locale: string) {
    return translations[locale as keyof typeof translations] || translations.en;
}
