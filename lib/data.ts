/**
 * Single source of truth for portfolio content.
 *
 * - `prisma/seed.ts` writes projects, skills and the profile into PostgreSQL.
 * - `lib/queries.ts` reads them back, and falls back to these values when the
 *   database is unreachable, so the site always renders.
 */

export type Metric = { label: string; value: string };

export type ProjectCategory = "Backend" | "Machine Learning" | "Full-Stack";

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  category: ProjectCategory;
  role: string;
  techStack: string[];
  highlights: string[];
  metrics: Metric[];
  githubUrl: string | null;
  liveUrl: string | null;
  featured: boolean;
  order: number;
};

export type SkillCategory =
  | "Languages"
  | "Backend & Web"
  | "Databases & Tools"
  | "Core Fundamentals";

export type Skill = { name: string; category: SkillCategory; order: number };

export type TimelineEntry = {
  title: string;
  organization: string;
  period: string;
  location?: string;
  meta?: string;
  points: string[];
  tags?: string[];
};

export const profile = {
  name: "Yogesh Sharma",
  firstName: "Yogesh",
  initials: "YS",
  headline: "Software Engineer",
  roles: [
    "backend systems.",
    "REST APIs in TypeScript.",
    "ML models from first principles.",
    "clean, tested code.",
  ],
  tagline:
    "Pre-final year undergraduate at BIT Mesra who likes understanding systems all the way down — from payment webhooks and aggregation pipelines to writing an autograd engine and a GPT by hand.",
  bio: [
    "I'm a pre-final year Electronics and Communication Engineering undergraduate at BIT Mesra (class of 2028) with strong fundamentals in data structures, algorithms and object-oriented design.",
    "Most of my hands-on work is on the backend: building REST APIs with Node.js and TypeScript, integrating Stripe payments, and designing MongoDB aggregation pipelines. On the side I rebuild ML systems from first principles in Python to understand what the frameworks hide.",
    "I've solved 500+ problems across LeetCode and GeeksforGeeks, and I enjoy the same thing in engineering that I enjoy there: breaking a hard problem into pieces that are each obviously correct.",
  ],
  location: "Ranchi, India",
  email: "i.yogisharma5@gmail.com",
  githubUrl: "https://github.com/iyogisharma001",
  githubHandle: "iyogisharma001",
  linkedinUrl: "https://www.linkedin.com/in/yogesh-sharma-597466325/",
  resumeUrl: "/Yogesh_Resume.pdf",
  available: true,
  availability: "Available for Software Engineering Internships / Full-Time Roles",
} as const;

export const stats: Metric[] = [
  { value: "500+", label: "DSA problems solved" },
  { value: "98.11", label: "JEE Main percentile" },
  { value: "25+", label: "API routes shipped" },
  { value: "30+", label: "Students taught" },
];

export const skillCategories: SkillCategory[] = [
  "Languages",
  "Backend & Web",
  "Databases & Tools",
  "Core Fundamentals",
];

const skillMap: Record<SkillCategory, string[]> = {
  Languages: ["C++", "Python", "JavaScript", "TypeScript", "C", "SQL", "HTML5", "CSS3"],
  "Backend & Web": [
    "Node.js",
    "Express.js",
    "Next.js",
    "REST APIs",
    "Webhooks",
    "In-memory Caching",
  ],
  "Databases & Tools": ["MongoDB", "Firebase", "Stripe API", "Git", "GitHub Actions"],
  "Core Fundamentals": [
    "Data Structures & Algorithms",
    "Object-Oriented Programming",
    "Database Management Systems",
    "Operating Systems",
  ],
};

export const skills: Skill[] = skillCategories.flatMap((category) =>
  skillMap[category].map((name, order) => ({ name, category, order })),
);

