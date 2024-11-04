import { memo, MutableRefObject, useEffect, useRef } from "react";
import ChatMessage from "@/pages/ChatPage/ChatArea/ChatMessage/ChatMessage.tsx";
import Message from "@/types/chat/Message.ts";
import useMessageStore from "@/lib/zustand/messages/useMessageStore.ts";

interface MessageHeightMeasurerProps {
    messages: Message[];
    prevChatIdRef: MutableRefObject<string | null>;
    messageHeights: MutableRefObject<Map<string, number>>;
    width: number;
}

const MessageHeightMeasurer = memo(function ({
    messages,
    messageHeights,
    width,
}: MessageHeightMeasurerProps) {
    const { messagesToMeasure, setMessagesToMeasure } = useMessageStore();
    const { isStreaming } = useMessageStore();
    const prevStreamingRef = useRef<boolean>(isStreaming);

    useEffect(() => {
        const measurementMessages: Message[] = messages.filter(
            (message) =>
                messageHeights.current.get(message.id) === undefined ||
                message.id === "temp-user-id" ||
                message.id === "temp-assistant-id" ||
                ((isStreaming || stoppedStreaming()) && isLastMessages(message)),
        );
        prevStreamingRef.current = isStreaming;

        setMessagesToMeasure(measurementMessages);
    }, [messages, isStreaming]);

    useEffect(() => {
        if (messagesToMeasure.length > 0) {
            setMessagesToMeasure([]);
        }
    }, [messagesToMeasure]);

    const stoppedStreaming = () => prevStreamingRef.current != isStreaming;
    const isLastMessages = (message: Message) => messages[messages.length - 1] == message;

    return (
        <div className="absolute invisible -left-[9999px] -top-[9999px]" style={{ width }}>
            {messagesToMeasure.map((message) => (
                <div key={message.id}>
                    <ChatMessage
                        message={message}
                        shouldHighlightCode={false}
                        selectVariant={() => {}}
                        setMessageHeight={(id, height) => messageHeights.current.set(id, height)}
                    />
                </div>
            ))}
        </div>
    );
});

export default MessageHeightMeasurer;
