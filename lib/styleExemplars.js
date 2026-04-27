// 12 high-quality portfolio writing samples — 3 per category.
// These set the tone and quality bar for section text generation.
// Design vocabulary is baked into the language so the LLM mirrors it.
const RAW_EXEMPLARS = [

  // ── ABOUT ────────────────────────────────────────────────────────────────
  {
    id: 'about-1',
    category: 'about',
    content: `Full-stack engineer specializing in high-throughput distributed systems and developer-facing products. Three years shipping production code across the full lifecycle — from zero-to-one greenfield builds to scaling systems past 10 million daily active users. Known for writing code that reads as clearly as prose, and for making architectural decisions that hold up a year later.`,
  },
  {
    id: 'about-2',
    category: 'about',
    content: `Machine learning engineer who closes the gap between research and production. Expertise in large language models, computer vision pipelines, and on-device inference — with a track record of taking models from Jupyter notebooks to systems serving real users at scale. Equally comfortable reading a paper on attention mechanisms and shipping a FastAPI endpoint by end of sprint.`,
  },
  {
    id: 'about-3',
    category: 'about',
    content: `Product-minded software engineer with a sharp instinct for what matters. Background spanning early-stage startups and large engineering orgs — the kind of engineer who can scope a project, execute it end-to-end, and ship something users actually love. Core stack is TypeScript and Python, but the real skill is knowing which tool solves the problem fastest without creating tomorrow's headache.`,
  },

  // ── EXPERIENCE ───────────────────────────────────────────────────────────
  {
    id: 'exp-1',
    category: 'experience',
    content: `Software Engineering Intern — Stripe · Summer 2024
Embedded on the Payments Reliability team. Built a real-time anomaly detection service that flagged fraudulent transaction patterns 340ms faster than the previous rule-based system, protecting an estimated $2.3M in monthly merchant revenue. Wrote the service in Go, integrated it with Kafka, and shipped it to production with full observability (Datadog dashboards + PagerDuty alerts) before the internship ended.`,
  },
  {
    id: 'exp-2',
    category: 'experience',
    content: `Senior Software Engineer — Linear · 2022–2024
Technical lead on the real-time sync infrastructure that powers Linear's collaborative editing. Rearchitected the WebSocket layer to handle 3× the connection volume with 40% lower p99 latency. Drove the migration from a custom CRDT implementation to Yjs, cutting sync-related bug reports by 70% and saving the team roughly 8 hours of on-call per week. Mentored three engineers from mid to senior level.`,
  },
  {
    id: 'exp-3',
    category: 'experience',
    content: `ML Research Engineer — Hugging Face · 2023–Present
Contributing to the open-source transformers library and leading internal research on inference optimization for large language models. Implemented a speculative decoding approach that achieves 2.4× throughput on LLaMA-class models without accuracy regression. Work has been merged into the main library and is now used by over 50,000 developers via the Hub. Co-authored two papers currently under review at ICML.`,
  },

  // ── PROJECTS ─────────────────────────────────────────────────────────────
  {
    id: 'proj-1',
    category: 'projects',
    content: `Patchwork — AI Code Review Agent
GitHub App that automatically reviews every pull request using a fine-tuned GPT-4 model — catching security vulnerabilities, suggesting refactors, and explaining complex diffs in plain English. Launched publicly in March 2024; reached 500 active repositories and 15,000 PRs reviewed in the first 60 days. Stack: TypeScript, Next.js, Octokit, Supabase, OpenAI API. Open source. 1.2K GitHub stars.`,
  },
  {
    id: 'proj-2',
    category: 'projects',
    content: `Meridian — Real-Time Urban Mobility Dashboard
End-to-end data platform tracking 8,000+ city vehicles across transit, rideshare, and micro-mobility in real time. Ingests 80K GPS events per second through a Kafka pipeline, stores in TimescaleDB, and renders live on a Mapbox GL canvas with sub-200ms refresh. Reduced city dispatch response time by 28% in a six-month pilot with the City of Austin. Stack: React, Rust (ingestion), Kafka, TimescaleDB, Redis, Mapbox GL.`,
  },
  {
    id: 'proj-3',
    category: 'projects',
    content: `Silhouette — On-Device Fashion Try-On
iOS app that uses a custom-trained diffusion model to let users virtually try on clothing from any product photo. Model runs fully on-device using CoreML — no server round-trip, no privacy leakage. Achieves photorealistic results in 1.8 seconds on an iPhone 14. Training dataset: 200K curated clothing + body pose pairs. Featured on the App Store front page at launch; 40K downloads in first week.`,
  },

  // ── SKILLS ───────────────────────────────────────────────────────────────
  {
    id: 'skills-1',
    category: 'skills',
    content: `Languages: TypeScript, Python, Go, Rust, SQL
Frontend: React, Next.js, Tailwind CSS, Framer Motion, WebGL
Backend: Node.js, FastAPI, gRPC, GraphQL, REST
Infrastructure: AWS (ECS, Lambda, RDS, S3, CloudFront), Docker, Kubernetes, Terraform, GitHub Actions
Databases: PostgreSQL, Redis, DynamoDB, ClickHouse, Pinecone
ML / AI: PyTorch, HuggingFace Transformers, LangChain, ONNX Runtime, OpenAI & Anthropic APIs`,
  },
  {
    id: 'skills-2',
    category: 'skills',
    content: `Data Engineering: Apache Spark, Kafka, Flink, dbt, Airflow, Iceberg
ML Stack: PyTorch, JAX, scikit-learn, XGBoost, Weights & Biases, MLflow
Serving: TorchServe, Triton Inference Server, BentoML, vLLM
Cloud: GCP (BigQuery, Vertex AI, Cloud Run, Pub/Sub), AWS SageMaker
Languages: Python, Scala, SQL, Bash
Observability: Datadog, OpenTelemetry, Prometheus, Grafana`,
  },
  {
    id: 'skills-3',
    category: 'skills',
    content: `Core Languages: JavaScript / TypeScript, Python, Swift
UI Frameworks: React, Vue 3, SwiftUI, React Native
Styling: Tailwind CSS, CSS-in-JS (styled-components), Framer Motion, GSAP
Testing: Vitest, Playwright, Cypress, XCTest
Tooling: Vite, Turbopack, ESBuild, Storybook, Figma
Backend & APIs: Supabase, Firebase, Prisma, tRPC, Stripe SDK`,
  },
];

// Category mapping for section → exemplar retrieval
const CATEGORY_MAP = {
  about:      'about',
  experience: 'experience',
  projects:   'projects',
  skills:     'skills',
  education:  'about',
};

/**
 * Returns up to `k` exemplars for the given portfolio section.
 * Category-filtered — exemplars are hand-curated per section so
 * semantic re-ranking adds no benefit.
 */
export function retrieveStyleExemplars(section, k = 2) {
  const category = CATEGORY_MAP[section] || 'about';
  return RAW_EXEMPLARS.filter(e => e.category === category).slice(0, k);
}
