// ─────────────────────────────────────────────────────────────
//  All portfolio content lives here. Edit this file to update
//  the site — no other code changes needed.
// ─────────────────────────────────────────────────────────────

export const profile = {
  name: "Sharad Singh Kushwaha",
  shortName: "Sharad",
  roles: [
    "Full-Stack Developer",
    "AI Engineer",
    "Startup Co-founder",
    "Problem Solver",
    "Content Creator",
  ],
  tagline:
    "I build AI-powered products end to end — from agentic backends and REST APIs to polished React front ends — and ship them fast.",
  location: "Gurgaon, Haryana, India",
  email: "sharadsingh0203@gmail.com",
  github: "https://github.com/absolutely-sharad",
  // Replace with your exact LinkedIn profile URL
  linkedin: "https://www.linkedin.com/search/results/all/?keywords=Sharad%20Singh%20Kushwaha",
  youtube: "https://www.youtube.com/@anshucricketstories",
  resume: "", // optional: link to a PDF résumé
  about: [
    "I'm a Computer Science undergrad at Polaris School of Technology (Starex University) with a 9.17 GPA, and I like turning ideas into working software quickly.",
    "I co-founded Infonix Cloud, where I built Gemini-powered support agents and automation used by 60+ client businesses. Today I work across full-stack web, AI agents (RAG, LangGraph), and backend systems — and I still make time for competitive programming and a cricket YouTube channel.",
  ],
};

export const stats = [
  { value: 500, suffix: "+", label: "LeetCode problems solved" },
  { value: 60, suffix: "+", label: "client businesses automated" },
  { value: 150, suffix: "+", label: "schools reached via Innov-a-thon" },
  { value: 9.17, suffix: "", label: "GPA out of 10", decimals: 2 },
];

export const experience = [
  {
    role: "Intern",
    org: "Classplus",
    period: "Oct 2025 — Present",
    points: [
      "Led on-ground execution of the Polaris Innov-a-thon across 150+ schools.",
      "Coordinated logistics, school outreach and student engagement at scale.",
    ],
    tags: ["Leadership", "Operations", "EdTech"],
  },
  {
    role: "Co-founder & Software Developer",
    org: "Infonix Cloud",
    link: "https://infonixcloud.com",
    period: "Mar 2026 — Aug 2026",
    points: [
      "Built an AI chatbot/agent on the Gemini API to automate customer support and lead qualification, cutting manual response time by ~30%.",
      "Built Python/NLP automation for booking, follow-ups and data entry across 60+ client businesses.",
      "Shipped full-stack, AI-integrated web and mobile apps as 2–4 week MVPs.",
    ],
    tags: ["Gemini API", "Python", "React", "Node.js", "Laravel", "Flutter"],
  },
  {
    role: "Full-Stack Developer Intern",
    org: "PGT Global Network",
    period: "Jul 2025 — Sep 2025",
    points: [
      "Built a full-stack web portal with secure auth and REST API integration via Supabase.",
      "Designed REST APIs, relational schemas and data models for profiles, blogs and user activity.",
    ],
    tags: ["React", "TypeScript", "Tailwind", "Supabase"],
  },
  {
    role: "B.Tech, Computer Science",
    org: "Polaris School of Technology · Starex University",
    period: "Aug 2023 — Present",
    points: ["GPA 9.17 / 10 overall · 6th semester CGPA 9.50."],
    tags: ["Education"],
  },
];

// color: planet hue in the 3D scene and accent on the card
export const projects = [
  {
    title: "AI Job-Hunt Copilot",
    kind: "RAG · Agentic AI",
    color: "#8b5cf6",
    description:
      "A multi-agent copilot that tailors résumés and cover letters and preps interviews by matching my own résumé and project data against any job description.",
    stack: ["LangChain", "LangGraph", "Pinecone", "Llama", "CI/CD"],
    featured: true,
  },
  {
    title: "NOVA — Team Productivity Platform",
    kind: "Full-Stack App",
    color: "#22d3ee",
    description:
      "\"Plan. Collaborate. Deliver.\" A project-management app where teams create projects, manage tasks, collaborate with members, comment on tasks and track progress.",
    stack: ["React", "Node.js", "REST API", "Auth", "Database"],
    featured: true,
  },
  {
    title: "Infonix AI Support Agent",
    kind: "Production AI",
    color: "#f472b6",
    description:
      "Gemini-powered agent handling customer support and lead qualification for real businesses — ~30% faster response times.",
    stack: ["Gemini API", "Python", "NLP", "Automation"],
    link: "https://infonixcloud.com",
    featured: true,
  },
  {
    title: "Dhaka Tesla Pool",
    kind: "Ride-pooling MVP",
    color: "#f59e0b",
    description:
      "End-to-end ride-pooling MVP with a Next.js front end, Node backend, database and Docker, managed with a release-branch Git workflow.",
    stack: ["Next.js", "Node.js", "Docker", "Git Flow"],
  },
  {
    title: "Job Portal API",
    kind: "Backend",
    color: "#34d399",
    description:
      "Candidate, Recruiter and Admin modules with JWT auth, role-based access control, search, filtering and pagination.",
    stack: ["Node.js", "Express", "MongoDB", "JWT", "bcrypt"],
  },
  {
    title: "Employee Management API",
    kind: "Backend",
    color: "#60a5fa",
    description:
      "REST API for organisations to register and manage employees with CRUD, search, department filters, validation and error handling.",
    stack: ["Node.js", "Express", "MongoDB", "Postman"],
  },
  {
    title: "Gemini Pro Chat",
    kind: "GenAI App",
    color: "#a78bfa",
    description:
      "Conversational chat application on Google's Gemini Pro with a clean Streamlit interface.",
    stack: ["Python", "Streamlit", "Gemini API", "GenAI SDK"],
  },
  {
    title: "Finance Tracker",
    kind: "Web App",
    color: "#fb7185",
    description:
      "Track income and expenses with visual dashboards and charts, backed by Supabase.",
    stack: ["React", "Node.js", "Supabase", "Recharts"],
  },
  {
    title: "Doctor Appointment App",
    kind: "Mobile App",
    color: "#2dd4bf",
    description:
      "Cross-platform mobile app for booking and managing doctor appointments.",
    stack: ["React Native", "Redux Toolkit", "Expo"],
  },
];

export const skills = [
  "JavaScript", "TypeScript", "Python", "React", "Next.js", "Node.js",
  "Express", "MongoDB", "PostgreSQL", "Supabase", "Tailwind", "Three.js",
  "LangChain", "LangGraph", "RAG", "Pinecone", "Gemini API", "LLMs",
  "React Native", "Flutter", "Laravel", "Docker", "Git", "REST APIs",
  "JWT", "DSA", "Streamlit", "Redux",
];

export const beyond = [
  {
    icon: "trophy",
    title: "Competitive Programming",
    text: "500+ LeetCode problems · Runner-up at college coding competition (FCPL) · Rank 1467 in CodeChef Starters 123.",
  },
  {
    icon: "play",
    title: "AnshuCricketStories",
    text: "I run a cricket YouTube channel focused on Shorts — scripting, editing and growing an audience.",
    link: "https://www.youtube.com/@anshucricketstories",
  },
  {
    icon: "spark",
    title: "AI Workshops for Schools",
    text: "Running an interactive AI workshop series for students in classes 6–12 — AI basics, tools, and the future of the field.",
  },
];
