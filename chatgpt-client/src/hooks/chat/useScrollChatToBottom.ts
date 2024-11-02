import useChatUiStore from "@/lib/zustand/chatsUi/useChatsUiStore";
import useUiStore from "@/lib/zustand/ui/useUiStore.ts";
import { animateScroll } from "react-scroll";

export type ScrollType = "smooth" | "moderate" | "jerky" | "super-smooth";

export default function useScrollChatToBottom() {
    const { setScrollingInProgress, setShouldAttachToBottom } = useUiStore();
    const { chatHeight, chatScrollTop } = useChatUiStore();

    function scrollChatToBottom(
        { scrollType }: { scrollType?: ScrollType } = {
            scrollType: "jerky",
        },
    ) {
        const scrollSpeed =
            scrollType === "super-smooth"
                ? 500
                : scrollType === "smooth"
                  ? 300
                  : scrollType === "moderate"
                    ? 80
                    : 0;
        const showScrollButtonTimeout = scrollType !== "jerky" ? scrollSpeed + 50 : 0;

        setScrollingInProgress(true);

        const bufferLength = (chatHeight - chatScrollTop) / 15;
        const wholePath = chatHeight - chatScrollTop + bufferLength;
        const duration = wholePath / 20;
        animateScroll.scrollMore(wholePath, {
            containerId: "chat",
            smooth: true,
            duration: duration < 500 ? 500 : duration,
        });

        console.log({ time: duration < 500 ? 500 : duration });
        // animateScroll.scrollToBottom({
        //     containerId: "chat",
        //     duration: wholePath / 20,
        //     smooth: true,
        // });

        setTimeout(() => {
            setShouldAttachToBottom(true);
        }, scrollSpeed);

        setTimeout(() => {
            setScrollingInProgress(false);
        }, showScrollButtonTimeout);
    }

    return { scrollChatToBottom };
}
