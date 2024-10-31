import { create } from "zustand";

interface UiState {
    promptWasSentLessThan100MsAgo: boolean;
    inputContainerHeight: number;
    scrollingInProgress: boolean;
    shouldAttachToBottom: boolean;
    hasChatScrollbar: boolean;
    isSidebarExpanded: boolean;
    setPromptWasSentLessThan100MsAgo: (value: boolean) => void;
    setInputContainerHeight: (height: number) => void;
    setScrollingInProgress: (show: boolean) => void;
    setShouldAttachToBottom: (attach: boolean) => void;
    setHasChatScrollbar: (hasScrollbar: boolean) => void;
    setIsSidebarExpanded: (expanded: boolean) => void;
    toggleSidebarExpanded: () => void;
}

const useUiStore = create<UiState>()((set) => ({
    promptWasSentLessThan100MsAgo: false,
    inputContainerHeight: 0,
    scrollingInProgress: false,
    shouldAttachToBottom: false,
    hasChatScrollbar: false,
    isSidebarExpanded: false,
    setPromptWasSentLessThan100MsAgo: (value: boolean) =>
        set({ promptWasSentLessThan100MsAgo: value }),

    setInputContainerHeight: (inputContainerHeight) => set({ inputContainerHeight }),
    setScrollingInProgress: (scrollingInProgress) => set({ scrollingInProgress }),
    setShouldAttachToBottom: (shouldAttachToBottom) => set({ shouldAttachToBottom }),
    setHasChatScrollbar: (hasChatScrollbar) => set({ hasChatScrollbar }),
    setIsSidebarExpanded: (isSidebarExpanded) => set({ isSidebarExpanded }),
    toggleSidebarExpanded: () => set((state) => ({ isSidebarExpanded: !state.isSidebarExpanded })),
}));

export default useUiStore;
