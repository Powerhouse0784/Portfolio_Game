"use client";

import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { useSettingsStore } from "@/lib/stores/useSettingsStore";

export default function PostProcessing() {
  const preset = useSettingsStore((s) => s.graphicsPreset);
  const resolved = preset === "auto" ? "medium" : preset;

  // Post-processing is a full-screen render pass on top of the normal render —
  // meaningful GPU cost. Skip entirely on low so it never becomes the reason a
  // weaker device struggles, rather than trying to tune it down further.
  if (resolved === "low") return null;

  const isHigh = resolved === "high";

  return (
    <EffectComposer multisampling={isHigh ? 4 : 0}>
      <Bloom
        intensity={isHigh ? 0.45 : 0.3}
        // Raised way up from 0.4 — that threshold meant almost anything bright
        // (sky, sunlit grass, the whole horizon) crossed it and bloomed, producing
        // a hazy, washed-out look across the entire scene instead of a selective
        // glow on genuinely emissive things (lamps, the monument ring). Only truly
        // bright/emissive surfaces should cross this bar.
        luminanceThreshold={0.88}
        luminanceSmoothing={0.1}
        mipmapBlur
      />
      <Vignette eskil={false} offset={0.15} darkness={0.45} />
      {/* No <ToneMapping> effect here on purpose — Canvas's renderer already
          applies its own tone mapping by default. Stacking a second tone-mapping
          pass on top double-processes every color in the scene, which is what was
          producing the broken red/dark blotches on the pond — its shader was
          tuned for a single pass, not two compounding ACES curves. */}
    </EffectComposer>
  );
}
