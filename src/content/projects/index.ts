export type Project = {
  id: string;
  title: string;
  summary: string;
  problem: string;
  solution: string;
  features: string[];
  techStack: string[];
  role: string;
  timeline: string;
  category: "Full-Stack" | "Mobile" | "Web" | "UI Demo";
  status: "Live" | "In Progress" | "Completed";
  featured: boolean;
};

// No GitHub/live links here on purpose — the resume's project links weren't
// extractable as URLs, and fabricating them isn't an option. The panel points
// to the GitHub profile URL instead, which the resume does state directly.
export const PROJECTS: Project[] = [
  {
    id: "intense-cook",
    title: "Intense Cook",
    summary: "A free AI-powered recipe and meal planning app with a full social layer.",
    problem:
      "Home cooks juggle scattered recipes and generic meal plans, and most planning apps paywall the basics.",
    solution:
      "Built a free, full-featured mobile app that generates recipes and meal plans with Google Gemini AI, layers in a cooking mode with voice narration, and adds social features and an admin dashboard — no paywall.",
    features: [
      "AI-powered recipe generation & meal planning (Gemini)",
      "Cooking mode with voice narration",
      "Full auth flow with PKCE-secured password recovery",
      "Social features and push notifications",
      "Admin dashboard",
      "Dark mode",
    ],
    techStack: ["React Native", "Expo", "Supabase", "Zustand", "Google Gemini AI"],
    role: "Sole developer — architecture, auth security hardening, AI integration, admin tooling",
    timeline: "2025 – Present",
    category: "Mobile",
    status: "In Progress",
    featured: true,
  },
  {
    id: "intense-learners",
    title: "Intense Learners",
    summary: "A full-stack e-learning platform for students and teachers with role-based access.",
    problem:
      "Coaching platforms often bolt content delivery, grading, and payments together loosely, leaving teachers without one unified dashboard.",
    solution:
      "Designed a role-based platform (Student/Teacher/Admin) covering course and assignment management, progress-tracked video playback, doubt-raising, and a payments system spanning classes 5–12 with stream and competitive-exam segmentation.",
    features: [
      "Role-based auth with Brevo transactional email",
      "Teacher dashboard: courses, modules, lectures, assignment grading",
      "Student dashboard: enrollments, progress-tracked playback, submissions",
      "Admin panel: user management, content moderation, payment records",
      "Payments across classes 5–12 with stream & exam categories",
      "Per-playlist YouTube sync architecture",
    ],
    techStack: ["Next.js 14", "TypeScript", "Prisma", "NextAuth", "Brevo", "Razorpay", "PostgreSQL"],
    role: "Sole developer — full-stack architecture, payments, admin tooling",
    timeline: "Dec 2025 – Present",
    category: "Full-Stack",
    status: "In Progress",
    featured: true,
  },
  {
    id: "waste2wealth",
    title: "Waste2Wealth App",
    summary: "Converts organic waste into compost while running an e-commerce layer for sustainable products.",
    problem:
      "Waste treatment gaps leave both biodegradable and non-biodegradable waste under-processed with no consumer-facing loop back to value.",
    solution:
      "Built a mobile app bridging waste collection with compost conversion and a marketplace for the resulting sustainable products.",
    features: ["Waste categorization & collection requests", "Compost conversion tracking", "E-commerce layer"],
    techStack: ["React Native", "TypeScript", "Firebase"],
    role: "Developer",
    timeline: "Jul 2025 – Sep 2025",
    category: "Mobile",
    status: "Completed",
    featured: false,
  },
  {
    id: "posture-detector",
    title: "Posture Detector",
    summary: "A webcam-based real-time posture analysis tool for better ergonomics.",
    problem: "People working or studying long hours rarely get real-time feedback on posture until pain sets in.",
    solution:
      "Built a lightweight web tool that analyses posture via webcam in real time and gives immediate corrective feedback, with careful handling of sensitive webcam data during testing.",
    features: ["Real-time webcam posture analysis", "Immediate corrective feedback", "Lightweight, no install"],
    techStack: ["React", "Node.js", "Express.js"],
    role: "Developer",
    timeline: "Jul 2025",
    category: "Web",
    status: "Completed",
    featured: false,
  },
  {
    id: "techvision",
    title: "TechVision (UI Demo)",
    summary: "A high-fidelity UI demo showcasing modern web design patterns and micro-interactions.",
    problem:
      "Wanted a focused showcase of layout, animation, and component-design craft, decoupled from backend complexity.",
    solution:
      "Built a polished front-end-only demo using shadcn/ui and Aceternity UI for effects, focused on responsive design, dark mode, and accessibility.",
    features: ["Polished layouts & micro-interactions", "shadcn/ui + Aceternity UI effects", "Responsive & accessible"],
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui", "Aceternity UI"],
    role: "Developer",
    timeline: "Jun 2025",
    category: "UI Demo",
    status: "Completed",
    featured: false,
  },
  {
    id: "portfolio-v1",
    title: "Portfolio Website (v1)",
    summary: "An earlier clean, modern web portfolio — since succeeded by this 3D park.",
    problem: "Needed a fast, professional first portfolio before this 3D build existed.",
    solution: "Built a streamlined, responsive single-page portfolio focused on making a strong first impression.",
    features: ["Responsive single-page layout", "Project & skills showcase"],
    techStack: ["HTML", "CSS", "JavaScript"],
    role: "Developer",
    timeline: "May 2025",
    category: "Web",
    status: "Completed",
    featured: false,
  },
];

export const CATEGORY_COLORS: Record<Project["category"], string> = {
  "Full-Stack": "#00C48C",
  Mobile: "#FF3D5A",
  Web: "#FFB800",
  "UI Demo": "#38BDF8",
};
