import { useEffect, useState } from "react";
import { AppError } from "@/pages/ChatPage/types.ts";

export default function useError(chatId: string | undefined) {
    const [error, setError] = useState<AppError>(null);

    useEffect(() => {
        setError(null);
    }, [chatId]);

    return {
        appError: error,
        setAppError: setError,
    };
}
