// ─────────────────────────────────────────────────────────────
//  "Ask Sharad's AI" — an on-page assistant that answers
//  questions about the portfolio. It runs entirely in the
//  browser (no API key needed) by matching intents against
//  the data in data.js.
// ─────────────────────────────────────────────────────────────

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9.+# ]/g, " ");

export function initAssistant(data) {
  const { profile, experience, projects, skills, beyond, stats } = data;
  const first = profile.shortName;

  const root = document.createElement("div");
  root.className = "ai";
  root.innerHTML = `
    <button class="ai-orb" aria-label="Ask ${esc(first)}'s AI assistant" aria-expanded="false">
      <span class="ai-core"></span><span class="ai-ring"></span>
      <span class="ai-label mono">Ask my AI</span>
    </button>
    <section class="ai-panel" role="dialog" aria-label="AI assistant" hidden>
      <header>
        <div class="ai-avatar"></div>
        <div><strong>Nova</strong><small class="mono">${esc(first)}'s portfolio assistant</small></div>
        <button class="ai-close" aria-label="Close">×</button>
      </header>
      <div class="ai-log" aria-live="polite"></div>
      <div class="ai-suggest"></div>
      <form class="ai-form">
        <input type="text" placeholder="Ask about projects, skills, experience…" aria-label="Your question" autocomplete="off" />
        <button type="submit" aria-label="Send">➤</button>
      </form>
    </section>`;
  document.body.appendChild(root);

  const orb = root.querySelector(".ai-orb");
  const panel = root.querySelector(".ai-panel");
  const log = root.querySelector(".ai-log");
  const form = root.querySelector(".ai-form");
  const input = form.querySelector("input");
  const suggest = root.querySelector(".ai-suggest");

  const suggestions = ["Who is Sharad?", "Best AI project?", "Work experience", "Tech stack", "Achievements", "How to contact?"];
  suggest.innerHTML = suggestions.map((s) => `<button type="button">${esc(s)}</button>`).join("");

  const list = (arr) => `<ul>${arr.map((x) => `<li>${x}</li>`).join("")}</ul>`;
  const projLine = (p) => `<b>${esc(p.title)}</b> — ${esc(p.description)} <i>(${p.stack.map(esc).join(", ")})</i>`;

  // Intent table: [keywords, answer()]
  const intents = [
    [["hi", "hello", "hey", "yo", "namaste"], () => `Hey! 👋 I'm Nova, ${esc(first)}'s assistant. Ask me about his projects, experience, skills or how to reach him.`],
    [["who", "about", "yourself", "introduce", "sharad", "bio", "summary"], () => `${profile.about.map(esc).join(" ")}`],
    [["contact", "email", "reach", "hire", "mail", "connect", "linkedin", "available"], () =>
      `You can reach ${esc(first)} at <a href="mailto:${esc(profile.email)}">${esc(profile.email)}</a>. He's open to full-stack and AI engineering roles, freelance and collaborations. Also on <a href="${esc(profile.github)}" target="_blank" rel="noopener">GitHub</a> and <a href="${esc(profile.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>.`],
    [["ai", "rag", "agent", "llm", "gemini", "langchain", "langgraph", "genai", "ml"], () =>
      `${esc(first)}'s AI work:` + list(projects.filter((p) => /ai|rag/i.test(p.kind)).map(projLine))],
    [["backend", "api", "server", "node", "express", "mongo", "database"], () =>
      `Backend highlights:` + list(projects.filter((p) => /backend|full/i.test(p.kind) || p.stack.some((s) => /node|express|mongo/i.test(s))).map(projLine))],
    [["mobile", "app", "react native", "flutter", "android", "ios"], () =>
      `Mobile work:` + list(projects.filter((p) => /mobile/i.test(p.kind)).map(projLine)) + `He has also shipped Flutter apps for clients at Infonix Cloud.`],
    [["best", "favorite", "favourite", "featured", "top", "proud", "highlight"], () =>
      `Featured projects:` + list(projects.filter((p) => p.featured).map(projLine))],
    [["project", "projects", "built", "portfolio", "work on", "made"], () =>
      `${esc(first)} has built ${projects.length} projects featured here:` + list(projects.map((p) => `<b>${esc(p.title)}</b> · ${esc(p.kind)}`)) + `Ask about any one by name!`],
    [["experience", "intern", "internship", "job", "work", "career", "company", "classplus", "infonix", "pgt"], () =>
      list(experience.map((x) => `<b>${esc(x.role)}</b> @ ${esc(x.org)} <i>(${esc(x.period)})</i><br>${x.points.map(esc).join(" ")}`))],
    [["skill", "skills", "stack", "tech", "language", "tools", "know"], () =>
      `Toolkit: ${skills.map(esc).join(" · ")}`],
    [["education", "college", "university", "degree", "gpa", "cgpa", "study", "btech"], () => {
      const ed = experience.find((x) => /b\.?tech/i.test(x.role));
      return ed ? `${esc(ed.role)} at ${esc(ed.org)} (${esc(ed.period)}). ${ed.points.map(esc).join(" ")}` : "";
    }],
    [["achievement", "achievements", "leetcode", "codechef", "competitive", "dsa", "award", "rank"], () =>
      list(stats.map((s) => `<b>${s.value}${esc(s.suffix)}</b> ${esc(s.label)}`)) + esc(beyond[0].text)],
    [["youtube", "cricket", "channel", "content", "video", "shorts"], () =>
      `${esc(first)} runs <a href="${esc(profile.youtube)}" target="_blank" rel="noopener">AnshuCricketStories</a>, a cricket channel focused on YouTube Shorts.`],
    [["workshop", "teach", "school", "students"], () => esc(beyond.find((b) => /workshop/i.test(b.title))?.text || "")],
    [["where", "location", "based", "city", "live"], () => `${esc(first)} is based in ${esc(profile.location)}.`],
    [["resume", "cv"], () => profile.resume
      ? `Here's the <a href="${esc(profile.resume)}" target="_blank" rel="noopener">résumé</a>.`
      : `Email <a href="mailto:${esc(profile.email)}">${esc(profile.email)}</a> and ${esc(first)} will share his latest résumé.`],
  ];

  function answer(q) {
    const n = " " + norm(q) + " ";
    // direct project name match wins
    const hit = projects.find((p) => {
      const words = norm(p.title).split(" ").filter((w) => w.length > 3);
      return words.length && words.filter((w) => n.includes(w)).length >= Math.min(2, words.length);
    });
    if (hit) return projLine(hit) + (hit.link ? ` <a href="${esc(hit.link)}" target="_blank" rel="noopener">Visit →</a>` : "");

    let best = null, bestScore = 0;
    intents.forEach(([keys, fn], i) => {
      let score = 0;
      keys.forEach((k) => { if (n.includes(` ${k} `) || (k.length > 4 && n.includes(k))) score += k.length > 3 ? 2 : 1; });
      // tie-breaker: earlier specific intents slightly preferred
      if (score > bestScore || (score === bestScore && score > 0 && i < best?.i)) { best = { fn, i }; bestScore = score; }
    });
    if (best) return best.fn();
    return `I'm not sure about that one — but I can tell you about ${esc(first)}'s <b>projects</b>, <b>experience</b>, <b>skills</b>, <b>achievements</b> or how to <b>contact</b> him.`;
  }

  function push(html, who) {
    const m = document.createElement("div");
    m.className = `ai-msg ${who}`;
    m.innerHTML = html;
    log.appendChild(m);
    log.scrollTop = log.scrollHeight;
    return m;
  }

  function ask(q) {
    q = q.trim();
    if (!q) return;
    push(esc(q), "me");
    const typing = push('<span class="ai-typing"><i></i><i></i><i></i></span>', "bot");
    setTimeout(() => {
      typing.innerHTML = answer(q);
      log.scrollTop = log.scrollHeight;
    }, 450 + Math.random() * 350);
  }

  let greeted = false;
  function toggle(open) {
    const isOpen = open ?? panel.hidden;
    panel.hidden = !isOpen;
    orb.setAttribute("aria-expanded", String(isOpen));
    root.classList.toggle("open", isOpen);
    if (isOpen) {
      if (!greeted) {
        greeted = true;
        push(`Hi! I'm <b>Nova</b> 🪐 — ask me anything about ${esc(first)}'s work. Try a suggestion below.`, "bot");
      }
      setTimeout(() => input.focus({ preventScroll: true }), 50);
    }
  }

  orb.addEventListener("click", () => toggle());
  root.querySelector(".ai-close").addEventListener("click", () => toggle(false));
  suggest.addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) ask(b.textContent); });
  form.addEventListener("submit", (e) => { e.preventDefault(); ask(input.value); input.value = ""; });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !panel.hidden) toggle(false); });
}
