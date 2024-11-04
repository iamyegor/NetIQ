import ChatMessage from "@/pages/ChatPage/ChatArea/ChatMessage/ChatMessage.tsx";
import React, { MutableRefObject, useMemo } from "react";
import useVirtualizedMessages from "@/pages/ChatPage/ChatArea/_hooks/useVirtualizedMessages/useVirtualizedMessages.ts";
import { useSelectMessage } from "@/pages/ChatPage/ChatArea/_hooks/useSelectVariant.ts";
import useUiStore from "@/lib/zustand/ui/useUiStore.ts";
import useMediaQueries from "@/hooks/other/useMediaQueries.tsx";

export default function VirtualizedMessages({
    messageHeights,
}: {
    messageHeights: MutableRefObject<Map<string, number>>;
}) {
    const { visibleMessages, paddingTop, paddingBottom } = useVirtualizedMessages(messageHeights);
    const { selectMessage } = useSelectMessage();
    const { inputContainerHeight } = useUiStore();
    const { isMdScreen } = useMediaQueries();

    const inputContainerHeightOr0 = useMemo(() => {
        if (!isMdScreen) {
            return inputContainerHeight - 40;
        }
        return 0;
    }, [inputContainerHeight]);

    return (
        <div
            style={{
                paddingTop: paddingTop,
                paddingBottom: paddingBottom + 35 + inputContainerHeightOr0,
            }}
        >
            {visibleMessages.map((message) => (
                <ChatMessage key={message.id} message={message} selectVariant={selectMessage} />
            ))}
            <div id="chat-end" className="h-5"></div>
        </div>
    );
}
