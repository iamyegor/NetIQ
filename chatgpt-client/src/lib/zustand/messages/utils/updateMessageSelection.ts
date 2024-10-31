import Message from "@/types/chat/Message.ts";

export default function updateMessageSelection(
    messages: Message[],
    messageToSelect: Message,
): Message[] {
    return messages.map((message) => ({
        ...message,
        isSelected:
            message.id === messageToSelect.id
                ? true
                : message.linkId === messageToSelect.linkId
                  ? false
                  : message.isSelected,
    }));
}
