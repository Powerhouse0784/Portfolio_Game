"use client";

import { RigidBody } from "@react-three/rapier";
import { Text } from "@react-three/drei";
import { Zone } from "@/lib/constants/zones";

export default function ZoneMarker({ zone, position }: { zone: Zone; position: [number, number, number] }) {
  const [x, y, z] = position;

  return (
    <group position={[x, y, z]}>
      {/* Tinted ground patch so each zone reads as a distinct area from a distance */}
      <mesh receiveShadow position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[7, 40]} />
        <meshStandardMaterial color={zone.color} roughness={1} transparent opacity={0.18} />
      </mesh>

      {/* Signboard */}
      <RigidBody type="fixed" colliders="cuboid" position={[0, 0, 5.5]}>
        <mesh castShadow position={[0, 0.9, 0]}>
          <boxGeometry args={[0.12, 1.8, 0.12]} />
          <meshStandardMaterial color="#5a5248" roughness={0.8} />
        </mesh>
        <mesh castShadow position={[0, 1.7, 0]}>
          <boxGeometry args={[2.2, 0.9, 0.1]} />
          <meshStandardMaterial color="#fdf6ec" roughness={0.6} />
        </mesh>
        <Text
          position={[0, 1.7, 0.06]}
          fontSize={0.22}
          color="#2b2b2b"
          anchorX="center"
          anchorY="middle"
          maxWidth={1.9}
          textAlign="center"
        >
          {zone.name}
        </Text>
      </RigidBody>
    </group>
  );
}
