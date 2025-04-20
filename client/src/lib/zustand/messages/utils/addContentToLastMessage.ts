import Message from "@/types/chat/Message.ts";

export default function addContentToLastMessage(messages: Message[], content: string): Message[] {
    if (messages.length === 0) {
        throw new Error(
            "Trying to add a content to the last message when the array of messages is empty is unexpected behavior",
        );
    }

    return [
        ...messages.slice(0, -1),
        {
            ...messages[messages.length - 1],
            content: messages[messages.length - 1].content + content,
        },
    ];
}
