export type TimelineEntry = { period: string; title: string; description: string };

export const ABOUT = {
  name: "Saqib Nadeem",
  title: "Full-Stack Developer & CS Student",
  location: "India",
  tagline: "B.Tech CSE, CBS Group of Institutions (2023–2027)",

  introduction:
    "I build production-quality web and mobile apps end to end — from database schema to pixel-level UI polish. This 3D park is itself an example: every system in it, down to the character controller and the procedural animation, is code I wrote from scratch.",

  mission:
    "I want to ship things that feel finished, not just functional — clean architecture underneath, and an experience on top that doesn't read like a student project.",

  strengths: [
    "Full-stack architecture across web (Next.js) and mobile (React Native/Expo)",
    "Shipping incrementally, feature by feature, without losing sight of the finished product",
    "Comfortable owning a project end-to-end — schema, auth, admin tooling, UI",
  ],

  currentlyLearning: [
    "3D web development (React Three Fiber, physics, procedural animation)",
    "Production security hardening (auth flows, row-level security, rate limiting)",
    "AI integration in real products (Gemini in Intense Cook)",
  ],

  values: [
    "Ship complete, working systems — not prototypes that only work in the demo",
    "Prefer incremental, feature-by-feature builds over big-bang rewrites",
    "Own the whole stack rather than staying in one comfortable layer",
  ],

  whatIBuild:
    "Full-stack products with a real backend, real auth, and real admin tooling — not just front-end demos. Intense Learners and Intense Cook are both complete platforms with role-based access or AI-driven features, not just UI shells.",

  timeline: [
    { period: "Aug 2023", title: "Started B.Tech CSE", description: "CBS Group of Institutions, Jhajjar, Haryana." },
    { period: "Sep 2023", title: "Matrix Hackathon", description: "First hackathon — hands-on experience shipping under time pressure." },
    { period: "May – Jul 2025", title: "First solo builds", description: "Portfolio v1, the TechVision UI demo, and Posture Detector." },
    { period: "Jul – Sep 2025", title: "Waste2Wealth App", description: "React Native app for waste-to-compost tracking and a sustainability marketplace." },
    { period: "Sep 2025", title: "SIH Internal Hackathon", description: "Built an Android waste-management app; placed 7th among competing teams." },
    { period: "Dec 2025 – Present", title: "Intense Learners", description: "Full-stack e-learning platform with role-based dashboards, in active development." },
    { period: "2025 – Present", title: "Intense Cook", description: "AI-powered recipe & meal planning app with Gemini integration, in active development." },
  ] as TimelineEntry[],

  social: {
    github: "https://github.com/Powerhouse0784",
    linkedin: "https://linkedin.com/in/Saqib-Nadeem",
    email: "saquibnadeem784@gmail.com",
  },

  resumeFile: "/resume.pdf",
};
