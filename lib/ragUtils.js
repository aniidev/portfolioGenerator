// Cached model reference across requests (Next.js Node.js process stays alive in dev)
async function getEmbeddingModel() {
  if (globalThis.__ragEmbeddingModel) return globalThis.__ragEmbeddingModel;

  // Dynamic import handles the ESM-only internals of @xenova/transformers
  const { pipeline, env } = await import('@xenova/transformers');

  // Run entirely in Node.js — no browser WASM fallback needed
  env.backends.onnx.wasm.numThreads = 1;

  globalThis.__ragEmbeddingModel = await pipeline(
    'feature-extraction',
    'Xenova/all-MiniLM-L6-v2'
  );

  return globalThis.__ragEmbeddingModel;
}

/**
 * Embeds `text` into a float32 vector using all-MiniLM-L6-v2.
 * Returns a plain JS number[].
 */
export async function generateEmbedding(text) {
  const model = await getEmbeddingModel();
  const output = await model(text, { pooling: 'mean', normalize: true });
  return Array.from(output.data);
}

/**
 * Scores a text chunk 0–1 based on signals that indicate high-value resume content.
 */
export function computeImportanceScore(text) {
  const lc = text.toLowerCase();
  let score = 0;

  // Quantified metrics: "40%", "$200K", "3x", "10K+"
  const metrics = (text.match(/\d+%|\$[\d,]+|\d+[xX]|\b\d+[KkMmBb]\b|\d+\+/g) || []).length;
  score += Math.min(metrics * 0.08, 0.25);

  // Strong action verbs associated with high-impact work
  const actionVerbs = [
    'built', 'engineered', 'led', 'launched', 'optimized', 'designed',
    'developed', 'deployed', 'scaled', 'shipped', 'spearheaded', 'architected',
    'founded', 'drove', 'created', 'implemented', 'managed', 'automated',
    'reduced', 'increased', 'improved', 'delivered',
  ];
  score += Math.min(actionVerbs.filter(v => lc.includes(v)).length * 0.04, 0.2);

  // Technical depth signals
  const techTerms = [
    'api', 'machine learning', 'ml', 'ai', 'cloud', 'aws', 'gcp', 'azure',
    'docker', 'kubernetes', 'microservice', 'distributed', 'neural', 'model',
    'database', 'sql', 'nosql', 'react', 'python', 'typescript', 'golang',
    'rust', 'llm', 'transformer', 'pipeline',
  ];
  score += Math.min(techTerms.filter(t => lc.includes(t)).length * 0.025, 0.15);

  // Prestige / selectivity signals
  const prestigeTerms = [
    'internship', 'research', 'award', 'scholarship', 'fellowship',
    'publication', 'patent', 'winner', 'first place', 'honors', 'dean',
    'selected', 'accepted', 'competitive', 'funded',
  ];
  score += Math.min(prestigeTerms.filter(p => lc.includes(p)).length * 0.08, 0.25);

  // Content length bonus — longer entries usually contain more detail
  if (text.length > 150) score += 0.05;
  if (text.length > 300) score += 0.05;
  if (text.length > 500) score += 0.05;

  return Math.min(score, 1.0);
}

/**
 * Converts a structured resume object into semantic chunks.
 * Each chunk is ONE meaningful career unit (one job, one project, etc.).
 * Returns chunks without embeddings — call attachEmbeddings() next.
 */
