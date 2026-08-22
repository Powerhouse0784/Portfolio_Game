"use client";

import { RigidBody } from "@react-three/rapier";
import { ZONES, ZONE_RING_RADIUS, angleToPosition } from "@/lib/constants/zones";

const CART_COLOR = "#7a3f4a";
const AWNING_COLOR = "#fdf6ec";
const TABLE_COLOR = "#5a4634";
const UMBRELLA_COLOR = "#FF3D5A";
const CHAIR_COLOR = "#3a3f4a";

export default function CafeStand() {
  const zone = ZONES.find((z) => z.id === "cafe");
  if (!zone) return null;

  const center = angleToPosition(zone.angleDeg, ZONE_RING_RADIUS);
  const toPlazaAngle = Math.atan2(-center[0], -center[2]);

  const offset = (deg: number, radius: number): [number, number, number] => {
    const rad = toPlazaAngle + (deg * Math.PI) / 180;
    return [center[0] + radius * Math.sin(rad), 0, center[2] + radius * Math.cos(rad)];
  };

  return (
    <>
      {/* Food cart */}
      <RigidBody type="fixed" colliders="cuboid" position={offset(0, 2)}>
        <mesh castShadow position={[0, 0.7, 0]}>
          <boxGeometry args={[1.3, 1.2, 0.8]} />
          <meshStandardMaterial color={CART_COLOR} roughness={0.6} />
        </mesh>
        <mesh castShadow position={[0, 1.45, 0]}>
          <boxGeometry args={[1.6, 0.12, 1]} />
          <meshStandardMaterial color={AWNING_COLOR} roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.75, 0.42]}>
          <boxGeometry args={[1.1, 0.5, 0.03]} />
          <meshStandardMaterial color="#0d1b12" emissive="#FFB800" emissiveIntensity={0.25} roughness={0.4} />
        </mesh>
      </RigidBody>

      <CafeTable position={offset(-35, 3.6)} />
      <CafeTable position={offset(35, 3.6)} />
    </>
  );
}

function CafeTable({ position }: { position: [number, number, number] }) {
  return (
    <RigidBody type="fixed" colliders="cuboid" position={position}>
      {/* Umbrella */}
      <mesh castShadow position={[0, 1.9, 0]}>
        <coneGeometry args={[0.85, 0.4, 8]} />
        <meshStandardMaterial color={UMBRELLA_COLOR} roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.1, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 1.6, 6]} />
        <meshStandardMaterial color={TABLE_COLOR} roughness={0.7} />
      </mesh>
      {/* Table */}
      <mesh castShadow position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.06, 12]} />
        <meshStandardMaterial color={TABLE_COLOR} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.28, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.5, 6]} />
        <meshStandardMaterial color="#2c2c2c" roughness={0.5} metalness={0.3} />
      </mesh>
      {/* Two simple chairs */}
      {[0.65, -0.65].map((x, i) => (
        <mesh key={i} castShadow position={[x, 0.28, 0]}>
          <boxGeometry args={[0.32, 0.06, 0.32]} />
          <meshStandardMaterial color={CHAIR_COLOR} roughness={0.7} />
        </mesh>
      ))}
    </RigidBody>
  );
}
