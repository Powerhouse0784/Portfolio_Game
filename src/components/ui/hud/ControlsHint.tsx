"use client";

import { useEffect, useState } from "react";
import { useIsTouchDevice } from "@/lib/hooks/useIsTouchDevice";
import { useIntroStore } from "@/lib/stores/useIntroStore";

const DESKTOP_CONTROLS = [
  { keys: "W A S D / Arrow Keys", action: "Move" },
  { keys: "Shift (hold)", action: "Sprint" },
  { keys: "Space", action: "Jump" },
  { keys: "Mouse Drag", action: "Look around" },
  { keys: "Scroll Wheel", action: "Zoom" },
  { keys: "V", action: "Toggle first-person view" },
  { keys: "E / Enter", action: "Interact" },
  { keys: "F", action: "Fullscreen" },
  { keys: "Esc", action: "Close panel / Pause" },
];

const TOUCH_CONTROLS = [
  { keys: "Left joystick", action: "Move" },
  { keys: "SPRINT button", action: "Hold to sprint" },
  { keys: "JUMP button", action: "Jump" },
  { keys: "Drag screen", action: "Look around" },
  { keys: "Pinch", action: "Zoom" },
  { keys: "Tap prompt", action: "Interact" },
];

export default function ControlsHint() {
  const isTouch = useIsTouchDevice();
  const [open, setOpen] = useState(false);
  const [autoShown, setAutoShown] = useState(false);

  // Auto-open once, right as gameplay actually starts (intro finished/skipped) —
  // so it's seen without anyone having to go looking for a help button first.
  useEffect(() => {
    if (autoShown) return;
    const unsub = useIntroStore.subscribe((state) => {
      if (!state.active) {
        setOpen(true);
        setAutoShown(true);
      }
    });
    // Cinematic intro might already be finished/skipped before this mounts.
    if (!useIntroStore.getState().active) {
      setOpen(true);
      setAutoShown(true);
    }
    return unsub;
  }, [autoShown]);

  const rows = isTouch ? TOUCH_CONTROLS : DESKTOP_CONTROLS;

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Controls"
        className="pointer-events-auto fixed right-4 top-16 z-30 flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-black/50 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-black/70"
      >
        ?
      </button>

      {open && (
        <div
          className="pointer-events-auto fixed right-4 top-28 z-30 w-64 rounded-xl border border-white/15 bg-black/75 p-4 text-white shadow-xl backdrop-blur"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#FFB800]">Controls</h3>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="rounded-full p-0.5 text-white/50 hover:bg-white/10 hover:text-white"
            >
              ✕
            </button>
          </div>
          <ul className="space-y-1.5">
            {rows.map((row) => (
              <li key={row.action} className="flex items-center justify-between gap-3 text-xs">
                <span className="text-white/60">{row.action}</span>
                <span className="rounded bg-white/10 px-1.5 py-0.5 text-right text-white/90">{row.keys}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
