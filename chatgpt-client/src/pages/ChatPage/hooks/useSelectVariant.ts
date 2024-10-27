import { useAppContext } from "@/context/AppContext.tsx";
import api from "@/lib/backend/api";
import { Message } from "@/pages/ChatPage/types.ts";
import React from "react";

export function useSelectVariant(setMessages: React.Dispatch<React.SetStateAction<Message[]>>) {
    const { chatId, stopEventSource } = useAppContext();

    return async (variant: Message) => {
        stopEventSource();
        setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages];
            updatedMessages.forEach((m) => {
                if (m.linkId === variant.linkId) {
                    m.isSelected = false;
                }
                if (m.id == variant.id) {
                    m.isSelected = true;
                }
            });
            return updatedMessages;
        });

        await api.post(`/chats/${chatId}/messages/${variant.id}/select`, {
            linkId: variant.linkId,
        });
    };
}
