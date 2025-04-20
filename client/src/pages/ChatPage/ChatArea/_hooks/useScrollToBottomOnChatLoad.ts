import useHasChatScrollbar from "@/hooks/chat/useHasChatScrollbar";
import useScrollChatToBottom from "@/hooks/chat/useScrollChatToBottom";
import useMessageStore from "@/lib/zustand/messages/useMessageStore.ts";
import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

export default function useScrollToBottomOnChatLoad() {
    const { chatId } = useParams();
    const prevChatIdRef = useRef<string | null>(null);
    const { scrollChatToBottom } = useScrollChatToBottom();
    const hasScrollbar = useHasChatScrollbar();
    const { displayedMessages } = useMessageStore();

    useEffect(() => {
        if (prevChatIdRef.current != chatId && displayedMessages.length > 0 && hasScrollbar) {
            scrollChatToBottom({ isSmooth: true });

            prevChatIdRef.current = chatId ?? null;
        }
    }, [chatId, displayedMessages, hasScrollbar]);
}
