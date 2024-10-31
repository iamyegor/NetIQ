import Chat from "@/types/chat/Chat.ts";
import { create } from "zustand";

interface ChatsState {
    chats: Chat[];
    chatsLoading: boolean;
    allChatsLoaded: boolean;
    setChats: (chats: Chat[]) => void;
    setChatsLoading: (loading: boolean) => void;
    setAllChatsLoaded: (loaded: boolean) => void;
}

const useChatsStore = create<ChatsState>()((set) => ({
    chats: [],
    chatsLoading: false,
    allChatsLoaded: false,
    setChats: (chats) => set({ chats }),
    setChatsLoading: (chatsLoading) => set({ chatsLoading }),
    setAllChatsLoaded: (allChatsLoaded) => set({ allChatsLoaded }),
}));

export default useChatsStore;