export function buildSemanticChunks(structuredResume) {
  const chunks = [];
  let id = 0;

  const push = (type, lines, fixedScore = null) => {
    const content = lines.filter(Boolean).join('\n').trim();
    if (!content) return;
    chunks.push({
      id: id++,
      type,
      content,
      importanceScore: fixedScore ?? computeImportanceScore(content),
      embedding: null,
    });
  };

  // Personal identity — always high value for About section retrieval
  const p = structuredResume.personal || {};
  push('personal', [
    p.name     && `Name: ${p.name}`,
    p.title    && `Title: ${p.title}`,
    p.email    && `Email: ${p.email}`,
    p.phone    && `Phone: ${p.phone}`,
    p.location && `Location: ${p.location}`,
    p.summary  && `Summary: ${p.summary}`,
  ], 0.8);

  // One chunk per job (preserves context for each role)
  for (const exp of (structuredResume.experiences || [])) {
    push('experience', [
      exp.title       && `Role: ${exp.title}`,
      exp.company     && `Company: ${exp.company}`,
      exp.duration    && `Duration: ${exp.duration}`,
      exp.description && `Description: ${exp.description}`,
      exp.impact      && `Impact: ${exp.impact}`,
    ]);
  }

  // One chunk per project
  for (const proj of (structuredResume.projects || [])) {
    push('project', [
      proj.title       && `Project: ${proj.title}`,
      proj.tech        && `Technologies: ${proj.tech}`,
      proj.description && `Description: ${proj.description}`,
      proj.impact      && `Impact: ${proj.impact}`,
    ]);
  }

  // Skills as a single chunk
  if ((structuredResume.skills || []).length > 0) {
    const skillsText = Array.isArray(structuredResume.skills)
      ? structuredResume.skills.join(', ')
      : String(structuredResume.skills);
    push('skills', [`Technical Skills: ${skillsText}`], 0.6);
  }

  // One chunk per education entry
  for (const edu of (structuredResume.education || [])) {
    push('education', [
      edu.school   && `School: ${edu.school}`,
      edu.degree   && `Degree: ${edu.degree}`,
      edu.duration && `Duration: ${edu.duration}`,
    ], 0.5);
  }

  // Achievements as a single chunk
  const achievements = structuredResume.achievements || [];
  if (achievements.length > 0) {
    const lines = Array.isArray(achievements) ? achievements : [String(achievements)];
    push('achievements', [`Achievements:\n- ${lines.join('\n- ')}`]);
  }

  // Leadership as a single chunk
  const leadership = structuredResume.leadership || [];
  if (leadership.length > 0) {
    const lines = Array.isArray(leadership)
      ? leadership.map(l => (typeof l === 'string' ? l : JSON.stringify(l)))
      : [String(leadership)];
    push('leadership', [`Leadership:\n- ${lines.join('\n- ')}`]);
  }

  return chunks;
}

/**
 * Attaches embeddings to all chunks in parallel.
 * Returns a new array (original chunks are not mutated).
 */
export async function attachEmbeddings(chunks) {
  return Promise.all(
    chunks.map(async (chunk) => ({
      ...chunk,
      embedding: await generateEmbedding(chunk.content),
    }))
  );
}

/**
 * Cosine similarity between two float32 vectors.
 */
export function cosineSimilarity(a, b) {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot   += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}

/**
 * Retrieves the top-k chunks most relevant to `query`.
 * Ranking: 70% semantic similarity + 30% importance score.
 * Requires chunks to have embeddings attached via attachEmbeddings().
 */
export async function retrieveRelevantResumeChunks(query, chunks, k = 3) {
  const qEmbed = await generateEmbedding(query);
  return chunks
    .map(c => ({
      ...c,
      finalScore: 0.7 * cosineSimilarity(qEmbed, c.embedding) + 0.3 * c.importanceScore,
    }))
    .sort((a, b) => b.finalScore - a.finalScore)
    .slice(0, k);
}

// Which chunk types are relevant for each portfolio section
const SECTION_TYPE_MAP = {
  about:      ['personal', 'achievements', 'leadership'],
  experience: ['experience', 'leadership'],
  projects:   ['project'],
  skills:     ['skills'],
  education:  ['education'],
};

/**
 * Fast type-based retrieval — no embeddings required.
 * Filters chunks by the types relevant to `sectionName`, then
 * ranks by importance score and returns the top k.
 */
export function retrieveByType(sectionName, chunks, k = 3) {
  const types = SECTION_TYPE_MAP[sectionName] || ['personal'];
  const filtered = chunks.filter(c => types.includes(c.type));

  // Fall back to all chunks if the section has no matching types
  const pool = filtered.length > 0 ? filtered : chunks;

  return pool
    .sort((a, b) => b.importanceScore - a.importanceScore)
    .slice(0, k);
}
