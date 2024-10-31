import Model from "@/types/chat/Model.ts";
import { create } from "zustand";

interface ModelState {
    selectedModel: Model | null;
    setSelectedModel: (model: Model | null) => void;
}

const useModelStore = create<ModelState>()((set) => ({
    selectedModel: null,
    setSelectedModel: (selectedModel) => set({ selectedModel }),
}));

export default useModelStore;
