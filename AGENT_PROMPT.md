# KRYTO STUDIOS — MASTER AI AGENT PROMPT
> Feed this entire file to your AI coding agent (Antigravity, Cursor, Claude Code, etc.) as the system prompt or first message. It contains everything the agent needs to build the complete website without asking clarifying questions.

---

## WHO YOU ARE BUILDING FOR

You are building the official website for **Kryto Studios**, a premium digital studio based in **Ambikapur, Chhattisgarh, India**. The studio provides:

1. **Web Development** — Custom websites, landing pages, full-stack web apps
2. **App Development** — iOS and Android mobile applications
3. **Redesigning** — UI/UX overhauls of existing websites and apps
4. **Photo & Video Editing** — High-end photo retouching, cinematic video editing, color grading
5. **Enterprise Management Systems** — Full custom software (proven with Srijan Institute Ambikapur)

**Proven Client Work:**
- **Srijan Institute Ambikapur** — Built a complete institution management system covering: student fee management, marks/grades, student biodata, teacher management, salary processing, expense tracking, administrative reporting. This is the crown jewel case study and must be featured prominently.

**Brand Personality:** Premium. Cinematic. Trustworthy. Bold. Not generic. This is NOT a template site — every visual decision must feel custom-built.

---

## TECH STACK — NON-NEGOTIABLE

```
Frontend:     HTML5 + CSS3 + Vanilla JavaScript (no framework unless specified)
3D Engine:    Three.js (CDN) for hero section
Animations:   GSAP 3 + ScrollTrigger plugin (CDN)
Smooth Scroll: Lenis.js (CDN)
Tilt Effect:  VanillaTilt.js (CDN) for service cards
Particles:    Custom Three.js — NO tsparticles or particles.js
Icons:        Lucide Icons (CDN) or Tabler Icons (CDN)
Fonts:        Google Fonts — "Space Grotesk" (headings) + "Inter" (body)
Contact Form: Formspree (free tier) — endpoint to be filled by owner
Booking:      Calendly embed widget (owner adds their Calendly link)
Gallery:      Vanilla JS masonry with Lightbox2 (CDN)
Map:          Leaflet.js (CDN) — no Google Maps API key needed
Build:        Pure static files — no bundler, no npm required
Hosting-ready: Netlify / Vercel / GitHub Pages compatible
```

**All libraries MUST be loaded via CDN. No npm installs. The final output must be openable by double-clicking index.html in a browser.**

---

## VISUAL IDENTITY — FOLLOW EXACTLY

```
Primary Background:    #080808  (near black)
Secondary Background:  #0f0f0f
Card Background:       #141414
Border Color:          #1e1e1e
Accent Primary:        #7c6ff7  (electric violet)
Accent Secondary:      #4ecb8d  (teal green)
Accent Tertiary:       #f07a3a  (warm orange — used sparingly)
Text Primary:          #ffffff
Text Secondary:        #a0a0a0
Text Muted:            #555555
Font Heading:          'Space Grotesk', sans-serif
Font Body:             'Inter', sans-serif
Border Radius Cards:   12px
Border Radius Buttons: 8px
Transition Speed:      0.3s ease
```

**Custom Cursor:**
- Replace default cursor with a small 8px glowing violet dot
- On hover over any link or button: cursor expands to 40px hollow ring
- Implement in pure CSS + JS, no library

---

## FILE STRUCTURE — CREATE EXACTLY THIS

