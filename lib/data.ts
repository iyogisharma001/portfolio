/**
 * Single source of truth for portfolio content.
 *
 * Project write-ups are taken from each repository's README on GitHub
 * (github.com/iyogisharma001). Live repository details (language, last push,
 * stars) are merged in at runtime by `lib/github.ts`.
 *
 * - `prisma/seed.ts` writes projects, skills and the profile into PostgreSQL.
 * - `lib/queries.ts` reads them back, and falls back to these values when the
 *   database is unreachable, so the site always renders.
 */

export type Metric = { label: string; value: string };
export type Link = { label: string; href: string };

export type ProjectCategory = "Full-Stack" | "Backend" | "AI" | "Data" | "ML";

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
  /** Repository name under the GitHub account, for live stats. */
  repo: string | null;
  /** Cover screenshot under /public. */
  image: string | null;
  /** Extra screenshots for the detail view. */
  gallery: string[];
  /** Additional links such as a second repository. */
  links: Link[];
  featured: boolean;
  order: number;
};

export type SkillCategory =
  | "Languages"
  | "Frontend"
  | "Backend"
  | "Data & Infrastructure"
  | "AI & ML"
  | "Fundamentals";

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

const GITHUB = "https://github.com/iyogisharma001";

export const profile = {
  name: "Yogesh Sharma",
  firstName: "Yogesh",
  initials: "YS",
  headline: "Software Engineer",
  intro:
    "I'm a pre-final year ECE student at BIT Mesra who builds backend-heavy products end to end: a live e-commerce store with Stripe payments, a voice-driven AI interview platform with a Docker code sandbox, and a ticket booking engine designed for flash-sale traffic.",
  bio: [
    "I study Electronics and Communication Engineering at BIT Mesra (class of 2028). Most of what I build sits on the server side: payment flows that can't double-charge, seat holds that survive a flash sale, and sandboxes that run untrusted code safely.",
    "I like projects that force me to think about failure: what happens when a webhook arrives twice, when Redis goes down, or when an LLM call times out halfway through a sentence. My READMEs say what works, what doesn't yet, and why.",
    "Outside of code I compete in athletics and strength sports. Training for a 400m and grinding DSA problems turn out to need the same habit: show up every day and measure honestly.",
  ],
  location: "Ranchi, India",
  timezone: "Asia/Kolkata",
  email: "i.yogisharma5@gmail.com",
  githubUrl: GITHUB,
  githubHandle: "iyogisharma001",
  linkedinUrl: "https://www.linkedin.com/in/yogesh-sharma-597466325/",
  leetcodeUrl: "https://leetcode.com/u/CodeZenith01/",
  leetcodeHandle: "CodeZenith01",
  resumeUrl: "/Yogesh_Resume.pdf",
  /** Optional portrait under /public. Leave null to show initials. */
  photo: null as string | null,
  available: true,
  availability: "Open to SDE internships and full-time roles",
};

export const skillCategories: SkillCategory[] = [
  "Languages",
  "Frontend",
  "Backend",
  "Data & Infrastructure",
  "AI & ML",
  "Fundamentals",
];

const skillMap: Record<SkillCategory, string[]> = {
  Languages: ["C++", "Python", "TypeScript", "JavaScript", "C", "SQL"],
  Frontend: ["React", "Next.js", "Redux Toolkit", "Tailwind CSS", "SCSS"],
  Backend: ["Node.js", "Express", "FastAPI", "Socket.io", "BullMQ", "REST & Webhooks"],
  "Data & Infrastructure": [
    "PostgreSQL",
    "MongoDB",
    "MySQL",
    "Redis",
    "RabbitMQ",
    "Docker",
    "GitHub Actions",
  ],
  "AI & ML": ["PyTorch", "NumPy", "LangGraph", "Tree-sitter", "LLM APIs"],
  Fundamentals: ["Data Structures & Algorithms", "OOP", "DBMS", "Operating Systems"],
};

