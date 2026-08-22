"use client";

import { motion } from "framer-motion";
import { useInteractionStore } from "@/lib/stores/useInteractionStore";
import { CAFE_MESSAGE, BUILD_FACTS } from "@/content/cafe";
import { playUiTone } from "@/lib/audio/uiSound";
import { backdropMotion, cardMotion } from "./panelMotion";

export default function CafePanel() {
  const activePanelId = useInteractionStore((s) => s.activePanelId);
  const closePanel = useInteractionStore((s) => s.closePanel);

  if (activePanelId !== "cafe") return null;

  const handleClose = () => {
    closePanel();
    playUiTone("close");
  };

  return (
    <motion.div
      {...backdropMotion}
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
      onClick={handleClose}
    >
      <motion.div
        {...cardMotion}
        className="flex max-h-[80vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#12181f] text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-6">
          <div>
            <h2 className="text-xl font-semibold text-[#FFB800]">Café & Rest Area</h2>
            <p className="text-xs text-white/40">Grab a seat — this one's off the record.</p>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close"
            className="shrink-0 rounded-full p-1 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <p className="mb-6 text-sm leading-relaxed text-white/80">{CAFE_MESSAGE}</p>

          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/40">Behind the Build</h3>
          <div className="space-y-3">
            {BUILD_FACTS.map((fact) => (
              <div key={fact.title} className="rounded-lg border border-white/10 bg-white/5 p-3">
                <p className="mb-1 text-sm font-medium text-[#00C48C]">{fact.title}</p>
                <p className="text-xs leading-relaxed text-white/60">{fact.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
