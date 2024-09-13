import { useRef, useCallback } from "react";

type EventSourceHandler = (event: MessageEvent) => void;

export function useBaseEventSource(setIsStreaming: (isStreaming: boolean) => void) {
    const eventSourceRef = useRef<EventSource | null>(null);

    const startEventSource = useCallback((url: string, onMessage: EventSourceHandler) => {
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
        }

        const eventSource = new EventSource(url);
        eventSourceRef.current = eventSource;

        eventSource.onmessage = onMessage;

        eventSource.onerror = (error) => {
            console.error("EventSource failed:", error);
            eventSource.close();
            setIsStreaming(false);
        };

        eventSource.addEventListener("close", () => {
            eventSource.close();
            setIsStreaming(false);
        });

        return eventSource;
    }, []);

    const stopEventSource = useCallback(() => {
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
            setIsStreaming(false);
        }
    }, []);

    return { startEventSource, stopEventSource };
}
