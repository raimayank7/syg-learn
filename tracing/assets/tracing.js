/* learn.shareyourgroup.com/tracing: printable tracing sheets for names, letters and numbers. Pure helpers first (the build checks them in Node against separate Python code),
   then the tools. The sheet is drawn as SVG: a solid model, then dotted copies to trace over. Nothing is sent anywhere. */
(function () {
  'use strict';
  var T = {};
  T.MAXLEN = 20;
  T.clean = function (s) { return String(s).replace(/[<>&"]/g, '').replace(/\s+/g, ' ').trim().slice(0, T.MAXLEN); };
  T.ITEMS = {
    upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
    lower: 'abcdefghijklmnopqrstuvwxyz'.split(''),
    both: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(function (c) { return c + c.toLowerCase(); }),
    digits: '0123456789'.split(''),
    twenty: (function () { var a = []; for (var i = 1; i <= 20; i++) a.push(String(i)); return a; })()
  };
  /* rows of a sheet. mode 'name': one model row then `n` dotted rows of the name, then `blank` empty practice rows.
     mode 'set': one row for each item of the set; each row = a solid model followed by `per` dotted copies. A row is a list of parts {t, solid}. */
  T.rows = function (mode, text, n, blank, set, per) {
    var rows = [], i, k;
    if (mode === 'name') {
      var name = T.clean(text); if (!name) return [];
      rows.push([{ t: name, solid: true }]);
      for (i = 0; i < n; i++) rows.push([{ t: name, solid: false }]);
      for (i = 0; i < blank; i++) rows.push([]);
    } else {
      (T.ITEMS[set] || []).forEach(function (it) {
        var r = [{ t: it, solid: true }];
        for (k = 0; k < per; k++) r.push({ t: it, solid: false });
        rows.push(r);
      });
    }
    return rows;
  };
  function ex(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  /* one row as SVG: three guide lines, then the parts left to right, each part a text element (solid: filled; dotted: dashed outline, no fill) */
  T.need = function (row, size) { var x = 10, gap = Math.round(size * 0.5); row.forEach(function (p) { x += Math.round(p.t.length * size * 0.72) + gap; }); return x + 10; };
  T.svg = function (row, size, minw) {
    var h = Math.round(size * 1.9), base = Math.round(size * 1.35), w = minw || 700, x = 10, out = '';
    var gap = Math.round(size * 0.5);
    row.forEach(function (p) { out += '<text x="' + x + '" y="' + base + '" font-size="' + size + '"' + (p.solid ? ' fill="#111"' : ' fill="none" stroke="#444" stroke-width="1.8" stroke-dasharray="1.5 3.5" stroke-linecap="round"') + ' data-solid="' + (p.solid ? 1 : 0) + '">' + ex(p.t) + '</text>'; x += Math.round(p.t.length * size * 0.72) + gap; });
    if (x > w) w = x + 10;
    return '<svg class="ts" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="Tracing row"><line x1="0" x2="' + w + '" y1="' + Math.round(base - size * 0.72) + '" y2="' + Math.round(base - size * 0.72) + '" stroke="#bbb" stroke-dasharray="4 4"/><line x1="0" x2="' + w + '" y1="' + base + '" y2="' + base + '" stroke="#e55"/>' + out + '</svg>';
  };
  if (typeof module !== 'undefined' && module.exports) { module.exports = T; return; }
  window.TRACING = T;

  var d = document;
  function el(q) { return d.querySelector(q); }
  function get(k) { try { return JSON.parse(localStorage.getItem('tracing-' + k)); } catch (e) { return null; } }
  function put(k, v) { try { localStorage.setItem('tracing-' + k, JSON.stringify(v)); } catch (e) {} }
  var box = el('[data-trace]');
  if (box) {
    var mode = box.getAttribute('data-trace');
    var inner = mode === 'name'
      ? '<div class="fields"><label>Name or word (up to 20 letters)<input type="text" id="tn" maxlength="20" value="' + (get('name') || 'Asha').replace(/"/g, '') + '" autocomplete="off"></label><label>Size<select id="tz"><option value="44">Medium</option><option value="64">Large</option><option value="34">Small</option></select></label><label>Dotted rows<input type="number" id="tr" min="1" max="12" value="4" inputmode="numeric"></label><label>Empty practice rows<input type="number" id="tb" min="0" max="8" value="2" inputmode="numeric"></label></div>'
      : '<div class="fields"><label>Which ' + (mode === 'alpha' ? 'letters' : 'numbers') + '<select id="ts">' + (mode === 'alpha' ? '<option value="upper">Capital letters A to Z</option><option value="lower">Small letters a to z</option><option value="both">Capital and small together</option>' : '<option value="digits">0 to 9</option><option value="twenty">1 to 20</option>') + '</select></label><label>Size<select id="tz"><option value="44">Medium</option><option value="64">Large</option><option value="34">Small</option></select></label><label>Dotted copies in a row<input type="number" id="tp" min="1" max="8" value="4" inputmode="numeric"></label></div>';
    box.innerHTML = inner + '<div class="btns"><button type="button" class="btn" id="tprint">Print the sheet</button></div><div class="page" data-page aria-live="polite"></div>';
    var run = function () {
      var size = +el('#tz').value || 44, rows;
      if (mode === 'name') { var nm = T.clean(el('#tn').value); put('name', nm); rows = T.rows('name', nm, Math.min(12, Math.max(1, +el('#tr').value || 1)), Math.min(8, Math.max(0, +el('#tb').value || 0)), '', 0); }
      else rows = T.rows('set', '', 0, 0, el('#ts').value, Math.min(8, Math.max(1, +el('#tp').value || 1)));
      var mw = 0; rows.forEach(function (r) { mw = Math.max(mw, T.need(r, size)); }); mw = Math.max(mw, 260);
      box.querySelector('[data-page]').innerHTML = rows.length ? rows.map(function (r) { return T.svg(r, size, mw); }).join('') : '<p>Type a name above.</p>';
    };
    box.addEventListener('input', run); box.addEventListener('change', run);
    box.addEventListener('click', function (e) { if (e.target.id === 'tprint') window.print(); });
    run();
  }
})();
