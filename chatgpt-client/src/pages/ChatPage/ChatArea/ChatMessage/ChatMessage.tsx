import AssistantMessage from "@/pages/ChatPage/ChatArea/ChatMessage/AssistantMessage/AssistantMessage";
import UserMessage from "@/pages/ChatPage/ChatArea/ChatMessage/UserMessage/UserMessage";
import Message from "@/types/chat/Message";
import { useRef, useEffect } from "react";

const gapBetweenMessages = 50;

export default function ChatMessage({
    message,
    selectVariant,
    setMessageHeight,
}: {
    message: Message;
    selectVariant: (message: Message) => void;
    setMessageHeight: (id: string, height: number) => void;
}) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ref.current) {
            const height = ref.current.offsetHeight;
            setMessageHeight(
                message.id,
                height + (message.sender === "user" ? gapBetweenMessages : 0),
            );
        }
    }, [ref.current?.offsetHeight]);

    return (
        <div ref={ref}>
            {message.sender === "user" ? (
                <UserMessage message={message} selectVariant={selectVariant} />
            ) : message.sender === "assistant" ? (
                <AssistantMessage message={message} selectVariant={selectVariant} />
            ) : null}
        </div>
    );
}
