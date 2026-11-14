/* learn.shareyourgroup.com/ssc: practice questions of our own in the style of the General Intelligence and Reasoning and Quantitative Aptitude parts of SSC Tier-I examinations, all multiple choice, plus marks, planner and time tools.
   Question makers first (pure, seedable; the build asks Node for thousands of questions and re-works every answer in Python from the facts stored with each question), then the pages' tools.
   Nothing is sent anywhere; best scores are kept only in this browser. */
(function () {
  'use strict';
  var G = {}, R = Math.random;
  G.seed = function (s) { var a = s >>> 0; R = function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; };
  function ri(a, b) { return a + Math.floor(R() * (b - a + 1)); }
  function pick(l) { return l[Math.floor(R() * l.length)]; }
  function shuffle(l) { l = l.slice(); for (var j = l.length - 1; j > 0; j--) { var k = Math.floor(R() * (j + 1)), t = l[j]; l[j] = l[k]; l[k] = t; } return l; }
  function gcd(a, b) { while (b) { var t = a % b; a = b; b = t; } return Math.abs(a); }
  function fact(n) { var f = 1; for (var i = 2; i <= n; i++) f *= i; return f; }
  function C(n, r) { return fact(n) / (fact(r) * fact(n - r)); }
  /* four different numbers with the right one in them; make() proposes a wrong one */
  function opts(ans, make) { var out = [ans], g = 0; while (out.length < 4 && g++ < 500) { var w = make(); if (w !== ans && w > -1e9 && out.indexOf(w) < 0 && isFinite(w) && Math.abs(w * 100 - Math.round(w * 100)) < 1e-9) out.push(w); } var i = 1; while (out.length < 4) { if (out.indexOf(ans + i) < 0) out.push(ans + i); i++; } return shuffle(out); }
  function near(ans, spread) { return function () { return ans + ri(-spread, spread); }; }

  var GEN = {};
  function fmt(n) { return String(n); }
  /* ---------------- quantitative ---------------- */
  GEN.pct = function () {
    var p = pick([5, 10, 12, 15, 20, 25, 30, 40, 45, 60, 75]), N = pick([40, 60, 80, 120, 160, 200, 240, 400, 480, 800, 1200]), ans = p * N / 100;
    if (ans !== Math.floor(ans)) return GEN.pct();
    return { subj: 'quant', topic: 'Percentages', kind: 'num', q: 'What is ' + p + '% of ' + N + '?', ans: ans, why: p + '% of ' + N + ' = ' + p + '/ssc/100 × ' + N + ' = ' + ans + '.', fact: { t: 'pct', p: p, N: N } };
  };
  GEN.ratio = function () {
    var a = ri(1, 7), b = ri(1, 7), k = ri(2, 12), T = (a + b) * k * 10, who = pick(['first', 'second']);
    if (a === b) return GEN.ratio();
    var ans = who === 'first' ? a * k * 10 : b * k * 10;
    return { subj: 'quant', topic: 'Ratio and proportion', kind: 'num', q: 'Rs ' + T + ' is divided between two people in the ratio ' + a + ' : ' + b + '. How many rupees does the ' + who + ' person get?', ans: ans, why: 'Total parts = ' + (a + b) + ', so one part is ' + T + ' / ' + (a + b) + ' = ' + k * 10 + '. The ' + who + ' person gets ' + (who === 'first' ? a : b) + ' parts = Rs ' + ans + '.', fact: { t: 'ratio', a: a, b: b, T: T, who: who } };
  };
  GEN.avg = function () {
    var n = ri(4, 7), avg = ri(10, 40), arr = [], i, s = 0;
    for (i = 0; i < n - 1; i++) { var x = ri(avg - 8, avg + 8); arr.push(x); s += x; }
    var ans = avg * n - s;
    if (ans < 1) return GEN.avg();
    return { subj: 'quant', topic: 'Averages', kind: 'num', q: 'The average of ' + n + ' numbers is ' + avg + '. Of them, ' + (n - 1) + ' are ' + arr.join(', ') + '. What is the remaining number?', ans: ans, why: 'The total is ' + n + ' × ' + avg + ' = ' + avg * n + '. The given numbers add up to ' + s + ', so the last number is ' + ans + '.', fact: { t: 'avg', n: n, avg: avg, arr: arr } };
  };
  GEN.si = function () {
    var P = pick([1000, 2000, 5000, 8000, 10000]), R = pick([4, 5, 6, 8, 10]), T = ri(2, 5), ans = P * R * T / 100;
    return { subj: 'quant', topic: 'Simple interest', kind: 'num', q: 'What is the simple interest in rupees on Rs ' + P + ' at ' + R + '% per year for ' + T + ' years?', ans: ans, why: 'SI = P × R × T / 100 = ' + P + ' × ' + R + ' × ' + T + ' / 100 = ' + ans + '.', fact: { t: 'si', P: P, R: R, T: T } };
  };
  GEN.speed = function () {
    var v = pick([30, 40, 45, 50, 60, 72, 80]), t = pick([2, 3, 4, 5]), ans = v * t;
    return { subj: 'quant', topic: 'Speed, time and distance', kind: 'num', q: 'A bus travels at ' + v + ' km per hour for ' + t + ' hours. How many kilometres does it cover?', ans: ans, why: 'Distance = speed × time = ' + v + ' × ' + t + ' = ' + ans + ' km.', fact: { t: 'speed', v: v, tm: t } };
  };
  GEN.profit = function () {
    var cp = pick([200, 400, 500, 800, 1000, 1200, 2000]), pr = pick([5, 10, 15, 20, 25, 30, 40]), sp = cp * (100 + pr) / 100;
    return { subj: 'quant', topic: 'Profit and loss', kind: 'num', q: 'A shopkeeper buys an article for Rs ' + cp + ' and sells it for Rs ' + sp + '. What is the profit per cent?', ans: pr, why: 'Profit = ' + sp + ' − ' + cp + ' = ' + (sp - cp) + '. Profit % = ' + (sp - cp) + ' / ' + cp + ' × 100 = ' + pr + '%.', fact: { t: 'profit', cp: cp, sp: sp } };
  };
  GEN.area = function () {
    var l = ri(4, 20), w = ri(2, 15), kind = pick(['area', 'perimeter']);
    if (l === w) return GEN.area();
    var ans = kind === 'area' ? l * w : 2 * (l + w);
    return { subj: 'quant', topic: 'Mensuration', kind: 'num', q: 'A rectangle is ' + l + ' cm long and ' + w + ' cm wide. What is its ' + kind + ' (in ' + (kind === 'area' ? 'square centimetres' : 'centimetres') + ')?', ans: ans, why: kind === 'area' ? 'Area = length × width = ' + l + ' × ' + w + ' = ' + ans + '.' : 'Perimeter = 2 × (length + width) = 2 × (' + l + ' + ' + w + ') = ' + ans + '.', fact: { t: 'area', l: l, w: w, kind: kind } };
  };
  GEN.hcf = function () {
    var g = pick([2, 3, 4, 5, 6, 7, 8]), x = pick([2, 3, 4, 5, 7, 9]), y = pick([2, 3, 4, 5, 7, 9, 11]);
    if (x === y || gcd(x, y) !== 1) return GEN.hcf();
    var kind = pick(['HCF', 'LCM']), ans = kind === 'HCF' ? g : g * x * y;
    return { subj: 'quant', topic: 'HCF and LCM', kind: 'num', q: 'What is the ' + kind + ' of ' + g * x + ' and ' + g * y + '?', ans: ans, why: g * x + ' = ' + g + ' × ' + x + ' and ' + g * y + ' = ' + g + ' × ' + y + ', and ' + x + ' and ' + y + ' have no common factor. So HCF = ' + g + ' and LCM = ' + g + ' × ' + x + ' × ' + y + ' = ' + g * x * y + '.', fact: { t: 'hcf', a: g * x, b: g * y, kind: kind } };
  };
  /* ---------------- reasoning ---------------- */
  GEN.series = function () {
    var kind = pick(['add', 'mul', 'sq']), a, d, s = [], i, ans;
    if (kind === 'add') { a = ri(2, 20); d = ri(2, 9); for (i = 0; i < 5; i++) s.push(a + i * d); ans = a + 5 * d; }
    else if (kind === 'mul') { a = ri(1, 4); d = pick([2, 3]); for (i = 0; i < 5; i++) s.push(a * Math.pow(d, i)); ans = a * Math.pow(d, 5); }
    else { a = ri(2, 6); for (i = 0; i < 5; i++) s.push((a + i) * (a + i)); ans = (a + 5) * (a + 5); }
    return { subj: 'reason', topic: 'Number series', kind: 'num', q: 'Find the next number in the series: ' + s.join(', ') + ', ?', ans: ans, why: kind === 'add' ? 'Each term is ' + d + ' more than the one before, so the next is ' + ans + '.' : kind === 'mul' ? 'Each term is ' + d + ' times the one before, so the next is ' + ans + '.' : 'These are the squares of consecutive numbers, so the next is ' + (a + 5) + '² = ' + ans + '.', fact: { t: 'series', kind: kind, s: s } };
  };
  GEN.direction = function () {
    var tr = pick([[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [9, 12, 15]]), d1 = pick(['east', 'west']), d2 = pick(['north', 'south']);
    return { subj: 'reason', topic: 'Direction sense', kind: 'num', q: 'A person walks ' + tr[0] + ' km ' + d1 + ' and then ' + tr[1] + ' km ' + d2 + '. How far, in a straight line, is the person from the starting point (in km)?', ans: tr[2], why: 'The two walks are at right angles, so the distance is √(' + tr[0] + '² + ' + tr[1] + '²) = √' + (tr[0] * tr[0] + tr[1] * tr[1]) + ' = ' + tr[2] + ' km.', fact: { t: 'direction', a: tr[0], b: tr[1] } };
  };
  GEN.clock = function () {
    var h = ri(1, 11), ans = Math.abs(30 * h);
    if (ans > 180) ans = 360 - ans;
    return { subj: 'reason', topic: 'Clocks', kind: 'num', q: 'What is the smaller angle, in degrees, between the hour hand and the minute hand of a clock at exactly ' + h + ' o\'clock?', ans: ans, why: 'Each hour mark is 30° apart, and at ' + h + ' o\'clock the minute hand is at 12. The angle is ' + 30 * h + '°' + (30 * h > 180 ? ', and the smaller angle is 360° − ' + 30 * h + '° = ' + ans + '°' : '') + '.', fact: { t: 'clock', h: h } };
  };
  GEN.calendar = function () {
    var days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], d0 = ri(0, 6), n = pick([10, 15, 20, 30, 45, 50, 100]), ans = (d0 + n) % 7;
    return { subj: 'reason', topic: 'Calendar', kind: 'day', q: 'Today is ' + days[d0] + '. What day of the week will it be after ' + n + ' days?', ans: days[ans], choices: shuffle(days.filter(function (x) { return x !== days[ans]; })).slice(0, 3).concat([days[ans]]), why: n + ' = ' + Math.floor(n / 7) + ' weeks and ' + (n % 7) + ' days, so the day moves on by ' + (n % 7) + ' from ' + days[d0] + ' to ' + days[ans] + '.', fact: { t: 'calendar', d0: d0, n: n } };
  };
  GEN.age = function () {
    var a = ri(8, 20), diff = ri(3, 12), s = a + (a + diff);
    return { subj: 'reason', topic: 'Ages', kind: 'num', q: 'The sum of the ages of two brothers is ' + s + ' years, and one is ' + diff + ' years older than the other. How old is the elder brother?', ans: a + diff, why: 'Let the younger be x. Then x + (x + ' + diff + ') = ' + s + ', so 2x = ' + (s - diff) + ', x = ' + a + ' and the elder is ' + (a + diff) + '.', fact: { t: 'age', s: s, diff: diff } };
  };
  GEN.multiple = function () {
    var k = pick([3, 4, 6, 7, 8, 9]), good = [], bad, i;
    for (i = 0; i < 3; i++) good.push(k * ri(3, 14));
    bad = ri(20, 100); while (bad % k === 0) bad++;
    var all = shuffle(good.concat([bad]));
    if (new Set(all).size < 4) return GEN.multiple();
    return { subj: 'reason', topic: 'Odd one out', kind: 'mcqnum', q: 'Which of these numbers is NOT a multiple of ' + k + '?', ans: bad, choices: all, why: 'The other three are multiples of ' + k + ', and ' + bad + ' leaves a remainder of ' + (bad % k) + '.', fact: { t: 'multiple', k: k } };
  };

  GEN.di = function () {
    var base = ri(5, 20) * 10, step = ri(1, 6) * 10, vals = [], i, ms = ['January', 'February', 'March', 'April'], s = 0;
    for (i = 0; i < 4; i++) { vals.push(base + i * step); s += base + i * step; }
    var kind = pick(['avg', 'diff']), ans = kind === 'avg' ? s / 4 : vals[3] - vals[0];
    return { subj: 'quant', topic: 'Data reading', kind: 'num', q: 'A table shows the units sold by a shop: ' + ms.map(function (m, j) { return m + ' ' + vals[j]; }).join(', ') + '. ' + (kind === 'avg' ? 'What is the average number of units sold per month?' : 'How many more units were sold in April than in January?'), ans: ans, why: kind === 'avg' ? 'The total is ' + s + ' and ' + s + ' ÷ 4 = ' + ans + '.' : 'April minus January is ' + vals[3] + ' − ' + vals[0] + ' = ' + ans + '.', fact: { t: 'di', vals: vals, kind: kind } };
  };
  var BY_SUBJ = { quant: ['pct', 'ratio', 'avg', 'si', 'speed', 'profit', 'area', 'hcf', 'di'], reason: ['series', 'direction', 'clock', 'calendar', 'age', 'multiple'] };
  G.ids = Object.keys(GEN);
  G.subjects = BY_SUBJ;
  G.make = function (id) {
    var q = GEN[id](); q.id = id;
    if (q.kind === 'num') { var a = +q.ans, spread = Math.max(3, Math.round(Math.abs(a) * 0.3)); q.choices = opts(a, function () { return a + ri(-spread, spread); }); }
    q.kind = 'mcq';
    q.choices = q.choices.map(String); q.ans = String(q.ans);
    return q;
  };
  G.any = function (subj) { var ids = subj === 'all' ? G.ids : BY_SUBJ[subj]; return G.make(pick(ids)); };
  /* marks: in SSC Tier-I a wrong answer loses 0.50 on a 2-mark question, one quarter of its marks, and a blank loses nothing. Here one question = 1 mark. */
  G.score = function (correct, wrong) { return Math.round((correct - wrong / 4) * 100) / 100; };
  /* one test of n questions worth M marks: each question is worth M / n */
  G.testMarks = function (right, wrong, n, M) { return Math.round(M / n * (right - wrong / 4) * 100) / 100; };
  G.needAttempts = function (target, accuracy, n, M) { var per = M / n; for (var a = 0; a <= n; a++) { var c = Math.round(a * accuracy); if (per * (c - (a - c) / 4) >= target - 1e-9) return a; } return null; };
  G.minutesEach = function (total, reserve, questions) { return (total - reserve) / questions; };
  /* SSC Tier-I (CGL and CHSL scheme PDFs): parts of 25 questions, 50 marks each, 60 minutes for all four parts, 0.50 off for a wrong answer (a quarter of the 2 marks) */
  G.TESTS = {
    cgl: [['General Intelligence and Reasoning', 25, 50], ['General Awareness', 25, 50], ['Quantitative Aptitude', 25, 50], ['English Comprehension', 25, 50]],
    chsl: [['English Language', 25, 50], ['General Intelligence', 25, 50], ['Quantitative Aptitude', 25, 50], ['General Awareness', 25, 50]]
  };
  G.TIER1_MINUTES = 60; G.TIER1_SCRIBE_MINUTES = 80;

  if (typeof module !== 'undefined' && module.exports) { module.exports = G; return; }
  window.SSC = G;

  /* ---------------- pages ---------------- */
  var d = document;
  function el(s) { return d.querySelector(s); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function sgn(n) { return String(n).replace('-', '−'); }
  function get(k) { try { return JSON.parse(localStorage.getItem('ssc-' + k)); } catch (e) { return null; } }
  function put(k, v) { try { localStorage.setItem('ssc-' + k, JSON.stringify(v)); } catch (e) {} }

  var box = el('[data-practice]');
  if (box) {
    var subj = box.getAttribute('data-practice'), st, label = { quant: 'Quantitative Aptitude and data', reason: 'Reasoning', all: 'Mixed Tier-I style' };
    var start = function () {
      var best = get('best-' + subj);
      box.innerHTML = '<div class="pq-setup"><p class="pq-lab">' + label[subj] + ': 10 questions, 1 mark each, a quarter off for a wrong answer</p><p>Every question has four options and one best answer. SSC takes 0.50 off a 2-mark question for a wrong answer (a quarter of its marks) and nothing for a blank. In this practice a question is worth 1 mark, so a wrong answer costs 0.25. Skip a question if you have no basis for an answer.</p>' +
        (best !== null ? '<p><b>Your best here: ' + sgn(best.toFixed(2)) + ' / 10</b></p>' : '') + '<button type="button" class="btn pq-go">Start</button></div>';
      box.querySelector('.pq-go').onclick = function () { st = { n: 0, right: 0, wrong: 0, skip: 0, log: [] }; next(); };
    };
    var next = function () {
      if (st.n >= 10) return done();
      var q = G.any(subj); st.n++; st.q = q;
      var body = '<div class="pq-top"><span>Question ' + st.n + ' of 10</span><span>Score: ' + sgn(G.score(st.right, st.wrong).toFixed(2)) + '</span></div><p class="pq-topic">' + esc(q.topic) + ' · Multiple choice</p><p class="pq-q">' + q.q + '</p>';
      body += '<div class="pq-ch">' + q.choices.map(function (c, i) { return '<button type="button" data-v="' + esc(c) + '"><i>' + 'ABCD'[i] + '</i> ' + esc(sgn(c)) + '</button>'; }).join('') + '</div>';
      body += '<div class="pq-btns"><button type="button" class="btn ghost pq-skip">Skip (0 marks)</button></div><div class="pq-fb" aria-live="polite"></div>';
      box.innerHTML = body;
      box.querySelector('.pq-skip').onclick = function () { st.skip++; st.log.push([st.q, 'skipped']); reveal('Skipped. 0 marks.', 'skp'); };
      [].forEach.call(box.querySelectorAll('.pq-ch button'), function (b) { b.onclick = function () { judge(b.getAttribute('data-v'), b); }; });
    };
    var judge = function (v, btn) {
      var ok = v === st.q.ans;
      if (ok) st.right++; else st.wrong++;
      st.log.push([st.q, ok ? 'right' : 'wrong']);
      btn.classList.add(ok ? 'good' : 'bad');
      [].forEach.call(box.querySelectorAll('.pq-ch button'), function (b) { if (b.getAttribute('data-v') === st.q.ans) b.classList.add('good'); });
      reveal(ok ? 'Correct. +1 mark.' : 'Not quite. −0.25 mark. The answer is ' + sgn(st.q.ans) + '.', ok ? 'good' : 'bad');
    };
    var reveal = function (msg, cls) {
      [].forEach.call(box.querySelectorAll('button'), function (b) { b.disabled = true; });
      var fb = box.querySelector('.pq-fb'); fb.className = 'pq-fb ' + cls; fb.innerHTML = '<p><b>' + msg + '</b></p><p class="pq-why">' + st.q.why.replace(/-/g, '−') + '</p><button type="button" class="btn pq-next">' + (st.n >= 10 ? 'See result' : 'Next question') + '</button>';
      fb.querySelector('.pq-next').onclick = next; fb.querySelector('.pq-next').focus();
    };
    var done = function () {
      var sc = G.score(st.right, st.wrong), best = get('best-' + subj); if (best === null || sc > best) put('best-' + subj, sc);
      var topics = {}; st.log.forEach(function (x) { if (x[1] === 'wrong') topics[x[0].topic] = 1; });
      var weak = Object.keys(topics);
      box.innerHTML = '<div class="pq-done"><p class="pq-big">' + sgn(sc.toFixed(2)) + ' / 10</p><p>' + st.right + ' right (+1 each), ' + st.wrong + ' wrong (−0.25 each), ' + st.skip + ' skipped.</p>' +
        (weak.length ? '<p><b>Look again at:</b> ' + weak.map(esc).join(', ') + '.</p>' : '<p>No wrong answers this round.</p>') +
        '<p class="hint">These are our own questions and are easier than real SSC questions. The score is a practice figure, not a prediction.</p><div class="pq-btns"><button type="button" class="btn pq-again">Play again</button></div></div>';
      box.querySelector('.pq-again').onclick = function () { st = { n: 0, right: 0, wrong: 0, skip: 0, log: [] }; next(); };
    };
    start();
  }

  var mc = el('[data-marks-calc]');
  if (mc) {
    mc.innerHTML = '<div class="fields"><label>Examination<select id="ms"><option value="cgl">CGL Tier-I (100 questions, 200 marks)</option><option value="chsl">CHSL Tier-I (100 questions, 200 marks)</option></select></label></div><div data-rows></div><p class="calc-msg" aria-live="polite"></p><p class="calc-tot">Total: <b data-total>0</b> / <span data-max>200</span></p>';
    var draw = function () {
      var T = G.TESTS[el('#ms').value];
      mc.querySelector('[data-rows]').innerHTML = '<div class="tbl"><table class="calc"><thead><tr><th>Part</th><th>Questions</th><th>Right</th><th>Wrong</th><th>Marks (of)</th></tr></thead><tbody>' + T.map(function (t, i) { return '<tr><th scope="row">' + t[0] + '</th><td class="n">' + t[1] + '</td>' + ['r', 'w'].map(function (k) { return '<td><input type="number" min="0" inputmode="numeric" value="0" data-k="' + k + i + '" aria-label="' + t[0] + ' ' + (k === 'r' ? 'right' : 'wrong') + '"></td>'; }).join('') + '<td class="n"><span data-sub="' + i + '">0</span> / ' + t[2] + '</td></tr>'; }).join('') + '</tbody></table></div>';
      calc();
    };
    var calc = function () {
      var T = G.TESTS[el('#ms').value], tot = 0, max = 0, msg = [];
      T.forEach(function (t, i) {
        var v = function (k) { return Math.max(0, parseInt(mc.querySelector('[data-k="' + k + i + '"]').value, 10) || 0); }, r = v('r'), w = v('w');
        if (r + w > t[1]) msg.push(t[0] + ' has only ' + t[1] + ' questions.');
        var x = G.testMarks(r, w, t[1], t[2]); tot += x; max += t[2]; mc.querySelector('[data-sub="' + i + '"]').textContent = sgn(x.toFixed(2));
      });
      mc.querySelector('[data-total]').textContent = sgn((Math.round(tot * 100) / 100).toFixed(2)); mc.querySelector('[data-max]').textContent = max; mc.querySelector('.calc-msg').textContent = msg.join(' ');
    };
    mc.addEventListener('input', function (e) { if (e.target.id === 'ms') draw(); else calc(); }); draw();
  }

  var pl = el('[data-planner]');
  if (pl) {
    pl.innerHTML = '<div class="fields"><label>What to plan<select id="pw"><option value="100">The whole Tier-I (100 questions, 200 marks)</option><option value="25">One part (25 questions, 50 marks)</option></select></label><label>Target marks<input type="number" id="pt" min="0" max="200" value="120" inputmode="numeric"></label><label>Accuracy on the questions you attempt (%)<input type="number" id="pa" min="1" max="100" value="80" inputmode="numeric"></label></div><div class="result" data-out aria-live="polite"></div>';
    var plan = function () {
      var n = +el('#pw').value, M = n * 2, tg = Math.min(M, Math.max(0, +el('#pt').value || 0)), a = Math.min(100, Math.max(1, +el('#pa').value || 1)) / 100, k = G.needAttempts(tg, a, n, M), out = pl.querySelector('[data-out]');
      if (k === null) { out.innerHTML = '<p>At ' + Math.round(a * 100) + '% accuracy, even attempting all ' + n + ' questions does not reach ' + tg + ' marks.</p>'; return; }
      var c = Math.round(k * a);
      out.innerHTML = '<p class="big">' + k + ' questions</p><p>Each question is worth 2 marks and a wrong answer takes off 0.50. You would need to attempt about <b>' + k + '</b> of the ' + n + ' questions (about ' + c + ' right and ' + (k - c) + ' wrong) to reach <b>' + G.testMarks(c, k - c, n, M).toFixed(2) + '</b> marks, which meets your target of ' + tg + '.</p><p>A blind guess among four options is worth only +0.06 on average under this penalty (a quarter chance of +1 against a three-quarter chance of −0.25, in units of a 2-mark question). That is nearly nothing, so guess only when you can rule out an option.</p>';
    };
    pl.addEventListener('input', plan); plan();
  }

  var tp = el('[data-timer-plan]');
  if (tp) {
    tp.innerHTML = '<div class="fields"><label>Who is sitting<select id="tw"><option value="60">Most candidates (60 minutes)</option><option value="80">Candidates eligible for a scribe (80 minutes)</option></select></label><label>Minutes kept for a final check<input type="number" id="tr" min="0" max="30" value="5" inputmode="numeric"></label></div><div class="result" data-out aria-live="polite"></div>';
    var tplan = function () {
      var T = +el('#tw').value, r = Math.min(30, Math.max(0, +el('#tr').value || 0)), out = tp.querySelector('[data-out]'), left = Math.max(0, T - r);
      out.innerHTML = '<p>Tier-I has 100 questions in ' + T + ' minutes for all four parts together. With ' + r + ' minutes kept for checking, ' + left + ' minutes remain: <b>' + (left / 100).toFixed(2) + ' minutes</b> (about ' + Math.round(left * 60 / 100) + ' seconds) a question.</p>';
    };
    tp.addEventListener('input', tplan); tplan();
  }
})();
