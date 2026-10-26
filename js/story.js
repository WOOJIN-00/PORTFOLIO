/* 기술경력서 — ① "32일" 숫자가 0부터 올라감  ② 스크롤할수록 기록 타임라인의 붉은 선이 채워짐
   메인의 전환 화면(.screen) 안에서는 그 화면 안 스크롤을 기준으로, 단독 페이지에서는 창 스크롤을 기준으로 계산합니다. */
(function () {
  var still = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ① 숫자 카운트업 — 화면이 나타나고, 숫자가 보일 때 한 번
  var counts = Array.prototype.slice.call(document.querySelectorAll(".st-count[data-to]"));
  window.whenScreenShown(counts, function (el) {
    var to = +el.getAttribute("data-to");
    if (still || !("IntersectionObserver" in window)) { el.textContent = to; return; }
    var io = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      io.disconnect();
      var start = null, DUR = 1400;
      (function step(t) {
        if (start === null) start = t;
        var k = Math.min((t - start) / DUR, 1);
        el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); // 끝에서 천천히
        if (k < 1) requestAnimationFrame(step);
      })(performance.now());
    }, { threshold: 0.6 });
    io.observe(el);
  });

  // ② 타임라인 진행선 — 기준선이 목록의 어디쯤 지나는지를 0~1로
  var log = document.getElementById("log");
  if (!log) return;
  var items = Array.prototype.slice.call(log.querySelectorAll(".st-log__item"));
  if (still) { items.forEach(function (it) { it.classList.add("is-lit"); }); return; }

  var box = log.closest(".screen");          // 메인 전환 화면 안이면 그 화면이 스크롤 영역
  var scroller = box || window;

  // 점은 붉은 선이 점 중심까지 내려왔을 때만 켜짐
  function light(p) {
    var h = log.offsetHeight;
    var lineEnd = 6 + p * (h - 12);           // 선은 위아래 6px 안쪽에서 scaleY로 자람 (story.css)
    items.forEach(function (it) {
      var dotY = it.offsetTop + 1 + 22 + 8;   // 카드 테두리 1 + 점 top 22 + 점 반지름 8
      it.classList.toggle("is-lit", lineEnd >= dotY);
    });
  }

  var ticking = false;
  function update() {
    ticking = false;
    var vh = box ? box.clientHeight : window.innerHeight;
    var top0 = box ? box.getBoundingClientRect().top : 0;
    var r = log.getBoundingClientRect();
    // 기준선은 보통 화면 60% 높이. 끝에 가까워질수록 화면 맨 아래로 내려가서,
    // 끝까지 스크롤하면 목록 끝이 반드시 기준선을 지나 선이 100% 채워짐
    var remaining = box
      ? box.scrollHeight - (box.scrollTop + box.clientHeight)
      : document.documentElement.scrollHeight - (window.scrollY + vh);
    var near = Math.max(0, Math.min(1, 1 - remaining / (vh * 0.5)));
    var mid = vh * (0.6 + 0.4 * near);
    var p = (mid - (r.top - top0)) / r.height;
    if (remaining <= 2) p = 1;
    p = Math.max(0, Math.min(1, p));
    log.style.setProperty("--p", p.toFixed(3));
    light(p);
  }
  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }
  scroller.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  window.whenScreenShown([log], update);
})();
