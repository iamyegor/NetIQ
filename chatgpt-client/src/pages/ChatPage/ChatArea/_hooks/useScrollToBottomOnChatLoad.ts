import useScrollChatToBottom from "@/hooks/chat/useScrollChatToBottom";
import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import useChatUiStore from "@/lib/zustand/chatsUi/useChatsUiStore.ts";

export default function useScrollToBottomOnChatLoad() {
    const { chatId } = useParams();
    const prevChatIdRef = useRef<string | null>(null);
    const { scrollChatToBottom } = useScrollChatToBottom();
    // const { displayedMessages } = useMessageStore();
    // // const [isFirstRender, setIsFirstRender] = useState(true);
    const { hasChatScrollbar } = useChatUiStore();
    // const { chatHeight } = useChatUiStore();

    useEffect(() => {
        if (prevChatIdRef.current != chatId && hasChatScrollbar) {
            scrollChatToBottom({ isSmooth: true });
        }

        prevChatIdRef.current = chatId ?? null;
    }, [chatId, hasChatScrollbar]);
}
