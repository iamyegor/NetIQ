import { create } from "zustand";

interface PricingState {
    currentPriceId: string | null;
    setCurrentPriceId: (priceId: string | null) => void;
}

const usePricingStore = create<PricingState>()((set) => ({
    currentPriceId: null,
    setCurrentPriceId: (currentPriceId) => set({ currentPriceId }),
}));

export default usePricingStore;
