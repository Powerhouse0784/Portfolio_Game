"use client";

import dynamic from "next/dynamic";
import InteractionPrompt from "@/components/ui/hud/InteractionPrompt";
import DiscoveryToast from "@/components/ui/hud/DiscoveryToast";
import ActivePanel from "@/components/ui/menus/ActivePanel";

// Canvas/Three.js touches `window` — must be client-only, never SSR'd.
const Scene = dynamic(() => import("@/components/Scene"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 flex items-center justify-center bg-[#0d1b12] text-white">
      <p className="text-lg tracking-wide">Loading the park…</p>
    </div>
  ),
});

export default function Home() {
  return (
    <main className="fixed inset-0 overflow-hidden">
      <Scene />
      <DiscoveryToast />
      <InteractionPrompt />
      <ActivePanel />
    </main>
  );
}
