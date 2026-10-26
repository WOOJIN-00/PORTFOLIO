/* 이력서 · 프로젝트 · 기술경력서 — 스크롤해서 화면에 들어온 요소부터 차례로 떠오르게 합니다.
   메인의 전환 화면(.screen) 안에 있는 요소는, 그 화면이 나타난(.is-current) 뒤에야 지켜보기 시작합니다
   (숨겨진 화면도 같은 자리에 겹쳐 있어서, 미리 지켜보면 보이기 전에 모션이 끝나 버림). */

/* 공용 도우미 — els 각각에 대해, 속한 .screen 이 나타났을 때(또는 .screen 밖이면 바로) cb(el)를 한 번 실행.
   story.js 도 씀. */
window.whenScreenShown = function (els, cb) {
  els.forEach(function (el) {
    var screen = el.closest && el.closest(".screen");
    if (!screen || screen.classList.contains("is-current")) return cb(el);
    var mo = new MutationObserver(function () {
      if (!screen.classList.contains("is-current")) return;
      mo.disconnect();
      // 전환 애니메이션이 시작된 다음 프레임에 지켜보기 시작
      requestAnimationFrame(function () { cb(el); });
    });
    mo.observe(screen, { attributes: true, attributeFilter: ["class"] });
  });
};

(function () {
  var items = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if (!items.length) return;

  // 지원 안 하는 브라우저는 그냥 다 보이게
  if (!("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("is-in"); });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-in");
      io.unobserve(entry.target);
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });

  window.whenScreenShown(items, function (el) { io.observe(el); });
})();
