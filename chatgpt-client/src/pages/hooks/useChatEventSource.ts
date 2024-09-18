import { AppError, Chat, Message, Model } from "@/pages/ChatPage/types.ts";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useInsertTempMessages from "@/pages/hooks/useInsertTempMessages.ts";
import PostEventSource from "@/utils/PostEventSource.ts";

interface ChatEventSourceParams {
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
    addChat: (chat: Chat) => void;
}

const useChatEventSource = ({
    displayedMessages,
    setIsStreaming,
    setMessages,
    startEventSource,
    setAppError,
    selectedModel,
    addChat,
}: ChatEventSourceParams) => {
    const navigate = useNavigate();
    const insertTempMessages = useInsertTempMessages(setMessages);
    const userMessageRef = useRef<Message | null>(null);
    const assistantMessageRef = useRef<Message | null>(null);

    useEffect(() => {
        const tempUserMessage = displayedMessages.find((msg) => msg.id === "temp-user-id");
        if (tempUserMessage) {
            setIsStreaming(true);
        }
    }, [displayedMessages.length]);

    const handleEventSourceMessage = (
        event: MessageEvent,
        tempAssistantMessage: Message,
        isNewChat: boolean,
    ) => {
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

            if (isNewChat && data.chat) {
                const newChat: Chat = data.chat;
                addChat(newChat);
                navigate(`/chats/${newChat.id}`, { replace: true });
            }
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

    async function startChatEventSource(
        url: string,
        chatId: string | null,
        messageContent: string,
    ) {
        const { tempAssistantMessage } = insertTempMessages(
            messageContent,
            displayedMessages[displayedMessages.length - 1]?.id ?? null,
        );

        if (messageContent.length > 50000) {
            setAppError("message_too_long");
            return;
        }

        const displayedMessageIds = displayedMessages.map((msg) => msg.id);

        startEventSource(
            url,
            { displayedMessageIds: displayedMessageIds, messageContent, model: selectedModel?.id },
            (event: MessageEvent) => handleEventSourceMessage(event, tempAssistantMessage, !chatId),
        );
    }

    return { startChatEventSource };
};

export default useChatEventSource;
