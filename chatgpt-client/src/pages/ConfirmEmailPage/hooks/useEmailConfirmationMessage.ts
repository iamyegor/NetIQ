import { useActionData } from "react-router-dom";
import { useEffect, useState } from "react";
import FeedbackMessage from "@/types/FeedbackMessage.ts";

export default function useEmailConfirmationMessage() {
    const actionError = useActionData() as FeedbackMessage | null;
    const [message, setMessage] = useState<FeedbackMessage | null>(null);

    useEffect(() => {
        if (!actionError) {
            return;
        }

        if (message === null || actionError.generatedAt > message.generatedAt) {
            setMessage(actionError);
        }
    }, [actionError?.generatedAt]);

    return { message, setMessage };
}
