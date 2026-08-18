"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useInteractionStore } from "@/lib/stores/useInteractionStore";
import { useIsTouchDevice } from "@/lib/hooks/useIsTouchDevice";
import { playUiTone } from "@/lib/audio/uiSound";

export default function InteractionPrompt() {
  const nearestId = useInteractionStore((s) => s.nearestId);
  const activePanelId = useInteractionStore((s) => s.activePanelId);
  const entries = useInteractionStore((s) => s.entries);
  const openPanel = useInteractionStore((s) => s.openPanel);
  const isTouch = useIsTouchDevice();

  // Distance-based visibility: nothing in range, or a panel's already open — stay hidden.
  const visible = Boolean(nearestId && !activePanelId && entries[nearestId]);
  const entry = nearestId ? entries[nearestId] : undefined;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-28 z-30 flex justify-center">
      <AnimatePresence>
        {visible && entry && (
          <motion.button
            key={nearestId}
            onClick={() => {
              openPanel(nearestId!);
              playUiTone("open");
            }}
            initial={{ opacity: 0, scale: 0.85, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 8 }}
            transition={{ type: "spring", stiffness: 400, damping: 26 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="pointer-events-auto flex items-center gap-2 rounded-full border border-white/10 bg-black/70 px-4 py-2 text-white shadow-lg backdrop-blur"
          >
            <span className="flex h-6 items-center justify-center rounded-md bg-white/15 px-2 text-xs font-bold">
              {isTouch ? "TAP" : "E"}
            </span>
            <span className="text-sm font-medium">{entry.title}</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
