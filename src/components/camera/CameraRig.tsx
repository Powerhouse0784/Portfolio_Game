"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { usePlayerStore } from "@/lib/stores/usePlayerStore";
import { useSettingsStore } from "@/lib/stores/useSettingsStore";
import { useIntroStore } from "@/lib/stores/useIntroStore";
import { wrapAngle } from "@/lib/utils/geometry";
import { getCameraCollidables } from "@/lib/world/cameraCollidables";

const MIN_DISTANCE = 2.5;
const MAX_DISTANCE = 9;
const DEFAULT_DISTANCE = 5.5;
const MIN_POLAR = 0.35; // radians, how far up the camera can look
const MAX_POLAR = Math.PI / 2 - 0.05; // just short of straight-down
const CAMERA_LAG = 8; // higher = tighter follow, lower = more cinematic lag
const TARGET_HEIGHT_OFFSET = 1.2; // aim at chest height, not feet
const CHASE_LERP_MOVING = 3.5; // how eagerly the camera swings in behind while driving
const CHASE_LERP_IDLE = 1.1; // gentler re-centering when standing still
const EYE_HEIGHT = 1.55; // first-person camera height, near the top of the ~1.8m character

export default function CameraRig() {
  const { camera, gl } = useThree();
  const sensitivity = useSettingsStore((s) => s.cameraSensitivity);
  const invertY = useSettingsStore((s) => s.invertY);

  const spherical = useRef(new THREE.Spherical(DEFAULT_DISTANCE, 1.0, 0));
  // Initialized to the player's actual spawn position (not the origin) so that if
  // this ever becomes active before the player has moved — e.g. right as the
  // cinematic intro hands off control — there's no visible snap while it lerps
  // from a stale (0,0,0) default toward the real target.
  const initialPos = usePlayerStore.getState().position;
  const targetPosition = useRef(new THREE.Vector3());
  const smoothedTarget = useRef(
    new THREE.Vector3(initialPos[0], initialPos[1] + TARGET_HEIGHT_OFFSET, initialPos[2])
  );
  const isDragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });
  const raycaster = useRef(new THREE.Raycaster());

  // Tracks every active pointer by id — needed to distinguish a single-finger
  // orbit drag from a two-finger pinch-to-zoom gesture on touch devices. Mouse
  // interaction never has more than one active pointer, so this is a no-op there.
  const activePointers = useRef(new Map<number, { x: number; y: number }>());
  const pinchStartDistance = useRef(0);
  const pinchStartRadius = useRef(DEFAULT_DISTANCE);

  // Reusable scratch objects — allocating new Vector3s every frame (this used to
  // call .clone() 2-3x per frame) creates garbage the GC has to sweep, which shows
  // up as periodic micro-stutter. Same fix pattern as the character controller.
  const offset = useRef(new THREE.Vector3());
  const desiredCamPos = useRef(new THREE.Vector3());
  const rayDir = useRef(new THREE.Vector3());
  const lookTarget = useRef(new THREE.Vector3());

  // --- Mouse drag / touch drag to orbit, wheel or pinch to zoom ---
  useEffect(() => {
    const canvas = gl.domElement;
    canvas.style.touchAction = "none"; // stop the browser handling scroll/zoom itself

    const pinchDistance = (): number => {
      const pts = Array.from(activePointers.current.values());
      const dx = pts[0].x - pts[1].x;
      const dy = pts[0].y - pts[1].y;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const onPointerDown = (e: PointerEvent) => {
      activePointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      canvas.setPointerCapture(e.pointerId);

      if (activePointers.current.size === 2) {
        // Second finger just landed — switch from orbit to pinch-zoom.
        isDragging.current = false;
        pinchStartDistance.current = pinchDistance();
        pinchStartRadius.current = spherical.current.radius;
      } else if (activePointers.current.size === 1) {
        isDragging.current = true;
        lastPointer.current = { x: e.clientX, y: e.clientY };
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      activePointers.current.delete(e.pointerId);
      canvas.releasePointerCapture(e.pointerId);

      if (activePointers.current.size === 1) {
        // Dropped from pinch back to a single finger — resume orbit drag from
        // wherever that remaining finger currently is, avoiding a jump.
        const remaining = Array.from(activePointers.current.values())[0];
        isDragging.current = true;
        lastPointer.current = remaining;
      } else {
        isDragging.current = false;
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!activePointers.current.has(e.pointerId)) return;
      activePointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (activePointers.current.size === 2) {
        const dist = pinchDistance();
        const scale = pinchStartDistance.current > 0 ? pinchStartDistance.current / dist : 1;
        spherical.current.radius = THREE.MathUtils.clamp(
          pinchStartRadius.current * scale,
          MIN_DISTANCE,
          MAX_DISTANCE
        );
        return;
      }

      if (!isDragging.current) return;
      const dx = e.clientX - lastPointer.current.x;
      const dy = e.clientY - lastPointer.current.y;
      lastPointer.current = { x: e.clientX, y: e.clientY };

      const sensitivityScale = 0.004 * (0.5 + sensitivity);
      spherical.current.theta -= dx * sensitivityScale;

      const dyDir = invertY ? -1 : 1;
      spherical.current.phi = THREE.MathUtils.clamp(
        spherical.current.phi - dy * sensitivityScale * dyDir,
        MIN_POLAR,
        MAX_POLAR
      );
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      spherical.current.radius = THREE.MathUtils.clamp(
        spherical.current.radius + e.deltaY * 0.003,
        MIN_DISTANCE,
        MAX_DISTANCE
      );
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("wheel", onWheel);
    };
  }, [gl, sensitivity, invertY]);

  useFrame((_, rawDelta) => {
    // The cinematic intro drives the camera directly while active.
    if (useIntroStore.getState().active) return;

    const delta = Math.min(rawDelta, 1 / 30);
    const [px, py, pz] = usePlayerStore.getState().position;

    targetPosition.current.set(px, py + TARGET_HEIGHT_OFFSET, pz);
    smoothedTarget.current.lerp(
      targetPosition.current,
      1 - Math.exp(-CAMERA_LAG * delta)
    );

    // --- Car-style chase cam: when the player isn't actively dragging to look
    // around, gently swing the camera in behind the character's current heading.
    // Faster while driving (feels like a proper chase cam), gentler when idle so
    // it doesn't yank the view around just because the player pivoted in place.
    // Shared by both camera modes — in first-person this is what makes the view
    // settle back to face forward when you let go after looking around.
    if (!isDragging.current) {
      const { rotationY, isMoving } = usePlayerStore.getState();
      const desiredTheta = rotationY + Math.PI;
      const diff = wrapAngle(desiredTheta - spherical.current.theta);
      const chaseLerp = isMoving ? CHASE_LERP_MOVING : CHASE_LERP_IDLE;
      spherical.current.theta += diff * Math.min(1, chaseLerp * delta);
    }

    const offsetVec = offset.current.setFromSpherical(spherical.current);
    const cameraMode = useSettingsStore.getState().cameraMode;

    if (cameraMode === "first-person") {
      // Camera sits at eye height, looking the same compass/pitch direction the
      // third-person offset implies (i.e. away from the camera-behind-player spot),
      // just from inside the character's head instead of far behind it.
      desiredCamPos.current.set(px, py + EYE_HEIGHT, pz);
      camera.position.copy(desiredCamPos.current);
      lookTarget.current.copy(desiredCamPos.current).sub(offsetVec);
      camera.lookAt(lookTarget.current);
      return;
    }

    desiredCamPos.current.copy(smoothedTarget.current).add(offsetVec);

    // --- Obstacle avoidance: raycast from target to desired camera pos, but only
    // against the small registered set of real obstructions (pillars, monument,
    // buildings) — NOT the whole scene. Raycasting every tree/NPC/prop every frame
    // was the actual cause of the movement feeling stuttery; this list is typically
    // under a dozen objects instead of hundreds. ---
    const collidables = getCameraCollidables();
    if (collidables.length > 0) {
      rayDir.current.copy(desiredCamPos.current).sub(smoothedTarget.current);
      const dist = rayDir.current.length();
      rayDir.current.normalize();
      raycaster.current.set(smoothedTarget.current, rayDir.current);
      raycaster.current.far = dist;
      const hits = raycaster.current.intersectObjects(collidables, true);
      if (hits.length > 0 && hits[0].distance < dist) {
        const clampedDist = Math.max(hits[0].distance - 0.2, MIN_DISTANCE * 0.5);
        desiredCamPos.current
          .copy(smoothedTarget.current)
          .add(rayDir.current.multiplyScalar(clampedDist));
      }
    }

    camera.position.lerp(desiredCamPos.current, 1 - Math.exp(-CAMERA_LAG * delta));
    camera.lookAt(smoothedTarget.current);
  });

  return null;
}
