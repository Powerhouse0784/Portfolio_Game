"use client";

import { useRef } from "react";
import type { RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { usePlayerStore } from "@/lib/stores/usePlayerStore";

// Palette ties back to the park's own brand accents (monument gold ring, gate sign)
const SHIRT_COLOR = "#2b3a55";
const PANTS_COLOR = "#33363f";
const SKIN_COLOR = "#e0a978";
const HAIR_COLOR = "#2b2018";
const SHOE_COLOR = "#f4f4f2";
const SHOE_SOLE_COLOR = "#00C48C";
const BADGE_COLOR = "#FFB800";

const WALK_CYCLE_SPEED = 7; // phase radians/sec
const RUN_CYCLE_SPEED = 11;
const LEG_SWING_WALK = 0.55;
const LEG_SWING_RUN = 0.9;
const ARM_SWING_WALK = 0.45;
const ARM_SWING_RUN = 0.75;
const KNEE_BEND = 0.5;
const LEAN_AMOUNT = 0.18; // banks into turns — visual complement to the car-style steering
const BLEND_RATE = 10; // how quickly joints ease toward their target pose (higher = snappier)

type JointRef = RefObject<THREE.Group | null>;

export default function PlayerCharacter() {
  const rig = useRef<THREE.Group>(null);
  const hips = useRef<THREE.Group>(null);
  const leftHip = useRef<THREE.Group>(null);
  const rightHip = useRef<THREE.Group>(null);
  const leftKnee = useRef<THREE.Group>(null);
  const rightKnee = useRef<THREE.Group>(null);
  const leftShoulder = useRef<THREE.Group>(null);
  const rightShoulder = useRef<THREE.Group>(null);
  const leftElbow = useRef<THREE.Group>(null);
  const rightElbow = useRef<THREE.Group>(null);

  const phase = useRef(0);
  const idlePhase = useRef(0);
  const wasGrounded = useRef(true);
  const landSquash = useRef(0); // 1 = just landed, decays to 0

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 1 / 30);
    if (!rig.current || !hips.current) return;

    const { rotationY, isGrounded, isMoving, isSprinting, verticalVelocity, turnInput } =
      usePlayerStore.getState();

    rig.current.rotation.y = rotationY;
    idlePhase.current += delta * 2;

    // --- Landing squash: trigger a brief compression the frame we touch back down ---
    if (isGrounded && !wasGrounded.current) landSquash.current = 1;
    wasGrounded.current = isGrounded;
    landSquash.current = Math.max(0, landSquash.current - delta * 4);

    const blend = 1 - Math.exp(-BLEND_RATE * delta);

    if (!isGrounded) {
      // --- Airborne: tuck legs, lift arms. Rising vs falling gives a slightly
      // different tuck amount so the jump reads as one continuous motion. ---
      const risingFactor = THREE.MathUtils.clamp(verticalVelocity / 4, -1, 1);
      setJointX(leftHip, -0.55 - risingFactor * 0.15, blend);
      setJointX(rightHip, -0.55 - risingFactor * 0.15, blend);
      setJointX(leftKnee, KNEE_BEND * 1.6, blend);
      setJointX(rightKnee, KNEE_BEND * 1.6, blend);
      setJointX(leftShoulder, 0.35, blend);
      setJointX(rightShoulder, 0.35, blend);
      setJointX(leftElbow, 0.3, blend);
      setJointX(rightElbow, 0.3, blend);
    } else if (isMoving) {
      const cycleSpeed = isSprinting ? RUN_CYCLE_SPEED : WALK_CYCLE_SPEED;
      const legAmp = isSprinting ? LEG_SWING_RUN : LEG_SWING_WALK;
      const armAmp = isSprinting ? ARM_SWING_RUN : ARM_SWING_WALK;
      phase.current += delta * cycleSpeed;

      const legSwing = Math.sin(phase.current);
      const leftKneeLift = Math.max(0, Math.sin(phase.current + Math.PI / 2)) * KNEE_BEND;
      const rightKneeLift = Math.max(0, Math.sin(phase.current + Math.PI * 1.5)) * KNEE_BEND;

      setJointX(leftHip, legSwing * legAmp, blend);
      setJointX(rightHip, -legSwing * legAmp, blend);
      setJointX(leftKnee, leftKneeLift, blend);
      setJointX(rightKnee, rightKneeLift, blend);

      // Arms counter-swing opposite their same-side leg — natural walking silhouette
      setJointX(leftShoulder, -legSwing * armAmp, blend);
      setJointX(rightShoulder, legSwing * armAmp, blend);
      setJointX(leftElbow, Math.max(0, -legSwing) * 0.4, blend);
      setJointX(rightElbow, Math.max(0, legSwing) * 0.4, blend);

      hips.current.position.y = Math.abs(Math.sin(phase.current * 2)) * (isSprinting ? 0.05 : 0.03);
    } else {
      // --- Idle: gentle breathing bob, relaxed arm sway ---
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
        Math.sin(idlePhase.current) * 0.015,
        blend
      );
    }

    // Brief vertical compression right after landing
    hips.current.scale.y = 1 - landSquash.current * 0.12;

    // Lean into turns — visual complement to the car-style steering, only while moving
    const targetLean = isMoving ? -turnInput * LEAN_AMOUNT : 0;
    rig.current.rotation.z = THREE.MathUtils.lerp(rig.current.rotation.z, targetLean, blend);
  });

  return (
    <group ref={rig}>
      <group ref={hips}>
        <Leg side={-1} hipRef={leftHip} kneeRef={leftKnee} />
        <Leg side={1} hipRef={rightHip} kneeRef={rightKnee} />

        {/* Torso */}
        <mesh castShadow position={[0, 0.28, 0]}>
          <boxGeometry args={[0.42, 0.5, 0.24]} />
          <meshStandardMaterial color={SHIRT_COLOR} roughness={0.7} />
        </mesh>
        {/* Chest badge — small brand accent, doubles as a facing cue */}
        <mesh position={[0, 0.34, 0.13]}>
          <boxGeometry args={[0.07, 0.07, 0.015]} />
          <meshStandardMaterial color={BADGE_COLOR} metalness={0.4} roughness={0.4} />
        </mesh>

        <Arm side={-1} shoulderRef={leftShoulder} elbowRef={leftElbow} />
        <Arm side={1} shoulderRef={rightShoulder} elbowRef={rightElbow} />

        {/* Head */}
        <group position={[0, 0.62, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.16, 14, 14]} />
            <meshStandardMaterial color={SKIN_COLOR} roughness={0.8} />
          </mesh>
          <mesh castShadow position={[0, 0.085, -0.015]}>
            <sphereGeometry args={[0.172, 14, 14, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
            <meshStandardMaterial color={HAIR_COLOR} roughness={0.9} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

function setJointX(ref: JointRef, target: number, blend: number) {
  if (!ref.current) return;
  ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, target, blend);
}

function Leg({ side, hipRef, kneeRef }: { side: -1 | 1; hipRef: JointRef; kneeRef: JointRef }) {
  return (
    <group ref={hipRef} position={[side * 0.13, -0.02, 0]}>
      <mesh castShadow position={[0, -0.22, 0]}>
        <boxGeometry args={[0.15, 0.44, 0.17]} />
        <meshStandardMaterial color={PANTS_COLOR} roughness={0.8} />
      </mesh>
      <group ref={kneeRef} position={[0, -0.44, 0]}>
        <mesh castShadow position={[0, -0.18, 0]}>
          <boxGeometry args={[0.13, 0.36, 0.15]} />
          <meshStandardMaterial color={PANTS_COLOR} roughness={0.8} />
        </mesh>
        <mesh castShadow position={[0, -0.38, 0.04]}>
          <boxGeometry args={[0.15, 0.1, 0.24]} />
          <meshStandardMaterial color={SHOE_COLOR} roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.43, 0.04]}>
          <boxGeometry args={[0.15, 0.03, 0.24]} />
          <meshStandardMaterial color={SHOE_SOLE_COLOR} roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
}

function Arm({ side, shoulderRef, elbowRef }: { side: -1 | 1; shoulderRef: JointRef; elbowRef: JointRef }) {
  return (
    <group ref={shoulderRef} position={[side * 0.26, 0.48, 0]}>
      <mesh castShadow position={[0, -0.17, 0]}>
        <boxGeometry args={[0.12, 0.34, 0.14]} />
        <meshStandardMaterial color={SHIRT_COLOR} roughness={0.7} />
      </mesh>
      <group ref={elbowRef} position={[0, -0.34, 0]}>
        <mesh castShadow position={[0, -0.15, 0]}>
          <boxGeometry args={[0.1, 0.3, 0.12]} />
          <meshStandardMaterial color={SKIN_COLOR} roughness={0.8} />
        </mesh>
        <mesh castShadow position={[0, -0.32, 0]}>
          <sphereGeometry args={[0.06, 10, 10]} />
          <meshStandardMaterial color={SKIN_COLOR} roughness={0.8} />
        </mesh>
      </group>
    </group>
  );
}
