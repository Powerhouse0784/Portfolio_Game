"use client";

import dynamic from "next/dynamic";
import LoadingScreen from "@/components/ui/LoadingScreen";
import InteractionPrompt from "@/components/ui/hud/InteractionPrompt";
import DiscoveryToast from "@/components/ui/hud/DiscoveryToast";
import SkipIntroButton from "@/components/ui/hud/SkipIntroButton";
import TouchControls from "@/components/ui/hud/TouchControls";
import OrientationWarning from "@/components/ui/hud/OrientationWarning";
import FullscreenButton from "@/components/ui/hud/FullscreenButton";
import SettingsMenu from "@/components/ui/hud/SettingsMenu";
import Minimap from "@/components/ui/hud/Minimap";
import StartGate from "@/components/ui/hud/StartGate";
import ActivePanel from "@/components/ui/menus/ActivePanel";

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
      <SettingsMenu />
      <Minimap />
      <StartGate />
    </main>
  );
}
