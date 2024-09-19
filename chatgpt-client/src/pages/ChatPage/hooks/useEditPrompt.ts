import { AppError, Message, Model } from "@/pages/ChatPage/types.ts";
import { Dispatch, SetStateAction, useRef } from "react";
import useInsertTempMessages from "@/pages/ChatPage/hooks/useInsertTempMessages.ts";
import { useParams } from "react-router-dom";
import PostEventSource from "@/utils/PostEventSource.ts";

interface EditPromptParams {
    setMessages: Dispatch<SetStateAction<Message[]>>;
    displayedMessages: Message[];
    setIsStreaming: Dispatch<SetStateAction<boolean>>;
    startEventSource: (
        url: string,
        body: any,
        onMessage: (event: MessageEvent) => void,
    ) => PostEventSource;
    selectedModel: Model | null;
    setAppError: Dispatch<SetStateAction<AppError>>;
}

export default function useEditPrompt({
    setMessages,
    displayedMessages,
    setIsStreaming,
    startEventSource,
    selectedModel,
    setAppError,
}: EditPromptParams) {
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

    const editPrompt = async (messageId: string, messageContent: string) => {
        const currentMessageIndex = displayedMessages.findIndex((m) => m.id === messageId);

        const { tempAssistantMessage } = insertTempMessages(
            messageContent,
            displayedMessages[currentMessageIndex].linkId,
        );

        if (messageContent.length > 50000) {
            setAppError("message_too_long");
            return;
        }

        setIsStreaming(true);

        const displayedMessageIds = displayedMessages
            .slice(0, currentMessageIndex)
            .map((m) => m.id);
        const urlWithParams = `chats/${chatId}/messages/edit`;

        startEventSource(
            urlWithParams,
            { messageContent, displayedMessageIds, model: selectedModel?.id },
            (msg) => handleEventSourceMessage(msg, tempAssistantMessage),
        );
    };

    return { editPrompt };
}
