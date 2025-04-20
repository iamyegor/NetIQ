import { Button } from "@/components/ui/button.tsx";
import useHasChatScrollbar from "@/hooks/chat/useHasChatScrollbar.ts";
import useScrollChatToBottom from "@/hooks/chat/useScrollChatToBottom.ts";
import useUiStore from "@/lib/zustand/ui/useUiStore.ts";
import { ChevronDown } from "lucide-react";

export default function GoDownButton() {
    const { isAttachedToBottom, scrollingInProgress, inputContainerHeight } = useUiStore();
    const hasChatScrollbar = useHasChatScrollbar();
    const { scrollChatToBottom } = useScrollChatToBottom();

    return !isAttachedToBottom && !scrollingInProgress && hasChatScrollbar ? (
        <div
            className="absolute left-1/2 -translate-x-1/2 z-40"
            style={{ bottom: `${inputContainerHeight + 90}px` }}
        >
            <Button
                size="icon"
                className="!bg-secondary border border-neutral-700 rounded-full w-11 h-11 sm:w-9 sm:h-9 hover:border-neutral-600"
                onClick={() => scrollChatToBottom({ isSmooth: true })}
            >
                <ChevronDown className="text-neutral-200"/>
            </Button>
        </div>
    ) : null;
}
