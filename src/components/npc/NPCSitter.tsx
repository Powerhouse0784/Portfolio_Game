"use client";

import { RigidBody } from "@react-three/rapier";
import NPCCharacter from "./NPCCharacter";
import type { NPCOutfit } from "@/lib/world/npcOutfits";
import type { BenchSpot } from "@/lib/world/benchSpots";

// Bench seat surface sits at y=0.45 (see Bench.tsx). The "sit" pose in NPCCharacter
// applies its own -0.08 internal hip drop as part of the animation, so this base
// height needs to be raised by that same amount for the two to land on the seat
// correctly instead of sinking below it.
const SEAT_HEIGHT = 0.53;

export default function NPCSitter({ spot, outfit }: { spot: BenchSpot; outfit: NPCOutfit }) {
  return (
    <RigidBody
      type="fixed"
      colliders="cuboid"
      position={[spot.position[0], SEAT_HEIGHT, spot.position[2]]}
      rotation={[0, spot.rotationY, 0]}
    >
      <NPCCharacter animState="sit" outfit={outfit} />
    </RigidBody>
  );
}
