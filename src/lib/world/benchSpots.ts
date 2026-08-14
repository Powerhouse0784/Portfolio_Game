import { ZONES, ZONE_RING_RADIUS, PLAZA_RADIUS, ENTRANCE_Z, angleToPosition } from "@/lib/constants/zones";

export type BenchSpot = { position: [number, number, number]; rotationY: number };

/** One bench near each zone's signboard, facing back toward the zone center. */
export function getZoneBenchSpots(): BenchSpot[] {
  return ZONES.map((zone) => {
    const [x, , z] = angleToPosition(zone.angleDeg, ZONE_RING_RADIUS);
    const rotationY = Math.atan2(-x, -z) + Math.PI;
    return { position: [x - 2.2, 0, z - 1], rotationY };
  });
}

/** The Contact Pavilion's dedicated bench, facing back toward its kiosk. */
export function getContactBenchSpot(): BenchSpot | null {
  const zone = ZONES.find((z) => z.id === "contact");
  if (!zone) return null;

  const center = angleToPosition(zone.angleDeg, ZONE_RING_RADIUS);
  const toPlazaAngle = Math.atan2(-center[0], -center[2]);
  const rad = toPlazaAngle;
  const radius = 3.6;
  const position: [number, number, number] = [
    center[0] + radius * Math.sin(rad),
    0,
    center[2] + radius * Math.cos(rad),
  ];
  return { position, rotationY: toPlazaAngle + Math.PI };
}

export function getAllBenchSpots(): BenchSpot[] {
  const contact = getContactBenchSpot();
  return contact ? [...getZoneBenchSpots(), contact] : getZoneBenchSpots();
}

// Re-exported so callers that only need world scale don't have to reach into zones.ts directly.
export { PLAZA_RADIUS, ENTRANCE_Z };
