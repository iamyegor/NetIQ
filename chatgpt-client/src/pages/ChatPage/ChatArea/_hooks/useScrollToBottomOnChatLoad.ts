import useScrollChatToBottom from "@/hooks/chat/useScrollChatToBottom";
import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import useMessageStore from "@/lib/zustand/messages/useMessageStore.ts";

export default function useScrollToBottomOnChatLoad() {
    const { chatId } = useParams();
    const prevChatIdRef = useRef<string | null>(null);
    const { scrollChatToBottom } = useScrollChatToBottom();
    const { displayedMessages } = useMessageStore();

    useEffect(() => {
        if (prevChatIdRef.current != chatId && displayedMessages.length > 0) {
            scrollChatToBottom({ isSmooth: true });

            prevChatIdRef.current = chatId ?? null;
        }
    }, [chatId, displayedMessages]);
}
