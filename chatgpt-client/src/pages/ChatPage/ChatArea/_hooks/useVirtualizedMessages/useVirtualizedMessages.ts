import useChatUiStore from "@/lib/zustand/chatsUi/useChatsUiStore";
import useMessageStore from "@/lib/zustand/messages/useMessageStore";
import estimateMessageHeight from "@/pages/ChatPage/ChatArea/_hooks/useVirtualizedMessages/_utils/estimateMessageHeight";
import Message from "@/types/chat/Message";
import { useEffect, useRef, useState } from "react";

export default function useVirtualizedMessages({
    containerRef,
}: {
    containerRef: React.RefObject<HTMLElement | null>;
}) {
    const [version, setVersion] = useState(1);
    const { displayedMessages } = useMessageStore();
    const [scrollTop, setScrollTop] = useState(0);
    const [visibleIndices, setVisibleIndices] = useState({ start: 0, end: 0 });
    const messageHeights = useRef<Map<string, number>>(new Map());
    const estimatedHeights = useRef<Map<string, number>>(new Map());
    const [containerHeight, setContainerHeight] = useState(0);
    const [containerWidth, setContainerWidth] = useState(760);
    const { chatHeight } = useChatUiStore();

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
        } else {
            setVersion((prev) => prev + 1);
        }
    }, [containerRef, version]);

    useEffect(() => {
        if (displayedMessages.length > 0) {
            estimatedHeights.current = new Map();
            displayedMessages.forEach((message) => {
                estimatedHeights.current.set(
                    message.id,
                    estimateMessageHeight(message, containerWidth),
                );
            });
        }
    }, [displayedMessages, containerWidth]);

    useEffect(() => {
        calculateVisibleIndices();
    }, [scrollTop, containerHeight, displayedMessages, containerWidth]);

    function onScroll() {
        if (containerRef.current) {
            setScrollTop(containerRef.current.scrollTop);
        }
    }

    const estimatedHeight = Array.from(estimatedHeights.current.values()).reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0,
    );

    console.log({ estimatedHeights });
    // console.log({ estimatedHeight, chatHeight });

    function getMessageHeight(message: Message): number {
        return (
            messageHeights.current.get(message.id) || estimatedHeights.current.get(message.id) || 0
        );
    }

    function calculateVisibleIndices() {
        let cumulativeHeight = 0;
        let startIdx = 0;
        const bufferHeight = containerHeight;

        for (let i = 0; i < displayedMessages.length; i++) {
            const message = displayedMessages[i];
            const height = getMessageHeight(message);
            if (cumulativeHeight + height > scrollTop - bufferHeight) {
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
            if (cumulativeHeight > scrollTop + containerHeight + bufferHeight) {
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
            total += getMessageHeight(message);
        }
        return total;
    }

    function getHeightAfterIndex(index: number) {
        let total = 0;
        for (let i = index + 1; i < displayedMessages.length; i++) {
            const message = displayedMessages[i];
            total += getMessageHeight(message);
        }
        return total;
    }

    const { start, end } = visibleIndices;
    const visibleMessages = displayedMessages.slice(start, end + 1);

    const paddingTop = getHeightBeforeIndex(start);
    const paddingBottom = getHeightAfterIndex(end);

    function setMessageHeight(id: string, height: number) {
        if (messageHeights.current.get(id) !== height) {
            messageHeights.current.set(id, height);
        }
    }

    return { visibleMessages, paddingTop, paddingBottom, onScroll, setMessageHeight };
}
