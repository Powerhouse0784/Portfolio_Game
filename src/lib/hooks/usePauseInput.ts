"use client";

import { useEffect } from "react";
import { usePauseStore } from "@/lib/stores/usePauseStore";
import { useInteractionStore } from "@/lib/stores/useInteractionStore";
import { useIntroStore } from "@/lib/stores/useIntroStore";
import { playUiTone } from "@/lib/audio/uiSound";

export function usePauseInput() {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || e.code !== "Escape") return;
      if (useIntroStore.getState().active) return;
      if (useInteractionStore.getState().activePanelId) return;

      usePauseStore.getState().togglePause();
      playUiTone(usePauseStore.getState().paused ? "open" : "close");
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
}
