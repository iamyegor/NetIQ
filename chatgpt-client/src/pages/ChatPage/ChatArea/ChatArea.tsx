import useChatUiStore from "@/lib/zustand/chatsUi/useChatsUiStore";
import useErrorStore from "@/lib/zustand/error/useModelStore";
import useMessageStore from "@/lib/zustand/messages/useMessageStore";
import useAttachToBottomBasedOnScroll from "@/pages/ChatPage/ChatArea/_hooks/useAttachToBottomBasedOnScroll";
import useChatAreaTranslation from "@/pages/ChatPage/ChatArea/_hooks/useChatAreaTranslation";
import useCheckScrollbarVisibility from "@/pages/ChatPage/ChatArea/_hooks/useCheckScrollbarVisibility";
import useClearCodeMap from "@/pages/ChatPage/ChatArea/_hooks/useClearCodeMap";
import useLoadMessages from "@/pages/ChatPage/ChatArea/_hooks/useLoadMessages";
import useScrollToBottomWhenStopStreaming from "@/pages/ChatPage/ChatArea/_hooks/useScrollDownWhenStopStreaming";
import useScrollToBottomOnPageLoad from "@/pages/ChatPage/ChatArea/_hooks/useScrollToBottomOnChatLoad";
import useScrollToBottomWhenStreaming from "@/pages/ChatPage/ChatArea/_hooks/useScrollToBottomWhenStreaming";
import { useSelectMessage } from "@/pages/ChatPage/ChatArea/_hooks/useSelectVariant";
import useVirtualizedMessages from "@/pages/ChatPage/ChatArea/_hooks/useVirtualizedMessages/useVirtualizedMessages";
import ChatHero from "@/pages/ChatPage/ChatArea/ChatHero/ChatHero";
import ChatMessage from "@/pages/ChatPage/ChatArea/ChatMessage/ChatMessage";
import ErrorMessage from "@/pages/ChatPage/ChatArea/ErrorMessage/ErrorMessage";
import Message from "@/types/chat/Message";
import "ldrs/ring2";
import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import MessageHeightMeasurer from "@/pages/ChatPage/ChatArea/MessageHeightMeasurer/MessageHeightMeasurer.tsx";
import "highlight.js/styles/atom-one-dark.css";
import useInitialHeightMeasurement from "@/pages/ChatPage/ChatArea/_hooks/useVirtualizedMessages/_hooks/useInitialHeightMeasurement.ts";

export default function ChatArea() {
    const mainRef = useRef<HTMLDivElement>(null);

    const { messages } = useMessageStore();
    const { appError } = useErrorStore();
    const { setChatHeight, setChatScrollTop } = useChatUiStore();

    const { chatId } = useParams<{ chatId: string }>();
    const { selectMessage } = useSelectMessage();
    const t = useChatAreaTranslation();
    const { messagesLoading } = useLoadMessages();
    const { attachToBottomBasedOnScroll } = useAttachToBottomBasedOnScroll();
    useCheckScrollbarVisibility(mainRef);

    const myRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        console.log("myRef", myRef.current?.className);
    }, []);

    const { visibleMessages, paddingTop, paddingBottom, messageHeights } = useVirtualizedMessages({
        containerRef: mainRef,
    });
    const { initialMeasurementComplete, completeMeasurement } = useInitialHeightMeasurement({
        clearMessageHeights: () => messageHeights.current.clear(),
    });

    useScrollToBottomWhenStopStreaming();
    useScrollToBottomOnPageLoad({ visibleMessages });
    useScrollToBottomWhenStreaming({ chatElement: mainRef.current });
    useClearCodeMap();

    if (messagesLoading) {
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

    return (
        <main
            ref={mainRef}
            id="chat"
            className="flex flex-1 w-full justify-center h-full overflow-y-auto !relative px-5 transition-transform mb-[95px] md:mb-[5px]"
            onLoad={(e) => {
                setChatHeight(e.currentTarget.scrollHeight);
                setChatScrollTop(e.currentTarget.scrollTop);
                // adjustScrollbarVisibility();
            }}
            onScroll={(e: React.UIEvent<HTMLDivElement>) => {
                // adjustScrollbarVisibility(e.currentTarget);
                setChatHeight(e.currentTarget.scrollHeight);
                setChatScrollTop(e.currentTarget.scrollTop);
                attachToBottomBasedOnScroll(e);
            }}
        >
            {/* Hidden messages for initial measurement */}
            {!initialMeasurementComplete &&
                messages.map((message, index) => (
                    <MessageHeightMeasurer
                        key={`measure-${message.id}`}
                        message={message}
                        measureHeight={(id, height) => messageHeights.current.set(id, height)}
                        afterMeasured={() => {
                            if (index === messages.length - 1) {
                                completeMeasurement();
                            }
                        }}
                    />
                ))}
            <div
                className={`w-full max-w-[800px] h-full ${
                    appError && "h-full flex flex-col justify-between items-stretch"
                }`}
            >
                <div
                    style={{
                        paddingTop: paddingTop,
                        paddingBottom: paddingBottom,
                    }}
                >
                    {visibleMessages.map((message) => (
                        <ChatMessage
                            key={message.id}
                            message={message}
                            selectVariant={(variant: Message) => selectMessage(variant)}
                        />
                    ))}
                    <div id="chat-end" className="h-5"></div>
                </div>
                <ErrorMessage />
            </div>
        </main>
    );
}
