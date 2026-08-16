"use client";

import { useEffect } from "react";
import { useFullscreen } from "@/lib/hooks/useFullscreen";

export default function FullscreenButton() {
  const { isFullscreen, isSupported, toggleFullscreen } = useFullscreen();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || e.code !== "KeyF") return;
      const target = e.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA"].includes(target.tagName)) return;
      toggleFullscreen();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggleFullscreen]);

  if (!isSupported) return null;

  return (
    <button
      onClick={toggleFullscreen}
      aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      title={isFullscreen ? "Exit fullscreen (F)" : "Enter fullscreen (F)"}
      className="pointer-events-auto fixed right-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-black/50 text-white backdrop-blur transition-colors hover:bg-black/70"
    >
      {isFullscreen ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
          <path d="M9 4v3a2 2 0 0 1-2 2H4M20 9h-3a2 2 0 0 1-2-2V4M15 20v-3a2 2 0 0 1 2-2h3M4 15h3a2 2 0 0 1 2 2v3" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
          <path d="M4 9V6a2 2 0 0 1 2-2h3M20 9V6a2 2 0 0 1-2-2h-3M4 15v3a2 2 0 0 0 2 2h3M20 15v3a2 2 0 0 1-2 2h-3" />
        </svg>
      )}
    </button>
  );
}
