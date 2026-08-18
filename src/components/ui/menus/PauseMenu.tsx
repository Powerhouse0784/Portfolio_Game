"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePauseStore } from "@/lib/stores/usePauseStore";
import { usePlayerStore } from "@/lib/stores/usePlayerStore";
import { useSettingsStore } from "@/lib/stores/useSettingsStore";
import { playUiTone } from "@/lib/audio/uiSound";
import { backdropMotion, cardMotion } from "@/components/ui/menus/panelMotion";

export default function PauseMenu() {
  const paused = usePauseStore((s) => s.paused);
  const setPaused = usePauseStore((s) => s.setPaused);
  const requestReset = usePlayerStore((s) => s.requestReset);
  const muted = useSettingsStore((s) => s.muted);
  const toggleMute = useSettingsStore((s) => s.toggleMute);

  const resume = () => {
    setPaused(false);
    playUiTone("close");
  };

  return (
    <AnimatePresence>
      {paused && (
        <motion.div
          {...backdropMotion}
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
          onClick={resume}
        >
          <motion.div
            {...cardMotion}
            className="w-full max-w-xs rounded-2xl border border-white/10 bg-[#12181f] p-6 text-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-5 text-center text-lg font-semibold text-[#FFB800]">Paused</h2>

            <div className="space-y-2.5">
              <button
                onClick={resume}
                className="w-full rounded-lg bg-[#FFB800] px-4 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-[#ffc633]"
              >
                Resume
              </button>
              <button
                onClick={() => {
                  requestReset();
                  playUiTone("discover");
                }}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm transition-colors hover:bg-white/10"
              >
                Reset Position
              </button>
              <button
                onClick={() => {
                  toggleMute();
                  playUiTone("open");
                }}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm transition-colors hover:bg-white/10"
              >
                {muted ? "Unmute" : "Mute"} Audio
              </button>
            </div>

            <p className="mt-5 text-center text-xs text-white/40">Press Esc to resume</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