export const skills: Skill[] = skillCategories.flatMap((category) =>
  skillMap[category].map((name, order) => ({ name, category, order })),
);

export const projects: Project[] = [
  {
    slug: "shopsphere",
    title: "ShopSphere",
    tagline: "A full-stack e-commerce store with Stripe payments, Google sign-in and an admin analytics dashboard.",
    description:
      "An online store for gadgets and accessories, split into a React + TypeScript storefront on Vercel and an Express API on Render. Customers browse and filter products, pay with Stripe Elements and track orders; admins get sales analytics and product, order, customer and coupon management. The backend is built so the client can never set a price or create an order without a verified payment.",
    category: "Full-Stack",
    role: "Solo developer",
    techStack: ["React", "TypeScript", "Redux Toolkit", "Node.js", "Express", "MongoDB", "Redis", "Stripe", "Firebase Auth", "Docker"],
    highlights: [
      "The server sets every price: the client sends only product IDs and quantities, and totals, tax, shipping and coupons are computed in one tested function.",
      "Exactly one order per payment: orders come from the client and from a signed Stripe webhook, made race-safe with a unique index on the PaymentIntent.",
      "Atomic stock decrements with a stock >= quantity guard, so two buyers can't both take the last unit.",
      "Redis read-through cache with targeted invalidation on every write.",
      "Helmet headers, per-IP rate limits, ReDoS-safe search and Vitest unit tests, all checked in GitHub Actions CI.",
    ],
    metrics: [
      { value: "Live", label: "Vercel + Render" },
      { value: "7", label: "Merged pull requests" },
      { value: "CI", label: "Type-check, test, Docker build" },
    ],
    githubUrl: `${GITHUB}/mern-ecommerce-frontend`,
    liveUrl: "https://mern-ecommerce-frontend-eight-psi.vercel.app",
    repo: "mern-ecommerce-frontend",
    image: "/projects/shopsphere.webp",
    gallery: ["/projects/shopsphere-shop.webp", "/projects/shopsphere-product.webp"],
    links: [{ label: "Backend API", href: `${GITHUB}/mern-ecommerce-backend` }],
    featured: true,
    order: 0,
  },
  {
    slug: "whiteboard",
    title: "Whiteboard",
    tagline: "A voice-driven AI mock interview platform that watches your code and runs it in a sandbox.",
    description:
      "A live technical interview: the candidate solves a problem in a Monaco editor while an AI interviewer listens, watches the code as it is typed, interrupts when the approach is asymptotically too slow, runs the code in a locked-down Docker container and writes a feedback report in the background.",
    category: "AI",
    role: "Solo developer",
    techStack: ["React", "Monaco", "Socket.io", "Node.js", "Express", "MongoDB", "Redis", "BullMQ", "Docker", "Gemini"],
    highlights: [
      "Static complexity analysis is a cheap gate before any LLM call: the model is only asked for a verdict when the code looks slower than the problem's target.",
      "Streaming speech: the interviewer starts talking as soon as the first sentence is generated, and stops mid-sentence if the candidate barges in.",
      "Every run gets a fresh container: 128 MB, half a CPU, no network, read-only filesystem, 5 second hard kill.",
      "1,137 problems across 26 topics, with hidden test suites computed from reference solutions so tests can't drift from the answer key.",
      "Falls back to a rule-based interviewer when the model is rate-limited, so a session never goes silent.",
    ],
    metrics: [
      { value: "1,137", label: "Interview problems" },
      { value: "3", label: "Languages: Python, JS, C++" },
      { value: "5 s", label: "Sandbox kill limit" },
    ],
    githubUrl: `${GITHUB}/ai-mock-interview-platform`,
    liveUrl: "https://ai-mock-interview-platform-neon.vercel.app",
    repo: "ai-mock-interview-platform",
    image: "/projects/whiteboard.webp",
    gallery: [],
    links: [],
    featured: true,
    order: 1,
  },
  {
    slug: "swe-sentinel",
    title: "SWE-Sentinel",
    tagline: "A pull-request assistant that writes tests for a change and proves them against base and head.",
    description:
      "A Python service and CLI that reviews pull requests. It builds context from changed code with Tree-sitter, asks a language model to propose focused tests, and runs them in a network-disabled Docker sandbox against both revisions. A generated test only counts as evidence if it fails on base and passes on head.",
    category: "AI",
    role: "Solo developer",
    techStack: ["Python", "FastAPI", "LangGraph", "Tree-sitter", "Docker", "Ollama", "GitHub Webhooks"],
    highlights: [
      "Generated tests run on both the PR head and base; only a fail-on-base, pass-on-head result is reported as regression evidence.",
      "LangGraph analyst and test-synthesis loop with bounded repair attempts.",
      "Webhooks are verified with HMAC-SHA256 and constant-time comparison; GitHub writes are off by default.",
      "Reports evidence rather than verdicts: any proposed patch stays behind an explicit human review step, and there is no merge operation.",
      "45 passing tests, linted with Ruff.",
    ],
    metrics: [
      { value: "45", label: "Passing tests" },
      { value: "Off", label: "Sandbox network" },
      { value: "0", label: "Writes by default" },
    ],
    githubUrl: `${GITHUB}/SWE-Sentinel`,
    liveUrl: null,
    repo: "SWE-Sentinel",
    image: "/projects/swe-sentinel.webp",
    gallery: [],
    links: [{ label: "Demo PR", href: `${GITHUB}/sentinel-demo/pull/1` }],
    featured: true,
    order: 2,
  },
  {
    slug: "seatline",
    title: "Seatline",
    tagline: "A high-concurrency ticket booking engine with seat holds, a flash-sale waiting room and idempotent payments.",
    description:
      "A runnable booking backend that models the hard parts of ticketing: short-lived seat holds, a FIFO waiting room for flash sales, idempotent payments with compensation, and booking events delivered through a transactional outbox. It ships with a web front end and runs with one docker compose command.",
    category: "Backend",
    role: "Solo developer",
    techStack: ["Node.js", "TypeScript", "Express", "PostgreSQL", "Redis", "RabbitMQ", "Docker", "Stripe"],
    highlights: [
      "Redis Lua scripts acquire every requested seat atomically, with TTLs that clear abandoned holds.",
      "PostgreSQL stays authoritative: row locks plus version-checked updates, and a database-only fallback if Redis is down.",
      "Payments are keyed by an Idempotency-Key; a failed or late payment releases seats or triggers a refund.",
      "Booking changes and events commit together to an outbox, published to durable RabbitMQ queues.",
      "FIFO waiting room on a Redis sorted set, plus per-user and per-IP rate limits.",
    ],
    metrics: [
      { value: "16", label: "API endpoints" },
      { value: "5 min", label: "Seat hold TTL" },
      { value: "1 cmd", label: "docker compose up" },
    ],
    githubUrl: `${GITHUB}/ticket-booking-engine`,
    liveUrl: null,
    repo: "ticket-booking-engine",
    image: "/projects/seatline.webp",
    gallery: [],
    links: [],
    featured: true,
    order: 3,
  },
  {
    slug: "bank-churn-analysis",
    title: "Bank Customer Churn Analysis",
    tagline: "Which customers a bank is losing, where the money goes, and what retention is worth.",
    description:
      "A SQL and Excel analysis of 10,000 customers of a European bank that was losing 20.4% of its customers and 24.3% of all balances. It finds the segments driving churn and turns them into a retention priority list.",
    category: "Data",
    role: "Analyst",
    techStack: ["MySQL", "SQL", "Excel", "Power Query"],
    highlights: [
      "Germany churns at 32.4% against 16–17% elsewhere, and accounts for 53% of the balance lost.",
      "Customers aged 40–59 are 35% of the base but 63.5% of churners.",
      "11 queries using CTEs, conditional aggregation and window functions (RANK, NTILE, LAG, running totals).",
      "Excel dashboard reconciled against SQL (31 of 31 figures match) with a 150-customer retention list.",
    ],
    metrics: [
      { value: "10,000", label: "Customers analysed" },
      { value: "20.4%", label: "Churn rate found" },
      { value: "31/31", label: "SQL ↔ Excel checks" },
    ],
    githubUrl: `${GITHUB}/bank-customer-churn-analysis`,
    liveUrl: null,
    repo: "bank-customer-churn-analysis",
    image: "/projects/churn-dashboard.webp",
    gallery: [],
    links: [],
    featured: false,
    order: 4,
  },
  {
    slug: "gpt-from-scratch",
    title: "Autograd Engine & GPT from Scratch",
    tagline: "A language model rebuilt from the chain rule up.",
    description:
      "A ground-up implementation of the modern language-model stack: a scalar reverse-mode automatic differentiation engine, hand-written backward passes, a Byte-Pair Encoding tokenizer and a decoder-only Transformer for autoregressive text generation.",
    category: "ML",
    role: "Solo developer",
    techStack: ["Python", "PyTorch", "NumPy", "Matplotlib", "Jupyter"],
    highlights: [
      "Scalar reverse-mode autodiff over a dynamic computation graph with topological sorting.",
      "Manual backward passes for MLPs and Batch Normalization, without PyTorch autograd.",
      "Decoder-only Transformer with multi-head self-attention and a custom BPE tokenizer.",
    ],
    metrics: [],
    githubUrl: null,
    liveUrl: null,
    repo: null,
    image: null,
    gallery: [],
    links: [],
    featured: false,
    order: 5,
  },
];

