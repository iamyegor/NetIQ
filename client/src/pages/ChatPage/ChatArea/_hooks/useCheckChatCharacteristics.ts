import { RefObject, useEffect } from "react";
import useChatUiStore from "@/lib/zustand/chatsUi/useChatsUiStore.ts";
import { useParams } from "react-router-dom";

export default function useCheckChatCharacteristics(chatRef: RefObject<HTMLDivElement | null>) {
    const { chatId } = useParams();
    const { setChatHeight, setChatScrollTop, setChatContainerHeight } = useChatUiStore();

    useEffect(() => {
        setChatScrollTop(chatRef.current?.scrollTop ?? 0);
    }, [chatId]);

    useEffect(() => {
        if (!chatRef.current) return;

        const resizeObserver = new ResizeObserver(() => checkScrollAndHeight(chatRef.current!));
        if (chatRef.current) {
            resizeObserver.observe(chatRef.current);
        }

        function checkScrollAndHeight(chatEl: HTMLDivElement) {
            if (chatEl === null) return;

            setChatHeight(chatEl.scrollHeight);
            setChatContainerHeight(chatEl.clientHeight);
        }
    }, []);
}
