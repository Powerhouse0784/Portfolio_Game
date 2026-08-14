"use client";

import { RigidBody } from "@react-three/rapier";
import { WORLD_BOUNDARY_RADIUS } from "@/lib/constants/world";

/**
 * Fixed (static) collider — the base walkable surface.
 * Real terrain (heightmap, paths, zones) replaces this flat plane in the
 * WORLD DESIGN phase; this is the minimum needed to test the character controller.
 */
export default function Ground() {
  return (
    <RigidBody type="fixed" colliders="cuboid" friction={1}>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <planeGeometry args={[WORLD_BOUNDARY_RADIUS * 2.2, WORLD_BOUNDARY_RADIUS * 2.2]} />
        <meshStandardMaterial color="#4f8241" roughness={1} />
      </mesh>

      {/* Subtle darker overlay patches for grass variation — cheap alternative to a texture */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[22, -0.045, -18]}>
        <circleGeometry args={[16, 24]} />
        <meshStandardMaterial color="#446f38" roughness={1} transparent opacity={0.35} />
      </mesh>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[-30, -0.045, 20]}>
        <circleGeometry args={[20, 24]} />
        <meshStandardMaterial color="#5c9048" roughness={1} transparent opacity={0.3} />
      </mesh>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[-15, -0.045, -35]}>
        <circleGeometry args={[14, 24]} />
        <meshStandardMaterial color="#446f38" roughness={1} transparent opacity={0.3} />
      </mesh>
    </RigidBody>
  );
}
