import { Groq } from "groq-sdk";
import { buildSemanticChunks, retrieveByType } from "../../lib/ragUtils";
import { selectVisualStyle } from "../../lib/widgets";


const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// llama-3.1-8b-instant: high TPM ceiling on Groq — for structuring + section text
// openai/gpt-oss-120b:  stronger model reserved only for the final HTML render
const FAST_MODEL = "llama-3.1-8b-instant";
const HTML_MODEL = "openai/gpt-oss-120b";

// ─── Section definitions ────────────────────────────────────────────────────

const SECTIONS = [
  {
    name: "about",
    query: "technical identity, professional summary, core strengths, career achievements",
    instruction:
      "Write 2–3 sentences capturing the person's professional identity, core expertise, and what makes them distinctive. Write in third person. Be specific — reference actual skills and domain areas from the data.",
  },
  {
    name: "experience",
    query: "work history, internships, leadership roles, job impact, career progression",
    instruction:
      "For each work role, write a short paragraph with the job title, company, duration, key responsibilities, and quantified impact where the data includes it. List roles in reverse chronological order.",
  },
  {
    name: "projects",
    query: "software projects, engineering builds, AI work, side projects, applications built",
    instruction:
      "For each project, write 2–3 sentences covering the project name, technologies used, what it does, and measurable impact or outcomes if present.",
  },
  {
    name: "skills",
    query: "technical stack, programming languages, frameworks, tools, cloud platforms",
    instruction:
      "List the technical skills organized by category (e.g. Languages, Frameworks, Cloud/Infrastructure, Databases, ML/AI). Use only skills explicitly present in the resume data.",
  },
  {
    name: "education",
    query: "university degree, graduation year, academic credentials, school, GPA",
    instruction:
      "List educational background. For each entry include school name, degree, and graduation year or duration. Include GPA or honors only if present in the data.",
  },
];

// ─── Name extraction (deterministic, no LLM) ────────────────────────────────

/**
 * Finds the person's name by scanning the first lines of the resume text.
 * A name line: no @, no http, not all-digits, starts with a capital letter,
 * has 2+ words, under 60 chars. Returns null if nothing convincing is found.
 */
