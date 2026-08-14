"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { WORLD_BOUNDARY_RADIUS } from "@/lib/constants/world";

const POST_COUNT = 64;
const POST_HEIGHT = 1.1;
const FENCE_COLOR = "#6b5641";

export default function BoundaryFence() {
  const posts = useMemo(() => {
    return Array.from({ length: POST_COUNT }, (_, i) => {
      const angle = (i / POST_COUNT) * Math.PI * 2;
      return {
        position: [
          Math.sin(angle) * WORLD_BOUNDARY_RADIUS,
          POST_HEIGHT / 2,
          -Math.cos(angle) * WORLD_BOUNDARY_RADIUS,
        ] as [number, number, number],
        rotationY: -angle,
      };
    });
  }, []);

  const postMeshRef = useRef<THREE.InstancedMesh>(null);

  useEffect(() => {
    const mesh = postMeshRef.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    posts.forEach((p, i) => {
      dummy.position.set(...p.position);
      dummy.rotation.y = p.rotationY;
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [posts]);

  return (
    <group>
      <instancedMesh ref={postMeshRef} args={[undefined, undefined, POST_COUNT]} castShadow frustumCulled={false}>
        <cylinderGeometry args={[0.08, 0.1, POST_HEIGHT, 6]} />
        <meshStandardMaterial color={FENCE_COLOR} roughness={0.85} />
      </instancedMesh>

      {/* Two horizontal rails running the full ring, approximated as thin tori */}
      {[0.5, 1.0].map((h) => (
        <mesh key={h} rotation={[Math.PI / 2, 0, 0]} position={[0, h, 0]}>
          <torusGeometry args={[WORLD_BOUNDARY_RADIUS, 0.035, 6, 96]} />
          <meshStandardMaterial color={FENCE_COLOR} roughness={0.85} />
        </mesh>
      ))}
    </group>
  );
}
