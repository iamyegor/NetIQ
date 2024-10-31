import getMessagesToDisplay from "@/lib/zustand/messages/utils/getMessagesToDisplay";
import Message from "@/types/chat/Message.ts";

export default function createMessageState(messages: Message[]) {
    return {
        messages,
        displayedMessages: getMessagesToDisplay(messages),
    };
}
