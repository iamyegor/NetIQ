import useScrollChatToBottom from "@/hooks/chat/useScrollChatToBottom";
import useMessageStore from "@/lib/zustand/messages/useMessageStore";
import useUiStore from "@/lib/zustand/ui/useUiStore";
import { useEffect, useRef } from "react";
import useHasChatScrollbar from "@/hooks/chat/useHasChatScrollbar.ts";

export default function useScrollToBottomWhenStreaming() {
    const { isStreaming, displayedMessages } = useMessageStore();
    const prevIsStreaming = useRef<boolean>(isStreaming);
    const { isAttachedToBottom, promptWasSentLessThan100MsAgo } = useUiStore();
    const hasChatScrollbar = useHasChatScrollbar();
    const { scrollChatToBottom } = useScrollChatToBottom();

    useEffect(() => {
        if (
            isStreaming &&
            isAttachedToBottom &&
            !promptWasSentLessThan100MsAgo &&
            hasChatScrollbar
        ) {
            scrollChatToBottom({ isSmooth: false });
        }
    }, [displayedMessages, isStreaming]);

    useEffect(() => {
        if (
            prevIsStreaming.current &&
            prevIsStreaming.current != isStreaming &&
            isAttachedToBottom
        ) {
            scrollChatToBottom({ isSmooth: true });
        }

        prevIsStreaming.current = isStreaming;
    }, [isStreaming]);
}
