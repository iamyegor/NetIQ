import { MutableRefObject, useEffect } from "react";
import useMessageStore from "@/lib/zustand/messages/useMessageStore.ts";

export default function useClearMessageHeightsOnChatSwitch({
    messageHeights,
}: {
    messageHeights: MutableRefObject<Map<string, number>>;
}) {
    const { messages } = useMessageStore();

    useEffect(() => {
        if (messages.length === 0) {
            messageHeights.current.clear();
        }
    }, [messages]);
}
