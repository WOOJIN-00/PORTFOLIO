(function () {
  const $ = (s, r = document) => r.querySelector(s);

  /* ---------- helpers ---------- */
  const esc = (s = "") =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  // `code` 인라인 표기만 허용
  const rich = (s = "") => esc(s).replace(/`([^`]+)`/g, "<code>$1</code>");
  // 주석(#) 줄은 흐리게, ASA 결과(allow/drop)는 색으로 강조
  const highlightCode = (s) =>
    s
      .split("\n")
      .map((line) => {
        const e = esc(line);
        if (/^\s*#/.test(line)) return `<span class="cm">${e}</span>`;
        return e
          .replace(/(Action: allow)/g, '<span class="ok">$1</span>')
          .replace(/(Action: drop|Result: DROP|Drop-reason:.*)/g, '<span class="no">$1</span>');
      })
      .join("\n");

  /* ---------- static content ---------- */
  document.title = `${PROFILE.name} | Security Portfolio`;
  $("#brandName").textContent = PROFILE.name;
  $("#heroName").textContent = PROFILE.name;
  $("#heroTagline").textContent = PROFILE.tagline;
  $("#aboutIntro").textContent = PROFILE.intro;
  $("#footName").textContent = `${PROFILE.name} · ${PROFILE.role}`;
  $("#year").textContent = new Date().getFullYear();
  $("#updated").textContent = `최근 업데이트: ${PROFILE.updated}`;

  const stats = [
    ["Projects", PROJECTS.length],
    ["Skills", SKILLS.reduce((n, g) => n + g.items.length, 0)],
    ["Focus", "Linux · IDS/IPS"]
  ];
  $("#heroStats").innerHTML = stats.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("");

  $("#skills-grid").innerHTML = SKILLS.map(
    (g) => `<div class="skill"><h3>${esc(g.group)}</h3><ul>${g.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul></div>`
  ).join("");

  const links = [
    ["EMAIL", PROFILE.email, PROFILE.email && `mailto:${PROFILE.email}`],
    ["GITHUB", PROFILE.github, PROFILE.github],
    ["BLOG", PROFILE.blog, PROFILE.blog]
  ].filter(([, label, href]) => label && href);
  $("#contactLinks").innerHTML = links
    .map(([k, label, href]) => `<a href="${esc(href)}" target="_blank" rel="noopener"><small>${k}</small>${esc(label)}</a>`)
    .join("");
  if (PROFILE.email) $("#ctaMail").href = `mailto:${PROFILE.email}`;

  /* ---------- 걸어온 길 (교육·자격증 이력) ---------- */
  $("#pathList").innerHTML = PATH
    .map(
      (s, i) => `
      <div class="path__item">
        <div>
          <span class="path__no">0${i + 1}</span>
          <p class="path__label">${esc(s.label)}</p>
          <p class="path__desc">${esc(s.desc)}</p>
        </div>
        <div class="path__num path__num--status">${esc(s.status)}</div>
      </div>`
    )
    .join("");

  /* ---------- project list ---------- */
  let activeTag = "All";
  const allTags = ["All", ...new Set(PROJECTS.flatMap((p) => p.tags))];

  function renderChips() {
    $("#chips").innerHTML = allTags
      .map((t) => `<button class="chip" role="tab" aria-selected="${t === activeTag}" data-tag="${esc(t)}">${esc(t)}</button>`)
      .join("");
  }

  function renderCards() {
    const list = PROJECTS.filter((p) => activeTag === "All" || p.tags.includes(activeTag));
    const cards = list.map(
      (p) => `
      <button class="card" data-id="${esc(p.id)}" type="button">
        <div class="card__media"><img src="${esc(p.cover)}" alt="${esc(p.title)} 대표 이미지" loading="lazy"></div>
        <div class="card__body">
          <div class="card__meta"><span>${esc(p.period)}</span>${p.status ? `<span class="badge">${esc(p.status)}</span>` : ""}</div>
          <h3 class="card__title">${esc(p.title)}</h3>
          <p class="card__sub">${esc(p.subtitle)}</p>
          <div class="tags">${p.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
        </div>
      </button>`
    );
    if (activeTag === "All") {
      cards.push(`<div class="card card--soon"><strong>+ 다음 프로젝트</strong><span>새 작업이 생길 때마다 이곳에 추가됩니다.</span></div>`);
    }
    $("#cards").innerHTML = cards.join("");
  }

  $("#chips").addEventListener("click", (e) => {
    const b = e.target.closest(".chip");
    if (!b) return;
    activeTag = b.dataset.tag;
    renderChips();
    renderCards();
  });
  $("#cards").addEventListener("click", (e) => {
    const c = e.target.closest(".card[data-id]");
    if (c) location.hash = `#project/${c.dataset.id}`;
  });

  /* ---------- project detail ---------- */
  const detail = $("#detail");

  function figure(img, dark = true) {
    return `<figure class="fig ${dark ? "fig--dark" : ""}">
      <button type="button" data-zoom="${esc(img.src)}" data-cap="${esc(img.caption || "")}" aria-label="이미지 확대">
        <img src="${esc(img.src)}" alt="${esc(img.caption || "")}" loading="lazy">
      </button>
      ${img.caption ? `<figcaption>${esc(img.caption)}</figcaption>` : ""}
    </figure>`;
  }

  const renderers = {
    // nav 라벨이 있으면 대단원, 없으면 소제목 스타일
    text: (b) =>
      `<section class="blk${b.nav ? "" : b.title ? " blk--sub" : ""}">${b.title ? `<h3>${esc(b.title)}</h3>` : ""}<p>${rich(b.body)}</p></section>`,
    image: (b) => `<section class="blk blk--tight">${figure(b, !/architecture|topology/.test(b.src))}</section>`,
    gallery: (b) =>
      `<section class="blk blk--tight"><div class="gal gal--${b.columns || 2}">${b.images.map((i) => figure(i)).join("")}</div></section>`,
    highlights: (b) =>
      `<section class="blk">${b.title ? `<h3>${esc(b.title)}</h3>` : ""}<div class="hl">${b.items
        .map((i) => `<div><h4>${esc(i.h)}</h4><p>${rich(i.p)}</p></div>`)
        .join("")}</div></section>`,
    steps: (b) =>
      `<section class="blk blk--tight"><ol class="steps">${b.items
        .map((i) => `<li><b>${esc(i.h)}</b><span>${rich(i.p)}</span></li>`)
        .join("")}</ol></section>`,
    table: (b) =>
      `<section class="blk blk--tight"><div class="tbl-wrap"><table><thead><tr>${b.head
        .map((h) => `<th>${esc(h)}</th>`)
        .join("")}</tr></thead><tbody>${b.rows
        .map((r) => `<tr>${r.map((c) => `<td>${rich(c)}</td>`).join("")}</tr>`)
        .join("")}</tbody></table></div></section>`,
    code: (b) =>
      `<section class="blk blk--tight"><div class="code"><div class="code__bar"><i></i><i></i><i></i><span>${esc(b.title || b.lang || "")}</span></div><pre><code>${highlightCode(
        b.code
      )}</code></pre></div></section>`,
    file: (b) =>
      `<section class="blk blk--tight"><div class="file"><div><b>${esc(b.title)}</b><span>${esc(b.desc || "")}</span></div><a class="btn btn--primary" href="${esc(
        b.href
      )}" download>다운로드</a></div></section>`,
    callout: (b) => `<section class="blk blk--tight"><div class="callout"><h3>${esc(b.title)}</h3><p>${rich(b.body)}</p></div></section>`
  };

  function openProject(id) {
    const p = PROJECTS.find((x) => x.id === id);
    if (!p) return closeProject(true);

    const navItems = [];
    const body = p.blocks
      .map((b, i) => {
        let html = renderers[b.type] ? renderers[b.type](b) : "";
        if (b.nav) {
          navItems.push({ id: `sec-${i}`, label: b.nav });
          html = html.replace("<section ", `<section id="sec-${i}" `);
        }
        return html;
      })
      .join("");

    $("#detailBarTitle").textContent = p.title;
    $("#detailBody").innerHTML = `
      <p class="d-eyebrow">${esc(p.tags.join(" · "))}</p>
      <h1 class="d-title">${esc(p.title)}</h1>
      <p class="d-sub">${esc(p.subtitle)}</p>
      <p class="d-summary">${rich(p.summary)}</p>
      ${p.stats ? `<div class="d-stats">${p.stats.map((s) => `<div class="d-stat"><b>${esc(s.value)}</b><span>${esc(s.label)}</span></div>`).join("")}</div>` : ""}
      ${p.meta ? `<dl class="d-meta">${p.meta.map((m) => `<dt>${esc(m.k)}</dt><dd>${esc(m.v)}</dd>`).join("")}</dl>` : ""}
      ${navItems.length ? `<nav class="toc" aria-label="목차">${navItems.map((n) => `<button type="button" data-target="${n.id}">${esc(n.label)}</button>`).join("")}</nav>` : ""}
      ${body}`;
    detail.hidden = false;
    detail.scrollTop = 0;
    document.body.classList.add("locked");
  }

  function closeProject(replace) {
    detail.hidden = true;
    document.body.classList.remove("locked");
    if (location.hash.startsWith("#project/")) {
      history[replace ? "replaceState" : "pushState"](null, "", "#projects");
    }
  }

  function route() {
    const m = location.hash.match(/^#project\/(.+)$/);
    if (m) openProject(decodeURIComponent(m[1]));
    else {
      detail.hidden = true;
      document.body.classList.remove("locked");
    }
  }

  $("#detailBack").addEventListener("click", () => {
    location.hash = "#projects";
  });
  window.addEventListener("hashchange", route);

  // 목차 이동
  detail.addEventListener("click", (e) => {
    const t = e.target.closest(".toc button");
    if (!t) return;
    const el = document.getElementById(t.dataset.target);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  /* ---------- lightbox ---------- */
  const lb = $("#lightbox");
  const closeLb = () => {
    lb.hidden = true;
  };
  detail.addEventListener("click", (e) => {
    const z = e.target.closest("[data-zoom]");
    if (!z) return;
    $("#lightboxImg").src = z.dataset.zoom;
    $("#lightboxImg").alt = z.dataset.cap;
    $("#lightboxCap").textContent = z.dataset.cap;
    lb.hidden = false;
  });
  lb.addEventListener("click", (e) => {
    if (e.target !== $("#lightboxImg")) closeLb();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (!lb.hidden) closeLb();
    else if (!detail.hidden) location.hash = "#projects";
  });

  /* ---------- nav shadow ---------- */
  const nav = $("#nav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  renderChips();
  renderCards();
  route();
})();
