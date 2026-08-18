"use client";

import { useMemo, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { RigidBody, CylinderCollider } from "@react-three/rapier";
import { mulberry32 } from "@/lib/utils/geometry";
import { WORLD_BOUNDARY_RADIUS } from "@/lib/constants/world";
import { isSceneryExcluded } from "@/lib/world/scenery";
import { applyWindSway } from "@/lib/materials/windSway";

const TREE_COUNT = 150;
const SEED = 42;
const TRUNK_COLOR = "#5c4430";

type Species = "oak" | "pine" | "blossom";
type TreeInstance = { position: THREE.Vector3; scale: number; rotationY: number; species: Species };

const SPECIES_WEIGHTS: [Species, number][] = [
  ["oak", 0.45],
  ["pine", 0.4],
  ["blossom", 0.15],
];

function pickSpecies(r: number): Species {
  let acc = 0;
  for (const [species, weight] of SPECIES_WEIGHTS) {
    acc += weight;
    if (r < acc) return species;
  }
  return "oak";
}

export default function TreeField() {
  const trees = useMemo<TreeInstance[]>(() => {
    const rand = mulberry32(SEED);
    const result: TreeInstance[] = [];
    let attempts = 0;

    while (result.length < TREE_COUNT && attempts < TREE_COUNT * 20) {
      attempts++;
      const angle = rand() * Math.PI * 2;
      const radius = Math.sqrt(rand()) * (WORLD_BOUNDARY_RADIUS - 6);
      const x = Math.sin(angle) * radius;
      const z = -Math.cos(angle) * radius;

      if (isSceneryExcluded(x, z)) continue;

      result.push({
        position: new THREE.Vector3(x, 0, z),
        scale: 0.75 + rand() * 0.6,
        rotationY: rand() * Math.PI * 2,
        species: pickSpecies(rand()),
      });
    }
    return result;
  }, []);

  const bySpecies = useMemo(() => {
    const groups: Record<Species, TreeInstance[]> = { oak: [], pine: [], blossom: [] };
    trees.forEach((t) => groups[t.species].push(t));
    return groups;
  }, [trees]);

  return (
    <group>
      <TrunkLayer trees={trees} />
      <OakFoliage trees={bySpecies.oak} />
      <PineFoliage trees={bySpecies.pine} />
      <BlossomFoliage trees={bySpecies.blossom} />

      {/* Slim cylinder collider per trunk — cheaper than a full tree-shaped collider */}
      {trees.map((t, i) => (
        <RigidBody key={i} type="fixed" colliders={false} position={[t.position.x, 0.8 * t.scale, t.position.z]}>
          <CylinderCollider args={[0.8 * t.scale, 0.18 * t.scale]} />
        </RigidBody>
      ))}
    </group>
  );
}

function useInstancedTransforms(items: TreeInstance[]) {
  const ref = useRef<THREE.InstancedMesh>(null);
  useEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    items.forEach((t, i) => {
      dummy.position.copy(t.position);
      dummy.scale.setScalar(t.scale);
      dummy.rotation.y = t.rotationY;
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.count = items.length;
    mesh.instanceMatrix.needsUpdate = true;
  }, [items]);
  return ref;
}

function TrunkLayer({ trees }: { trees: TreeInstance[] }) {
  const ref = useInstancedTransforms(trees);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, trees.length || 1]} castShadow frustumCulled={false}>
      <cylinderGeometry args={[0.14, 0.2, 1.6, 6]} />
      <meshStandardMaterial color={TRUNK_COLOR} roughness={0.9} />
    </instancedMesh>
  );
}

