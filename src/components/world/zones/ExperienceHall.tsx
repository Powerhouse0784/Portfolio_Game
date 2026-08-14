"use client";

import { RigidBody } from "@react-three/rapier";
import { Billboard, Text } from "@react-three/drei";
import Interactable from "@/components/interaction/Interactable";
import { ZONES, ZONE_RING_RADIUS, angleToPosition } from "@/lib/constants/zones";

const PILLAR_COLOR = "#4a4640";
const ROOF_COLOR = "#5a5248";
const GOLD = "#FFB800";
const PLINTH_COLOR = "#3a3f4a";

export default function ExperienceHall() {
  const zone = ZONES.find((z) => z.id === "experience");
  if (!zone) return null;

  const center = angleToPosition(zone.angleDeg, ZONE_RING_RADIUS);
  const toPlazaAngle = Math.atan2(-center[0], -center[2]);

  const offset = (deg: number, radius: number): [number, number, number] => {
    const rad = toPlazaAngle + (deg * Math.PI) / 180;
    return [center[0] + radius * Math.sin(rad), 0, center[2] + radius * Math.cos(rad)];
  };

  const pillarPositions = [45, 135, -45, -135].map((deg) => offset(deg, 2.6));

  return (
    <>
      <group>
        {pillarPositions.map((pos, i) => (
          <RigidBody key={i} type="fixed" colliders="cuboid" position={pos}>
            <mesh castShadow position={[0, 1.4, 0]}>
              <cylinderGeometry args={[0.18, 0.22, 2.8, 8]} />
              <meshStandardMaterial color={PILLAR_COLOR} roughness={0.75} />
            </mesh>
          </RigidBody>
        ))}

        {/* Roof — sits centered on the zone regardless of pillar rotation, since the
            four pillar angles are symmetric around it */}
        <mesh castShadow position={[center[0], 2.85, center[2]]}>
          <boxGeometry args={[5.6, 0.25, 5.6]} />
          <meshStandardMaterial color={ROOF_COLOR} roughness={0.7} />
        </mesh>
        <mesh position={[center[0], 2.7, center[2]]}>
          <boxGeometry args={[5.8, 0.04, 5.8]} />
          <meshStandardMaterial color={GOLD} metalness={0.4} roughness={0.4} />
        </mesh>
      </group>

      <TrophyPlinth
        position={offset(-25, 1.5)}
        label="Achievements"
        id="experience-tab:achievements"
        description="Hackathons & recognitions"
      />
      <TrophyPlinth
        position={offset(25, 1.5)}
        label="Technical Experience"
        id="experience-tab:technical"
        description="Hard-won skills in practice"
      />
    </>
  );
}

function TrophyPlinth({
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
          <mesh castShadow position={[0, 0.35, 0]}>
            <boxGeometry args={[0.5, 0.7, 0.5]} />
            <meshStandardMaterial color={PLINTH_COLOR} roughness={0.7} />
          </mesh>
        </RigidBody>
        <mesh castShadow position={[0, 0.78, 0]}>
          <coneGeometry args={[0.18, 0.3, 4]} />
          <meshStandardMaterial color={GOLD} metalness={0.6} roughness={0.3} emissive={GOLD} emissiveIntensity={0.3} />
        </mesh>
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
