import { useAppContext } from "@/context/AppContext";
import { Message } from "@/pages/ChatPage/types";
import { useEffect, useRef, useState } from "react";

export default function useScorllToBottomOnChatLoad({
    chatElement,
    displayedMessages,
}: {
    chatElement: HTMLElement | null;
    displayedMessages: Message[];
}) {
    const prevChatIdRef = useRef<string | null>(null);
    const { scrollToBottom, chatId } = useAppContext();
    const [isFirstRender, setIsFirstRender] = useState(true);

    useEffect(() => {
        if (chatElement && (isFirstRender || prevChatIdRef.current != chatId)) {
            setIsFirstRender(false);
            const hasScrollbar = chatElement.scrollHeight > chatElement.clientHeight;

            if (hasScrollbar) {
                scrollToBottom();
            }
        }
        prevChatIdRef.current = chatId ?? null;
    }, [displayedMessages]);
}
