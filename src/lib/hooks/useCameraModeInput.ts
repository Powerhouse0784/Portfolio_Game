"use client";

import { useEffect } from "react";
import { useSettingsStore } from "@/lib/stores/useSettingsStore";

export function useCameraModeInput() {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || e.code !== "KeyV") return;
      const target = e.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA"].includes(target.tagName)) return;

      const { cameraMode, setCameraMode } = useSettingsStore.getState();
      setCameraMode(cameraMode === "first-person" ? "third-person" : "first-person");
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
}
