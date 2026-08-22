"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useIntroStore } from "@/lib/stores/useIntroStore";
import { useSettingsStore } from "@/lib/stores/useSettingsStore";
import { usePlayerStore } from "@/lib/stores/usePlayerStore";

type Keyframe = { t: number; position: [number, number, number]; lookAt: [number, number, number] };

const TOTAL_DURATION = 7; // seconds

function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function buildKeyframes(): Keyframe[] {
  const spawn = usePlayerStore.getState().position;
  return [
    { t: 0, position: [0, 45, 5], lookAt: [0, 2, 0] }, // aerial shot over the monument
    { t: 0.3, position: [38, 16, 30], lookAt: [0, 3, 0] }, // sweeping reveal around it
    { t: 0.65, position: [0, 9, 50], lookAt: [0, 1, 20] }, // approaching down the entrance path
    // Ends exactly where the normal third-person camera would already place itself,
    // so handoff to CameraRig is seamless with no visible jump.
    // Ends at CameraRig's own default position, computed with the exact same
    // spherical formula it uses (radius 5.5, phi 1.0, theta 0) rather than an
    // approximated number — the mismatch between an eyeballed guess and the real
    // formula was exactly why the camera looked slightly off-angle at handoff
    // instead of framing the entrance dead-on.
    { t: 1, position: [spawn[0], spawn[1] + 2.9717, spawn[2] + 4.6281], lookAt: [spawn[0], spawn[1] + 1.2, spawn[2]] },
  ];
}

export default function CinematicIntro() {
  const { camera } = useThree();
  const elapsed = useRef(0);
  const keyframes = useRef<Keyframe[]>(buildKeyframes()).current;

  // Reusable scratch vectors — same reasoning as CameraRig, avoids per-frame GC churn.
  const posA = useRef(new THREE.Vector3());
  const posB = useRef(new THREE.Vector3());
  const lookA = useRef(new THREE.Vector3());
  const lookB = useRef(new THREE.Vector3());
  const outPos = useRef(new THREE.Vector3());
  const outLook = useRef(new THREE.Vector3());

  useFrame((_, rawDelta) => {
    const { active, started, finishIntro } = useIntroStore.getState();
    if (!active) return;

    if (!started) {
      // StartGate hasn't been dismissed yet — hold the camera exactly at the
      // intro's first keyframe rather than doing nothing (which would leave it
      // wherever Canvas's fallback camera prop put it, a mismatched flash the
      // instant the gate is dismissed) or letting the clock tick unseen.
      camera.position.set(...keyframes[0].position);
      camera.lookAt(...keyframes[0].lookAt);
      return;
    }

    if (useSettingsStore.getState().reducedMotion) {
      finishIntro();
      return;
    }

    const delta = Math.min(rawDelta, 1 / 30);
    elapsed.current += delta;
    const t = Math.min(elapsed.current / TOTAL_DURATION, 1);

    let seg = keyframes.length - 2;
    for (let i = 0; i < keyframes.length - 1; i++) {
      if (t >= keyframes[i].t && t <= keyframes[i + 1].t) {
        seg = i;
        break;
      }
    }
    const a = keyframes[seg];
    const b = keyframes[seg + 1];
    const localT = b.t > a.t ? (t - a.t) / (b.t - a.t) : 1;
    const eased = easeInOutCubic(THREE.MathUtils.clamp(localT, 0, 1));

    posA.current.set(...a.position);
    posB.current.set(...b.position);
    lookA.current.set(...a.lookAt);
    lookB.current.set(...b.lookAt);

    outPos.current.lerpVectors(posA.current, posB.current, eased);
    outLook.current.lerpVectors(lookA.current, lookB.current, eased);

    camera.position.copy(outPos.current);
    camera.lookAt(outLook.current);

    if (t >= 1) finishIntro();
  });

  return null;
}
