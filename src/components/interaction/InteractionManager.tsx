"use client";

import { useFrame } from "@react-three/fiber";
import { usePlayerStore } from "@/lib/stores/usePlayerStore";
import { useInteractionStore } from "@/lib/stores/useInteractionStore";
import { playUiTone } from "@/lib/audio/uiSound";

export default function InteractionManager() {
  useFrame(() => {
    const [px, , pz] = usePlayerStore.getState().position;
    const { entries, visitedIds, markVisited, setProximity } = useInteractionStore.getState();

    let nearestId: string | null = null;
    let nearestDist = Infinity;
    const inRange: string[] = [];

    for (const entry of Object.values(entries)) {
      const dx = px - entry.position[0];
      const dz = pz - entry.position[2];
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist <= entry.discoveryRadius) {
        inRange.push(entry.id);
        if (!visitedIds.includes(entry.id)) {
          markVisited(entry.id);
          playUiTone("discover");
        }
      }
      if (dist <= entry.radius && dist < nearestDist) {
        nearestDist = dist;
        nearestId = entry.id;
      }
    }

    setProximity(nearestId, inRange);
  });

  return null;
}