export const projects: Project[] = [
  {
    slug: "ecommerce-backend-api",
    title: "E-Commerce Backend REST API",
    tagline: "A modular commerce backend with Stripe payments and role-based access.",
    description:
      "A RESTful backend covering the full commerce flow — inventory, cart lifecycle and transactions — built with Node.js, TypeScript and Express. Payments run through Stripe Payment Intents with webhook-driven status verification, and reporting is served by MongoDB aggregation pipelines.",
    category: "Backend",
    role: "Developer",
    techStack: ["Node.js", "Express.js", "TypeScript", "MongoDB", "Stripe", "Firebase"],
    highlights: [
      "Built and deployed a RESTful backend with 25+ modular routes for inventory, cart lifecycle and transaction handling.",
      "Integrated Stripe Payment Intents with webhook listeners for asynchronous payment-status verification.",
      "Secured endpoints using Firebase Admin role-based access control (RBAC) and CORS.",
      "Wrote multi-stage MongoDB aggregation pipelines ($facet, $group, $match) for sales reporting and inventory reconciliation.",
      "Added an in-memory caching layer (NodeCache) for frequently read catalog endpoints to cut repeated database reads.",
    ],
    metrics: [
      { value: "25+", label: "Modular routes" },
      { value: "Stripe", label: "Webhook-verified payments" },
      { value: "RBAC", label: "Firebase Admin auth" },
    ],
    githubUrl: "https://github.com/iyogisharma001",
    liveUrl: null,
    featured: true,
    order: 0,
  },
  {
    slug: "gpt-from-scratch",
    title: "Autograd Engine, BPE Tokenizer & GPT from Scratch",
    tagline: "A language model rebuilt from the chain rule up.",
    description:
      "A ground-up implementation of the modern language-model stack: a scalar reverse-mode automatic differentiation engine, hand-written backward passes, a Byte-Pair Encoding tokenizer and a decoder-only Transformer for autoregressive text generation.",
    category: "Machine Learning",
    role: "Developer",
    techStack: ["Python", "PyTorch", "NumPy", "Matplotlib", "Jupyter"],
    highlights: [
      "Implemented a scalar reverse-mode automatic differentiation engine from first principles using a dynamic computation graph (DAG) and topological sorting.",
      "Wrote manual backward passes for Multi-Layer Perceptrons and Batch Normalization without relying on PyTorch autograd.",
      "Built a decoder-only Transformer with multi-head self-attention for autoregressive text generation.",
      "Wrote a custom Byte-Pair Encoding (BPE) tokenizer to feed the model.",
    ],
    metrics: [
      { value: "Autograd", label: "Reverse-mode, DAG-based" },
      { value: "BPE", label: "Custom tokenizer" },
      { value: "GPT", label: "Decoder-only Transformer" },
    ],
    githubUrl: "https://github.com/iyogisharma001",
    liveUrl: null,
    featured: true,
    order: 1,
  },
  {
    slug: "developer-portfolio",
    title: "Developer Portfolio",
    tagline: "The site you're looking at — full-stack, typed end to end.",
    description:
      "This portfolio is a full-stack Next.js application. Content is served from PostgreSQL through Prisma, the contact form runs on a validated Server Action, and privacy-friendly analytics and project endorsements are stored without cookies or raw IP addresses.",
    category: "Full-Stack",
    role: "Developer",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Prisma", "PostgreSQL"],
    highlights: [
      "App Router with Server Actions for the contact form, analytics and endorsements.",
      "Shared Zod schema validates the contact form on the client (React Hook Form) and again on the server.",
      "Messages are persisted to PostgreSQL with per-visitor rate limiting and a honeypot spam trap.",
      "Content falls back to typed static data when the database is unreachable, so the page never breaks.",
    ],
    metrics: [
      { value: "Zod", label: "Client + server validation" },
      { value: "Prisma", label: "PostgreSQL data layer" },
      { value: "0", label: "Cookies or trackers" },
    ],
    githubUrl: "https://github.com/iyogisharma001",
    liveUrl: null,
    featured: false,
    order: 2,
  },
];

export const experience: TimelineEntry[] = [
  {
    title: "SDE Intern",
    organization: "Agripulse",
    period: "May 2026 – Jul 2026",
    location: "Remote",
    meta: "Internship",
    points: [
      "Integrated external LLM APIs with client-side rate limiting, error boundaries and health checks to handle upstream latency spikes and failed requests gracefully.",
      "Fixed real-time polling by adding teardown on component unmount, eliminating duplicate HTTP/socket requests and reducing redundant server load.",
      "Built client-side route guards and session-storage state persistence for smooth login-to-dashboard transitions without server-side session overhead.",
    ],
    tags: ["LLM APIs", "Rate limiting", "Error boundaries", "Route guards"],
  },
  {
    title: "International Coding / Maths Educator",
    organization: "JetLearn",
    period: "Jan 2026 – Apr 2026",
    location: "Remote",
    meta: "Part-time",
    points: [
      "Taught Python fundamentals and algorithmic problem-solving to 30+ students across the US and Canada.",
      "Contributed to coding and maths curriculum development while onboarding and mentoring 5+ new instructors.",
    ],
    tags: ["Python", "Teaching", "Mentoring", "Curriculum"],
  },
];

export const education: TimelineEntry[] = [
  {
    title: "B.Tech., Electronics and Communication Engineering",
    organization: "Birla Institute of Technology, Mesra",
    period: "2024 – 2028",
    location: "Ranchi",
    points: [],
  },
  {
    title: "Class XII",
    organization: "Navjeevan Science School, Sikar",
    period: "2022 – 2024",
    location: "Rajasthan",
    meta: "88.8%",
    points: [],
  },
  {
    title: "Class X",
    organization: "Tagore Public School, Pilani",
    period: "2021 – 2022",
    location: "Rajasthan",
    meta: "93.17%",
    points: [],
  },
];

export type Achievement = {
  title: string;
  detail: string;
  /** Optional profile link, e.g. a LeetCode or GeeksforGeeks handle. */
  links?: { label: string; href: string }[];
};

export const achievements: Achievement[] = [
  {
    title: "500+ algorithmic problems solved",
    detail:
      "Across LeetCode and GeeksforGeeks, with a focus on Trees, Graphs, Heaps and Dynamic Programming.",
    // Add your handles here to render profile links, e.g.
    // links: [{ label: "LeetCode", href: "https://leetcode.com/u/<handle>/" }],
  },
  {
    title: "JEE Main — 98.11 percentile",
    detail: "Ranked in the top 2% of candidates in India's national engineering entrance exam.",
  },
];

export const navLinks = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#education", label: "Education" },
  { href: "#contact", label: "Contact" },
] as const;

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
