"use client";

import { useMemo } from "react";
import { useSettingsStore } from "@/lib/stores/useSettingsStore";
import { GRAPHICS_PRESETS } from "@/lib/constants/world";
import { PLAZA_RADIUS } from "@/lib/constants/zones";
import { NPC_ROUTES } from "@/lib/world/npcRoutes";
import { getAllBenchSpots } from "@/lib/world/benchSpots";
import { generateOutfit } from "@/lib/world/npcOutfits";
import { POND_CENTER, POND_RADIUS } from "@/lib/world/scenery";
import NPCWalker from "./NPCWalker";
import NPCSitter from "./NPCSitter";
import NPCStander from "./NPCStander";

const STANDER_SPOTS: [number, number, number][] = [
  [3, 0, 3], // near the central monument
  [-3, 0, -3],
  [POND_CENTER[0] + POND_RADIUS + 2, 0, POND_CENTER[1]], // by the pond
  [0, 0, PLAZA_RADIUS + 6], // just off the plaza
  [-4, 0, 6],
];

export default function NPCField() {
  const preset = useSettingsStore((s) => s.graphicsPreset);
  const resolved = preset === "auto" ? "medium" : preset;
  const npcCount = GRAPHICS_PRESETS[resolved].npcCount;

  const { walkers, sitters, standers } = useMemo(() => {
    const walkerCount = Math.round(npcCount * 0.55);
    const standerCount = Math.min(Math.round(npcCount * 0.15), STANDER_SPOTS.length);
    const benchSpots = getAllBenchSpots();
    const sitterCount = Math.min(Math.max(npcCount - walkerCount - standerCount, 0), benchSpots.length);

    const walkers = Array.from({ length: walkerCount }, (_, i) => ({
      route: NPC_ROUTES[i % NPC_ROUTES.length],
      outfit: generateOutfit(i),
      // Deterministic pseudo-variance (0.8x - 1.2x speed) so not everyone walks in lockstep
      speedVariance: 0.8 + ((i * 37) % 40) / 100,
    }));

    const sitters = benchSpots.slice(0, sitterCount).map((spot, i) => ({
      spot,
      outfit: generateOutfit(100 + i),
    }));

    const standers = STANDER_SPOTS.slice(0, standerCount).map((position, i) => ({
      position,
      outfit: generateOutfit(200 + i),
    }));

    return { walkers, sitters, standers };
  }, [npcCount]);

  return (
    <>
      {walkers.map((w, i) => (
        <NPCWalker key={`walker-${i}`} route={w.route} outfit={w.outfit} speedVariance={w.speedVariance} />
      ))}
      {sitters.map((s, i) => (
        <NPCSitter key={`sitter-${i}`} spot={s.spot} outfit={s.outfit} />
      ))}
      {standers.map((st, i) => (
        <NPCStander key={`stander-${i}`} position={st.position} outfit={st.outfit} />
      ))}
    </>
  );
}
