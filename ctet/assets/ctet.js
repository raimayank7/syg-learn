/* learn.shareyourgroup.com/ctet: practice questions of our own for the mathematics part of CTET Paper I (classes I to V) and Paper II (classes VI to VIII), all multiple choice,
   plus marks and time tools. Question makers first (pure, seedable; the build asks Node for thousands of questions and re-works every answer in Python from the facts
   stored with each question), then the pages' tools. Nothing is sent anywhere; best scores are kept only in this browser. */
(function () {
  'use strict';
  var G = {}, R = Math.random;
  G.seed = function (s) { var a = s >>> 0; R = function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; };
  function ri(a, b) { return a + Math.floor(R() * (b - a + 1)); }
  function pick(l) { return l[Math.floor(R() * l.length)]; }
  function shuffle(l) { l = l.slice(); for (var j = l.length - 1; j > 0; j--) { var k = Math.floor(R() * (j + 1)), t = l[j]; l[j] = l[k]; l[k] = t; } return l; }
  function gcd(a, b) { while (b) { var t = a % b; a = b; b = t; } return Math.abs(a); }
  function opts(ans, make) { var out = [ans], g = 0; while (out.length < 4 && g++ < 500) { var w = make(); if (w !== ans && w > -1e9 && out.indexOf(w) < 0 && isFinite(w) && Math.abs(w * 100 - Math.round(w * 100)) < 1e-9) out.push(w); } var i = 1; while (out.length < 4) { if (out.indexOf(ans + i) < 0) out.push(ans + i); i++; } return shuffle(out); }
  function sg(n) { return n < 0 ? '(−' + (-n) + ')' : String(n); }

  var GEN = {};
  /* ---------------- Paper I: classes I to V ---------------- */
  GEN.add = function () {
    var a = ri(120, 899), b = ri(100, 998 - 0);
    return { subj: 'p1', topic: 'Addition', kind: 'num', q: 'A shop sold ' + a + ' notebooks on Monday and ' + b + ' notebooks on Tuesday. How many notebooks did it sell in the two days?', ans: a + b, why: a + ' + ' + b + ' = ' + (a + b) + '.', fact: { t: 'add', a: a, b: b } };
  };
  GEN.sub = function () {
    var a = ri(500, 999), b = ri(101, a - 50);
    return { subj: 'p1', topic: 'Subtraction', kind: 'num', q: 'A school has ' + a + ' books. ' + b + ' books are given out. How many books are left?', ans: a - b, why: a + ' − ' + b + ' = ' + (a - b) + '.', fact: { t: 'sub', a: a, b: b } };
  };
  GEN.mul = function () {
    var a = ri(12, 98), b = ri(3, 9);
    return { subj: 'p1', topic: 'Multiplication', kind: 'num', q: 'One packet has ' + a + ' sweets. How many sweets are there in ' + b + ' packets?', ans: a * b, why: a + ' × ' + b + ' = ' + a * b + '.', fact: { t: 'mul', a: a, b: b } };
  };
  GEN.div = function () {
    var b = ri(3, 9), q = ri(11, 99);
    return { subj: 'p1', topic: 'Division', kind: 'num', q: q * b + ' pencils are shared equally among ' + b + ' children. How many pencils does each child get?', ans: q, why: q * b + ' ÷ ' + b + ' = ' + q + ', because ' + b + ' × ' + q + ' = ' + q * b + '.', fact: { t: 'div', a: q * b, b: b } };
  };
  GEN.place = function () {
    var digs = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4), n = Number(digs.join('')), idx = ri(0, 3), d = digs[idx], pos = 3 - idx;
    return { subj: 'p1', topic: 'Numbers and place value', kind: 'num', q: 'What is the place value of the digit ' + d + ' in the number ' + n + '?', ans: d * Math.pow(10, pos), why: 'In ' + n + ' the digit ' + d + ' is in the ' + ['ones', 'tens', 'hundreds', 'thousands'][pos] + ' place, so its place value is ' + d + ' × ' + Math.pow(10, pos) + ' = ' + d * Math.pow(10, pos) + '.', fact: { t: 'place', n: n, d: d } };
  };
  GEN.time = function () {
    var h1 = ri(1, 8), m1 = pick([0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]), add = ri(25, 170), tot = h1 * 60 + m1 + add, h2 = Math.floor(tot / 60), m2 = tot % 60;
    function f(h, m) { return h + ':' + (m < 10 ? '0' : '') + m; }
    return { subj: 'p1', topic: 'Time', kind: 'num', q: 'A class starts at ' + f(h1, m1) + ' and ends at ' + f(h2, m2) + ' (the same morning). How many minutes does the class last?', ans: add, why: f(h2, m2) + ' is ' + (h2 * 60 + m2) + ' minutes after midnight and ' + f(h1, m1) + ' is ' + (h1 * 60 + m1) + ' minutes after midnight, so the class lasts ' + (h2 * 60 + m2) + ' − ' + (h1 * 60 + m1) + ' = ' + add + ' minutes.', fact: { t: 'time', h1: h1, m1: m1, h2: h2, m2: m2 } };
  };
  GEN.money = function () {
    var a = ri(12, 95), b = ri(12, 95), c = Math.ceil((a + b + 1) / 50) * 50;
    return { subj: 'p1', topic: 'Money', kind: 'num', q: 'Meena buys a pen for Rs ' + a + ' and a book for Rs ' + b + '. She pays Rs ' + c + '. How many rupees does she get back?', ans: c - a - b, why: 'She spends ' + a + ' + ' + b + ' = ' + (a + b) + ' rupees, so she gets back ' + c + ' − ' + (a + b) + ' = ' + (c - a - b) + ' rupees.', fact: { t: 'money', a: a, b: b, c: c } };
  };
  GEN.measure = function () {
    var kind = pick(['kg', 'm']), x = ri(1, 9), y = ri(5, kind === 'kg' ? 950 : 95), mul = kind === 'kg' ? 1000 : 100, unit = kind === 'kg' ? 'g' : 'cm';
    y = y - y % 5;
    if (y === 0) y = 5;
    return { subj: 'p1', topic: 'Measurement', kind: 'num', q: (kind === 'kg' ? 'A bag of rice weighs ' + x + ' kg ' + y + ' g. How many grams is that in all?' : 'A rope is ' + x + ' m ' + y + ' cm long. How many centimetres is that in all?'), ans: x * mul + y, why: '1 ' + kind + ' = ' + mul + ' ' + unit + ', so ' + x + ' ' + kind + ' = ' + x * mul + ' ' + unit + '. Adding ' + y + ' ' + unit + ' gives ' + (x * mul + y) + ' ' + unit + '.', fact: { t: 'measure', unit: kind, x: x, y: y } };
  };
  GEN.pattern = function () {
    var a = ri(2, 20), d = ri(2, 9), s = [], i;
    for (i = 0; i < 5; i++) s.push(a + i * d);
    return { subj: 'p1', topic: 'Patterns', kind: 'num', q: 'Find the next number in the pattern: ' + s.join(', ') + ', ?', ans: a + 5 * d, why: 'Each number is ' + d + ' more than the one before it, so the next number is ' + s[4] + ' + ' + d + ' = ' + (a + 5 * d) + '.', fact: { t: 'pattern', s: s } };
  };
  GEN.perim = function () {
    var kind = pick(['square', 'rect']), l = ri(3, 25), w = ri(2, 20);
    if (kind === 'rect' && l === w) w += 1;
    if (kind === 'square') return { subj: 'p1', topic: 'Geometry: perimeter', kind: 'num', q: 'Each side of a square garden is ' + l + ' m. What is the distance around the garden in metres?', ans: 4 * l, why: 'A square has 4 equal sides, so the distance around is 4 × ' + l + ' = ' + 4 * l + ' m.', fact: { t: 'perim', kind: 'square', l: l } };
    return { subj: 'p1', topic: 'Geometry: perimeter', kind: 'num', q: 'A rectangular field is ' + l + ' m long and ' + w + ' m wide. What is the distance around the field in metres?', ans: 2 * (l + w), why: 'The distance around is 2 × (' + l + ' + ' + w + ') = ' + 2 * (l + w) + ' m.', fact: { t: 'perim', kind: 'rect', l: l, w: w } };
  };
  GEN.fracof = function () {
    var b = pick([2, 3, 4, 5, 6, 8, 10]), a = ri(1, b - 1), k = ri(2, 12), N = b * k;
    if (gcd(a, b) !== 1) return GEN.fracof();
    return { subj: 'p1', topic: 'Fractions of a quantity', kind: 'num', q: 'What is ' + a + '/' + b + ' of ' + N + '?', ans: a * k, why: N + ' ÷ ' + b + ' = ' + k + ', and ' + a + ' × ' + k + ' = ' + a * k + '.', fact: { t: 'fracof', a: a, b: b, N: N } };
  };
  GEN.avg4 = function () {
    var m = ri(10, 60), d = [ri(1, 9), ri(1, 9)], arr = [m + d[0], m - d[0], m + d[1], m - d[1]];
    arr = shuffle(arr);
    return { subj: 'p1', topic: 'Data handling: average', kind: 'num', q: 'The marks of four children are ' + arr.join(', ') + '. What is their average mark?', ans: m, why: 'The total is ' + (4 * m) + ', and ' + 4 * m + ' ÷ 4 = ' + m + '.', fact: { t: 'avg4', arr: arr } };
  };
  GEN.sides = function () {
    var shapes = { triangle: 3, quadrilateral: 4, pentagon: 5, hexagon: 6, heptagon: 7, octagon: 8 }, nm = pick(Object.keys(shapes));
    return { subj: 'p1', topic: 'Shapes', kind: 'num', q: 'How many sides does a ' + nm + ' have?', ans: shapes[nm], why: 'The name tells the number of sides: a ' + nm + ' has ' + shapes[nm] + ' sides.', fact: { t: 'sides', shape: nm } };
  };
  /* ---------------- Paper II: classes VI to VIII ---------------- */
  GEN.intg = function () {
    var a = ri(-20, 20), b = ri(-20, 20), op = pick(['+', '-']);
    if (a === 0 || b === 0) return GEN.intg();
    return { subj: 'p2', topic: 'Integers', kind: 'num', q: 'Find the value of ' + sg(a) + ' ' + (op === '+' ? '+' : '−') + ' ' + sg(b) + '.', ans: op === '+' ? a + b : a - b, why: op === '+' ? sg(a) + ' + ' + sg(b) + ' = ' + (a + b) + '.' : 'Subtracting ' + sg(b) + ' is the same as adding ' + (-b < 0 ? '(−' + b + ')' : (-b)) + ', so the result is ' + (a - b) + '.', fact: { t: 'intg', a: a, b: b, op: op } };
  };
  GEN.fracof2 = function () {
    var b = pick([3, 4, 5, 6, 7, 8, 9, 12]), a = ri(1, b - 1), k = ri(3, 15), N = b * k;
    if (gcd(a, b) !== 1) return GEN.fracof2();
    return { subj: 'p2', topic: 'Fractions', kind: 'num', q: 'A tank holds ' + N + ' litres when full. It is ' + a + '/' + b + ' full. How many litres of water are in it?', ans: a * k, why: 'One ' + b + 'th of ' + N + ' is ' + k + ' litres, so ' + a + '/' + b + ' of it is ' + a + ' × ' + k + ' = ' + a * k + ' litres.', fact: { t: 'fracof', a: a, b: b, N: N } };
  };
  GEN.ratio = function () {
    var a = ri(1, 7), b = ri(1, 7), k = ri(2, 12), T = (a + b) * k * 10, who = pick(['first', 'second']);
    if (a === b) return GEN.ratio();
    return { subj: 'p2', topic: 'Ratio and proportion', kind: 'num', q: 'Rs ' + T + ' is divided between two children in the ratio ' + a + ' : ' + b + '. How many rupees does the ' + who + ' child get?', ans: (who === 'first' ? a : b) * k * 10, why: 'Total parts = ' + (a + b) + ', so one part is ' + T + ' / ' + (a + b) + ' = ' + k * 10 + '. The ' + who + ' child gets ' + (who === 'first' ? a : b) + ' parts = Rs ' + (who === 'first' ? a : b) * k * 10 + '.', fact: { t: 'ratio', a: a, b: b, T: T, who: who } };
  };
  GEN.eq = function () {
    var a = ri(2, 9), x = ri(2, 15), b = ri(1, 20), s = pick(['p', 'm']), c = s === 'p' ? a * x + b : a * x - b;
    return { subj: 'p2', topic: 'Algebra: simple equations', kind: 'num', q: 'Solve for x: ' + a + 'x ' + (s === 'p' ? '+' : '−') + ' ' + b + ' = ' + c + '.', ans: x, why: s === 'p' ? 'Subtract ' + b + ' from both sides: ' + a + 'x = ' + (c - b) + '. Then x = ' + (c - b) + ' ÷ ' + a + ' = ' + x + '.' : 'Add ' + b + ' to both sides: ' + a + 'x = ' + (c + b) + '. Then x = ' + (c + b) + ' ÷ ' + a + ' = ' + x + '.', fact: { t: 'eq', a: a, b: b, c: c, s: s } };
  };
  GEN.angle = function () {
    var a = ri(20, 90), b = ri(20, 150 - a - 10), c = 180 - a - b;
    return { subj: 'p2', topic: 'Geometry: angles', kind: 'num', q: 'Two angles of a triangle are ' + a + '° and ' + b + '°. What is the third angle in degrees?', ans: c, why: 'The three angles of a triangle add up to 180°, so the third angle is 180° − ' + a + '° − ' + b + '° = ' + c + '°.', fact: { t: 'angle', a: a, b: b } };
  };
  GEN.tri = function () {
    var b = ri(3, 20) * 2, h = ri(3, 20);
    return { subj: 'p2', topic: 'Mensuration: triangle', kind: 'num', q: 'A triangle has a base of ' + b + ' cm and a height of ' + h + ' cm. What is its area in square centimetres?', ans: b * h / 2, why: 'Area of a triangle = ½ × base × height = ½ × ' + b + ' × ' + h + ' = ' + b * h / 2 + ' square centimetres.', fact: { t: 'tri', b: b, h: h } };
  };
  GEN.cuboid = function () {
    var l = ri(2, 12), w = ri(2, 10), h = ri(2, 9);
    return { subj: 'p2', topic: 'Mensuration: volume', kind: 'num', q: 'A box is ' + l + ' cm long, ' + w + ' cm wide and ' + h + ' cm high. What is its volume in cubic centimetres?', ans: l * w * h, why: 'Volume = length × width × height = ' + l + ' × ' + w + ' × ' + h + ' = ' + l * w * h + ' cubic centimetres.', fact: { t: 'cuboid', l: l, w: w, h: h } };
  };
  GEN.sqarea = function () {
    var s = ri(3, 25);
    return { subj: 'p2', topic: 'Mensuration: square', kind: 'num', q: 'The area of a square is ' + s * s + ' square metres. What is its perimeter in metres?', ans: 4 * s, why: 'The side is the square root of ' + s * s + ', which is ' + s + ' m. The perimeter is 4 × ' + s + ' = ' + 4 * s + ' m.', fact: { t: 'sqarea', A: s * s } };
  };
  GEN.hcf = function () {
    var g = pick([2, 3, 4, 5, 6, 7, 8]), x = pick([2, 3, 4, 5, 7, 9]), y = pick([2, 3, 4, 5, 7, 9, 11]);
    if (x === y || gcd(x, y) !== 1) return GEN.hcf();
    var kind = pick(['HCF', 'LCM']);
    return { subj: 'p2', topic: 'Playing with numbers: HCF and LCM', kind: 'num', q: 'What is the ' + kind + ' of ' + g * x + ' and ' + g * y + '?', ans: kind === 'HCF' ? g : g * x * y, why: g * x + ' = ' + g + ' × ' + x + ' and ' + g * y + ' = ' + g + ' × ' + y + ', and ' + x + ' and ' + y + ' have no common factor. So HCF = ' + g + ' and LCM = ' + g + ' × ' + x + ' × ' + y + ' = ' + g * x * y + '.', fact: { t: 'hcf', a: g * x, b: g * y, kind: kind } };
  };
  GEN.divisible = function () {
    var k = pick([3, 9]), bad = [], good, i, all;
    good = k * ri(12, 60);
    while (bad.length < 3) { var v = ri(30, 500); if (v % k !== 0 && bad.indexOf(v) < 0) bad.push(v); }
    all = shuffle(bad.concat([good]));
    return { subj: 'p2', topic: 'Playing with numbers: divisibility', kind: 'mcqnum', q: 'Which one of these numbers is divisible by ' + k + '?', ans: good, choices: all, why: 'A number is divisible by ' + k + ' when the sum of its digits is divisible by ' + k + '. Only ' + good + ' passes this test (digit sum ' + String(good).split('').reduce(function (s, c) { return s + +c; }, 0) + ').', fact: { t: 'divisible', k: k } };
  };
  GEN.median = function () {
    var vals = [], arr;
    while (vals.length < 5) { var v = ri(5, 60); if (vals.indexOf(v) < 0) vals.push(v); }
    arr = shuffle(vals);
    var sorted = vals.slice().sort(function (x, y) { return x - y; });
    return { subj: 'p2', topic: 'Data handling: median', kind: 'num', q: 'Find the median of these numbers: ' + arr.join(', ') + '.', ans: sorted[2], why: 'Arranged in order the numbers are ' + sorted.join(', ') + '. The middle one is ' + sorted[2] + '.', fact: { t: 'median', arr: arr } };
  };
  GEN.avgmiss = function () {
    var n = ri(4, 7), avg = ri(10, 40), arr = [], i, s = 0;
    for (i = 0; i < n - 1; i++) { var x = ri(avg - 8, avg + 8); arr.push(x); s += x; }
    var ans = avg * n - s;
    if (ans < 1) return GEN.avgmiss();
    return { subj: 'p2', topic: 'Data handling: average', kind: 'num', q: 'The average of ' + n + ' numbers is ' + avg + '. Of them, ' + (n - 1) + ' are ' + arr.join(', ') + '. What is the remaining number?', ans: ans, why: 'The total is ' + n + ' × ' + avg + ' = ' + avg * n + '. The given numbers add up to ' + s + ', so the last number is ' + ans + '.', fact: { t: 'avgmiss', n: n, avg: avg, arr: arr } };
  };
  var BY_SUBJ = { p1: ['add', 'sub', 'mul', 'div', 'place', 'time', 'money', 'measure', 'pattern', 'perim', 'fracof', 'avg4', 'sides'], p2: ['intg', 'fracof2', 'ratio', 'eq', 'angle', 'tri', 'cuboid', 'sqarea', 'hcf', 'divisible', 'median', 'avgmiss'] };
  G.ids = [].concat(BY_SUBJ.p1, BY_SUBJ.p2);
  G.subjects = BY_SUBJ;
  G.make = function (id) {
    var q = GEN[id](); q.id = id;
    if (q.kind === 'num') { var a = +q.ans, spread = Math.max(3, Math.round(Math.abs(a) * 0.3)); q.choices = opts(a, function () { return a + ri(-spread, spread); }); }
    q.kind = 'mcq';
    q.choices = q.choices.map(String); q.ans = String(q.ans);
    return q;
  };
  G.any = function (subj) { var ids = subj === 'all' ? G.ids : BY_SUBJ[subj]; return G.make(pick(ids)); };
  /* marks: 1 for a right answer, nothing taken off for a wrong one, 150 questions in a paper, 60% = 90 marks */
  G.score = function (correct) { return correct; };
  G.passMark = 90;
  G.shortfall = function (total) { return Math.max(0, G.passMark - total); };
  G.minutesEach = function (total, reserve, questions) { return (total - reserve) / questions; };

  if (typeof module !== 'undefined' && module.exports) { module.exports = G; return; }
  window.CTET = G;

  /* ---------------- pages ---------------- */
  var d = document;
  function el(s) { return d.querySelector(s); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function sgn(n) { return String(n).replace('-', '−'); }
  function get(k) { try { return JSON.parse(localStorage.getItem('ctet-' + k)); } catch (e) { return null; } }
  function put(k, v) { try { localStorage.setItem('ctet-' + k, JSON.stringify(v)); } catch (e) {} }

  var box = el('[data-practice]');
  if (box) {
    var subj = box.getAttribute('data-practice'), st, label = { p1: 'Paper I mathematics', p2: 'Paper II mathematics', all: 'Mixed mathematics' };
    var start = function () {
      var best = get('best-' + subj);
      box.innerHTML = '<div class="pq-setup"><p class="pq-lab">' + label[subj] + ': 10 questions, 1 mark each</p><p>Every question has four options and one best answer, as in CTET. There is no negative marking in CTET, so a wrong answer costs nothing. Answer every question.</p>' +
        (best !== null ? '<p><b>Your best here: ' + best + ' / 10</b></p>' : '') + '<button type="button" class="btn pq-go">Start</button></div>';
      box.querySelector('.pq-go').onclick = function () { st = { n: 0, score: 0, wrong: 0, log: [] }; next(); };
    };
    var next = function () {
      if (st.n >= 10) return done();
      var q = G.any(subj); st.n++; st.q = q;
      var body = '<div class="pq-top"><span>Question ' + st.n + ' of 10</span><span>Score: ' + st.score + '</span></div><p class="pq-topic">' + esc(q.topic) + ' · Multiple choice</p><p class="pq-q">' + q.q + '</p>';
      body += '<div class="pq-ch">' + q.choices.map(function (c, i) { return '<button type="button" data-v="' + esc(c) + '"><i>' + 'ABCD'[i] + '</i> ' + esc(sgn(c)) + '</button>'; }).join('') + '</div><div class="pq-fb" aria-live="polite"></div>';
      box.innerHTML = body;
      [].forEach.call(box.querySelectorAll('.pq-ch button'), function (b) { b.onclick = function () { judge(b.getAttribute('data-v'), b); }; });
    };
    var judge = function (v, btn) {
      var ok = v === st.q.ans;
      if (ok) st.score++; else st.wrong++;
      st.log.push([st.q, ok ? 'right' : 'wrong']);
      btn.classList.add(ok ? 'good' : 'bad');
      [].forEach.call(box.querySelectorAll('.pq-ch button'), function (b) { if (b.getAttribute('data-v') === st.q.ans) b.classList.add('good'); });
      reveal(ok ? 'Correct. +1 mark.' : 'Not quite. The answer is ' + sgn(st.q.ans) + '. No mark is lost.', ok ? 'good' : 'bad');
    };
    var reveal = function (msg, cls) {
      [].forEach.call(box.querySelectorAll('button'), function (b) { b.disabled = true; });
      var fb = box.querySelector('.pq-fb'); fb.className = 'pq-fb ' + cls; fb.innerHTML = '<p><b>' + msg + '</b></p><p class="pq-why">' + st.q.why.replace(/-/g, '−') + '</p><button type="button" class="btn pq-next">' + (st.n >= 10 ? 'See result' : 'Next question') + '</button>';
      fb.querySelector('.pq-next').onclick = next; fb.querySelector('.pq-next').focus();
    };
    var done = function () {
      var best = get('best-' + subj); if (best === null || st.score > best) put('best-' + subj, st.score);
      var topics = {}; st.log.forEach(function (x) { if (x[1] === 'wrong') topics[x[0].topic] = 1; });
      var weak = Object.keys(topics);
      box.innerHTML = '<div class="pq-done"><p class="pq-big">' + st.score + ' / 10</p><p>' + st.score + ' right, ' + st.wrong + ' wrong.</p>' +
        (weak.length ? '<p><b>Look again at:</b> ' + weak.map(esc).join(', ') + '.</p>' : '<p>No wrong answers this round.</p>') +
        '<p class="hint">These are our own questions and cover only the mathematics content part. A real CTET paper is much wider (child development, languages, environmental studies or science). The score is a practice figure, not a prediction.</p><div class="pq-btns"><button type="button" class="btn pq-again">Play again</button></div></div>';
      box.querySelector('.pq-again').onclick = function () { st = { n: 0, score: 0, wrong: 0, log: [] }; next(); };
    };
    start();
  }

  var mc = el('[data-marks-calc]');
  if (mc) {
    var sets = {
      p1: { name: 'Paper I (classes I to V)', parts: [['Child Development and Pedagogy', 30], ['Mathematics', 30], ['Environmental Studies', 30], ['Language I', 30], ['Language II', 30]] },
      p2m: { name: 'Paper II (Mathematics and Science teacher)', parts: [['Child Development and Pedagogy', 30], ['Mathematics and Science', 60], ['Language I', 30], ['Language II', 30]] },
      p2s: { name: 'Paper II (Social Studies teacher)', parts: [['Child Development and Pedagogy', 30], ['Social Studies / Social Science', 60], ['Language I', 30], ['Language II', 30]] }
    };
    mc.innerHTML = '<div class="fields"><label>Paper<select id="cp"><option value="p1">' + sets.p1.name + '</option><option value="p2m">' + sets.p2m.name + '</option><option value="p2s">' + sets.p2s.name + '</option></select></label></div><div data-rows></div><p class="calc-msg" aria-live="polite"></p><p class="calc-tot">Total: <b data-total>0</b> / 150</p><p class="calc-tot" data-pass></p>';
    var draw = function () {
      var s = sets[el('#cp').value];
      mc.querySelector('[data-rows]').innerHTML = '<div class="tbl"><table class="calc"><thead><tr><th>Section</th><th>Right answers</th><th>Out of</th></tr></thead><tbody>' + s.parts.map(function (p, i) { return '<tr><th scope="row">' + p[0] + '</th><td><input type="number" min="0" max="' + p[1] + '" inputmode="numeric" value="0" data-k="' + i + '" aria-label="' + p[0] + ' right answers"></td><td class="n">' + p[1] + '</td></tr>'; }).join('') + '</tbody></table></div>';
      calc();
    };
    var calc = function () {
      var s = sets[el('#cp').value], tot = 0, msg = [];
      s.parts.forEach(function (p, i) { var v = Math.max(0, parseInt(mc.querySelector('[data-k="' + i + '"]').value, 10) || 0); if (v > p[1]) { msg.push(p[0] + ' has only ' + p[1] + ' questions.'); v = p[1]; } tot += G.score(v); });
      mc.querySelector('[data-total]').textContent = tot; mc.querySelector('.calc-msg').textContent = msg.join(' ');
      mc.querySelector('[data-pass]').textContent = tot >= G.passMark ? 'This reaches the 60% mark (90 of 150).' : 'The 60% mark is 90 of 150. You are ' + G.shortfall(tot) + ' marks short.';
    };
    mc.addEventListener('input', function (e) { if (e.target.id === 'cp') draw(); else calc(); }); draw();
  }

  var tp = el('[data-timer-plan]');
  if (tp) {
    tp.innerHTML = '<div class="fields"><label>Minutes kept for a final check<input type="number" id="tr" min="0" max="40" value="10" inputmode="numeric"></label><label>Minutes for reading the four language passages<input type="number" id="tb" min="0" max="60" value="30" inputmode="numeric"></label></div><div class="result" data-out aria-live="polite"></div>';
    var tplan = function () {
      var r = Math.min(40, Math.max(0, +el('#tr').value || 0)), b = Math.min(60, Math.max(0, +el('#tb').value || 0)), out = tp.querySelector('[data-out]'), left = 150 - r - b;
      out.innerHTML = '<p>A paper has 150 minutes for 150 questions. With ' + r + ' minutes kept for checking and ' + b + ' for reading the passages, ' + left + ' minutes remain for the 150 questions: <b>' + (left / 150).toFixed(2) + ' minutes</b> (about ' + Math.round(left * 60 / 150) + ' seconds) a question.</p>';
    };
    tp.addEventListener('input', tplan); tplan();
  }
})();
