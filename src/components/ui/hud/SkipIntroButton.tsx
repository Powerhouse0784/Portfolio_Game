"use client";

import { useEffect } from "react";
import { useIntroStore } from "@/lib/stores/useIntroStore";
import { useIsTouchDevice } from "@/lib/hooks/useIsTouchDevice";

export default function SkipIntroButton() {
  const active = useIntroStore((s) => s.active);
  const finishIntro = useIntroStore((s) => s.finishIntro);
  const isTouch = useIsTouchDevice();

  useEffect(() => {
    if (!active) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "Escape") {
        e.preventDefault();
        finishIntro();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active, finishIntro]);

  if (!active) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-8 z-30 flex justify-center">
      <button
        onClick={finishIntro}
        className="pointer-events-auto rounded-full border border-white/20 bg-black/60 px-5 py-2.5 text-sm text-white backdrop-blur transition-colors hover:bg-black/80"
      >
        Skip Intro {!isTouch && <span className="ml-1 text-white/50">(Space)</span>}
      </button>
    </div>
  );
}
