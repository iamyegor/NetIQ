import React, { useMemo } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ExclamationSvg from "@/assets/pages/chat/exclamation.svg?react";
import { AppError } from "@/pages/ChatPage/types.ts";

interface ErrorMessageProps {
    error: AppError;
}

const errorContent = {
    messages_error: {
        title: "Не удалось загрузить сообщения",
        description: "Произошла ошибка при загрузке сообщений. Пожалуйста, попробуйте снова.",
    },
    generic_error: {
        title: "Произошла какая-то ошибка",
        description: "Пожалуйста, перезагрузите чат и попробуйте снова.",
    },
    message_too_long: {
        title: "Вы отправили слишоком длинное сообщение",
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
};

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
    const selectedErrorContent = useMemo(() => {
        if (error === null) return null;
        return errorContent[error];
    }, [error]);

    if (selectedErrorContent === null) {
        return null;
    }

    const { title, description } = selectedErrorContent;

    return (
        <div className="!pb-5">
            <Alert className="px-5">
                <div className="flex items-center space-x-6 text-neutral-200">
                    <ExclamationSvg className="w-6 h-6 fill-neutral-200" />
                    <div className="space-y-2">
                        <AlertTitle className="text-lg font-semibold">{title}</AlertTitle>
                        <AlertDescription className="text-sm">{description}</AlertDescription>
                    </div>
                </div>
            </Alert>
        </div>
    );
};

export default ErrorMessage;
