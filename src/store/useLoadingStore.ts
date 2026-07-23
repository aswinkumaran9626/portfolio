import { create } from "zustand";

export type LoadingPhase =
  | "core"
  | "rings"
  | "charging"
  | "paused"
  | "exploding"
  | "assembling"
  | "reveal"
  | "done";

interface LoadingState {
  phase: LoadingPhase;
  progress: number;
  setPhase: (phase: LoadingPhase) => void;
  setProgress: (progress: number) => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
  phase: "core",
  progress: 0,
  setPhase: (phase) => set({ phase }),
  setProgress: (progress) => set({ progress }),
}));
