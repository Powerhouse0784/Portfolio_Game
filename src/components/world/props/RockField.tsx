"use client";

import { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { RigidBody } from "@react-three/rapier";
import { mulberry32 } from "@/lib/utils/geometry";
import { WORLD_BOUNDARY_RADIUS } from "@/lib/constants/world";
import { isSceneryExcluded, POND_CENTER, POND_RADIUS } from "@/lib/world/scenery";

const SCATTERED_ROCK_COUNT = 35;
const SEED = 201;
const ROCK_COLOR = "#8b8478";

type Rock = { position: THREE.Vector3; scale: number; rotation: THREE.Euler };

function scatterRocks(): Rock[] {
  const rand = mulberry32(SEED);
  const result: Rock[] = [];
  let attempts = 0;

  while (result.length < SCATTERED_ROCK_COUNT && attempts < SCATTERED_ROCK_COUNT * 30) {
    attempts++;
    const angle = rand() * Math.PI * 2;
    const radius = Math.sqrt(rand()) * (WORLD_BOUNDARY_RADIUS - 5);
    const x = Math.sin(angle) * radius;
    const z = -Math.cos(angle) * radius;
    if (isSceneryExcluded(x, z, { margin: -1 })) continue;

    result.push({
      position: new THREE.Vector3(x, 0.15 + rand() * 0.1, z),
      scale: 0.3 + rand() * 0.5,
      rotation: new THREE.Euler(rand() * Math.PI, rand() * Math.PI, rand() * Math.PI),
    });
  }
  return result;
}

function pondRimRocks(): Rock[] {
  const rand = mulberry32(SEED + 1);
  const count = 16;
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 + rand() * 0.15;
    const r = POND_RADIUS + 0.3 + rand() * 0.4;
    return {
      position: new THREE.Vector3(
        POND_CENTER[0] + Math.sin(angle) * r,
        0.1,
        POND_CENTER[1] + -Math.cos(angle) * r
      ),
      scale: 0.35 + rand() * 0.35,
      rotation: new THREE.Euler(rand() * Math.PI, rand() * Math.PI, rand() * Math.PI),
    };
  });
}

export default function RockField() {
  const rocks = useMemo(() => [...scatterRocks(), ...pondRimRocks()], []);
  const ref = useRef<THREE.InstancedMesh>(null);

  useEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    rocks.forEach((r, i) => {
      dummy.position.copy(r.position);
      dummy.scale.setScalar(r.scale);
      dummy.rotation.copy(r.rotation);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [rocks]);

  return (
    <group>
      <instancedMesh ref={ref} args={[undefined, undefined, rocks.length]} castShadow receiveShadow frustumCulled={false}>
        <icosahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial color={ROCK_COLOR} roughness={1} flatShading />
      </instancedMesh>

      {/* Colliders only on the larger scattered rocks — pond rim rocks are small/decorative */}
      {rocks.slice(0, SCATTERED_ROCK_COUNT).map((r, i) => (
        <RigidBody key={i} type="fixed" colliders="ball" position={r.position.toArray()}>
          <mesh visible={false}>
            <sphereGeometry args={[0.5 * r.scale]} />
          </mesh>
        </RigidBody>
      ))}
    </group>
  );
}
