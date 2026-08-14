import { ZONES, ZONE_RING_RADIUS, PLAZA_RADIUS, ENTRANCE_Z, angleToPosition } from "@/lib/constants/zones";

export type PatrolRoute = {
  id: string;
  waypoints: [number, number][]; // XZ pairs
  mode: "pingpong" | "loop";
};

function plazaRingWaypoints(radius: number, count: number): [number, number][] {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2;
    return [radius * Math.sin(angle), -radius * Math.cos(angle)] as [number, number];
  });
}

const ZONE_PATH_ROUTE_IDS = ["about", "skills", "cafe"];

export const NPC_ROUTES: PatrolRoute[] = [
  {
    id: "entrance-stroll",
    mode: "pingpong",
    waypoints: [
      [0, ENTRANCE_Z - 4],
      [0, PLAZA_RADIUS + 3],
    ],
  },
  {
    id: "plaza-ring",
    mode: "loop",
    waypoints: plazaRingWaypoints(13, 8),
  },
  ...ZONES.filter((z) => ZONE_PATH_ROUTE_IDS.includes(z.id)).map((zone) => {
    const [px, , pz] = angleToPosition(zone.angleDeg, PLAZA_RADIUS);
    const [zx, , zz] = angleToPosition(zone.angleDeg, ZONE_RING_RADIUS);
    return {
      id: `path-${zone.id}`,
      mode: "pingpong" as const,
      waypoints: [
        [px, pz],
        [zx, zz],
      ] as [number, number][],
    };
  }),
];
