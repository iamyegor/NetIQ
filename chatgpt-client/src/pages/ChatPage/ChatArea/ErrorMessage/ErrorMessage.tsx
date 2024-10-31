import ExclamationSvg from "@/assets/pages/chat/exclamation.svg?react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.tsx";
import { useErrorTranslations } from "@/pages/ChatPage/ChatArea/ErrorMessage/_hooks/useErrorTranslations.ts";
import useErrorStore from "@/lib/zustand/error/useModelStore.ts";

export default function ErrorMessage() {
    const { appError } = useErrorStore();
    const getErrorContent = useErrorTranslations();

    if (appError === null) {
        return null;
    }

    const { title, description } = getErrorContent(appError);

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
}