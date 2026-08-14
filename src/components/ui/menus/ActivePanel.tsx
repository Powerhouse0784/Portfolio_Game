"use client";

import { useInteractionStore } from "@/lib/stores/useInteractionStore";
import ZoneInfoPanel from "./ZoneInfoPanel";
import ProjectsPanel from "./ProjectsPanel";
import SkillsPanel from "./SkillsPanel";
import AboutPanel from "./AboutPanel";
import ExperienceHallPanel from "./ExperienceHallPanel";
import ContactPanel from "./ContactPanel";

export default function ActivePanel() {
  const activePanelId = useInteractionStore((s) => s.activePanelId);
  if (!activePanelId) return null;

  const isProjectRelated = activePanelId === "projects" || activePanelId.startsWith("project:");
  if (isProjectRelated) return <ProjectsPanel />;

  const isSkillRelated = activePanelId === "skills" || activePanelId.startsWith("skill-category:");
  if (isSkillRelated) return <SkillsPanel />;

  const isAboutRelated = activePanelId === "about" || activePanelId.startsWith("about-tab:");
  if (isAboutRelated) return <AboutPanel />;

  const isExperienceRelated = activePanelId === "experience" || activePanelId.startsWith("experience-tab:");
  if (isExperienceRelated) return <ExperienceHallPanel />;

  if (activePanelId === "contact") return <ContactPanel />;

  return <ZoneInfoPanel />;
}
