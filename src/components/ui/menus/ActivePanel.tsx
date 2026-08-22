"use client";

import { AnimatePresence } from "framer-motion";
import { useInteractionStore } from "@/lib/stores/useInteractionStore";
import ZoneInfoPanel from "./ZoneInfoPanel";
import ProjectsPanel from "./ProjectsPanel";
import SkillsPanel from "./SkillsPanel";
import AboutPanel from "./AboutPanel";
import ExperienceHallPanel from "./ExperienceHallPanel";
import ContactPanel from "./ContactPanel";
import CafePanel from "./CafePanel";

type PanelKind = "none" | "projects" | "skills" | "about" | "experience" | "contact" | "cafe" | "zone";

function resolveKind(id: string | null): PanelKind {
  if (!id) return "none";
  if (id === "projects" || id.startsWith("project:")) return "projects";
  if (id === "skills" || id.startsWith("skill-category:")) return "skills";
  if (id === "about" || id.startsWith("about-tab:")) return "about";
  if (id === "experience" || id.startsWith("experience-tab:")) return "experience";
  if (id === "contact") return "contact";
  if (id === "cafe") return "cafe";
  return "zone";
}

// AnimatePresence needs the panel to actually unmount (not just internally return
// null) to detect the transition and play each panel's exit animation — mounting
// exactly one keyed child based on `kind` is what makes that work correctly, and
// switching between sub-ids of the *same* kind (e.g. "project:x" -> "project:y")
// deliberately does NOT remount, since that's each panel's own internal tab logic.
export default function ActivePanel() {
  const activePanelId = useInteractionStore((s) => s.activePanelId);
  const kind = resolveKind(activePanelId);

  return (
    <AnimatePresence mode="wait">
      {kind === "projects" && <ProjectsPanel key="projects" />}
      {kind === "skills" && <SkillsPanel key="skills" />}
      {kind === "about" && <AboutPanel key="about" />}
      {kind === "experience" && <ExperienceHallPanel key="experience" />}
      {kind === "contact" && <ContactPanel key="contact" />}
      {kind === "cafe" && <CafePanel key="cafe" />}
      {kind === "zone" && <ZoneInfoPanel key="zone" />}
    </AnimatePresence>
  );
}
