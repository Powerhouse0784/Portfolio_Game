"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInteractionStore } from "@/lib/stores/useInteractionStore";
import { SKILLS, CATEGORY_ORDER, CATEGORY_COLORS, CATEGORY_BY_SLUG, type SkillCategory } from "@/content/skills";
import { playUiTone } from "@/lib/audio/uiSound";
import { backdropMotion, cardMotion } from "./panelMotion";

const LEVEL_PIPS: Record<string, number> = { Familiar: 1, Proficient: 2, Advanced: 3 };

export default function SkillsPanel() {
  const activePanelId = useInteractionStore((s) => s.activePanelId);
  const closePanel = useInteractionStore((s) => s.closePanel);
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory>(CATEGORY_ORDER[0]);

  // Walking up to a specific flower bed selects that category directly.
  useEffect(() => {
    if (activePanelId?.startsWith("skill-category:")) {
      const slug = activePanelId.slice("skill-category:".length);
      const category = CATEGORY_BY_SLUG[slug];
      if (category) setSelectedCategory(category);
    }
  }, [activePanelId]);

  const isOpen = activePanelId === "skills" || activePanelId?.startsWith("skill-category:");
  if (!isOpen) return null;

  const skills = SKILLS.filter((s) => s.category === selectedCategory);
  const accent = CATEGORY_COLORS[selectedCategory];

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
        className="flex h-[75vh] max-h-[600px] w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-[#12181f] text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sidebar — desktop */}
        <div className="hidden w-52 shrink-0 flex-col border-r border-white/10 bg-black/20 sm:flex">
          <div className="border-b border-white/10 px-4 py-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-white/50">Skills Garden</h2>
          </div>
          <div className="flex-1 overflow-y-auto py-2">
            {CATEGORY_ORDER.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors ${
                  cat === selectedCategory ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white/90"
                }`}
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: CATEGORY_COLORS[cat] }} />
                <span className="truncate">{cat}</span>
                <span className="ml-auto text-xs text-white/30">{SKILLS.filter((s) => s.category === cat).length}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Category pills — mobile only */}
          <div className="flex gap-1.5 overflow-x-auto border-b border-white/10 p-3 sm:hidden">
            {CATEGORY_ORDER.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 rounded-full px-3 py-1 text-xs transition-colors ${
                  cat === selectedCategory ? "bg-white/15 text-white" : "bg-white/5 text-white/60"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="mb-4 flex items-start justify-between gap-4">
              <h3 className="text-2xl font-semibold" style={{ color: accent }}>
                {selectedCategory}
              </h3>
              <button
                onClick={handleClose}
                aria-label="Close"
                className="rounded-full p-1 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
              >
                ✕
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCategory}
                className="grid grid-cols-1 gap-2.5 sm:grid-cols-2"
                initial="hidden"
                animate="show"
                variants={{ show: { transition: { staggerChildren: 0.035 } } }}
              >
                {skills.map((skill) => (
                  <motion.div
                    key={skill.id}
                    variants={{
                      hidden: { opacity: 0, y: 8 },
                      show: { opacity: 1, y: 0 },
                    }}
                    className="rounded-lg border border-white/10 bg-white/5 p-3"
                  >
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-white/90">{skill.name}</span>
                      <span className="flex shrink-0 gap-0.5">
                        {[0, 1, 2].map((p) => (
                          <span
                            key={p}
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ background: p < LEVEL_PIPS[skill.level] ? accent : "rgba(255,255,255,0.15)" }}
                          />
                        ))}
                      </span>
                    </div>
                    {skill.note && <p className="text-xs text-white/50">{skill.note}</p>}
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
