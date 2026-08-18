import { create } from "zustand";

type PauseState = {
  paused: boolean;
  togglePause: () => void;
  setPaused: (value: boolean) => void;
};

export const usePauseStore = create<PauseState>((set) => ({
  paused: false,
  togglePause: () => set((s) => ({ paused: !s.paused })),
  setPaused: (value) => set({ paused: value }),
}));
