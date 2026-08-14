# Portfolio Park

An explorable third-person 3D park that doubles as a professional portfolio.
Next.js 16 (App Router) + React Three Fiber + Rapier physics + Zustand.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000. You should be able to walk a placeholder capsule
character around a flat field with mouse-orbit camera, WASD/arrow movement,
Shift to sprint, Space to jump, and an invisible boundary wall at the edge.

## Folder structure

```
src/
  app/                        # Next.js routes. page.tsx is the game canvas entry.
  components/
    world/
      terrain/                # Ground, paths, heightmap (Phase: World Design)
      vegetation/              # Trees, bushes, flowers, grass (instanced)
      water/                   # Pond, fountain, ripples, reflections
      structures/              # Boundary wall, gates, bridges, buildings, benches
      zones/                   # Themed area wrappers (each portfolio section = a zone)
    character/                # CharacterController (physics/input) + PlayerCharacter (visual)
    camera/                    # CameraRig and future camera modes (first-person, top-down, cinematic)
    npc/                       # NPC system: behaviors, pathfinding, schedules
    interaction/               # Proximity detection, prompts, dialogue, highlight/outline
    portfolio/                 # About/Projects/Skills/Experience/Contact 3D "stations"
    ui/
      hud/                     # Minimap, location indicator, notifications
      menus/                   # Pause menu, settings, map overlay
      accessibility/           # HTML portfolio fallback, high-contrast/large-text toggles
    audio/                     # Music/SFX/ambient players wired to useSettingsStore volumes
    effects/                   # Weather, particles, post-processing
  lib/
    stores/                    # Zustand: usePlayerStore, useSettingsStore (npcStore, uiStore to come)
    hooks/                     # Input hooks (keyboard done; touch/gamepad next)
    physics/                   # Shared Rapier helpers/collider presets
    constants/                 # World scale, graphics presets — single source of truth
    utils/
  content/                     # Portfolio DATA as plain TS/JSON — projects, skills, about, experience
                                # (kept separate from components so content edits never touch 3D code)
  types/
public/
  models/character/            # Rigged player GLB goes here
  models/environment/          # Trees, props, buildings (Draco-compressed GLBs)
  models/npc/                  # NPC character GLBs
  models/props/                # Benches, lamps, signboards, playground equipment
  textures/                    # KTX2-compressed where possible
  audio/{music,sfx,ambient}/
  hdri/                        # Environment lighting maps
```

## What's already working

- Kinematic character controller via Rapier's real character controller
  (autostep, snap-to-ground, slope limits) — not manual position hacks.
- Camera-relative WASD/arrow movement, smooth turning, sprint, jump, gravity.
- Third-person orbit camera: drag to rotate, scroll to zoom, basic obstacle
  raycast avoidance, smoothed follow with lag.
- Invisible ring-collider world boundary (48 segments around a configurable radius).
- Settings store (persisted) covering graphics preset, all 4 audio channels,
  camera prefs, control mode, and accessibility flags — ready for the
  settings menu UI to bind to.
- Player store separating live transform / grounded / moving state from raw
  input, so touch and gamepad input hooks can be added later without
  touching CharacterController.

## Suggested build order (matches the feature doc's phases)

1. **World Design** — replace the flat ground with real terrain, paths, zones,
   landmark, entrance plaza. Build out `world/terrain` and `world/zones`.
2. **Environment art** — trees/bushes/flowers/props as instanced meshes in
   `world/vegetation`, water in `world/water`.
3. **Character art** — swap the capsule placeholder in `PlayerCharacter.tsx`
   for a rigged GLB with idle/walk/run/sprint/jump animations via
   `useAnimations`.
4. **Camera polish** — first-person/top-down modes, cinematic intro, zone-specific angles.
5. **Interaction system** — proximity + prompt + dialogue in `components/interaction`,
   this is the plumbing every portfolio station and NPC will use.
6. **Portfolio content** — populate `content/` with real data, build the
   About/Projects/Skills/Experience/Contact stations in `components/portfolio`.
7. **NPCs** — behavior states, pathfinding, schedules.
8. **Atmosphere & audio** — day/night, weather, zone music.
9. **UI/HUD/accessibility** — menus, minimap, the HTML portfolio fallback
   (this one is not optional — it's the WCAG-compliant escape hatch).
10. **Performance & security pass** — LOD, instancing, compression, rate
    limiting on any backend routes (guestbook, contact form).

We'll build this phase by phase, slowly slowly.
