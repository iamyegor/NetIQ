import AppError from "@/types/errors/AppError";
import { create } from "zustand";

interface ErrorState {
    appError: AppError | null;
    setAppError: (error: AppError | null) => void;
}

const useErrorStore = create<ErrorState>()((set) => ({
    appError: null,
    setAppError: (appError) => set({ appError }),
}));

export default useErrorStore;
