/* learn.shareyourgroup.com/tables: table of any number, practice round, print maker. Pure functions first (checked by the build with Node). */
(function () {
  'use strict';
  var T = {};
  T.row = function (n, k) { return n + ' × ' + k + ' = ' + (n * k); };
  /* one question: type mul / miss / div */
  T.ask = function (a, b, type) {
    var p = a * b;
    if (type === 'miss') return { q: a + ' × ? = ' + p, ans: b };
    if (type === 'div') return { q: p + ' ÷ ' + a + ' = ?', ans: b };
    return { q: a + ' × ' + b + ' = ?', ans: p };
  };
  T.HARD = [[6, 7], [6, 8], [6, 9], [7, 7], [7, 8], [7, 9], [8, 8], [8, 9], [9, 9], [4, 7], [4, 8], [3, 8], [7, 6], [8, 6], [9, 6], [8, 7], [9, 7], [9, 8], [12, 7], [12, 8]];
  if (typeof module !== 'undefined') { module.exports = T; return; }

  var d = document, $ = function (s, r) { return (r || d).querySelector(s); }, esc = function (s) { return window.SYG ? SYG.esc(s) : String(s); };

  /* print only the marked part of the page */
  d.addEventListener('click', function (e) {
    if (!e.target.closest('[data-print-only]')) return;
    d.documentElement.classList.add('p-only');
    window.print();
  });
  window.addEventListener('afterprint', function () { d.documentElement.classList.remove('p-only'); });

  /* table of any number (home) */
  var gen = $('#tt-gen');
  if (gen) gen.addEventListener('submit', function (e) {
    e.preventDefault();
    var n = parseInt($('#g-n').value.replace(/[^0-9]/g, ''), 10), up = +$('#g-upto').value, out = $('#g-out');
    if (!n || n < 1 || n > 9999) { out.innerHTML = '<p class="note">Type a whole number from 1 to 9999.</p>'; return; }
    var li = '', txt = 'Table of ' + n + '\n';
    for (var k = 1; k <= up; k++) { li += '<li>' + n + ' × ' + k + ' = <b>' + (n * k) + '</b></li>'; txt += n + ' x ' + k + ' = ' + (n * k) + '\n'; }
    out.innerHTML = '<h2 class="tt-h">Table of ' + n + '</h2><ol class="tt cols2">' + li + '</ol><div class="acts" style="display:flex"><button class="btn sm" type="button" data-print-only>Print</button>' +
      '<button class="btn sm ghost" type="button" data-copy="' + esc(txt) + '">Copy</button>' + (n >= 2 && n <= 30 ? '<a class="btn sm ghost" href="/tables/table-of-' + n + '/">Patterns and tricks for ' + n + '</a>' : '') + '</div>';
  });

  /* practice round */
  var quiz = $('#tt-quiz');
  if (quiz) (function () {
    var chips = [].slice.call(d.querySelectorAll('#q-tables button')), qs = [], i = 0, right = 0, wrong = [], typed = '', t0 = 0, lock = false, hardMode = false;
    function sel() { return chips.filter(function (b) { return b.getAttribute('aria-pressed') === 'true'; }).map(function (b) { return +b.getAttribute('data-t'); }); }
    function setSel(list) { chips.forEach(function (b) { b.setAttribute('aria-pressed', list.indexOf(+b.getAttribute('data-t')) > -1 ? 'true' : 'false'); }); hardMode = false; best(); }
    function key() { return 'tt-best-' + (hardMode ? 'hard' : sel().join('.')) + '-' + $('#q-type').value + '-' + $('#q-n').value; }
    function best() { var b = null; try { b = localStorage.getItem(key()); } catch (e) {} $('#q-best').textContent = b ? 'Your best time for this choice: ' + b + ' seconds, all correct.' : ''; }
    $('#q-tables').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') === 'true' ? 'false' : 'true'); hardMode = false; mark(); best(); });
    function mark(on) { [].forEach.call(d.querySelectorAll('#q-sets button'), function (b) { b.setAttribute('aria-pressed', b === on ? 'true' : 'false'); }); }
    $('#q-sets').addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return; var s = b.getAttribute('data-set');
      if (s === 'hard') { setSel([]); hardMode = true; } else { var p = s.split('-'), l = []; for (var n = +p[0]; n <= +p[1]; n++) l.push(n); setSel(l); }
      mark(b); best();
    });
    $('#q-type').addEventListener('change', best); $('#q-n').addEventListener('change', best);
    var m = /[?&]t=(\d+)/.exec(location.search);
    setSel(m && +m[1] >= 2 && +m[1] <= 20 ? [+m[1]] : [2, 3, 4, 5]);
    function shuffle(a) { for (var j = a.length - 1; j > 0; j--) { var k = Math.floor(Math.random() * (j + 1)), t = a[j]; a[j] = a[k]; a[k] = t; } return a; }
    function build(pairs) {
      var type = $('#q-type').value, n = +$('#q-n').value, pool = shuffle(pairs.slice()), out = [];
      while (out.length < n) { for (var j = 0; j < pool.length && out.length < n; j++) out.push(pool[j]); shuffle(pool); }
      return out.map(function (p) { var ty = type === 'mix' ? ['mul', 'miss', 'div'][Math.floor(Math.random() * 3)] : type; var q = T.ask(p[0], p[1], ty); q.fact = p[0] + ' × ' + p[1] + ' = ' + (p[0] * p[1]); q.pair = p; return q; });
    }
    function start(pairs) {
      if (!pairs) {
        if (hardMode) pairs = T.HARD; else { var s = sel(); if (!s.length) { SYG.toast('Choose at least one table'); return; } pairs = []; s.forEach(function (a) { for (var b = 2; b <= 10; b++) pairs.push([a, b]); }); }
      }
      qs = build(pairs); i = 0; right = 0; wrong = []; t0 = Date.now();
      $('#q-setup').hidden = true; $('#q-done').hidden = true; $('#q-play').hidden = false; show();
    }
    function show() { typed = ''; lock = false; $('#q-count').textContent = 'Question ' + (i + 1) + ' of ' + qs.length; $('#q-q').textContent = qs[i].q; $('#q-a').innerHTML = '&nbsp;'; $('#q-fb').innerHTML = '&nbsp;'; $('#q-fb').className = 'q-fb'; }
    function press(k) {
      if (lock || $('#q-play').hidden) return;
      if (k === 'del') typed = typed.slice(0, -1); else if (k === 'ok') return submit(); else if (typed.length < 4) typed += k;
      $('#q-a').textContent = typed || ' ';
    }
    function submit() {
      if (typed === '') return;
      lock = true; var q = qs[i], ok = +typed === q.ans, fb = $('#q-fb');
      if (ok) { right++; fb.textContent = 'Right'; fb.className = 'q-fb good'; } else { wrong.push(q); fb.textContent = 'Not quite. ' + q.fact; fb.className = 'q-fb bad'; }
      setTimeout(function () { i++; if (i < qs.length) show(); else done(); }, ok ? 450 : 2200);
    }
    function done() {
      var secs = Math.round((Date.now() - t0) / 1000), per = (secs / qs.length).toFixed(1), h = '<h2>Round finished</h2><p class="big">' + right + ' out of ' + qs.length + '</p><p>Time: ' + secs + ' seconds, about ' + per + ' seconds a question.</p>';
      if (!wrong.length) {
        var b = null; try { b = +localStorage.getItem(key()) || null; } catch (e) {}
        if (!b || secs < b) { try { localStorage.setItem(key(), secs); } catch (e2) {} h += '<p class="q-fb good">All correct, and a new best time for this choice.</p>'; } else h += '<p class="q-fb good">All correct. Your best time is ' + b + ' seconds.</p>';
      } else {
        var seen = {}, li = ''; wrong.forEach(function (q) { if (!seen[q.fact]) { seen[q.fact] = 1; li += '<li>' + esc(q.fact) + '</li>'; } });
        h += '<h3>Facts to look at again</h3><ul class="cols">' + li + '</ul>';
      }
      h += '<div class="acts" style="display:flex">' + (wrong.length ? '<button class="btn" type="button" id="q-again">Practise these again</button>' : '') + '<button class="btn' + (wrong.length ? ' ghost' : '') + '" type="button" id="q-new">New round</button><button class="btn ghost" type="button" id="q-change">Change tables</button></div>';
      $('#q-play').hidden = true; var dn = $('#q-done'); dn.innerHTML = h; dn.hidden = false;
      var ag = $('#q-again'); if (ag) ag.onclick = function () { var s = {}, p = []; wrong.forEach(function (q) { if (!s[q.fact]) { s[q.fact] = 1; p.push(q.pair); } }); start(p); };
      $('#q-new').onclick = function () { start(); };
      $('#q-change').onclick = function () { dn.hidden = true; $('#q-setup').hidden = false; best(); };
    }
    $('#q-start').addEventListener('click', function () { start(); });
    $('#q-pad').addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) press(b.getAttribute('data-k')); });
    d.addEventListener('keydown', function (e) {
      if ($('#q-play').hidden) return;
      if (/^[0-9]$/.test(e.key)) press(e.key); else if (e.key === 'Backspace') { press('del'); e.preventDefault(); } else if (e.key === 'Enter') { press('ok'); e.preventDefault(); }
    });
  })();

  /* print maker */
  var pr = $('#tt-print');
  if (pr) (function () {
    var paper = $('#p-paper');
    function draw() {
      var kind = $('#p-kind').value, a = +$('#p-from').value, b = +$('#p-to').value, up = +$('#p-upto').value, h = '', n, k;
      if (a > b) { var t = a; a = b; b = t; }
      if (kind === 'chart' || kind === 'fill') {
        h = '<h2>Multiplication tables ' + a + ' to ' + b + '</h2><div class="p-grid">';
        for (n = a; n <= b; n++) { h += '<table class="mini"><caption>Table of ' + n + '</caption><tbody>'; for (k = 1; k <= up; k++) h += '<tr><td>' + n + ' × ' + k + '</td><td>= ' + (kind === 'fill' ? '<i></i>' : n * k) + '</td></tr>'; h += '</tbody></table>'; }
        h += '</div>';
      } else {
        var m = Math.max(b, 10); if (m > 20) m = 20;
        h = '<h2>Multiplication grid 1 to ' + m + (kind === 'blank' ? ' (fill it in)' : '') + '</h2><table class="mc' + (m > 12 ? ' small' : '') + '"><tr><th>×</th>';
        for (k = 1; k <= m; k++) h += '<th>' + k + '</th>'; h += '</tr>';
        for (n = 1; n <= m; n++) { h += '<tr><th>' + n + '</th>'; for (k = 1; k <= m; k++) h += '<td' + (n === k ? ' class="sq"' : '') + '>' + (kind === 'blank' ? '' : n * k) + '</td>'; h += '</tr>'; }
        h += '</table>';
      }
      paper.innerHTML = h + '<p class="p-foot">Name: ______________________ &nbsp; Date: ____________ &nbsp; learn.shareyourgroup.com/tables</p>';
    }
    pr.addEventListener('change', draw);
    pr.addEventListener('submit', function (e) { e.preventDefault(); draw(); d.documentElement.classList.add('p-only'); window.print(); });
    draw();
  })();
})();
