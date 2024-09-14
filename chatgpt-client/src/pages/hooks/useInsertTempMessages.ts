import { Message } from "@/pages/ChatPage/types.ts";
import React from "react";

export default function useInsertTempMessages(
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
) {
    return (message: string, linkId: string | null) => {
        const tempUserMessage: Message = {
            id: "temp-user-id",
            content: message,
            sender: "user",
            createdAt: new Date().toISOString(),
            linkId: linkId,
            isSelected: true,
        };
        const tempAssistantMessage: Message = {
            id: "temp-assistant-id",
            content: "",
            sender: "assistant",
            createdAt: new Date().toISOString(),
            linkId: "temp-user-id",
            isSelected: true,
        };

        setMessages((prev) => {
            const updated = [...prev];
            const selectedMessage = updated.find((m) => m.linkId === linkId && m.isSelected);
            if (selectedMessage) {
                selectedMessage.isSelected = false;
            }

            const lastTwo = prev.slice(-2);
            if (
                lastTwo.length === 2 &&
                lastTwo[0].id === "temp-user-id" &&
                lastTwo[1].id === "temp-assistant-id"
            ) {
                updated[updated.length - 2] = {
                    ...updated[updated.length - 2],
                    content: message,
                };
                return updated;
            } else {
                return [...updated, tempUserMessage, tempAssistantMessage];
            }
        });

        return { tempUserMessage, tempAssistantMessage };
    };
}
