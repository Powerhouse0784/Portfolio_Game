"use client";

import { RigidBody } from "@react-three/rapier";

const WOOD_COLOR = "#7a5738";
const METAL_COLOR = "#3a3a3a";

export default function Bench({
  position,
  rotationY = 0,
}: {
  position: [number, number, number];
  rotationY?: number;
}) {
  return (
    <RigidBody type="fixed" colliders="cuboid" position={position} rotation={[0, rotationY, 0]}>
      <group>
        {/* Seat */}
        <mesh castShadow receiveShadow position={[0, 0.45, 0]}>
          <boxGeometry args={[1.4, 0.08, 0.5]} />
          <meshStandardMaterial color={WOOD_COLOR} roughness={0.8} />
        </mesh>
        {/* Backrest */}
        <mesh castShadow position={[0, 0.75, -0.22]} rotation={[0.15, 0, 0]}>
          <boxGeometry args={[1.4, 0.5, 0.06]} />
          <meshStandardMaterial color={WOOD_COLOR} roughness={0.8} />
        </mesh>
        {/* Legs */}
        {[-0.6, 0.6].map((x) => (
          <mesh key={x} castShadow position={[x, 0.22, 0]}>
            <boxGeometry args={[0.06, 0.44, 0.5]} />
            <meshStandardMaterial color={METAL_COLOR} roughness={0.6} metalness={0.3} />
          </mesh>
        ))}
      </group>
    </RigidBody>
  );
}
