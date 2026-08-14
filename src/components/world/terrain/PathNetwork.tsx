"use client";

import { ZONES, ZONE_RING_RADIUS, PLAZA_RADIUS, ENTRANCE_Z, angleToPosition } from "@/lib/constants/zones";
import PathStrip from "./PathStrip";

const STONE_COLOR = "#9a958c";
const WOOD_COLOR = "#8a6440";

export default function PathNetwork() {
  return (
    <group>
      {/* Main entrance path: gate -> plaza edge. Wider = grander, guides the player in. */}
      <PathStrip from={[0, ENTRANCE_Z]} to={[0, PLAZA_RADIUS]} width={5} color={STONE_COLOR} />

      {/* One boardwalk path per themed zone, plaza edge -> zone anchor. */}
      {ZONES.map((zone) => {
        const [x, , z] = angleToPosition(zone.angleDeg, ZONE_RING_RADIUS);
        const [px, , pz] = angleToPosition(zone.angleDeg, PLAZA_RADIUS);
        return (
          <PathStrip
            key={zone.id}
            from={[px, pz]}
            to={[x, z]}
            width={2.6}
            color={WOOD_COLOR}
            roughness={0.8}
          />
        );
      })}
    </group>
  );
}
