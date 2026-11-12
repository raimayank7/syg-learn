/* NISM Practice: practice mode (answer shown at once) and mock mode (timed, scored like the real paper's rules for that module).
   Questions are our own and are in the page (window.NQ). Nothing is stored or sent. */
(function () {
  'use strict';
  var d = document, box = d.getElementById('nq');
  if (!box || !window.NQ) return;
  var $ = function (id) { return d.getElementById(id); }, M = window.NQ.m, B = window.NQ.q, esc = SYG.esc;
  var mod = (/[?&]m=(\w+)/.exec(location.search) || [])[1]; if (!M[mod]) mod = Object.keys(M)[0];
  var mode = 'practice', set = [], pos = 0, ans = [], tick = null, endAt = 0, right = 0, done = 0;
  function shuffle(a) { a = a.slice(); for (var j = a.length - 1; j > 0; j--) { var k = Math.floor(Math.random() * (j + 1)), t = a[j]; a[j] = a[k]; a[k] = t; } return a; }
  function prep(q) { var idx = shuffle([0, 1, 2, 3]); return { c: q[0], q: q[1], o: idx.map(function (i) { return q[2][i]; }), a: idx.indexOf(q[3]), e: q[4] }; }
  function fmt(s) { s = Math.max(0, Math.ceil(s)); return Math.floor(s / 60) + ':' + ('0' + s % 60).slice(-2); }
  function press(sel, attr, val) { Array.prototype.forEach.call(d.querySelectorAll(sel), function (b) { b.setAttribute('aria-pressed', b.getAttribute(attr) === val ? 'true' : 'false'); }); }
  function rules() {
    var m = M[mod];
    $('nq-rules').textContent = m.n + ': real paper ' + m.qs + ' questions in ' + m.min + ' minutes, pass mark ' + m.pass + '%, ' + (m.neg ? 'negative marking of 25% of the marks for a wrong answer' : 'no negative marking') + ' (nism.ac.in, read ' + window.NQ.read + '). ' +
      'This bank has ' + B[mod].length + ' of our own questions.';
  }
  function start() {
    clearInterval(tick); tick = null; right = done = 0; pos = 0; ans = [];
    var all = shuffle(B[mod]).map(prep);
    set = mode === 'mock' ? all.slice(0, Math.min(25, all.length)) : all;
    $('nq-res').hidden = true; $('nq-card').hidden = false; $('nq-timer').hidden = mode !== 'mock'; $('nq-fin').hidden = mode !== 'mock';
    if (mode === 'mock') {
      var secs = Math.round(M[mod].min * 60 * set.length / M[mod].qs);
      endAt = Date.now() + secs * 1000;
      tick = setInterval(function () { var l = (endAt - Date.now()) / 1000; $('nq-timer').textContent = 'Time left ' + fmt(l); if (l <= 0) finish(); }, 500);
      $('nq-timer').textContent = 'Time left ' + fmt(secs);
    }
    show();
  }
  function show() {
    var q = set[pos];
    $('nq-n').textContent = 'Question ' + (pos + 1) + ' of ' + set.length + ' · ' + q.c;
    $('nq-q').textContent = q.q;
    $('nq-o').innerHTML = q.o.map(function (o, i) { return '<button type="button" data-i="' + i + '"' + (ans[pos] === i ? ' aria-pressed="true"' : ' aria-pressed="false"') + '>' + 'ABCD'[i] + '. ' + esc(o) + '</button>'; }).join('');
    $('nq-ex').hidden = true;
    $('nq-prev').disabled = pos === 0;
    $('nq-next').textContent = pos + 1 < set.length ? (mode === 'mock' ? 'Next' : 'Next question') : (mode === 'mock' ? 'Finish test' : 'Start again');
    $('nq-skip').hidden = mode !== 'mock';
    if (mode === 'mock') Array.prototype.forEach.call($('nq-o').children, function (b) { b.classList.add('pick'); });
    if (mode === 'practice' && ans[pos] !== undefined) mark();
  }
  function mark() {
    var q = set[pos];
    Array.prototype.forEach.call($('nq-o').children, function (b, i) { b.disabled = true; if (i === q.a) b.classList.add('good'); else if (i === ans[pos]) b.classList.add('bad'); });
    $('nq-ex').hidden = false; $('nq-ex').className = 'result' + (ans[pos] === q.a ? '' : ' no');
    $('nq-ex').innerHTML = '<h2>' + (ans[pos] === q.a ? 'Correct' : 'Not quite') + '</h2><p>' + esc(q.e) + '</p>';
  }
  $('nq-o').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b || b.disabled) return;
    var i = +b.getAttribute('data-i');
    if (mode === 'practice') {
      if (ans[pos] !== undefined) return;
      ans[pos] = i; done++; if (i === set[pos].a) right++;
      $('nq-score').textContent = 'Score: ' + right + ' of ' + done; mark();
    } else { ans[pos] = i; press('#nq-o button', 'data-i', String(i)); }
  });
  $('nq-next').addEventListener('click', function () {
    if (pos + 1 < set.length) { pos++; show(); } else if (mode === 'mock') finish(); else { start(); $('nq-score').textContent = 'Score: 0 of 0'; }
  });
  $('nq-prev').addEventListener('click', function () { if (pos > 0) { pos--; show(); } });
  $('nq-skip').addEventListener('click', function () { ans[pos] = undefined; if (pos + 1 < set.length) { pos++; show(); } else show(); });
  $('nq-fin').addEventListener('click', function () { if (confirm('Finish the test and see your result?')) finish(); });
  function finish() {
    clearInterval(tick); tick = null;
    var m = M[mod], r = 0, w = 0, s = 0, rev = '';
    set.forEach(function (q, i) {
      if (ans[i] === undefined) s++; else if (ans[i] === q.a) r++; else w++;
      rev += '<details><summary>' + (i + 1) + '. ' + esc(q.q) + ' <b>' + (ans[i] === undefined ? '(not attempted)' : ans[i] === q.a ? '(correct)' : '(wrong)') + '</b></summary><p><b>Answer:</b> ' + esc(q.o[q.a]) +
        (ans[i] !== undefined && ans[i] !== q.a ? '<br><b>You chose:</b> ' + esc(q.o[ans[i]]) : '') + '</p><p>' + esc(q.e) + '</p></details>';
    });
    var score = r - (m.neg ? w * 0.25 : 0), pct = Math.round(score / set.length * 1000) / 10, pass = pct >= m.pass;
    $('nq-card').hidden = true; $('nq-res').hidden = false;
    $('nq-res').className = 'result' + (pass ? '' : ' no');
    $('nq-res').innerHTML = '<h2>' + (pass ? 'At or above the pass mark' : 'Below the pass mark') + '</h2><p class="big">' + score + ' out of ' + set.length + ' (' + pct + '%)</p>' +
      '<p>Correct ' + r + ', wrong ' + w + ', not attempted ' + s + '. ' + (m.neg ? 'Each wrong answer cost 0.25 mark, as in the real paper for this module.' : 'There is no negative marking in this module, so never leave a question blank in the real paper.') +
      ' The pass mark for ' + esc(m.n) + ' is ' + m.pass + '%.</p><p class="hint">This is a short practice test on our own questions. A score here does not predict a result in the real examination.</p>' +
      '<p><button class="btn" type="button" id="nq-again">Take another test</button></p><h2>Review</h2>' + rev;
    $('nq-again').addEventListener('click', start);
    $('nq-res').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  box.addEventListener('click', function (e) {
    var b = e.target.closest('[data-mod],[data-mode]'); if (!b) return;
    if (b.hasAttribute('data-mod')) { mod = b.getAttribute('data-mod'); press('[data-mod]', 'data-mod', mod); }
    else { mode = b.getAttribute('data-mode'); press('[data-mode]', 'data-mode', mode); }
    rules(); $('nq-score').textContent = mode === 'mock' ? '' : 'Score: 0 of 0'; start();
  });
  press('[data-mod]', 'data-mod', mod); rules(); start();
})();
/* negative marking calculator */
(function () {
  var f = document.getElementById('nm'); if (!f) return;
  function v(id) { return Math.max(0, Math.round(+document.getElementById(id).value) || 0); }
  function run() {
    var t = v('nm-t'), r = v('nm-r'), w = v('nm-w'), p = v('nm-p'), o = document.getElementById('nm-out');
    if (r + w > t) { o.innerHTML = '<p>Correct and wrong answers together cannot be more than the number of questions.</p>'; return; }
    var s = r - w * 0.25, need = t * p / 100;
    o.innerHTML = '<p class="big">' + s + ' marks out of ' + t + '</p><p>' + r + ' correct − (' + w + ' wrong × 0.25) = ' + s + '. Not attempted: ' + (t - r - w) + '. Pass mark at ' + p + '%: ' + need + ' marks. ' +
      (s >= need ? 'This score is at or above the pass mark.' : 'This score is ' + (Math.round((need - s) * 100) / 100) + ' short of the pass mark.') + '</p>';
  }
  f.addEventListener('input', run); run();
})();
/* glossary filter */
(function () {
  var q = document.getElementById('gl-q'); if (!q) return;
  var items = document.querySelectorAll('#gl-list > div'), none = document.getElementById('gl-none');
  q.addEventListener('input', function () { var s = q.value.trim().toLowerCase(), n = 0; Array.prototype.forEach.call(items, function (el) { var hit = !s || el.textContent.toLowerCase().indexOf(s) > -1; el.hidden = !hit; if (hit) n++; }); none.hidden = n > 0; });
})();
