import ExclamationSvg from "@/assets/pages/chat/exclamation.svg?react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AppError } from "@/pages/ChatPage/types.ts";
import React from "react";
import { useErrorTranslations } from "./hooks/useErrorTranslations";

interface ErrorMessageProps {
    error: AppError;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
    const getErrorContent = useErrorTranslations();

    if (error === null) {
        return null;
    }

    const { title, description } = getErrorContent(error);

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
