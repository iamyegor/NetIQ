import useMessageStore from "@/lib/zustand/messages/useMessageStore";
import Message from "@/types/chat/Message.ts";

export default function useInsertAssistantFillerMessage() {
    const { addNewMessage } = useMessageStore();

    function insertAssistantFillerMessage(linkId: string | null) {
        const tempAssistantMessage: Message = {
            id: "temp-assistant-id",
            content: "",
            sender: "assistant",
            createdAt: new Date().toISOString(),
            linkId: linkId,
            isSelected: true,
        };

        addNewMessage(tempAssistantMessage);

        return tempAssistantMessage;
    }

    return { insertAssistantFillerMessage };
}
