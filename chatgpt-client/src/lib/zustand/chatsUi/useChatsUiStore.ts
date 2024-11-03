import { create } from "zustand";

interface ChatsUiState {
    chatHeight: number;
    setChatHeight: (chatHeight: number) => void;
    chatScrollTop: number;
    setChatScrollTop: (chatScrollTop: number) => void;
    hasChatScrollbar: boolean;
    setHasChatScrollbar: (hasChatScrollbar: boolean) => void;
}

const useChatUiStore = create<ChatsUiState>()((set) => ({
    chatHeight: 0,
    setChatHeight: (chatHeight) => set({ chatHeight }),
    chatScrollTop: 0,
    setChatScrollTop: (chatScrollTop) => set({ chatScrollTop }),
    hasChatScrollbar: false,
    setHasChatScrollbar: (hasChatScrollbar: boolean) => set({ hasChatScrollbar }),
}));

export default useChatUiStore;
