/* 프로젝트 상세 — 주소의 ?id= 로 js/projects-data.js 에서 프로젝트를 찾아 화면을 그립니다. */
(function () {
  var root = document.getElementById("project");
  var all = window.PROJECTS || {};
  var ids = Object.keys(all);
  var id = new URLSearchParams(location.search).get("id");
  var p = all[id];

  // 글자를 HTML로 해석하지 않도록 이스케이프 + `백틱` → <code>
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function rich(s) { return esc(s).replace(/`([^`]+)`/g, "<code>$1</code>"); }
  function h(title) { return title ? '<h2 class="pj-h">' + esc(title) + "</h2>" : ""; }

  if (!p) {
    root.innerHTML =
      '<p class="pj__empty">프로젝트를 찾을 수 없습니다. <a href="index.html">메인으로 돌아가기</a></p>';
    return;
  }
  document.title = p.title + " | 송우진";

  function figure(img) {
    return '<figure class="pj-fig">' +
      '<a href="' + esc(img.src) + '" target="_blank" rel="noopener" title="원본 크기로 보기">' +
      '<img src="' + esc(img.src) + '" alt="' + esc(img.caption) + '" loading="lazy"></a>' +
      (img.caption ? "<figcaption>" + rich(img.caption) + "</figcaption>" : "") +
      "</figure>";
  }

  var R = {
    text: function (b) { return h(b.title) + '<p class="pj-text">' + rich(b.body) + "</p>"; },
    image: function (b) { return figure(b); },
    gallery: function (b) {
      return h(b.title) + '<div class="pj-gallery">' + b.images.map(figure).join("") + "</div>";
    },
    table: function (b) {
      return h(b.title) + '<div class="pj-table"><table><thead><tr>' +
        b.head.map(function (c) { return "<th>" + esc(c) + "</th>"; }).join("") +
        "</tr></thead><tbody>" +
        b.rows.map(function (r) {
          return "<tr>" + r.map(function (c) { return "<td>" + rich(c) + "</td>"; }).join("") + "</tr>";
        }).join("") + "</tbody></table></div>";
    },
    highlights: function (b) {
      return h(b.title) + '<ul class="pj-hl">' + b.items.map(function (it) {
        return "<li><b>" + esc(it.h) + "</b><p>" + rich(it.p) + "</p></li>";
      }).join("") + "</ul>";
    },
    steps: function (b) {
      return h(b.title) + '<ol class="pj-steps">' + b.items.map(function (it) {
        return "<li><b>" + esc(it.h) + "</b><p>" + rich(it.p) + "</p></li>";
      }).join("") + "</ol>";
    },
    code: function (b) {
      return '<div class="pj-code">' + (b.title ? '<div class="pj-code__t">' + esc(b.title) + "</div>" : "") +
        "<pre><code>" + esc(b.code) + "</code></pre></div>";
    },
    callout: function (b) {
      return '<aside class="pj-callout"><b>' + esc(b.title) + "</b><p>" + rich(b.body) + "</p></aside>";
    },
    file: function (b) {
      return '<a class="pj-file" href="' + esc(b.href) + '" target="_blank" rel="noopener">' +
        '<span class="pj-file__ic">PDF</span><span><b>' + esc(b.title) + "</b><small>" + esc(b.desc) + "</small></span>" +
        '<span class="pj-file__go">열기 ↗</span></a>';
    }
  };

  // 이전 · 다음 프로젝트
  var i = ids.indexOf(id);
  var prev = all[ids[(i - 1 + ids.length) % ids.length]];
  var next = all[ids[(i + 1) % ids.length]];
  var prevId = ids[(i - 1 + ids.length) % ids.length];
  var nextId = ids[(i + 1) % ids.length];

  root.innerHTML =
    '<header class="pj-head reveal">' +
      '<p class="eyebrow"><span class="dot"></span>PROJECT ' + esc(p.no) + " · " + esc(p.period) + "</p>" +
      '<h1 class="pj-title">' + esc(p.title) + "</h1>" +
      '<p class="pj-sub">' + esc(p.subtitle) + "</p>" +
      '<ul class="r-tags">' + p.tags.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul>" +
      '<p class="pj-summary">' + rich(p.summary) + "</p>" +
      '<ul class="pj-stats">' + p.stats.map(function (s) {
        return "<li><b>" + esc(s.value) + "</b><span>" + esc(s.label) + "</span></li>";
      }).join("") + "</ul>" +
      '<dl class="pj-meta">' + p.meta.map(function (m) {
        return "<div><dt>" + esc(m.k) + "</dt><dd>" + esc(m.v) + "</dd></div>";
      }).join("") + "</dl>" +
    "</header>" +
    p.blocks.map(function (b) {
      var f = R[b.type];
      return f ? '<section class="pj-block reveal">' + f(b) + "</section>" : "";
    }).join("") +
    '<nav class="pj-pager" aria-label="다른 프로젝트">' +
      '<a href="project.html?id=' + encodeURIComponent(prevId) + '"><small>← 이전 프로젝트</small>' + esc(prev.title) + "</a>" +
      '<a href="project.html?id=' + encodeURIComponent(nextId) + '"><small>다음 프로젝트 →</small>' + esc(next.title) + "</a>" +
    "</nav>";

  // 돌아가기: 화면 오른쪽 아래에 떠 있는 동그란 버튼 (스크롤해도 그 자리)
  var fab = document.createElement("a");
  fab.className = "pj-fab";
  fab.href = "index.html#projects";
  fab.setAttribute("data-back", "");
  fab.setAttribute("aria-label", "프로젝트로 돌아가기");
  fab.title = "프로젝트로 돌아가기";
  fab.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/></svg>';
  document.body.appendChild(fab);

  // 오른쪽 프로젝트 목록 — 전체 프로젝트를 세로로 나열, 지금 보는 프로젝트는 강조, 누르면 그 프로젝트로 이동
  var list = document.createElement("nav");
  list.className = "pj-list";
  list.setAttribute("aria-label", "프로젝트 목록");
  list.innerHTML = '<p class="pj-list__title">PROJECTS</p><ol>' + ids.map(function (pid) {
    var q = all[pid];
    var cur = pid === id;
    return '<li><a href="project.html?id=' + encodeURIComponent(pid) + '"' + (cur ? ' class="is-current" aria-current="page"' : "") +
      ' title="' + esc(q.title) + '">' +
      '<span class="pj-list__txt"><b>' + esc(q.title) + "</b><small>" + esc(q.period) + "</small></span></a></li>";
  }).join("") + "</ol>";
  document.body.appendChild(list);

  // 메인 화면에서 들어온 경우엔 뒤로 가기(브라우저 기록)로 돌아감 — 그 외에는 링크(index.html#projects)
  document.querySelectorAll("[data-back]").forEach(function (a) {
    a.addEventListener("click", function (e) {
      var ref = (document.referrer || "").split("?")[0];
      var fromMain = /(\/|index\.html)(#[^\/]*)?$/.test(ref);   // 메인(…/ 또는 …/index.html)에서 들어왔는지
      if (fromMain && history.length > 1) {
        e.preventDefault();
        history.back();
      }
    });
  });
})();
