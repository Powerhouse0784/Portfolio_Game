"use client";

import { Billboard, Text } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import Interactable from "@/components/interaction/Interactable";
import { ZONES, ZONE_RING_RADIUS, angleToPosition } from "@/lib/constants/zones";

const SHIRT_COLOR = "#2b3a55";
const SKIN_COLOR = "#e0a978";
const HAIR_COLOR = "#2b2018";
const GOLD = "#FFB800";
const STONE_COLOR = "#8a837a";

export default function AboutBust() {
  const zone = ZONES.find((z) => z.id === "about");
  if (!zone) return null;

  const center = angleToPosition(zone.angleDeg, ZONE_RING_RADIUS);
  // Same "face the approach path" logic used for the Projects and Skills exhibits.
  const toPlazaAngle = Math.atan2(-center[0], -center[2]);

  const offset = (deg: number, radius: number): [number, number, number] => {
    const rad = toPlazaAngle + (deg * Math.PI) / 180;
    return [center[0] + radius * Math.sin(rad), 0, center[2] + radius * Math.cos(rad)];
  };

  const timelinePos = offset(-40, 3.6);
  const valuesPos = offset(40, 3.6);

  return (
    <>
      {/* Central bust — stylized statue in the same palette as the player character */}
      <group position={center}>
        <RigidBody type="fixed" colliders="cuboid">
          <mesh castShadow position={[0, 0.5, 0]}>
            <cylinderGeometry args={[0.5, 0.6, 1, 8]} />
            <meshStandardMaterial color="#3a3f4a" roughness={0.7} />
          </mesh>
          <mesh castShadow position={[0, 1.25, 0]}>
            <sphereGeometry args={[0.42, 12, 12, 0, Math.PI * 2, 0, Math.PI * 0.65]} />
            <meshStandardMaterial color={SHIRT_COLOR} roughness={0.7} />
          </mesh>
          <mesh castShadow position={[0, 1.65, 0]}>
            <sphereGeometry args={[0.22, 14, 14]} />
            <meshStandardMaterial color={SKIN_COLOR} roughness={0.8} />
          </mesh>
          <mesh castShadow position={[0, 1.75, -0.02]}>
            <sphereGeometry args={[0.235, 14, 14, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
            <meshStandardMaterial color={HAIR_COLOR} roughness={0.9} />
          </mesh>
        </RigidBody>
        <mesh position={[0, 0.15, 0.51]}>
          <boxGeometry args={[0.5, 0.15, 0.02]} />
          <meshStandardMaterial color={GOLD} metalness={0.4} roughness={0.4} />
        </mesh>
      </group>

      <Pillar position={timelinePos} label="Timeline" id="about-tab:timeline" description="Career timeline" />
      <Pillar position={valuesPos} label="Values & Interests" id="about-tab:values" description="What I value" />
    </>
  );
}

function Pillar({
  position,
  label,
  id,
  description,
}: {
  position: [number, number, number];
  label: string;
  id: string;
  description: string;
}) {
  return (
    <>
      <group position={position}>
        <RigidBody type="fixed" colliders="cuboid">
          <mesh castShadow position={[0, 0.5, 0]}>
            <boxGeometry args={[0.4, 1, 0.4]} />
            <meshStandardMaterial color={STONE_COLOR} roughness={0.8} />
          </mesh>
        </RigidBody>
        <Billboard position={[0, 1.3, 0]}>
          <Text
            fontSize={0.14}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.007}
            outlineColor="#000000"
            maxWidth={1.2}
            textAlign="center"
          >
            {label}
          </Text>
        </Billboard>
      </group>

      <Interactable id={id} position={position} title={label} description={description} radius={3} discoveryRadius={6} markerHeight={1.7} />
    </>
  );
}
