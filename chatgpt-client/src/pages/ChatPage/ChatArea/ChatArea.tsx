import useChatUiStore from "@/lib/zustand/chatsUi/useChatsUiStore";
import useErrorStore from "@/lib/zustand/error/useModelStore";
import useMessageStore from "@/lib/zustand/messages/useMessageStore";
import useAttachToBottomBasedOnScroll from "@/pages/ChatPage/ChatArea/_hooks/useAttachToBottomBasedOnScroll";
import useChatAreaTranslation from "@/pages/ChatPage/ChatArea/_hooks/useChatAreaTranslation";
import useCheckChatCharacteristics from "@/pages/ChatPage/ChatArea/_hooks/useCheckChatCharacteristics.ts";
import useClearCodeMap from "@/pages/ChatPage/ChatArea/_hooks/useClearCodeMap";
import useLoadMessages from "@/pages/ChatPage/ChatArea/_hooks/useLoadMessages";
import useScrollToBottomOnChatLoad from "@/pages/ChatPage/ChatArea/_hooks/useScrollToBottomOnChatLoad";
import useScrollToBottomWhenStreaming from "@/pages/ChatPage/ChatArea/_hooks/useScrollToBottomWhenStreaming";
import ChatHero from "@/pages/ChatPage/ChatArea/ChatHero/ChatHero";
import ErrorMessage from "@/pages/ChatPage/ChatArea/ErrorMessage/ErrorMessage";
import "ldrs/ring2";
import React, { useRef } from "react";
import { useParams } from "react-router-dom";
import MessageHeightMeasurer from "@/pages/ChatPage/ChatArea/MessageHeightMeasurer/MessageHeightMeasurer.tsx";
import VirtualizedMessages from "@/pages/ChatPage/ChatArea/VisibleMessages/VirtualizedMessages.tsx";
import "highlight.js/styles/atom-one-dark.css";
import useClearMessageHeightsOnChatSwitch from "@/pages/ChatPage/ChatArea/_hooks/useVirtualizedMessages/_hooks/useClearMessageHeightsOnChatSwitch.ts";

export default function ChatArea() {
    const { chatRef } = useChatUiStore();
    const chatWidthElementRef = useRef<HTMLDivElement>(null);
    const messageHeights = useRef<Map<string, number>>(new Map());
    const prevChatIdRef = useRef<string | null>(null);

    const { messages } = useMessageStore();
    const { appError } = useErrorStore();
    const { setChatScrollTop } = useChatUiStore();

    const { chatId } = useParams<{ chatId: string }>();
    const t = useChatAreaTranslation();
    const { messagesLoading } = useLoadMessages();
    const { attachToBottomBasedOnScroll } = useAttachToBottomBasedOnScroll();
    
    useClearMessageHeightsOnChatSwitch({ messageHeights });
    useCheckChatCharacteristics(chatRef);
    useScrollToBottomOnChatLoad();
    useScrollToBottomWhenStreaming();
    useClearCodeMap();

    return (
        <main
            ref={chatRef}
            id="chat"
            className="flex w-full justify-center flex-1 overflow-y-auto mt-[70px] mb-[110px] md:mt-0 md:mb-0 !relative px-5 transition-transform"
            onScroll={(e: React.UIEvent<HTMLDivElement>) => {
                attachToBottomBasedOnScroll(e);
                setChatScrollTop(e.currentTarget.scrollTop);
            }}
        >
            {messages.length > 0 && (
                <MessageHeightMeasurer
                    messages={messages}
                    messageHeights={messageHeights}
                    prevChatIdRef={prevChatIdRef}
                    width={chatWidthElementRef.current?.offsetWidth ?? 0}
                />
            )}

            {messages.length === 0 && !chatId ? (
                <ChatHero hello={t.hello} />
            ) : (
                <div
                    ref={chatWidthElementRef}
                    className={`w-full max-w-[800px] h-full ${appError && "flex flex-col justify-between items-stretch"}`}
                >
                    {messagesLoading ? (
                        <div className="flex w-full h-full justify-center items-center">
                            <l-ring-2 color="#e5e5e5" size="55" stroke="6"></l-ring-2>
                        </div>
                    ) : (
                        <VirtualizedMessages messageHeights={messageHeights} />
                    )}
                    <ErrorMessage />
                </div>
            )}
        </main>
    );
}
