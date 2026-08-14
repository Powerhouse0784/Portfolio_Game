"use client";

import { ZONES, ZONE_RING_RADIUS, angleToPosition } from "@/lib/constants/zones";
import ZoneMarker from "./ZoneMarker";
import Interactable from "@/components/interaction/Interactable";

export default function ZoneField() {
  return (
    <>
      {ZONES.map((zone) => {
        const position = angleToPosition(zone.angleDeg, ZONE_RING_RADIUS);
        return (
          <group key={zone.id}>
            <ZoneMarker zone={zone} position={position} />
            <Interactable
              id={zone.id}
              position={position}
              title={zone.name}
              description={zone.description}
              radius={7}
              discoveryRadius={14}
            />
          </group>
        );
      })}
    </>
  );
}
