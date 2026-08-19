"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFullscreen } from "@/lib/hooks/useFullscreen";

type ScreenOrientationWithLock = ScreenOrientation & {
  lock?: (orientation: string) => Promise<void>;
};

export default function StartGate() {
  const [dismissed, setDismissed] = useState(false);
  const { toggleFullscreen } = useFullscreen();

  const handleStart = async () => {
    await toggleFullscreen();
    try {
      const orientation = screen.orientation as ScreenOrientationWithLock | undefined;
      // Best-effort only — the Orientation Lock API generally requires fullscreen
      // to already be active and isn't supported on iOS Safari at all. Fails
      // silently there rather than blocking the experience.
      await orientation?.lock?.("landscape");
    } catch {
      // Unsupported or rejected — not worth interrupting the person over.
    }
    setDismissed(true);
  };

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-[#0d1b12] px-6 text-center text-white"
        >
          <div>
            <h1 className="text-2xl font-semibold tracking-wide text-[#FFB800]">Portfolio Park</h1>
            <p className="mt-2 text-sm text-white/60">An explorable 3D portfolio</p>
          </div>
          <button
            onClick={handleStart}
            className="rounded-full bg-[#FFB800] px-8 py-3 text-base font-semibold text-black transition-transform hover:scale-105 active:scale-95"
          >
            Enter the Park
          </button>
          <p className="max-w-xs text-xs text-white/40">
            Opens fullscreen for the best experience. You can exit or re-enter anytime from the button in
            the corner.
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
