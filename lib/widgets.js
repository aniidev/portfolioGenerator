/**
 * Design system per visual style.
 * Each style ships:
 *   - fonts   : <link> tags for Google Fonts
 *   - css()   : complete CSS string injected verbatim into the <style> tag
 *   - js      : scroll-reveal script injected at end of <body>
 *   - describe(): creative brief (mood + layout direction for the LLM)
 *
 * Injecting real CSS means the LLM only writes HTML that uses pre-defined
 * classes — dramatically more consistent and beautiful than asking it to
 * invent styling from a text description.
 */

function coin() { return Math.random() > 0.5; }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// ── CDN library URLs ─────────────────────────────────────────────────────────
const LIB = {
  gsap:       'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js',
  scrollTrig: 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js',
  lenis:      'https://cdn.jsdelivr.net/npm/lenis@1.1.14/dist/lenis.min.js',
  tilt:       'https://cdn.jsdelivr.net/npm/vanilla-tilt@1.8.1/dist/vanilla-tilt.min.js',
  typed:      'https://cdn.jsdelivr.net/npm/typed.js@2.1.0/dist/typed.umd.js',
  countup:    'https://cdn.jsdelivr.net/npm/countup.js@2.8.0/dist/countUp.umd.js',
};

// ── Reusable JS snippets (composed per style) ─────────────────────────────────

// GSAP scroll reveals + hero entrance
// Safety-first: if GSAP fails to load from CDN, the fallback makes everything
// visible so sections are never stuck at opacity 0.
const JS_GSAP = `
(function(){
  // Fallback — runs immediately if GSAP is missing
  function showAll(){
    document.querySelectorAll('.reveal').forEach(function(el){
      el.style.opacity='1';el.style.transform='none';
    });
  }
  if(typeof gsap==='undefined'){ showAll(); return; }
  try{
    gsap.registerPlugin(ScrollTrigger);
    // Set initial hidden state via JS (not CSS) so content is visible when JS is off
    gsap.set('.reveal',{opacity:0,y:45});
    // Hero entrance
    gsap.from('.hero-name',   {opacity:0,y:70,duration:1.2,ease:'power4.out',delay:0.15});
    gsap.from('.hero-title',  {opacity:0,y:35,duration:1,  ease:'power3.out',delay:0.45});
    gsap.from('.hero-contact',{opacity:0,y:20,duration:.8, ease:'power2.out',delay:0.75});
    // Scroll reveals
    gsap.utils.toArray('.reveal').forEach(function(el){
      gsap.fromTo(el,{opacity:0,y:45},{
        opacity:1,y:0,duration:0.85,ease:'power3.out',
        scrollTrigger:{trigger:el,start:'top 88%',once:true}
      });
    });
    // Stagger card grids
    gsap.utils.toArray('.card-grid').forEach(function(grid){
      gsap.fromTo(grid.querySelectorAll('.card'),{opacity:0,y:30,scale:0.97},{
        opacity:1,y:0,scale:1,duration:0.65,ease:'power2.out',stagger:0.1,
        scrollTrigger:{trigger:grid,start:'top 85%',once:true}
      });
    });
  }catch(e){ showAll(); }
})();
`.trim();

// Lenis smooth scroll (integrate with GSAP ticker)
const JS_LENIS = `
const _lenis = new Lenis({lerp:0.1,wheelMultiplier:1.2});
_lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add(t=>_lenis.raf(t*1000));
gsap.ticker.lagSmoothing(0);
`.trim();

// Vanilla Tilt on .card elements
const JS_TILT = `
VanillaTilt.init(document.querySelectorAll('.card,.bento-cell'),{
  max:7,speed:500,glare:true,'max-glare':0.12,scale:1.02
});
`.trim();

// Typed.js — expects <span id="typed-el"></span> in the hero
const JS_TYPED = `
if(document.getElementById('typed-el')){
  new Typed('#typed-el',{
    strings:['software engineer.','problem solver.','competitive programmer.','builder.'],
    typeSpeed:65,backSpeed:35,loop:true,backDelay:1800,startDelay:1000
  });
}
`.trim();

// CountUp — expects data-countup="42" on stat elements
const JS_COUNTUP = `
document.querySelectorAll('[data-countup]').forEach(el=>{
  const obs=new IntersectionObserver(([e])=>{
    if(e.isIntersecting){
      new CountUp(el,+el.dataset.countup,{duration:2.5,separator:','}).start();
      obs.disconnect();
    }
  },{threshold:0.5});
  obs.observe(el);
});
`.trim();

// Magnetic button effect (pure JS, no lib needed)
const JS_MAGNETIC = `
document.querySelectorAll('.btn').forEach(btn=>{
  btn.addEventListener('mousemove',e=>{
    const r=btn.getBoundingClientRect();
    const x=(e.clientX-r.left-r.width/2)*0.25;
    const y=(e.clientY-r.top-r.height/2)*0.25;
    btn.style.transform=\`translate(\${x}px,\${y}px)\`;
  });
  btn.addEventListener('mouseleave',()=>btn.style.transform='');
});
`.trim();

