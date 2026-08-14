import * as THREE from "three";

/** Shortest distance from point `p` to the segment `a`-`b`, all in the XZ plane. */
export function distanceToSegmentXZ(
  p: THREE.Vector2,
  a: THREE.Vector2,
  b: THREE.Vector2
): number {
  const ab = b.clone().sub(a);
  const abLenSq = ab.lengthSq();
  if (abLenSq === 0) return p.distanceTo(a);

  let t = p.clone().sub(a).dot(ab) / abLenSq;
  t = THREE.MathUtils.clamp(t, 0, 1);
  const closest = a.clone().add(ab.multiplyScalar(t));
  return p.distanceTo(closest);
}

/** Deterministic PRNG so tree/prop scatter is stable across reloads (no hydration surprises). */
export function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Normalizes any angle (radians, any magnitude) to (-PI, PI]. Needed because both
 * the character's heading and the chase camera's azimuth accumulate via continuous
 * steering input rather than being derived fresh each frame — the naive
 * `((diff + PI) % TWO_PI) - PI` wrap only works for bounded inputs; JS's `%` keeps
 * the sign of a negative dividend, so it silently breaks once a value drifts past
 * one full turn. This handles any magnitude correctly.
 */
export function wrapAngle(angle: number): number {
  let a = angle % (Math.PI * 2);
  if (a > Math.PI) a -= Math.PI * 2;
  if (a < -Math.PI) a += Math.PI * 2;
  return a;
}
