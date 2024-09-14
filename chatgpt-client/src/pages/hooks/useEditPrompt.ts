import { Message } from "@/pages/ChatPage/types.ts";
import React, { useRef } from "react";
import useInsertTempMessages from "@/pages/hooks/useInsertTempMessages.ts";
import { useParams } from "react-router-dom";

export default function useEditPrompt(
    displayedMessages: Message[],
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    setIsStreaming: React.Dispatch<React.SetStateAction<boolean>>,
    startEventSource: (
        url: string,
        onMessage: (event: MessageEvent) => void,
        onError?: (error: Event) => void,
        onClose?: () => void,
    ) => EventSource,
) {
    const { chatId } = useParams();
    const insertTempMessages = useInsertTempMessages(setMessages);
    const userMessageRef = useRef<Message | null>(null);
    const assistantMessageRef = useRef<Message | null>(null);

    const handleEventSourceMessage = (event: MessageEvent, tempAssistantMessage: Message) => {
        const data = JSON.parse(event.data);

        if (data.type === "user_message") {
            userMessageRef.current = {
                id: data.id,
                content: data.content,
                sender: "user",
                createdAt: data.createdAt,
                linkId: data.linkId,
                isSelected: data.isSelected,
            };
            setMessages((prev) => [
                ...prev.slice(0, -2),
                userMessageRef.current!,
                tempAssistantMessage,
            ]);
        } else if (data.type === "assistant_message_start") {
            assistantMessageRef.current = {
                id: data.id,
                content: "",
                sender: "assistant",
                createdAt: data.createdAt,
                linkId: data.linkId,
                isSelected: data.isSelected,
            };
            setMessages((prev) => [...prev.slice(0, -1), assistantMessageRef.current!]);
        } else if (data.type === "assistant_message_content") {
            if (assistantMessageRef.current) {
                assistantMessageRef.current.content += data.content;
                setMessages((prev) => {
                    const updated = [...prev];
                    updated[updated.length - 1] = { ...assistantMessageRef.current! };
                    return updated;
                });
            }
        }
    };

    return async (messageId: string, messageContent: string) => {
        setIsStreaming(true);

        const encodedMessage = encodeURIComponent(messageContent);
        const currentMessageIndex = displayedMessages.findIndex((m) => m.id === messageId);
        const messagesToSend = encodeURIComponent(
            JSON.stringify(displayedMessages.slice(0, currentMessageIndex).map((m) => m.id)),
        );
        const urlWithParams = `https://localhost:7071/api/chats/${chatId}/messages/edit?messageContent=${encodedMessage}&messagesToSend=${messagesToSend}`;

        const { tempAssistantMessage } = insertTempMessages(
            messageContent,
            displayedMessages[currentMessageIndex].linkId,
        );

        startEventSource(urlWithParams, (msg) =>
            handleEventSourceMessage(msg, tempAssistantMessage),
        );
    };
}
