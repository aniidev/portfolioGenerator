/**
 * Sample portfolio blueprints for the landing-page gallery.
 *
 * Each entry contains a `themeId` (key into THEME_PRESETS) and a full
 * `blueprint` matching the shape produced by /api/generatePortfolio.
 *
 * Keyed by slug — referenced from /portfolio?demo=<slug>.
 */

export const DEMO_BLUEPRINTS = {
  alex: {
    themeId: "futuristic_ai",
    blueprint: {
      persona: "AI Engineer",
      hero: {
        name: "Alex Chen",
        role: "Machine Learning Engineer",
        headline: "Shipping production-grade ML systems.",
        subheadline:
          "Building retrieval, training, and inference pipelines for LLM-powered products. Previously ML at a YC fintech and research at CMU LTI.",
        metrics: [
          { label: "Projects", value: 12 },
          { label: "Years", value: 4 },
          { label: "Papers", value: 3 },
        ],
      },
      about: {
        paragraph:
          "I work at the intersection of applied ML and systems engineering. My focus is on retrieval-augmented generation, vector databases, and the unglamorous infrastructure that makes models actually useful in production. I care about latency budgets, cost-per-query, and making sure the right answer comes back the first time.",
      },
      experience: [
        {
          company: "Forge AI",
          role: "ML Engineer",
          duration: "2024 — Present",
          bullets: [
            "Built the RAG pipeline serving 2M queries/day",
            "Cut p99 retrieval latency from 420ms to 78ms",
            "Owned eval harness across 4 model families",
          ],
        },
        {
          company: "Lumen Capital",
          role: "ML Intern",
          duration: "Summer 2023",
          bullets: [
            "Trained transformer model on 8B tokens of filings",
            "Productionized inference with vLLM + Triton",
          ],
        },
        {
          company: "CMU LTI",
          role: "Research Asst.",
          duration: "2022 — 2024",
          bullets: [
            "First-author at EMNLP 2024 on long-context retrieval",
            "Open-sourced eval suite with 300+ stars",
          ],
        },
      ],
      projects: [
        {
          title: "LLM-RAG Search",
          description:
            "End-to-end retrieval system over 50M docs with hybrid sparse-dense routing and learned re-ranking.",
          tags: ["PyTorch", "FAISS", "Triton"],
        },
        {
          title: "Vision Diff Tool",
          description:
            "Pixel-aware UI regression detector using CLIP embeddings — used in CI for two design systems.",
          tags: ["CLIP", "ONNX", "Vercel"],
        },
        {
          title: "Vector DB Bench",
          description:
            "Open-source benchmark across pgvector, Qdrant, Milvus, Weaviate. 1.2k GitHub stars.",
          tags: ["Go", "Docker", "k6"],
        },
      ],
      skills: ["PyTorch", "JAX", "CUDA", "Triton", "Ray", "vLLM", "FAISS", "Python", "Go", "Kubernetes"],
      education: [
        {
          school: "Carnegie Mellon University",
          degree: "MS, Language Technologies",
          duration: "2022 — 2024",
          achievements: ["GPA 3.95", "Dean's Honor List", "EMNLP 2024 paper"],
        },
        {
          school: "UC Berkeley",
          degree: "BS, Computer Science",
          duration: "2018 — 2022",
          achievements: ["CS Honors", "AI4ALL Fellow"],
        },
      ],
      contact: { email: "alex@alex-chen.dev", github: "alexchen", linkedin: "alexchen-ml" },
    },
  },

  maya: {
    themeId: "modern_minimalist",
    blueprint: {
      persona: "Student Researcher",
      hero: {
        name: "Maya Rodriguez",
        role: "Product Designer",
        headline: "Editorial design for software products.",
        subheadline:
          "I design quiet interfaces for loud problems — design systems, brand identity, and the small details that make products feel resolved.",
        metrics: [
          { label: "Brands", value: 30 },
          { label: "Years", value: 6 },
          { label: "Awards", value: 4 },
        ],
      },
      about: {
        paragraph:
          "I've spent the last six years designing for early-stage startups and editorial publications. My work has shipped on Mailchimp, Substack, and three Y Combinator companies. I treat type as the foundation, not the finish.",
      },
      experience: [
        {
          company: "Independent",
          role: "Design Lead, Contract",
          duration: "2023 — Present",
          bullets: [
            "Lead design for two YC seed-stage startups",
            "Built Lumen — a Figma-native design system used by 40+ teams",
          ],
        },
        {
          company: "Mailchimp",
          role: "Senior Product Designer",
          duration: "2020 — 2023",
          bullets: [
            "Owned the email composer redesign (used by 13M senders)",
            "Shipped a typographic refresh that lifted CTR by 9%",
          ],
        },
        {
          company: "Pentagram",
          role: "Junior Designer",
          duration: "2018 — 2020",
          bullets: [
            "Identity work for arts and cultural institutions",
            "AIGA Fresh 2019 honoree",
          ],
        },
      ],
      projects: [
        {
          title: "Acme Rebrand",
          description:
            "Identity, type system, and motion language for a Series B fintech. Rolled out across 14 surfaces.",
          tags: ["Identity", "Motion", "Type"],
        },
        {
          title: "Lumen Design System",
          description:
            "Figma-native system with 280 components and a Storybook bridge. Adopted by 40+ teams.",
          tags: ["Figma", "Storybook", "Tokens"],
        },
        {
          title: "Editorial App",
          description:
            "Long-form reading experience with custom OpenType features and a generative cover system.",
          tags: ["Webflow", "GSAP", "Type"],
        },
      ],
      skills: ["Figma", "Webflow", "Framer", "After Effects", "GSAP", "Type design", "Brand systems", "Prototyping"],
      education: [
        {
          school: "Maryland Institute College of Art",
          degree: "BFA, Graphic Design",
          duration: "2014 — 2018",
          achievements: ["Honors", "Type@Cooper alum"],
        },
      ],
      contact: { email: "hello@maya.design", github: "mayard", linkedin: "maya-rodriguez" },
    },
  },

  jordan: {
    themeId: "sleek_engineer",
    blueprint: {
      persona: "Software Engineer",
      hero: {
        name: "Jordan Kim",
        role: "Full-stack Engineer",
        headline: "I build infrastructure that doesn't get in the way.",
        subheadline:
          "Backend-leaning generalist. Comfortable from the metal up — Go, TypeScript, Postgres, and the boring discipline of running things in production.",
        metrics: [
          { label: "Repos", value: 20 },
          { label: "Years", value: 5 },
          { label: "Stars", value: 3400 },
        ],
      },
      about: {
        paragraph:
          "I'm happiest in the unglamorous middle of the stack — designing schemas, picking the right cache, and shaving milliseconds off the request path. I've shipped infrastructure for two early-stage startups and one mid-size SaaS, and open-sourced the parts that should never be rebuilt twice.",
      },
      experience: [
        {
          company: "Linear",
          role: "Software Engineer",
          duration: "2023 — Present",
          bullets: [
            "Owned the realtime sync backbone serving 100k+ workspaces",
            "Cut sync round-trip from 180ms to 45ms",
          ],
        },
        {
          company: "Vercel",
          role: "Backend Engineer",
          duration: "2021 — 2023",
          bullets: [
            "Built the edge KV cache layer",
            "On-call rotation for the build pipeline (99.98% uptime)",
          ],
        },
        {
          company: "MIT CSAIL",
          role: "Research Software",
          duration: "2020 — 2021",
          bullets: ["Distributed systems work on byzantine consensus"],
        },
      ],
      projects: [
        {
          title: "Edge KV Cache",
          description:
            "Sub-10ms read-through cache layer with consistent hashing and per-region invalidation.",
          tags: ["Go", "Redis", "WASM"],
        },
        {
          title: "OAuth Gateway",
          description:
            "Drop-in OIDC gateway with row-level multi-tenancy. Used by 12 internal services.",
          tags: ["TypeScript", "Postgres", "k8s"],
        },
        {
          title: "Realtime Canvas",
          description:
            "CRDT-backed multiplayer drawing surface, ported the same primitives now used in Linear.",
          tags: ["Yjs", "WebSocket", "Canvas"],
        },
      ],
      skills: ["TypeScript", "Go", "Rust", "Postgres", "Redis", "Kubernetes", "Terraform", "gRPC", "React"],
      education: [
        {
          school: "MIT",
          degree: "BS, Computer Science",
          duration: "2017 — 2021",
          achievements: ["Phi Beta Kappa", "GPA 4.8/5.0"],
        },
      ],
      contact: { email: "jordan@jordankim.io", github: "jordankim", linkedin: "jordan-kim" },
    },
  },

  sam: {
    themeId: "quant_terminal",
    blueprint: {
      persona: "Quant Developer",
      hero: {
        name: "Sam Patel",
        role: "Senior DevOps Engineer",
        headline: "Infrastructure as code, observability as default.",
        subheadline:
          "I build the platforms other engineers stand on — multi-region Kubernetes, Terraform module libraries, and the OpenTelemetry plumbing that catches things before users do.",
        metrics: [
          { label: "Uptime %", value: 99 },
          { label: "Years", value: 8 },
          { label: "Clusters", value: 14 },
        ],
      },
      about: {
        paragraph:
          "Eight years across DevOps and SRE roles at fintech and infra startups. I treat reliability as a product feature. Most of my work is invisible by design — until one day someone notices the dashboards never went red.",
      },
      experience: [
        {
          company: "Stripe",
          role: "Staff SRE",
          duration: "2022 — Present",
          bullets: [
            "Owned the multi-region failover runbook",
            "Drove p99 uptime from 99.94% → 99.99% across two services",
          ],
        },
        {
          company: "HashiCorp",
          role: "Solutions Engineer",
          duration: "2019 — 2022",
          bullets: [
            "Built the public Terraform module library (4.5k+ stars)",
            "Spoke at HashiConf 2021",
          ],
        },
        {
          company: "Bridgewater",
          role: "Platform Engineer",
          duration: "2016 — 2019",
          bullets: [
            "Containerized the legacy quant pipeline",
            "Reduced compute spend 38% in 9 months",
          ],
        },
      ],
      projects: [
        {
          title: "Terraform Module Lib",
          description:
            "Production-grade module library with 40+ providers covered. 4.5k stars.",
          tags: ["Terraform", "AWS", "GCP"],
        },
        {
          title: "CI Cache Layer",
          description:
            "Distributed Bazel cache reducing CI runtimes by 6× across two monorepos.",
          tags: ["Bazel", "Go", "S3"],
        },
        {
          title: "Otel Pipeline",
          description:
            "End-to-end OpenTelemetry collector + storage stack with cardinality controls.",
          tags: ["OTel", "Prom", "Grafana"],
        },
      ],
      skills: ["Terraform", "Kubernetes", "Docker", "AWS", "GCP", "Prometheus", "Grafana", "Go", "Bash", "Helm"],
      education: [
        {
          school: "Georgia Tech",
          degree: "BS, Computer Engineering",
          duration: "2012 — 2016",
          achievements: ["Cum Laude", "ACM Programming Team"],
        },
      ],
      contact: { email: "sam@samp.sh", github: "samp", linkedin: "sam-patel-sre" },
    },
  },
};
