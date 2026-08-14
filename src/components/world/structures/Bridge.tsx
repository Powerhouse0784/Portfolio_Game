"use client";

import { RigidBody } from "@react-three/rapier";
import { POND_CENTER, POND_RADIUS } from "@/lib/world/scenery";

const PLANK_COLOR = "#8a6440";
const RAIL_COLOR = "#6b4c30";
const BRIDGE_LENGTH = POND_RADIUS * 2 + 1.5;
const BRIDGE_WIDTH = 1.6;

/** Straight footbridge along the X axis, crossing the pond's diameter. */
export default function Bridge() {
  return (
    <group position={[POND_CENTER[0], 0, POND_CENTER[1]]}>
      <RigidBody type="fixed" colliders="cuboid" position={[0, 0.12, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[BRIDGE_LENGTH, 0.15, BRIDGE_WIDTH]} />
          <meshStandardMaterial color={PLANK_COLOR} roughness={0.85} />
        </mesh>
      </RigidBody>

      {/* Rails — visual only */}
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh position={[0, 0.55, (side * BRIDGE_WIDTH) / 2]}>
            <boxGeometry args={[BRIDGE_LENGTH, 0.06, 0.06]} />
            <meshStandardMaterial color={RAIL_COLOR} roughness={0.8} />
          </mesh>
          {Array.from({ length: 7 }, (_, i) => {
            const x = -BRIDGE_LENGTH / 2 + (i / 6) * BRIDGE_LENGTH;
            return (
              <mesh key={i} position={[x, 0.35, (side * BRIDGE_WIDTH) / 2]}>
                <boxGeometry args={[0.06, 0.5, 0.06]} />
                <meshStandardMaterial color={RAIL_COLOR} roughness={0.8} />
              </mesh>
            );
          })}
        </group>
      ))}
    </group>
  );
}
