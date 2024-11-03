import { RefObject, useEffect } from "react";
import useChatUiStore from "@/lib/zustand/chatsUi/useChatsUiStore.ts";

export default function useCheckScrollbarVisibility(chatRef: RefObject<HTMLDivElement>) {
    const { setHasChatScrollbar } = useChatUiStore();

    useEffect(() => {
        function checkScrollbar() {
            const chatElement = chatRef.current;
            if (!chatElement) return;

            const hasVerticalScrollbar = chatElement.scrollHeight > chatElement.clientHeight;
            setHasChatScrollbar(hasVerticalScrollbar);
        }

        checkScrollbar();

        const resizeObserver = new ResizeObserver(checkScrollbar);
        if (chatRef.current) {
            resizeObserver.observe(chatRef.current);
        }

        return () => resizeObserver.disconnect();
    }, []);
}
