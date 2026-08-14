export type Achievement = {
  id: string;
  title: string;
  period: string;
  description: string;
  highlights: string[];
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "matrix-hackathon",
    title: "Matrix Hackathon",
    period: "Sep 2023",
    description: "Collaborated with a team to design and develop an innovative solution within a limited time frame.",
    highlights: [
      "Hands-on experience in problem-solving, teamwork, and applying technical skills to real-world challenges",
      "Learned new technologies, tools, and approaches to build scalable projects under pressure",
    ],
  },
  {
    id: "sih-hackathon",
    title: "SIH Internal Hackathon",
    period: "Sep 2025",
    description: "Developed an Android application promoting waste management and recycling by converting waste into useful resources.",
    highlights: [
      "Implemented waste categorization, collection requests, and eco-reward tracking",
      "Secured 7th position among multiple competing teams",
      "Strengthened Android development and UI design skills under time constraints",
    ],
  },
];

export type ExperienceArea = {
  id: string;
  title: string;
  summary: string;
  evidence: string;
};

// Not job history — this is the "what did you actually have to solve" layer,
// grounded in specific, real problems from the shipped projects.
export const TECHNICAL_EXPERIENCE: ExperienceArea[] = [
  {
    id: "auth-security",
    title: "Auth & Security Hardening",
    summary:
      "Diagnosed and fixed a PKCE password-recovery flow, hardened session security, and resolved Android gesture-bar conflicts in a shipped mobile app.",
    evidence: "Intense Cook",
  },
  {
    id: "admin-tooling",
    title: "Admin Tooling",
    summary:
      "Built an admin panel with bulk actions, CSV export, and role-specific styling for managing users and content at scale.",
    evidence: "Intense Learners",
  },
  {
    id: "payments",
    title: "Payment Systems",
    summary:
      "Integrated Razorpay across multiple pricing tiers spanning classes 5–12, with stream and competitive-exam category segmentation.",
    evidence: "Intense Learners",
  },
  {
    id: "realtime-sync",
    title: "Real-Time Data & Performance",
    summary:
      "Designed a per-playlist YouTube sync architecture, and moved a notes library from per-keystroke API calls to client-side filtering to fix performance.",
    evidence: "Intense Learners",
  },
];
