/**
 * Creative direction system for portfolio generation.
 *
 * Each style is a MOOD BOARD — aesthetic goals, feeling, references — not a CSS spec.
 * The model reads this like a designer reads a creative brief: it interprets and
 * executes the feeling in its own way. This produces genuinely unique sites.
 *
 * Deliberately avoids specifying exact Tailwind classes so the model makes its own
 * layout and component decisions within the aesthetic constraint.
 */

// Randomize small decisions within a style so even same-style outputs differ
function coin() { return Math.random() > 0.5; }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

export const VISUAL_STYLES = [

  // ── 1. MIDNIGHT GLASS ────────────────────────────────────────────────────
  {
    id: "midnight-glass",
    fonts: [
      `<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">`,
      `<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&display=swap" rel="stylesheet">`,
    ],
    extraLibs: `<link href="https://cdn.jsdelivr.net/npm/daisyui@4/dist/full.min.css" rel="stylesheet">
<link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
<script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>`,
    aosInit: `AOS.init({ duration: 1000, easing: "ease-out-expo", once: true, offset: 80 });`,
    describe(primary, secondary, bg1, bg2) {
      const heroAlign = coin() ? "centered" : "left-aligned";
      const cardRadius = pick(["rounded-2xl", "rounded-3xl", "rounded-xl"]);
      const heroSize = pick(["text-8xl", "text-9xl", "text-[10rem]"]);
      return `
AESTHETIC: Midnight Glass — sophisticated, atmospheric, expensive. Think Vercel dashboard, Linear, Raycast.
Feeling: late night in a high-end creative studio. Dark space. Light bends around surfaces rather than lighting them.
Primary: ${primary}  Secondary: ${secondary}  Background base: ${bg1} deepening to ${bg2}

CREATIVE DIRECTION — interpret these, don't just copy:
- Background: deep dark, animated or static gradient. Elements should feel like they're floating in deep space.
- Cards: translucent surfaces — light passes through them. Frosted, not opaque. Edges defined by light not heavy borders.
- Typography: precise. Hierarchy is everything. The name in the hero should feel like a statement.
- Hero layout: ${heroAlign}. Name at ${heroSize}, bold or extrabold. Role/title in a lighter weight below.
- Color usage: ${primary} as an accent — used sparingly and intentionally. A single colored element in each section creates rhythm.
- Animations: elements materialize — they don't slide or bounce. Fade up from slightly below.
- One unexpected design moment: ${pick([
    "a large decorative ampersand or geometric shape behind the hero name at very low opacity",
    "a thin horizontal line with a gradient that fades out, used as section dividers",
    "the nav links have a small colored dot that appears on hover, not an underline",
    "section numbers (01, 02, 03) in very large low-opacity text behind the section heading",
    "a subtle grid pattern on the background made with CSS gradients at 2-3% opacity",
  ])}

FONTS: Syne for hero name and headings (geometric, distinctive). Plus Jakarta Sans for body.
LIBRARIES AVAILABLE: Tailwind CSS, DaisyUI, AOS, Font Awesome. Use DaisyUI components where they fit naturally.
`;
    },
  },

  // ── 2. RAW SIGNAL ────────────────────────────────────────────────────────
  {
    id: "raw-signal",
    fonts: [
      `<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">`,
    ],
    extraLibs: `<link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
<script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>`,
    aosInit: `AOS.init({ duration: 400, easing: "ease-out", once: true });`,
    describe(primary) {
      const bg = coin() ? "#ffffff" : "#f7f6f1";
      const border = coin() ? "border-4 border-black" : "border-[3px] border-black";
      return `
AESTHETIC: Raw Signal — brutalist, honest, confident. Think early web energy with modern execution. Swiss design meets zine culture.
Feeling: someone who doesn't need to impress you because their work speaks. Bold. Direct. No decoration for decoration's sake.
Primary accent: ${primary}  Background: ${bg}  Text: #0a0a0a

CREATIVE DIRECTION — interpret these, don't just copy:
- Background: ${bg} (light, not dark). This style inverts expectations.
- Cards: ${border}. Hard drop shadow (offset, no blur): 4-6px right and down, pure black. On hover the shadow shrinks and the card shifts to match.
- Typography: Space Grotesk for everything. Hero name UPPERCASE, very large, tracking-tight. Role in Space Mono italic below.
- Layout: strict. Content lives on a visible grid. Asymmetry is intentional, not accidental.
- Color: ${primary} used as background fill on ONE key element (CTA button, a highlighted card, or the nav active state). Everywhere else: black and white.
- Hover states: immediate, not smooth. 150ms max transitions. Things snap into place.
- One unexpected design moment: ${pick([
    "the section headings have a large colored number prefix that overlaps into the previous section",
    "a thin diagonal line cuts across the hero section at low opacity",
    "skill tags have a torn/offset border effect using box-shadow instead of real border",
    "the footer is full-width black with white text — a hard cut from the light page",
    "project cards flip or tilt slightly on hover",
  ])}

FONTS: Space Grotesk primary, Space Mono for labels, code, and italic accents.
NO blur effects, NO transparency, NO gradients (except on the one accent element).
`;
    },
  },

  // ── 3. GHOST LIGHT ───────────────────────────────────────────────────────
  {
    id: "ghost-light",
    fonts: [
      `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">`,
      `<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">`,
    ],
    extraLibs: `<link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
<script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>`,
    aosInit: `AOS.init({ duration: 1200, easing: "ease-out-sine", once: true, offset: 120 });`,
    describe(primary) {
      const heroLayout = coin() ? "centered with massive line-height" : "left-aligned with very wide content area";
      return `
AESTHETIC: Ghost Light — quiet confidence. Minimal to the edge of invisible. Think iA Writer, Stripe docs, a beautifully typeset book.
Feeling: everything that remains is there for a reason. No noise. The quality comes from restraint.
Primary accent: ${primary}  Background: #fafaf9  Text: #1c1917 (near black, not pure black)

CREATIVE DIRECTION — interpret these, don't just copy:
- Background: off-white, never pure white. Almost paper.
- Cards: no visible card borders. Sections breathe with whitespace alone. A subtle background tint (stone-50 or zinc-50) distinguishes cards from page.
- Typography: Instrument Serif (italic) for the hero name and section headings — elegant, editorial. Inter for all body text.
- Hero: ${heroLayout}. The name in Instrument Serif italic at very large size is the entire design statement. Nothing else competes.
- Color: ${primary} appears on ONE element per section as a hairline accent — a thin line, a small dot, an underline. Never as a fill.
- Spacing: generous to the point of bold. Padding that makes you think something is missing. That space IS the design.
- Transitions: very slow, very subtle. 600-800ms easing. Nothing jumps.
- One unexpected design moment: ${pick([
    "the hero has a single large Instrument Serif italic quote from the person's work or field at very low opacity behind the name",
    "section dividers are a single px line that fades out using a gradient from the accent color to transparent",
    "the nav has NO background — just floating text links with extreme letter-spacing",
    "project titles have a small subscript number in the accent color",
    "on scroll, a thin accent-color progress bar grows at the very top of the viewport",
  ])}

FONTS: Instrument Serif italic for display. Inter for everything else.
NO heavy shadows. NO gradients. NO cards with borders. Whitespace is the container.
`;
    },
  },

  // ── 4. SIGNAL NOISE ──────────────────────────────────────────────────────
  {
    id: "signal-noise",
    fonts: [
      `<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;0,700;1,300&display=swap" rel="stylesheet">`,
      `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">`,
    ],
    extraLibs: `<link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
<script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>`,
    aosInit: `AOS.init({ duration: 300, easing: "linear", once: true });`,
    describe(primary) {
      const promptStyle = pick(["~/portfolio $ whoami", "> portfolio.exe --user", "❯ cat about.md"]);
      return `
AESTHETIC: Signal Noise — information-dense, developer-native, zero pretense. Think GitHub, Bloomberg Terminal, a well-configured Neovim.
Feeling: the person who built this lives in the terminal. Their portfolio is a CLI for their career.
Primary accent: ${primary}  Background: #0d1117  Text: #e6edf3  Muted: #8b949e  Border: #30363d

CREATIVE DIRECTION — interpret these, don't just copy:
- Background: GitHub-style #0d1117. Panels in #161b22. Borders in #30363d. This is a dark IDE, not a website.
- ALL text in JetBrains Mono (monospace everything — this IS the aesthetic). Inter only for the hero name if you want one non-mono element.
- Hero: starts with a fake terminal prompt: "${promptStyle}" — then the name appears below as a large output, with a blinking cursor animation (CSS keyframes).
- Panels: solid dark backgrounds with 1px borders. No blur, no transparency, no gradients.
- Navigation: looks like a file tree or tab bar. Links are styled like file paths: ./about ./experience ./projects
- Section headings: prefixed with // or # comment syntax in muted color. Makes every heading look like code.
- Color: ${primary} used as the "live" indicator — active states, cursor color, the dot on the terminal prompt. One burst of color in a sea of muted text.
- Experience section: styled like a git log. Company as a "branch name", role and dates like commit metadata.
- Projects: look like repository cards — name as a "repo name", description below, tech tags styled like language badges.
- One unexpected design moment: ${pick([
    "a fake loading bar animation plays on page load before revealing the content",
    "the skills section looks like a package.json or requirements.txt with syntax highlighting classes",
    "each project card has a fake star count and fork count in the top right",
    "the footer shows system stats: uptime, last commit date, build status — all derived from real dates in the resume",
    "typing animation on the hero: the name types itself out character by character",
  ])}

BLINKING CURSOR: @keyframes blink{0%,100%{opacity:1}50%{opacity:0}} — add after the hero name.
`;
    },
  },

  // ── 5. EDITORIAL ─────────────────────────────────────────────────────────
  {
    id: "editorial",
    fonts: [
      `<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">`,
    ],
    extraLibs: `<link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
<script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>`,
    aosInit: `AOS.init({ duration: 1100, easing: "ease-out-cubic", once: true, offset: 100 });`,
    describe(primary, secondary, bg1) {
      const layout = coin() ? "dark editorial (dark bg, light text)" : "light editorial (cream bg, dark text)";
      const bgColor = layout.includes("dark") ? bg1 : "#f5f0e8";
      const textColor = layout.includes("dark") ? "#f5f0e8" : "#1a1208";
      return `
AESTHETIC: Editorial — magazine gravitas, designed to be read. Think Pentagram, NYT Magazine, a beautifully art-directed annual report.
Feeling: this person has taste. The portfolio itself is a piece of craft.
Layout variant: ${layout}  Background: ${bgColor}  Text: ${textColor}  Accent: ${primary}

CREATIVE DIRECTION — interpret these, don't just copy:
- Typography IS the design. Playfair Display for hero and ALL section headings. DM Sans for body. Mix weights aggressively.
- Hero: the name in Playfair Display at an enormous size (consider 10rem+), possibly breaking across two lines intentionally. The role in DM Sans small-caps below.
- Grid: everything lives on a visible editorial grid. Use CSS grid with named areas. Not everything starts at the left edge.
- Columns: use multi-column layouts. Experience could be in a 2-column newspaper layout. Skills in 3 columns.
- Color: ${primary} and ${secondary} appear as decorative elements — thick left borders on featured items, background fills on pull quotes, underlines on headings.
- Pull quote: extract ONE notable achievement and display it as a large pull quote (Playfair italic, large, centered, with accent border) in the experience section.
- Section headings: Playfair Display, large, with a decorative rule above (thin line from ${primary} to transparent) and a section number in tiny caps.
- One unexpected design moment: ${pick([
    "a large decorative initial cap on the about section text",
    "a full-width dark band between sections with a short centered quote in Playfair italic",
    "the hero has a thin vertical rule on the left with small vertical text reading the person's role",
    "section numbers display as Roman numerals at very large size and low opacity behind headings",
    "project cards have a pull-out stat or metric displayed very large in accent color",
  ])}

FONTS: Playfair Display for all headings and the hero. DM Sans for body. Never use sans-serif for headings in this style.
`;
    },
  },

  // ── 6. BENTO MOSAIC ──────────────────────────────────────────────────────
  {
    id: "bento-mosaic",
    fonts: [
      `<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">`,
    ],
    extraLibs: `<link href="https://cdn.jsdelivr.net/npm/daisyui@4/dist/full.min.css" rel="stylesheet">
<link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
<script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>`,
    aosInit: `AOS.init({ duration: 700, easing: "ease-out-back", once: true, offset: 40 });`,
    describe(primary, secondary, bg1, bg2) {
      const tileAccent = pick([
        `one tile uses a bold gradient fill from ${primary} to ${secondary} with white text — the featured achievement or stat`,
        `one tile is inverted: light background with dark text, surrounded by dark tiles — creates visual anchor`,
        `one tile has a large emoji or icon at 4rem as its only content — pure delight`,
      ]);
      return `
AESTHETIC: Bento Mosaic — the layout IS the content organization. Modern, playful, information-rich. Think iOS home screen, Notion, every 2024 landing page that won an award.
Feeling: scrolling this should feel like exploring. Each cell is its own world but part of a coherent whole.
Primary: ${primary}  Secondary: ${secondary}  Background: ${bg1} to ${bg2}

CREATIVE DIRECTION — interpret these, don't just copy:
- THE ENTIRE PAGE is a bento grid. No traditional sections with headings above content. The grid IS the page.
- Use CSS grid with varying cell sizes. Some cells span 2 columns, some 2 rows, some are small squares.
- Each cell has a subtle dark background (not all the same) and rounded corners (rounded-2xl or rounded-3xl).
- The grid should feel asymmetric and intentional. NOT a regular 3-column grid.
- Cell variety: ${tileAccent}
- Hero cell: the largest cell, probably spanning 2 columns and 2 rows. Name very large, Outfit font-black. Role below.
- About cell: medium-sized, contains the about paragraph.
- Stats cells: small square cells, each with ONE metric or achievement — displayed as a big number and a tiny label.
- Experience cells: one cell per job. Most recent job gets a wider cell.
- Project cells: one cell per project. The most impressive project gets the featured large cell.
- Skills cell: a wide cell with flowing skill tags inside.
- Education cell: a small cell.
- Color: some cells have the accent gradient as background. Most are dark neutral. One or two are slightly lighter to create visual hierarchy.
- Hover: cells scale up slightly (scale-[1.02]) and their border brightens. Feels tactile.
- NO traditional nav with links — instead, the page scrolls naturally through one big mosaic.
- One unexpected design moment: ${pick([
    "a cell displays an ASCII art pattern or geometric SVG decoration",
    "the hero cell has the person's initials as a giant low-opacity background element",
    "a cell dedicated to a single favorite quote from the person's field",
    "cells appear one by one on load with a stagger animation — the mosaic assembles itself",
    "one cell has a subtle animated gradient border",
  ])}

FONTS: Outfit font-black for numbers and display text. Outfit font-light for body.
`;
    },
  },
];

