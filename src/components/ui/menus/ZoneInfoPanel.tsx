"use client";

import { useInteractionStore } from "@/lib/stores/useInteractionStore";
import { playUiTone } from "@/lib/audio/uiSound";

export default function ZoneInfoPanel() {
  const activePanelId = useInteractionStore((s) => s.activePanelId);
  const entries = useInteractionStore((s) => s.entries);
  const closePanel = useInteractionStore((s) => s.closePanel);

  if (!activePanelId) return null;
  const entry = entries[activePanelId];
  if (!entry) return null;

  const handleClose = () => {
    closePanel();
    playUiTone("close");
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-white/10 bg-[#12181f] p-6 text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-start justify-between gap-4">
          <h2 className="text-xl font-semibold text-[#FFB800]">{entry.title}</h2>
          <button
            onClick={handleClose}
            aria-label="Close"
            className="rounded-full p-1 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
          >
            ✕
          </button>
        </div>
        <p className="text-sm leading-relaxed text-white/80">{entry.description}</p>
        <p className="mt-5 text-xs text-white/40">
          Full content for this zone arrives in the Portfolio Content phase — this is the interaction
          plumbing, wired and ready.
        </p>
      </div>
    </div>
  );
}
