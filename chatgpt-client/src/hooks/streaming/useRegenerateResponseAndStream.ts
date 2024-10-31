import useInsertAssistantFillerMessage from "@/hooks/streaming/helpers/useInsertAssistantFillerMessage";
import useEventSourceStore from "@/lib/zustand/evenSource/useEventSourceStore";
import useMessageStore from "@/lib/zustand/messages/useMessageStore";
import useModelStore from "@/lib/zustand/model/useModelStore";
import { useParams } from "react-router-dom";
import Message from "@/types/chat/Message.ts";

export function useRegenerateResponseAndStream() {
    const { chatId } = useParams();
    const { displayedMessages, replaceFillerMessageIds, addContentToLastMessage } =
        useMessageStore();
    const { startEventSource } = useEventSourceStore();
    const { selectedModel } = useModelStore();
    const { insertAssistantFillerMessage } = useInsertAssistantFillerMessage();

    const handleRegenerateMessage = (event: MessageEvent) => {
        const data = JSON.parse(event.data);

        if (data.type === "init_data") {
            replaceFillerMessageIds({ assistantMessageId: data.assistantMessageId });
        } else if (data.type === "assistant_message_content") {
            addContentToLastMessage(data.content);
        }
    };

    function regenerateResponseAndStream(message: Message) {
        insertAssistantFillerMessage(message.linkId);

        const currentMessageIndex = displayedMessages.findIndex((m) => m.id === message.id);
        const displayedMessageIds = displayedMessages
            .slice(0, currentMessageIndex)
            .map((m) => m.id);

        startEventSource({
            url: `chats/${chatId}/messages/regenerate`,
            body: { displayedMessageIds, model: selectedModel?.id },
            handler: handleRegenerateMessage,
        });
    }

    return { regenerateResponseAndStream };
}
