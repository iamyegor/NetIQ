import MessageIds from "@/types/MessageIds";
import Message from "@/types/chat/Message.ts";

export default function replaceFillerMessageIds(messages: Message[], ids: MessageIds): Message[] {
    return messages.map((message) => {
        if (message.id === "temp-user-id") {
            return {
                ...message,
                id: ids.userMessageId ? ids.userMessageId : message.id,
            };
        }

        if (message.id === "temp-assistant-id") {
            return {
                ...message,
                id: ids.assistantMessageId ? ids.assistantMessageId : message.id,
                linkId: ids.userMessageId ? ids.userMessageId : message.linkId,
            };
        }

        return message;
    });
}
