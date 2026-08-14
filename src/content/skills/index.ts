export type SkillCategory = "Languages" | "Web" | "Mobile" | "Backend & Cloud" | "Databases" | "Tools";
export type SkillLevel = "Familiar" | "Proficient" | "Advanced";

export type Skill = {
  id: string;
  name: string;
  category: SkillCategory;
  level: SkillLevel;
  note?: string;
};

export const CATEGORY_ORDER: SkillCategory[] = ["Languages", "Web", "Mobile", "Backend & Cloud", "Databases", "Tools"];

export const CATEGORY_COLORS: Record<SkillCategory, string> = {
  Languages: "#FF3D5A",
  Web: "#00C48C",
  Mobile: "#38BDF8",
  "Backend & Cloud": "#FFB800",
  Databases: "#8B5CF6",
  Tools: "#F97316",
};

export const CATEGORY_SLUGS: Record<SkillCategory, string> = {
  Languages: "languages",
  Web: "web",
  Mobile: "mobile",
  "Backend & Cloud": "backend-cloud",
  Databases: "databases",
  Tools: "tools",
};

export const CATEGORY_BY_SLUG: Record<string, SkillCategory> = Object.fromEntries(
  CATEGORY_ORDER.map((c) => [CATEGORY_SLUGS[c], c])
) as Record<string, SkillCategory>;

export const SKILLS: Skill[] = [
  // Languages
  { id: "c", name: "C", category: "Languages", level: "Proficient" },
  { id: "cpp", name: "C++", category: "Languages", level: "Proficient" },
  { id: "python", name: "Python", category: "Languages", level: "Proficient" },
  { id: "javascript", name: "JavaScript / TypeScript", category: "Languages", level: "Advanced" },
  { id: "sql", name: "SQL", category: "Languages", level: "Proficient" },

  // Web
  { id: "html", name: "HTML", category: "Web", level: "Advanced" },
  { id: "css", name: "CSS", category: "Web", level: "Advanced" },
  { id: "react", name: "React", category: "Web", level: "Advanced" },
  { id: "nextjs", name: "Next.js", category: "Web", level: "Advanced", note: "Core stack — Intense Learners, this portfolio" },
  { id: "nodejs", name: "Node.js", category: "Web", level: "Proficient" },
  { id: "express", name: "Express.js", category: "Web", level: "Proficient" },

  // Mobile
  { id: "react-native", name: "React Native", category: "Mobile", level: "Advanced", note: "Intense Cook, Waste2Wealth" },
  { id: "expo", name: "Expo", category: "Mobile", level: "Advanced" },

  // Backend & Cloud
  { id: "supabase", name: "Supabase", category: "Backend & Cloud", level: "Advanced", note: "Intense Cook backend" },
  { id: "firebase", name: "Firebase", category: "Backend & Cloud", level: "Proficient" },
  { id: "prisma", name: "Prisma", category: "Backend & Cloud", level: "Proficient" },
  { id: "nextauth", name: "NextAuth", category: "Backend & Cloud", level: "Proficient" },
  { id: "brevo", name: "Brevo", category: "Backend & Cloud", level: "Familiar" },
  { id: "vercel", name: "Vercel", category: "Backend & Cloud", level: "Proficient" },

  // Databases
  { id: "postgresql", name: "PostgreSQL", category: "Databases", level: "Proficient" },
  { id: "mysql", name: "MySQL", category: "Databases", level: "Familiar" },
  { id: "sqlite", name: "SQLite", category: "Databases", level: "Familiar" },

  // Tools
  { id: "git", name: "Git & GitHub", category: "Tools", level: "Advanced" },
  { id: "vscode", name: "VS Code", category: "Tools", level: "Advanced" },
  { id: "android-studio", name: "Android Studio", category: "Tools", level: "Proficient" },
  { id: "zustand", name: "Zustand", category: "Tools", level: "Advanced", note: "State management across every app" },
];
