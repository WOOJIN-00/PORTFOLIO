/* Contact 플러그 — 케이블 + 플러그 머리의 위치 이동은 전부 여기서만 담당합니다.
   모든 움직임은 "지금 화면에 보이는 위치"에서 출발하므로, 어떤 순서로 오가도 튀거나 순간 이동하지 않습니다.

   평소(idle)        : 제자리로 돌아온 뒤 가끔 포트 쪽으로 살짝 다가감
   마우스·포커스(tease): 안쪽 끝까지 한 번에 들어간 뒤, 입구 앞 ↔ 살짝 안쪽을 부드럽게 왕복
   클릭(plugged)      : 빠르게 딸깍 꽂히고 바로 이동
   연락처 화면(linked): 끝까지 꽂힌 채 유지 (main.js가 .is-linked)
   거리 값은 CSS 변수(--half, --ins)에서 읽음 — 화면 크기별 값은 style.css에서 조정 */
(function () {
  var plug = document.querySelector(".nav__cta.plug");
  if (!plug) return;
  var cord = plug.querySelector(".plug__cord");
  if (!cord || !cord.animate) return;

  var WAIT = 210;   // 클릭 후 꽂히는 순간만 보이고 바로 이동
  var still = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var SINE = "cubic-bezier(.45, 0, .55, 1)";
  var anim = null;

  function cssPx(name) { return parseFloat(getComputedStyle(plug).getPropertyValue(name)) || 0; }
  function nowX() {
    var m = getComputedStyle(cord).transform;
    return (m && m !== "none") ? new DOMMatrixReadOnly(m).m41 : 0;
  }
  function tx(x) { return { transform: "translateX(" + x + "px)" }; }

  // 지금 위치에서 frames 로 이어지는 애니메이션 실행 (이전 것은 위치를 읽은 뒤 취소)
  function play(frames, opts, then) {
    var x = nowX();
    if (anim) anim.cancel();
    if (still) { cord.style.transform = frames[frames.length - 1].transform; anim = null; return; }
    cord.style.transform = "";
    anim = cord.animate([tx(x)].concat(frames), Object.assign({ fill: "forwards" }, opts));
    if (then) anim.onfinish = then;
  }
  function loop(frames, opts) {
    if (still) return;
    if (anim) anim.cancel();
    anim = cord.animate(frames, Object.assign({ iterations: Infinity }, opts));
  }

  var state = "";
  function idle() {
    state = "idle";
    play([tx(0)], { duration: 380, easing: "cubic-bezier(.3, 0, .2, 1)" }, function () {
      if (state !== "idle") return;
      // 가끔 포트 쪽으로 살짝 (3.2초마다)
      loop([
        { transform: "translateX(0)", offset: 0 },
        { transform: "translateX(0)", offset: .7, easing: "ease-in-out" },
        { transform: "translateX(5px)", offset: .8, easing: "ease-in-out" },
        { transform: "translateX(1px)", offset: .88, easing: "ease-in-out" },
        { transform: "translateX(0)", offset: 1 }
      ], { duration: 3200 });
    });
  }
  function tease() {
    state = "tease";
    var half = cssPx("--half");
    play([tx(half + 5)], { duration: 500, easing: SINE }, function () {
      if (state !== "tease") return;
      loop([tx(half + 5), tx(half - 5)], { duration: 900, easing: SINE, direction: "alternate" });
    });
  }
  function plugged() {
    state = "plugged";
    var ins = cssPx("--ins");
    play([{ transform: "translateX(" + (ins + 2) + "px)", offset: .8 }, tx(ins)], { duration: 200, easing: "cubic-bezier(.55, 0, .3, 1)" });
  }
  function linked() {
    state = "linked";
    play([tx(cssPx("--ins"))], { duration: 500, easing: "cubic-bezier(.3, 1.45, .55, 1)" });
  }
  function rest() {   // 꽂힘이 풀렸을 때: 마우스가 위에 있으면 들어갈 듯 말 듯, 아니면 제자리
    if (plug.matches(":hover") || plug.matches(":focus-visible")) tease(); else idle();
  }

  function busy() { return plug.classList.contains("is-plugged") || plug.classList.contains("is-linked"); }
  plug.addEventListener("mouseenter", function () { if (!busy()) tease(); });
  plug.addEventListener("focus", function () { if (!busy()) tease(); });
  plug.addEventListener("mouseleave", function () { if (!busy()) idle(); });
  plug.addEventListener("blur", function () { if (!busy()) idle(); });

  // 메인: 연락처 화면에 들어가고 나갈 때(.is-linked 변화) 그에 맞춰 움직임
  var wasLinked = plug.classList.contains("is-linked");
  new MutationObserver(function () {
    var on = plug.classList.contains("is-linked");
    if (on && !wasLinked) linked();
    else if (!on && wasLinked && !plug.classList.contains("is-plugged")) rest();
    wasLinked = on;
  }).observe(plug, { attributes: true, attributeFilter: ["class"] });

  plug.addEventListener("click", function (e) {
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;   // 새 탭 열기는 그대로
    e.preventDefault();
    if (plug.classList.contains("is-plugged")) return;
    plug.classList.add("is-plugged");
    plugged();

    setTimeout(function () {
      var target = plug.getAttribute("data-go");
      if (target && window.goScreen) {
        window.goScreen(target);
        plug.classList.remove("is-plugged");
        if (plug.classList.contains("is-linked")) state = "linked";   // 이미 꽂힌 위치 — 그대로 유지
        else rest();                                                    // 전환이 막혔으면 부드럽게 빠짐
      } else {
        location.href = plug.getAttribute("href");
      }
    }, still ? 0 : WAIT);
  });

  // 뒤로 가기로 돌아왔을 때 꽂힌 채 남아 있지 않게
  window.addEventListener("pageshow", function () {
    plug.classList.remove("is-plugged");
    if (plug.classList.contains("is-linked")) linked(); else rest();
  });

  // 시작 상태
  if (plug.classList.contains("is-linked")) linked(); else idle();
})();
