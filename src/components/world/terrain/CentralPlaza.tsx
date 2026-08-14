"use client";

import { RigidBody } from "@react-three/rapier";
import { PLAZA_RADIUS } from "@/lib/constants/zones";

const STONE_COLOR = "#a39d92";
const STONE_RING_COLOR = "#88837a";

/**
 * The park's centerpiece: a circular walking plaza with a stacked monument
 * at its center. Original design (not referencing any existing landmark) —
 * three tapered forms rising to a golden ring, echoing the brand palette
 * (coral / emerald / gold) used across Intense Cook.
 */
export default function CentralPlaza() {
  return (
    <group>
      {/* Plaza disc — visual only, Ground's collider already covers this area */}
      <mesh receiveShadow position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[PLAZA_RADIUS, 48]} />
        <meshStandardMaterial color={STONE_COLOR} roughness={0.9} />
      </mesh>

      {/* Decorative ring inlay */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[PLAZA_RADIUS - 0.6, PLAZA_RADIUS - 0.3, 48]} />
        <meshStandardMaterial color={STONE_RING_COLOR} roughness={0.9} />
      </mesh>

      {/* Monument, with a solid collider so it's a real obstacle, not a walk-through prop */}
      <RigidBody type="fixed" colliders="cuboid" position={[0, 0, 0]}>
        <mesh castShadow position={[0, 0.4, 0]}>
          <cylinderGeometry args={[1.4, 1.6, 0.8, 8]} />
          <meshStandardMaterial color="#3a3f4a" roughness={0.7} />
        </mesh>
        <mesh castShadow position={[0, 1.6, 0]}>
          <cylinderGeometry args={[0.5, 0.9, 2.4, 8]} />
          <meshStandardMaterial color="#2b3a55" roughness={0.6} />
        </mesh>
        <mesh castShadow position={[0, 3.1, 0]}>
          <torusGeometry args={[0.65, 0.1, 12, 32]} />
          <meshStandardMaterial color="#FFB800" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh castShadow position={[0, 3.9, 0]}>
          <coneGeometry args={[0.35, 0.9, 8]} />
          <meshStandardMaterial color="#FF3D5A" roughness={0.4} />
        </mesh>
      </RigidBody>

      <pointLight position={[0, 4.5, 0]} intensity={8} color="#FFB800" distance={12} decay={2} />
    </group>
  );
}
