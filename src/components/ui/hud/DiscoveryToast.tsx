"use client";

import { useEffect, useState } from "react";
import { useInteractionStore } from "@/lib/stores/useInteractionStore";

export default function DiscoveryToast() {
  const justDiscoveredId = useInteractionStore((s) => s.justDiscoveredId);
  const entries = useInteractionStore((s) => s.entries);
  const clearJustDiscovered = useInteractionStore((s) => s.clearJustDiscovered);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!justDiscoveredId) return;
    setVisible(true);
    const hideTimer = setTimeout(() => setVisible(false), 3000);
    const clearTimer = setTimeout(() => clearJustDiscovered(), 3400);
    return () => {
      clearTimeout(hideTimer);
      clearTimeout(clearTimer);
    };
  }, [justDiscoveredId, clearJustDiscovered]);

  if (!justDiscoveredId) return null;
  const entry = entries[justDiscoveredId];
  if (!entry) return null;

  return (
    <div
      className={`pointer-events-none fixed inset-x-0 top-8 z-30 flex justify-center transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
      }`}
    >
      <div className="rounded-full border border-white/10 bg-black/70 px-4 py-2 text-sm text-white shadow-lg backdrop-blur">
        <span className="font-semibold text-[#00C48C]">New area discovered</span>
        <span className="mx-1.5 text-white/40">·</span>
        {entry.title}
      </div>
    </div>
  );
}
