/* learn.shareyourgroup.com/boards: practice questions of our own for CBSE Class X Mathematics (units of the 2026-27 course structure), all multiple choice, one mark each, no negative marking, plus marks and study-time tools.
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
  function opts(ans, make) { var out = [ans], g = 0; while (out.length < 4 && g++ < 500) { var w = make(); if (w !== ans && w > -1e9 && out.indexOf(w) < 0 && isFinite(w) && Math.abs(w * 100 - Math.round(w * 100)) < 1e-9) out.push(w); } var i = 1; while (out.length < 4) { if (out.indexOf(ans + i) < 0) out.push(ans + i); i++; } return shuffle(out); }
  function sg(n) { return n < 0 ? '(−' + (-n) + ')' : String(n); }

  var GEN = {};
  /* Unit II: Algebra */
  GEN.hcf = function () {
    var g = pick([2, 3, 4, 5, 6, 7, 8, 9]), x = pick([2, 3, 4, 5, 7, 9]), y = pick([2, 3, 4, 5, 7, 9, 11]);
    if (x === y || gcd(x, y) !== 1) return GEN.hcf();
    var kind = pick(['HCF', 'LCM']);
    return { subj: 'alg', topic: 'Real numbers: HCF and LCM', kind: 'num', q: 'Find the ' + kind + ' of ' + g * x + ' and ' + g * y + '.', ans: kind === 'HCF' ? g : g * x * y, why: g * x + ' = ' + g + ' × ' + x + ' and ' + g * y + ' = ' + g + ' × ' + y + ', and ' + x + ' and ' + y + ' have no common factor. So HCF = ' + g + ' and LCM = ' + g + ' × ' + x + ' × ' + y + ' = ' + g * x * y + '.', fact: { t: 'hcf', a: g * x, b: g * y, kind: kind } };
  };
  GEN.qroot = function () {
    var p = ri(-9, 9), q = ri(-9, 9), who = pick(['larger', 'smaller']);
    if (p === q) return GEN.qroot();
    var b = -(p + q), c = p * q;
    function term(v, s) { return (v < 0 ? ' − ' : ' + ') + (Math.abs(v) === 1 && s === 'x' ? '' : Math.abs(v)) + s; }
    return { subj: 'alg', topic: 'Quadratic equations', kind: 'num', q: 'Find the ' + who + ' root of x²' + (b === 0 ? '' : term(b, 'x')) + (c === 0 ? '' : term(c, '')) + ' = 0.', ans: who === 'larger' ? Math.max(p, q) : Math.min(p, q), why: 'The equation factorises as (x − ' + sg(p) + ')(x − ' + sg(q) + ') = 0, so the roots are ' + p + ' and ' + q + '. The ' + who + ' root is ' + (who === 'larger' ? Math.max(p, q) : Math.min(p, q)) + '.', fact: { t: 'qroot', b: b, c: c, who: who } };
  };
  GEN.disc = function () {
    var a = ri(2, 6), b = ri(-9, 9), c = ri(-6, 6);
    if (b === 0 || c === 0) return GEN.disc();
    function term(v, s) { return (v < 0 ? ' − ' : ' + ') + (Math.abs(v) === 1 && s === 'x' ? '' : Math.abs(v)) + s; }
    return { subj: 'alg', topic: 'Quadratic equations: discriminant', kind: 'num', q: 'Find the discriminant of ' + a + 'x²' + term(b, 'x') + term(c, '') + ' = 0.', ans: b * b - 4 * a * c, why: 'With a = ' + a + ', b = ' + b + ', c = ' + c + ' the discriminant is b² − 4ac = ' + b * b + ' − ' + 4 * a * c + ' = ' + (b * b - 4 * a * c) + '.', fact: { t: 'disc', a: a, b: b, c: c } };
  };
  GEN.apn = function () {
    var a = ri(-5, 20), d = ri(2, 9), n = ri(8, 25), s = [], i;
    for (i = 0; i < 3; i++) s.push(a + i * d);
    return { subj: 'alg', topic: 'Arithmetic progressions', kind: 'num', q: 'Find the ' + n + 'th term of the AP ' + s.join(', ') + ', …', ans: a + (n - 1) * d, why: 'The first term is ' + a + ' and the common difference is ' + d + '. The nth term is a + (n − 1)d = ' + a + ' + ' + (n - 1) + ' × ' + d + ' = ' + (a + (n - 1) * d) + '.', fact: { t: 'apn', s: s, n: n } };
  };
  GEN.aps = function () {
    var a = ri(1, 15), d = ri(1, 7), n = pick([10, 12, 15, 20]), s = [], i;
    for (i = 0; i < 3; i++) s.push(a + i * d);
    return { subj: 'alg', topic: 'Arithmetic progressions: sum', kind: 'num', q: 'Find the sum of the first ' + n + ' terms of the AP ' + s.join(', ') + ', …', ans: n * (2 * a + (n - 1) * d) / 2, why: 'With a = ' + a + ' and d = ' + d + ', S = n/2 × [2a + (n − 1)d] = ' + n / 2 + ' × (' + 2 * a + ' + ' + (n - 1) * d + ') = ' + n * (2 * a + (n - 1) * d) / 2 + '.', fact: { t: 'aps', s: s, n: n } };
  };
  GEN.pair = function () {
    var x = ri(1, 15), y = ri(1, 15), ask = pick(['x', 'y']);
    if (x === y) return GEN.pair();
    return { subj: 'alg', topic: 'Pair of linear equations', kind: 'num', q: 'If x + y = ' + (x + y) + ' and x − y = ' + (x - y) + ', find the value of ' + ask + '.', ans: ask === 'x' ? x : y, why: 'Adding the equations gives 2x = ' + 2 * x + ', so x = ' + x + '. Then y = ' + (x + y) + ' − ' + x + ' = ' + y + '.', fact: { t: 'pair', s: x + y, d: x - y, ask: ask } };
  };
  /* Units III, IV, VI: coordinate geometry, geometry, mensuration */
  GEN.cdist = function () {
    var tr = pick([[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [9, 12, 15]]), x1 = ri(-6, 6), y1 = ri(-6, 6), sx = pick([1, -1]), sy = pick([1, -1]);
    return { subj: 'geo', topic: 'Coordinate geometry: distance', kind: 'num', q: 'Find the distance between the points A(' + x1 + ', ' + y1 + ') and B(' + (x1 + sx * tr[0]) + ', ' + (y1 + sy * tr[1]) + ').', ans: tr[2], why: 'Distance = √[(x₂ − x₁)² + (y₂ − y₁)²] = √(' + tr[0] * tr[0] + ' + ' + tr[1] * tr[1] + ') = √' + tr[2] * tr[2] + ' = ' + tr[2] + '.', fact: { t: 'cdist', x1: x1, y1: y1, x2: x1 + sx * tr[0], y2: y1 + sy * tr[1] } };
  };
  GEN.mid = function () {
    var x1 = ri(-9, 9), y1 = ri(-9, 9), x2 = x1 + 2 * ri(1, 6) * pick([1, -1]), y2 = y1 + 2 * ri(1, 6) * pick([1, -1]), ask = pick(['x', 'y']);
    return { subj: 'geo', topic: 'Coordinate geometry: midpoint', kind: 'num', q: 'Find the ' + ask + '-coordinate of the midpoint of the line segment joining A(' + x1 + ', ' + y1 + ') and B(' + x2 + ', ' + y2 + ').', ans: ask === 'x' ? (x1 + x2) / 2 : (y1 + y2) / 2, why: 'The midpoint is ((x₁ + x₂)/2, (y₁ + y₂)/2). The ' + ask + '-coordinate is (' + (ask === 'x' ? x1 + ' + ' + sg(x2) : y1 + ' + ' + sg(y2)) + ')/2 = ' + (ask === 'x' ? (x1 + x2) / 2 : (y1 + y2) / 2) + '.', fact: { t: 'mid', x1: x1, y1: y1, x2: x2, y2: y2, ask: ask } };
  };
  GEN.simil = function () {
    var a = ri(2, 6), b = a + ri(1, 4), area = ri(2, 12) * a * a / gcd(a * a, a * a);
    area = ri(2, 9);
    var big = area * b * b / (a * a);
    if (big !== Math.floor(big)) return GEN.simil();
    return { subj: 'geo', topic: 'Triangles: similarity', kind: 'num', q: 'Two triangles are similar. Corresponding sides are ' + a + ' cm and ' + b + ' cm, and the smaller triangle has an area of ' + area + ' cm². What is the area of the larger triangle in cm²?', ans: big, why: 'The ratio of the areas of similar triangles is the square of the ratio of the sides: (' + b + '/' + a + ')² = ' + b * b + '/' + a * a + '. So the larger area is ' + area + ' × ' + b * b + '/' + a * a + ' = ' + big + ' cm².', fact: { t: 'simil', a: a, b: b, area: area } };
  };
  GEN.tang = function () {
    var tr = pick([[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [9, 12, 15], [7, 24, 25]]), k = ri(1, 3);
    return { subj: 'geo', topic: 'Circles: tangent', kind: 'num', q: 'A point P is ' + tr[2] * k + ' cm from the centre of a circle of radius ' + tr[0] * k + ' cm. What is the length of the tangent from P to the circle in cm?', ans: tr[1] * k, why: 'A tangent is perpendicular to the radius at the point of contact, so tangent² = ' + tr[2] * k + '² − ' + tr[0] * k + '² = ' + (tr[2] * tr[2] - tr[0] * tr[0]) * k * k + ', and the tangent is ' + tr[1] * k + ' cm.', fact: { t: 'tang', d: tr[2] * k, r: tr[0] * k } };
  };
  GEN.cyl = function () {
    var r = 7 * ri(1, 4), h = ri(2, 15);
    return { subj: 'geo', topic: 'Mensuration: cylinder', kind: 'num', q: 'Find the curved surface area in cm² of a cylinder of radius ' + r + ' cm and height ' + h + ' cm. (Use π = 22/7.)', ans: 2 * 22 * r * h / 7, why: 'Curved surface area = 2πrh = 2 × 22/7 × ' + r + ' × ' + h + ' = ' + 2 * 22 * r * h / 7 + ' cm².', fact: { t: 'cyl', r: r, h: h } };
  };
  GEN.cone = function () {
    var r = 7 * ri(1, 3), h = 3 * ri(1, 6);
    return { subj: 'geo', topic: 'Mensuration: cone', kind: 'num', q: 'Find the volume in cm³ of a cone of base radius ' + r + ' cm and height ' + h + ' cm. (Use π = 22/7.)', ans: 22 * r * r * h / 21, why: 'Volume = (1/3)πr²h = (1/3) × 22/7 × ' + r + ' × ' + r + ' × ' + h + ' = ' + 22 * r * r * h / 21 + ' cm³.', fact: { t: 'cone', r: r, h: h } };
  };
  /* Unit VII: statistics and probability */
  GEN.mean = function () {
    var m = ri(10, 60), d = [ri(1, 9), ri(1, 9)], arr = shuffle([m + d[0], m - d[0], m + d[1], m - d[1], m]);
    return { subj: 'data', topic: 'Statistics: mean', kind: 'num', q: 'Find the mean of ' + arr.join(', ') + '.', ans: m, why: 'The sum is ' + 5 * m + ' and ' + 5 * m + ' ÷ 5 = ' + m + '.', fact: { t: 'mean', arr: arr } };
  };
  GEN.median = function () {
    var vals = [], arr;
    while (vals.length < 7) { var v = ri(5, 60); if (vals.indexOf(v) < 0) vals.push(v); }
    arr = shuffle(vals);
    var sorted = vals.slice().sort(function (x, y) { return x - y; });
    return { subj: 'data', topic: 'Statistics: median', kind: 'num', q: 'Find the median of ' + arr.join(', ') + '.', ans: sorted[3], why: 'In order the numbers are ' + sorted.join(', ') + '. The middle (4th) one is ' + sorted[3] + '.', fact: { t: 'median', arr: arr } };
  };
  GEN.mode = function () {
    var m = ri(5, 40), others = [], arr, v;
    while (others.length < 5) { v = ri(5, 40); if (v !== m && others.indexOf(v) < 0) others.push(v); }
    arr = shuffle(others.concat([m, m, m]));
    return { subj: 'data', topic: 'Statistics: mode', kind: 'num', q: 'Find the mode of ' + arr.join(', ') + '.', ans: m, why: 'The number ' + m + ' appears three times and every other number appears once, so the mode is ' + m + '.', fact: { t: 'mode', arr: arr } };
  };
  GEN.prob = function () {
    var tot = pick([10, 20, 25, 40, 50]), red = ri(1, tot - 1), blue = tot - red;
    return { subj: 'data', topic: 'Probability', kind: 'num', q: 'A bag has ' + red + ' red balls and ' + blue + ' blue balls. A ball is drawn at random. What is the probability of getting a red ball, as a per cent?', ans: red * 100 / tot, why: 'There are ' + tot + ' balls and ' + red + ' are red, so the probability is ' + red + '/' + tot + ' = ' + red * 100 / tot + '%.', fact: { t: 'prob', red: red, blue: blue } };
  };
  var BY_SUBJ = { alg: ['hcf', 'qroot', 'disc', 'apn', 'aps', 'pair'], geo: ['cdist', 'mid', 'simil', 'tang', 'cyl', 'cone'], data: ['mean', 'median', 'mode', 'prob'] };
  G.ids = [].concat(BY_SUBJ.alg, BY_SUBJ.geo, BY_SUBJ.data);
  G.subjects = BY_SUBJ;
  G.make = function (id) {
    var q = GEN[id](); q.id = id;
    var a = +q.ans, spread = Math.max(3, Math.round(Math.abs(a) * 0.3));
    q.choices = opts(a, function () { return a + ri(-spread, spread); });
    q.kind = 'mcq';
    q.choices = q.choices.map(String); q.ans = String(q.ans);
    return q;
  };
  G.any = function (subj) { var ids = subj === 'all' ? G.ids : BY_SUBJ[subj]; return G.make(pick(ids)); };
  /* marks: Class X board papers are 80 marks plus 20 of internal assessment; a subject needs at least 33% in each part (read the page for the exact wording) */
  G.score = function (correct) { return correct; };
  G.pass = function (marks, max) { return marks * 100 >= 33 * max; };
  G.passMark = function (max) { return Math.ceil(33 * max / 100 - 1e-9); };
  G.hoursSplit = function (hours, marks) { var tot = marks.reduce(function (a, b) { return a + b; }, 0); return marks.map(function (m) { return Math.round(hours * m / tot * 10) / 10; }); };
  /* course structures (CBSE curriculum 2026-27): [unit name, marks] */
  G.COURSES = {
    x_maths: { name: 'Class X Mathematics (80 marks, 3 hours)', units: [['Number Systems', 6], ['Algebra', 20], ['Coordinate Geometry', 6], ['Geometry', 15], ['Trigonometry', 12], ['Mensuration', 10], ['Statistics and Probability', 11]] },
    x_science: { name: 'Class X Science (80 marks, 3 hours)', units: [['Chemical Substances: Nature and Behaviour', 25], ['World of Living', 25], ['Natural Phenomena', 12], ['Effects of Current', 13], ['Natural Resources', 5]] },
    x_ss: { name: 'Class X Social Science (80 marks)', units: [['History', 20], ['Geography', 20], ['Political Science', 20], ['Economics', 20]] },
    x_eng: { name: 'Class X English Language and Literature (80 marks)', units: [['Reading', 20], ['Writing Skills and Grammar', 20], ['Language through Literature', 40]] },
    xii_physics: { name: 'Class XII Physics (70 marks, 3 hours)', units: [['Electrostatics and Current Electricity (Units I-II)', 16], ['Magnetism, Induction and AC (Units III-IV)', 17], ['Electromagnetic Waves and Optics (Units V-VI)', 18], ['Dual Nature, Atoms and Nuclei (Units VII-VIII)', 12], ['Electronic Devices (Unit IX)', 7]] },
    xii_chem: { name: 'Class XII Chemistry (70 marks, 3 hours)', units: [['Solutions', 7], ['Electrochemistry', 9], ['Chemical Kinetics', 7], ['d- and f-Block Elements', 7], ['Coordination Compounds', 7], ['Haloalkanes and Haloarenes', 6], ['Alcohols, Phenols and Ethers', 6], ['Aldehydes, Ketones and Carboxylic Acids', 8], ['Amines', 6], ['Biomolecules', 7]] },
    xii_maths: { name: 'Class XII Mathematics (80 marks, 3 hours)', units: [['Relations and Functions', 8], ['Algebra', 10], ['Calculus', 35], ['Vectors and Three-Dimensional Geometry', 14], ['Linear Programming', 5], ['Probability', 8]] },
    xii_bio: { name: 'Class XII Biology (70 marks, 3 hours)', units: [['Reproduction', 16], ['Genetics and Evolution', 20], ['Biology and Human Welfare', 12], ['Biotechnology and its Applications', 12], ['Ecology and Environment', 10]] }
  };

  if (typeof module !== 'undefined' && module.exports) { module.exports = G; return; }
  window.BOARDS = G;

  /* ---------------- pages ---------------- */
  var d = document;
  function el(s) { return d.querySelector(s); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function sgn(n) { return String(n).replace('-', '−'); }
  function get(k) { try { return JSON.parse(localStorage.getItem('boards-' + k)); } catch (e) { return null; } }
  function put(k, v) { try { localStorage.setItem('boards-' + k, JSON.stringify(v)); } catch (e) {} }

  var box = el('[data-practice]');
  if (box) {
    var subj = box.getAttribute('data-practice'), st, label = { alg: 'Number systems and algebra', geo: 'Geometry and mensuration', data: 'Statistics and probability', all: 'Mixed Class X maths' };
    var start = function () {
      var best = get('best-' + subj);
      box.innerHTML = '<div class="pq-setup"><p class="pq-lab">' + label[subj] + ': 10 questions, 1 mark each</p><p>Every question has four options and one best answer, as in board papers. CBSE board papers have no negative marking, so a wrong answer costs nothing. Answer every question.</p>' +
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
        '<p class="hint">These are our own questions and are easier than a real board paper, which also has longer answers and case studies. The score is a practice figure, not a prediction.</p><div class="pq-btns"><button type="button" class="btn pq-again">Play again</button></div></div>';
      box.querySelector('.pq-again').onclick = function () { st = { n: 0, score: 0, wrong: 0, log: [] }; next(); };
    };
    start();
  }

  var mc = el('[data-marks-calc]');
  if (mc) {
    mc.innerHTML = '<div class="fields"><label data-l="a">Board paper marks<input type="number" id="ma" min="0" value="0" inputmode="decimal"></label><label data-l="b">Internal assessment marks<input type="number" id="mb" min="0" value="0" inputmode="decimal"></label></div><div class="result" data-out aria-live="polite"></div>';
    var cal = function () {
      var th = 80, inn = 100 - th, a = Math.max(0, +el('#ma').value || 0), b = Math.max(0, +el('#mb').value || 0), msg = [];
      mc.querySelector('[data-l="a"]').firstChild.nodeValue = th === 80 ? 'Board paper marks (of 80)' : 'Theory marks (of 70)';
      mc.querySelector('[data-l="b"]').firstChild.nodeValue = th === 80 ? 'Internal assessment marks (of 20)' : 'Practical marks (of 30)';
      if (a > th) msg.push('The paper is out of ' + th + '.'); if (b > inn) msg.push('The other part is out of ' + inn + '.');
      a = Math.min(a, th); b = Math.min(b, inn);
      var tot = a + b;
      mc.querySelector('[data-out]').innerHTML = '<p class="big">' + tot + ' / 100</p><p>' + (msg.join(' ') || '') + '</p><ul><li>First part: ' + a + ' of ' + th + (G.pass(a, th) ? ' (reaches 33%: at least ' + G.passMark(th) + ' marks)' : ' (below 33%: you need at least ' + G.passMark(th) + ' marks)') + '.</li><li>Second part: ' + b + ' of ' + inn + (G.pass(b, inn) ? ' (reaches 33%: at least ' + G.passMark(inn) + ' marks)' : ' (below 33%: you need at least ' + G.passMark(inn) + ' marks)') + '.</li><li>Combined: ' + tot + ' of 100 (' + (G.pass(tot, 100) ? 'reaches' : 'below') + ' 33).</li></ul>';
    };
    mc.addEventListener('input', cal); cal();
  }

  var pl = el('[data-study-plan]');
  if (pl) {
    var opts2 = Object.keys(G.COURSES).map(function (k) { return '<option value="' + k + '">' + G.COURSES[k].name + '</option>'; }).join('');
    pl.innerHTML = '<div class="fields"><label>Subject<select id="sc">' + opts2 + '</select></label><label>Hours you can give this subject<input type="number" id="sh" min="1" max="1000" value="60" inputmode="numeric"></label></div><div class="result" data-out aria-live="polite"></div>';
    var sp = function () {
      var c = G.COURSES[el('#sc').value], h = Math.min(1000, Math.max(1, +el('#sh').value || 1)), parts = G.hoursSplit(h, c.units.map(function (u) { return u[1]; }));
      pl.querySelector('[data-out]').innerHTML = '<div class="tbl"><table><thead><tr><th>Unit</th><th>Marks</th><th>Hours</th></tr></thead><tbody>' + c.units.map(function (u, i) { return '<tr><td>' + esc(u[0]) + '</td><td class="n">' + u[1] + '</td><td class="n">' + parts[i] + '</td></tr>'; }).join('') + '</tbody></table></div><p>Hours are shared in proportion to the marks of each unit. A unit with weaker marks for you can take more; the split is a starting point.</p>';
    };
    pl.addEventListener('input', sp); sp();
  }
})();
