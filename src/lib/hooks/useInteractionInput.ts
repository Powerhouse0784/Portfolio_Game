"use client";

import { useEffect } from "react";
import { useInteractionStore } from "@/lib/stores/useInteractionStore";
import { playUiTone } from "@/lib/audio/uiSound";

const INTERACT_KEYS = ["KeyE", "Enter"];
const REOPEN_COOLDOWN_MS = 250;

export function useInteractionInput() {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const target = e.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA"].includes(target.tagName)) return;

      const { activePanelId, nearestId, openPanel, closePanel, lastPanelCloseAt } =
        useInteractionStore.getState();

      if (e.code === "Escape" && activePanelId) {
        closePanel();
        playUiTone("close");
        return;
      }

      if (INTERACT_KEYS.includes(e.code)) {
        if (activePanelId) {
          closePanel();
          playUiTone("close");
          return;
        }
        if (nearestId && Date.now() - lastPanelCloseAt > REOPEN_COOLDOWN_MS) {
          openPanel(nearestId);
          playUiTone("open");
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
}
