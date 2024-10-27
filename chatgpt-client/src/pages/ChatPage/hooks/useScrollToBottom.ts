import { Dispatch, SetStateAction } from "react";
import { animateScroll } from "react-scroll";

export type ScrollType = "smooth" | "moderate" | "jerky";

export default function useScrollToBottom(
    setCanShowScrollButton: Dispatch<SetStateAction<boolean>>,
    setIsAtBottom: Dispatch<SetStateAction<boolean>>,
) {
    function scrollChatToBottom(
        { scrollType }: { scrollType?: ScrollType } = { scrollType: "jerky" },
    ) {
        const scrollSpeed = scrollType === "smooth" ? 300 : scrollType === "moderate" ? 80 : 0;
        const showScrollButtonTimeout =
            scrollType === "smooth" || scrollType === "moderate" ? scrollSpeed + 50 : 0;

        setCanShowScrollButton(false);
        animateScroll.scrollToBottom({
            containerId: "chat",
            duration: scrollSpeed,
            smooth: scrollType === "smooth" || scrollType === "moderate",
        });

        setTimeout(() => {
            setIsAtBottom(true);
        }, scrollSpeed);

        setTimeout(() => {
            setCanShowScrollButton(true);
        }, showScrollButtonTimeout);
    }

    return scrollChatToBottom;
}
