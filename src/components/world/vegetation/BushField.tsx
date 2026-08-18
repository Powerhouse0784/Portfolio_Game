"use client";

import { useMemo, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { mulberry32 } from "@/lib/utils/geometry";
import { WORLD_BOUNDARY_RADIUS } from "@/lib/constants/world";
import { isSceneryExcluded } from "@/lib/world/scenery";
import { applyWindSway } from "@/lib/materials/windSway";

const CLUSTER_COUNT = 45;
const BUSHES_PER_CLUSTER = 3;
const SEED = 77;
const COLORS = ["#4a7a3f", "#527f45", "#3f6e38"];

type Bush = { position: THREE.Vector3; scale: number; colorIdx: number };

export default function BushField() {
  const bushes = useMemo<Bush[]>(() => {
    const rand = mulberry32(SEED);
    const result: Bush[] = [];
    let attempts = 0;

    while (result.length < CLUSTER_COUNT * BUSHES_PER_CLUSTER && attempts < CLUSTER_COUNT * 40) {
      attempts++;
      const angle = rand() * Math.PI * 2;
      const radius = Math.sqrt(rand()) * (WORLD_BOUNDARY_RADIUS - 8);
      const cx = Math.sin(angle) * radius;
      const cz = -Math.cos(angle) * radius;
      if (isSceneryExcluded(cx, cz, { margin: -2 })) continue; // bushes can sit a bit closer to paths than trees

      for (let i = 0; i < BUSHES_PER_CLUSTER && result.length < CLUSTER_COUNT * BUSHES_PER_CLUSTER; i++) {
        const ox = (rand() - 0.5) * 1.6;
        const oz = (rand() - 0.5) * 1.6;
        result.push({
          position: new THREE.Vector3(cx + ox, 0, cz + oz),
          scale: 0.5 + rand() * 0.4,
          colorIdx: Math.floor(rand() * COLORS.length),
        });
      }
    }
    return result;
  }, []);

  const byColor = useMemo(() => {
    const groups: Bush[][] = [[], [], []];
    bushes.forEach((b) => groups[b.colorIdx].push(b));
    return groups;
  }, [bushes]);

  const ref0 = useRef<THREE.InstancedMesh>(null);
  const ref1 = useRef<THREE.InstancedMesh>(null);
  const ref2 = useRef<THREE.InstancedMesh>(null);
  const refs = [ref0, ref1, ref2];

  const windMaterials = useMemo(
    () =>
      COLORS.map((color) => {
        const m = new THREE.MeshStandardMaterial({ color, roughness: 0.95, flatShading: true });
        // Bushes are low and dense — a gentler, quicker rustle than the tree canopies.
        return { mat: m, uniforms: applyWindSway(m, { strength: 0.09, speed: 1.8 }) };
      }),
    []
  );
  useFrame((state) => {
    windMaterials.forEach(({ uniforms }) => {
      uniforms.uTime.value = state.clock.elapsedTime;
    });
  });

  useEffect(() => {
    const dummy = new THREE.Object3D();
    refs.forEach((ref, i) => {
      const mesh = ref.current;
      if (!mesh) return;
      byColor[i].forEach((b, idx) => {
        dummy.position.set(b.position.x, 0.35 * b.scale, b.position.z);
        dummy.scale.setScalar(b.scale);
        dummy.updateMatrix();
        mesh.setMatrixAt(idx, dummy.matrix);
      });
      mesh.count = byColor[i].length;
      mesh.instanceMatrix.needsUpdate = true;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [byColor]);

  return (
    <>
      {COLORS.map((color, i) => (
        <instancedMesh key={color} ref={refs[i]} args={[undefined, undefined, byColor[i].length || 1]} castShadow receiveShadow frustumCulled={false}>
          <icosahedronGeometry args={[0.55, 1]} />
          <primitive object={windMaterials[i].mat} attach="material" />
        </instancedMesh>
      ))}
    </>
  );
}
