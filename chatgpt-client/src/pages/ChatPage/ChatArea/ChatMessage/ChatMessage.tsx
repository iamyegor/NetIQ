import AssistantMessage from "@/pages/ChatPage/ChatArea/ChatMessage/AssistantMessage/AssistantMessage";
import UserMessage from "@/pages/ChatPage/ChatArea/ChatMessage/UserMessage/UserMessage";
import Message from "@/types/chat/Message";
import { useEffect, useRef } from "react";

export default function ChatMessage({
    message,
    selectVariant,
    shouldHighlightCode = true,
    setMessageHeight,
}: {
    message: Message;
    selectVariant: (message: Message) => void;
    shouldHighlightCode?: boolean;
    setMessageHeight?: (id: string, height: number) => void;
}) {
    const messageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!messageRef.current || !setMessageHeight) return;

        const paddingBottom = message.sender === "user" ? 32 : 0;
        setMessageHeight(message.id, messageRef.current.offsetHeight + paddingBottom);
    }, [message.content]);

    return (
        <div ref={messageRef}>
            {message.sender === "user" ? (
                <UserMessage message={message} selectVariant={selectVariant} />
            ) : message.sender === "assistant" ? (
                <AssistantMessage
                    shouldHighlightCode={shouldHighlightCode}
                    message={message}
                    selectVariant={selectVariant}
                />
            ) : null}
        </div>
    );
}
