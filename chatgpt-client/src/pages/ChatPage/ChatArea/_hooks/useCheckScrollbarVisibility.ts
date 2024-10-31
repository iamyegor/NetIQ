import useMessageStore from "@/lib/zustand/messages/useMessageStore";
import useUiStore from "@/lib/zustand/ui/useUiStore";
import { useEffect } from "react";

export default function useCheckScrollbarVisibility({
    chatElement,
}: {
    chatElement: HTMLElement | null;
}) {
    const { displayedMessages } = useMessageStore();
    const { hasChatScrollbar, setHasChatScrollbar } = useUiStore();

    useEffect(() => {
        if (chatElement) {
            adjustScrollbarVisibility();
        }
    }, [displayedMessages]);

    function adjustScrollbarVisibility() {
        // console.log({
        //     scrollHeight: chatElement?.scrollHeight,
        //     clientHeight: chatElement?.clientHeight,
        //     chatElement,
        // });
        if (chatElement) {
            const hasScroll = chatElement.scrollHeight > chatElement.clientHeight;
            // console.log({ hasScroll });
            setHasChatScrollbar(hasScroll);
        }
    }

    return { adjustScrollbarVisibility };
}
