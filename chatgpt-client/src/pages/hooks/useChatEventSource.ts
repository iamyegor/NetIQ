import { Chat, Message } from "@/pages/ChatPage/types.ts";
import { Dispatch, SetStateAction, useRef } from "react";
import { useNavigate } from "react-router-dom";

const useChatEventSource = (
    displayedMessages: Message[],
    setIsStreaming: Dispatch<SetStateAction<boolean>>,
    setMessages: Dispatch<SetStateAction<Message[]>>,
    setChats: Dispatch<SetStateAction<Chat[]>>,
    startEventSource: (
        url: string,
        onMessage: (event: MessageEvent) => void,
        onError?: (error: Event) => void,
        onClose?: () => void,
    ) => EventSource,
) => {
    const navigate = useNavigate();
    const userMessageRef = useRef<Message | null>(null);
    const assistantMessageRef = useRef<Message | null>(null);

    const insertTempMessages = (message: string) => {
        const tempUserMessage: Message = {
            id: "temp-user-id",
            content: message,
            sender: "user",
            createdAt: new Date().toISOString(),
            linkId: displayedMessages[displayedMessages.length - 1]?.id ?? null,
            isSelected: false,
        };
        const tempAssistantMessage: Message = {
            id: "temp-assistant-id",
            content: "",
            sender: "assistant",
            createdAt: new Date().toISOString(),
            linkId: "temp-user-id",
            isSelected: false,
        };

        setMessages((prev) => {
            const lastTwo = prev.slice(-2);
            if (
                lastTwo.length === 2 &&
                lastTwo[0].id === "temp-user-id" &&
                lastTwo[1].id === "temp-assistant-id"
            ) {
                const updatedPrev = [...prev];
                updatedPrev[updatedPrev.length - 2] = {
                    ...updatedPrev[updatedPrev.length - 2],
                    content: message,
                };
                return updatedPrev;
            } else {
                return [...prev, tempUserMessage, tempAssistantMessage];
            }
        });

        return { tempUserMessage, tempAssistantMessage };
    };

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
                setChats((prevChats) => [newChat, ...prevChats]);
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
        setIsStreaming(true);

        const { tempAssistantMessage } = insertTempMessages(messageContent);

        const encodedMessage = encodeURIComponent(messageContent);
        const displayedMessageIds = encodeURIComponent(
            JSON.stringify(displayedMessages.map((msg) => msg.id)),
        );
        const urlWithParams = `${url}?message=${encodedMessage}&displayedMessages=${displayedMessageIds}&chatId=${chatId}`;

        startEventSource(urlWithParams, (msg) =>
            handleEventSourceMessage(msg, tempAssistantMessage, !chatId),
        );
    }

    return { startChatEventSource };
};

export default useChatEventSource;