```
kryto-studios/
├── index.html                  ← Main page (all sections)
├── css/
│   ├── reset.css               ← CSS reset + base variables
│   ├── main.css                ← Global styles, typography, layout
│   ├── components.css          ← Buttons, cards, badges, tags
│   ├── animations.css          ← Keyframes, scroll animations
│   └── responsive.css          ← All media queries
├── js/
│   ├── cursor.js               ← Custom cursor logic
│   ├── hero.js                 ← Three.js hero (Concept 4 — Device Orbit)
│   ├── lenis.js                ← Smooth scroll init
│   ├── gsap-animations.js      ← All ScrollTrigger animations
│   ├── tilt.js                 ← VanillaTilt service cards
│   ├── gallery.js              ← Masonry gallery + filter + lightbox
│   ├── counter.js              ← CountUp stats animation
│   ├── navbar.js               ← Sticky nav + mobile menu
│   ├── booking.js              ← Calendly embed toggle
│   ├── feedback.js             ← Feedback/support form logic
│   └── contact.js              ← Contact form + Formspree
├── assets/
│   ├── images/
│   │   ├── logo.svg            ← Kryto Studios logo (owner provides)
│   │   ├── logo-white.svg      ← White version
│   │   ├── favicon.ico
│   │   ├── og-image.jpg        ← 1200x630 social share image
│   │   ├── case-study/
│   │   │   └── srijan-*.jpg    ← Srijan project screenshots
│   │   ├── gallery/
│   │   │   ├── web/            ← Web project thumbnails
│   │   │   ├── app/            ← App project thumbnails
│   │   │   └── media/          ← Photo/video work thumbnails
│   │   └── team/               ← Team member photos
│   └── videos/
│       └── showreel.mp4        ← Optional: studio showreel
├── README.md                   ← Setup and deployment guide
└── AGENT_PROMPT.md             ← This file
```

---

## SECTION-BY-SECTION BUILD INSTRUCTIONS

### SECTION 1 — NAVIGATION (Sticky)

**Behavior:**
- Fixed top, starts transparent, becomes `background: rgba(8,8,8,0.92)` with `backdrop-filter: blur(20px)` after scrolling 80px
- Height: 72px
- Left: Logo SVG (40px tall)
- Center: Nav links — Home, Services, Work, About, Contact
- Right: "Let's Talk" CTA button (accent violet, 8px radius)
- Mobile: hamburger icon → full-screen overlay menu slides in from right
- Active section highlighting: JS IntersectionObserver highlights current nav link

**Mobile Menu:**
- Full viewport overlay, `background: #080808`
- Links stacked vertically, 48px tap targets
- Close button top-right
- Subtle stagger animation on links appearing

---

### SECTION 2 — HERO (Three.js — Concept 4: Floating Device Orbit)

This is the most important section. Build it exactly as described.

**Layout:** Full viewport height (100vh). Dark background #080808.

**Three.js Scene:**

Build a Three.js scene with the following elements:

1. **Central Logo Object:**
   - A `THREE.IcosahedronGeometry` (radius 1.2, detail 1) as the core shape
   - Material: `THREE.MeshPhysicalMaterial` with `color: 0x7c6ff7`, `metalness: 0.8`, `roughness: 0.1`, `envMapIntensity: 1`
   - Slowly rotates: `mesh.rotation.y += 0.003` per frame
   - "KRYTO" text rendered as a `THREE.Mesh` using a flat `TextGeometry` floating above the icosahedron — if TextGeometry is unavailable, use an HTML overlay absolutely positioned over the canvas center

2. **Orbiting Device Cards (5 devices):**
   - Create 5 `THREE.Group` objects placed on an elliptical orbit path
   - Orbit formula: `x = cos(angle) * 3.5`, `y = sin(angle * 0.4) * 0.8`, `z = sin(angle) * 2.2`
   - Each device is a flat `THREE.BoxGeometry(1.8, 1.1, 0.06)` (landscape card shape)
   - Materials: front face = `THREE.MeshPhysicalMaterial` with a canvas texture showing project mockup text; sides and back = dark metallic material `color: 0x111111`
   - The 5 devices and their canvas textures:

     **Device 1 — "Srijan Institute ERP"**
     Canvas texture: dark blue background `#0d1b2a`, white text "Srijan Institute", subtitle "Full ERP System", small grid of colored boxes simulating a dashboard UI

     **Device 2 — "Web Development"**
     Canvas texture: dark green background `#0d2218`, browser chrome bar at top, wireframe lines below simulating a website layout

     **Device 3 — "Mobile App"**
     Canvas texture: dark purple background `#1a0d2e`, phone bezel shape, app UI elements (status bar, cards)

     **Device 4 — "Photo & Video"**
     Canvas texture: dark warm background `#1a0a00`, film strip aesthetic, color grading bars

     **Device 5 — "Redesign"**
     Canvas texture: dark teal background `#001a1a`, before/after split line down center, left side wireframe, right side polished UI

   - Orbit speed: `angle += 0.004` per frame
   - Devices always face the camera (use `device.lookAt(camera.position)` but only on Y axis)
   - **Hover interaction:** Use raycasting. When mouse hovers a device:
     - That device moves forward toward camera by 0.8 units (smooth lerp)
     - Its scale lerps to 1.2x
     - A tooltip HTML element appears near the device showing name + "View Work →"
   - **Click interaction:** Clicking a device scrolls the page to the `#work` section

