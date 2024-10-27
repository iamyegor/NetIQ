import { useAppContext } from "@/context/AppContext";
import { useEffect, useRef } from "react";

export default function useScrollToBottomWhenStopStreaming() {
    const { isStreaming, shouldAttachToBottom, scrollToBottom } = useAppContext();
    const prevIsStreaming = useRef<boolean>(isStreaming);

    useEffect(() => {
        if (
            prevIsStreaming.current == true &&
            prevIsStreaming.current != isStreaming &&
            shouldAttachToBottom
        ) {
            scrollToBottom({ scrollType: "moderate" });
        }

        prevIsStreaming.current = isStreaming;
    }, [isStreaming]);
}
