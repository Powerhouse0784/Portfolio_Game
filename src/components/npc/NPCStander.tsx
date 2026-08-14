"use client";

import { RigidBody } from "@react-three/rapier";
import NPCCharacter from "./NPCCharacter";
import type { NPCOutfit } from "@/lib/world/npcOutfits";

// Matches the walker/player capsule resting height. `position` below is always
// ground-relative (y ignored/expected 0) — the rig's own hips sit mid-body, not
// at the feet, so without this the legs sink straight into the ground.
const RESTING_HEIGHT = 0.9;

export default function NPCStander({
  position,
  rotationY = 0,
  outfit,
}: {
  position: [number, number, number];
  rotationY?: number;
  outfit: NPCOutfit;
}) {
  return (
    <RigidBody
      type="fixed"
      colliders="cuboid"
      position={[position[0], RESTING_HEIGHT, position[2]]}
      rotation={[0, rotationY, 0]}
    >
      <NPCCharacter animState="idle" outfit={outfit} />
    </RigidBody>
  );
}
