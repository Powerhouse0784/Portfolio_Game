"use client";

import { useInteractionStore } from "@/lib/stores/useInteractionStore";
import { playUiTone } from "@/lib/audio/uiSound";

export default function InteractionPrompt() {
  const nearestId = useInteractionStore((s) => s.nearestId);
  const activePanelId = useInteractionStore((s) => s.activePanelId);
  const entries = useInteractionStore((s) => s.entries);
  const openPanel = useInteractionStore((s) => s.openPanel);

  // Distance-based visibility: nothing in range, or a panel's already open — stay hidden.
  if (!nearestId || activePanelId) return null;
  const entry = entries[nearestId];
  if (!entry) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-28 z-30 flex justify-center">
      <button
        onClick={() => {
          openPanel(nearestId);
          playUiTone("open");
        }}
        className="pointer-events-auto flex items-center gap-2 rounded-full border border-white/10 bg-black/70 px-4 py-2 text-white shadow-lg backdrop-blur transition-transform hover:scale-105 active:scale-95"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/15 text-xs font-bold">E</span>
        <span className="text-sm font-medium">{entry.title}</span>
      </button>
    </div>
  );
}