// Rounded broadleaf tree — three overlapping spheres for a fuller, less-symmetric canopy
function OakFoliage({ trees }: { trees: TreeInstance[] }) {
  const colors = ["#3a7d45", "#356f40", "#2f6b3a"];
  const ref0 = useRef<THREE.InstancedMesh>(null);
  const ref1 = useRef<THREE.InstancedMesh>(null);
  const ref2 = useRef<THREE.InstancedMesh>(null);
  const refs = [ref0, ref1, ref2];
  const offsets = [
    { pos: [0, 1.9, 0], scale: 1.0 },
    { pos: [0.55, 1.6, 0.3], scale: 0.7 },
    { pos: [-0.5, 1.65, -0.35], scale: 0.65 },
  ];

  useEffect(() => {
    const dummy = new THREE.Object3D();
    refs.forEach((ref, layerIdx) => {
      const mesh = ref.current;
      if (!mesh) return;
      trees.forEach((t, i) => {
        const off = offsets[layerIdx];
        dummy.position.set(
          t.position.x + off.pos[0] * t.scale,
          t.position.y + off.pos[1] * t.scale,
          t.position.z + off.pos[2] * t.scale
        );
        dummy.scale.setScalar(t.scale * off.scale);
        dummy.rotation.y = t.rotationY;
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      });
      mesh.count = trees.length;
      mesh.instanceMatrix.needsUpdate = true;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trees]);

  const windMaterials = useMemo(
    () =>
      colors.map((color) => {
        const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.9, flatShading: true });
        return { mat, uniforms: applyWindSway(mat, { strength: 0.16, speed: 1.3 }) };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  useFrame((state) => {
    windMaterials.forEach(({ uniforms }) => {
      uniforms.uTime.value = state.clock.elapsedTime;
    });
  });

  return (
    <>
      {colors.map((color, i) => (
        <instancedMesh key={color} ref={refs[i]} args={[undefined, undefined, trees.length || 1]} castShadow frustumCulled={false}>
          <icosahedronGeometry args={[0.9, 1]} />
          <primitive object={windMaterials[i].mat} attach="material" />
        </instancedMesh>
      ))}
    </>
  );
}

// Conifer — three stacked, shrinking cones
function PineFoliage({ trees }: { trees: TreeInstance[] }) {
  const tiers = [
    { y: 1.4, radius: 1.15, height: 1.3 },
    { y: 2.15, radius: 0.85, height: 1.1 },
    { y: 2.8, radius: 0.55, height: 0.9 },
  ];
  const ref0 = useRef<THREE.InstancedMesh>(null);
  const ref1 = useRef<THREE.InstancedMesh>(null);
  const ref2 = useRef<THREE.InstancedMesh>(null);
  const refs = [ref0, ref1, ref2];
  const color = "#2f5f3a";
  const { mat: windMaterial, uniforms } = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({ color, roughness: 0.85 });
    return { mat: m, uniforms: applyWindSway(m, { strength: 0.13, speed: 1.3 }) };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
  });

  useEffect(() => {
    const dummy = new THREE.Object3D();
    refs.forEach((ref, tierIdx) => {
      const mesh = ref.current;
      if (!mesh) return;
      trees.forEach((t, i) => {
        const tier = tiers[tierIdx];
        dummy.position.set(t.position.x, t.position.y + tier.y * t.scale, t.position.z);
        dummy.scale.set(t.scale, t.scale, t.scale);
        dummy.rotation.y = t.rotationY;
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      });
      mesh.count = trees.length;
      mesh.instanceMatrix.needsUpdate = true;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trees]);

  return (
    <>
      {tiers.map((tier, i) => (
        <instancedMesh key={i} ref={refs[i]} args={[undefined, undefined, trees.length || 1]} castShadow frustumCulled={false}>
          <coneGeometry args={[tier.radius, tier.height, 7]} />
          <primitive object={windMaterial} attach="material" />
        </instancedMesh>
      ))}
    </>
  );
}

// Flowering tree — pale canopy dotted with small pink blossom clusters
function BlossomFoliage({ trees }: { trees: TreeInstance[] }) {
  const canopyRef = useRef<THREE.InstancedMesh>(null);
  const blossomRef = useRef<THREE.InstancedMesh>(null);
  const BLOSSOMS_PER_TREE = 5;

  const { mat: canopyMaterial, uniforms: canopyUniforms } = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({ color: "#c9d98a", roughness: 0.9, flatShading: true });
    return { mat: m, uniforms: applyWindSway(m, { strength: 0.16, speed: 1.3 }) };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useFrame((state) => {
    canopyUniforms.uTime.value = state.clock.elapsedTime;
  });

  const blossomOffsets = useMemo(() => {
    const rand = mulberry32(SEED + 1);
    return trees.flatMap(() =>
      Array.from({ length: BLOSSOMS_PER_TREE }, () => ({
        x: (rand() - 0.5) * 1.4,
        y: 1.4 + rand() * 0.8,
        z: (rand() - 0.5) * 1.4,
      }))
    );
  }, [trees]);

  useEffect(() => {
    const dummy = new THREE.Object3D();
    if (canopyRef.current) {
      trees.forEach((t, i) => {
        dummy.position.set(t.position.x, t.position.y + 1.8 * t.scale, t.position.z);
        dummy.scale.setScalar(t.scale);
        dummy.rotation.y = t.rotationY;
        dummy.updateMatrix();
        canopyRef.current!.setMatrixAt(i, dummy.matrix);
      });
      canopyRef.current.count = trees.length;
      canopyRef.current.instanceMatrix.needsUpdate = true;
    }
    if (blossomRef.current) {
      blossomOffsets.forEach((b, i) => {
        const t = trees[Math.floor(i / BLOSSOMS_PER_TREE)];
        dummy.position.set(t.position.x + b.x * t.scale, t.position.y + b.y * t.scale, t.position.z + b.z * t.scale);
        dummy.scale.setScalar(t.scale * 0.8);
        dummy.rotation.set(0, 0, 0);
        dummy.updateMatrix();
        blossomRef.current!.setMatrixAt(i, dummy.matrix);
      });
      blossomRef.current.count = blossomOffsets.length;
      blossomRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [trees, blossomOffsets]);

  return (
    <>
      <instancedMesh ref={canopyRef} args={[undefined, undefined, trees.length || 1]} castShadow frustumCulled={false}>
        <icosahedronGeometry args={[0.85, 1]} />
        <primitive object={canopyMaterial} attach="material" />
      </instancedMesh>
      <instancedMesh ref={blossomRef} args={[undefined, undefined, blossomOffsets.length || 1]} frustumCulled={false}>
        <sphereGeometry args={[0.14, 6, 6]} />
        <meshStandardMaterial color="#f7a8c4" roughness={0.7} />
      </instancedMesh>
    </>
  );
}
