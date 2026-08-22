export type BuildFact = {
  title: string;
  detail: string;
};

export const CAFE_MESSAGE =
  "Thanks for wandering through. Every zone, system, and animation in this park was built from scratch — the same way I approach every project.";

export const BUILD_FACTS: BuildFact[] = [
  {
    title: "Zero external assets",
    detail:
      "No downloaded 3D models, no textures, no HDRI lighting maps. Every tree, rock, prop, and character is built entirely from code.",
  },
  {
    title: "Procedural animation",
    detail:
      "Walk cycles, sit poses, idle sway, and wind-swayed foliage are all computed live in the browser — no motion capture, no baked animation clips.",
  },
  {
    title: "Real physics",
    detail:
      "Built on Rapier, the same class of physics engine used in production games — not a distance-check collision hack.",
  },
  {
    title: "A working backend",
    detail: "The Contact form sends real email through a rate-limited, server-validated API route, not a fake success toast.",
  },
  {
    title: "Proper car-style steering",
    detail:
      "Movement uses real throttle + turn-rate steering rather than the default strafe-based third-person controls most tutorials default to.",
  },
];