function extractNameFromText(rawText) {
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  for (const line of lines.slice(0, 8)) {
    if (line.includes('@'))               continue; // email
    if (line.includes('http'))            continue; // url
    if (/^\+?[\d\s\-()+.]+$/.test(line)) continue; // phone number
    if (/^[a-z]/.test(line))             continue; // starts lowercase
    if (line.length > 60)                continue; // too long to be a name
    const words = line.split(/\s+/).filter(Boolean);
    if (words.length < 2)                continue; // single word, skip
    // Each word should be mostly letters (allow hyphens/apostrophes)
    const allWordsLookLikeName = words.every(w => /^[A-Za-z'-]+$/.test(w));
    if (allWordsLookLikeName) return line.trim();
  }
  return null;
}

// ─── Resume structuring ─────────────────────────────────────────────────────

async function structureResume(resumeText) {
  const preExtractedName = extractNameFromText(resumeText);
  const completion = await groq.chat.completions.create({
    model: FAST_MODEL,
    messages: [
      {
        role: "system",
        content:
          "You are a precise resume parser. Return only a valid JSON object — no markdown, no explanations.",
      },
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

${preExtractedName ? `THE PERSON'S NAME IS: "${preExtractedName}" — use this exactly for the "name" field, spelled exactly as shown.` : ''}

FIELD RULES:
- "name": A human full name (First Last). NEVER an email, URL, handle, or phone number.${preExtractedName ? ` Use "${preExtractedName}".` : ' Look for it on the very first line.'}
- "email": The @ address. Do NOT put in "name".
- "phone": Digits/dashes only. Do NOT put in "name".
- "title": Professional role (e.g. "Software Engineer"). Infer from education/experience if not explicit.
- "skills": flat array of strings.
- "achievements": flat array of strings.
- "leadership": flat array of strings.
- Only use facts from the resume. Do not invent.

Resume:
${resumeText}`,
      },
    ],
    temperature: 0.1,
    max_completion_tokens: 2000,
    stream: false,
  });

  const raw = completion.choices[0]?.message?.content || "";
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Structuring LLM returned no JSON");

  const parsed = JSON.parse(jsonMatch[0]);

  // Deterministic safety net: if the LLM still put an email/URL/handle in the
  // name field, replace it with the pre-extracted name from the raw text.
  if (parsed?.personal) {
    const n = parsed.personal.name || "";
    const nameIsWrong = n.includes('@') || n.includes('http') || n.includes('.com') || /^\+?[\d\s\-()+]+$/.test(n);
    if (nameIsWrong && preExtractedName) {
      parsed.personal.name = preExtractedName;
    }
    // Also catch the case where name was left blank but we have a pre-extracted one
    if (!parsed.personal.name && preExtractedName) {
      parsed.personal.name = preExtractedName;
    }
  }

  return parsed;
}

// ─── All-sections generation (single LLM call) ─────────────────────────────

async function generateAllSections(chunks) {
  // Exemplars are intentionally excluded — they contain realistic fake companies
  // and metrics that models copy verbatim into real resumes. Style guidance is
  // handled entirely through the system prompt below.
  const contextBlock = SECTIONS.map(section => {
    const resumeChunks = retrieveByType(section.name, chunks, 3);
    const facts = resumeChunks.map(c => c.content).join("\n---\n");
    return `## ${section.name.toUpperCase()}\n${section.instruction}\n\nRESUME DATA (only source of truth):\n${facts || "No data available."}`;
  }).join("\n\n========\n\n");

  const completion = await groq.chat.completions.create({
    model: FAST_MODEL,
    messages: [
      {
        role: "system",
        content: `YOU ARE WRITING A PERSONAL PORTFOLIO WEBSITE IN THE FIRST PERSON. The person whose resume this is will read "I did X" on their own website — not "He did X" or "She did X" or "[Name] did X".

FIRST PERSON IS MANDATORY. Every sentence you write must use I, me, my, mine, myself.
WRONG: "Anirudh is a developer who built..."
WRONG: "He designed a system that..."
WRONG: "The candidate has experience in..."
RIGHT:  "I'm a developer who built..."
RIGHT:  "I designed a system that..."
RIGHT:  "I have experience in..."

ADDITIONAL RULES:
- Use ONLY facts from the RESUME DATA. Never add companies, roles, projects, metrics, or skills not in the data.
- Do NOT use training knowledge. If it is not in the data, do not write it.
- If a section has no data write "Not provided." — do not invent content.
- Each JSON value must be a plain string (no arrays, no nested objects).
- About: 2-3 sentences, first person, identity and strengths from the data only.
- Experience: one paragraph per role (first person), blank line between roles, everything in one string.
- Projects: one paragraph per project (first person), blank line between projects, everything in one string.
- Skills: comma-separated plain list in one string.
- Education: one sentence per entry in one string.
- No HTML, no markdown, no bullets, no dashes as list markers.

Return ONLY a JSON object with these exact keys: about, experience, projects, skills, education.`,
      },
      {
        role: "user",
        content: `${contextBlock}\n\nRemember: write everything in FIRST PERSON (I, me, my). Return the JSON object only. No markdown fences.`,
      },
    ],
    temperature: 0.0,
    max_completion_tokens: 1500,
    stream: false,
  });

  const raw = completion.choices[0]?.message?.content || "{}";
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Section generation returned no JSON");
  return JSON.parse(jsonMatch[0]);
}

// Safely converts any LLM section value (string | object | array) to a plain string
function sectionToString(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (Array.isArray(value)) {
    return value.map(item => {
      if (typeof item === "string") return item;
      if (typeof item === "object" && item !== null) {
        return Object.entries(item)
          .filter(([, v]) => v !== null && v !== undefined && v !== "")
          .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
          .join("\n");
      }
      return String(item);
    }).join("\n\n");
  }
  if (typeof value === "object") {
    return Object.entries(value)
      .filter(([, v]) => v !== null && v !== undefined && v !== "")
      .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
      .join("\n");
  }
  return String(value);
}

// Theme → primary / secondary / glow colours for the design system
const THEME_COLORS = {
  purple: { primary: '#a855f7', secondary: '#7c3aed', glow: 'rgba(168,85,247,0.35)', bg1: '#1a0533', bg2: '#0a0118' },
  blue:   { primary: '#60a5fa', secondary: '#2563eb', glow: 'rgba(96,165,250,0.35)',  bg1: '#0a1628', bg2: '#030712' },
  pink:   { primary: '#f472b6', secondary: '#db2777', glow: 'rgba(244,114,182,0.35)', bg1: '#2d0a1e', bg2: '#0f0009' },
  green:  { primary: '#34d399', secondary: '#059669', glow: 'rgba(52,211,153,0.35)',  bg1: '#022c1a', bg2: '#011108' },
  red:    { primary: '#f87171', secondary: '#dc2626', glow: 'rgba(248,113,113,0.35)', bg1: '#2d0a0a', bg2: '#0f0000' },
  yellow: { primary: '#fbbf24', secondary: '#d97706', glow: 'rgba(251,191,36,0.35)',  bg1: '#1c1200', bg2: '#090500' },
  gray:   { primary: '#94a3b8', secondary: '#64748b', glow: 'rgba(148,163,184,0.25)', bg1: '#0f172a', bg2: '#020617' },
  dark:   { primary: '#818cf8', secondary: '#4f46e5', glow: 'rgba(129,140,248,0.35)', bg1: '#0d0d1a', bg2: '#050508' },
};

// ─── Final HTML assembly ────────────────────────────────────────────────────

async function assemblePortfolioHtml(sectionTexts, structuredResume, theme, customFeatures) {
  const p     = structuredResume.personal || {};
  const name  = p.name  || "Portfolio";
  const title = p.title || "Professional";
  const email = p.email || "";
  const phone = p.phone || "";

  const tc    = THEME_COLORS[theme] || THEME_COLORS.purple;
  const style = selectVisualStyle(theme);          // theme drives the visual style
  const designSpec = style.describe(tc.primary, tc.secondary, tc.bg1, tc.bg2);
  const selectedFont = style.selectedFont || style.fonts[0];

  const contentBlock = SECTIONS.map(s => {
    const raw  = sectionTexts[s.name];
    const text = sectionToString(raw) || "(no content)";
    return `=== ${s.name.toUpperCase()} ===\n${text}`;
  }).join("\n\n");

  const prompt = `You are a senior UI/UX designer and creative developer building a one-of-a-kind portfolio website.

You have a strong point of view. You make creative decisions. You do NOT copy templates.
The creative brief below is your inspiration — interpret it, push it, make it your own.
Every design choice you make should feel intentional and surprising in a good way.

⚠ MANDATORY COLOR — the user chose this, it MUST appear prominently:
  Primary:   ${tc.primary}
  Secondary: ${tc.secondary}
Use these exact hex values for headings, highlights, borders, buttons, badges, or gradient fills.
Do NOT substitute different colors. The user's color choice must be clearly visible throughout the page.

=== PORTFOLIO CONTENT (these are the only facts you may use) ===
${contentBlock}
Contact: ${email}${phone ? " | " + phone : ""}
=============================================================

=== LIBRARIES — include all of these in <head> ===
<script src="https://cdn.tailwindcss.com"></script>
${style.extraLibs}
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
${selectedFont}

=== CREATIVE BRIEF — your design direction ===
${designSpec}

=== CONTENT SECTIONS (all must appear, order and presentation are your creative call) ===
- Navigation
- Hero (name, role, contact)
- About
- Experience (all roles)
- Projects (all projects with tech and descriptions)
- Skills (all skills)
- Education
- Contact / Footer
${customFeatures ? `- Extra feature: ${customFeatures}` : ""}

=== NON-NEGOTIABLE RULES ===
1. Content is final: do not invent names, companies, roles, projects, skills, or metrics.
2. Every content section above must appear somewhere in the output.
3. No placeholder text. No lorem ipsum. No "coming soon". No fake avatar images.
4. Mobile responsive — works on small screens.
5. Add this at end of body: <script>${style.aosInit}</script>
6. html { scroll-behavior: smooth; }

Now build something genuinely impressive. Output ONLY the complete <!DOCTYPE html> document.`;

  const chatCompletion = await groq.chat.completions.create({
    model: HTML_MODEL,
    messages: [
      {
        role: "system",
        content:
          "You are a senior UI/UX designer and creative developer with strong personal taste. You build portfolio websites that are genuinely unique — not templates. You interpret a creative brief and make your own design decisions. You never copy patterns verbatim; you execute the feeling and aesthetic in your own way. The content you are given is factual and final — your job is to present it beautifully and memorably, not to rewrite it.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.5,
    max_completion_tokens: 4096,
    stream: true,
  });

  let html = "";
  for await (const chunk of chatCompletion) {
    html += chunk.choices[0]?.delta?.content || "";
  }
  return html;
}

// ─── RAG pipeline ───────────────────────────────────────────────────────────

async function ragPipeline(resumeText, structuredResume, theme, customFeatures) {
  const chunks = buildSemanticChunks(structuredResume);
  if (chunks.length === 0) throw new Error("Resume produced no semantic chunks");

  // One LLM call for all sections — avoids the 5-call burst that hits TPM limits
  const sectionTexts = await generateAllSections(chunks);

  return assemblePortfolioHtml(sectionTexts, structuredResume, theme, customFeatures);
}

// ─── Original single-prompt fallback ────────────────────────────────────────

async function originalGenerate(resumeText, theme, customFeatures) {
  const prompt = `Create a professional portfolio website using this resume using the correct name it should be near the top of the prompt. Make it clean, modern, and visually appealing.

TECHNICAL SETUP:
- Use Tailwind CSS: <script src="https://cdn.tailwindcss.com"></script>
- Use Font Awesome: <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
- Use Google Fonts: Pick ONE nice font and load it

COLOR SCHEME:
- Use the theme of: ${theme}
- Add other colors you see fit

SECTIONS TO INCLUDE:
1. Header with name and title
1.5. An about section
2. Experience section
3. Projects section (if any mentioned)
4. Skills section
5. Contact section with email/phone

DESIGN RULES:
- Mobile responsive
- Clean spacing with proper padding/margins
- Smooth hover effects on buttons and cards
- Professional photo placeholder
- Easy to read typography
- Modern card-based layouts
- Use interactivity like hover
- Use animations

Make sure the person's name is extracted correctly from the resume spelled right.
DONT INCLUDE PROFILE PHOTO
Also specifically implement: ${customFeatures}
Resume:
${resumeText}

Output only the complete HTML starting with <!DOCTYPE html>. No explanations.`;

  const chatCompletion = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",
    messages: [
      {
        role: "system",
        content:
          "You are a skilled web developer. Create clean, professional websites with good design sense. Focus on usability.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.8,
    max_completion_tokens: 3500,
    top_p: 0.95,
    stream: true,
  });

  let html = "";
  for await (const chunk of chatCompletion) {
    html += chunk.choices[0]?.delta?.content || "";
  }
  return html;
}

// ─── Handler ─────────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // structuredResume is optional — present only if the frontend passes it
  const { resumeText, structuredResume: incomingStructured, theme, customFeatures } = req.body;

  if (!resumeText || !theme) {
    return res.status(400).json({ error: "Missing resumeText or theme" });
  }

  try {
    // Use pre-structured data if available, otherwise call LLM to structure
    const structuredResume = incomingStructured ?? (await structureResume(resumeText));
    const html = await ragPipeline(resumeText, structuredResume, theme, customFeatures);
    return res.status(200).json({ html });
  } catch (ragError) {
    console.error("RAG pipeline failed — falling back to original generation:", ragError.message);
    try {
      const html = await originalGenerate(resumeText, theme, customFeatures);
      return res.status(200).json({ html });
    } catch (fallbackError) {
      console.error("Fallback generation also failed:", fallbackError.message);
      return res.status(500).json({
        error: fallbackError.message || "Failed to generate portfolio",
      });
    }
  }
}
