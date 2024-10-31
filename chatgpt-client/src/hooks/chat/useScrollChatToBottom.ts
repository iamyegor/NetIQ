import useUiStore from "@/lib/zustand/ui/useUiStore.ts";
import { animateScroll } from "react-scroll";

export type ScrollType = "smooth" | "moderate" | "jerky" | "super-smooth";

export default function useScrollChatToBottom() {
    const { setScrollingInProgress, setShouldAttachToBottom } = useUiStore();

    function scrollChatToBottom(
        { scrollType }: { scrollType?: ScrollType } = { scrollType: "jerky" },
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
        animateScroll.scrollToBottom({
            containerId: "chat",
            duration: scrollSpeed,
            smooth: scrollType !== "jerky",
        });

        setTimeout(() => {
            setShouldAttachToBottom(true);
        }, scrollSpeed);

        setTimeout(() => {
            setScrollingInProgress(false);
        }, showScrollButtonTimeout);
    }

    return { scrollChatToBottom };
}
