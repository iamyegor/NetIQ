import useMessageStore from "@/lib/zustand/messages/useMessageStore";
import Message from "@/types/chat/Message.ts";

export default function useInsertUserFillerMessage() {
    const { addNewMessage } = useMessageStore();

    function insertUserFillerMessage(message: string, linkId: string | null) {
        const tempUserMessage: Message = {
            id: "temp-user-id",
            content: message,
            sender: "user",
            createdAt: new Date().toISOString(),
            linkId: linkId,
            isSelected: true,
        };

        addNewMessage(tempUserMessage);

        return tempUserMessage;
    }

    return { insertUserFillerMessage };
}
