"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Sky } from "@react-three/drei";

import CharacterController from "@/components/character/CharacterController";
import CameraRig from "@/components/camera/CameraRig";
import CinematicIntro from "@/components/camera/CinematicIntro";
import Ground from "@/components/world/terrain/Ground";
import WorldBoundary from "@/components/world/structures/WorldBoundary";
import BoundaryFence from "@/components/world/structures/BoundaryFence";
import CentralPlaza from "@/components/world/terrain/CentralPlaza";
import PathNetwork from "@/components/world/terrain/PathNetwork";
import EntranceGate from "@/components/world/structures/EntranceGate";
import Bridge from "@/components/world/structures/Bridge";
import ZoneField from "@/components/world/zones/ZoneField";
import ProjectExhibitField from "@/components/world/zones/ProjectExhibitField";
import SkillBedField from "@/components/world/zones/SkillBedField";
import AboutBust from "@/components/world/zones/AboutBust";
import ExperienceHall from "@/components/world/zones/ExperienceHall";
import ContactKiosk from "@/components/world/zones/ContactKiosk";
import TreeField from "@/components/world/vegetation/TreeField";
import BushField from "@/components/world/vegetation/BushField";
import FlowerPatches from "@/components/world/vegetation/FlowerPatches";
import RockField from "@/components/world/props/RockField";
import PropField from "@/components/world/props/PropField";
import Pond from "@/components/world/water/Pond";
import NPCField from "@/components/npc/NPCField";
import InteractionManager from "@/components/interaction/InteractionManager";
import PostProcessing from "@/components/effects/PostProcessing";
import { useKeyboardControls } from "@/lib/hooks/useKeyboardControls";
import { useInteractionInput } from "@/lib/hooks/useInteractionInput";
import { useCameraModeInput } from "@/lib/hooks/useCameraModeInput";
import { usePauseInput } from "@/lib/hooks/usePauseInput";
import { useSettingsStore } from "@/lib/stores/useSettingsStore";
import { GRAPHICS_PRESETS } from "@/lib/constants/world";

function SceneContents() {
  return (
    <>
      <Sky sunPosition={[100, 60, 100]} turbidity={4} rayleigh={1.2} />
      {/* No <Environment> HDRI here on purpose — it fetches a lighting map from an
          external CDN at runtime, which is a live network dependency that can (and
          did) fail outright. Sky + the lights below already fully cover the scene. */}

      {/* Sky-color bounce from above, ground-color bounce from below — a fully
          procedural stand-in for the ambient reflections an HDRI would normally
          add, with zero external asset fetch. */}
      <hemisphereLight args={["#bfe0ff", "#4a7c3f", 0.55]} />

      <ambientLight intensity={0.25} />
      <directionalLight
        castShadow
        position={[40, 50, 20]}
        intensity={1.35}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-60}
        shadow-camera-right={60}
        shadow-camera-top={60}
        shadow-camera-bottom={-60}
        shadow-camera-near={1}
        shadow-camera-far={150}
        shadow-bias={-0.0005}
        shadow-normalBias={0.02}
      />

      <Physics gravity={[0, -9.81, 0]}>
        <Ground />
        <WorldBoundary />
        <CentralPlaza />
        <EntranceGate />
        <Bridge />
        <TreeField />
        <RockField />
        <PropField />
        <ZoneField />
        <ProjectExhibitField />
        <AboutBust />
        <ExperienceHall />
        <ContactKiosk />
        <NPCField />
        <CharacterController />
      </Physics>

      {/* Visual-only world dressing — doesn't need to live inside <Physics> */}
      <PathNetwork />
      <BoundaryFence />
      <BushField />
      <FlowerPatches />
      <Pond />
      <SkillBedField />

      <InteractionManager />
      <CameraRig />
      <CinematicIntro />
      <PostProcessing />
    </>
  );
}

export default function Scene() {
  useKeyboardControls();
  useInteractionInput();
  useCameraModeInput();
  usePauseInput();
  const preset = useSettingsStore((s) => s.graphicsPreset);
  const resolved = preset === "auto" ? "medium" : preset;
  const { shadows, dpr } = GRAPHICS_PRESETS[resolved];

  return (
    <Canvas
      shadows={shadows}
      dpr={dpr as [number, number]}
      camera={{ fov: 55, near: 0.1, far: 300, position: [0, 3, 14] }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <Suspense fallback={null}>
        <SceneContents />
      </Suspense>
    </Canvas>
  );
}
