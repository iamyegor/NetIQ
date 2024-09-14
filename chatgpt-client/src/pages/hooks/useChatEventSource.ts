import { Chat, Message } from "@/pages/ChatPage/types.ts";
import { Dispatch, SetStateAction, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useInsertTempMessages from "@/pages/hooks/useInsertTempMessages.ts";

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
    const insertTempMessages = useInsertTempMessages(setMessages);
    const userMessageRef = useRef<Message | null>(null);
    const assistantMessageRef = useRef<Message | null>(null);

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

        const { tempAssistantMessage } = insertTempMessages(
            messageContent,
            displayedMessages[displayedMessages.length - 1]?.id ?? null,
        );

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
