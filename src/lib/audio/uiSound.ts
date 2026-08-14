import { useSettingsStore } from "@/lib/stores/useSettingsStore";

let ctx: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AudioCtxClass =
      window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtxClass) return null;
    ctx = new AudioCtxClass();
  }
  return ctx;
}

type ToneKind = "open" | "close" | "discover";

const TONE_PRESETS: Record<ToneKind, { freq: number; duration: number; type: OscillatorType }> = {
  open: { freq: 660, duration: 0.09, type: "sine" },
  close: { freq: 440, duration: 0.08, type: "sine" },
  discover: { freq: 880, duration: 0.15, type: "triangle" },
};

/** Short synthesized blip for UI feedback (panel open/close, zone discovery). */
export function playUiTone(kind: ToneKind) {
  const audioCtx = getContext();
  if (!audioCtx) return;

  const { sfxVolume, masterVolume, muted } = useSettingsStore.getState();
  const volume = muted ? 0 : sfxVolume * masterVolume;
  if (volume <= 0.001) return;

  if (audioCtx.state === "suspended") audioCtx.resume();

  const { freq, duration, type } = TONE_PRESETS[kind];
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.value = freq;

  const now = audioCtx.currentTime;
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.2 * volume, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(now);
  osc.stop(now + duration + 0.02);
}
