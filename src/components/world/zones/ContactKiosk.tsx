"use client";

import { RigidBody } from "@react-three/rapier";
import { Billboard, Text } from "@react-three/drei";
import Bench from "@/components/world/props/Bench";
import { getContactBenchSpot } from "@/lib/world/benchSpots";
import { ZONES, ZONE_RING_RADIUS, angleToPosition } from "@/lib/constants/zones";

const KIOSK_COLOR = "#2b3a55";
const SCREEN_COLOR = "#0d1b12";
const GOLD = "#FFB800";

export default function ContactKiosk() {
  const zone = ZONES.find((z) => z.id === "contact");
  if (!zone) return null;

  const center = angleToPosition(zone.angleDeg, ZONE_RING_RADIUS);
  const toPlazaAngle = Math.atan2(-center[0], -center[2]);

  const offset = (deg: number, radius: number): [number, number, number] => {
    const rad = toPlazaAngle + (deg * Math.PI) / 180;
    return [center[0] + radius * Math.sin(rad), 0, center[2] + radius * Math.cos(rad)];
  };

  const kioskPos = offset(0, 1.8);
  const benchSpot = getContactBenchSpot();

  return (
    <>
      <group position={kioskPos}>
        <RigidBody type="fixed" colliders="cuboid">
          <mesh castShadow position={[0, 0.6, 0]}>
            <boxGeometry args={[0.7, 1.2, 0.5]} />
            <meshStandardMaterial color={KIOSK_COLOR} roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.9, 0.26]}>
            <boxGeometry args={[0.5, 0.35, 0.02]} />
            <meshStandardMaterial color={SCREEN_COLOR} emissive="#00C48C" emissiveIntensity={0.4} roughness={0.3} />
          </mesh>
        </RigidBody>
        <mesh position={[0, 1.25, 0.26]}>
          <boxGeometry args={[0.7, 0.05, 0.02]} />
          <meshStandardMaterial color={GOLD} metalness={0.5} roughness={0.4} />
        </mesh>
        <Billboard position={[0, 1.7, 0]}>
          <Text fontSize={0.16} color="#ffffff" anchorX="center" anchorY="middle" outlineWidth={0.008} outlineColor="#000000">
            Get In Touch
          </Text>
        </Billboard>
      </group>

      {benchSpot && <Bench position={benchSpot.position} rotationY={benchSpot.rotationY} />}
    </>
  );
}
