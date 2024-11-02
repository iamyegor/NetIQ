import AssistantMessage from "@/pages/ChatPage/ChatArea/ChatMessage/AssistantMessage/AssistantMessage";
import UserMessage from "@/pages/ChatPage/ChatArea/ChatMessage/UserMessage/UserMessage";
import Message from "@/types/chat/Message";

export default function ChatMessage({
    message,
    selectVariant,
    shouldHighlightCode = true,
}: {
    message: Message;
    selectVariant: (message: Message) => void;
    shouldHighlightCode?: boolean;
}) {
    return (
        <div>
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
