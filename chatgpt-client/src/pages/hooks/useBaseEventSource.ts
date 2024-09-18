import { useRef, useCallback, Dispatch, SetStateAction } from "react";
import { AppError } from "@/pages/ChatPage/types.ts";
import PostEventSource from "@/utils/PostEventSource.ts";

type EventSourceHandler = (event: MessageEvent) => void;

export function useBaseEventSource(
    setIsStreaming: (isStreaming: boolean) => void,
    setError: Dispatch<SetStateAction<AppError>>,
) {
    const eventSourceRef = useRef<PostEventSource | null>(null);

    const startEventSource = useCallback(
        (url: string, body: string, onMessage: EventSourceHandler) => {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
            }
            const eventSource = new PostEventSource(url, body);
            eventSourceRef.current = eventSource;

            eventSource.onmessage = onMessage;

            eventSource.onerror = () => {
                eventSource.close();
                setError("generic_error");
                setIsStreaming(false);
            };
            eventSource.onclose = () => {
                setIsStreaming(false);
            };
            eventSource.open();

            return eventSource;
        },
        [],
    );
    const stopEventSource = useCallback(() => {
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
        }
    }, []);
    
    return { startEventSource, stopEventSource };
}
