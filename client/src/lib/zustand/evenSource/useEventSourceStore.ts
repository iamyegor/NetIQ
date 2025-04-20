import EventSourceParameters from "@/types/EventSourceParameters";
import { create } from "zustand";

interface EventSourceState {
    eventSourceParameters: EventSourceParameters | null;
    startEventSource: (parameters: EventSourceParameters) => void;
    stopEventSource: () => void;
}

const useEventSourceStore = create<EventSourceState>()((set) => ({
    eventSourceParameters: null,
    startEventSource: (parameters) => set({ eventSourceParameters: parameters }),
    stopEventSource: () => set({ eventSourceParameters: null }),
}));

export default useEventSourceStore;
