import getErrorBasedOnMessage from "@/hooks/streaming/utils/getErrorBasedOnMessage";
import useErrorStore from "@/lib/zustand/error/useModelStore";
import useEventSourceStore from "@/lib/zustand/evenSource/useEventSourceStore";
import useMessageStore from "@/lib/zustand/messages/useMessageStore";
import EventSourceParameters from "@/types/EventSourceParameters";
import PostEventSource from "@/utils/PostEventSource.ts";
import { useEffect, useRef } from "react";

type EventSourceHandler = (event: MessageEvent) => void;

export function useBaseEventSource() {
    const prevEventSourceParameters = useRef<EventSourceParameters | null>(null);
    const { setIsStreaming } = useMessageStore();
    const { setAppError } = useErrorStore();
    const { eventSourceParameters } = useEventSourceStore();
    const eventSourceRef = useRef<PostEventSource | null>(null);

    useEffect(() => {
        if (prevEventSourceParameters.current !== eventSourceParameters) {
            if (eventSourceParameters === null) {
                stopEventSource();
            } else {
                const { url, body, handler } = eventSourceParameters;
                startEventSource(url, body, handler);
            }
        }

        prevEventSourceParameters.current = eventSourceParameters;
    }, [eventSourceParameters]);

    function startEventSource(
        url: string,
        body: { messageContent?: string; [key: string]: any },
        handler: EventSourceHandler,
    ) {
        if (eventSourceRef.current) eventSourceRef.current.close();
        if (body.messageContent && body.messageContent.length > 50000)
            setAppError("message_too_long");

        const eventSource = new PostEventSource(url, body);
        eventSourceRef.current = eventSource;

        eventSource.onmessage = handler;

        eventSource.onerror = (error) => {
            eventSource.close();
            setAppError(getErrorBasedOnMessage(error.message));
            setIsStreaming(false);
        };
        eventSource.onclose = () => {
            setIsStreaming(false);
        };

        setIsStreaming(true);
        eventSource.open();

        return eventSource;
    }

    function stopEventSource() {
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
        }
    }
}
