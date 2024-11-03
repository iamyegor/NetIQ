import useScrollChatToBottom from "@/hooks/chat/useScrollChatToBottom";
import useMessageStore from "@/lib/zustand/messages/useMessageStore";
import useUiStore from "@/lib/zustand/ui/useUiStore";
import { useEffect } from "react";
import useChatUiStore from "@/lib/zustand/chatsUi/useChatsUiStore.ts";

export default function useScrollToBottomWhenStreaming() {
    const { isStreaming, displayedMessages } = useMessageStore();
    const { shouldAttachToBottom, promptWasSentLessThan100MsAgo } = useUiStore();
    const { hasChatScrollbar } = useChatUiStore();
    const { scrollChatToBottom } = useScrollChatToBottom();

    useEffect(() => {
        if (
            isStreaming &&
            shouldAttachToBottom &&
            !promptWasSentLessThan100MsAgo &&
            hasChatScrollbar
        ) {
            scrollChatToBottom({ isSmooth: false });
        }
    }, [displayedMessages, isStreaming]);
}
