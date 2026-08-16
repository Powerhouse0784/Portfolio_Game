import { create } from "zustand";

type IntroState = {
  active: boolean;
  finishIntro: () => void;
};

// Deliberately no persistence — the intro plays fresh every time the page loads
// or is refreshed, by request. This also has a nice side effect: with no
// localStorage/window check involved, there's no server/client branching left
// at all, so there's nothing here that could cause a hydration mismatch.
export const useIntroStore = create<IntroState>((set) => ({
  active: true,
  finishIntro: () => set({ active: false }),
}));
