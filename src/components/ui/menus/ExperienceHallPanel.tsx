"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { useInteractionStore } from "@/lib/stores/useInteractionStore";
import { ACHIEVEMENTS, TECHNICAL_EXPERIENCE } from "@/content/experience";
import { playUiTone } from "@/lib/audio/uiSound";
import { backdropMotion, cardMotion } from "./panelMotion";

type Tab = "achievements" | "technical";

export default function ExperienceHallPanel() {
  const activePanelId = useInteractionStore((s) => s.activePanelId);
  const closePanel = useInteractionStore((s) => s.closePanel);
  const [tab, setTab] = useState<Tab>("achievements");

  useEffect(() => {
    if (activePanelId === "experience-tab:technical") setTab("technical");
    else if (activePanelId === "experience-tab:achievements") setTab("achievements");
    else if (activePanelId === "experience") setTab("achievements");
  }, [activePanelId]);

  const isOpen = activePanelId === "experience" || activePanelId?.startsWith("experience-tab:");
  if (!isOpen) return null;

  const handleClose = () => {
    closePanel();
    playUiTone("close");
  };

  return (
    <motion.div
      {...backdropMotion}
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
      onClick={handleClose}
    >
      <motion.div
        {...cardMotion}
        className="flex h-[75vh] max-h-[620px] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#12181f] text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-6">
          <div>
            <h2 className="text-xl font-semibold text-[#FFB800]">Experience Hall</h2>
            <p className="text-xs text-white/40">Hackathons, achievements, and hard-won technical experience</p>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close"
            className="shrink-0 rounded-full p-1 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="flex gap-1 border-b border-white/10 px-4 pt-3">
          <TabButton active={tab === "achievements"} onClick={() => setTab("achievements")}>
            Achievements
          </TabButton>
          <TabButton active={tab === "technical"} onClick={() => setTab("technical")}>
            Technical Experience
          </TabButton>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {tab === "achievements" && (
            <div className="space-y-4">
              {ACHIEVEMENTS.map((a) => (
                <div key={a.id} className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <h3 className="text-base font-semibold text-white/90">{a.title}</h3>
                    <span className="shrink-0 text-xs text-white/40">{a.period}</span>
                  </div>
                  <p className="mb-2 text-sm text-white/70">{a.description}</p>
                  <ul className="space-y-1">
                    {a.highlights.map((h) => (
                      <li key={h} className="flex gap-2 text-sm text-white/70">
                        <span className="mt-0.5 text-[#FFB800]">▸</span>
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {tab === "technical" && (
            <div className="space-y-3">
              {TECHNICAL_EXPERIENCE.map((area) => (
                <div key={area.id} className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-white/90">{area.title}</h3>
                    <span className="shrink-0 rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/60">
                      {area.evidence}
                    </span>
                  </div>
                  <p className="text-sm text-white/70">{area.summary}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-t-lg px-3 py-2 text-sm transition-colors ${
        active ? "bg-white/10 text-white" : "text-white/50 hover:text-white/80"
      }`}
    >
      {children}
    </button>
  );
}
