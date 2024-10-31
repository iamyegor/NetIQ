import useInsertAssistantFillerMessage from "@/hooks/streaming/helpers/useInsertAssistantFillerMessage.ts";
import useInsertUserFillerMessage from "@/hooks/streaming/helpers/useInsertUserFillerMessage.ts";
import useEventSourceStore from "@/lib/zustand/evenSource/useEventSourceStore.ts";
import useMessageStore from "@/lib/zustand/messages/useMessageStore.ts";
import useModelStore from "@/lib/zustand/model/useModelStore.ts";
import { useParams } from "react-router-dom";
import Message from "@/types/chat/Message.ts";

export default function useEditPromptAndStream() {
    const { chatId } = useParams();
    const { selectedModel } = useModelStore();
    const { displayedMessages, replaceFillerMessageIds, addContentToLastMessage } =
        useMessageStore();
    const { startEventSource } = useEventSourceStore();
    const { insertUserFillerMessage } = useInsertUserFillerMessage();
    const { insertAssistantFillerMessage } = useInsertAssistantFillerMessage();

    function handleEventSourceMessage(event: MessageEvent) {
        const data = JSON.parse(event.data);

        if (data.type === "init_data") {
            replaceFillerMessageIds({
                userMessageId: data.userMessageId,
                assistantMessageId: data.assistantMessageId,
            });
        } else if (data.type === "assistant_message_content") {
            addContentToLastMessage(data.content);
        }
    }

    function editPromptAndPrompt(message: Message, messageContent: string) {
        const userFillerMessage = insertUserFillerMessage(messageContent, message.linkId);
        insertAssistantFillerMessage(userFillerMessage.id);

        const currentMessageIndex = displayedMessages.findIndex((m) => m.id === message.id);
        const displayedMessageIds = displayedMessages
            .slice(0, currentMessageIndex)
            .map((m) => m.id);

        startEventSource({
            url: `prompts?chatId=${chatId}`,
            body: { messageContent, displayedMessageIds, model: selectedModel?.id },
            handler: (msg) => handleEventSourceMessage(msg),
        });
    }

    return { editPromptAndPrompt };
}
