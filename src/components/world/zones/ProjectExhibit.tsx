"use client";

import { RigidBody } from "@react-three/rapier";
import { Billboard, Text } from "@react-three/drei";
import Interactable from "@/components/interaction/Interactable";
import { CATEGORY_COLORS, type Project } from "@/content/projects";

export default function ProjectExhibit({ project, position }: { project: Project; position: [number, number, number] }) {
  const color = CATEGORY_COLORS[project.category];

  return (
    <>
      <group position={position}>
        <RigidBody type="fixed" colliders="cuboid">
          <mesh castShadow>
            <cylinderGeometry args={[0.5, 0.6, 1, 8]} />
            <meshStandardMaterial color="#3a3f4a" roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.52, 0]}>
            <cylinderGeometry args={[0.45, 0.45, 0.06, 8]} />
            <meshStandardMaterial color={color} metalness={0.4} roughness={0.4} emissive={color} emissiveIntensity={0.35} />
          </mesh>
        </RigidBody>

        <Billboard position={[0, 1.2, 0]}>
          <Text
            fontSize={0.15}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            maxWidth={1.3}
            textAlign="center"
            outlineWidth={0.008}
            outlineColor="#000000"
          >
            {project.title}
          </Text>
        </Billboard>
      </group>

      {/* Deliberately a SIBLING of the positioned group above, not a child of it.
          Interactable's `position` prop must be world-space (InteractionManager compares
          it directly against the player's world position) — nesting it inside another
          positioned <group> would silently double-apply the offset. */}
      <Interactable
        id={`project:${project.id}`}
        position={position}
        title={project.title}
        description={project.summary}
        radius={3}
        discoveryRadius={6}
        markerHeight={1.9}
      />
    </>
  );
}