3. **Particle Field Background:**
   - 800 `THREE.Points` randomly scattered in a sphere of radius 12
   - Size: 0.03, Color: `0x7c6ff7` at 40% opacity
   - Rotate entire particle system very slowly: `particles.rotation.y += 0.0003`

4. **Lighting:**
   - `THREE.AmbientLight(0xffffff, 0.3)`
   - `THREE.PointLight(0x7c6ff7, 2, 20)` — follows mouse position (update based on `mousemove`)
   - `THREE.PointLight(0x4ecb8d, 1, 15)` — static, positioned at `(-4, 3, -4)`

5. **Mouse Parallax:**
   - On `mousemove`, gently shift the entire scene group: `group.rotation.y += (targetX - group.rotation.y) * 0.05`

6. **HTML Overlay on hero (positioned absolutely over canvas):**
   - Left side of hero: 
     - Small tag: `[ DIGITAL STUDIO ]` in violet
     - H1: "We Build Digital Experiences That Convert." — 72px, Space Grotesk 700
     - Subtitle: "Web • App • Design • Media — Trusted by institutions across Chhattisgarh" — 18px, muted
     - Two buttons: "See Our Work ↓" (filled violet) + "Book a Call →" (outlined)
     - Below buttons: 3 micro-stats in a row: `12+ Projects` | `100% Satisfaction` | `3+ Years`
   - Scroll indicator: bottom center, bouncing arrow down

7. **Canvas:** Full width, full height. `position: absolute; top: 0; left: 0; z-index: 0`
   HTML overlay: `position: absolute; z-index: 10; left: 8%; top: 50%; transform: translateY(-50%)`

---

### SECTION 3 — TRUST STRIP (Marquee)

- Infinite auto-scroll horizontal strip
- Dark background, subtle top/bottom border lines `#1e1e1e`
- Contains: Logo placeholder + "Srijan Institute Ambikapur" | divider | "12+ Projects Delivered" | divider | "Chhattisgarh's Premium Studio" | divider | "Web • App • Design • Media" | divider | "Trusted Since 2021" — repeats
- CSS-only animation: `@keyframes marquee` — no JS needed
- Fade masks on left and right edges using CSS `mask-image: linear-gradient`

---

### SECTION 4 — SERVICES (3D Tilt Cards)

**Heading:** "What We Build" — centered, 48px
**Subheading:** "End-to-end digital solutions, handcrafted for your business" — muted

**6 Service Cards** in a 3-column grid (2 columns on tablet, 1 on mobile):

Each card uses `data-tilt` attribute for VanillaTilt. Config: `{ max: 15, speed: 400, glare: true, "max-glare": 0.2 }`

Card structure:
```
[Large Icon — 48px Lucide]
[Service Name — 20px 600]
[2-line description]
[3 bullet features — small, muted]
[Bottom: "Explore →" link — accent color on hover]
[Subtle glowing border on hover: box-shadow: 0 0 30px rgba(124,111,247,0.2)]
```

The 6 services:

**Card 1 — Web Development**
Icon: `Globe` | Color accent: violet
Description: "Custom websites and web applications built for performance and conversion."
Features: Responsive Design, SEO Optimized, Fast Loading

**Card 2 — App Development**
Icon: `Smartphone` | Color accent: teal
Description: "iOS and Android apps that users actually want to open every day."
Features: Native Performance, Intuitive UI, Cross-Platform

**Card 3 — Redesigning**
Icon: `Layers` | Color accent: orange
Description: "Transform outdated interfaces into modern, conversion-focused designs."
Features: UX Audit First, Brand Consistency, A/B Tested Layouts

**Card 4 — Photo Editing**
Icon: `Camera` | Color accent: violet
Description: "Professional photo retouching and color grading for brands and individuals."
Features: Color Grading, Background Removal, Commercial Ready

