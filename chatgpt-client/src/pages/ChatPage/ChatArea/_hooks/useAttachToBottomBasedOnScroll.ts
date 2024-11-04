import useMessageStore from "@/lib/zustand/messages/useMessageStore";
import useUiStore from "@/lib/zustand/ui/useUiStore";
import React, { useRef } from "react";

export default function useAttachToBottomBasedOnScroll() {
    const prevScrollTop = useRef(0);
    const { displayedMessages } = useMessageStore();
    const { setIsAttachedToBottom } = useUiStore();

    function attachToBottomBasedOnScroll(event: React.UIEvent<HTMLDivElement>) {
        const target = event.currentTarget;
        const atBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 5;

        const currentScrollTop = target.scrollTop;

        if (displayedMessages.length > 0 && currentScrollTop < prevScrollTop.current) {
            setIsAttachedToBottom(false);
        } else if (atBottom) {
            setIsAttachedToBottom(true);
        }

        prevScrollTop.current = currentScrollTop;
    }

    return { attachToBottomBasedOnScroll };
}
