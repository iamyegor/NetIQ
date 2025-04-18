import api from "@/lib/backend/api.ts";
import useEventSourceStore from "@/lib/zustand/evenSource/useEventSourceStore.ts";
import useMessageStore from "@/lib/zustand/messages/useMessageStore.ts";
import { useParams } from "react-router-dom";
import Message from "@/types/chat/Message.ts";
import { useCallback } from "react";

export function useSelectMessage() {
    const { chatId } = useParams();
    const { stopEventSource } = useEventSourceStore();
    const { selectMessage } = useMessageStore();

    const handleSelectMessage = useCallback(async (message: Message) => {
        stopEventSource();
        selectMessage(message);
        await api.post(`/chats/${chatId}/messages/${message.id}/select`, {
            linkId: message.linkId,
        });
    }, []);

    return { selectMessage: handleSelectMessage };
}
