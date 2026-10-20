/* 12번 과제 — generated.js(장치가 만든 데이터)를 읽어 숫자 칸과 승인된 문단을 그립니다. */
(function () {
  var data = window.SITE_DATA;
  if (!data) return;

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function card(n, big) {
    var c = el("div", "num" + (big ? " num--big" : "") + (n.missing ? " num--missing" : ""));
    var v = el("p", "num__value", String(n.value));
    if (n.unit && !n.missing) v.appendChild(el("small", null, n.unit));
    c.appendChild(el("p", "num__ability", n.ability));
    c.appendChild(v);
    c.appendChild(el("p", "num__label", n.label));
    c.appendChild(el("p", "num__detail", n.detail));
    c.appendChild(el("p", "num__source", "출처 · " + n.source));
    return c;
  }

  // 고난 장면과 짝지은 숫자
  var PAIR_ID = "persist_days";
  var pair = document.getElementById("pairNumber");
  var grid = document.getElementById("numberGrid");
  data.numbers.forEach(function (n) {
    if (n.missing) return; // 아직 입력하지 않은 숫자는 사이트에 내지 않음
    if (n.id === PAIR_ID && pair) pair.appendChild(card(n, true));
    else if (grid) grid.appendChild(card(n));
  });

  document.querySelectorAll(".ability__list").forEach(function (ul) {
    var key = ul.getAttribute("data-ability");
    data.paragraphs.filter(function (p) { return p.ability === key; }).forEach(function (p) {
      var li = el("li");
      li.appendChild(el("span", "ability__text", p.text));
      li.appendChild(el("span", "ability__src", p.date + " · " + p.evidence));
      ul.appendChild(li);
    });
  });

  var basis = "숫자 기준일 " + data.basis_date + " · 새 기록을 넣고 장치를 돌리면 갱신됩니다";
  var b = document.getElementById("basisNote");
  if (b) b.textContent = basis;
  var f = document.getElementById("footBasis");
  if (f) f.textContent = "숫자 기준일 " + data.basis_date;
})();
