"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePauseStore } from "@/lib/stores/usePauseStore";
import { usePlayerStore } from "@/lib/stores/usePlayerStore";
import { useSettingsStore } from "@/lib/stores/useSettingsStore";
import { useIsTouchDevice } from "@/lib/hooks/useIsTouchDevice";
import { useIntroStore } from "@/lib/stores/useIntroStore";
import { useInteractionStore } from "@/lib/stores/useInteractionStore";
import { playUiTone } from "@/lib/audio/uiSound";
import { backdropMotion, cardMotion } from "@/components/ui/menus/panelMotion";

const DESKTOP_CONTROLS = [
  { keys: "W A S D / Arrows", action: "Move" },
  { keys: "Shift (hold)", action: "Sprint" },
  { keys: "Space", action: "Jump" },
  { keys: "Mouse Drag", action: "Look around" },
  { keys: "Scroll Wheel", action: "Zoom" },
  { keys: "V", action: "First-person view" },
  { keys: "E / Enter", action: "Interact" },
  { keys: "F", action: "Fullscreen" },
  { keys: "M", action: "Full map" },
  { keys: "P", action: "Settings" },
  { keys: "Esc", action: "Close panel" },
];

const TOUCH_CONTROLS = [
  { keys: "Left joystick", action: "Move" },
  { keys: "SPRINT button", action: "Hold to sprint" },
  { keys: "JUMP button", action: "Jump" },
  { keys: "Drag screen", action: "Look around" },
  { keys: "Pinch", action: "Zoom" },
  { keys: "Tap prompt", action: "Interact" },
];

export default function SettingsMenu() {
  const paused = usePauseStore((s) => s.paused);
  const setPaused = usePauseStore((s) => s.setPaused);
  const introActive = useIntroStore((s) => s.active);
  const activePanelId = useInteractionStore((s) => s.activePanelId);
  const isTouch = useIsTouchDevice();
  const requestReset = usePlayerStore((s) => s.requestReset);
  const muted = useSettingsStore((s) => s.muted);
  const toggleMute = useSettingsStore((s) => s.toggleMute);

  const rows = isTouch ? TOUCH_CONTROLS : DESKTOP_CONTROLS;
  const buttonHidden = introActive || Boolean(activePanelId) || paused;

  const open = () => {
    setPaused(true);
    playUiTone("open");
  };
  const close = () => {
    setPaused(false);
    playUiTone("close");
  };

  return (
    <>
      {!buttonHidden && (
        <button
          onClick={open}
          aria-label="Settings"
          title="Settings (P)"
          className="pointer-events-auto fixed right-4 top-16 z-30 flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-black/50 text-white backdrop-blur transition-colors hover:bg-black/70"
        >
          <GearIcon />
        </button>
      )}

      <AnimatePresence>
        {paused && (
          <motion.div
            {...backdropMotion}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
            onClick={close}
          >
            <motion.div
              {...cardMotion}
              className="w-full max-w-md rounded-2xl border border-white/10 bg-[#12181f] p-5 text-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[#FFB800]">Settings</h2>
                <button
                  onClick={close}
                  aria-label="Close"
                  className="rounded-full p-1 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <h3 className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-white/40">Controls</h3>
              <div className="mb-4 grid grid-cols-2 gap-x-4 gap-y-1">
                {rows.map((row) => (
                  <div key={row.action} className="flex items-center justify-between gap-2 text-[11px]">
                    <span className="text-white/60">{row.action}</span>
                    <span className="rounded bg-white/10 px-1.5 py-0.5 text-white/90">{row.keys}</span>
                  </div>
                ))}
              </div>

              <div className="mb-4 flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2.5">
                <span className="text-sm">Audio</span>
                <button
                  onClick={() => {
                    toggleMute();
                    playUiTone("open");
                  }}
                  className="rounded-md bg-white/10 px-3 py-1 text-xs transition-colors hover:bg-white/15"
                >
                  {muted ? "Unmute" : "Mute"}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    requestReset();
                    playUiTone("discover");
                  }}
                  className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm transition-colors hover:bg-white/10"
                >
                  Restart Position
                </button>
                <button
                  onClick={close}
                  className="rounded-lg bg-[#FFB800] px-4 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-[#ffc633]"
                >
                  Resume
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function GearIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}
