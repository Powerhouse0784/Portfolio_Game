import { create } from "zustand";
import { persist } from "zustand/middleware";

export type GraphicsPreset = "low" | "medium" | "high" | "auto";
export type CameraMode = "third-person" | "first-person" | "top-down";

export type SettingsState = {
  // Graphics
  graphicsPreset: GraphicsPreset;
  shadowsEnabled: boolean;

  // Audio (0-1 each, matches AUDIO FEATURES: master/music/sfx/ambient split)
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  ambientVolume: number;
  muted: boolean;

  // Camera
  cameraMode: CameraMode;
  cameraSensitivity: number;
  invertY: boolean;

  // Controls
  toggleRunMode: boolean; // false = hold-to-sprint, true = toggle-to-sprint

  // Accessibility
  reducedMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
  disableCameraShake: boolean;
  disableFlashingEffects: boolean;

  // Actions
  setGraphicsPreset: (preset: GraphicsPreset) => void;
  setVolume: (channel: "master" | "music" | "sfx" | "ambient", value: number) => void;
  toggleMute: () => void;
  setCameraMode: (mode: CameraMode) => void;
  setAccessibility: (partial: Partial<SettingsState>) => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      graphicsPreset: "auto",
      shadowsEnabled: true,

      masterVolume: 0.8,
      musicVolume: 0.6,
      sfxVolume: 0.8,
      ambientVolume: 0.5,
      muted: false,

      cameraMode: "third-person",
      cameraSensitivity: 0.5,
      invertY: false,

      toggleRunMode: false,

      reducedMotion: false,
      highContrast: false,
      largeText: false,
      disableCameraShake: false,
      disableFlashingEffects: false,

      setGraphicsPreset: (preset) => set({ graphicsPreset: preset }),

      setVolume: (channel, value) =>
        set({
          [`${channel}Volume`]: value,
        } as Partial<SettingsState>),

      toggleMute: () => set((s) => ({ muted: !s.muted })),

      setCameraMode: (mode) => set({ cameraMode: mode }),

      setAccessibility: (partial) => set(partial),
    }),
    { name: "portfolio-park-settings" }
  )
);
