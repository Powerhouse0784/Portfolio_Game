"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePauseStore } from "@/lib/stores/usePauseStore";
import { useSettingsStore } from "@/lib/stores/useSettingsStore";
import { useFullscreen } from "@/lib/hooks/useFullscreen";
import { useIsTouchDevice } from "@/lib/hooks/useIsTouchDevice";
import { playUiTone } from "@/lib/audio/uiSound";
import { backdropMotion, cardMotion } from "@/components/ui/menus/panelMotion";

type Tab = "menu" | "audio" | "display" | "controls";
const TABS: { id: Tab; label: string }[] = [
  { id: "menu", label: "Menu" },
  { id: "audio", label: "Audio" },
  { id: "display", label: "Display" },
  { id: "controls", label: "Controls" },
];

const DESKTOP_CONTROLS = [
  { keys: "W A S D / Arrow Keys", action: "Move" },
  { keys: "Shift (hold)", action: "Sprint" },
  { keys: "Space", action: "Jump" },
  { keys: "Mouse Drag", action: "Look around" },
  { keys: "Scroll Wheel", action: "Zoom" },
  { keys: "V", action: "Toggle first-person view" },
  { keys: "E / Enter", action: "Interact" },
  { keys: "F", action: "Fullscreen" },
  { keys: "M", action: "Toggle full map" },
  { keys: "P", action: "Menu" },
  { keys: "Esc", action: "Close panel / Resume" },
];
const TOUCH_CONTROLS = [
  { keys: "Left joystick", action: "Move" },
  { keys: "SPRINT button", action: "Hold to sprint" },
  { keys: "JUMP button", action: "Jump" },
  { keys: "Drag screen", action: "Look around" },
  { keys: "Pinch", action: "Zoom" },
  { keys: "Tap prompt", action: "Interact" },
];

const GRAPHICS_OPTIONS: { id: "low" | "medium" | "high" | "auto"; label: string }[] = [
  { id: "auto", label: "Auto" },
  { id: "low", label: "Low" },
  { id: "medium", label: "Medium" },
  { id: "high", label: "High" },
];

