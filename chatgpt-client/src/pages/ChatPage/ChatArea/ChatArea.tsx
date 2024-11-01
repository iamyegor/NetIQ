import useScrollChatToBottom from "@/hooks/chat/useScrollChatToBottom.ts";
import useErrorStore from "@/lib/zustand/error/useModelStore";
import useMessageStore from "@/lib/zustand/messages/useMessageStore";
import useAttachToBottomBasedOnScroll from "@/pages/ChatPage/ChatArea/_hooks/useAttachToBottomBasedOnScroll";
import useChatAreaTranslation from "@/pages/ChatPage/ChatArea/_hooks/useChatAreaTranslation";
import useCheckScrollbarVisibility from "@/pages/ChatPage/ChatArea/_hooks/useCheckScrollbarVisibility";
import useLoadMessages from "@/pages/ChatPage/ChatArea/_hooks/useLoadMessages";
import useScrollToBottomWhenStopStreaming from "@/pages/ChatPage/ChatArea/_hooks/useScrollDownWhenStopStreaming";
import useScrollToBottomOnPageLoad from "@/pages/ChatPage/ChatArea/_hooks/useScrollToBottomOnChatLoad.ts";
import useScrollToBottomWhenStreaming from "@/pages/ChatPage/ChatArea/_hooks/useScrollToBottomWhenStreaming";
import { useSelectMessage } from "@/pages/ChatPage/ChatArea/_hooks/useSelectVariant.ts";
import ChatHero from "@/pages/ChatPage/ChatArea/ChatHero/ChatHero.tsx";
import ChatMessage from "@/pages/ChatPage/ChatArea/ChatMessage/ChatMessage.tsx";
import ErrorMessage from "@/pages/ChatPage/ChatArea/ErrorMessage/ErrorMessage.tsx";
import Message from "@/types/chat/Message.ts";
import { AnimatePresence } from "framer-motion";
import "ldrs/ring2";
import { forwardRef, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { FixedSizeList } from "react-window";
import { Virtuoso } from "react-virtuoso";

export default function ChatArea() {
    const mainRef = useRef<HTMLElement | null>(null);

    const { messages, displayedMessages } = useMessageStore();
    const { appError } = useErrorStore();

    const { scrollChatToBottom } = useScrollChatToBottom();
    const { chatId } = useParams<{ chatId: string }>();
    const { selectMessage } = useSelectMessage();
    const t = useChatAreaTranslation();
    const { messagesLoading } = useLoadMessages();
    const { attachToBottomBasedOnScroll } = useAttachToBottomBasedOnScroll();
    const { adjustScrollbarVisibility } = useCheckScrollbarVisibility({
        chatElement: mainRef.current,
    });

    useScrollToBottomWhenStopStreaming();
    useScrollToBottomOnPageLoad({ chatElement: mainRef.current });
    useScrollToBottomWhenStreaming({ chatElement: mainRef.current });

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

    const Row = ({ index }: { index: number }) => (
        <ChatMessage message={displayedMessages[index]} selectVariant={selectMessage} />
    );

    const lastMessage = displayedMessages[displayedMessages.length - 1];

    return (
        <main
            ref={mainRef}
            onLoad={() => adjustScrollbarVisibility()}
            id="chat"
            className="flex-1 flex justify-center overflow-y-auto !relative px-5 transition-transform mb-[95px] md:mb-[5px]"
            onScroll={attachToBottomBasedOnScroll}
        >
            <div
                className={`w-full max-w-[800px] h-full ${appError && "h-full flex flex-col justify-between items-stretch"}`}
            >
                {/* <Virtuoso
                    style={{ height: "100%" }}
                    data={displayedMessages.slice(0, -1)}
                    followOutput={true}
                    overscan={500}
                    itemContent={(index, message) => (
                        <ChatMessage
                            message={message}
                            selectVariant={(variant: Message) => selectMessage(variant)}
                        />
                    )}
                />
                {lastMessage && (
                    <ChatMessage
                        message={lastMessage}
                        selectVariant={(variant: Message) => selectMessage(variant)}
                    />
                )} */}
                <div className="pb-[40px]">
                    <AnimatePresence mode="popLayout">
                        {displayedMessages.map((message, index) => (
                            <ChatMessage
                                key={index}
                                message={message}
                                selectVariant={(variant: Message) => selectMessage(variant)}
                            />
                        ))}
                    </AnimatePresence>
                    <div id="chat-end" className="h-5"></div>
                </div>
                <ErrorMessage />
            </div>
        </main>
    );
}
