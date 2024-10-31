import useScrollChatToBottom from "@/hooks/chat/useScrollChatToBottom";
import useMessageStore from "@/lib/zustand/messages/useMessageStore";
import useUiStore from "@/lib/zustand/ui/useUiStore";
import { useEffect } from "react";

export default function useScrollToBottomWhenStreaming({
    chatElement,
}: {
    chatElement: HTMLElement | null;
}) {
    const { isStreaming, displayedMessages } = useMessageStore();
    const { hasChatScrollbar, shouldAttachToBottom, promptWasSentLessThan100MsAgo } = useUiStore();
    const { scrollChatToBottom } = useScrollChatToBottom();

    useEffect(() => {
        if (
            isStreaming &&
            shouldAttachToBottom &&
            !promptWasSentLessThan100MsAgo &&
            hasChatScrollbar
        ) {
            scrollChatToBottom();
        }
    }, [displayedMessages, isStreaming]);
}
