import { create } from "zustand";

interface UiState {
    promptWasSentLessThan100MsAgo: boolean;
    inputContainerHeight: number;
    scrollingInProgress: boolean;
    isAttachedToBottom: boolean;
    isSidebarExpanded: boolean;
    setPromptWasSentLessThan100MsAgo: (value: boolean) => void;
    setInputContainerHeight: (height: number) => void;
    setScrollingInProgress: (show: boolean) => void;
    setIsAttachedToBottom: (attach: boolean) => void;
    setIsSidebarExpanded: (expanded: boolean) => void;
    toggleSidebarExpanded: () => void;
}

const useUiStore = create<UiState>()((set) => ({
    promptWasSentLessThan100MsAgo: false,
    inputContainerHeight: 0,
    scrollingInProgress: false,
    isAttachedToBottom: false,
    isSidebarExpanded: false,
    setPromptWasSentLessThan100MsAgo: (value: boolean) =>
        set({ promptWasSentLessThan100MsAgo: value }),

    setInputContainerHeight: (inputContainerHeight) => set({ inputContainerHeight }),
    setScrollingInProgress: (scrollingInProgress) => set({ scrollingInProgress }),
    setIsAttachedToBottom: (shouldAttachToBottom) => set({ isAttachedToBottom: shouldAttachToBottom }),
    setIsSidebarExpanded: (isSidebarExpanded) => set({ isSidebarExpanded }),
    toggleSidebarExpanded: () => set((state) => ({ isSidebarExpanded: !state.isSidebarExpanded })),
}));

export default useUiStore;
