"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RigidBody, useRapier, CapsuleCollider, RapierRigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { usePlayerStore } from "@/lib/stores/usePlayerStore";
import { useIntroStore } from "@/lib/stores/useIntroStore";
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

  // Reusable scratch objects (avoid per-frame allocation)
  const forwardVec = useRef(new THREE.Vector3());
  const desiredTranslation = useRef(new THREE.Vector3());

  useEffect(() => {
    // offset = max gap the controller maintains from obstacles, prevents jitter
    const controller = world.createCharacterController(0.02);
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

    // Clamp delta so a stalled tab doesn't launch the character across the map
    const delta = Math.min(rawDelta, 1 / 30);

    const { input } = usePlayerStore.getState();
    const collider = body.collider(0);

    // --- Car-style steering: turn keys rotate the heading directly (works standing
    // still or moving, like a wheel), forward/back always move along that heading.
    // Holding forward + a turn key together curves the path naturally, because the
    // heading keeps rotating every frame while the position keeps advancing along it.
    let turnInput = 0;
    if (input.left) turnInput += 1;
    if (input.right) turnInput -= 1;
    currentRotationY.current += turnInput * TURN_SPEED * delta;
    currentRotationY.current = wrapAngle(currentRotationY.current);

    forwardVec.current.set(Math.sin(currentRotationY.current), 0, Math.cos(currentRotationY.current));

    let driveInput = 0;
    if (input.forward) driveInput += 1;
    if (input.backward) driveInput -= 1;

    const isMoving = driveInput !== 0;
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