**Card 5 — Video Editing**
Icon: `Film` | Color accent: teal
Description: "Cinematic video editing, motion graphics, and reel production."
Features: Color Correction, Sound Design, Export Ready

**Card 6 — Enterprise Systems**
Icon: `Database` | Color accent: orange
Description: "Custom management systems for schools, businesses, and institutions."
Features: Fee Management, Reports & Analytics, Role-Based Access

---

### SECTION 5 — CASE STUDY (Srijan Institute — Pinned Horizontal Scroll)

**This section proves Kryto's credibility. Build it with care.**

**Implementation:**
- GSAP ScrollTrigger horizontal scroll panel
- Section is `height: 500vh` with `position: sticky` inner container
- As user scrolls down, the inner content slides LEFT revealing 4 panels

**Panel 1 — The Problem:**
- Dark blue tinted card `#0a0f1a`
- Large quote: *"Managing 500+ students' fees, marks, and records manually was costing us hours every day."*
- Attribution: Srijan Institute Administration, Ambikapur
- Background: subtle grid pattern

**Panel 2 — What We Built:**
- Feature list with animated checkmarks appearing one by one:
  - Student Fee Collection & Tracking
  - Marks & Grade Management
  - Student Biodata Records
  - Teacher Profile Management
  - Salary Processing System
  - Expense Tracking & Reports
  - Administrative Dashboard
  - Role-Based Login (Admin / Teacher / Staff)

**Panel 3 — The Dashboard Preview:**
- Mockup of the ERP system: a dark-themed admin dashboard UI drawn entirely in CSS/HTML (no real screenshot needed — simulate it)
- Left sidebar with nav items
- Main area with stat cards: Total Students, Fees Collected, Pending Fees, Active Teachers
- A simple data table below
- Right side: a mini bar chart using CSS bars
- This entire mock is inside a `border-radius: 12px; overflow: hidden` container that looks like a browser window (with the three dots — red/yellow/green — at top left)

**Panel 4 — The Results:**
- 3 large result numbers with CountUp animation:
  - `500+` Students Managed
  - `8` Modules Delivered
  - `60%` Time Saved on Admin Work
- Client quote with star rating (5 stars in gold)
- CTA: "Want something like this? Let's talk →"

---

### SECTION 6 — WORK GALLERY

**Heading:** "Our Work" — centered

**Filter tabs:** All | Web | App | Photo & Video | Systems
- Active tab: filled violet pill
- Click switches filter with smooth CSS transition (no page reload)
- Use `data-category` attribute on each card + JS class toggling

**Gallery Grid:**
- CSS masonry grid: `columns: 3` on desktop, 2 on tablet, 1 on mobile
- `break-inside: avoid` on each card
- Cards are different heights (some landscape, some portrait, some square) — use `aspect-ratio` property

**Each Gallery Card:**
```html
<div class="gallery-card" data-category="web">
  <div class="gallery-img-wrap">
    <img src="assets/images/gallery/..." alt="Project name" loading="lazy">
    <div class="gallery-overlay">
      <span class="gallery-tag">Web Development</span>
      <h3 class="gallery-name">Project Name</h3>
      <button class="gallery-view">View →</button>
    </div>
  </div>
</div>
```

- Overlay slides up from bottom on hover (CSS transform translateY)
- Click opens Lightbox2 with full image + caption
- Include 12 placeholder cards with gradient backgrounds if real images not available (use CSS linear-gradient as img fallback)

**Placeholder gallery items to create:**
1. Srijan Institute ERP (category: systems)
2. School Website — Ambikapur (category: web)
3. Restaurant Landing Page (category: web)
4. Fitness App UI (category: app)
5. E-commerce App (category: app)
6. Real Estate Website (category: web)
7. Wedding Photography Edit (category: photo-video)
8. Product Commercial (category: photo-video)
9. Portrait Retouch (category: photo-video)
10. NGO Website (category: web)
11. Inventory System (category: systems)
12. YouTube Channel Thumbnails (category: photo-video)

---

### SECTION 7 — HOW WE WORK (Process Timeline)

