"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { RigidBody, RapierRigidBody } from "@react-three/rapier";
import NPCCharacter from "./NPCCharacter";
import type { NPCOutfit } from "@/lib/world/npcOutfits";
import type { PatrolRoute } from "@/lib/world/npcRoutes";
import { wrapAngle } from "@/lib/utils/geometry";
import { usePlayerStore } from "@/lib/stores/usePlayerStore";
import { usePauseStore } from "@/lib/stores/usePauseStore";

const WALK_SPEED = 1.3; // deliberately slower than the player — reads as a casual stroll
const ROTATION_SPEED = 3.2;
const WAYPOINT_EPSILON = 0.15;
const MIN_PAUSE = 1;
const MAX_PAUSE = 3.5;
// NPCs have no awareness of the player otherwise — without this, a patrol route
// that happens to cross the player's position walks straight into them, shoving
// them against whatever's behind (a tree, a bench). That's what "character gets
// stuck, legs still animate" actually was: not a movement bug, a collision fight.
const YIELD_RADIUS = 2.0;

// Matches the player's own capsule resting height (0.55 half-height + 0.35 radius)
// so NPCs stand at a consistent, correct height and collide at the right level.
const RESTING_HEIGHT = 0.9;

function isYieldingToPlayer(pos: { x: number; z: number }): boolean {
  const [px, , pz] = usePlayerStore.getState().position;
  const dx = px - pos.x;
  const dz = pz - pos.z;
  return dx * dx + dz * dz < YIELD_RADIUS * YIELD_RADIUS;
}

export default function NPCWalker({
  route,
  outfit,
  speedVariance = 1,
}: {
  route: PatrolRoute;
  outfit: NPCOutfit;
  speedVariance?: number;
}) {
  const rigidBody = useRef<RapierRigidBody>(null);
  const visual = useRef<THREE.Group>(null);
  const [animState, setAnimState] = useState<"idle" | "walk">("walk");

  const targetIndex = useRef(route.waypoints.length > 1 ? 1 : 0);
  const direction = useRef(1);
  const currentRotation = useRef(0);
  const waitTimer = useRef(0);
  const pos = useRef({ x: route.waypoints[0][0], z: route.waypoints[0][1] });

  useFrame((_, rawDelta) => {
    const body = rigidBody.current;
    if (!body) return;
    if (usePauseStore.getState().paused) return;
    const delta = Math.min(rawDelta, 1 / 30);

    if (waitTimer.current > 0) {
      waitTimer.current -= delta;
      if (animState !== "idle") setAnimState("idle");
    } else if (isYieldingToPlayer(pos.current)) {
      // Freeze rather than push through — see YIELD_RADIUS comment above.
      if (animState !== "idle") setAnimState("idle");
    } else {
      const target = route.waypoints[targetIndex.current];
      const dx = target[0] - pos.current.x;
      const dz = target[1] - pos.current.z;
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist < WAYPOINT_EPSILON) {
        if (route.mode === "loop") {
          targetIndex.current = (targetIndex.current + 1) % route.waypoints.length;
        } else {
          if (targetIndex.current === route.waypoints.length - 1) direction.current = -1;
          else if (targetIndex.current === 0) direction.current = 1;
          targetIndex.current += direction.current;
        }
        waitTimer.current = MIN_PAUSE + Math.random() * (MAX_PAUSE - MIN_PAUSE);
      } else {
        if (animState !== "walk") setAnimState("walk");
        const speed = WALK_SPEED * speedVariance;
        pos.current.x += (dx / dist) * speed * delta;
        pos.current.z += (dz / dist) * speed * delta;

        const targetRotation = Math.atan2(dx, dz);
        const diff = wrapAngle(targetRotation - currentRotation.current);
        currentRotation.current += diff * Math.min(1, ROTATION_SPEED * delta);
      }
    }

    // Kinematic body — Rapier still treats it as a solid obstacle for the player's
    // character controller, so this is what actually blocks the player from walking
    // through NPCs. Rotation is applied to the visual child only (see comment below).
    body.setNextKinematicTranslation({ x: pos.current.x, y: RESTING_HEIGHT, z: pos.current.z });
    if (visual.current) visual.current.rotation.y = currentRotation.current;
  });

  return (
    <RigidBody
      ref={rigidBody}
      type="kinematicPosition"
      colliders="cuboid"
      position={[route.waypoints[0][0], RESTING_HEIGHT, route.waypoints[0][1]]}
      // Rotation locked on the physics body itself (like the player's own capsule) —
      // the auto-fit collider doesn't need to spin with facing direction, and the
      // character visually rotates via its own child group instead.
      enabledRotations={[false, false, false]}
    >
      <group ref={visual}>
        <NPCCharacter animState={animState} outfit={outfit} />
      </group>
    </RigidBody>
  );
}