// Each theme in the UI maps to a primary visual style.
// Colors (primary, secondary, bg) still come from THEME_COLORS in generatePortfolio.js.
// coin() / pick() inside describe() ensure two generations of the same theme still differ.
const THEME_STYLE_MAP = {
  purple: "midnight-glass",   // dark, atmospheric, sophisticated
  blue:   "signal-noise",     // dev/technical, information-dense
  pink:   "editorial",        // warm, editorial gravitas
  green:  "ghost-light",      // minimal, natural restraint
  red:    "raw-signal",       // bold, brutalist, high-contrast
  yellow: "bento-mosaic",     // playful, asymmetric, bright
  gray:   "ghost-light",      // minimal, neutral
  dark:   "signal-noise",     // dark dev aesthetic
};

/**
 * Selects the visual style that matches the user's chosen theme.
 * Falls back to a random style if the theme is unrecognised.
 */
export function selectVisualStyle(theme) {
  const styleId = THEME_STYLE_MAP[theme];
  const style   = styleId
    ? VISUAL_STYLES.find(s => s.id === styleId) || VISUAL_STYLES[0]
    : VISUAL_STYLES[Math.floor(Math.random() * VISUAL_STYLES.length)];

  const font = pick(style.fonts);
  return { ...style, selectedFont: font };
}
