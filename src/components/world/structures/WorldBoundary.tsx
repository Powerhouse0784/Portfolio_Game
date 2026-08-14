"use client";

import { useMemo } from "react";
import { RigidBody } from "@react-three/rapier";
import { WORLD_BOUNDARY_RADIUS } from "@/lib/constants/world";

const SEGMENTS = 48;
const WALL_HEIGHT = 6;
const WALL_THICKNESS = 1;

/**
 * A ring of invisible static box colliders forming the world edge.
 * Deliberately generated as short overlapping segments rather than one giant
 * cylinder collider — cheaper to raycast against for the "approaching edge"
 * warning system, and easy to swap individual segments for a visible fence
 * mesh later without touching physics.
 */
export default function WorldBoundary() {
  const segments = useMemo(() => {
    const segmentLength =
      (2 * Math.PI * WORLD_BOUNDARY_RADIUS) / SEGMENTS + 0.5; // slight overlap, no gaps
    return Array.from({ length: SEGMENTS }, (_, i) => {
      const angle = (i / SEGMENTS) * Math.PI * 2;
      const x = Math.cos(angle) * WORLD_BOUNDARY_RADIUS;
      const z = Math.sin(angle) * WORLD_BOUNDARY_RADIUS;
      // Rotate each segment to face tangent to the circle
      const rotationY = -angle;
      return { position: [x, WALL_HEIGHT / 2, z] as [number, number, number], rotationY, segmentLength };
    });
  }, []);

  return (
    <>
      {segments.map((seg, i) => (
        <RigidBody key={i} type="fixed" colliders="cuboid" position={seg.position} rotation={[0, seg.rotationY, 0]}>
          <mesh visible={false}>
            <boxGeometry args={[seg.segmentLength, WALL_HEIGHT, WALL_THICKNESS]} />
            <meshBasicMaterial />
          </mesh>
        </RigidBody>
      ))}
    </>
  );
}
