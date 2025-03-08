import { RefObject, useEffect } from "react";
import Message from "@/types/chat/Message.ts";

export default function useAppendScalingDotAtTheEnd(
    contentRef: RefObject<HTMLDivElement | null>,
    scalingDotRef: RefObject<HTMLDivElement | null>,
    message: Message,
    isStreaming: boolean,
    isLast: boolean,
) {
    useEffect(() => {
        if (contentRef.current && scalingDotRef.current) {
            const markdownElements = contentRef.current.querySelectorAll(
                "p, h1, h2, h3, h4, h5, h6, ul, ol, li, blockquote, pre, code, table, thead, tbody, tr, th, td, hr, dl, dt, dd",
            );
            const lastMdElement = markdownElements[markdownElements.length - 1];
            const assistant = message.sender === "assistant";

            if (isStreaming && assistant && isLast && !message.content) {
                contentRef.current.appendChild(scalingDotRef.current);
                scalingDotRef.current.style.visibility = "visible";
            } else if (isStreaming && assistant && isLast && lastMdElement) {
                lastMdElement.appendChild(scalingDotRef.current);
                scalingDotRef.current.style.visibility = "visible";
            } else {
                scalingDotRef.current.style.visibility = "hidden";
            }
        }
    }, [contentRef, scalingDotRef, message, isStreaming, isLast]);
}
