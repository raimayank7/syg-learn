/* learn.shareyourgroup.com/formulas: a calculator on every formula card. The formulas (window.FORMULAS) are generated at build time and checked in Node against separate Python code.
   Nothing is sent anywhere or saved. */
(function () {
  'use strict';
  var L = window.FORMULAS || [], by = {};
  L.forEach(function (f) { by[f.id] = f; });
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function show(x) {
    if (typeof x !== 'number' || !isFinite(x)) return 'not possible with these numbers';
    var r = Math.round(x * 1e6) / 1e6;
    return String(Math.abs(r) >= 1e15 ? x.toExponential(6) : r);
  }
  [].forEach.call(document.querySelectorAll('.fcard[data-f]'), function (card) {
    var f = by[card.getAttribute('data-f')]; if (!f) return;
    var calc = card.querySelector('[data-calc]'), out = card.querySelector('[data-out]');
    calc.innerHTML = f.vars.map(function (v, i) { return '<label>' + esc(v.label) + '<input type="number" step="any" inputmode="decimal" data-i="' + i + '" value="' + v.def + '"></label>'; }).join('');
    var run = function () {
      var vals = [].map.call(calc.querySelectorAll('input'), function (x) { return x.value === '' ? NaN : +x.value; });
      if (vals.some(function (v) { return isNaN(v); })) { out.textContent = 'Type a number in every box.'; return; }
      out.innerHTML = f.outs.map(function (o) { return esc(o.label) + ' = <b>' + esc(show(o.f.apply(null, vals))) + '</b>'; }).join('<br>');
    };
    calc.addEventListener('input', run); run();
  });
})();
