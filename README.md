# Kryto Studios — Premium Cinematic Digital Portfolio Website

This repository contains the complete static frontend codebase for the official website of **Kryto Studios**, a premium, cinematic digital design and development studio based in **Ambikapur, Chhattisgarh, India**.

The codebase is built with modular vanilla styles and interactive JavaScript scripts, powered by 3D WebGL and GSAP animations, optimized to load entirely from direct high-speed CDNs.

---

## 📂 File Structure

```
kryto-studios/
├── index.html                  ← Main portal (all 15 visual layout sections)
├── css/
│   ├── reset.css               ← Base variables, standard layout resets
│   ├── main.css                ← Sticky headers, marquee, custom leaflet maps
│   ├── components.css          ← Service cards, buttons, badges, team grids
│   ├── animations.css          ← CSS keyframes, bouncing arrows, WhatsApp rings
│   └── responsive.css          ← Comprehensive media queries (<640px, <1024px)
├── js/
│   ├── cursor.js               ← Interactive custom physical lerp dot cursor
│   ├── hero.js                 ← 3D WebGL rotating icosahedron & orbiting mockup canvas cards
│   ├── lenis.js                ← Lenis smooth scroll engine configuration
│   ├── gsap-animations.js      ← Entry timelines, staggers, Srijan pinned horizontal scrolls
│   ├── tilt.js                 ← Specular glare VanillaTilt initializations
│   ├── gallery.js              ← Masonry tab filtering and detailed Lightbox drawers
│   ├── counter.js              ← IntersectionObserver numeric CountUp increments
│   ├── navbar.js               ← Sticky glass togglers, mobile hamburger transforms
│   ├── booking.js              ← Calendly inline widgets & popup scheduler triggers
│   ├── feedback.js             ← Support accordion, rating controls & checked overlays
│   └── contact.js              ← CartoDB Leaflet maps, validation inline messages
└── README.md                   ← Setup and deployment guide (This file)
```

---

## ⚡ Setup & Customization Guide

Because all external dependencies (Three.js, GSAP, Lenis, VanillaTilt, Leaflet, and Lucide) are loaded via high-speed CDNs, **there is no npm installation or build step required.** 

To run the site:
* **Double-click `index.html`** to open it instantly in any modern web browser, OR
* Start a local server (e.g., VS Code **Live Server** extension, Python `python -m http.server`, or Node `npx serve`).

### 1. Configure Calendly Inline & Popup Bookings
1. Open the file `js/booking.js`.
2. Locate the owner configuration block:
   ```javascript
   // Replace the placeholder below with your real Calendly scheduling link!
   const CALENDLY_LINK = "https://calendly.com/your-username/30min";
   ```
3. Update it with your custom Calendly schedule URL. The inline widget and all floating schedule triggers will immediately configure themselves.

### 2. Configure Formspree Contacts & Feedback Forms
This website contains 3 interactive forms: the main **Contact Form**, **Report an Issue**, and **Leave Feedback** forms. They are pre-styled to submit directly to Formspree:
1. Register for a free account at [Formspree.io](https://formspree.io/).
2. Create a new form and copy your unique **Form ID** (e.g., `mqkpqbzy`).
3. Open `index.html` and replace the placeholder `YOUR_FORM_ID` inside all `<form action="https://formspree.io/f/YOUR_FORM_ID" ...>` declarations with your actual Form ID.
4. If testing locally via double-clicking `index.html` (under the `file:` protocol), the forms will intercept submissions and smoothly play the visual success checks without redirecting.

### 3. Update WhatsApp Contact Widget
1. Open `index.html` and scroll to **SECTION 14 (Floating Accessibilities)**.
2. Locate the WhatsApp float link:
   ```html
   <a href="https://wa.me/91XXXXXXXXXX" target="_blank" class="whatsapp-float">
   ```
3. Replace `91XXXXXXXXXX` with your actual mobile number including the country code (e.g., `919876543210` for India).

### 4. Custom Branding & Graphics
* **Branding Name**: Edit `Kryto<span>Studios</span>` directly inside the navigation header and footer tags in `index.html` to adjust branding.
* **Leaflet Map**: To adjust the Map location or pin coordinates, modify coordinates `[23.1196, 83.1925]` (defaulting to Ambikapur, CG) inside `js/contact.js`.

---

## 🚀 Deployment

You can host this website completely for free on:
* **Vercel**: Import this static folder directly and click Deploy.
* **Netlify**: Drag and drop this folder directly into the Netlify Web interface.
* **GitHub Pages**: Push this code to a public repository, go to **Settings** → **Pages**, and enable page hosting from the `main` branch.

---

## 🎨 Visual Identity Tokens Used

* **Primary Background**: `#080808`
* **Secondary Background**: `#0f0f0f`
* **Accent Primary**: `#7c6ff7` (Electric Violet)
* **Accent Secondary**: `#4ecb8d` (Teal Green)
* **Accent Tertiary**: `#f07a3a` (Warm Orange)
* **Typography Headings**: `Space Grotesk`, sans-serif
* **Typography Body**: `Inter`, sans-serif
