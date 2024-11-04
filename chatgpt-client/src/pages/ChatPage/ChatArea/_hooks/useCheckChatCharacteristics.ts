import { RefObject, useEffect } from "react";
import useChatUiStore from "@/lib/zustand/chatsUi/useChatsUiStore.ts";
import { useParams } from "react-router-dom";

export default function useCheckChatCharacteristics(chatRef: RefObject<HTMLDivElement>) {
    const { chatId } = useParams();
    const { setChatHeight, setChatScrollTop, setChatContainerHeight } = useChatUiStore();

    useEffect(() => {
        setChatScrollTop(chatRef.current?.scrollTop ?? 0);
    }, [chatId]);

    useEffect(() => {
        if (!chatRef.current) return;

        const resizeObserver = new ResizeObserver(checkScrollAndHeight);
        if (chatRef.current) {
            resizeObserver.observe(chatRef.current);
        }

        function checkScrollAndHeight() {
            const chatElement = chatRef.current;
            if (!chatElement) return;

            setChatHeight(chatRef.current.scrollHeight);
            setChatContainerHeight(chatRef.current.clientHeight);
        }
    }, []);
}