export const VISUAL_STYLES = [

  // ─────────────────────────────────────────────────────────────────────────
  // 1. MIDNIGHT GLASS
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'midnight-glass',
    fonts: `<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">`,
    css(p, s, bg1, bg2) {
      return `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:'Plus Jakarta Sans',sans-serif;background:linear-gradient(-45deg,${bg1},${bg2},#050508,${bg1});background-size:400% 400%;animation:bgShift 18s ease infinite;color:rgba(255,255,255,.9);min-height:100vh;line-height:1.6}
@keyframes bgShift{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}

/* NAV */
nav{position:fixed;top:0;left:0;right:0;z-index:999;display:flex;justify-content:space-between;align-items:center;padding:.9rem 2.5rem;background:rgba(0,0,0,.35);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border-bottom:1px solid rgba(255,255,255,.07)}
.nav-name{font-family:'Syne',sans-serif;font-weight:700;font-size:1.1rem;background:linear-gradient(135deg,${p},${s});-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.nav-links{display:flex;gap:2rem}
.nav-links a{color:rgba(255,255,255,.6);text-decoration:none;font-size:.85rem;font-weight:500;letter-spacing:.03em;transition:color .2s}
.nav-links a:hover{color:${p}}

/* LAYOUT */
.container{max-width:1140px;margin:0 auto;padding:0 2rem}
section{padding:7rem 0}

/* HERO */
.hero{min-height:100vh;display:flex;flex-direction:column;justify-content:center;padding-top:5rem}
.hero-name{font-family:'Syne',sans-serif;font-weight:800;font-size:clamp(3.5rem,8vw,7rem);line-height:1.05;background:linear-gradient(135deg,${p} 0%,${s} 60%,rgba(255,255,255,.9) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;filter:drop-shadow(0 0 40px ${p}55)}
.hero-title{font-size:clamp(1rem,2vw,1.3rem);color:rgba(255,255,255,.5);font-weight:300;margin-top:.75rem;letter-spacing:.1em;text-transform:uppercase}
.hero-contact{display:flex;gap:1rem;margin-top:2.5rem;flex-wrap:wrap}

/* CARDS */
.card{background:rgba(255,255,255,.05);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,.09);border-radius:20px;padding:2rem;transition:all .35s cubic-bezier(.4,0,.2,1)}
.card:hover{background:rgba(255,255,255,.09);border-color:rgba(255,255,255,.18);transform:translateY(-6px);box-shadow:0 24px 60px rgba(0,0,0,.4),0 0 0 1px rgba(255,255,255,.04),0 0 40px ${p}22}
.card-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:1.5rem}

/* TYPOGRAPHY */
.section-heading{font-family:'Syne',sans-serif;font-weight:800;font-size:clamp(1.8rem,4vw,2.8rem);background:linear-gradient(135deg,${p},${s});-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:3rem}
.section-label{font-size:.75rem;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:${p};margin-bottom:.5rem}
.gradient-text{background:linear-gradient(135deg,${p},${s});-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.muted{color:rgba(255,255,255,.45)}
.text-sm{font-size:.85rem}

/* BUTTONS */
.btn{display:inline-flex;align-items:center;gap:.5rem;padding:.85rem 2.2rem;border-radius:9999px;background:linear-gradient(135deg,${p},${s});color:#fff;font-weight:700;font-size:.88rem;letter-spacing:.04em;border:none;cursor:pointer;text-decoration:none;transition:all .3s ease;box-shadow:0 0 30px ${p}44}
.btn:hover{transform:translateY(-3px);box-shadow:0 12px 40px ${p}66}
.btn-outline{background:transparent;border:1.5px solid ${p};color:${p};box-shadow:none}
.btn-outline:hover{background:${p};color:#fff;box-shadow:0 8px 30px ${p}44}

/* BADGES */
.badge{display:inline-block;padding:4px 14px;border-radius:9999px;border:1px solid ${p}88;color:${p};font-size:.72rem;font-weight:600;letter-spacing:.04em;transition:all .2s;cursor:default}
.badge:hover{background:${p};color:#fff;border-color:${p}}
.badges{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:1rem}

/* EXPERIENCE TIMELINE */
.timeline{position:relative;padding-left:2rem}
.timeline::before{content:'';position:absolute;left:0;top:0;bottom:0;width:2px;background:linear-gradient(to bottom,${p},${s},transparent)}
.timeline-item{position:relative;padding-bottom:3rem}
.timeline-item::before{content:'';position:absolute;left:-2.4rem;top:.4rem;width:10px;height:10px;border-radius:50%;background:${p};box-shadow:0 0 12px ${p}88}
.timeline-company{font-size:.75rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:${p};margin-bottom:.3rem}
.timeline-role{font-size:1.15rem;font-weight:700;color:rgba(255,255,255,.95);margin-bottom:.2rem}
.timeline-date{font-size:.8rem;color:rgba(255,255,255,.4);margin-bottom:.75rem}

/* SKILLS */
.skill-group{margin-bottom:2.5rem}
.skill-category{font-size:.72rem;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:.75rem}

/* DIVIDER */
.divider{height:1px;background:linear-gradient(90deg,transparent,${p}44,transparent);margin:1rem 0}

/* FOOTER */
footer{padding:4rem 0;text-align:center;border-top:1px solid rgba(255,255,255,.06)}
footer a{color:${p};text-decoration:none;font-weight:600}

/* REVEAL ANIMATION */
.reveal{opacity:1;transform:none}
.reveal.visible{opacity:1;transform:none}
/* reveal delays handled by GSAP stagger — no CSS needed */

/* RESPONSIVE */
@media(max-width:768px){nav{padding:.8rem 1.25rem}.nav-links{gap:1rem}.container{padding:0 1.25rem}section{padding:4rem 0}.hero-name{font-size:clamp(2.5rem,10vw,4rem)}.card-grid{grid-template-columns:1fr}}
`;
    },
    libs: [LIB.gsap, LIB.scrollTrig, LIB.lenis, LIB.tilt],
    js: [JS_GSAP, JS_LENIS, JS_TILT, JS_MAGNETIC].join('\n'),
    describe(p, s) {
      const moment = pick([
        'large low-opacity section numbers (01, 02, 03) behind section headings using CSS ::before',
        'a soft radial glow pseudo-element behind the hero name',
        'nav links with a small colored dot that slides in on :hover via CSS',
        'a horizontal gradient rule (primary → transparent) between each section',
      ]);
      return `Midnight Glass — dark atmospheric space, frosted surfaces, gradient glow accents.
ANIMATIONS AVAILABLE (use them):
- class="reveal" on any element → GSAP scroll fade-up (automatic)
- class="card" → Vanilla Tilt 3D hover effect (automatic)
- class="btn" → magnetic hover pull effect (automatic)
- Hero (.hero-name, .hero-title, .hero-contact) → GSAP entrance animation (automatic)
- Lenis smooth scroll is active — no extra work needed
Use .card for all content blocks. Use .timeline for experience. Use .badge for skills and tech.
Surprising design moment: ${moment}.`;
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 2. RAW SIGNAL (BRUTALIST)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'raw-signal',
    fonts: `<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">`,
    css(p) {
      const bg = '#f7f6f1';
      return `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:'Space Grotesk',sans-serif;background:${bg};color:#0a0a0a;min-height:100vh;line-height:1.55}

nav{position:fixed;top:0;left:0;right:0;z-index:999;display:flex;justify-content:space-between;align-items:center;padding:1rem 2.5rem;background:${bg};border-bottom:3px solid #0a0a0a}
.nav-name{font-weight:700;font-size:1rem;color:${p};text-transform:uppercase;letter-spacing:.08em}
.nav-links{display:flex;gap:2rem}
.nav-links a{color:#0a0a0a;text-decoration:none;font-family:'Space Mono',monospace;font-size:.78rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;transition:color .15s}
.nav-links a:hover{color:${p}}

.container{max-width:1140px;margin:0 auto;padding:0 2.5rem}
section{padding:7rem 0;border-bottom:3px solid #0a0a0a}

.hero{min-height:100vh;display:flex;flex-direction:column;justify-content:center;padding-top:5rem;border-bottom:3px solid #0a0a0a}
.hero-name{font-weight:700;font-size:clamp(3rem,9vw,7.5rem);line-height:.95;text-transform:uppercase;letter-spacing:-.03em;color:#0a0a0a}
.hero-name span{color:${p}}
.hero-title{font-family:'Space Mono',monospace;font-size:clamp(.9rem,2vw,1.1rem);color:#555;margin-top:1rem;text-transform:uppercase;letter-spacing:.1em}
.hero-contact{display:flex;gap:1rem;margin-top:3rem;flex-wrap:wrap}

.card{background:#fff;border:3px solid #0a0a0a;padding:2rem;box-shadow:6px 6px 0 #0a0a0a;transition:all .15s ease}
.card:hover{box-shadow:2px 2px 0 #0a0a0a;transform:translate(4px,4px)}
.card-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1.5rem}

.section-heading{font-weight:700;font-size:clamp(1.8rem,4vw,3rem);text-transform:uppercase;letter-spacing:-.02em;color:#0a0a0a;margin-bottom:3rem;border-left:8px solid ${p};padding-left:1rem}
.section-label{font-family:'Space Mono',monospace;font-size:.7rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:${p};margin-bottom:.4rem}
.muted{color:#666}
.text-sm{font-size:.85rem}

.btn{display:inline-flex;align-items:center;gap:.5rem;padding:.85rem 2rem;background:${p};color:#fff;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:.88rem;text-transform:uppercase;letter-spacing:.06em;border:3px solid #0a0a0a;text-decoration:none;box-shadow:4px 4px 0 #0a0a0a;transition:all .15s ease;cursor:pointer}
.btn:hover{box-shadow:1px 1px 0 #0a0a0a;transform:translate(3px,3px)}
.btn-outline{background:${bg};color:#0a0a0a}
.btn-outline:hover{background:${p};color:#fff}

.badge{display:inline-block;padding:4px 12px;border:2px solid #0a0a0a;font-family:'Space Mono',monospace;font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#0a0a0a;transition:all .15s}
.badge:hover{background:${p};border-color:${p};color:#fff}
.badges{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:1rem}

.timeline{border-left:3px solid #0a0a0a;padding-left:2rem}
.timeline-item{position:relative;padding-bottom:3rem}
.timeline-item::before{content:'';position:absolute;left:-2.55rem;top:.3rem;width:12px;height:12px;background:${p};border:2px solid #0a0a0a}
.timeline-company{font-family:'Space Mono',monospace;font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:${p}}
.timeline-role{font-size:1.2rem;font-weight:700;color:#0a0a0a;margin:.25rem 0}
.timeline-date{font-family:'Space Mono',monospace;font-size:.75rem;color:#888;margin-bottom:.75rem}

.skill-group{margin-bottom:2rem}
.skill-category{font-family:'Space Mono',monospace;font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:#888;margin-bottom:.6rem}

footer{padding:4rem 0;text-align:center}
footer a{color:${p};text-decoration:none;font-weight:700}

.reveal{opacity:1;transform:none}
.reveal.visible{opacity:1;transform:none}
/* reveal delays handled by GSAP stagger — no CSS needed */

@media(max-width:768px){nav{padding:.8rem 1.25rem}.nav-links{gap:1rem}.container{padding:0 1.25rem}section{padding:4rem 0}.hero-name{font-size:clamp(2.5rem,12vw,4.5rem)}.card-grid{grid-template-columns:1fr}}
`;
    },
    libs: [LIB.gsap, LIB.scrollTrig],
    js: [JS_GSAP, JS_MAGNETIC].join('\n'),
    describe(p) {
      return `Raw Signal — brutalist, bold, light background. No blur. Hard shadows.
ANIMATIONS AVAILABLE:
- class="reveal" → GSAP scroll fade-up (automatic)
- class="btn" → magnetic hover pull (automatic)
- Hero entrance → GSAP (automatic)
Hero name UPPERCASE and massive. Use .card for content with hard drop-shadows. Use .timeline for experience. Use .badge with monospace labels. Accent ${p} on border highlights, CTA, timeline dots.`;
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 3. GHOST LIGHT (MINIMAL)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'ghost-light',
    fonts: `<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">`,
    css(p) {
      return `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:'Inter',sans-serif;background:#fafaf8;color:#1c1917;min-height:100vh;line-height:1.7;font-weight:300}

nav{position:fixed;top:0;left:0;right:0;z-index:999;display:flex;justify-content:space-between;align-items:center;padding:.9rem 3rem;background:rgba(250,250,248,.85);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border-bottom:1px solid #e7e5e4}
.nav-name{font-family:'Instrument Serif',serif;font-style:italic;font-size:1.15rem;color:#1c1917}
.nav-links{display:flex;gap:2.5rem}
.nav-links a{color:#78716c;text-decoration:none;font-size:.82rem;font-weight:500;letter-spacing:.04em;transition:color .2s}
.nav-links a:hover{color:${p}}

.container{max-width:960px;margin:0 auto;padding:0 2.5rem}
section{padding:8rem 0;border-bottom:1px solid #e7e5e4}

.hero{min-height:100vh;display:flex;flex-direction:column;justify-content:center;padding-top:5rem}
.hero-name{font-family:'Instrument Serif',serif;font-style:italic;font-size:clamp(3rem,8vw,6.5rem);line-height:1.05;color:#1c1917;font-weight:400}
.hero-accent{color:${p}}
.hero-title{font-size:clamp(.9rem,1.8vw,1.1rem);color:#a8a29e;font-weight:400;margin-top:1rem;letter-spacing:.06em;text-transform:uppercase}
.hero-contact{display:flex;gap:1rem;margin-top:3rem;flex-wrap:wrap}
.hero-line{width:4rem;height:2px;background:${p};margin:2rem 0}

.card{background:#fff;border:1px solid #e7e5e4;border-radius:12px;padding:2rem;transition:all .3s ease;border-left:3px solid transparent}
.card:hover{border-color:#e7e5e4;border-left-color:${p};box-shadow:0 8px 32px rgba(0,0,0,.06);transform:translateX(4px)}
.card-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1.25rem}

.section-heading{font-family:'Instrument Serif',serif;font-style:italic;font-size:clamp(2rem,4vw,3rem);font-weight:400;color:#1c1917;margin-bottom:3.5rem}
.section-heading::after{content:'';display:block;width:3rem;height:2px;background:${p};margin-top:.75rem}
.section-label{font-size:.72rem;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:${p};margin-bottom:.4rem}
.muted{color:#a8a29e}
.text-sm{font-size:.85rem}

.btn{display:inline-flex;align-items:center;gap:.5rem;padding:.8rem 2rem;border-radius:4px;background:transparent;border:1.5px solid ${p};color:${p};font-weight:600;font-size:.85rem;letter-spacing:.04em;text-decoration:none;transition:all .25s ease;cursor:pointer}
.btn:hover{background:${p};color:#fff}
.btn-solid{background:${p};color:#fff}
.btn-solid:hover{background:#1c1917;border-color:#1c1917}

.badge{display:inline-block;padding:3px 12px;border-radius:4px;background:#f5f5f4;color:#57534e;font-size:.73rem;font-weight:500;letter-spacing:.03em;transition:all .2s}
.badge:hover{background:${p}18;color:${p}}
.badges{display:flex;flex-wrap:wrap;gap:.4rem;margin-top:.75rem}

.timeline{position:relative;padding-left:1.5rem}
.timeline::before{content:'';position:absolute;left:0;top:0;bottom:0;width:1px;background:#e7e5e4}
.timeline-item{position:relative;padding-bottom:3rem}
.timeline-item::before{content:'';position:absolute;left:-1.8rem;top:.5rem;width:7px;height:7px;border-radius:50%;background:${p}}
.timeline-company{font-size:.72rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:${p};margin-bottom:.25rem}
.timeline-role{font-size:1.1rem;font-weight:600;color:#1c1917;margin-bottom:.2rem}
.timeline-date{font-size:.78rem;color:#a8a29e;margin-bottom:.6rem}

.skill-group{margin-bottom:2.5rem}
.skill-category{font-size:.7rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:#a8a29e;margin-bottom:.6rem}

footer{padding:5rem 0;text-align:center}
footer a{color:${p};text-decoration:none;font-weight:500}

.reveal{opacity:1;transform:none}
.reveal.visible{opacity:1;transform:none}
.reveal-delay-1{transition-delay:.15s}
.reveal-delay-2{transition-delay:.3s}
.reveal-delay-3{transition-delay:.45s}

@media(max-width:768px){nav{padding:.8rem 1.5rem}.nav-links{gap:1.25rem}.container{padding:0 1.25rem}section{padding:5rem 0}.hero-name{font-size:clamp(2.5rem,10vw,4rem)}.card-grid{grid-template-columns:1fr}}
`;
    },
    libs: [LIB.gsap, LIB.scrollTrig, LIB.lenis],
    js: [JS_GSAP, JS_LENIS, JS_MAGNETIC].join('\n'),
    describe(p) {
      return `Ghost Light — serene, minimal, paper-white. Instrument Serif italic for hero and headings.
ANIMATIONS AVAILABLE:
- class="reveal" → GSAP slow elegant fade-up (automatic)
- class="btn" → magnetic hover pull (automatic)
- Lenis butter-smooth scroll is active
- Hero entrance → GSAP (automatic)
Everything breathes — extreme whitespace. Use .card with left-border hover. Accent ${p} as hairline accents: card left border, heading underline, timeline dots.`;
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 4. SIGNAL NOISE (TERMINAL / DEV)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'signal-noise',
    fonts: `<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;0,700;1,300&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">`,
    css(p) {
      return `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:'JetBrains Mono',monospace;background:#0d1117;color:#e6edf3;min-height:100vh;line-height:1.6}

nav{position:fixed;top:0;left:0;right:0;z-index:999;display:flex;justify-content:space-between;align-items:center;padding:.8rem 2.5rem;background:#161b22;border-bottom:1px solid #30363d}
.nav-name{font-family:'JetBrains Mono',monospace;font-weight:700;font-size:.9rem;color:${p}}
.nav-links{display:flex;gap:1.75rem}
.nav-links a{color:#8b949e;text-decoration:none;font-size:.8rem;font-weight:400;letter-spacing:.02em;transition:color .2s}
.nav-links a::before{content:'./';color:#30363d;transition:color .2s}
.nav-links a:hover{color:${p}}
.nav-links a:hover::before{color:${p}}

.container{max-width:1100px;margin:0 auto;padding:0 2rem}
section{padding:6rem 0;border-top:1px solid #21262d}

.hero{min-height:100vh;display:flex;flex-direction:column;justify-content:center;padding-top:5rem}
.hero-prompt{color:#8b949e;font-size:.9rem;margin-bottom:.5rem}
.hero-prompt .dir{color:${p}}
.hero-prompt .dollar{color:#8b949e}
.hero-name{font-family:'Inter',sans-serif;font-weight:700;font-size:clamp(2.5rem,7vw,5.5rem);color:#e6edf3;line-height:1.1;margin:.25rem 0}
.cursor{display:inline-block;width:.08em;height:.85em;background:${p};margin-left:.1em;vertical-align:middle;animation:blink 1.1s step-end infinite}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
.hero-title{color:#8b949e;font-size:.9rem;margin-top:.5rem}
.hero-contact{display:flex;gap:1rem;margin-top:2.5rem;flex-wrap:wrap}

.card{background:#161b22;border:1px solid #30363d;border-radius:8px;padding:1.75rem;transition:border-color .25s,box-shadow .25s}
.card:hover{border-color:${p}88;box-shadow:0 0 0 1px ${p}22,0 8px 24px rgba(0,0,0,.4)}
.card-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1rem}

.section-heading{font-size:1rem;font-weight:700;color:#8b949e;margin-bottom:2.5rem;letter-spacing:.02em}
.section-heading::before{content:'// ';color:#30363d}
.section-heading span{color:${p}}
.section-label{font-size:.72rem;color:#8b949e;letter-spacing:.1em;text-transform:uppercase;margin-bottom:.3rem}
.muted{color:#8b949e}
.text-sm{font-size:.8rem}

.btn{display:inline-flex;align-items:center;gap:.5rem;padding:.65rem 1.5rem;border-radius:6px;background:${p};color:#fff;font-family:'JetBrains Mono',monospace;font-weight:700;font-size:.78rem;letter-spacing:.04em;border:none;cursor:pointer;text-decoration:none;transition:all .2s}
.btn:hover{filter:brightness(1.15);box-shadow:0 0 20px ${p}55}
.btn-outline{background:transparent;border:1px solid #30363d;color:#e6edf3}
.btn-outline:hover{border-color:${p};color:${p};background:transparent}

.badge{display:inline-block;padding:3px 10px;border-radius:4px;background:#21262d;border:1px solid #30363d;color:#8b949e;font-size:.7rem;font-weight:400;letter-spacing:.02em;transition:all .2s}
.badge:hover{border-color:${p}88;color:${p}}
.badges{display:flex;flex-wrap:wrap;gap:.4rem;margin-top:.75rem}
.lang-dot{display:inline-block;width:10px;height:10px;border-radius:50%;background:${p};margin-right:.35rem;vertical-align:middle}

.timeline{border-left:1px solid #30363d;padding-left:2rem}
.timeline-item{position:relative;padding-bottom:2.5rem}
.timeline-item::before{content:'';position:absolute;left:-2.37rem;top:.45rem;width:9px;height:9px;border-radius:50%;background:${p};border:2px solid #0d1117;box-shadow:0 0 8px ${p}}
.timeline-company{font-size:.72rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:${p};margin-bottom:.25rem}
.timeline-role{font-size:1rem;font-weight:700;color:#e6edf3;margin-bottom:.15rem}
.timeline-date{font-size:.75rem;color:#8b949e;font-style:italic;margin-bottom:.6rem}

.skill-group{margin-bottom:2rem}
.skill-category{font-size:.7rem;color:#8b949e;letter-spacing:.1em;text-transform:uppercase;margin-bottom:.5rem}
.skill-category::before{content:'# ';color:#30363d}

footer{padding:3.5rem 0;text-align:center;border-top:1px solid #21262d}
footer a{color:${p};text-decoration:none;font-weight:700}

.reveal{opacity:1;transform:none}
.reveal.visible{opacity:1;transform:none}
.reveal-delay-1{transition-delay:.08s}
.reveal-delay-2{transition-delay:.16s}
.reveal-delay-3{transition-delay:.24s}

@media(max-width:768px){nav{padding:.8rem 1.25rem}.nav-links{gap:1rem}.container{padding:0 1.25rem}section{padding:4rem 0}.hero-name{font-size:clamp(2rem,9vw,3.5rem)}.card-grid{grid-template-columns:1fr}}
`;
    },
    libs: [LIB.gsap, LIB.scrollTrig, LIB.typed],
    js: [JS_GSAP, JS_TYPED, JS_MAGNETIC].join('\n'),
    describe(p) {
      return `Signal Noise — GitHub dark, monospace everything, developer aesthetic.
ANIMATIONS AVAILABLE:
- class="reveal" → GSAP fast snap-in (automatic)
- class="btn" → magnetic hover pull (automatic)
- Hero entrance → GSAP (automatic)
- TYPING EFFECT: add <span id="typed-el"></span> after the hero name — Typed.js will animate it cycling through role descriptions automatically
- class="cursor" on a | span → CSS blink animation
Hero starts with fake terminal prompt (.hero-prompt div with .dir and $ spans). Use .card for panels. Section headings with // prefix. .lang-dot for skill language dots. Accent ${p} is the live indicator.`;
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 5. EDITORIAL
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'editorial',
    fonts: `<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">`,
    css(p, s, bg1) {
      const dark = coin();
      const bg = dark ? bg1 : '#f5f0e8';
      const txt = dark ? 'rgba(245,240,232,.92)' : '#1a0f00';
      const muted = dark ? 'rgba(245,240,232,.45)' : '#8a7560';
      const cardBg = dark ? 'rgba(255,255,255,.04)' : '#fffdf9';
      const cardBorder = dark ? 'rgba(255,255,255,.1)' : '#e8e0d0';
      return `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:'DM Sans',sans-serif;background:${bg};color:${txt};min-height:100vh;line-height:1.7;font-weight:300}

nav{position:fixed;top:0;left:0;right:0;z-index:999;display:flex;justify-content:space-between;align-items:center;padding:1rem 3rem;background:${bg};border-bottom:1px solid ${cardBorder};opacity:.97}
.nav-name{font-family:'Playfair Display',serif;font-style:italic;font-size:1.15rem;color:${txt}}
.nav-links{display:flex;gap:2.5rem}
.nav-links a{color:${muted};text-decoration:none;font-size:.83rem;font-weight:500;letter-spacing:.06em;text-transform:uppercase;transition:color .2s}
.nav-links a:hover{color:${p}}

.container{max-width:1100px;margin:0 auto;padding:0 3rem}
section{padding:8rem 0;border-bottom:1px solid ${cardBorder}}

.hero{min-height:100vh;display:flex;flex-direction:column;justify-content:flex-end;padding:5rem 0 6rem}
.hero-name{font-family:'Playfair Display',serif;font-weight:900;font-size:clamp(3.5rem,9vw,8rem);line-height:.95;color:${txt};letter-spacing:-.02em}
.hero-name em{color:${p};font-style:italic}
.hero-title{font-size:clamp(.9rem,1.8vw,1.1rem);color:${muted};font-weight:400;margin-top:1.5rem;letter-spacing:.12em;text-transform:uppercase}
.hero-rule{width:5rem;height:3px;background:linear-gradient(90deg,${p},${s});margin:2rem 0}
.hero-contact{display:flex;gap:1rem;flex-wrap:wrap}

.card{background:${cardBg};border:1px solid ${cardBorder};border-radius:4px;padding:2.25rem;transition:all .3s ease;border-top:3px solid transparent}
.card:hover{border-top-color:${p};box-shadow:0 12px 40px rgba(0,0,0,.1);transform:translateY(-4px)}
.card-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1.5rem}

.section-heading{font-family:'Playfair Display',serif;font-style:italic;font-weight:700;font-size:clamp(2.2rem,5vw,3.5rem);color:${txt};margin-bottom:4rem;position:relative;padding-top:1.5rem}
.section-heading::before{content:'';position:absolute;top:0;left:0;width:3rem;height:2px;background:${p}}
.section-label{font-size:.72rem;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:${p};margin-bottom:.4rem}
.muted{color:${muted}}
.text-sm{font-size:.85rem}

.btn{display:inline-flex;align-items:center;gap:.5rem;padding:.85rem 2.25rem;background:${p};color:#fff;font-family:'DM Sans',sans-serif;font-weight:700;font-size:.88rem;letter-spacing:.04em;border:none;text-decoration:none;transition:all .25s;cursor:pointer}
.btn:hover{background:${s};transform:translateY(-2px);box-shadow:0 8px 24px ${p}44}
.btn-outline{background:transparent;border:1.5px solid ${p};color:${p}}
.btn-outline:hover{background:${p};color:#fff}

.badge{display:inline-block;padding:4px 14px;border:1px solid ${cardBorder};color:${muted};font-size:.73rem;font-weight:500;letter-spacing:.04em;border-radius:2px;transition:all .2s}
.badge:hover{border-color:${p};color:${p}}
.badges{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:.75rem}

.timeline{padding-left:0}
.timeline-item{padding:2rem 0 2rem 2rem;border-left:2px solid ${cardBorder};position:relative;margin-left:1rem}
.timeline-item::before{content:'';position:absolute;left:-.45rem;top:2.35rem;width:.75rem;height:.75rem;border-radius:50%;background:${p}}
.timeline-company{font-size:.72rem;font-weight:600;letter-spacing:.15em;text-transform:uppercase;color:${p}}
.timeline-role{font-family:'Playfair Display',serif;font-size:1.3rem;font-weight:700;color:${txt};margin:.25rem 0}
.timeline-date{font-size:.78rem;color:${muted};margin-bottom:.75rem;font-style:italic}

.pull-quote{font-family:'Playfair Display',serif;font-style:italic;font-size:clamp(1.3rem,3vw,1.9rem);color:${txt};border-left:4px solid ${p};padding-left:2rem;margin:3rem 0;line-height:1.4;font-weight:400}

.skill-group{margin-bottom:2.5rem}
.skill-category{font-family:'Playfair Display',serif;font-style:italic;font-size:1.1rem;color:${txt};margin-bottom:.75rem}

footer{padding:5rem 0;text-align:center;border-bottom:none}
footer a{color:${p};text-decoration:none;font-weight:600}

.reveal{opacity:1;transform:none}
.reveal.visible{opacity:1;transform:none}
.reveal-delay-1{transition-delay:.15s}
.reveal-delay-2{transition-delay:.3s}
.reveal-delay-3{transition-delay:.45s}

@media(max-width:768px){nav{padding:.9rem 1.5rem}.nav-links{gap:1.25rem}.container{padding:0 1.5rem}section{padding:5rem 0}.hero-name{font-size:clamp(2.8rem,10vw,5rem)}.card-grid{grid-template-columns:1fr}}
`;
    },
    libs: [LIB.gsap, LIB.scrollTrig, LIB.lenis],
    js: [JS_GSAP, JS_LENIS, JS_MAGNETIC].join('\n'),
    describe(p) {
      return `Editorial — magazine gravity, Playfair Display for all headings and the hero.
ANIMATIONS AVAILABLE:
- class="reveal" → GSAP slow editorial fade (automatic, 1s ease)
- class="btn" → magnetic hover pull (automatic)
- Lenis smooth scroll active
- Hero entrance → GSAP (automatic)
Hero name bottom-aligned with huge Playfair Display type and a .hero-rule gradient stripe. Use .pull-quote for a standout achievement (Playfair italic, large, with colored left border). .timeline for experience. Top border on .card hover. Accent ${p} for the rule, timeline dot, .pull-quote border.`;
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 6. BENTO MOSAIC
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'bento-mosaic',
    fonts: `<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;700;900&display=swap" rel="stylesheet">`,
    css(p, s, bg1, bg2) {
      return `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:'Outfit',sans-serif;background:linear-gradient(135deg,${bg1} 0%,${bg2} 60%,#09090b 100%);color:rgba(255,255,255,.9);min-height:100vh;line-height:1.55}

nav{position:fixed;top:0;left:0;right:0;z-index:999;display:flex;justify-content:space-between;align-items:center;padding:.9rem 2.5rem;background:rgba(0,0,0,.4);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-bottom:1px solid rgba(255,255,255,.08)}
.nav-name{font-weight:700;font-size:1rem;background:linear-gradient(135deg,${p},${s});-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.nav-links{display:flex;gap:2rem}
.nav-links a{color:rgba(255,255,255,.55);text-decoration:none;font-size:.83rem;font-weight:500;transition:color .2s}
.nav-links a:hover{color:${p}}

.container{max-width:1200px;margin:0 auto;padding:0 2rem}
section{padding:6rem 0}

/* BENTO GRID */
.bento{display:grid;grid-template-columns:repeat(12,1fr);grid-auto-rows:minmax(80px,auto);gap:1rem}
.bento-cell{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.09);border-radius:24px;padding:2rem;transition:all .3s cubic-bezier(.4,0,.2,1);overflow:hidden}
.bento-cell:hover{background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.16);transform:scale(1.01);box-shadow:0 20px 50px rgba(0,0,0,.4)}
.bento-hero{grid-column:span 7;grid-row:span 4;background:rgba(255,255,255,.06)}
.bento-about{grid-column:span 5;grid-row:span 4}
.bento-stat{grid-column:span 3;grid-row:span 2;text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center}
.bento-accent{background:linear-gradient(135deg,${p},${s});border-color:transparent}
.bento-accent .stat-value,.bento-accent .stat-label{color:#fff}
.bento-wide{grid-column:span 8;grid-row:span 3}
.bento-side{grid-column:span 4;grid-row:span 3}
.bento-full{grid-column:span 12}
.bento-half{grid-column:span 6;grid-row:span 3}

.stat-value{font-weight:900;font-size:2.5rem;background:linear-gradient(135deg,${p},${s});-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;line-height:1}
.stat-label{font-size:.72rem;font-weight:500;color:rgba(255,255,255,.45);text-transform:uppercase;letter-spacing:.1em;margin-top:.3rem}

.hero-name{font-weight:900;font-size:clamp(2.5rem,5vw,4.5rem);line-height:1;background:linear-gradient(135deg,${p} 0%,${s} 50%,rgba(255,255,255,.9) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.hero-title{font-size:1rem;color:rgba(255,255,255,.5);font-weight:400;margin-top:.75rem;letter-spacing:.06em}
.hero-contact{display:flex;gap:.75rem;margin-top:2rem;flex-wrap:wrap}

.section-heading{font-weight:800;font-size:clamp(1.5rem,3vw,2.2rem);background:linear-gradient(135deg,${p},${s});-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:1.5rem}
.section-label{font-size:.7rem;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,.35);margin-bottom:.3rem}
.muted{color:rgba(255,255,255,.45)}
.text-sm{font-size:.83rem}
.gradient-text{background:linear-gradient(135deg,${p},${s});-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}

.btn{display:inline-flex;align-items:center;gap:.5rem;padding:.75rem 1.75rem;border-radius:12px;background:linear-gradient(135deg,${p},${s});color:#fff;font-weight:700;font-size:.85rem;border:none;cursor:pointer;text-decoration:none;transition:all .3s;box-shadow:0 0 20px ${p}44}
.btn:hover{transform:translateY(-3px);box-shadow:0 12px 36px ${p}66}
.btn-outline{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.15);box-shadow:none;color:rgba(255,255,255,.9)}
.btn-outline:hover{background:rgba(255,255,255,.1);border-color:${p}}

.badge{display:inline-block;padding:4px 12px;border-radius:8px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);color:rgba(255,255,255,.75);font-size:.72rem;font-weight:500;transition:all .2s}
.badge:hover{background:${p}28;border-color:${p}88;color:${p}}
.badges{display:flex;flex-wrap:wrap;gap:.4rem;margin-top:.75rem}

.timeline{border-left:1px solid rgba(255,255,255,.1);padding-left:1.5rem}
.timeline-item{position:relative;padding-bottom:2.5rem}
.timeline-item::before{content:'';position:absolute;left:-1.9rem;top:.4rem;width:9px;height:9px;border-radius:50%;background:linear-gradient(135deg,${p},${s})}
.timeline-company{font-size:.7rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:${p}}
.timeline-role{font-size:1.1rem;font-weight:700;color:rgba(255,255,255,.95);margin:.2rem 0}
.timeline-date{font-size:.78rem;color:rgba(255,255,255,.4);margin-bottom:.6rem}

.skill-group{margin-bottom:2rem}
.skill-category{font-size:.7rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.35);margin-bottom:.6rem}

footer{padding:4rem 0;text-align:center;border-top:1px solid rgba(255,255,255,.07)}
footer a{color:${p};text-decoration:none;font-weight:600}

.reveal{opacity:1;transform:none}
.reveal.visible{opacity:1;transform:none}
/* reveal delays handled by GSAP stagger — no CSS needed */

@media(max-width:900px){.bento{grid-template-columns:1fr 1fr;grid-auto-rows:auto}.bento-hero,.bento-about,.bento-wide,.bento-side,.bento-half{grid-column:span 2}.bento-stat{grid-column:span 1}.bento-full{grid-column:span 2}}
@media(max-width:600px){nav{padding:.8rem 1.25rem}.nav-links{gap:1rem}.container{padding:0 1rem}.bento{grid-template-columns:1fr;gap:.75rem}.bento-hero,.bento-about,.bento-wide,.bento-side,.bento-half,.bento-stat,.bento-full{grid-column:span 1}.hero-name{font-size:clamp(2rem,9vw,3rem)}}
`;
    },
    libs: [LIB.gsap, LIB.scrollTrig, LIB.tilt, LIB.countup],
    js: [JS_GSAP, JS_TILT, JS_COUNTUP, JS_MAGNETIC].join('\n'),
    describe(p, s) {
      return `Bento Mosaic — the entire page is a bento grid. Asymmetric, modern, kinetic.
ANIMATIONS AVAILABLE:
- class="reveal" → GSAP scale-in bounce (automatic)
- class="bento-cell" / class="card" → Vanilla Tilt 3D hover (automatic)
- class="btn" → magnetic pull (automatic)
- COUNTUP: add data-countup="13" to any .stat-value element — it animates from 0 to that number on scroll (e.g. <span class="stat-value" data-countup="13">13</span>)
- Hero entrance → GSAP (automatic)
Use .bento grid container. .bento-hero (7 cols, 4 rows). .bento-stat cells with data-countup on .stat-value for animated numbers (competitions placed, projects built, languages, years). .bento-accent for one gradient-filled standout stat. .bento-wide for featured job/project. .bento-half for other projects. Gradient text everywhere. Accent ${p} to ${s}.`;
    },
  },
];

// Theme → visual style mapping
const THEME_STYLE_MAP = {
  purple: 'midnight-glass',
  blue:   'signal-noise',
  pink:   'editorial',
  green:  'ghost-light',
  red:    'raw-signal',
  yellow: 'bento-mosaic',
  gray:   'ghost-light',
  dark:   'signal-noise',
};

export function selectVisualStyle(theme) {
  const styleId = THEME_STYLE_MAP[theme];
  const style   = styleId
    ? VISUAL_STYLES.find(s => s.id === styleId) || VISUAL_STYLES[0]
    : VISUAL_STYLES[Math.floor(Math.random() * VISUAL_STYLES.length)];
  return style;
}
