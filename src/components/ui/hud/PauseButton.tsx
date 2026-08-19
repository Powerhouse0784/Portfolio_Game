"use client";

import { usePauseStore } from "@/lib/stores/usePauseStore";
import { useIntroStore } from "@/lib/stores/useIntroStore";
import { useInteractionStore } from "@/lib/stores/useInteractionStore";
import { playUiTone } from "@/lib/audio/uiSound";

export default function PauseButton() {
  const togglePause = usePauseStore((s) => s.togglePause);
  const introActive = useIntroStore((s) => s.active);
  const activePanelId = useInteractionStore((s) => s.activePanelId);

  if (introActive || activePanelId) return null;

  return (
    <button
      onClick={() => {
        togglePause();
        playUiTone("open");
      }}
      aria-label="Pause"
      title="Pause (P)"
      className="pointer-events-auto fixed right-4 top-28 z-30 flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-black/50 text-white backdrop-blur transition-colors hover:bg-black/70"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <rect x="6" y="5" width="4" height="14" rx="1" />
        <rect x="14" y="5" width="4" height="14" rx="1" />
      </svg>
    </button>
  );
}
