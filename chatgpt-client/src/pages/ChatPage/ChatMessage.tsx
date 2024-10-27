import { useAppContext } from "@/context/AppContext";
import AssistantMessage from "@/pages/ChatPage/AssistantMessage/AssistantMessage";
import { Message } from "@/pages/ChatPage/types.ts";
import UserMessage from "@/pages/ChatPage/UserMessage/UserMessage";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatMessage({
    message,
    variants,
    selectVariant,
}: {
    message: Message;
    variants: Message[];
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
                    <UserMessage
                        message={message}
                        variants={variants}
                        selectVariant={selectVariant}
                    />
                ) : message.sender === "assistant" ? (
                    <AssistantMessage
                        message={message}
                        variants={variants}
                        selectVariant={selectVariant}
                    />
                ) : null}
            </motion.div>
        </AnimatePresence>
    );
}
