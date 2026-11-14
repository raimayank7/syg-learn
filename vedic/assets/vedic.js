/* learn.shareyourgroup.com/vedic: eight mental-maths shortcuts, each with the steps shown and the answer worked out by the shortcut itself. Pure helpers first (the build runs thousands of
   problems in Node and recomputes every answer by plain multiplication or subtraction in Python), then the trainer and the "show me" tool. Nothing is sent anywhere. */
(function () {
  'use strict';
  var T = {}, R = Math.random;
  T.seed = function (s) { var a = s >>> 0; R = function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; };
  function ri(a, b) { return a + Math.floor(R() * (b - a + 1)); }
  function pick(l) { return l[Math.floor(R() * l.length)]; }
  var X = '×', MINUS = '−';

  /* each shortcut: applies(a, b) tells if it can be used on these numbers; solve(a, b) returns {steps, ans} using the shortcut; make() picks numbers it works for */
  var S = {};
  S.sq5 = { name: 'Squaring a number that ends in 5', prompt: function (a) { return a + '²'; }, applies: function (a, b) { return a === b && a % 10 === 5 && a > 5; },
    make: function () { var t = ri(1, 19); return [10 * t + 5, 10 * t + 5]; },
    solve: function (a) { var t = (a - 5) / 10, m = t * (t + 1); return { steps: ['The number is ' + t + '5, so the tens part is ' + t + '.', 'Multiply ' + t + ' by the next number: ' + t + ' ' + X + ' ' + (t + 1) + ' = ' + m + '.', 'Write 25 after it: ' + m + '25.'], ans: m * 100 + 25 }; } };
  S.mul11 = { name: 'Multiplying a two-digit number by 11', prompt: function (a, b) { return a + ' ' + X + ' 11'; }, applies: function (a, b) { return b === 11 && a >= 10 && a <= 99; },
    make: function () { return [ri(10, 99), 11]; },
    solve: function (a) { var x = Math.floor(a / 10), y = a % 10; return { steps: ['The digits of ' + a + ' are ' + x + ' and ' + y + '.', 'Add them for the middle: ' + x + ' + ' + y + ' = ' + (x + y) + '.', 'Put that between the digits, carrying if it is ten or more: ' + x + '00 + ' + (x + y) + '0 + ' + y + ' = ' + (x * 100 + (x + y) * 10 + y) + '.'], ans: x * 100 + (x + y) * 10 + y }; } };
  S.near100 = { name: 'Multiplying two numbers just below 100', prompt: function (a, b) { return a + ' ' + X + ' ' + b; }, applies: function (a, b) { return a >= 85 && a <= 99 && b >= 85 && b <= 99; },
    make: function () { return [ri(85, 99), ri(85, 99)]; },
    solve: function (a, b) { var x = 100 - a, y = 100 - b, left = a - y; return { steps: [a + ' is ' + x + ' below 100 and ' + b + ' is ' + y + ' below 100.', 'Take one number minus the other’s shortfall: ' + a + ' ' + MINUS + ' ' + y + ' = ' + left + '. This is the hundreds part.', 'Multiply the shortfalls: ' + x + ' ' + X + ' ' + y + ' = ' + x * y + '. Add it after the hundreds: ' + left + ' ' + X + ' 100 + ' + x * y + ' = ' + (left * 100 + x * y) + '.'], ans: left * 100 + x * y }; } };
  S.mul5 = { name: 'Multiplying by 5', prompt: function (a) { return a + ' ' + X + ' 5'; }, applies: function (a, b) { return b === 5 && a >= 2; },
    make: function () { return [ri(12, 998), 5]; },
    solve: function (a) { var even = a % 2 === 0, h = even ? a / 2 : (a - 1) / 2; return { steps: [even ? a + ' is even, so halve it: ' + h + '.' : a + ' is odd, so halve the number before it: (' + a + ' ' + MINUS + ' 1) / 2 = ' + h + '.', even ? 'Put a 0 after it: ' + h + '0.' : 'Put a 5 after it: ' + h + '5.'], ans: even ? h * 10 : h * 10 + 5 }; } };
  S.mul9 = { name: 'Multiplying by 9', prompt: function (a) { return a + ' ' + X + ' 9'; }, applies: function (a, b) { return b === 9 && a >= 2; },
    make: function () { return [ri(12, 998), 9]; },
    solve: function (a) { return { steps: ['9 is 10 ' + MINUS + ' 1, so ' + a + ' ' + X + ' 9 = ' + a + ' ' + X + ' 10 ' + MINUS + ' ' + a + '.', a + '0 ' + MINUS + ' ' + a + ' = ' + (a * 10 - a) + '.'], ans: a * 10 - a }; } };
  S.from1000 = { name: 'Subtracting from 1000', prompt: function (a) { return '1000 ' + MINUS + ' ' + a; }, applies: function (a, b) { return b === 1000 && a > 100 && a < 1000 && a % 10 !== 0; },
    make: function () { var n = ri(101, 999); while (n % 10 === 0) n = ri(101, 999); return [n, 1000]; },
    solve: function (a) { var d = String(a).split('').map(Number), n0 = 9 - d[0], n1 = 9 - d[1], n2 = 10 - d[2]; return { steps: ['Take each digit of ' + a + ' from 9, except the last, which you take from 10.', '9 ' + MINUS + ' ' + d[0] + ' = ' + n0 + ', 9 ' + MINUS + ' ' + d[1] + ' = ' + n1 + ', 10 ' + MINUS + ' ' + d[2] + ' = ' + n2 + '.', 'Read them in order: ' + n0 + n1 + n2 + '.'], ans: n0 * 100 + n1 * 10 + n2 }; } };
  S.sumten = { name: 'Two numbers with the same tens whose units add to 10', prompt: function (a, b) { return a + ' ' + X + ' ' + b; }, applies: function (a, b) { return a >= 11 && a <= 99 && b >= 11 && b <= 99 && Math.floor(a / 10) === Math.floor(b / 10) && a % 10 + b % 10 === 10; },
    make: function () { var t = ri(1, 9), u = ri(1, 9); return [10 * t + u, 10 * t + 10 - u]; },
    solve: function (a, b) { var t = Math.floor(a / 10), u = a % 10, v = b % 10, m = t * (t + 1); return { steps: ['Both numbers have tens digit ' + t + ', and the units ' + u + ' and ' + v + ' add up to 10.', 'Multiply the tens digit by the next number: ' + t + ' ' + X + ' ' + (t + 1) + ' = ' + m + '.', 'Multiply the units: ' + u + ' ' + X + ' ' + v + ' = ' + u * v + ', written with two digits: ' + (u * v < 10 ? '0' : '') + u * v + '.', 'Join them: ' + m + ' then ' + (u * v < 10 ? '0' : '') + u * v + ' = ' + (m * 100 + u * v) + '.'], ans: m * 100 + u * v }; } };
  S.sq50 = { name: 'Squaring a number near 50', prompt: function (a) { return a + '²'; }, applies: function (a, b) { return a === b && a >= 41 && a <= 59 && a !== 50; },
    make: function () { var n = ri(41, 59); while (n === 50) n = ri(41, 59); return [n, n]; },
    solve: function (a) { var dx = a - 50, h = 25 + dx; return { steps: [a + ' is ' + Math.abs(dx) + (dx > 0 ? ' above' : ' below') + ' 50.', 'Add ' + (dx > 0 ? '' : MINUS) + Math.abs(dx) + ' to 25: ' + h + '. This is the hundreds part.', 'Square the difference: ' + Math.abs(dx) + '² = ' + dx * dx + ', written with two digits: ' + (dx * dx < 10 ? '0' : '') + dx * dx + '.', 'Join them: ' + h + ' then ' + (dx * dx < 10 ? '0' : '') + dx * dx + ' = ' + (h * 100 + dx * dx) + '.'], ans: h * 100 + dx * dx }; } };
  T.IDS = ['sq5', 'mul11', 'near100', 'mul5', 'mul9', 'from1000', 'sumten', 'sq50'];
  T.S = S;
  T.make = function (id) { var ab = S[id].make(), r = S[id].solve(ab[0], ab[1]); return { id: id, a: ab[0], b: ab[1], q: S[id].prompt(ab[0], ab[1]), ans: r.ans, steps: r.steps }; };
  T.any = function () { return T.make(pick(T.IDS)); };
  T.which = function (a, b) { return T.IDS.filter(function (id) { return S[id].applies(a, b); }); };
  T.show = function (id, a, b) { return S[id].solve(a, b); };
  if (typeof module !== 'undefined' && module.exports) { module.exports = T; return; }
  window.VEDIC = T;

  var d = document;
  function el(q) { return d.querySelector(q); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function get(k) { try { return JSON.parse(localStorage.getItem('vedic-' + k)); } catch (e) { return null; } }
  function put(k, v) { try { localStorage.setItem('vedic-' + k, JSON.stringify(v)); } catch (e) {} }

  var box = el('[data-trainer]');
  if (box) {
    var which = box.getAttribute('data-trainer'), st, mk = function () { return which === 'all' ? T.any() : T.make(which); };
    var start = function () {
      var best = get('best-' + which);
      box.innerHTML = '<div class="pq-setup"><p class="pq-lab">' + (which === 'all' ? 'Mixed shortcuts' : esc(S[which].name)) + ': 10 problems</p><p>Work each one out your own way, or with the shortcut, and type the answer. After each one the steps of the shortcut are shown.</p>' + (best !== null ? '<p><b>Your best here: ' + best + ' / 10</b></p>' : '') + '<button type="button" class="btn pq-go">Start</button></div>';
      box.querySelector('.pq-go').onclick = function () { st = { n: 0, right: 0 }; next(); };
    };
    var next = function () {
      if (st.n >= 10) return done();
      var q = mk(); st.n++; st.q = q;
      box.innerHTML = '<div class="pq-top"><span>Problem ' + st.n + ' of 10</span><span>Right: ' + st.right + '</span></div>' + (which === 'all' ? '<p class="pq-topic">' + esc(S[q.id].name) + '</p>' : '') + '<p class="pq-q">' + esc(q.q) + ' = ?</p><div class="pq-num"><label for="pqa">Your answer</label><input id="pqa" inputmode="numeric" autocomplete="off"><button type="button" class="btn pq-sub">Check</button></div><div class="pq-fb" aria-live="polite"></div>';
      var inp = box.querySelector('#pqa'), go = function () { var v = inp.value.trim(); if (!/^\d+$/.test(v)) { box.querySelector('.pq-fb').textContent = 'Type a whole number.'; return; } judge(+v === q.ans); };
      box.querySelector('.pq-sub').onclick = go; inp.onkeydown = function (e) { if (e.key === 'Enter') go(); }; inp.focus();
    };
    var judge = function (ok) {
      if (ok) st.right++;
      [].forEach.call(box.querySelectorAll('button,input'), function (b) { b.disabled = true; });
      var fb = box.querySelector('.pq-fb'); fb.className = 'pq-fb ' + (ok ? 'good' : 'bad');
      fb.innerHTML = '<p><b>' + (ok ? 'Correct.' : 'Not quite. The answer is ' + st.q.ans + '.') + '</b></p><ol class="pq-why">' + st.q.steps.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ol><p>Answer: ' + st.q.ans + '</p><button type="button" class="btn pq-next">' + (st.n >= 10 ? 'See result' : 'Next problem') + '</button>';
      fb.querySelector('.pq-next').onclick = next; fb.querySelector('.pq-next').focus();
    };
    var done = function () {
      var best = get('best-' + which); if (best === null || st.right > best) put('best-' + which, st.right);
      box.innerHTML = '<div class="pq-done"><p class="pq-big">' + st.right + ' / 10</p><p class="hint">Try the same set again: the numbers change each time.</p><div class="pq-btns"><button type="button" class="btn pq-again">Play again</button></div></div>';
      box.querySelector('.pq-again').onclick = function () { st = { n: 0, right: 0 }; next(); };
    };
    start();
  }

  var sm = el('[data-show]');
  if (sm) {
    sm.innerHTML = '<div class="fields"><label>First number<input type="number" id="sa" min="0" max="99999" value="35" inputmode="numeric"></label><label>Second number<input type="number" id="sb" min="0" max="99999" value="35" inputmode="numeric"></label></div><p class="hint">For squares, type the same number twice. For "1000 minus a number", type the number first and 1000 second.</p><div class="result" data-out aria-live="polite"></div>';
    var run = function () {
      var a = Math.floor(+el('#sa').value), b = Math.floor(+el('#sb').value), ids = T.which(a, b), out = sm.querySelector('[data-out]');
      if (!ids.length) { out.innerHTML = '<p>None of our eight shortcuts fits ' + a + ' and ' + b + '. Multiply them the usual way.</p>'; return; }
      out.innerHTML = ids.map(function (id) { var r = T.show(id, a, b); return '<h3>' + esc(S[id].name) + '</h3><ol>' + r.steps.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ol><p class="big">' + esc(S[id].prompt(a, b)) + ' = ' + r.ans + '</p>'; }).join('');
    };
    sm.addEventListener('input', run); run();
  }
})();
