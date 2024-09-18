import { Message, Model } from "@/pages/ChatPage/types.ts";
import { Dispatch, SetStateAction, useRef } from "react";
import { useParams } from "react-router-dom";
import PostEventSource from "@/utils/PostEventSource.ts";

interface RegenerateResponseParams {
    setMessages: Dispatch<SetStateAction<Message[]>>;
    displayedMessages: Message[];
    setIsStreaming: Dispatch<SetStateAction<boolean>>;
    startEventSource: (
        url: string,
        body: any,
        onMessage: (event: MessageEvent) => void,
    ) => PostEventSource;
    selectedModel: Model | null;
}

export function useRegenerateResponse({
    setMessages,
    displayedMessages,
    setIsStreaming,
    startEventSource,
    selectedModel,
}: RegenerateResponseParams) {
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

    const regenerateResponse = async (messageId: string) => {
        const currentMessageIndex = displayedMessages.findIndex((m) => m.id === messageId);
        const displayedMessageIds = displayedMessages
            .slice(0, currentMessageIndex)
            .map((m) => m.id);

        const url = `https://localhost:7071/api/chats/${chatId}/messages/regenerate`;

        insertFakeMessage(displayedMessages[currentMessageIndex].linkId);

        setIsStreaming(true);
        startEventSource(
            url,
            { displayedMessageIds, model: selectedModel?.id },
            handleRegenerateMessage,
        );
    };

    return { regenerateResponse };
}
