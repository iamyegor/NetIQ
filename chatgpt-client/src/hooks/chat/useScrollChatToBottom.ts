import useChatUiStore from "@/lib/zustand/chatsUi/useChatsUiStore.ts";
import useUiStore from "@/lib/zustand/ui/useUiStore";
import { animateScroll } from "react-scroll";

export default function useScrollChatToBottom() {
    const { chatRef } = useChatUiStore();
    const { setScrollingInProgress, setIsAttachedToBottom } = useUiStore();

    function scrollChatToBottom({ isSmooth }: { isSmooth: boolean }) {
        const chat = chatRef.current;
        if (!chat) return;

        setScrollingInProgress(true);
        const wholePath = chat.scrollHeight - chat.scrollTop;
        const duration = isSmooth ? Math.max(500, wholePath / 20) : 0;

        animateScroll.scrollToBottom({
            containerId: "chat",
            smooth: isSmooth ? "easeOutQuad" : false,
            duration,
        });

        setTimeout(() => {
            setIsAttachedToBottom(true);
            setScrollingInProgress(false);
        }, duration);
    }

    return { scrollChatToBottom };
}
