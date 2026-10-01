import { profile, stats, experience, projects, skills, beyond } from "./data.js";
import { initScene } from "./scene.js";
import { initAssistant } from "./assistant.js";

const $ = (s, r = document) => r.querySelector(s);
const el = (tag, cls, html) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html != null) n.innerHTML = html;
  return n;
};
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

const icons = {
  github: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.26 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z"/></svg>',
  youtube: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="m22 7-10 6L2 7"/></svg>',
  ext: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M8 7h9v9"/></svg>',
  trophy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4ZM17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="4"/><path d="m10 9 5 3-5 3V9Z"/></svg>',
  spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/></svg>',
};

function socialLinks() {
  const items = [
    ["github", profile.github, "GitHub"],
    ["linkedin", profile.linkedin, "LinkedIn"],
    ["youtube", profile.youtube, "YouTube"],
    ["mail", `mailto:${profile.email}`, "Email"],
  ].filter(([, href]) => href);
  return items
    .map(([ic, href, label]) => `<a href="${esc(href)}" ${href.startsWith("mailto") ? "" : 'target="_blank" rel="noopener"'} aria-label="${label}" title="${label}">${icons[ic]}</a>`)
    .join("");
}

/* ─── Hero ─── */
function renderHero() {
  const name = $("#hero-name");
  let i = 0;
  name.innerHTML = profile.name
    .split(" ")
    .map((w) => `<span class="w">${[...w].map((c) => `<span class="ch" style="animation-delay:${0.25 + i++ * 0.035}s">${esc(c)}</span>`).join("")}</span>`)
    .join(" ");
  $("#hero-tagline").textContent = profile.tagline;
  $("#hero-socials").innerHTML = socialLinks();
  $("#contact-socials").innerHTML = socialLinks();
  const mail = $("#contact-email");
  mail.href = `mailto:${profile.email}`;
  mail.textContent = profile.email;
  $("#footer-text").textContent = `© ${new Date().getFullYear()} ${profile.name}`;

  // typewriter
  const out = $("#typed");
  if (reduced) { out.textContent = profile.roles[0]; return; }
  let r = 0, c = 0, del = false;
  const step = () => {
    const word = profile.roles[r];
    out.textContent = word.slice(0, c);
    if (!del && c === word.length) { del = true; return setTimeout(step, 1600); }
    if (del && c === 0) { del = false; r = (r + 1) % profile.roles.length; }
    c += del ? -1 : 1;
    setTimeout(step, del ? 35 : 75);
  };
  setTimeout(step, 1200);
}

/* ─── About ─── */
function renderAbout() {
  $("#about-text").innerHTML = profile.about.map((p) => `<p>${esc(p)}</p>`).join("");
  $("#about-loc").textContent = profile.location;
  $("#stats").innerHTML = stats
    .map((s) => `<div class="stat glass"><div class="num"><b data-count="${s.value}" data-dec="${s.decimals || 0}">0</b><span>${esc(s.suffix)}</span></div><p>${esc(s.label)}</p></div>`)
    .join("");
}

function countUp(node) {
  const target = parseFloat(node.dataset.count), dec = +node.dataset.dec;
  if (reduced) { node.textContent = target.toFixed(dec); return; }
  const start = performance.now(), dur = 1800;
  const f = (now) => {
    const k = Math.min(1, (now - start) / dur);
    const e = 1 - Math.pow(1 - k, 4);
    node.textContent = (target * e).toFixed(dec);
    if (k < 1) requestAnimationFrame(f);
  };
  requestAnimationFrame(f);
}

/* ─── Projects ─── */
function projectCategory(p) {
  const k = p.kind.toLowerCase();
  if (k.includes("ai") || k.includes("rag")) return "AI";
  if (k.includes("backend")) return "Backend";
  if (k.includes("mobile")) return "Mobile";
  return "Full-Stack";
}

function renderProjects() {
  const grid = $("#projects-grid");
  grid.innerHTML = projects
    .map((p) => `
      <article class="card glass reveal" style="--c:${p.color}" data-cat="${projectCategory(p)}">
        ${p.featured ? '<span class="badge">featured</span>' : ""}
        <div class="planet"></div>
        <div class="kind">${esc(p.kind)}</div>
        <h3>${esc(p.title)}</h3>
        <p>${esc(p.description)}</p>
        <div class="tags">${p.stack.map((s) => `<span>${esc(s)}</span>`).join("")}</div>
        ${p.link ? `<a class="ext" href="${esc(p.link)}" target="_blank" rel="noopener" aria-label="Open ${esc(p.title)}">${icons.ext}</a>` : ""}
      </article>`)
    .join("");

  const cats = ["All", ...new Set(projects.map(projectCategory))];
  const filters = $("#filters");
  filters.innerHTML = cats.map((c, i) => `<button role="tab" class="${i === 0 ? "active" : ""}" data-cat="${c}">${c}</button>`).join("");
  filters.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    filters.querySelectorAll("button").forEach((x) => x.classList.toggle("active", x === b));
    grid.querySelectorAll(".card").forEach((card) => {
      card.classList.toggle("hide", b.dataset.cat !== "All" && card.dataset.cat !== b.dataset.cat);
    });
  });

  // 3D tilt + spotlight
  if (!matchMedia("(hover: hover)").matches || reduced) return;
  grid.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      card.style.transform = `rotateY(${(x - 0.5) * 14}deg) rotateX(${(0.5 - y) * 14}deg) translateZ(10px)`;
      card.style.setProperty("--mx", `${x * 100}%`);
      card.style.setProperty("--my", `${y * 100}%`);
    });
    card.addEventListener("pointerleave", () => { card.style.transform = ""; });
  });
}

