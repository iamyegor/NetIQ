import AssistantMessage from "@/pages/ChatPage/ChatArea/ChatMessage/AssistantMessage/AssistantMessage.tsx";
import UserMessage from "@/pages/ChatPage/ChatArea/ChatMessage/UserMessage/UserMessage.tsx";
import { AnimatePresence, motion } from "framer-motion";
import Message from "@/types/chat/Message.ts";

export default function ChatMessage({
    message,
    selectVariant,
}: {
    message: Message;
    selectVariant: (message: Message) => void;
}) {
    return (
        <AnimatePresence mode="wait">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{
                    duration: 0.3,
                    ease: "easeInOut",
                }}
            >
                {message.sender === "user" ? (
                    <UserMessage message={message} selectVariant={selectVariant} />
                ) : message.sender === "assistant" ? (
                    <AssistantMessage message={message} selectVariant={selectVariant} />
                ) : null}
            </motion.div>
        </AnimatePresence>
    );
}
