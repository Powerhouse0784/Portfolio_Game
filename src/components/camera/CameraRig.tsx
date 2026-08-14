"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { usePlayerStore } from "@/lib/stores/usePlayerStore";
import { useSettingsStore } from "@/lib/stores/useSettingsStore";
import { wrapAngle } from "@/lib/utils/geometry";

const MIN_DISTANCE = 2.5;
const MAX_DISTANCE = 9;
const DEFAULT_DISTANCE = 5.5;
const MIN_POLAR = 0.35; // radians, how far up the camera can look
const MAX_POLAR = Math.PI / 2 - 0.05; // just short of straight-down
const CAMERA_LAG = 8; // higher = tighter follow, lower = more cinematic lag
const TARGET_HEIGHT_OFFSET = 1.2; // aim at chest height, not feet
const CHASE_LERP_MOVING = 3.5; // how eagerly the camera swings in behind while driving
const CHASE_LERP_IDLE = 1.1; // gentler re-centering when standing still

export default function CameraRig() {
  const { camera, gl } = useThree();
  const sensitivity = useSettingsStore((s) => s.cameraSensitivity);
  const invertY = useSettingsStore((s) => s.invertY);

  const spherical = useRef(new THREE.Spherical(DEFAULT_DISTANCE, 1.0, 0));
  const targetPosition = useRef(new THREE.Vector3());
  const smoothedTarget = useRef(new THREE.Vector3());
  const isDragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });
  const raycaster = useRef(new THREE.Raycaster());

  // --- Mouse drag to orbit, scroll to zoom ---
  useEffect(() => {
    const canvas = gl.domElement;

    const onPointerDown = (e: PointerEvent) => {
      isDragging.current = true;
      lastPointer.current = { x: e.clientX, y: e.clientY };
      canvas.setPointerCapture(e.pointerId);
    };

    const onPointerUp = (e: PointerEvent) => {
      isDragging.current = false;
      canvas.releasePointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
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
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("wheel", onWheel);
    };
  }, [gl, sensitivity, invertY]);

  useFrame((state, rawDelta) => {
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
    if (!isDragging.current) {
      const { rotationY, isMoving } = usePlayerStore.getState();
      const desiredTheta = rotationY + Math.PI;
      const diff = wrapAngle(desiredTheta - spherical.current.theta);
      const chaseLerp = isMoving ? CHASE_LERP_MOVING : CHASE_LERP_IDLE;
      spherical.current.theta += diff * Math.min(1, chaseLerp * delta);
    }

    const offset = new THREE.Vector3().setFromSpherical(spherical.current);
    let desiredCamPos = smoothedTarget.current.clone().add(offset);

    // --- Basic obstacle avoidance: raycast from target to desired camera pos ---
    const dir = desiredCamPos.clone().sub(smoothedTarget.current);
    const dist = dir.length();
    dir.normalize();
    raycaster.current.set(smoothedTarget.current, dir);
    raycaster.current.far = dist;
    const hits = raycaster.current.intersectObjects(state.scene.children, true);
    const blocking = hits.find(
      (h) => h.object.userData?.cameraCollidable && h.distance < dist
    );
    if (blocking) {
      desiredCamPos = smoothedTarget.current
        .clone()
        .add(dir.multiplyScalar(Math.max(blocking.distance - 0.2, MIN_DISTANCE * 0.5)));
    }

    camera.position.lerp(desiredCamPos, 1 - Math.exp(-CAMERA_LAG * delta));
    camera.lookAt(smoothedTarget.current);
  });

  return null;
}
