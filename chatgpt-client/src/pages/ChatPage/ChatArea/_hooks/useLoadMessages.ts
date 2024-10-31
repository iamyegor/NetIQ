import api from "@/lib/backend/api";
import useErrorStore from "@/lib/zustand/error/useModelStore";
import useMessageStore from "@/lib/zustand/messages/useMessageStore";
import Message from "@/types/chat/Message";
import RouteError from "@/types/errors/RouteError";
import ServerErrorResponse from "@/types/errors/ServerErrorResponse";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

async function fetchMessages(chatId: string): Promise<Message[]> {
    const response = await api.get(`/chats/${chatId}/messages`);
    return response.data;
}

export default function useLoadMessages() {
    const { messages, setMessages } = useMessageStore();
    const { setAppError } = useErrorStore();
    const { chatId } = useParams();
    const {
        data,
        isLoading,
        error: messageLoadingError,
    } = useQuery({
        queryKey: ["messages", chatId],
        queryFn: () => fetchMessages(chatId as string),
        enabled: messages.length == 0 && !!chatId,
        gcTime: 0,
        retry: 1,
    });

    useEffect(() => {
        const error = messageLoadingError as
            | AxiosError<ServerErrorResponse>
            | AxiosError<{ errors: { chatId: string[] } }>;

        // if chatId is incorrect or doesn't exist, redirect to 404
        if (error?.response?.data) {
            if (
                "errorCode" in error.response.data &&
                error.response.data.errorCode === "chat.not.found"
            ) {
                throw RouteError.notFound();
            }
        }

        if (error) {
            setAppError("messages_error");
        }
    }, [messageLoadingError]);

    useEffect(() => {
        setMessages(data || []);
    }, [data]);

    return { messagesLoading: isLoading };
}
