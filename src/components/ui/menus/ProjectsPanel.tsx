"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInteractionStore } from "@/lib/stores/useInteractionStore";
import { PROJECTS, CATEGORY_COLORS } from "@/content/projects";
import { playUiTone } from "@/lib/audio/uiSound";
import { backdropMotion, cardMotion } from "./panelMotion";

const DEFAULT_ID = PROJECTS.find((p) => p.featured)?.id ?? PROJECTS[0].id;

export default function ProjectsPanel() {
  const activePanelId = useInteractionStore((s) => s.activePanelId);
  const closePanel = useInteractionStore((s) => s.closePanel);
  const [selectedId, setSelectedId] = useState(DEFAULT_ID);

  // Jumping straight to a specific exhibit's pedestal should select that project;
  // opening via the zone's own signboard ("projects") leaves the current selection alone.
  useEffect(() => {
    if (activePanelId?.startsWith("project:")) {
      setSelectedId(activePanelId.slice("project:".length));
    }
  }, [activePanelId]);

  const isOpen = activePanelId === "projects" || activePanelId?.startsWith("project:");
  if (!isOpen) return null;

  const project = PROJECTS.find((p) => p.id === selectedId) ?? PROJECTS[0];
  const accent = CATEGORY_COLORS[project.category];

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
        className="flex h-[80vh] max-h-[640px] w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-[#12181f] text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sidebar */}
        <div className="hidden w-56 shrink-0 flex-col border-r border-white/10 bg-black/20 sm:flex">
          <div className="border-b border-white/10 px-4 py-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-white/50">Project Showcase</h2>
          </div>
          <div className="flex-1 overflow-y-auto py-2">
            {PROJECTS.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedId(p.id)}
                className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors ${
                  p.id === selectedId ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white/90"
                }`}
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: CATEGORY_COLORS[p.category] }} />
                <span className="truncate">{p.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Detail */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={project.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
            >
              <div className="mb-1 flex items-center gap-2">
                <span
                  className="rounded-full px-2 py-0.5 text-xs font-medium"
                  style={{ background: `${accent}22`, color: accent }}
                >
                  {project.category}
                </span>
                <span className="text-xs text-white/40">{project.timeline}</span>
                <span className="ml-auto text-xs text-white/40">{project.status}</span>
              </div>

              <div className="mb-4 flex items-start justify-between gap-4">
                <h3 className="text-2xl font-semibold text-[#FFB800]">{project.title}</h3>
                <button
                  onClick={handleClose}
                  aria-label="Close"
                  className="rounded-full p-1 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <p className="mb-5 text-sm leading-relaxed text-white/80">{project.summary}</p>

              <Section title="Problem">{project.problem}</Section>
              <Section title="Solution">{project.solution}</Section>

              <div className="mb-5">
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/40">Features</h4>
                <ul className="space-y-1.5">
                  {project.features.map((f) => (
                    <li key={f} className="flex gap-2 text-sm text-white/80">
                      <span className="mt-0.5 text-[#00C48C]">▸</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-5">
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/40">Tech Stack</h4>
                <div className="flex flex-wrap gap-1.5">
                  {project.techStack.map((t) => (
                    <span key={t} className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/80">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-xs text-white/40">{project.role}</p>

              <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                <a
                  href="https://github.com/Powerhouse0784"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-white/50 underline hover:text-white/80"
                >
                  github.com/Powerhouse0784
                </a>
                <button onClick={handleClose} className="rounded-lg bg-white/10 px-4 py-1.5 text-sm hover:bg-white/15">
                  Close
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-white/40">{title}</h4>
      <p className="text-sm leading-relaxed text-white/80">{children}</p>
    </div>
  );
}
