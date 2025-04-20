import useChatUiStore from "@/lib/zustand/chatsUi/useChatsUiStore.ts";
import { useMemo } from "react";

export default function useHasChatScrollbar() {
    const { chatHeight, chatContainerHeight } = useChatUiStore();
    return useMemo(() => chatHeight > chatContainerHeight, [chatHeight, chatContainerHeight]);
}
