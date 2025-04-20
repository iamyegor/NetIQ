import useMessageStore from "@/lib/zustand/messages/useMessageStore";
import Message from "@/types/chat/Message";
import { useMemo } from "react";

export default function useCalculateMessagesVariants(message: Message) {
    const { messages } = useMessageStore();

    return useMemo(
        () =>
            messages
                .filter((m) => m.linkId === message.linkId)
                .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
        [messages, message],
    );
}
