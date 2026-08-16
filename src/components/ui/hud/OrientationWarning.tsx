"use client";

import { useEffect, useState } from "react";
import { useIsTouchDevice } from "@/lib/hooks/useIsTouchDevice";

export default function OrientationWarning() {
  const isTouch = useIsTouchDevice();
  const [isPortrait, setIsPortrait] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(orientation: portrait)");
    const update = () => setIsPortrait(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (!isTouch || !isPortrait || dismissed) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-40 flex justify-center px-4">
      <div className="pointer-events-auto flex items-center gap-3 rounded-xl border border-white/15 bg-black/75 px-4 py-2.5 text-sm text-white shadow-lg backdrop-blur">
        <span>Rotate your device for the full experience</span>
        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss"
          className="rounded-full p-0.5 text-white/50 hover:bg-white/10 hover:text-white"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
