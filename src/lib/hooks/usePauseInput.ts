"use client";

import { useEffect } from "react";
import { usePauseStore } from "@/lib/stores/usePauseStore";
import { useInteractionStore } from "@/lib/stores/useInteractionStore";
import { useIntroStore } from "@/lib/stores/useIntroStore";
import { playUiTone } from "@/lib/audio/uiSound";

// Deliberately NOT Escape for opening the menu — browsers reserve Escape to
// always exit fullscreen, and that can't be prevented from JS. Using it here too
// meant pressing Escape while paused+fullscreen fired both actions simultaneously,
// exiting fullscreen while doing nothing visible for pause. P has no such conflict.
export function usePauseInput() {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const target = e.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA"].includes(target.tagName)) return;

      if (e.code === "KeyP") {
        if (useIntroStore.getState().active) return;
        if (useInteractionStore.getState().activePanelId) return;
        usePauseStore.getState().togglePause();
        playUiTone(usePauseStore.getState().paused ? "open" : "close");
        return;
      }

      // Escape closing an already-open pause menu is fine even in fullscreen —
      // Escape also exiting fullscreen at the same moment is a reasonable
      // combined "back out" action, unlike using it to *open* the menu.
      if (e.code === "Escape" && usePauseStore.getState().paused) {
        usePauseStore.getState().setPaused(false);
        playUiTone("close");
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
}