**Heading:** "Our Process" — centered
**Subheading:** "How we go from idea to launch, every single time"

**5 steps in vertical timeline:**
- Center vertical line (1px, `#1e1e1e`) with an animated violet fill that grows as user scrolls (GSAP ScrollTrigger `scaleY`)
- Each step alternates left-right layout (desktop) / all left (mobile)
- Step appears with a slide-in + fade from its side when it enters viewport

Steps:
1. **Discover** — "We learn your business, goals, and users deeply before touching any design."
2. **Design** — "Wireframes, mockups, and prototypes — you approve every pixel before we code."
3. **Develop** — "Clean, performant code built on modern standards. No shortcuts, ever."
4. **Test** — "Cross-browser, cross-device, real-user testing before anything goes live."
5. **Deliver & Support** — "Launch day isn't the end. We stay with you, fix issues, and iterate."

Each step has:
- Step number (large, muted — `01`, `02`...)
- Icon (Lucide)
- Title + description
- A small "tech tag" — e.g., step 2 shows "Figma • Adobe XD"; step 3 shows "HTML • React • Node.js"

---

### SECTION 8 — STATS COUNTER

Full-width dark section with 4 large animated counters (CountUp.js):
- `12+` Projects Delivered
- `5+` Industries Served
- `500+` Students Managed via Systems
- `100%` Client Satisfaction Rate

Counters animate when section enters viewport (IntersectionObserver).
Subtitle under each number in muted text.

---

### SECTION 9 — ABOUT KRYTO

Two-column layout (60/40):

**Left column:**
- Small label: `[ ABOUT US ]` in violet
- Heading: "We're a studio that actually gives a damn."
- 3 paragraphs:
  - "Kryto Studios was built in Ambikapur with one belief: businesses in Chhattisgarh deserve world-class digital products, not generic templates."
  - "We've built enterprise management systems for educational institutions, commercial websites, mobile apps, and professional media content — all from the same team, with the same care."
  - "When you work with us, you're not a ticket number. You're a partner."
- 3 value pills: `Honest Timelines` | `Clean Code` | `Real Support`

**Right column:**
- Team member cards (2-up grid):
  - Each card: circular photo placeholder, name, role, 1-line bio
  - Placeholder: CSS gradient circle with initials
  - Add roles: Founder & Developer | UI/UX Designer | Video Editor | Support

---

### SECTION 10 — TESTIMONIALS

**Heading:** "What Clients Say"

Auto-rotating carousel (pure JS, no library):
- 3 testimonial cards visible on desktop, 1 on mobile
- Auto-rotates every 5 seconds
- Pause on hover
- Manual prev/next arrows
- Dot indicators below

**Testimonials to include:**

1. *"Kryto Studios built our entire institution management system. Fee collection, marks, salaries — everything is now digital and error-free. Exceptional work."*
   — Administration, Srijan Institute, Ambikapur ★★★★★

2. *"Professional, fast, and they actually listened to what we needed. Our website went from outdated to stunning in 3 weeks."*
   — Small Business Owner, Ambikapur ★★★★★

3. *"The video editing quality is on another level. Our product commercial got 3x more engagement than anything we made before."*
   — Brand Owner, Chhattisgarh ★★★★★

Card structure: Large quotation mark (`"`) in violet, quote text, divider, name + role + star rating + organization logo placeholder.

---

### SECTION 11 — BOOK AN APPOINTMENT

**Heading:** "Let's Schedule a Call"
**Subheading:** "30 minutes. No commitment. Just a conversation about your project."

Two columns:
**Left:** What to expect list:
- We'll review your project requirements
- You'll get a ballpark timeline and budget
- We'll suggest the best tech approach
- You'll leave knowing exactly what to do next
+ A small "No spam, no hard sell" reassurance badge

**Right:** Calendly embed
```html
<div class="calendly-inline-widget" 
     data-url="YOUR_CALENDLY_LINK_HERE" 
     style="min-width:320px;height:630px;">
</div>
<script src="https://assets.calendly.com/assets/external/widget.js"></script>
```

- If Calendly link not provided, show a placeholder card with a "Add your Calendly link in booking.js" comment
- Also add a floating "Book a Call" button in bottom-right corner (above WhatsApp button)

