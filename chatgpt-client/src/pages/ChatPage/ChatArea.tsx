import { Message } from "@/pages/ChatPage/types.ts";
import api from "@/lib/api.ts";
import { useParams } from "react-router-dom";
import React, { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import ChatMessage from "@/pages/ChatPage/ChatMessage.tsx";
import { useSelectVariant } from "@/pages/hooks/useSelectVariant.ts";

const fetchMessages = async (chatId: string): Promise<Message[]> => {
    const response = await api.get(`/chats/${chatId}/messages`);
    return response.data;
};

const ChatArea = ({
    messages,
    setMessages,
    setHasChatScrollbar,
    displayedMessages,
    isStreaming,
    regenerateResponse,
    shouldAttachToBottom,
    setShouldAttachToBottom,
    scrollToBottom,
    editPrompt,
}: {
    messages: Message[];
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
    setHasChatScrollbar: React.Dispatch<React.SetStateAction<boolean>>;
    displayedMessages: Message[];
    isStreaming: boolean;
    regenerateResponse: (messageId: string) => void;
    shouldAttachToBottom: boolean;
    setShouldAttachToBottom: (isAtBottom: boolean) => void;
    scrollToBottom: (smooth?: boolean) => void;
    editPrompt: (messageId: string, messageContent: string) => void;
}) => {
    const { chatId } = useParams<{ chatId: string }>();
    const chatEndRef = useRef<HTMLDivElement | null>(null);
    const selectVariant = useSelectVariant(setMessages);
    const prevScrollTop = useRef(0);
    const mainRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        scrollToBottom();
    }, [chatId]);

    useEffect(() => {
        if (mainRef.current) {
            const element = mainRef.current;
            const hasScroll = element.scrollHeight > element.clientHeight;
            setHasChatScrollbar(hasScroll);
        }
    }, [JSON.stringify(displayedMessages)]);

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["messages", chatId],
        queryFn: () => fetchMessages(chatId as string),
        enabled: messages.length == 0 && !!chatId,
    });

    useEffect(() => {
        setMessages(data || []);
    }, [data]);

    useEffect(() => {
        if (shouldAttachToBottom) {
            scrollToBottom();
        }
    }, [JSON.stringify(displayedMessages), isStreaming]);

    const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
        const target = event.currentTarget;
        const atBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 30;

        const currentScrollTop = target.scrollTop;

        if (currentScrollTop < prevScrollTop.current) {
            setShouldAttachToBottom(false);
        } else if (atBottom) {
            setShouldAttachToBottom(true);
        }

        prevScrollTop.current = currentScrollTop;
    };

    if (isLoading) {
        return (
            <main className="flex-1 overflow-auto flex justify-center">
                <div className="w-full max-w-[800px] flex items-center justify-center h-full">
                    <h2 className="text-xl text-neutral-100">Loading messages...</h2>
                </div>
            </main>
        );
    }

    if (isError) {
        console.error("Failed to fetch messages:", error);
        return (
            <main className="flex-1 overflow-auto flex justify-center">
                <div className="w-full max-w-[800px] flex items-center justify-center h-full">
                    <h2 className="text-xl text-red-500">Failed to load messages.</h2>
                </div>
            </main>
        );
    }

    return (
        <main
            ref={mainRef}
            id="chat"
            className="flex-1 flex justify-center overflow-y-auto !relative"
            onScroll={handleScroll}
        >
            <div className="w-full max-w-[800px]">
                {displayedMessages.length > 0 ? (
                    <div className="space-y-5">
                        {displayedMessages.map((message) => (
                            <ChatMessage
                                key={message.id}
                                message={message}
                                isStreaming={isStreaming}
                                isLast={
                                    displayedMessages[displayedMessages.length - 1]?.id ===
                                    message.id
                                }
                                variants={messages
                                    .filter((m) => m.linkId === message.linkId)
                                    .sort(
                                        (a, b) =>
                                            new Date(a.createdAt).getTime() -
                                            new Date(b.createdAt).getTime(),
                                    )}
                                selectVariant={(variant: Message) => selectVariant(variant)}
                                regenerateResponse={() => regenerateResponse(message.id)}
                                editPrompt={editPrompt}
                            />
                        ))}
                        <div id="chat-end" ref={chatEndRef} className="h-5"></div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <h2 className="text-xl text-neutral-100">No messages yet.</h2>
                    </div>
                )}
            </div>
        </main>
    );
};

export default ChatArea;
