import * as THREE from "three";
import { distanceToSegmentXZ } from "@/lib/utils/geometry";
import { ZONES, ZONE_RING_RADIUS, PLAZA_RADIUS, ENTRANCE_Z, angleToPosition } from "@/lib/constants/zones";

// Single pond, tucked into the gap between the About and Projects zones.
const [pondX, , pondZ] = angleToPosition(60, 24);
export const POND_CENTER: [number, number] = [pondX, pondZ];
export const POND_RADIUS = 5.5;

type ExclusionOptions = {
  /** Extra clearance added to every exclusion zone, in meters. */
  margin?: number;
  /** Skip the pond check (used by things meant to sit right at the water's edge). */
  ignorePond?: boolean;
};

/** True if (x, z) falls inside a path, the plaza, a zone patch, or the pond — i.e. keep decor out. */
export function isSceneryExcluded(x: number, z: number, opts: ExclusionOptions = {}): boolean {
  const { margin = 0, ignorePond = false } = opts;
  const p = new THREE.Vector2(x, z);

  if (p.length() < PLAZA_RADIUS + 4 + margin) return true;

  const entranceA = new THREE.Vector2(0, ENTRANCE_Z);
  const entranceB = new THREE.Vector2(0, PLAZA_RADIUS);
  if (distanceToSegmentXZ(p, entranceA, entranceB) < 5.5 + margin) return true;

  for (const zone of ZONES) {
    const [zx, , zz] = angleToPosition(zone.angleDeg, ZONE_RING_RADIUS);
    const zonePos = new THREE.Vector2(zx, zz);
    if (p.distanceTo(zonePos) < 8 + margin) return true;

    const [px, , pz] = angleToPosition(zone.angleDeg, PLAZA_RADIUS);
    const pathA = new THREE.Vector2(px, pz);
    if (distanceToSegmentXZ(p, pathA, zonePos) < 4.5 + margin) return true;
  }

  if (!ignorePond) {
    const pond = new THREE.Vector2(...POND_CENTER);
    if (p.distanceTo(pond) < POND_RADIUS + 2.5 + margin) return true;
  }

  return false;
}
