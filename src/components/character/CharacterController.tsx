"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RigidBody, useRapier, CapsuleCollider, RapierRigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { usePlayerStore } from "@/lib/stores/usePlayerStore";
import { useIntroStore } from "@/lib/stores/useIntroStore";
import { usePauseStore } from "@/lib/stores/usePauseStore";
import PlayerCharacter from "./PlayerCharacter";
import { wrapAngle } from "@/lib/utils/geometry";

const WALK_SPEED = 3.2;
const SPRINT_SPEED = 6.2;
const REVERSE_SPEED = 2.0; // reversing is always slower than walking forward, no reverse-sprint
const TURN_SPEED = 2.4; // radians/sec — how fast the heading turns while a turn key is held
const JUMP_FORCE = 6.5;
const GRAVITY = -18;
const CAPSULE_RADIUS = 0.35;
const CAPSULE_HALF_HEIGHT = 0.55; // total height ~1.8m with radius

// Read once at module scope (not in render) so the RigidBody's initial `position`
// prop stays referentially stable and never fights the physics engine each frame.
const SPAWN_POSITION = usePlayerStore.getState().position;

export default function CharacterController() {
  const rigidBody = useRef<RapierRigidBody>(null);
  const { world } = useRapier();

  const setTransform = usePlayerStore((s) => s.setTransform);
  const setGrounded = usePlayerStore((s) => s.setGrounded);
  const setMoving = usePlayerStore((s) => s.setMoving);
  const setAnimState = usePlayerStore((s) => s.setAnimState);

  const verticalVelocity = useRef(0);
  const currentRotationY = useRef(usePlayerStore.getState().rotationY);
  const characterController = useRef<ReturnType<typeof world.createCharacterController> | null>(null);
  const lastHandledResetId = useRef(usePlayerStore.getState().resetRequestId);

  // Reusable scratch objects (avoid per-frame allocation)
  const forwardVec = useRef(new THREE.Vector3());
  const desiredTranslation = useRef(new THREE.Vector3());

  useEffect(() => {
    // offset = max gap the controller maintains from obstacles, prevents jitter
    // offset = collision skin margin. Raised from 0.02 — too tight a margin makes
    // the controller prone to catching/snagging when multiple nearby colliders
    // (dense trees, an NPC, a bench) all contact at once, which reads as the
    // character getting stuck even though input is still being applied every frame.
    const controller = world.createCharacterController(0.04);
    controller.enableAutostep(0.4, 0.2, true); // climb small curbs/steps
    controller.enableSnapToGround(0.4); // stick to ground on slopes/small drops
    controller.setMaxSlopeClimbAngle((55 * Math.PI) / 180);
    controller.setMinSlopeSlideAngle((60 * Math.PI) / 180);
    characterController.current = controller;

    return () => {
      world.removeCharacterController(controller);
    };
  }, [world]);

  useFrame((_, rawDelta) => {
    const body = rigidBody.current;
    const controller = characterController.current;
    if (!body || !controller) return;

    // Freeze the character entirely while the cinematic intro plays — no input
    // processing, no gravity step. Spawn is already resting flush on the ground,
    // so simply not updating is enough; movement resumes the instant it ends.
    if (useIntroStore.getState().active) return;

    // Same freeze while paused — but still check for a reset request first, so
    // "Reset Position" in the pause menu works even while frozen.
    const { resetRequestId } = usePlayerStore.getState();
    if (resetRequestId !== lastHandledResetId.current) {
      lastHandledResetId.current = resetRequestId;
      body.setTranslation({ x: SPAWN_POSITION[0], y: SPAWN_POSITION[1], z: SPAWN_POSITION[2] }, true);
      verticalVelocity.current = 0;
      currentRotationY.current = Math.PI;
    }

    if (usePauseStore.getState().paused) return;

    // Clamp delta so a stalled tab doesn't launch the character across the map
    const delta = Math.min(rawDelta, 1 / 30);

    const { input } = usePlayerStore.getState();
    const collider = body.collider(0);

    // --- Car-style steering: turn input rotates the heading directly (works
    // standing still or moving, like a wheel), forward/back always move along
    // that heading. Both axes are analog now (-1..1) — keyboard always drives them
    // to a clean ±1, but the touch joystick can drive them to any value in between,
    // which is what gives a light thumb push a proportionally gentle turn/speed
    // instead of snapping straight to full-speed the instant a deadzone is crossed.
    const turnInput = THREE.MathUtils.clamp(-input.moveX, -1, 1);
    currentRotationY.current += turnInput * TURN_SPEED * delta;
    currentRotationY.current = wrapAngle(currentRotationY.current);

    forwardVec.current.set(Math.sin(currentRotationY.current), 0, Math.cos(currentRotationY.current));

    const driveInput = THREE.MathUtils.clamp(input.moveY, -1, 1);
    const isMoving = Math.abs(driveInput) > 0.02;
    const isReversing = driveInput < 0;
    const speed = isReversing ? REVERSE_SPEED : input.sprint ? SPRINT_SPEED : WALK_SPEED;

    // --- Gravity + jump ---
    const grounded = controller.computedGrounded();
    if (grounded && verticalVelocity.current < 0) {
      verticalVelocity.current = -0.5; // small downward bias keeps snap-to-ground engaged
    }
    if (grounded && input.jump) {
      verticalVelocity.current = JUMP_FORCE;
    }
    verticalVelocity.current += GRAVITY * delta;

    desiredTranslation.current.set(
      forwardVec.current.x * driveInput * speed * delta,
      verticalVelocity.current * delta,
      forwardVec.current.z * driveInput * speed * delta
    );

    controller.computeColliderMovement(collider, desiredTranslation.current);
    const corrected = controller.computedMovement();

    const currentPos = body.translation();
    const nextPos = {
      x: currentPos.x + corrected.x,
      y: currentPos.y + corrected.y,
      z: currentPos.z + corrected.z,
    };
    body.setNextKinematicTranslation(nextPos);

    // --- Publish state for camera rig, HUD, minimap, character rig, etc ---
    setTransform([nextPos.x, nextPos.y, nextPos.z], currentRotationY.current);
    setGrounded(controller.computedGrounded());
    setMoving(isMoving, isMoving && input.sprint && !isReversing);
    setAnimState(verticalVelocity.current, turnInput);
  });

  return (
    <RigidBody
      ref={rigidBody}
      type="kinematicPosition"
      colliders={false}
      position={SPAWN_POSITION}
      enabledRotations={[false, false, false]}
    >
      <CapsuleCollider args={[CAPSULE_HALF_HEIGHT, CAPSULE_RADIUS]} />
      <PlayerCharacter />
    </RigidBody>
  );
}

