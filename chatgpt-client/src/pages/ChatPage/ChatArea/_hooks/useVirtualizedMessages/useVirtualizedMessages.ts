import useMessageStore from "@/lib/zustand/messages/useMessageStore";
import Message from "@/types/chat/Message";
import { RefObject, useEffect, useRef, useState } from "react";
import useChatUiStore from "@/lib/zustand/chatsUi/useChatsUiStore.ts";

export default function useVirtualizedMessages({
    containerRef,
}: {
    containerRef: RefObject<HTMLElement | null>;
}) {
    const { displayedMessages } = useMessageStore();
    const { chatScrollTop } = useChatUiStore();
    const [visibleIndices, setVisibleIndices] = useState({ start: 0, end: 0 });
    const messageHeights = useRef<Map<string, number>>(new Map());
    const [containerHeight, setContainerHeight] = useState(0);
    const [containerWidth, setContainerWidth] = useState(760);

    useEffect(() => {
        if (containerRef.current) {
            const resizeObserver = new ResizeObserver((entries) => {
                for (let entry of entries) {
                    setContainerHeight(entry.contentRect.height);
                    setContainerWidth(entry.contentRect.width);
                }
            });
            resizeObserver.observe(containerRef.current);
            return () => resizeObserver.disconnect();
        }
    }, [containerRef]);

    useEffect(() => {
        setContainerWidth(containerRef.current?.offsetWidth ?? 0);
        setContainerHeight(containerRef.current?.offsetHeight ?? 0);
    }, [displayedMessages, messageHeights]);

    useEffect(() => {
        if (displayedMessages.length > 0) {
            calculateVisibleIndices();
        }
    }, [chatScrollTop, containerHeight, displayedMessages, containerWidth, messageHeights]);

    // console.log({ messageHeights });

    function getMessageHeight(message: Message): number {
        return messageHeights.current.get(message.id) || 0;
    }

    function calculateVisibleIndices() {
        let cumulativeHeight = 0;
        let startIdx = 0;
        const bufferHeight = containerHeight;

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

        for (let i = 0; i < displayedMessages.length; i++) {
            const message = displayedMessages[i];
            const height = getMessageHeight(message);
            cumulativeHeight += height;
            if (cumulativeHeight > chatScrollTop + containerHeight + bufferHeight) {
                endIdx = i;
                break;
            }
        }

        setVisibleIndices({ start: startIdx, end: endIdx });
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

    const { start, end } = visibleIndices;

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
