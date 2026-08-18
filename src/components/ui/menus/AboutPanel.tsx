"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { useInteractionStore } from "@/lib/stores/useInteractionStore";
import { ABOUT } from "@/content/about";
import { playUiTone } from "@/lib/audio/uiSound";
import { backdropMotion, cardMotion } from "./panelMotion";

type Tab = "profile" | "timeline" | "values";

const TABS: { id: Tab; label: string }[] = [
  { id: "profile", label: "Profile" },
  { id: "timeline", label: "Timeline" },
  { id: "values", label: "Values & Interests" },
];

export default function AboutPanel() {
  const activePanelId = useInteractionStore((s) => s.activePanelId);
  const closePanel = useInteractionStore((s) => s.closePanel);
  const [tab, setTab] = useState<Tab>("profile");

  useEffect(() => {
    if (activePanelId === "about-tab:timeline") setTab("timeline");
    else if (activePanelId === "about-tab:values") setTab("values");
    else if (activePanelId === "about") setTab("profile");
  }, [activePanelId]);

  const isOpen = activePanelId === "about" || activePanelId?.startsWith("about-tab:");
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
        {/* Header — the "interactive profile card" */}
        <div className="flex items-start gap-4 border-b border-white/10 p-6">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-[#FFB800] bg-white/5 text-xl font-bold text-[#FFB800]">
            SN
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-xl font-semibold">{ABOUT.name}</h2>
            <p className="truncate text-sm text-white/60">{ABOUT.title}</p>
            <p className="truncate text-xs text-white/40">
              {ABOUT.tagline} · {ABOUT.location}
            </p>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close"
            className="shrink-0 rounded-full p-1 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-white/10 px-4 pt-3">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`rounded-t-lg px-3 py-2 text-sm transition-colors ${
                tab === t.id ? "bg-white/10 text-white" : "text-white/50 hover:text-white/80"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {tab === "profile" && (
            <div className="space-y-5">
              <p className="text-sm leading-relaxed text-white/80">{ABOUT.introduction}</p>
              <Section title="Mission">{ABOUT.mission}</Section>
              <ListSection title="Strengths" items={ABOUT.strengths} />
              <ListSection title="Currently Learning" items={ABOUT.currentlyLearning} />
              <Section title="What I Build">{ABOUT.whatIBuild}</Section>
            </div>
          )}

          {tab === "timeline" && (
            <ol className="space-y-4 border-l border-white/10 pl-4">
              {ABOUT.timeline.map((entry) => (
                <li key={entry.period + entry.title} className="relative">
                  <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-[#00C48C]" />
                  <p className="text-xs font-medium text-white/40">{entry.period}</p>
                  <p className="text-sm font-semibold text-white/90">{entry.title}</p>
                  <p className="text-sm text-white/60">{entry.description}</p>
                </li>
              ))}
            </ol>
          )}

          {tab === "values" && (
            <div className="space-y-5">
              <ListSection title="Values" items={ABOUT.values} />
            </div>
          )}
        </div>

        {/* Footer — real links, real resume */}
        <div className="flex flex-wrap items-center gap-3 border-t border-white/10 p-4">
          <a
            href={ABOUT.social.github}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs transition-colors hover:bg-white/10"
          >
            GitHub
          </a>
          <a
            href={ABOUT.social.linkedin}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs transition-colors hover:bg-white/10"
          >
            LinkedIn
          </a>
          <a
            href={`mailto:${ABOUT.social.email}`}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs transition-colors hover:bg-white/10"
          >
            Email
          </a>
          <a
            href={ABOUT.resumeFile}
            download
            className="ml-auto rounded-lg bg-[#FFB800] px-4 py-1.5 text-xs font-semibold text-black transition-colors hover:bg-[#ffc633]"
          >
            Download Résumé
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-white/40">{title}</h4>
      <p className="text-sm leading-relaxed text-white/80">{children}</p>
    </div>
  );
}

function ListSection({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/40">{title}</h4>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm text-white/80">
            <span className="mt-0.5 text-[#00C48C]">▸</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
