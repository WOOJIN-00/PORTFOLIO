/* 첫 화면 — 와이어프레임 지구본을 그리고 경선을 천천히 회전시킵니다. */
(function () {
  var NS = "http://www.w3.org/2000/svg";
  var CX = 300, CY = 300, R = 190;
  var lat = document.getElementById("lat");
  var lon = document.getElementById("lon");
  if (!lat || !lon) return;

  function ellipse(parent, cls) {
    var e = document.createElementNS(NS, "ellipse");
    if (cls) e.setAttribute("class", cls);
    parent.appendChild(e);
    return e;
  }

  // 위선: 고정. 살짝 내려다보는 시점이라 납작한 타원으로
  [-60, -40, -20, 0, 20, 40, 60].forEach(function (deg) {
    var a = (deg * Math.PI) / 180;
    var e = ellipse(lat, deg === 20 ? "hot" : "");
    e.setAttribute("cx", CX);
    e.setAttribute("cy", CY - R * Math.sin(a));
    e.setAttribute("rx", R * Math.cos(a));
    e.setAttribute("ry", R * Math.cos(a) * 0.16);
  });

  // 경선: 9개, 그중 2개는 포인트 컬러
  var STEP = Math.PI / 9;
  var meridians = [];
  for (var i = 0; i < 9; i++) {
    var e = ellipse(lon, i === 2 || i === 6 ? "hot" : "");
    e.setAttribute("cx", CX);
    e.setAttribute("cy", CY);
    e.setAttribute("ry", R);
    meridians.push(e);
  }

  function draw(rot) {
    meridians.forEach(function (e, i) {
      e.setAttribute("rx", Math.abs(R * Math.sin(rot + i * STEP)));
    });
  }

  var still = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (still) return draw(0.35);

  var start = null;
  function tick(t) {
    if (start === null) start = t;
    draw(((t - start) / 1000) * 0.18);
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();

/* 지구본 옆 아이콘(자물쇠 / 와이파이 / 경고 / * * * *)에 마우스를 올리면 바로 옆에 프로젝트 카드가 열립니다.
   - 아이콘에서 카드로 마우스를 옮기는 동안(사이 20px)에는 닫히지 않도록 잠깐 기다림
   - 아이콘과 카드 둘 다에서 마우스가 벗어나면 닫힘 · 한 번에 하나만 열림
   - 마우스가 없는 기기(터치)와 키보드는 누르기 / 포커스로 열림 */
(function () {
  var buttons = Array.prototype.slice.call(document.querySelectorAll(".chip--btn[data-card]"));
  if (!buttons.length) return;
  var CLOSE_DELAY = 220;
  var timer = null;
  var canHover = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  function cardOf(btn) { return document.getElementById("card-" + btn.getAttribute("data-card")); }
  function set(btn, open) {
    var card = cardOf(btn);
    if (!card) return;
    card.classList.toggle("is-open", open);
    btn.classList.toggle("is-active", open);
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  }
  function openOnly(btn) {
    clearTimeout(timer);
    buttons.forEach(function (b) { set(b, b === btn); });
  }
  function closeSoon(btn) {
    clearTimeout(timer);
    timer = setTimeout(function () { set(btn, false); }, CLOSE_DELAY);
  }

  buttons.forEach(function (btn) {
    var card = cardOf(btn);
    if (canHover) {
      btn.addEventListener("mouseenter", function () { openOnly(btn); });
      btn.addEventListener("mouseleave", function () { closeSoon(btn); });
      if (card) {
        card.addEventListener("mouseenter", function () { if (btn.classList.contains("is-active")) clearTimeout(timer); });
        card.addEventListener("mouseleave", function () { closeSoon(btn); });
      }
    }
    // 키보드: 포커스가 오면 열림
    btn.addEventListener("focus", function () { if (btn.matches(":focus-visible")) openOnly(btn); });
    // 터치 · 키보드 Enter: 누르면 열고 닫기 (마우스는 올리기만으로 이미 열려 있으므로 그대로 둠)
    btn.addEventListener("click", function () {
      if (canHover && btn.classList.contains("is-active")) return;
      var open = !btn.classList.contains("is-active");
      if (open) openOnly(btn); else set(btn, false);
    });
  });
})();

/* 첫 화면 전환 — 이름(INTRO) → 지구본(PROJECTS) → 연락처(CONTACT).
   휠을 내리면 다음 화면, 올리면 이전 화면으로 같은 자리에서 바뀝니다 (페이지는 스크롤되지 않음).
   휠 · 터치 스와이프 · 방향키 · data-go 링크 모두 지원. */
(function () {
  var frame = document.getElementById("frame");
  var screens = Array.prototype.slice.call(document.querySelectorAll(".screen[data-screen]"));
  if (!frame || screens.length < 2) return;

  var NAMES = screens.map(function (s) { return s.getAttribute("data-screen"); });
  var LOCK_MS = 1100; // 전환 애니메이션 동안 연속 휠 입력 무시
  var locked = false;
  var cur = 0;

  function show(i) {
    cur = i;
    screens.forEach(function (s, k) {
      s.classList.toggle("is-current", k === i);
      s.classList.toggle("is-past", k < i);
      s.setAttribute("aria-hidden", k === i ? "false" : "true");
    });
    frame.setAttribute("data-screen", NAMES[i]);
    // 연락처 화면에 있는 동안 상단 Contact 플러그는 꽂힌(연결된) 상태로 유지
    var cta = document.querySelector(".nav__cta.plug");
    if (cta) cta.classList.toggle("is-linked", NAMES[i] === "contact");
    // 상단 메뉴의 </ 이름> 표시를 지금 화면의 메뉴로 옮김 (연락처 화면은 해당 메뉴 없음)
    document.querySelectorAll(".nav__links [data-nav]").forEach(function (a) {
      var on = a.getAttribute("data-nav") === NAMES[i];
      a.classList.toggle("is-active", on);
      if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
  }

  function go(target) {
    var i = typeof target === "number" ? target : NAMES.indexOf(target);
    if (locked || i < 0 || i >= screens.length || i === cur) return;
    locked = true;
    var leaving = screens[cur];
    show(i);
    setTimeout(function () { leaving.scrollTop = 0; locked = false; }, LOCK_MS);
  }

  // 다른 페이지에서 index.html#projects / #contact 로 들어오면 그 화면부터
  var start = NAMES.indexOf(location.hash.slice(1));
  show(start > 0 ? start : 0);

  // 메인은 페이지 스크롤이 없는 화면: #주소 자동 이동이나 포커스 때문에 창 · 틀이 밀리면 즉시 제자리로
  function pin() {
    if (window.scrollX || window.scrollY) window.scrollTo(0, 0);
    if (frame.scrollTop || frame.scrollLeft) { frame.scrollTop = 0; frame.scrollLeft = 0; }
  }
  window.addEventListener("scroll", pin, { passive: true });
  window.addEventListener("load", pin);
  window.addEventListener("hashchange", pin);
  requestAnimationFrame(pin);

  // 좁은 화면에서 화면 안 내용이 길면, 그 안에서 끝까지 스크롤한 뒤에만 다음/이전 화면으로
  function atTop() { return screens[cur].scrollTop <= 0; }
  function atBottom() {
    var s = screens[cur];
    return s.scrollTop + s.clientHeight >= s.scrollHeight - 2;
  }
  function next() { if (atBottom()) go(cur + 1); }
  function prev() { if (atTop()) go(cur - 1); }

  window.addEventListener("wheel", function (e) {
    if (Math.abs(e.deltaY) < 8) return;
    if (e.deltaY > 0) next(); else prev();
  }, { passive: true });

  var startY = null;
  window.addEventListener("touchstart", function (e) { startY = e.touches[0].clientY; }, { passive: true });
  window.addEventListener("touchend", function (e) {
    if (startY === null) return;
    var dy = startY - e.changedTouches[0].clientY;
    startY = null;
    if (Math.abs(dy) < 50) return;
    if (dy > 0) next(); else prev();
  }, { passive: true });

  window.addEventListener("keydown", function (e) {
    if (e.target.closest && e.target.closest("input, textarea, select")) return;
    if (e.key === "ArrowDown" || e.key === "PageDown") next();
    else if (e.key === "ArrowUp" || e.key === "PageUp") prev();
    else if (e.key === "Home") go(0);
    else if (e.key === "End") go(screens.length - 1);
  });

  window.goScreen = go;   // js/plug.js(Contact 플러그)가 꽂힌 뒤 화면을 바꿀 때 씀

  document.querySelectorAll("[data-go]").forEach(function (a) {
    if (a.classList.contains("plug")) return;   // Contact 플러그는 plug.js가 처리 (꽂히는 모션 뒤 이동)
    a.addEventListener("click", function (e) {
      e.preventDefault();
      go(a.getAttribute("data-go"));
    });
  });
})();


/* 연락처 화면 이메일 — 누르면 주소를 복사하고, 화면 상단 중앙에 안내를 반투명하게 띄웠다 사라지게 함 */
(function () {
  var btn = document.querySelector(".contact__mail[data-copy]");
  if (!btn) return;
  var timer = null;

  // 안내(토스트): 버튼은 등장 모션 때문에 위치 기준이 바뀔 수 있어 body에 따로 붙임
  var toast = document.createElement("div");
  toast.className = "toast";
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");
  document.body.appendChild(toast);

  function fallbackCopy(text) {   // 클립보드 API를 못 쓰는 환경용
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (e) {}
    ta.remove();
    return ok;
  }
  function show(ok) {
    // 상단 메뉴(헤더) 바로 아래 가운데에 놓음 — 헤더 높이가 화면마다 달라 그때그때 계산
    var nav = document.querySelector(".nav");
    if (nav) toast.style.top = Math.round(nav.getBoundingClientRect().bottom + 48) + "px";   // 헤더 아래 48px
    toast.textContent = ok ? "✓ 이메일 주소가 복사되었습니다" : "복사하지 못했습니다 — 직접 선택해 주세요";
    toast.classList.toggle("is-error", !ok);
    toast.classList.remove("is-show");
    void toast.offsetWidth;            // 연달아 눌러도 모션이 처음부터 다시 재생되도록
    toast.classList.add("is-show");
    btn.classList.toggle("is-copied", ok);
    clearTimeout(timer);
    timer = setTimeout(function () { btn.classList.remove("is-copied"); }, 2200);
  }

  btn.addEventListener("click", function () {
    var email = btn.getAttribute("data-copy");
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(email).then(function () { show(true); }, function () { show(fallbackCopy(email)); });
    } else {
      show(fallbackCopy(email));
    }
  });
})();
