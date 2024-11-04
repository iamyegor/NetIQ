import { create } from "zustand";
import { RefObject } from "react";

interface ChatsUiState {
    chatRef: RefObject<HTMLDivElement>;
    chatScrollTop: number;
    setChatScrollTop: (chatScrollTop: number) => void;

    chatHeight: number;
    setChatHeight: (chatHeight: number) => void;

    chatContainerHeight: number;
    setChatContainerHeight: (chatContainerHeight: number) => void;
}

const useChatUiStore = create<ChatsUiState>()((set) => ({
    chatRef: { current: null },
    chatScrollTop: 0,
    setChatScrollTop: (chatScrollTop) => set({ chatScrollTop }),

    chatHeight: 0,
    setChatHeight: (chatHeight) => set({ chatHeight }),

    chatContainerHeight: 0,
    setChatContainerHeight: (chatContainerHeight) => set({ chatContainerHeight }),
}));

export default useChatUiStore;
