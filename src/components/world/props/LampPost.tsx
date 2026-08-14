"use client";

import { RigidBody } from "@react-three/rapier";

export default function LampPost({ position }: { position: [number, number, number] }) {
  return (
    <RigidBody type="fixed" colliders="cuboid" position={position}>
      <mesh castShadow position={[0, 1.6, 0]}>
        <cylinderGeometry args={[0.05, 0.07, 3.2, 8]} />
        <meshStandardMaterial color="#2c2c2c" roughness={0.5} metalness={0.4} />
      </mesh>
      <mesh castShadow position={[0, 3.25, 0]}>
        <sphereGeometry args={[0.18, 12, 12]} />
        <meshStandardMaterial color="#fff3d6" emissive="#ffd68a" emissiveIntensity={1.4} roughness={0.3} />
      </mesh>
      <pointLight position={[0, 3.25, 0]} intensity={3} distance={9} decay={2} color="#ffd68a" />
    </RigidBody>
  );
}
