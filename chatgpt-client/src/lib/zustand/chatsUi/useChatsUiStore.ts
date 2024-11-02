import { create } from "zustand";

interface ChatsUiState {
    chatHeight: number;
    setChatHeight: (chatHeight: number) => void;
    chatScrollTop: number;
    setChatScrollTop: (chatScrollTop: number) => void;
}

const useChatUiStore = create<ChatsUiState>()((set) => ({
    chatHeight: 0,
    setChatHeight: (chatHeight) => set({ chatHeight }),
    chatScrollTop: 0,
    setChatScrollTop: (chatScrollTop) => set({ chatScrollTop }),
}));

export default useChatUiStore;
