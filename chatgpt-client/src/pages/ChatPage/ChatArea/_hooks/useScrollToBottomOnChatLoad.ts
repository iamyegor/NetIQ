import useScrollChatToBottom from "@/hooks/chat/useScrollChatToBottom";
import useMessageStore from "@/lib/zustand/messages/useMessageStore";
import Message from "@/types/chat/Message";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { animateScroll } from "react-scroll";

export default function useScrollToBottomOnChatLoad({
    visibleMessages,
}: {
    visibleMessages: Message[];
}) {
    const { chatId } = useParams();
    const prevChatIdRef = useRef<string | null>(null);
    const { scrollChatToBottom } = useScrollChatToBottom();
    const { displayedMessages } = useMessageStore();
    const [isFirstRender, setIsFirstRender] = useState(true);

    useEffect(() => {
        if (visibleMessages.length > 0) {
            // if (chatEnd && (isFirstRender || prevChatIdRef.current != chatId)) {
            if (isFirstRender) {
                setIsFirstRender(false);
                animateScroll.scrollToBottom({
                    containerId: "chat-end",
                    duration: 1000,
                    smooth: true,
                });
                // scrollChatToBottom({ scrollType: "super-smooth" });
            }

            prevChatIdRef.current = chatId ?? null;
        }
    }, [displayedMessages, visibleMessages]);
}
