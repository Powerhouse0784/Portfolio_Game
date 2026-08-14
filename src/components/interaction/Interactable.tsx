"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useInteractionStore } from "@/lib/stores/useInteractionStore";

type Props = {
  id: string;
  position: [number, number, number];
  title: string;
  description: string;
  radius?: number;
  discoveryRadius?: number;
  markerHeight?: number;
};

export default function Interactable({
  id,
  position,
  title,
  description,
  radius = 6,
  discoveryRadius = 13,
  markerHeight = 2.4,
}: Props) {
  const register = useInteractionStore((s) => s.register);
  const unregister = useInteractionStore((s) => s.unregister);

  useEffect(() => {
    register({ id, position, radius, discoveryRadius, title, description });
    return () => unregister(id);
    // Registered once on mount — zone positions are static for now, no need to re-run.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const isNearest = useInteractionStore((s) => s.nearestId === id);
  const inRange = useInteractionStore((s) => s.inRangeIds.includes(id));
  const markerRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state, delta) => {
    const mesh = markerRef.current;
    const material = materialRef.current;
    if (!mesh || !material) return;

    const t = state.clock.elapsedTime;
    mesh.position.set(position[0], position[1] + markerHeight + Math.sin(t * 2) * 0.08, position[2]);
    mesh.rotation.y += delta * 1.2;

    const targetScale = isNearest ? 1.35 : inRange ? 1.0 : 0.6;
    const nextScale = THREE.MathUtils.lerp(mesh.scale.x, targetScale, 0.12);
    mesh.scale.setScalar(nextScale);

    const targetOpacity = isNearest ? 1 : inRange ? 0.85 : 0.35;
    material.opacity = THREE.MathUtils.lerp(material.opacity, targetOpacity, 0.1);
    material.emissiveIntensity = THREE.MathUtils.lerp(material.emissiveIntensity, isNearest ? 1.4 : 0.5, 0.1);
  });

  return (
    <mesh ref={markerRef} position={[position[0], position[1] + markerHeight, position[2]]}>
      <octahedronGeometry args={[0.2, 0]} />
      <meshStandardMaterial
        ref={materialRef}
        color={isNearest ? "#FFB800" : "#ffffff"}
        emissive={isNearest ? "#FFB800" : "#88ccff"}
        emissiveIntensity={0.5}
        transparent
        opacity={0.4}
        roughness={0.3}
      />
    </mesh>
  );
}
