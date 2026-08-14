"use client";

import { PROJECTS } from "@/content/projects";
import { ZONES, ZONE_RING_RADIUS, angleToPosition } from "@/lib/constants/zones";
import ProjectExhibit from "./ProjectExhibit";

const EXHIBIT_RADIUS = 4.2; // distance from zone center, kept inside the zone's own 7m ground patch
const SPREAD_DEG = 150; // total angular width of the fan

export default function ProjectExhibitField() {
  const projectsZone = ZONES.find((z) => z.id === "projects");
  if (!projectsZone) return null;

  const center = angleToPosition(projectsZone.angleDeg, ZONE_RING_RADIUS);

  // Direction from the zone back toward the plaza (world origin) — exhibits fan out
  // facing this way so the player encounters them naturally walking in from the path.
  const toPlazaAngle = Math.atan2(-center[0], -center[2]);

  return (
    <>
      {PROJECTS.map((project, i) => {
        const t = PROJECTS.length === 1 ? 0 : i / (PROJECTS.length - 1) - 0.5;
        const angle = toPlazaAngle + (t * SPREAD_DEG * Math.PI) / 180;
        const x = center[0] + Math.sin(angle) * EXHIBIT_RADIUS;
        const z = center[2] + Math.cos(angle) * EXHIBIT_RADIUS;
        return <ProjectExhibit key={project.id} project={project} position={[x, 0, z]} />;
      })}
    </>
  );
}
