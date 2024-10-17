import { useMemo } from "react";
import { AppError } from "@/pages/ChatPage/types.ts";

const errorTranslations = {
    en: {
        messages_error: {
            title: "Failed to load messages",
            description: "An error occurred while loading messages. Please try again.",
        },
        generic_error: {
            title: "An error occurred",
            description: "Please reload the chat and try again.",
        },
        message_too_long: {
            title: "You sent a message that was too long",
            description: "Please reload the chat and send a shorter message.",
        },
        max_messages_error: {
            title: "Message limit reached",
            description: "Please create a new chat to continue the conversation.",
        },
        subscription_max_messages_error: {
            title: "Subscription message limit reached",
            description: "Please upgrade your subscription to continue the conversation.",
        },
    },
    ru: {
        messages_error: {
            title: "Не удалось загрузить сообщения",
            description: "Произошла ошибка при загрузке сообщений. Пожалуйста, попробуйте снова.",
        },
        generic_error: {
            title: "Произошла какая-то ошибка",
            description: "Пожалуйста, перезагрузите чат и попробуйте снова.",
        },
        message_too_long: {
            title: "Вы отправили слишком длинное сообщение",
            description: "Пожалуйста, перезагрузите чат и отправьте сообщение покороче.",
        },
        max_messages_error: {
            title: "Достигнут лимит сообщений",
            description: "Пожалуйста, создайте новый чат, чтобы продолжить общение.",
        },
        subscription_max_messages_error: {
            title: "Достигнут лимит сообщений в подписке",
            description: "Пожалуйста, обновите подписку, чтобы продолжить общение.",
        },
    },
};

type Language = keyof typeof errorTranslations;

export function useErrorTranslations() {
    const currentLanguage = window.uiLanguage as Language;

    const getErrorContent = useMemo(() => {
        return (error: AppError) => {
            const languageTranslations = errorTranslations[currentLanguage] || errorTranslations.en;
            return languageTranslations[error!] || languageTranslations.generic_error;
        };
    }, [currentLanguage]);

    return getErrorContent;
}
