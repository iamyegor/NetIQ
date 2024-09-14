import { useEffect, useMemo, useState } from "react";
import { Message } from "@/pages/ChatPage/types.ts";

export default function useDisplayedMessages(messages: Message[]) {
    const [displayedMessages, setDisplayedMessages] = useState<Message[]>([]);

    const messageKeys = useMemo(() => {
        return messages.map((m) => `${m.id}-${m.isSelected}${m.content.length}`).join("|");
    }, [messages]);

    useEffect(() => {
        const getMessagesToDisplay = () => {
            const displayed: Message[] = [];

            // Build a Map from linkId to messages for quick lookup
            const messagesByLinkId = new Map<string | null, Message[]>();
            for (const message of messages) {
                const key = message.linkId;
                if (!messagesByLinkId.has(key)) {
                    messagesByLinkId.set(key, []);
                }
                messagesByLinkId.get(key)!.push(message);
            }

            let currentId: string | null = null;

            const firstMessages = messagesByLinkId.get(null) || [];
            if (firstMessages.length > 1) {
                const selectedFirst = firstMessages.find((m) => m.isSelected);
                if (selectedFirst) {
                    displayed.push(selectedFirst);
                    currentId = selectedFirst.id;
                }
            } else if (firstMessages.length === 1) {
                displayed.push(firstMessages[0]);
                currentId = firstMessages[0].id;
            }

            while (currentId) {
                const linkedMessages = messagesByLinkId.get(currentId) || [];
                if (linkedMessages.length > 0) {
                    const selectedLinked =
                        linkedMessages.find((m) => m.isSelected) || linkedMessages[0];
                    displayed.push(selectedLinked);
                    currentId = selectedLinked.id;
                } else {
                    currentId = null;
                }
            }

            return displayed;
        };

        setDisplayedMessages(getMessagesToDisplay());
    }, [messageKeys]);

    return displayedMessages;
}
