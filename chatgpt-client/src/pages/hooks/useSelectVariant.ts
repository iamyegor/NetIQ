import { Message } from "@/pages/ChatPage/types";
import React from "react";
import api from "@/lib/api.ts";
import { useParams } from "react-router-dom";

export function useSelectVariant(setMessages: React.Dispatch<React.SetStateAction<Message[]>>) {
    const { chatId } = useParams();
    return async (variant: Message) => {
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
