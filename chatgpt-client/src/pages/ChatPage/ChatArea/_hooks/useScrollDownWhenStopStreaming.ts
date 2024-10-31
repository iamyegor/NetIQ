import useMessageStore from "@/lib/zustand/messages/useMessageStore";
import useUiStore from "@/lib/zustand/ui/useUiStore";
import useScrollChatToBottom from "@/hooks/chat/useScrollChatToBottom.ts";
import { useEffect, useRef } from "react";

export default function useScrollToBottomWhenStopStreaming() {
    const { shouldAttachToBottom } = useUiStore();
    const { scrollChatToBottom } = useScrollChatToBottom();
    const { isStreaming } = useMessageStore();
    const prevIsStreaming = useRef<boolean>(isStreaming);

    useEffect(() => {
        if (
            prevIsStreaming.current &&
            prevIsStreaming.current != isStreaming &&
            shouldAttachToBottom
        ) {
            scrollChatToBottom({ scrollType: "moderate" });
        }

        prevIsStreaming.current = isStreaming;
    }, [isStreaming]);
}
