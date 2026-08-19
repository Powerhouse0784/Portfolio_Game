"use client";

import dynamic from "next/dynamic";
import LoadingScreen from "@/components/ui/LoadingScreen";
import InteractionPrompt from "@/components/ui/hud/InteractionPrompt";
import DiscoveryToast from "@/components/ui/hud/DiscoveryToast";
import SkipIntroButton from "@/components/ui/hud/SkipIntroButton";
import TouchControls from "@/components/ui/hud/TouchControls";
import OrientationWarning from "@/components/ui/hud/OrientationWarning";
import FullscreenButton from "@/components/ui/hud/FullscreenButton";
import ControlsHint from "@/components/ui/hud/ControlsHint";
import PauseButton from "@/components/ui/hud/PauseButton";
import Minimap from "@/components/ui/hud/Minimap";
import StartGate from "@/components/ui/hud/StartGate";
import ActivePanel from "@/components/ui/menus/ActivePanel";
import PauseMenu from "@/components/ui/menus/PauseMenu";

// Canvas/Three.js touches `window` — must be client-only, never SSR'd.
const Scene = dynamic(() => import("@/components/Scene"), {
  ssr: false,
  loading: () => <LoadingScreen />,
});

export default function Home() {
  return (
    <main className="fixed inset-0 overflow-hidden">
      <Scene />
      <DiscoveryToast />
      <InteractionPrompt />
      <ActivePanel />
      <SkipIntroButton />
      <TouchControls />
      <OrientationWarning />
      <FullscreenButton />
      <ControlsHint />
      <PauseButton />
      <Minimap />
      <PauseMenu />
      <StartGate />
    </main>
  );
}
