import { useEffect } from "react";
import useScrollChatToBottom from "@/hooks/chat/useScrollChatToBottom.ts";
import useMessageStore from "@/lib/zustand/messages/useMessageStore.ts";
import useHasChatScrollbar from "@/hooks/chat/useHasChatScrollbar.ts";

export default function useScrollToBottomOnMessageSend({
    isPromptSent,
    setIsPromptSent,
}: {
    isPromptSent: boolean;
    setIsPromptSent: (value: boolean) => void;
}) {
    const { messagesToMeasure } = useMessageStore();
    const { scrollChatToBottom } = useScrollChatToBottom();
    // const { isMdScreen } = useMediaQueries();
    const hasScrollbar = useHasChatScrollbar();

    useEffect(() => {
        if (messagesToMeasure.length === 0 && isPromptSent && hasScrollbar) {
            scrollChatToBottom({ isSmooth: true });
            setIsPromptSent(false);
        }
    }, [isPromptSent, messagesToMeasure.length]);
}