/* ─── Experience ─── */
function renderExperience() {
  $("#timeline").innerHTML = experience
    .map((x) => `
      <li class="reveal">
        <div class="glass">
          <div class="tl-top"><h3>${esc(x.role)}</h3><span class="tl-period">${esc(x.period)}</span></div>
          <div class="tl-org">${x.link ? `<a href="${esc(x.link)}" target="_blank" rel="noopener">${esc(x.org)}</a>` : esc(x.org)}</div>
          <ul>${x.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>
          <div class="tags">${x.tags.map((t) => `<span>${esc(t)}</span>`).join("")}</div>
        </div>
      </li>`)
    .join("");
}

/* ─── Skills: 3D tag sphere ─── */
function renderSkills() {
  $("#skill-chips").innerHTML = skills.map((s) => `<span>${esc(s)}</span>`).join("");
  const box = $("#tag-sphere");
  const n = skills.length;
  const nodes = skills.map((s, i) => {
    const span = el("span", null, esc(s));
    box.appendChild(span);
    // Fibonacci sphere distribution
    const y = 1 - (i / (n - 1)) * 2;
    const rad = Math.sqrt(1 - y * y);
    const th = Math.PI * (3 - Math.sqrt(5)) * i;
    return { span, x: Math.cos(th) * rad, y, z: Math.sin(th) * rad };
  });

  let ax = 0.003, ay = 0.004, dragging = false, lx = 0, ly = 0, visible = false;
  const rotate = (p, a, b) => {
    // rotate around X by a, Y by b
    let { x, y, z } = p;
    const cy = Math.cos(a), sy = Math.sin(a);
    [y, z] = [y * cy - z * sy, y * sy + z * cy];
    const cx = Math.cos(b), sx = Math.sin(b);
    [x, z] = [x * cx + z * sx, -x * sx + z * cx];
    p.x = x; p.y = y; p.z = z;
  };
  box.addEventListener("pointerdown", (e) => { dragging = true; lx = e.clientX; ly = e.clientY; box.setPointerCapture(e.pointerId); });
  box.addEventListener("pointerup", () => (dragging = false));
  box.addEventListener("pointercancel", () => (dragging = false));
  box.addEventListener("pointermove", (e) => {
    const r = box.getBoundingClientRect();
    if (dragging) {
      ay = (e.clientX - lx) * 0.0025; ax = -(e.clientY - ly) * 0.0025;
      lx = e.clientX; ly = e.clientY;
    } else if (e.pointerType === "mouse") {
      ay = ((e.clientX - r.left) / r.width - 0.5) * 0.03;
      ax = -((e.clientY - r.top) / r.height - 0.5) * 0.03;
    }
  });
  new IntersectionObserver(([en]) => (visible = en.isIntersecting)).observe(box);

  const frame = () => {
    if (visible) {
      const R = box.clientWidth * 0.4;
      nodes.forEach((p) => {
        rotate(p, ax, ay);
        const scale = (p.z + 2) / 3;
        p.span.style.transform = `translate(-50%,-50%) translate3d(${p.x * R}px, ${p.y * R}px, 0) scale(${scale})`;
        p.span.style.opacity = (0.25 + 0.75 * ((p.z + 1) / 2)).toFixed(2);
        p.span.style.zIndex = Math.round((p.z + 1) * 50);
      });
      if (!dragging) { ax += (0.002 - ax) * 0.01; ay += (0.003 - ay) * 0.01; }
    }
    requestAnimationFrame(frame);
  };
  frame();
}

/* ─── Beyond ─── */
function renderBeyond() {
  $("#beyond-grid").innerHTML = beyond
    .map((b) => {
      const tag = b.link ? "a" : "div";
      const attrs = b.link ? ` href="${esc(b.link)}" target="_blank" rel="noopener"` : "";
      return `<${tag} class="beyond glass reveal"${attrs}>
        <div class="ic">${icons[b.icon] || ""}</div>
        <h3>${esc(b.title)}</h3>
        <p>${esc(b.text)}</p>
        ${b.link ? '<span class="more">visit →</span>' : ""}
      </${tag}>`;
    })
    .join("");
}

/* ─── Scroll & reveal ─── */
function initScroll(scene) {
  const nav = $(".nav"), bar = $("#progress-bar");
  const links = [...document.querySelectorAll(".nav nav a")];
  const sections = links.map((a) => $(a.getAttribute("href")));
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = max > 0 ? scrollY / max : 0;
    bar.style.transform = `scaleX(${p})`;
    nav.classList.toggle("scrolled", scrollY > 30);
    scene.setScroll(p);
    let current = -1;
    sections.forEach((s, i) => { if (s && s.getBoundingClientRect().top < innerHeight * 0.45) current = i; });
    links.forEach((a, i) => a.classList.toggle("active", i === current));
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      e.target.querySelectorAll("[data-count]").forEach(countUp);
      io.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  document.querySelectorAll(".reveal").forEach((n, i) => {
    n.style.transitionDelay = `${(i % 3) * 0.08}s`;
    io.observe(n);
  });
}

/* ─── Boot ─── */
renderHero();
renderAbout();
renderProjects();
renderExperience();
renderSkills();
renderBeyond();
const scene = initScene($("#space"), { projects });
initScroll(scene);
initAssistant({ profile, experience, projects, skills, beyond, stats });
const hideLoader = () => $("#loader").classList.add("done");
scene.ready.then(() => setTimeout(hideLoader, 350));
setTimeout(hideLoader, 2500); // safety net on slow devices