export default function SettingsMenu() {
  const paused = usePauseStore((s) => s.paused);
  const setPaused = usePauseStore((s) => s.setPaused);
  const [tab, setTab] = useState<Tab>("menu");
  const isTouch = useIsTouchDevice();
  const { isFullscreen, isSupported, toggleFullscreen } = useFullscreen();

  const settings = useSettingsStore();

  const resume = () => {
    setPaused(false);
    playUiTone("close");
  };

  const restart = () => {
    // A full reload is deliberate here, not a manual multi-store reset — it
    // guarantees genuinely clean state (fresh physics world, fresh module-level
    // constants, no chance of a partially-reset store causing a subtle bug) and
    // takes the person back to the start gate exactly like a first visit, which
    // is what "restart" should mean. Persisted settings survive via localStorage.
    window.location.reload();
  };

  return (
    <AnimatePresence>
      {paused && (
        <motion.div
          {...backdropMotion}
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
          onClick={resume}
        >
          <motion.div
            {...cardMotion}
            className="flex h-[85vh] max-h-[640px] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#12181f] text-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 p-5">
              <h2 className="text-lg font-semibold text-[#FFB800]">Settings</h2>
              <button
                onClick={resume}
                aria-label="Resume"
                className="rounded-full p-1 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="flex gap-1 overflow-x-auto border-b border-white/10 px-4 pt-3">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`shrink-0 rounded-t-lg px-3 py-2 text-sm transition-colors ${
                    tab === t.id ? "bg-white/10 text-white" : "text-white/50 hover:text-white/80"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {tab === "menu" && (
                <div className="space-y-2.5">
                  <button
                    onClick={resume}
                    className="w-full rounded-lg bg-[#FFB800] px-4 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-[#ffc633]"
                  >
                    Resume
                  </button>
                  <button
                    onClick={restart}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm transition-colors hover:bg-white/10"
                  >
                    Restart Experience
                  </button>
                  <button
                    onClick={() => {
                      settings.toggleMute();
                      playUiTone("open");
                    }}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm transition-colors hover:bg-white/10"
                  >
                    {settings.muted ? "Unmute" : "Mute"} Audio
                  </button>
                </div>
              )}

              {tab === "audio" && (
                <div className="space-y-5">
                  <ToggleRow
                    label="Mute all audio"
                    value={settings.muted}
                    onChange={() => settings.toggleMute()}
                  />
                  <VolumeSlider
                    label="Master"
                    value={settings.masterVolume}
                    onChange={(v) => settings.setVolume("master", v)}
                  />
                  <VolumeSlider
                    label="Music"
                    value={settings.musicVolume}
                    onChange={(v) => settings.setVolume("music", v)}
                  />
                  <VolumeSlider
                    label="Sound Effects"
                    value={settings.sfxVolume}
                    onChange={(v) => settings.setVolume("sfx", v)}
                  />
                  <VolumeSlider
                    label="Ambient"
                    value={settings.ambientVolume}
                    onChange={(v) => settings.setVolume("ambient", v)}
                  />
                </div>
              )}

              {tab === "display" && (
                <div className="space-y-6">
                  <div>
                    <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/40">
                      Graphics Quality
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {GRAPHICS_OPTIONS.map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => settings.setGraphicsPreset(opt.id)}
                          className={`rounded-lg px-3 py-1.5 text-xs transition-colors ${
                            settings.graphicsPreset === opt.id
                              ? "bg-[#FFB800] text-black font-semibold"
                              : "border border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {isSupported && (
                    <ToggleRow label="Fullscreen" value={isFullscreen} onChange={() => toggleFullscreen()} />
                  )}

                  <div>
                    <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/40">Camera</h4>
                    <VolumeSlider
                      label="Sensitivity"
                      value={settings.cameraSensitivity}
                      onChange={(v) => settings.setAccessibility({ cameraSensitivity: v })}
                    />
                    <div className="mt-2">
                      <ToggleRow
                        label="Invert Y-axis"
                        value={settings.invertY}
                        onChange={() => settings.setAccessibility({ invertY: !settings.invertY })}
                      />
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/40">
                      Accessibility
                    </h4>
                    <div className="space-y-2">
                      <ToggleRow
                        label="Reduced motion"
                        value={settings.reducedMotion}
                        onChange={() => settings.setAccessibility({ reducedMotion: !settings.reducedMotion })}
                      />
                      <ToggleRow
                        label="High contrast"
                        value={settings.highContrast}
                        onChange={() => settings.setAccessibility({ highContrast: !settings.highContrast })}
                      />
                      <ToggleRow
                        label="Large text"
                        value={settings.largeText}
                        onChange={() => settings.setAccessibility({ largeText: !settings.largeText })}
                      />
                    </div>
                  </div>
                </div>
              )}

              {tab === "controls" && (
                <ul className="space-y-1.5">
                  {(isTouch ? TOUCH_CONTROLS : DESKTOP_CONTROLS).map((row) => (
                    <li key={row.action} className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-white/60">{row.action}</span>
                      <span className="rounded bg-white/10 px-2 py-1 text-xs text-white/90">{row.keys}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ToggleRow({ label, value, onChange }: { label: string; value: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange} className="flex w-full items-center justify-between text-sm">
      <span className="text-white/80">{label}</span>
      <span
        className={`relative h-6 w-11 rounded-full transition-colors ${value ? "bg-[#FFB800]" : "bg-white/15"}`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
            value ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </span>
    </button>
  );
}

function VolumeSlider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="text-white/80">{label}</span>
        <span className="text-xs text-white/40">{Math.round(value * 100)}%</span>
      </div>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/15 accent-[#FFB800]"
      />
    </div>
  );
}
