/* learn.shareyourgroup.com/olympiad: Olympiad-style practice questions of our own whose answer is a one- or two-digit number (like the IOQM answer sheet), plus an eligibility checker
   that applies the age and class rules published by HBCSE for IOQM 2026 and the science Olympiad NSE 2026. Question makers first (pure, seedable; the build asks Node for thousands
   of questions and re-works every answer in Python from the facts stored with each question), then the pages' tools. Nothing is sent anywhere. */
(function () {
  'use strict';
  var G = {}, R = Math.random;
  G.seed = function (s) { var a = s >>> 0; R = function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; };
  function ri(a, b) { return a + Math.floor(R() * (b - a + 1)); }
  function pick(l) { return l[Math.floor(R() * l.length)]; }
  function gcd(a, b) { while (b) { var t = a % b; a = b; b = t; } return Math.abs(a); }
  function powmod(a, b, m) { var r = 1 % m; a %= m; while (b > 0) { if (b & 1) r = r * a % m; a = a * a % m; b >>= 1; } return r; }
  function choose(n, k) { var r = 1; for (var i = 1; i <= k; i++) r = r * (n - k + i) / i; return Math.round(r); }
  function phi(n) { var c = 0; for (var i = 1; i <= n; i++) if (gcd(i, n) === 1) c++; return c; }

  var GEN = {};
  /* number theory */
  GEN.rem = function () {
    var a = ri(2, 9), b = ri(5, 40), m = pick([7, 11, 13, 17, 19, 23]);
    return { subj: 'nt', topic: 'Remainders and powers', q: 'What is the remainder when ' + a + '^' + b + ' is divided by ' + m + '?', ans: powmod(a, b, m), why: 'Reduce powers modulo ' + m + ' step by step (or use Fermat’s little theorem, since ' + m + ' is prime). The remainder is ' + powmod(a, b, m) + '.', fact: { t: 'rem', a: a, b: b, m: m } };
  };
  GEN.phi = function () {
    var n = ri(10, 99);
    return { subj: 'nt', topic: 'Euler’s phi function', q: 'How many integers from 1 to ' + n + ' are coprime to ' + n + '?', ans: phi(n), why: 'This is Euler’s phi function of ' + n + ', which counts the numbers up to ' + n + ' with no common factor with ' + n + ' other than 1. Its value is ' + phi(n) + '.', fact: { t: 'phi', n: n } };
  };
  GEN.ndiv = function () {
    var n = ri(12, 99), c = 0, i;
    for (i = 1; i <= n; i++) if (n % i === 0) c++;
    return { subj: 'nt', topic: 'Divisors', q: 'How many positive divisors does ' + n + ' have?', ans: c, why: 'Write ' + n + ' as a product of prime powers; if the exponents are e1, e2, … the number of divisors is (e1 + 1)(e2 + 1)… It comes to ' + c + '.', fact: { t: 'ndiv', n: n } };
  };
  GEN.lastTwo = function () {
    var a = pick([3, 7, 9, 11, 13, 17, 19, 21, 23]), n = ri(10, 60);
    return { subj: 'nt', topic: 'Last two digits', q: 'What are the last two digits of ' + a + '^' + n + '? (Give the number formed by them, for example 07 is written 7.)', ans: powmod(a, n, 100), why: 'The last two digits of a number are its remainder on division by 100. Working modulo 100 gives ' + powmod(a, n, 100) + '.', fact: { t: 'lastTwo', a: a, n: n } };
  };
  GEN.gcd = function () {
    var g = ri(2, 12), x = ri(2, 8), y = ri(2, 8);
    if (gcd(x, y) !== 1 || x === y) return GEN.gcd();
    return { subj: 'nt', topic: 'HCF', q: 'Find the greatest common divisor of ' + g * x * 3 + ' and ' + g * y * 3 + '.', ans: g * 3, why: g * x * 3 + ' = ' + g * 3 + ' × ' + x + ' and ' + g * y * 3 + ' = ' + g * 3 + ' × ' + y + ', and ' + x + ' and ' + y + ' are coprime, so the greatest common divisor is ' + g * 3 + '.', fact: { t: 'gcd', a: g * x * 3, b: g * y * 3 } };
  };
  /* combinatorics */
  GEN.binom = function () {
    var n = ri(5, 10), k = ri(2, 4);
    if (choose(n, k) > 99) return GEN.binom();
    return { subj: 'comb', topic: 'Counting: choosing', q: 'In how many ways can ' + k + ' people be chosen from a group of ' + n + '?', ans: choose(n, k), why: 'The number of ways is C(' + n + ', ' + k + ') = ' + choose(n, k) + '.', fact: { t: 'binom', n: n, k: k } };
  };
  GEN.shake = function () {
    var n = ri(5, 14);
    return { subj: 'comb', topic: 'Counting: handshakes', q: n + ' people are at a party and each person shakes hands once with every other person. How many handshakes are there?', ans: n * (n - 1) / 2, why: 'Each pair shakes hands once, so there are C(' + n + ', 2) = ' + n + ' × ' + (n - 1) + ' / 2 = ' + n * (n - 1) / 2 + ' handshakes.', fact: { t: 'shake', n: n } };
  };
  GEN.round = function () {
    var n = ri(3, 5), f = 1, i;
    for (i = 2; i < n; i++) f *= i;
    return { subj: 'comb', topic: 'Counting: circular arrangements', q: 'In how many ways can ' + n + ' different people sit around a round table, if two seatings that differ only by a rotation count as the same?', ans: f, why: 'Fix one person to remove the rotations; the other ' + (n - 1) + ' can be arranged in (' + n + ' − 1)! = ' + f + ' ways.', fact: { t: 'round', n: n } };
  };
  GEN.incl = function () {
    var N = ri(40, 99), a = pick([2, 3, 4, 5]), b = pick([3, 5, 6, 7]);
    if (a === b) return GEN.incl();
    var c = 0, i;
    for (i = 1; i <= N; i++) if (i % a === 0 || i % b === 0) c++;
    return { subj: 'comb', topic: 'Inclusion and exclusion', q: 'How many integers from 1 to ' + N + ' are divisible by ' + a + ' or by ' + b + ' (or both)?', ans: c, why: 'Add the multiples of ' + a + ' and of ' + b + ' and take away the multiples of both (multiples of ' + a * b / gcd(a, b) + '): ' + Math.floor(N / a) + ' + ' + Math.floor(N / b) + ' − ' + Math.floor(N / (a * b / gcd(a, b))) + ' = ' + c + '.', fact: { t: 'incl', N: N, a: a, b: b } };
  };
  GEN.zeros = function () {
    var n = ri(20, 99), c = 0, p;
    for (p = 5; p <= n; p *= 5) c += Math.floor(n / p);
    return { subj: 'comb', topic: 'Factorials', q: 'How many zeros are there at the end of ' + n + '! (the product 1 × 2 × … × ' + n + ')?', ans: c, why: 'Each zero comes from a factor 10 = 2 × 5, and there are always enough 2s, so count the factors of 5: ' + c + '.', fact: { t: 'zeros', n: n } };
  };
  /* algebra and geometry */
  GEN.terms = function () {
    var a = ri(1, 12), d = ri(2, 9), k = ri(8, 40), l = a + (k - 1) * d;
    return { subj: 'alg', topic: 'Arithmetic progressions', q: 'How many terms does the arithmetic progression ' + a + ', ' + (a + d) + ', ' + (a + 2 * d) + ', …, ' + l + ' have?', ans: k, why: 'The nth term is a + (n − 1)d, so ' + l + ' = ' + a + ' + (n − 1) × ' + d + ', which gives n = ' + k + '.', fact: { t: 'terms', a: a, d: d, l: l } };
  };
  GEN.vieta = function () {
    var r = ri(1, 6), s = ri(1, 6);
    return { subj: 'alg', topic: 'Roots of a quadratic', q: 'The roots of x² − ' + (r + s) + 'x + ' + r * s + ' = 0 are p and q. What is the value of p² + q²?', ans: r * r + s * s, why: 'By the relations between roots and coefficients, p + q = ' + (r + s) + ' and pq = ' + r * s + '. So p² + q² = (p + q)² − 2pq = ' + (r + s) * (r + s) + ' − ' + 2 * r * s + ' = ' + (r * r + s * s) + '.', fact: { t: 'vieta', S: r + s, P: r * s } };
  };
  GEN.inradius = function () {
    var tr = pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]]), k = ri(1, 3);
    if (tr[0] * k > 99) return GEN.inradius();
    return { subj: 'alg', topic: 'Geometry: inradius', q: 'A right-angled triangle has sides ' + tr[0] * k + ', ' + tr[1] * k + ' and ' + tr[2] * k + '. What is the radius of its inscribed circle?', ans: (tr[0] + tr[1] - tr[2]) * k / 2, why: 'For a right triangle with legs a, b and hypotenuse c the inradius is (a + b − c)/2 = (' + tr[0] * k + ' + ' + tr[1] * k + ' − ' + tr[2] * k + ')/2 = ' + (tr[0] + tr[1] - tr[2]) * k / 2 + '.', fact: { t: 'inradius', a: tr[0] * k, b: tr[1] * k, c: tr[2] * k } };
  };
  var BY_SUBJ = { nt: ['rem', 'phi', 'ndiv', 'lastTwo', 'gcd'], comb: ['binom', 'shake', 'round', 'incl', 'zeros'], alg: ['terms', 'vieta', 'inradius'] };
  G.ids = [].concat(BY_SUBJ.nt, BY_SUBJ.comb, BY_SUBJ.alg);
  G.subjects = BY_SUBJ;
  G.make = function (id) { var q = GEN[id](); q.id = id; q.ans = String(q.ans); return q; };
  G.any = function (subj) { var ids = subj === 'all' ? G.ids : BY_SUBJ[subj]; return G.make(pick(ids)); };
  /* eligibility rules, as published by HBCSE (IOQM 2026 eligibility PDF and the Science Olympiad eligibility page, read 14 November 2026) */
  G.RULES = {
    ioqm: { name: 'IOQM 2026 (Mathematical Olympiad, first stage)', from: '2007-08-01', to: '2014-07-31', classes: [8, 9, 10, 11, 12] },
    nse: { name: 'NSE 2026 (Astronomy, Biology, Chemistry, Physics: first stage of the Science Olympiad)', from: '2007-07-01', to: '2012-06-30', classes: [10, 11, 12] }
  };
  G.check = function (rule, dob, cls) {
    var r = G.RULES[rule], out = { ageOk: false, classOk: false };
    if (dob) out.ageOk = dob >= r.from && dob <= r.to;
    out.classOk = r.classes.indexOf(+cls) >= 0;
    out.ok = out.ageOk && out.classOk;
    return out;
  };

  if (typeof module !== 'undefined' && module.exports) { module.exports = G; return; }
  window.OLYMPIAD = G;

  /* ---------------- pages ---------------- */
  var d = document;
  function el(s) { return d.querySelector(s); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function get(k) { try { return JSON.parse(localStorage.getItem('olympiad-' + k)); } catch (e) { return null; } }
  function put(k, v) { try { localStorage.setItem('olympiad-' + k, JSON.stringify(v)); } catch (e) {} }

  var box = el('[data-practice]');
  if (box) {
    var subj = box.getAttribute('data-practice'), st, label = { nt: 'Number theory', comb: 'Counting', alg: 'Algebra and geometry', all: 'Mixed' };
    var start = function () {
      var best = get('best-' + subj);
      box.innerHTML = '<div class="pq-setup"><p class="pq-lab">' + label[subj] + ': 10 questions, answer is a whole number from 0 to 99</p><p>Like the IOQM answer sheet, each answer is a one-digit or two-digit number. There is no penalty: our practice only counts how many you get right. Work on paper, then type the number.</p>' +
        (best !== null ? '<p><b>Your best here: ' + best + ' / 10</b></p>' : '') + '<button type="button" class="btn pq-go">Start</button></div>';
      box.querySelector('.pq-go').onclick = function () { st = { n: 0, right: 0, log: [] }; next(); };
    };
    var next = function () {
      if (st.n >= 10) return done();
      var q = G.any(subj); st.n++; st.q = q;
      box.innerHTML = '<div class="pq-top"><span>Question ' + st.n + ' of 10</span><span>Right: ' + st.right + '</span></div><p class="pq-topic">' + esc(q.topic) + '</p><p class="pq-q">' + esc(q.q) + '</p><div class="pq-num"><label for="pqa">Your answer (0 to 99)</label><input id="pqa" inputmode="numeric" autocomplete="off" maxlength="2"><button type="button" class="btn pq-sub">Check</button></div><div class="pq-btns"><button type="button" class="btn ghost pq-skip">Skip</button></div><div class="pq-fb" aria-live="polite"></div>';
      var inp = box.querySelector('#pqa');
      box.querySelector('.pq-skip').onclick = function () { st.log.push([q, 'skipped']); reveal('Skipped.', 'skp'); };
      var go = function () { var v = inp.value.trim(); if (!/^\d{1,2}$/.test(v)) { box.querySelector('.pq-fb').textContent = 'Type a whole number from 0 to 99.'; return; } judge(String(+v)); };
      box.querySelector('.pq-sub').onclick = go; inp.onkeydown = function (e) { if (e.key === 'Enter') go(); }; inp.focus();
    };
    var judge = function (v) {
      var ok = v === st.q.ans; if (ok) st.right++; st.log.push([st.q, ok ? 'right' : 'wrong']);
      reveal(ok ? 'Correct.' : 'Not quite. The answer is ' + st.q.ans + '.', ok ? 'good' : 'bad');
    };
    var reveal = function (msg, cls) {
      [].forEach.call(box.querySelectorAll('button,input'), function (b) { b.disabled = true; });
      var fb = box.querySelector('.pq-fb'); fb.className = 'pq-fb ' + cls; fb.innerHTML = '<p><b>' + msg + '</b></p><p class="pq-why">' + esc(st.q.why) + '</p><button type="button" class="btn pq-next">' + (st.n >= 10 ? 'See result' : 'Next question') + '</button>';
      fb.querySelector('.pq-next').onclick = next; fb.querySelector('.pq-next').focus();
    };
    var done = function () {
      var best = get('best-' + subj); if (best === null || st.right > best) put('best-' + subj, st.right);
      var topics = {}; st.log.forEach(function (x) { if (x[1] !== 'right') topics[x[0].topic] = 1; });
      var weak = Object.keys(topics);
      box.innerHTML = '<div class="pq-done"><p class="pq-big">' + st.right + ' / 10</p>' + (weak.length ? '<p><b>Look again at:</b> ' + weak.map(esc).join(', ') + '.</p>' : '<p>All ten right.</p>') +
        '<p class="hint">These are our own questions and are much easier than IOQM or RMO problems. The score is a practice figure, not a prediction.</p><div class="pq-btns"><button type="button" class="btn pq-again">Play again</button></div></div>';
      box.querySelector('.pq-again').onclick = function () { st = { n: 0, right: 0, log: [] }; next(); };
    };
    start();
  }

  var ec = el('[data-eligibility]');
  if (ec) {
    ec.innerHTML = '<div class="fields"><label>Programme<select id="er"><option value="ioqm">' + G.RULES.ioqm.name + '</option><option value="nse">' + G.RULES.nse.name + '</option></select></label><label>Date of birth<input type="date" id="ed" min="1990-01-01" max="2025-12-31"></label><label>Class you are studying in<select id="ec"><option>6</option><option>7</option><option>8</option><option>9</option><option>10</option><option selected>11</option><option>12</option></select></label></div><div class="result" data-out aria-live="polite"></div>';
    var run = function () {
      var rule = el('#er').value, r = G.RULES[rule], dob = el('#ed').value, c = el('#ec').value, res = G.check(rule, dob, c), out = ec.querySelector('[data-out]');
      if (!dob) { out.innerHTML = '<p>Enter a date of birth to check the age rule. Born between <b>' + r.from + '</b> and <b>' + r.to + '</b> (both days included), and in class ' + r.classes.join(', ') + '.</p>'; return; }
      out.innerHTML = '<p class="big">' + (res.ok ? 'Meets the age and class rules' : 'Does not meet the age or class rule') + '</p><ul><li>Age rule (born ' + r.from + ' to ' + r.to + '): ' + (res.ageOk ? 'met' : 'not met') + '.</li><li>Class rule (class ' + r.classes.join(', ') + '): ' + (res.classOk ? 'met' : 'not met') + '.</li></ul><p>These are only two of the conditions. HBCSE also asks that you can hold an Indian passport, have lived and studied in India (or studied in an Indian school system) since the date it names, have not passed your Class 12 board examination early, and do not start university study by 1 June 2027. Read the official eligibility page and decide for yourself. You are responsible for meeting every condition.</p>';
    };
    ec.addEventListener('input', run); ec.addEventListener('change', run); run();
  }
})();
