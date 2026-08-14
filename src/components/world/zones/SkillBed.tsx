"use client";

import { Billboard, Text } from "@react-three/drei";
import Interactable from "@/components/interaction/Interactable";
import { CATEGORY_COLORS, CATEGORY_SLUGS, SKILLS, type SkillCategory } from "@/content/skills";

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5)); // natural phyllotaxis spiral, same pattern as real flower heads
const BED_RADIUS = 1.9;

export default function SkillBed({ category, position }: { category: SkillCategory; position: [number, number, number] }) {
  const color = CATEGORY_COLORS[category];
  const skills = SKILLS.filter((s) => s.category === category);

  return (
    <>
      <group position={position}>
        {/* Soil ring + planted bed */}
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[BED_RADIUS - 0.14, BED_RADIUS, 32]} />
          <meshStandardMaterial color="#5c4a35" roughness={1} />
        </mesh>
        <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[BED_RADIUS - 0.14, 32]} />
          <meshStandardMaterial color={color} roughness={1} transparent opacity={0.2} />
        </mesh>

        {skills.map((skill, i) => {
          const r = (BED_RADIUS - 0.55) * Math.sqrt((i + 0.5) / skills.length);
          const theta = i * GOLDEN_ANGLE;
          const fx = r * Math.cos(theta);
          const fz = r * Math.sin(theta);
          const stemHeight = 0.3 + (i % 3) * 0.07;
          return (
            <group key={skill.id} position={[fx, 0, fz]}>
              <mesh position={[0, stemHeight / 2, 0]}>
                <cylinderGeometry args={[0.015, 0.02, stemHeight, 5]} />
                <meshStandardMaterial color="#3f6e38" roughness={0.9} />
              </mesh>
              <mesh position={[0, stemHeight + 0.07, 0]}>
                <sphereGeometry args={[0.09, 8, 8]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.35} roughness={0.5} />
              </mesh>
            </group>
          );
        })}

        <Billboard position={[0, 1.5, 0]}>
          <Text
            fontSize={0.17}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.008}
            outlineColor="#000000"
          >
            {category}
          </Text>
        </Billboard>
      </group>

      <Interactable
        id={`skill-category:${CATEGORY_SLUGS[category]}`}
        position={position}
        title={category}
        description={`${skills.length} skills`}
        radius={4}
        discoveryRadius={8}
        markerHeight={1.9}
      />
    </>
  );
}