---

### SECTION 12 — CONTACT US

**Heading:** "Get In Touch"

Two-column layout:

**Left — Contact Info:**
- Address: Ambikapur, Chhattisgarh, India
- Email: contact@krytostudios.com (placeholder — owner updates)
- Phone: placeholder
- Working Hours: Mon–Sat, 10am–7pm IST
- Social links: Instagram | LinkedIn | GitHub | Behance (placeholder links)
- Small embedded Leaflet.js map showing Ambikapur location
  - Dark tile layer: use CartoDB dark tiles `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png`
  - Marker with violet custom icon
  - Coordinates: `23.1196, 83.1925` (Ambikapur)

**Right — Contact Form:**
```
Full Name *
Email Address *
Phone Number
Service Needed (dropdown): Web Dev | App Dev | Redesign | Photo Editing | Video Editing | Enterprise System | Other
Project Budget (dropdown): Under ₹10,000 | ₹10,000–₹50,000 | ₹50,000–₹2,00,000 | ₹2,00,000+
Message *
[ Send Message ] button
```

- Form submits to Formspree: `action="https://formspree.io/f/YOUR_FORM_ID"`
- Client-side validation with inline error messages (no alert boxes)
- On success: form hides, a success animation plays (checkmark draws itself in CSS)
- All fields: dark background `#141414`, 1px border `#1e1e1e`, focus border turns violet

---

### SECTION 13 — SUPPORT & FEEDBACK

This is a separate tab/accordion below the contact section.

**Two tabs:** `Report an Issue` | `Leave Feedback`

**Report an Issue form:**
```
Your Name *
Email *
Project / Service (text input)
Issue Type (dropdown): Bug | Delay | Communication | Quality | Other
Describe the Issue * (textarea, min 100 chars)
Urgency (radio): Low | Medium | High
[ Submit Report ] — sends to same Formspree with different subject tag
```

**Leave Feedback form:**
```
Your Name *
Star Rating (1–5 interactive stars — CSS + JS, no library)
What we did well (textarea)
What we can improve (textarea)
Would you recommend us? (Yes / No toggle)
[ Submit Feedback ]
```

- Star rating: 5 stars, clicking highlights stars 1 through N in gold
- After submission: thank you message with animation

---

### SECTION 14 — FLOATING ELEMENTS (Always Visible)

**WhatsApp Button:**
```html
<a href="https://wa.me/91XXXXXXXXXX" target="_blank" class="whatsapp-float">
  <i data-lucide="message-circle"></i>
  <span>Chat on WhatsApp</span>
</a>
```
- Position: `bottom: 24px; right: 24px` (fixed)
- Green background `#25d366`
- On hover: slides label text out from left
- Pulse animation ring around it

**Book a Call Button:**
- Position: `bottom: 88px; right: 24px` (fixed, above WhatsApp)
- Violet background, opens Calendly popup on click (`Calendly.initPopupWidget`)

**Scroll to Top Button:**
- Appears after scrolling 600px
- Bottom-left, minimal style
- Smooth scroll to top on click

---

### SECTION 15 — FOOTER

Dark `#080808`, `border-top: 1px solid #1e1e1e`

**Layout (4 columns):**

Column 1 — Brand:
- Logo (white version)
- 2-line tagline: "Building digital experiences that matter — from Ambikapur to everywhere."
- Social icons row

Column 2 — Services:
- Web Development
- App Development
- Redesigning
- Photo & Video Editing
- Enterprise Systems

Column 3 — Company:
- About Us
- Our Work
- Process
- Testimonials
- Book a Call

Column 4 — Contact:
- Ambikapur, Chhattisgarh
- Email
- Phone
- Working Hours

**Bottom bar:**
`© 2025 Kryto Studios. All rights reserved.` | `Privacy Policy` | `Terms of Service`
Right side: `Built with ❤ in Ambikapur`

---

## ANIMATIONS — COMPLETE SPECIFICATION

### On Page Load (no scroll required):
1. Navbar fades in from top (0.6s delay 0.1s)
2. Hero text: each word slides up from 30px below + fades in, staggered 0.08s per word
3. Hero buttons scale from 0.9 to 1 (0.4s, 0.8s delay)
4. Three.js scene fades in via canvas opacity 0→1 (1.2s)

