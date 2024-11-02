import { useEffect, useRef } from "react";
import ChatMessage from "@/pages/ChatPage/ChatArea/ChatMessage/ChatMessage.tsx";
import Message from "@/types/chat/Message.ts";

export default function MessageHeightMeasurer({
    message,
    measureHeight,
    afterMeasured,
}: {
    message: Message;
    measureHeight: (id: string, height: number) => void;
    afterMeasured: () => void;
}) {
    const messageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (messageRef.current) {
            const height = messageRef.current.offsetHeight;
            measureHeight(message.id, height);
            afterMeasured();
        }
    }, []);

    return (
        <div
            ref={messageRef}
            className="absolute invisible"
            style={{ maxWidth: "800px", width: "100%" }}
        >
            <ChatMessage message={message} shouldHighlightCode={false} selectVariant={() => {}} />
        </div>
    );
}
