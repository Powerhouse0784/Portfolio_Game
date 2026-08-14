// Single source of truth for world scale. Ground, boundary wall, minimap
// scaling, and fog distances should all derive from this rather than
// hardcoding numbers in multiple files.
export const WORLD_BOUNDARY_RADIUS = 80; // meters, center to edge

export const GRAPHICS_PRESETS = {
  low: { shadows: false, dpr: [0.75, 1], npcCount: 8 },
  medium: { shadows: true, dpr: [1, 1.5], npcCount: 18 },
  high: { shadows: true, dpr: [1, 2], npcCount: 30 },
} as const;
