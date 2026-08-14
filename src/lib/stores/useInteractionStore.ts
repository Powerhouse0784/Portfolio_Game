import { create } from "zustand";

export type InteractableEntry = {
  id: string;
  position: [number, number, number];
  /** How close the player must be for this to become "the nearest" (interact prompt shows). */
  radius: number;
  /** Larger outer ring — crossing it triggers the one-time "discovered" toast + marker glow. */
  discoveryRadius: number;
  title: string;
  description: string;
};

type InteractionState = {
  entries: Record<string, InteractableEntry>;
  nearestId: string | null;
  inRangeIds: string[];
  visitedIds: string[];
  activePanelId: string | null;
  justDiscoveredId: string | null;
  lastPanelCloseAt: number;

  register: (entry: InteractableEntry) => void;
  unregister: (id: string) => void;
  setProximity: (nearestId: string | null, inRangeIds: string[]) => void;
  markVisited: (id: string) => void;
  clearJustDiscovered: () => void;
  openPanel: (id: string) => void;
  closePanel: () => void;
};

export const useInteractionStore = create<InteractionState>((set, get) => ({
  entries: {},
  nearestId: null,
  inRangeIds: [],
  visitedIds: [],
  activePanelId: null,
  justDiscoveredId: null,
  lastPanelCloseAt: 0,

  register: (entry) => set((s) => ({ entries: { ...s.entries, [entry.id]: entry } })),

  unregister: (id) =>
    set((s) => {
      const next = { ...s.entries };
      delete next[id];
      return { entries: next };
    }),

  // Only commits a state update when something actually changed — this runs from a
  // useFrame loop, so a naive `set()` every frame would re-render every subscriber
  // (prompt, markers, toast) 60x/sec even while the player stands still.
  setProximity: (nearestId, inRangeIds) => {
    const state = get();
    const sameNearest = state.nearestId === nearestId;
    const sameRange =
      state.inRangeIds.length === inRangeIds.length &&
      state.inRangeIds.every((id) => inRangeIds.includes(id));
    if (sameNearest && sameRange) return;
    set({ nearestId, inRangeIds });
  },

  markVisited: (id) =>
    set((s) => (s.visitedIds.includes(id) ? {} : { visitedIds: [...s.visitedIds, id], justDiscoveredId: id })),

  clearJustDiscovered: () => set({ justDiscoveredId: null }),

  openPanel: (id) => set({ activePanelId: id }),

  closePanel: () => set({ activePanelId: null, lastPanelCloseAt: Date.now() }),
}));
