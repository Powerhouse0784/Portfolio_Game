export type Zone = {
  id: string;
  name: string;
  /** Angle in degrees around the world center. 180° = south/entrance side. */
  angleDeg: number;
  color: string;
  description: string;
};

// Radius of the ring the zones sit on. Plaza sits inside this, boundary wall outside it.
export const ZONE_RING_RADIUS = 40;
export const PLAZA_RADIUS = 10;
export const ENTRANCE_Z = 70; // south edge, inside the 80-radius boundary

// Maps directly onto the resume: About / Projects / Skills / Experience / Contact,
// plus a rest area. Offset from 180° (the gate) so no zone path crosses the entrance path.
export const ZONES: Zone[] = [
  {
    id: "about",
    name: "About Me Garden",
    angleDeg: 30,
    color: "#00C48C",
    description: "Who I am, what I build, what I'm learning.",
  },
  {
    id: "projects",
    name: "Project Showcase Pavilion",
    angleDeg: 90,
    color: "#FF3D5A",
    description: "Intense Cook, Intense Learners, and more.",
  },
  {
    id: "skills",
    name: "Skills Garden",
    angleDeg: 150,
    color: "#FFB800",
    description: "Languages, frameworks, and tools.",
  },
  {
    id: "experience",
    name: "Experience Hall",
    angleDeg: 210,
    color: "#00C48C",
    description: "Timeline of what I've shipped.",
  },
  {
    id: "contact",
    name: "Contact Pavilion",
    angleDeg: 270,
    color: "#FF3D5A",
    description: "Get in touch.",
  },
  {
    id: "cafe",
    name: "Café & Rest Area",
    angleDeg: 330,
    color: "#FFB800",
    description: "A place to sit and take it in.",
  },
];

/** Angle → world XZ position on a ring of the given radius. 0° = north (-z), 180° = south (+z). */
export function angleToPosition(angleDeg: number, radius: number): [number, number, number] {
  const rad = (angleDeg * Math.PI) / 180;
  return [radius * Math.sin(rad), 0, -radius * Math.cos(rad)];
}
