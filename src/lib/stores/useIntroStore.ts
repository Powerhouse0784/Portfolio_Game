import { create } from "zustand";

type IntroState = {
  /** True once the intro sequence has finished or been skipped — i.e. gameplay
   *  camera control should be active. */
  active: boolean;
  /** True only after StartGate has actually been dismissed. Kept separate from
   *  `active` on purpose: without this, CinematicIntro's clock started ticking the
   *  instant the Scene mounted (as soon as the JS chunk loaded), which could be
   *  well before the person actually clicked "Enter the Park" — so a slow click
   *  meant missing part or all of the intro, or landing mid-sequence instead of
   *  at its scripted start. */
  started: boolean;
  finishIntro: () => void;
  start: () => void;
};

// Deliberately no persistence — the intro plays fresh every time the page loads
// or is refreshed, by request. This also has a nice side effect: with no
// localStorage/window check involved, there's no server/client branching left
// at all, so there's nothing here that could cause a hydration mismatch.
export const useIntroStore = create<IntroState>((set) => ({
  active: true,
  started: false,
  finishIntro: () => set({ active: false }),
  start: () => set({ started: true }),
}));
