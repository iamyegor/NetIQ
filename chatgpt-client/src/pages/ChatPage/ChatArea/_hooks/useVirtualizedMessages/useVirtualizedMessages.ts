import useMessageStore from "@/lib/zustand/messages/useMessageStore";
import Message from "@/types/chat/Message";
import { MutableRefObject, useMemo } from "react";
import useChatUiStore from "@/lib/zustand/chatsUi/useChatsUiStore.ts";

export default function useVirtualizedMessages(
    messageHeights: MutableRefObject<Map<string, number>>,
) {
    const { displayedMessages } = useMessageStore();
    const { chatScrollTop } = useChatUiStore();
    const { chatRef } = useChatUiStore();

    function getMessageHeight(message: Message): number {
        return messageHeights.current.get(message.id) || 0;
    }

    function calculateVisibleIndices() {
        let cumulativeHeight = 0;
        let startIdx = 0;
        const bufferHeight = 120;

        for (let i = 0; i < displayedMessages.length; i++) {
            const message = displayedMessages[i];
            const height = getMessageHeight(message);
            if (cumulativeHeight + height > chatScrollTop - bufferHeight) {
                startIdx = i;
                break;
            }
            cumulativeHeight += height;
        }

        cumulativeHeight = 0;
        let endIdx = displayedMessages.length - 1;

        const containerHeight = chatRef.current?.clientHeight ?? 0;

        for (let i = 0; i < displayedMessages.length; i++) {
            const message = displayedMessages[i];
            const height = getMessageHeight(message);
            cumulativeHeight += height;
            if (cumulativeHeight > chatScrollTop + containerHeight + bufferHeight) {
                endIdx = i;
                break;
            }
        }

        return { start: startIdx, end: endIdx };
    }

    function getHeightBeforeIndex(index: number) {
        let total = 0;
        for (let i = 0; i < index; i++) {
            const message = displayedMessages[i];
            if (!message) {
                return 0;
            }
            total += getMessageHeight(message);
        }
        return total;
    }

    function getHeightAfterIndex(index: number) {
        let total = 0;
        for (let i = index + 1; i < displayedMessages.length; i++) {
            const message = displayedMessages[i];
            if (!message) {
                return 0;
            }
            total += getMessageHeight(message);
        }
        return total;
    }

    const { start, end } = useMemo(() => {
        if (displayedMessages.length > 0) {
            return calculateVisibleIndices();
        } else {
            return { start: 0, end: 0 };
        }
    }, [chatScrollTop, displayedMessages, messageHeights]);

    const visibleMessages = displayedMessages.slice(start, end + 1);
    const paddingTop = getHeightBeforeIndex(start);
    const paddingBottom = getHeightAfterIndex(end);

    return {
        visibleMessages,
        paddingTop,
        paddingBottom,
        messageHeights,
    };
}
