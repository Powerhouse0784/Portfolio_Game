"use client";

import { RigidBody } from "@react-three/rapier";
import { Text } from "@react-three/drei";
import { ENTRANCE_Z } from "@/lib/constants/zones";

const PILLAR_COLOR = "#5a5248";
const GAP = 3.2; // clearance between pillars, wide enough to walk through comfortably

export default function EntranceGate() {
  return (
    <group position={[0, 0, ENTRANCE_Z]}>
      {[-1, 1].map((side) => (
        <RigidBody key={side} type="fixed" colliders="cuboid" position={[side * (GAP / 2 + 0.4), 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.8, 5, 0.8]} />
            <meshStandardMaterial color={PILLAR_COLOR} roughness={0.8} />
          </mesh>
        </RigidBody>
      ))}

      {/* Arch beam — visual only, high enough it's never a movement obstacle */}
      <mesh castShadow position={[0, 5, 0]}>
        <boxGeometry args={[GAP + 1.6, 0.6, 0.6]} />
        <meshStandardMaterial color={PILLAR_COLOR} roughness={0.8} />
      </mesh>

      <Text
        position={[0, 5, 0.35]}
        fontSize={0.55}
        color="#FFB800"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.05}
      >
        PORTFOLIO PARK
      </Text>
    </group>
  );
}
