import Model from "@/types/chat/Model.ts";
import Subscription from "@/types/chat/Subscription";
import { create } from "zustand";

interface ModelState {
    selectedModel: Model | null;
    setSelectedModel: (model: Model | null) => void;
    subscription: Subscription | null;
    setSubscription: (subscription: Subscription | null) => void;
}

const useModelStore = create<ModelState>()((set) => ({
    selectedModel: null,
    setSelectedModel: (selectedModel) => set({ selectedModel }),
    subscription: null,
    setSubscription: (subscription) => set({ subscription }),
}));

export default useModelStore;
