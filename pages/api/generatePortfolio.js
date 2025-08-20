import { Groq } from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
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

  // MUCH SIMPLER, FOCUSED PROMPT
  const prompt = `Create a professional portfolio website using this resume using the correct name it should be near the top of the prompt. Make it clean, modern, and visually appealing.

TECHNICAL SETUP:
- Use Tailwind CSS: <script src="https://cdn.tailwindcss.com"></script>
- Use Font Awesome: <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
- Use Google Fonts: Pick ONE nice font and load it

COLOR SCHEME:
- Primary color: ${theme}-600 for headings and buttons
-  backgrounds: ${theme}-50 and ${theme}-100  

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

Make sure the person's name is extracted correctly from the resume spelled right.
DONT INCLUDE IMAGES YOU DONT HAVE
Resume:
${resumeText}

Output only the complete HTML starting with <!DOCTYPE html>. No explanations.`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system", 
          content: "You are a skilled web developer. Create clean, professional websites with good design sense. Focus on  usability."
        },
        { 
          role: "user", 
          content: prompt 
        }
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

    res.status(200).json({ html });

  } catch (error) {
    console.error("Groq API error:", error.response?.data || error.message || error);
    return res.status(500).json({ 
      error: error.message || "Failed to generate portfolio"
    });
  }
}