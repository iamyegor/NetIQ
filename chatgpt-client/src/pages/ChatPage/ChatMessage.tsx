import { Message } from "@/pages/ChatPage/types.ts";
import React from "react";
import UserMessage from "@/pages/ChatPage/UserMessage.tsx";
import AssistantMessage from "@/pages/ChatPage/AssistantMessage.tsx";

const ChatMessage = ({
    message,
    isStreaming,
    isLast,
    variants,
    selectVariant,
    regenerateResponse,
    editPrompt,
}: {
    message: Message;
    isStreaming: boolean;
    isLast: boolean;
    variants: Message[];
    selectVariant: (message: Message) => void;
    regenerateResponse: () => void;
    editPrompt: (messageId: string, messageContent: string) => void;
}) => {
    if (message.sender === "user") {
        return (
            <UserMessage
                message={message}
                editPrompt={editPrompt}
                variants={variants}
                selectVariant={selectVariant}
            />
        );
    } else if (message.sender === "assistant") {
        return (
            <AssistantMessage
                message={message}
                isStreaming={isStreaming}
                isLast={isLast}
                variants={variants}
                selectVariant={selectVariant}
                regenerateResponse={regenerateResponse}
            />
        );
    }
};

export default ChatMessage;
