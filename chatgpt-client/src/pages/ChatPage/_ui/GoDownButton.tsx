import { Button } from "@/components/ui/button.tsx";
import useScrollChatToBottom from "@/hooks/chat/useScrollChatToBottom.ts";
import useUiStore from "@/lib/zustand/ui/useUiStore.ts";
import { FaArrowDown } from "react-icons/fa";
import useChatUiStore from "@/lib/zustand/chatsUi/useChatsUiStore.ts";

export default function GoDownButton() {
    const { shouldAttachToBottom, scrollingInProgress, inputContainerHeight } = useUiStore();
    const { hasChatScrollbar } = useChatUiStore();

    const { scrollChatToBottom } = useScrollChatToBottom();

    return !shouldAttachToBottom && !scrollingInProgress && hasChatScrollbar ? (
        <div
            className="absolute left-1/2 -translate-x-1/2 z-40"
            style={{ bottom: `${inputContainerHeight + 30}px` }}
        >
            <Button
                size="icon"
                className="!bg-secondary border border-neutral-700 rounded-full w-11 h-11 sm:w-9 sm:h-9 hover:border-neutral-600"
                onClick={() => scrollChatToBottom({ isSmooth: true })}
            >
                <FaArrowDown className="text-neutral-200" />
            </Button>
        </div>
    ) : null;
}
