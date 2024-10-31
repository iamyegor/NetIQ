import useChatManagement from "@/hooks/chat/useChatManagement";
import useInsertAssistantFillerMessage from "@/hooks/streaming/helpers/useInsertAssistantFillerMessage";
import useInsertUserFillerMessage from "@/hooks/streaming/helpers/useInsertUserFillerMessage";
import useEventSourceStore from "@/lib/zustand/evenSource/useEventSourceStore";
import useMessageStore from "@/lib/zustand/messages/useMessageStore";
import useModelStore from "@/lib/zustand/model/useModelStore";
import { useNavigate } from "react-router-dom";

export default function useSendPromptAndStreamChat() {
    const navigate = useNavigate();
    const { startEventSource } = useEventSourceStore();
    const { displayedMessages, replaceFillerMessageIds, addContentToLastMessage } =
        useMessageStore();
    const { insertUserFillerMessage } = useInsertUserFillerMessage();
    const { insertAssistantFillerMessage } = useInsertAssistantFillerMessage();
    const { addChat } = useChatManagement();
    const { selectedModel } = useModelStore();

    function handleEventSourceMessage(event: MessageEvent, isNewChat: boolean) {
        const data = JSON.parse(event.data);

        if (data.type === "init_data") {
            replaceFillerMessageIds({
                userMessageId: data.userMessageId,
                assistantMessageId: data.assistantMessageId,
            });

            if (isNewChat && data.chat) {
                addChat(data.chat);
                navigate(`/chats/${data.chat.id}`, { replace: true });
            }
        } else if (data.type === "assistant_message_content") {
            addContentToLastMessage(data.content);
        }
    }

    async function sendPromptAndStreamChat(chatId: string | null, messageContent: string) {
        const userFillerMessage = insertUserFillerMessage(
            messageContent,
            displayedMessages[displayedMessages.length - 1]?.id ?? null,
        );
        insertAssistantFillerMessage(userFillerMessage.id);

        const queryParams = chatId ? `chatId=${chatId}` : "";
        startEventSource({
            url: `prompts?${queryParams}`,
            body: {
                displayedMessageIds: displayedMessages.map((msg) => msg.id),
                messageContent,
                model: selectedModel?.id,
            },
            handler: (event) => handleEventSourceMessage(event, !chatId),
        });
    }

    return { sendPromptAndStreamChat };
}
