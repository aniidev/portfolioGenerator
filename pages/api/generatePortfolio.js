import { Groq } from "groq-sdk";
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY // make sure this is in .env.local
});
if (!globalThis.portfolios) {
  globalThis.portfolios = {};
}
const portfolios = globalThis.portfolios;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { resumeText, theme } = req.body;
if (!resumeText || !theme) {
  return res.status(400).json({ error: "Missing resumeText or theme" });
}

const prompt = `
Using the following resume text, create a complete single HTML portfolio page.

Theme color: ${theme} (use Tailwind's ${theme}-500 for main buttons, headings, and accents).

Font options: Montserrat, Poppins, Playfair Display, Raleway, Lobster, Lora, Fira Sans, Quicksand, Pacifico, Merriweather, Roboto, Open Sans, Lato, Source Sans Pro, Inter, Nunito, Oswald, PT Serif, DM Sans, Cabin.
Pick one or two fonts that match the chosen theme and load via Google Fonts CDN.

Libraries to include using official CDNs:
- TailwindCSS: use <script src="https://cdn.tailwindcss.com"></script> (do NOT use <link>)
- Font Awesome: https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css
- AOS (Animate On Scroll): https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css and https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js
- Hero Patterns: use subtle SVG backgrounds

Design requirements:
- MAKE SURE THE NAME IS CORRECT FIRST AND LAST NAME 
- Clean, modern, minimal style with balanced whitespace.
- Semantic HTML and responsive layout.
- Automatically pick a cohesive color palette based on the theme for headings, buttons, backgrounds, and accents.
- Include smooth hover animations, button hover states, and fade-in effects using AOS.
- All hover/fade/interactivity must match the chosen theme and color palette.

Functional requirements:
- Include sections: About Me, Skills, Projects, Experience, Contact.
- Tailwind must be loaded via <script> from CDN, not <link>.
- All CSS and JS must be inline or from CDN so it works instantly.
- Do NOT include triple backticks or \`\`\`html.
- Do NOT include any explanations or comments outside the code.
- Output must start immediately with <!DOCTYPE html>.
- Output ONLY a complete HTML document.

Resume Text:
"""
${resumeText}
"""
`;


  try {
    const chatCompletion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 1,
      max_completion_tokens: 3000,
      top_p: 1,
      stream: true,
    });

    let html = "";
    for await (const chunk of chatCompletion) {
      html += chunk.choices[0]?.delta?.content || "";
    }

    res.status(200).json({ html });
  } catch (error) {
    console.error("Groq API error:", error.response?.data || error.message || error);
    return res.status(500).json({ error: error.message || "Failed to generate portfolio" });
  }
}