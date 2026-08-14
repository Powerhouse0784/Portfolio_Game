"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { mulberry32 } from "@/lib/utils/geometry";
import { POND_CENTER, POND_RADIUS } from "@/lib/world/scenery";
import { WaterMaterial } from "./WaterMaterial";

export default function Pond() {
  const material = useMemo(() => new WaterMaterial(), []);
  useFrame((_, delta) => {
    material.uniforms.uTime.value += delta;
  });

  const lilyPads = useMemo(() => {
    const rand = mulberry32(9001);
    return Array.from({ length: 6 }, () => {
      const angle = rand() * Math.PI * 2;
      const r = rand() * (POND_RADIUS - 1.5);
      return {
        x: POND_CENTER[0] + Math.sin(angle) * r,
        z: POND_CENTER[1] + -Math.cos(angle) * r,
        scale: 0.5 + rand() * 0.35,
        rotation: rand() * Math.PI,
      };
    });
  }, []);

  const reeds = useMemo(() => {
    const rand = mulberry32(9002);
    const count = 10;
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2 + rand() * 0.3;
      const r = POND_RADIUS - 0.4;
      return {
        x: POND_CENTER[0] + Math.sin(angle) * r,
        z: POND_CENTER[1] + -Math.cos(angle) * r,
        height: 0.8 + rand() * 0.5,
      };
    });
  }, []);

  return (
    <group>
      {/* Muddy bank ring, transitions grass -> water */}
      <mesh position={[POND_CENTER[0], 0.005, POND_CENTER[1]]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[POND_RADIUS - 0.4, POND_RADIUS + 0.6, 40]} />
        <meshStandardMaterial color="#5c4a35" roughness={1} />
      </mesh>

      {/* Water surface */}
      <mesh position={[POND_CENTER[0], 0.02, POND_CENTER[1]]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[POND_RADIUS * 2, POND_RADIUS * 2, 24, 24]} />
        <primitive object={material} attach="material" />
      </mesh>

      {lilyPads.map((pad, i) => (
        <group key={i} position={[pad.x, 0.04, pad.z]} rotation={[0, pad.rotation, 0]} scale={pad.scale}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.5, 16, 0, Math.PI * 1.85]} />
            <meshStandardMaterial color="#2f6b3a" roughness={0.8} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0.15, 0.02, 0.1]}>
            <sphereGeometry args={[0.09, 8, 8]} />
            <meshStandardMaterial color="#fff2f7" roughness={0.6} />
          </mesh>
        </group>
      ))}

      {reeds.map((reed, i) => (
        <mesh key={i} position={[reed.x, reed.height / 2, reed.z]} castShadow>
          <coneGeometry args={[0.05, reed.height, 5]} />
          <meshStandardMaterial color="#4a7a3f" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}