### Scroll Triggered (GSAP ScrollTrigger):
- **Section headings:** `y: 40 → 0`, `opacity: 0 → 1`, `start: "top 85%"`
- **Service cards:** stagger 0.12s, `y: 60 → 0`, `opacity: 0 → 1`
- **Gallery cards:** stagger 0.08s, `scale: 0.95 → 1`, `opacity: 0 → 1`
- **Process steps:** slide in from alternating sides, `x: ±80 → 0`
- **Stats counters:** trigger CountUp when section is 60% in view
- **Testimonials:** `opacity: 0 → 1`, gentle `y: 20 → 0`
- **Case study panels:** GSAP horizontal pin — see Section 5 above

### Micro-interactions:
- Buttons: on hover `transform: translateY(-2px)`, on click `transform: translateY(0) scale(0.98)`
- Nav links: underline grows from left (CSS `::after` with `width: 0 → 100%`)
- Gallery cards: image `transform: scale(1.05)` on hover (inside `overflow: hidden` parent)
- Service cards: VanillaTilt + glowing box-shadow on hover
- Form inputs: border color transition to violet on focus
- Star rating: each star turns gold with a micro bounce (`@keyframes starPop`)

---

## PERFORMANCE REQUIREMENTS

- All images: use `loading="lazy"` attribute
- Three.js canvas: implement `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))` to prevent GPU overload on retina
- Reduce Three.js quality on mobile: detect `window.innerWidth < 768` and set `renderer.setPixelRatio(1)` + reduce particle count to 200
- On mobile: disable VanillaTilt (it causes jitter on touch devices)
- GSAP and Three.js are heavy — load them with `defer` attribute
- Intersection Observer for lazy animation triggers (not scroll events)

---

## RESPONSIVE BREAKPOINTS

```
Mobile:   < 640px
Tablet:   640px – 1024px
Desktop:  > 1024px
```

- Hero text: 72px → 48px → 32px
- Service grid: 3col → 2col → 1col
- Gallery: 3col → 2col → 1col
- Case study: horizontal scroll → vertical stack on mobile
- Three.js hero: full on desktop/tablet; simplified (no orbit, just central shape + particles) on mobile
- Navigation: full links → hamburger menu on mobile

---

## PLACEHOLDER CONTENT INSTRUCTIONS

Where real assets don't exist, use these fallbacks:

**Images:** CSS gradient rectangles with relevant color schemes per category
- Web projects: `linear-gradient(135deg, #0d1b2a, #1a3a5c)`
- App projects: `linear-gradient(135deg, #1a0d2e, #3d1a6b)`
- Photo/Video: `linear-gradient(135deg, #1a0a00, #5c2a00)`
- Systems: `linear-gradient(135deg, #0d2218, #1a5c3a)`

**Logo:** Generate a text-based logo using CSS:
```css
.logo { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 22px; color: #fff; letter-spacing: -0.02em; }
.logo span { color: #7c6ff7; }
```
Renders as: **Kryto** <span style="color: violet">Studios</span>

**Team photos:** Circular divs with initials and gradient backgrounds

---

## IMPORTANT NOTES FOR THE AGENT

1. **Do not use any CSS framework** (no Bootstrap, no Tailwind). Pure custom CSS only.
2. **Every animation must be interruptible** — if user scrolls fast, GSAP handles it gracefully.
3. **Test the Three.js hero** — ensure it degrades gracefully if WebGL is unavailable (show a static gradient fallback).
4. **The case study section is the #1 trust signal** — do not rush it. Make it polished.
5. **Comment every JS file** clearly — the owner may hand this to another developer later.
6. **All form submissions** must show clear success/error states. Never a blank page or browser default alert.
7. **WhatsApp number** is a placeholder — owner must update `91XXXXXXXXXX` in the HTML.
8. **Calendly link** is a placeholder — owner must update `YOUR_CALENDLY_LINK_HERE`.
9. **Formspree endpoint** — owner must create free account at formspree.io and paste their form ID.
10. **The site must score 90+ on Google PageSpeed** for mobile — this is achievable with the lazy loading and pixel ratio cap already specified.
