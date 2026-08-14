"use client";

import { CATEGORY_ORDER } from "@/content/skills";
import { ZONES, ZONE_RING_RADIUS, angleToPosition } from "@/lib/constants/zones";
import SkillBed from "./SkillBed";

const BED_RING_RADIUS = 4.5;
// Signboard always sits at zoneCenter + (0,0,5.5), i.e. angle 0° in our convention.
// Starting the ring at 30° keeps every bed clear of it.
const RING_OFFSET_DEG = 30;

export default function SkillBedField() {
  const skillsZone = ZONES.find((z) => z.id === "skills");
  if (!skillsZone) return null;

  const center = angleToPosition(skillsZone.angleDeg, ZONE_RING_RADIUS);

  return (
    <>
      {CATEGORY_ORDER.map((category, i) => {
        const angleDeg = RING_OFFSET_DEG + i * (360 / CATEGORY_ORDER.length);
        const rad = (angleDeg * Math.PI) / 180;
        const x = center[0] + BED_RING_RADIUS * Math.sin(rad);
        const z = center[2] + BED_RING_RADIUS * Math.cos(rad);
        return <SkillBed key={category} category={category} position={[x, 0, z]} />;
      })}
    </>
  );
}
