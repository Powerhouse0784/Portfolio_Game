"use client";

import { useRef } from "react";
import type { RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { NPCOutfit } from "@/lib/world/npcOutfits";

export type NPCAnimState = "idle" | "walk" | "sit";

type JointRef = RefObject<THREE.Group | null>;

const WALK_CYCLE_SPEED = 6.5;
const LEG_SWING = 0.5;
const ARM_SWING = 0.4;
const KNEE_BEND = 0.45;
const BLEND_RATE = 8;

export default function NPCCharacter({ animState, outfit }: { animState: NPCAnimState; outfit: NPCOutfit }) {
  const hips = useRef<THREE.Group>(null);
  const leftHip = useRef<THREE.Group>(null);
  const rightHip = useRef<THREE.Group>(null);
  const leftKnee = useRef<THREE.Group>(null);
  const rightKnee = useRef<THREE.Group>(null);
  const leftShoulder = useRef<THREE.Group>(null);
  const rightShoulder = useRef<THREE.Group>(null);
  const leftElbow = useRef<THREE.Group>(null);
  const rightElbow = useRef<THREE.Group>(null);

  // Randomized starting phase so a whole group of NPCs don't all move in lockstep
  const phase = useRef(Math.random() * Math.PI * 2);
  const idlePhase = useRef(Math.random() * Math.PI * 2);

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 1 / 30);
    if (!hips.current) return;

    idlePhase.current += delta * 2;
    const blend = 1 - Math.exp(-BLEND_RATE * delta);

    if (animState === "sit") {
      setJointX(leftHip, -1.4, blend);
      setJointX(rightHip, -1.4, blend);
      setJointX(leftKnee, 1.4, blend);
      setJointX(rightKnee, 1.4, blend);
      setJointX(leftShoulder, 0.15, blend);
      setJointX(rightShoulder, 0.15, blend);
      setJointX(leftElbow, 0.1, blend);
      setJointX(rightElbow, 0.1, blend);
      hips.current.position.y = THREE.MathUtils.lerp(hips.current.position.y, -0.08, blend);
    } else if (animState === "walk") {
      phase.current += delta * WALK_CYCLE_SPEED;
      const legSwing = Math.sin(phase.current);
      setJointX(leftHip, legSwing * LEG_SWING, blend);
      setJointX(rightHip, -legSwing * LEG_SWING, blend);
      setJointX(leftKnee, Math.max(0, Math.sin(phase.current + Math.PI / 2)) * KNEE_BEND, blend);
      setJointX(rightKnee, Math.max(0, Math.sin(phase.current + Math.PI * 1.5)) * KNEE_BEND, blend);
      setJointX(leftShoulder, -legSwing * ARM_SWING, blend);
      setJointX(rightShoulder, legSwing * ARM_SWING, blend);
      setJointX(leftElbow, Math.max(0, -legSwing) * 0.3, blend);
      setJointX(rightElbow, Math.max(0, legSwing) * 0.3, blend);
      hips.current.position.y = THREE.MathUtils.lerp(
        hips.current.position.y,
        Math.abs(Math.sin(phase.current * 2)) * 0.03,
        blend
      );
    } else {
      setJointX(leftHip, 0, blend);
      setJointX(rightHip, 0, blend);
      setJointX(leftKnee, 0, blend);
      setJointX(rightKnee, 0, blend);
      setJointX(leftShoulder, Math.sin(idlePhase.current) * 0.04, blend);
      setJointX(rightShoulder, -Math.sin(idlePhase.current) * 0.04, blend);
      setJointX(leftElbow, 0.08, blend);
      setJointX(rightElbow, 0.08, blend);
      hips.current.position.y = THREE.MathUtils.lerp(
        hips.current.position.y,
        Math.sin(idlePhase.current) * 0.012,
        blend
      );
    }
  });

  return (
    <group ref={hips}>
      <Leg side={-1} hipRef={leftHip} kneeRef={leftKnee} pantsColor={outfit.pants} shoeColor={outfit.shoe} />
      <Leg side={1} hipRef={rightHip} kneeRef={rightKnee} pantsColor={outfit.pants} shoeColor={outfit.shoe} />

      <mesh castShadow position={[0, 0.28, 0]}>
        <boxGeometry args={[0.42, 0.5, 0.24]} />
        <meshStandardMaterial color={outfit.shirt} roughness={0.7} />
      </mesh>

      <Arm side={-1} shoulderRef={leftShoulder} elbowRef={leftElbow} shirtColor={outfit.shirt} skinColor={outfit.skin} />
      <Arm side={1} shoulderRef={rightShoulder} elbowRef={rightElbow} shirtColor={outfit.shirt} skinColor={outfit.skin} />

      <group position={[0, 0.62, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.16, 14, 14]} />
          <meshStandardMaterial color={outfit.skin} roughness={0.8} />
        </mesh>
        <mesh castShadow position={[0, 0.085, -0.015]}>
          <sphereGeometry args={[0.172, 14, 14, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
          <meshStandardMaterial color={outfit.hair} roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
}

function setJointX(ref: JointRef, target: number, blend: number) {
  if (!ref.current) return;
  ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, target, blend);
}

function Leg({
  side,
  hipRef,
  kneeRef,
  pantsColor,
  shoeColor,
}: {
  side: -1 | 1;
  hipRef: JointRef;
  kneeRef: JointRef;
  pantsColor: string;
  shoeColor: string;
}) {
  return (
    <group ref={hipRef} position={[side * 0.13, -0.02, 0]}>
      <mesh castShadow position={[0, -0.22, 0]}>
        <boxGeometry args={[0.15, 0.44, 0.17]} />
        <meshStandardMaterial color={pantsColor} roughness={0.8} />
      </mesh>
      <group ref={kneeRef} position={[0, -0.44, 0]}>
        <mesh castShadow position={[0, -0.18, 0]}>
          <boxGeometry args={[0.13, 0.36, 0.15]} />
          <meshStandardMaterial color={pantsColor} roughness={0.8} />
        </mesh>
        <mesh castShadow position={[0, -0.38, 0.04]}>
          <boxGeometry args={[0.15, 0.1, 0.24]} />
          <meshStandardMaterial color={shoeColor} roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
}

function Arm({
  side,
  shoulderRef,
  elbowRef,
  shirtColor,
  skinColor,
}: {
  side: -1 | 1;
  shoulderRef: JointRef;
  elbowRef: JointRef;
  shirtColor: string;
  skinColor: string;
}) {
  return (
    <group ref={shoulderRef} position={[side * 0.26, 0.48, 0]}>
      <mesh castShadow position={[0, -0.17, 0]}>
        <boxGeometry args={[0.12, 0.34, 0.14]} />
        <meshStandardMaterial color={shirtColor} roughness={0.7} />
      </mesh>
      <group ref={elbowRef} position={[0, -0.34, 0]}>
        <mesh castShadow position={[0, -0.15, 0]}>
          <boxGeometry args={[0.1, 0.3, 0.12]} />
          <meshStandardMaterial color={skinColor} roughness={0.8} />
        </mesh>
        <mesh castShadow position={[0, -0.32, 0]}>
          <sphereGeometry args={[0.06, 10, 10]} />
          <meshStandardMaterial color={skinColor} roughness={0.8} />
        </mesh>
      </group>
    </group>
  );
}
