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
import { useRef } from "react";
import { useParams } from "react-router-dom";
import "highlight.js/styles/atom-one-dark.css";

export default function ChatArea() {
    const mainRef = useRef<HTMLElement | null>(null);

    const { messages } = useMessageStore();
    const { appError } = useErrorStore();
    const { setChatHeight, setChatScrollTop } = useChatUiStore();

    const { chatId } = useParams<{ chatId: string }>();
    const { selectMessage } = useSelectMessage();
    const t = useChatAreaTranslation();
    const { messagesLoading } = useLoadMessages();
    const { attachToBottomBasedOnScroll } = useAttachToBottomBasedOnScroll();
    const { adjustScrollbarVisibility } = useCheckScrollbarVisibility({
        chatElement: mainRef.current,
    });
    const { visibleMessages, paddingTop, paddingBottom, onScroll, setMessageHeight } =
        useVirtualizedMessages({ containerRef: mainRef });

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
            onLoad={(e) => {
                adjustScrollbarVisibility();
                setChatHeight(e.currentTarget.scrollHeight);
                setChatScrollTop(e.currentTarget.scrollTop);
            }}
            id="chat"
            className="flex-1 flex justify-center overflow-y-auto !relative px-5 transition-transform mb-[95px] md:mb-[5px]"
            onScroll={(e: React.UIEvent<HTMLDivElement>) => {
                attachToBottomBasedOnScroll(e);
                onScroll();
                setChatHeight(e.currentTarget.scrollHeight);
                setChatScrollTop(e.currentTarget.scrollTop);
            }}
        >
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
                            setMessageHeight={setMessageHeight}
                        />
                    ))}
                    <div id="chat-end" className="h-5"></div>
                </div>
                <ErrorMessage />
            </div>
        </main>
    );
}
