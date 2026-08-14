"use client";

import { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { mulberry32 } from "@/lib/utils/geometry";
import { WORLD_BOUNDARY_RADIUS } from "@/lib/constants/world";
import { isSceneryExcluded } from "@/lib/world/scenery";

const PATCH_COUNT = 30;
const FLOWERS_PER_PATCH = 14;
const SEED = 133;
const COLORS = ["#ff6b81", "#ffd23f", "#ffffff", "#c86bff"];

type Flower = { position: THREE.Vector3; colorIdx: number };

export default function FlowerPatches() {
  const flowers = useMemo<Flower[]>(() => {
    const rand = mulberry32(SEED);
    const result: Flower[] = [];
    let attempts = 0;

    while (result.length < PATCH_COUNT * FLOWERS_PER_PATCH && attempts < PATCH_COUNT * 40) {
      attempts++;
      const angle = rand() * Math.PI * 2;
      const radius = Math.sqrt(rand()) * (WORLD_BOUNDARY_RADIUS - 6);
      const cx = Math.sin(angle) * radius;
      const cz = -Math.cos(angle) * radius;
      if (isSceneryExcluded(cx, cz, { margin: -1.5 })) continue;

      for (let i = 0; i < FLOWERS_PER_PATCH && result.length < PATCH_COUNT * FLOWERS_PER_PATCH; i++) {
        const ox = (rand() - 0.5) * 2.4;
        const oz = (rand() - 0.5) * 2.4;
        result.push({
          position: new THREE.Vector3(cx + ox, 0, cz + oz),
          colorIdx: Math.floor(rand() * COLORS.length),
        });
      }
    }
    return result;
  }, []);

  const byColor = useMemo(() => {
    const groups: Flower[][] = [[], [], [], []];
    flowers.forEach((f) => groups[f.colorIdx].push(f));
    return groups;
  }, [flowers]);

  const ref0 = useRef<THREE.InstancedMesh>(null);
  const ref1 = useRef<THREE.InstancedMesh>(null);
  const ref2 = useRef<THREE.InstancedMesh>(null);
  const ref3 = useRef<THREE.InstancedMesh>(null);
  const refs = [ref0, ref1, ref2, ref3];

  useEffect(() => {
    const dummy = new THREE.Object3D();
    refs.forEach((ref, i) => {
      const mesh = ref.current;
      if (!mesh) return;
      byColor[i].forEach((f, idx) => {
        dummy.position.set(f.position.x, 0.09, f.position.z);
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
        <instancedMesh key={color} ref={refs[i]} args={[undefined, undefined, byColor[i].length || 1]} frustumCulled={false}>
          <coneGeometry args={[0.06, 0.18, 5]} />
          <meshStandardMaterial color={color} roughness={0.6} />
        </instancedMesh>
      ))}
    </>
  );
}
