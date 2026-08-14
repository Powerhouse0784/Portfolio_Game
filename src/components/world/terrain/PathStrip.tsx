"use client";

import { useMemo } from "react";
import * as THREE from "three";

type PathStripProps = {
  from: [number, number];
  to: [number, number];
  width: number;
  color: string;
  roughness?: number;
};

/**
 * A flat textured strip laid on top of the ground plane between two XZ points.
 * Sits at y=0.02 to avoid z-fighting with Ground. No physics collider —
 * Ground's collider already covers this area, paths are visual-only.
 */
export default function PathStrip({ from, to, width, color, roughness = 0.95 }: PathStripProps) {
  const { length, angle, midpoint } = useMemo(() => {
    const a = new THREE.Vector2(...from);
    const b = new THREE.Vector2(...to);
    const diff = b.clone().sub(a);
    return {
      length: diff.length(),
      angle: Math.atan2(diff.x, diff.y), // rotation around Y to align plane's local +Z with the segment
      midpoint: a.clone().add(b).multiplyScalar(0.5),
    };
  }, [from, to]);

  return (
    <mesh
      receiveShadow
      position={[midpoint.x, 0.02, midpoint.y]}
      rotation={[-Math.PI / 2, 0, angle]}
    >
      <planeGeometry args={[width, length]} />
      <meshStandardMaterial color={color} roughness={roughness} />
    </mesh>
  );
}
