import { Message } from "@/pages/ChatPage/types.ts";
import React, { useRef } from "react";
import { useParams } from "react-router-dom";

export function useRegenerateResponse(
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    displayedMessages: Message[],
    setIsStreaming: React.Dispatch<React.SetStateAction<boolean>>,
    startEventSource: (
        url: string,
        onMessage: (event: MessageEvent) => void,
        onError?: (error: Event) => void,
        onClose?: () => void,
    ) => EventSource,
) {
    const { chatId } = useParams();
    const regeneratedMessageRef = useRef<Message | null>(null);

    const insertFakeMessage = (linkId: string | null) => {
        const fakeAssistantMessage: Message = {
            id: "temp-regenerated-id",
            content: "",
            sender: "assistant",
            createdAt: new Date().toISOString(),
            linkId: linkId,
            isSelected: true,
        };
        setMessages((prev) => {
            const updated = [...prev];
            const index = updated.findIndex((m) => m.linkId === linkId);
            if (index !== -1) {
                updated[index].isSelected = false;
            }
            return [...updated, fakeAssistantMessage];
        });
        return fakeAssistantMessage;
    };

    const handleRegenerateMessage = (event: MessageEvent) => {
        const data = JSON.parse(event.data);
        regeneratedMessageRef.current;

        if (data.type === "assistant_message_start") {
            regeneratedMessageRef.current = {
                id: data.id,
                content: "",
                sender: "assistant",
                createdAt: data.createdAt,
                linkId: data.linkId,
                isSelected: data.isSelected,
            };
            setMessages((prev) => {
                const updated = prev.filter((m) => m.id !== "temp-regenerated-id");
                console.log("updated", updated);
                const index = updated.findIndex((m) => m.linkId === data.linkId && m.isSelected);
                if (index !== -1) {
                    updated[index].isSelected = false;
                }
                return [...updated, regeneratedMessageRef.current!];
            });
        } else if (data.type === "assistant_message_content") {
            if (regeneratedMessageRef.current) {
                regeneratedMessageRef.current.content += data.content;
                setMessages((prev) => {
                    const updated = [...prev];
                    const index = updated.findIndex(
                        (m) => m.id === regeneratedMessageRef.current!.id,
                    );
                    updated[index] = { ...regeneratedMessageRef.current! };
                    return updated;
                });
            }
        }
    };

    return async (messageId: string) => {
        const currentMessageIndex = displayedMessages.findIndex((m) => m.id === messageId);
        const messagesToSend = displayedMessages.slice(0, currentMessageIndex).map((m) => m.id);

        const url = `https://localhost:7071/api/chats/${chatId}/messages/regenerate?messagesToSend=${encodeURIComponent(JSON.stringify(messagesToSend))}`;

        insertFakeMessage(displayedMessages[currentMessageIndex].linkId);

        setIsStreaming(true);
        startEventSource(url, handleRegenerateMessage);
    };
}
