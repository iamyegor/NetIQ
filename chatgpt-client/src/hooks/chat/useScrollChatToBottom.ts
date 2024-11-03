import useChatUiStore from "@/lib/zustand/chatsUi/useChatsUiStore.ts";
import useUiStore from "@/lib/zustand/ui/useUiStore";
import { animateScroll } from "react-scroll";

export default function useScrollChatToBottom() {
    const { chatHeight, chatScrollTop } = useChatUiStore();
    const { setScrollingInProgress, setShouldAttachToBottom } = useUiStore();

    function scrollChatToBottom({ isSmooth }: { isSmooth: boolean }) {
        console.log("go");
        setScrollingInProgress(true);
        const wholePath = chatHeight - chatScrollTop;
        // animateScroll.scrollMore(wholePath, {
        //     containerId: "chat",
        //     smooth: config.smooth,
        // });
        const duration = isSmooth ? Math.max(500, wholePath / 20) : 0;
        animateScroll.scrollToBottom({
            containerId: "chat",
            smooth: isSmooth ? "easeOutQuad" : false,
            duration,
        });

        setTimeout(() => {
            setShouldAttachToBottom(true);
            setScrollingInProgress(false);
        }, duration);
    }

    return { scrollChatToBottom };
}