export const experience: TimelineEntry[] = [
  {
    title: "SDE Intern",
    organization: "Agripulse",
    period: "May – Jul 2026",
    location: "Remote",
    meta: "Internship",
    points: [
      "Integrated external LLM APIs with client-side rate limiting, error boundaries and health checks to handle upstream latency spikes and failed requests gracefully.",
      "Fixed real-time polling by adding teardown on component unmount, eliminating duplicate HTTP/socket requests and reducing redundant server load.",
      "Built client-side route guards and session-storage state persistence for smooth login-to-dashboard transitions without server-side session overhead.",
    ],
    tags: ["LLM APIs", "React", "Rate limiting"],
  },
  {
    title: "Coding & Maths Educator",
    organization: "JetLearn",
    period: "Jan – Apr 2026",
    location: "Remote",
    meta: "Part-time",
    points: [
      "Taught Python fundamentals and algorithmic problem-solving to 30+ students across the US and Canada.",
      "Contributed to curriculum development and onboarded and mentored 5+ new instructors.",
    ],
    tags: ["Python", "Teaching", "Mentoring"],
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

export type Achievement = { title: string; detail: string; href?: string };

export const achievements: Achievement[] = [
  {
    title: "500+ problems solved",
    detail: "Across LeetCode and GeeksforGeeks, focused on trees, graphs, heaps and DP.",
    href: profile.leetcodeUrl,
  },
  {
    title: "JEE Main — 98.11 percentile",
    detail: "India's national engineering entrance exam.",
  },
];

export const athletics: Achievement[] = [
  { title: "Gold — Arm Wrestling", detail: "BIT Mesra Campus Championship" },
  { title: "Gold — 400m", detail: "BIT Mesra Annual Athletic Meet" },
  { title: "Wrestling", detail: "State-level competitor" },
  { title: "Kabaddi", detail: "District-level competitor" },
];

export const navLinks = [
  { href: "#work", label: "Work" },
  { href: "#experience", label: "Experience" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
] as const;

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
