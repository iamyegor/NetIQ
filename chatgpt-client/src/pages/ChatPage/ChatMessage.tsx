import { Message } from "@/pages/ChatPage/types.ts";
import React from "react";
import UserMessage from "@/pages/ChatPage/UserMessage.tsx";
import AssistantMessage from "@/pages/ChatPage/AssistantMessage.tsx";

const ChatMessage = ({
    message,
    variants,
    selectVariant,
}: {
    message: Message;
    variants: Message[];
    selectVariant: (message: Message) => void;
}) => {
    if (message.sender === "user") {
        return (
            <UserMessage
                message={message}
                variants={variants}
                selectVariant={selectVariant}
            />
        );
    } else if (message.sender === "assistant") {
        return (
            <AssistantMessage
                message={message}
                variants={variants}
                selectVariant={selectVariant}
            />
        );
    }
};

export default ChatMessage;
