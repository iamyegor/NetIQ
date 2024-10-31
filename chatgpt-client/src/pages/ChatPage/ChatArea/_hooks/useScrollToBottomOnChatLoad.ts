import useScrollChatToBottom from "@/hooks/chat/useScrollChatToBottom.ts";
import useMessageStore from "@/lib/zustand/messages/useMessageStore";
import useUiStore from "@/lib/zustand/ui/useUiStore";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

export default function useScrollToBottomOnChatLoad({
    chatElement,
}: {
    chatElement: HTMLElement | null;
}) {
    const prevChatIdRef = useRef<string | null>(null);
    const { chatId } = useParams();
    const { displayedMessages } = useMessageStore();
    const { scrollChatToBottom } = useScrollChatToBottom();
    const { hasChatScrollbar } = useUiStore();
    const [isFirstRender, setIsFirstRender] = useState(true);

    useEffect(() => {
        if (chatElement && (isFirstRender || prevChatIdRef.current != chatId)) {
            setIsFirstRender(false);
            const hasScrollbar = chatElement.scrollHeight > chatElement.clientHeight;

            if (hasScrollbar) {
                scrollChatToBottom();
            }
        }

        if (chatElement) {
            prevChatIdRef.current = chatId ?? null;
        }
    }, [displayedMessages]);
}
