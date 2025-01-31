import useMediaQueries from "@/hooks/other/useMediaQueries.tsx";
import useMessageStore from "@/lib/zustand/messages/useMessageStore";
import useUiStore from "@/lib/zustand/ui/useUiStore.ts";
import { useSelectMessage } from "@/pages/ChatPage/ChatArea/_hooks/useSelectVariant.ts";
import useVirtualizedMessages from "@/pages/ChatPage/ChatArea/_hooks/useVirtualizedMessages/useVirtualizedMessages.ts";
import ChatMessage from "@/pages/ChatPage/ChatArea/ChatMessage/ChatMessage.tsx";
import { MutableRefObject, useMemo } from "react";

export default function VirtualizedMessages({
    messageHeights,
}: {
    messageHeights: MutableRefObject<Map<string, number>>;
}) {
    // const { visibleMessages, paddingTop, paddingBottom } = useVirtualizedMessages(messageHeights);
    const { displayedMessages } = useMessageStore();
    const { selectMessage } = useSelectMessage();
    const { inputContainerHeight } = useUiStore();
    const { isMdScreen } = useMediaQueries();

    // const inputContainerHeightOr0 = useMemo(() => {
    //     if (!isMdScreen) {
    //         return inputContainerHeight - 40;
    //     }
    //     return 0;
    // }, [inputContainerHeight]);

    return (
        <div>
            {displayedMessages.map((message) => (
                <ChatMessage key={message.id} message={message} selectVariant={selectMessage} />
            ))}
            <div id="chat-end" className="h-5"></div>
        </div>
    );
}
