import { Groq } from "groq-sdk";
import { buildSemanticChunks } from "../../lib/ragUtils";
import { PERSONA_THEME_MAP } from "../../lib/themePresets";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const FAST_MODEL = "llama-3.1-8b-instant";
const MAIN_MODEL = "openai/gpt-oss-120b";

// ─── JSON safety ─────────────────────────────────────────────────────────────

function safeJsonParse(raw) {
  try { return JSON.parse(raw); } catch (_) {}
  let out = "", inStr = false, escaped = false;
  for (let i = 0; i < raw.length; i++) {
    const c = raw[i];
    if (escaped)            { out += c; escaped = false; continue; }
    if (c === "\\" && inStr){ out += c; escaped = true;  continue; }
    if (c === '"')          { inStr = !inStr; out += c;  continue; }
    if (inStr) {
      if      (c === "\n") { out += "\\n";  continue; }
      else if (c === "\r") { out += "\\r";  continue; }
      else if (c === "\t") { out += "\\t";  continue; }
      else if (c.charCodeAt(0) < 0x20) continue;
    }
    out += c;
  }
  return JSON.parse(out);
}

// ─── Name extraction (no LLM) ────────────────────────────────────────────────

function extractNameFromText(raw) {
  const lines = raw.split("\n").map(l => l.trim()).filter(Boolean);
  for (const line of lines.slice(0, 8)) {
    if (line.includes("@") || line.includes("http") || /^\+?[\d\s\-()+.]+$/.test(line)) continue;
    if (/^[a-z]/.test(line) || line.length > 60) continue;
    const words = line.split(/\s+/).filter(Boolean);
    if (words.length >= 2 && words.every(w => /^[A-Za-z'-]+$/.test(w))) return line.trim();
  }
  return null;
}

// ─── Section definitions ─────────────────────────────────────────────────────

const SECTIONS = [
  { name: "about",      instruction: "Write 2-3 sentences capturing this person's professional identity, core strengths, and what makes them distinctive." },
  { name: "experience", instruction: "For each role: job title, company, duration, key responsibilities, and quantified impact where available. Reverse chronological order." },
  { name: "projects",   instruction: "For each project: name, technologies, what it does, and measurable impact or outcomes." },
  { name: "skills",     instruction: "List technical skills organized by category as a plain comma-separated list." },
  { name: "education",  instruction: "School name, degree, and graduation year or duration. Include GPA or honors only if present." },
];

const SECTION_TYPE_MAP = {
  about:      ["personal", "achievements", "leadership"],
  experience: ["experience", "leadership"],
  projects:   ["project"],
  skills:     ["skills"],
  education:  ["education"],
};

function retrieveByType(sectionName, chunks, k = 4) {
  const types  = SECTION_TYPE_MAP[sectionName] || ["personal"];
  const pool   = chunks.filter(c => types.includes(c.type));
  const source = pool.length > 0 ? pool : chunks;
  return source.sort((a, b) => b.importanceScore - a.importanceScore).slice(0, k);
}

// ─── Step 1 — Structure the resume ───────────────────────────────────────────

async function structureResume(resumeText) {
  const preExtractedName = extractNameFromText(resumeText);

  const completion = await groq.chat.completions.create({
    model: FAST_MODEL,
    messages: [
      { role: "system", content: "You are a precise resume parser. Return only a valid JSON object — no markdown, no explanations." },
      {
        role: "user",
        content: `Parse this resume into the following JSON schema:
{
  "personal": { "name": "", "title": "", "email": "", "phone": "", "location": "", "summary": "" },
  "experiences": [{ "title": "", "company": "", "duration": "", "description": "", "impact": "" }],
  "projects": [{ "title": "", "tech": "", "description": "", "impact": "" }],
  "skills": [],
  "education": [{ "school": "", "degree": "", "duration": "" }],
  "achievements": [],
  "leadership": []
}

${preExtractedName ? `THE PERSON'S NAME IS: "${preExtractedName}" — use exactly this for the "name" field.` : ""}

FIELD RULES:
- "name": human full name (First Last). NEVER an email, URL, handle, or phone number.${preExtractedName ? ` Use "${preExtractedName}".` : " Look at the very first line."}
- "email": the @ address. Never put in "name".
- "skills": flat array of strings. "achievements": flat array. "leadership": flat array.
- Only use facts from the resume. Do not invent.

Resume:
${resumeText}`,
      },
    ],
    temperature: 0.1,
    max_completion_tokens: 2000,
    stream: false,
  });

  const raw      = completion.choices[0]?.message?.content || "";
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Structuring LLM returned no JSON");
  const parsed = safeJsonParse(jsonMatch[0]);

  // Safety net: fix bad name field
  if (parsed?.personal) {
    const n = parsed.personal.name || "";
    if ((n.includes("@") || n.includes("http") || /^\+?[\d\s\-()+]+$/.test(n)) && preExtractedName) {
      parsed.personal.name = preExtractedName;
    }
    if (!parsed.personal.name && preExtractedName) parsed.personal.name = preExtractedName;
  }
  return parsed;
}

// ─── Step 2 — Section text generation ────────────────────────────────────────

function sectionToString(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(i => (typeof i === "string" ? i : Object.entries(i).filter(([,v])=>v).map(([k,v])=>`${k}: ${Array.isArray(v)?v.join(", "):v}`).join("\n"))).join("\n\n");
  if (typeof value === "object") return Object.entries(value).filter(([,v])=>v).map(([k,v])=>`${k}: ${Array.isArray(v)?v.join(", "):v}`).join("\n");
  return String(value);
}

async function generateAllSections(chunks) {
  const contextBlock = SECTIONS.map(s => {
    const rc    = retrieveByType(s.name, chunks, 4);
    const facts = rc.map(c => c.content).join("\n---\n");
    return `## ${s.name.toUpperCase()}\n${s.instruction}\n\nRESUME DATA (only source of truth):\n${facts || "No data available."}`;
  }).join("\n\n========\n\n");

  const completion = await groq.chat.completions.create({
    model: FAST_MODEL,
    messages: [
      {
        role: "system",
        content: `YOU ARE WRITING CONTENT FOR A PERSONAL PORTFOLIO WEBSITE IN THE FIRST PERSON.
Every sentence uses I, me, my, mine.
WRONG: "Anirudh built..." RIGHT: "I built..."

CRITICAL RULES:
1. FIRST PERSON only — I, me, my.
2. Use ONLY facts from RESUME DATA. Never invent companies, roles, projects, metrics, or skills.
3. Return a JSON object with string values for: about, experience, projects, skills, education.
4. Each value is plain text (no HTML, no markdown).
5. experience: one paragraph per role, blank line between roles, all in one string.
6. projects: one paragraph per project, blank line between projects, all in one string.
7. skills: plain comma-separated list.
8. education: one sentence per entry in one string.`,
      },
      { role: "user", content: `${contextBlock}\n\nWrite FIRST PERSON. Return JSON only. No markdown fences.` },
    ],
    temperature: 0.0,
    max_completion_tokens: 1600,
    stream: false,
  });

  const raw = completion.choices[0]?.message?.content || "{}";
  const m   = raw.match(/\{[\s\S]*\}/);
  if (!m) throw new Error("Section generation returned no JSON");
  return safeJsonParse(m[0]);
}

// ─── Step 3 — Blueprint JSON generation ──────────────────────────────────────

async function generateBlueprint(sectionTexts, structuredResume) {
  const p = structuredResume.personal || {};

  const sectionContent = Object.entries(sectionTexts)
    .map(([k, v]) => `${k.toUpperCase()}:\n${sectionToString(v)}`)
    .join("\n\n");

  const completion = await groq.chat.completions.create({
    model: MAIN_MODEL,
    messages: [
      {
        role: "system",
        content: `You are a portfolio data architect. Convert portfolio section content into a structured blueprint JSON.
Use ONLY the provided facts. Write in first person (I, my, me).
Return ONLY valid JSON — no markdown fences, no explanation.`,
      },
      {
        role: "user",
        content: `Personal: Name="${p.name}", Email="${p.email}", Phone="${p.phone}"

PORTFOLIO CONTENT (use only these facts):
${sectionContent}

Generate this exact JSON structure:
{
  "persona": "one of: AI Engineer | Software Engineer | Quant Developer | Startup Builder | Student Researcher",
  "hero": {
    "name": "${p.name || ""}",
    "role": "professional role/title inferred from content",
    "headline": "compelling 6-8 word first-person tagline",
    "subheadline": "2-3 sentence first-person professional summary",
    "metrics": [
      { "value": 0, "label": "achievement label" }
    ]
  },
  "about": {
    "paragraph": "first person about paragraph from content"
  },
  "experience": [
    { "role": "", "company": "", "duration": "", "description": "", "highlights": [] }
  ],
  "projects": [
    { "name": "", "description": "", "tech": [], "featured": false }
  ],
  "skills": [
    { "category": "", "items": [] }
  ],
  "education": [
    { "school": "", "degree": "", "duration": "", "achievements": [] }
  ],
  "contact": {
    "email": "${p.email || ""}",
    "phone": "${p.phone || ""}",
    "github": "extract github handle if present in content",
    "linkedin": "extract linkedin handle if present in content"
  }
}

Rules:
- metrics: extract 3-4 real numbers from achievements/projects (competitions placed, users, matches, languages known, etc.)
- Set featured:true on the most impressive project only
- Group skills by category (Languages, AI/ML, Systems/Tools, etc.)
- persona: classify based on the actual content
- All text first person
- Return JSON only`,
      },
    ],
    temperature: 0.1,
    max_completion_tokens: 2500,
    stream: false,
  });

  const raw = completion.choices[0]?.message?.content || "{}";
  const m   = raw.match(/\{[\s\S]*\}/);
  if (!m) throw new Error("Blueprint generation returned no JSON");
  const blueprint = safeJsonParse(m[0]);

  // Ensure name is correct
  if (p.name && blueprint?.hero) blueprint.hero.name = p.name;

  return blueprint;
}

// ─── RAG pipeline ─────────────────────────────────────────────────────────────

async function ragPipeline(resumeText, customFeatures) {
  const structuredResume = await structureResume(resumeText);
  const chunks           = buildSemanticChunks(structuredResume);
  if (!chunks.length) throw new Error("Resume produced no semantic chunks");

  const sectionTexts = await generateAllSections(chunks);
  const blueprint    = await generateBlueprint(sectionTexts, structuredResume);

  const themeId = PERSONA_THEME_MAP[blueprint.persona] || "sleek_engineer";

  return { blueprint, theme: themeId, persona: blueprint.persona };
}

// ─── Fallback (minimal blueprint from raw text) ───────────────────────────────

async function fallbackBlueprint(resumeText) {
  const name = extractNameFromText(resumeText) || "Portfolio";
  return {
    blueprint: {
      persona: "Software Engineer",
      hero:  { name, role: "Developer", headline: "Building things that matter.", subheadline: resumeText.slice(0, 220), metrics: [] },
      about: { paragraph: resumeText.slice(0, 400) },
      experience: [], projects: [], skills: [], education: [],
      contact: { email: "", phone: "", github: "", linkedin: "" },
    },
    theme: "sleek_engineer",
    persona: "Software Engineer",
  };
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { resumeText, customFeatures } = req.body;
  if (!resumeText) return res.status(400).json({ error: "Missing resumeText" });

  try {
    const result = await ragPipeline(resumeText, customFeatures);
    return res.status(200).json(result);
  } catch (ragError) {
    console.error("RAG pipeline failed — using fallback:", ragError.message);
    try {
      const result = await fallbackBlueprint(resumeText);
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).json({ error: err.message || "Failed to generate portfolio" });
    }
  }
}
