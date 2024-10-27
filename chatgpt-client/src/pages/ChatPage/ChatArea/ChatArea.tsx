import { useAppContext } from "@/context/AppContext.tsx";
import api from "@/lib/api.ts";
import ChatHero from "@/pages/ChatPage/ChatArea/components/ChatHero/ChatHero";
import useScorllToBottomOnPageLoad from "@/pages/ChatPage/ChatArea/hooks/useScorllToBottomOnFirstRender";
import useScrollToBottomWhenStopStreaming from "@/pages/ChatPage/ChatArea/hooks/useScrollDownWhenStopStreaming";
import ChatMessage from "@/pages/ChatPage/ChatMessage";
import ErrorMessage from "@/pages/ChatPage/ErrorMessage/ErrorMessage";
import { useSelectVariant } from "@/pages/ChatPage/hooks/useSelectVariant.ts";
import { Message } from "@/pages/ChatPage/types.ts";
import RouteError from "@/types/errors/RouteError.ts";
import ServerErrorResponse from "@/types/errors/ServerErrorResponse.ts";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { AnimatePresence } from "framer-motion";
import "ldrs/ring2";
import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import useChatAreaTranslation from "./hooks/useChatAreaTranslation";

const fetchMessages = async (chatId: string): Promise<Message[]> => {
    const response = await api.get(`/chats/${chatId}/messages`);
    return response.data;
};

export default function ChatArea() {
    const {
        messages,
        setMessages,
        displayedMessages,
        isStreaming,
        shouldAttachToBottom,
        setShouldAttachToBottom,
        scrollToBottom,
        appError,
        setAppError,
        setHasChatScrollbar,
    } = useAppContext();

    const { chatId } = useParams<{ chatId: string }>();
    const selectVariant = useSelectVariant(setMessages);
    const prevScrollTop = useRef(0);
    const mainRef = useRef<HTMLElement | null>(null);
    const t = useChatAreaTranslation();
    useScrollToBottomWhenStopStreaming();
    useScorllToBottomOnPageLoad({ chatElement: mainRef.current, displayedMessages });

    useEffect(() => {
        scrollToBottom({ scrollType: "jerky" });
    }, [chatId]);

    useEffect(() => {
        if (mainRef.current) {
            const element = mainRef.current;
            const hasScroll = element.scrollHeight > element.clientHeight;
            setHasChatScrollbar(hasScroll);
        }
    }, [JSON.stringify(displayedMessages)]);

    const {
        data,
        isLoading,
        error: messageLoadingError,
    } = useQuery({
        queryKey: ["messages", chatId],
        queryFn: () => fetchMessages(chatId as string),
        enabled: messages.length == 0 && !!chatId,
        gcTime: 0,
        retry: 1,
    });

    useEffect(() => {
        const error = messageLoadingError as
            | AxiosError<ServerErrorResponse>
            | AxiosError<{ errors: { chatId: string[] } }>;

        // if chatId is incorrect or doesn't exist, redirect to 404
        if (error?.response?.data) {
            if ("errors" in error.response.data && error.response.data.errors.chatId) {
                throw RouteError.notFound();
            }

            if (
                "errorCode" in error.response.data &&
                error.response.data.errorCode === "chat.not.found"
            ) {
                throw RouteError.notFound();
            }
        }

        if (error) {
            setAppError("messages_error");
        }
    }, [messageLoadingError]);

    useEffect(() => {
        setMessages(data || []);
    }, [data]);

    useEffect(() => {
        if (isStreaming && shouldAttachToBottom && mainRef.current) {
            const element = mainRef.current;
            const hasScrollbar = element.scrollHeight > element.clientHeight;

            if (hasScrollbar) {
                scrollToBottom();
            }
        }
    }, [displayedMessages, isStreaming]);

    function handleScroll(event: React.UIEvent<HTMLDivElement>) {
        const target = event.currentTarget;
        const atBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 5;

        const currentScrollTop = target.scrollTop;

        if (currentScrollTop < prevScrollTop.current) {
            setShouldAttachToBottom(false);
        } else if (atBottom) {
            setShouldAttachToBottom(true);
        }

        prevScrollTop.current = currentScrollTop;
    }

    if (isLoading) {
        return (
            <main className="flex-1 overflow-auto flex justify-center">
                <div className="w-full max-w-[800px] flex items-center justify-center h-full">
                    <h2 className="text-xl text-neutral-100">
                        <l-ring-2 color="#e5e5e5" size="55" stroke="6"></l-ring-2>
                    </h2>
                </div>
            </main>
        );
    }

    if (messages.length === 0 && !chatId) {
        return <ChatHero hello={t.hello} />;
    }

    function getMessageVariants(message: Message) {
        return messages
            .filter((m) => m.linkId === message.linkId)
            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }

    return (
        <main
            ref={mainRef}
            id="chat"
            className="flex-1 flex justify-center overflow-y-auto !relative px-5 transition-transform"
            onScroll={handleScroll}
        >
            <div
                className={`w-full max-w-[800px] ${appError && "h-full flex flex-col justify-between items-stretch"}`}
            >
                <div className="pb-[120px] md:pb-[30px]">
                    <AnimatePresence mode="popLayout">
                        {displayedMessages.map((message, index) => (
                            <ChatMessage
                                key={index}
                                message={message}
                                variants={getMessageVariants(message)}
                                selectVariant={(variant: Message) => selectVariant(variant)}
                            />
                        ))}
                    </AnimatePresence>
                    <div id="chat-end" className="h-5"></div>
                </div>
                <ErrorMessage error={appError} />
            </div>
        </main>
    );
}
