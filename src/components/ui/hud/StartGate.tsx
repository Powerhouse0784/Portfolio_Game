"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFullscreen } from "@/lib/hooks/useFullscreen";
import { useIntroStore } from "@/lib/stores/useIntroStore";

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
    // Only now does the cinematic intro's clock actually start ticking — see
    // useIntroStore for why that matters.
    useIntroStore.getState().start();
    setDismissed(true);
  };

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-7 overflow-hidden bg-[radial-gradient(circle_at_50%_38%,#173a24,#0a1510_72%)] px-6 text-center text-white"
        >
          {/* Mini monument icon, echoing the in-world landmark's silhouette/palette */}
          <motion.svg
            width="72"
            height="86"
            viewBox="0 0 72 86"
            initial={{ y: -6 }}
            animate={{ y: 6 }}
            transition={{ duration: 2.4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          >
            <ellipse cx="36" cy="80" rx="26" ry="5" fill="#000" opacity="0.35" />
            <rect x="20" y="52" width="32" height="20" rx="3" fill="#3a3f4a" />
            <path d="M27 30 L45 30 L40 54 L32 54 Z" fill="#2b3a55" />
            <circle cx="36" cy="24" r="11" fill="none" stroke="#FFB800" strokeWidth="3.2" />
            <path d="M36 6 L42 18 L30 18 Z" fill="#FF3D5A" />
          </motion.svg>

          <div>
            <h1 className="text-3xl font-semibold tracking-wide text-[#FFB800]">Portfolio Park</h1>
            <p className="mt-2 text-sm text-white/60">An explorable 3D portfolio</p>
          </div>

          <motion.button
            onClick={handleStart}
            animate={{ boxShadow: ["0 0 0px #FFB80088", "0 0 28px #FFB80066", "0 0 0px #FFB80088"] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="rounded-full bg-[#FFB800] px-8 py-3 text-base font-semibold text-black"
          >
            Enter the Park
          </motion.button>

          <p className="max-w-xs text-xs text-white/40">
            Opens fullscreen for the best experience. You can exit or re-enter anytime from the menu.
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
