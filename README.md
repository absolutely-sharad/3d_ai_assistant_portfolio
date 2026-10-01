# 🪐 3D AI Assistant Portfolio — Sharad Singh Kushwaha

An interactive 3D space-themed developer portfolio built with **Three.js** — fly through a galaxy as you scroll, where every project is a planet — plus **Nova**, an on-page AI assistant that answers questions about my work.

**Live:** https://absolutely-sharad.github.io/3d_ai_assistant_portfolio/

## ✨ Features

- **Scroll-driven 3D flight** — the camera travels through a starfield, nebulae and an asteroid belt past one procedurally textured planet per project.
- **Ringed hero planet** with orbiting moons, fresnel atmosphere glow and mouse parallax.
- **Nova, the AI assistant** — a chat widget that answers questions about my projects, experience, skills and contact info, entirely in the browser (no API key).
- **3D tilt project cards** with spotlight hover and category filters (AI · Full-Stack · Backend · Mobile).
- **Interactive 3D skill sphere** — drag or hover to spin.
- Mission-log timeline, animated stat counters, typewriter roles, scroll progress bar.
- Responsive and mobile-tuned (fewer particles, capped pixel ratio), respects `prefers-reduced-motion`, pauses rendering when the tab is hidden.
- Zero build step: plain HTML/CSS/ES modules, Three.js vendored locally.

## 🗂 Structure

```
index.html        page markup
style.css         all styles
js/data.js        ← ALL content (edit this to update the site)
js/scene.js       Three.js galaxy scene
js/main.js        rendering, animations, interactions
js/assistant.js   Nova AI assistant
vendor/           three.module.min.js (r170)
```

## ✏️ Updating content

Everything — bio, stats, experience, projects (and their planet colours), skills — lives in [`js/data.js`](js/data.js). Add a project there and a new planet appears in the 3D scene automatically.

## 🚀 Run locally

```bash
python3 -m http.server 8000
# or: npx serve .
```
Open http://localhost:8000 (ES modules need a server, not `file://`).

## 🌐 Deploy

Hosted on **GitHub Pages** (Settings → Pages → Deploy from branch → `main` / root). Also works as-is on Vercel or Netlify.

## 📬 Contact

sharadsingh0203@gmail.com · [GitHub](https://github.com/absolutely-sharad)
