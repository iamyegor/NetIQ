import { Dispatch, SetStateAction } from "react";
import { animateScroll } from "react-scroll";

export default function useScrollToBottom(
    setCanShowScrollButton: Dispatch<SetStateAction<boolean>>,
    setIsAtBottom: Dispatch<SetStateAction<boolean>>,
) {
    return (smooth: boolean = false) => {
        setCanShowScrollButton(false);
        animateScroll.scrollToBottom({
            containerId: "chat",
            duration: smooth ? 300 : 0,
            smooth,
        });

        setTimeout(
            () => {
                setIsAtBottom(true);
            },
            smooth ? 300 : 0,
        );

        setTimeout(
            () => {
                setCanShowScrollButton(true);
            },
            smooth ? 350 : 0,
        );
    };
}
