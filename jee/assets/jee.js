/* learn.shareyourgroup.com/jee: practice questions of our own for JEE Main style preparation, plus marks tools. Question makers first (pure, seedable;
   the build asks Node for thousands of questions and re-works every answer in Python from the facts stored with each question), then the pages' tools.
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

  var ATOM = { H: 1, C: 12, N: 14, O: 16, Na: 23, Mg: 24, S: 32, K: 39, Ca: 40, Fe: 56 };
  var COMPOUNDS = [['H2O', { H: 2, O: 1 }], ['CO2', { C: 1, O: 2 }], ['NaOH', { Na: 1, O: 1, H: 1 }], ['CaCO3', { Ca: 1, C: 1, O: 3 }], ['H2SO4', { H: 2, S: 1, O: 4 }], ['NH3', { N: 1, H: 3 }], ['CH4', { C: 1, H: 4 }], ['MgO', { Mg: 1, O: 1 }], ['Na2CO3', { Na: 2, C: 1, O: 3 }], ['KOH', { K: 1, O: 1, H: 1 }]];
  function molar(f) { var m = 0; for (var k in f) m += ATOM[k] * f[k]; return m; }
  var OXI = [['KMnO4', 'Mn', { K: 1, Mn: 1, O: 4 }], ['K2Cr2O7', 'Cr', { K: 2, Cr: 2, O: 7 }], ['H2SO4', 'S', { H: 2, S: 1, O: 4 }], ['Fe2O3', 'Fe', { Fe: 2, O: 3 }], ['HNO3', 'N', { H: 1, N: 1, O: 3 }], ['NaNO2', 'N', { Na: 1, N: 1, O: 2 }], ['H3PO4', 'P', { H: 3, P: 1, O: 4 }], ['K2SO3', 'S', { K: 2, S: 1, O: 3 }], ['Mn2O7', 'Mn', { Mn: 2, O: 7 }], ['HClO4', 'Cl', { H: 1, Cl: 1, O: 4 }]];

  var GEN = {};
  /* ---------------- mathematics ---------------- */
  GEN.ap = function () {
    var a = ri(1, 9), d = ri(2, 6), n = ri(5, 12), S = n * (2 * a + (n - 1) * d) / 2;
    return { subj: 'maths', topic: 'Sequence and series', kind: 'num', q: 'The first term of an arithmetic progression is ' + a + ' and its common difference is ' + d + '. Find the sum of its first ' + n + ' terms.', ans: S,
      why: 'S = n/2 [2a + (n − 1)d] = ' + n + '/jee/2 [' + 2 * a + ' + ' + (n - 1) * d + '] = ' + S + '.', fact: { t: 'ap', a: a, d: d, n: n } };
  };
  GEN.quad = function () {
    var S = ri(3, 10), P = ri(2, S * S / 4 | 0), ans = S * S - 2 * P;
    return { subj: 'maths', topic: 'Quadratic equations', kind: 'mcq', q: 'If α and β are the roots of x² − ' + S + 'x + ' + P + ' = 0, then α² + β² equals', ans: ans, choices: opts(ans, function () { return pick([S * S, S * S + 2 * P, S * S - P, 2 * P, S + P]) + ri(-1, 1); }),
      why: 'α² + β² = (α + β)² − 2αβ = ' + S + '² − 2(' + P + ') = ' + ans + '.', fact: { t: 'quad', S: S, P: P } };
  };
  GEN.comb = function () {
    var n = ri(6, 10), r = ri(2, 4), ans = C(n, r);
    return { subj: 'maths', topic: 'Permutations and combinations', kind: 'num', q: 'In how many ways can a committee of ' + r + ' members be chosen from ' + n + ' people?', ans: ans, why: 'C(' + n + ', ' + r + ') = ' + ans + '.', fact: { t: 'comb', n: n, r: r } };
  };
  GEN.det = function () {
    var m = [], i, j; for (i = 0; i < 9; i++) m.push(ri(-3, 4));
    var d = m[0] * (m[4] * m[8] - m[5] * m[7]) - m[1] * (m[3] * m[8] - m[5] * m[6]) + m[2] * (m[3] * m[7] - m[4] * m[6]);
    var rows = [0, 1, 2].map(function (r) { return '[ ' + [m[3 * r], m[3 * r + 1], m[3 * r + 2]].join('  ') + ' ]'; }).join('<br>');
    return { subj: 'maths', topic: 'Matrices and determinants', kind: 'mcq', q: 'The value of the determinant<br>' + rows.replace(/-/g, '−') + '<br>is', ans: d, choices: opts(d, near(d, 6)), why: 'Expand along the first row: ' + m[0] + '(' + (m[4] * m[8] - m[5] * m[7]) + ') − (' + m[1] + ')(' + (m[3] * m[8] - m[5] * m[6]) + ') + (' + m[2] + ')(' + (m[3] * m[7] - m[4] * m[6]) + ') = ' + d + '.', fact: { t: 'det', m: m } };
  };
  GEN.binom = function () {
    var n = ri(5, 9), r = ri(2, n - 2), a = ri(2, 3), ans = C(n, r) * Math.pow(a, n - r);
    return { subj: 'maths', topic: 'Binomial theorem', kind: 'num', q: 'Find the coefficient of x^' + r + ' in the expansion of (' + a + ' + x)^' + n + '.', ans: ans, why: 'The term in x^' + r + ' is C(' + n + ', ' + r + ') · ' + a + '^' + (n - r) + ' · x^' + r + ', so the coefficient is ' + C(n, r) + ' × ' + Math.pow(a, n - r) + ' = ' + ans + '.', fact: { t: 'binom', n: n, r: r, a: a } };
  };
  GEN.dice = function () {
    var s = ri(3, 11), cnt = 0, x, y; for (x = 1; x <= 6; x++) for (y = 1; y <= 6; y++) if (x + y === s) cnt++;
    return { subj: 'maths', topic: 'Probability', kind: 'num', q: 'Two fair dice are thrown. In how many of the 36 equally likely outcomes is the sum ' + s + '?', ans: cnt, why: 'List the pairs (x, y) with x + y = ' + s + ' and both from 1 to 6. There are ' + cnt + ' of them.', fact: { t: 'dice', s: s } };
  };
  GEN.deriv = function () {
    var a = ri(2, 6), n = ri(2, 4), b = ri(1, 9), c = ri(1, 4), ans = a * n * Math.pow(c, n - 1) + b;
    return { subj: 'maths', topic: 'Differentiation', kind: 'mcq', q: 'If f(x) = ' + a + 'x^' + n + ' + ' + b + 'x, then f′(' + c + ') equals', ans: ans, choices: opts(ans, near(ans, 9)), why: "f′(x) = " + a * n + 'x^' + (n - 1) + ' + ' + b + ', so f′(' + c + ') = ' + ans + '.', fact: { t: 'deriv', a: a, n: n, b: b, c: c } };
  };
  GEN.integ = function () {
    var k = pick([2, 4, 6]), a = 3 * ri(1, 4), b = ri(1, 6), ans = a * k * k * k / 3 + b * k * k / 2;
    return { subj: 'maths', topic: 'Integral calculus', kind: 'num', q: 'Evaluate the definite integral of (' + a + 'x² + ' + b + 'x) dx from x = 0 to x = ' + k + '.', ans: ans, why: 'The antiderivative is ' + a / 3 + 'x³ + ' + b + 'x²/2. At x = ' + k + ' it gives ' + ans + ', and at 0 it gives 0.', fact: { t: 'integ', a: a, b: b, k: k } };
  };
  GEN.dist = function () {
    var tr = pick([[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [9, 12, 15]]), x1 = ri(-4, 4), y1 = ri(-4, 4), sx = pick([-1, 1]), sy = pick([-1, 1]), x2 = x1 + sx * tr[0], y2 = y1 + sy * tr[1];
    return { subj: 'maths', topic: 'Co-ordinate geometry', kind: 'mcq', q: 'The distance between the points (' + x1 + ', ' + y1 + ') and (' + x2 + ', ' + y2 + ') is', ans: tr[2], choices: opts(tr[2], near(tr[2], 4)), why: 'd = √[(' + (x2 - x1) + ')² + (' + (y2 - y1) + ')²] = √' + (tr[0] * tr[0] + tr[1] * tr[1]) + ' = ' + tr[2] + '.', fact: { t: 'dist', p: [x1, y1, x2, y2] } };
  };
  GEN.dot = function () {
    var a = [ri(-4, 5), ri(-4, 5), ri(-4, 5)], b = [ri(-4, 5), ri(-4, 5), ri(-4, 5)], ans = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    function v(x) { return (x[0] + 'i + ' + x[1] + 'j + ' + x[2] + 'k').replace(/\+ -/g, '− ').replace(/^-/, '−').replace(/-/g, '−'); }
    return { subj: 'maths', topic: 'Vector algebra', kind: 'mcq', q: 'If a = ' + v(a) + ' and b = ' + v(b) + ', then a · b equals', ans: ans, choices: opts(ans, near(ans, 8)), why: 'a · b = (' + a[0] + ')(' + b[0] + ') + (' + a[1] + ')(' + b[1] + ') + (' + a[2] + ')(' + b[2] + ') = ' + ans + '.', fact: { t: 'dot', a: a, b: b } };
  };
  /* ---------------- physics ---------------- */
  GEN.kin = function () {
    var u = ri(2, 10), a = ri(1, 4), t = ri(2, 6), s = u * t + a * t * t / 2, v = u + a * t;
    if (s !== Math.floor(s)) return GEN.kin();
    return { subj: 'physics', topic: 'Kinematics', kind: 'mcq', q: 'A body starts with a speed of ' + u + ' m/s and moves along a straight line with a uniform acceleration of ' + a + ' m/s². Its distance covered in ' + t + ' s, in metres, is', ans: s, choices: opts(s, near(s, 12)),
      why: 's = ut + ½at² = ' + u + '(' + t + ') + ½(' + a + ')(' + t + ')² = ' + s + ' m.', fact: { t: 'kin', u: u, a: a, tm: t } };
  };
  var RP = [[3, 6, 2], [4, 12, 3], [6, 12, 4], [10, 40, 8], [20, 30, 12], [12, 24, 8], [15, 60, 12], [30, 60, 20], [6, 3, 2], [8, 8, 4], [10, 15, 6], [20, 5, 4]];
  GEN.par = function () {
    var p = pick(RP);
    return { subj: 'physics', topic: 'Current electricity', kind: 'num', q: 'Two resistors of ' + p[0] + ' Ω and ' + p[1] + ' Ω are connected in parallel. The equivalent resistance, in ohms, is', ans: p[2], why: '1/R = 1/' + p[0] + ' + 1/' + p[1] + ', so R = (' + p[0] + ' × ' + p[1] + ') / (' + p[0] + ' + ' + p[1] + ') = ' + p[2] + ' Ω.', fact: { t: 'par', r1: p[0], r2: p[1] } };
  };
  GEN.ke = function () {
    var m = ri(1, 8) * 2, v = ri(2, 12), ans = m * v * v / 2;
    return { subj: 'physics', topic: 'Work, energy and power', kind: 'mcq', q: 'The kinetic energy, in joules, of a ' + m + ' kg body moving at ' + v + ' m/s is', ans: ans, choices: opts(ans, function () { return pick([m * v, m * v * v, ans + m, ans - m, 2 * ans]); }), why: 'KE = ½mv² = ½ × ' + m + ' × ' + v + '² = ' + ans + ' J.', fact: { t: 'ke', m: m, v: v } };
  };
  GEN.lens = function () {
    var cases = [], f, u; for (f = 5; f <= 30; f += 5) for (u = -60; u <= -10; u += 5) { var den = u + f; if (den !== 0 && (u * f) % den === 0) { var v = (u * f) / den; if (v !== 0 && Math.abs(v) <= 80) cases.push([f, u, v]); } }
    var c = pick(cases);
    return { subj: 'physics', topic: 'Optics', kind: 'mcq', q: 'An object is placed ' + (-c[1]) + ' cm in front of a convex lens of focal length ' + c[0] + ' cm. Using 1/v − 1/u = 1/f with the usual sign convention, the image distance v (in cm, positive on the far side of the lens) is', ans: c[2], choices: opts(c[2], near(c[2], 15)),
      why: '1/v = 1/f + 1/u = 1/' + c[0] + ' − 1/' + (-c[1]) + ', so v = uf/(u + f) = ' + c[2] + ' cm.', fact: { t: 'lens', f: c[0], u: c[1] } };
  };
  GEN.boyle = function () {
    var cases = [], p1, v1, v2; for (p1 = 1; p1 <= 8; p1++) for (v1 = 2; v1 <= 12; v1 += 2) for (v2 = 1; v2 <= 12; v2++) if ((p1 * v1) % v2 === 0 && v2 !== v1) cases.push([p1, v1, v2, p1 * v1 / v2]);
    var c = pick(cases);
    return { subj: 'physics', topic: 'Kinetic theory of gases', kind: 'num', q: 'A gas at ' + c[0] + ' atm occupies ' + c[1] + ' litres. Its temperature is kept constant while its volume is changed to ' + c[2] + ' litres. The new pressure, in atm, is', ans: c[3], why: 'At constant temperature P₁V₁ = P₂V₂, so P₂ = ' + c[0] + ' × ' + c[1] + ' / ' + c[2] + ' = ' + c[3] + ' atm.', fact: { t: 'boyle', p1: c[0], v1: c[1], v2: c[2] } };
  };
  GEN.wave = function () {
    var f = ri(2, 20) * 10, l = ri(1, 8), ans = f * l;
    return { subj: 'physics', topic: 'Oscillations and waves', kind: 'mcq', q: 'A wave has a frequency of ' + f + ' Hz and a wavelength of ' + l + ' m. Its speed, in m/s, is', ans: ans, choices: opts(ans, function () { return pick([f + l, f / l * 1, ans + f, ans - l * 10, ans * 2]); }), why: 'v = fλ = ' + f + ' × ' + l + ' = ' + ans + ' m/s.', fact: { t: 'wave', f: f, l: l } };
  };
  GEN.collide = function () {
    var cases = [], m1, m2, u1, u2; for (m1 = 1; m1 <= 6; m1++) for (m2 = 1; m2 <= 6; m2++) for (u1 = 2; u1 <= 12; u1 += 2) for (u2 = -4; u2 <= 4; u2 += 2) if ((m1 * u1 + m2 * u2) % (m1 + m2) === 0) cases.push([m1, m2, u1, u2, (m1 * u1 + m2 * u2) / (m1 + m2)]);
    var c = pick(cases);
    return { subj: 'physics', topic: 'Laws of motion', kind: 'num', q: 'A ' + c[0] + ' kg body moving at ' + c[2] + ' m/s collides head-on with a ' + c[1] + ' kg body moving at ' + String(c[3]).replace('-', '−') + ' m/s (same line; the first body\'s direction is positive). They stick together. The velocity of the combined body, in m/s (positive in the direction of the first body), is', ans: c[4],
      why: 'Momentum is conserved: (' + c[0] + ' × ' + c[2] + ' + ' + c[1] + ' × ' + c[3] + ') / (' + c[0] + ' + ' + c[1] + ') = ' + c[4] + ' m/s.', fact: { t: 'collide', m1: c[0], m2: c[1], u1: c[2], u2: c[3] } };
  };
  /* ---------------- chemistry ---------------- */
  GEN.mole = function () {
    var c = pick(COMPOUNDS), M = molar(c[1]), n = ri(1, 5), mass = M * n;
    return { subj: 'chemistry', topic: 'Some basic concepts', kind: 'num', q: 'How many moles are there in ' + mass + ' g of ' + c[0] + '? (Use H = 1, C = 12, N = 14, O = 16, Na = 23, Mg = 24, S = 32, K = 39, Ca = 40.)', ans: n, why: 'Molar mass of ' + c[0] + ' = ' + M + ' g/mol, so moles = ' + mass + ' / ' + M + ' = ' + n + '.', fact: { t: 'mole', formula: c[0], mass: mass } };
  };
  GEN.molarity = function () {
    var n = ri(1, 8), V = pick([1, 2, 4, 5]), ans = n / V; if (ans !== Math.floor(ans) && ans * 2 !== Math.floor(ans * 2)) return GEN.molarity();
    return { subj: 'chemistry', topic: 'Solutions', kind: 'mcq', q: n + ' mol of a solute is dissolved in water to make ' + V + ' litre of solution. Its molarity, in mol/L, is', ans: ans, choices: opts(ans, function () { return pick([n * V, n + V, n - V, V / n, ans * 2]); }), why: 'Molarity = moles / volume in litres = ' + n + ' / ' + V + ' = ' + ans + ' M.', fact: { t: 'molarity', n: n, V: V } };
  };
  GEN.ph = function () {
    var k = ri(1, 5), kind = pick(['acid', 'base']), ans = kind === 'acid' ? k : 14 - k;
    return { subj: 'chemistry', topic: 'Equilibrium', kind: 'num', q: 'What is the pH at 25 °C of a ' + (kind === 'acid' ? 'strong monobasic acid' : 'strong monoacidic base') + ' solution of concentration 10^−' + k + ' M? (Assume complete ionisation and ignore water\'s own ions.)', ans: ans,
      why: kind === 'acid' ? '[H⁺] = 10^−' + k + ', so pH = ' + k + '.' : '[OH⁻] = 10^−' + k + ', so pOH = ' + k + ' and pH = 14 − ' + k + ' = ' + ans + '.', fact: { t: 'ph', k: k, kind: kind } };
  };
  GEN.dilute = function () {
    var cases = [], m1, v1, v2; for (m1 = 2; m1 <= 12; m1 += 2) for (v1 = 10; v1 <= 100; v1 += 10) for (v2 = 20; v2 <= 200; v2 += 10) if (v2 > v1 && (m1 * v1) % v2 === 0) cases.push([m1, v1, v2, m1 * v1 / v2]);
    var c = pick(cases);
    return { subj: 'chemistry', topic: 'Solutions', kind: 'mcq', q: c[1] + ' mL of a ' + c[0] + ' M solution is diluted with water to ' + c[2] + ' mL. The new molarity, in mol/L, is', ans: c[3], choices: opts(c[3], function () { return pick([c[0] * c[2] / c[1], c[0] - 1, c[0] + 1, c[3] * 2, c[3] + 1]); }), why: 'M₁V₁ = M₂V₂, so M₂ = ' + c[0] + ' × ' + c[1] + ' / ' + c[2] + ' = ' + c[3] + ' M.', fact: { t: 'dilute', m1: c[0], v1: c[1], v2: c[2] } };
  };
  GEN.oxi = function () {
    var c = pick(OXI), cc = c[2], tot = 0, el = c[1], k;
    for (k in cc) { if (k === el) continue; tot += cc[k] * (k === 'O' ? -2 : k === 'Cl' && el !== 'Cl' ? -1 : 1); }
    var ans = -tot / cc[el], pretty = c[0].replace(/(\d+)/g, function (d) { return '₀₁₂₃₄₅₆₇₈₉'.split('')[+d] || d; });
    pretty = c[0].replace(/\d/g, function (d) { return '₀₁₂₃₄₅₆₇₈₉'.charAt(+d); });
    if (ans !== Math.floor(ans)) return GEN.oxi();
    return { subj: 'chemistry', topic: 'Redox reactions', kind: 'num', q: 'What is the oxidation number of ' + el + ' in ' + pretty + '?', ans: ans, why: 'Take H and the alkali metals as +1 and O as −2. The sum over the compound is zero, so ' + el + ' = ' + ans + '.', fact: { t: 'oxi', formula: c[0], el: el } };
  };
  GEN.half = function () {
    var n = ri(2, 5), N0 = pick([32, 64, 80, 96, 160]) , ans = N0 / Math.pow(2, n);
    if (ans !== Math.floor(ans)) return GEN.half();
    return { subj: 'chemistry', topic: 'Chemical kinetics', kind: 'mcq', q: 'A first-order reaction has a half-life of 10 minutes. Starting from ' + N0 + ' g of the reactant, the mass left after ' + (10 * n) + ' minutes, in grams, is', ans: ans, choices: opts(ans, function () { return pick([N0 / (2 * n), N0 / n, ans * 2, ans / 2, N0 - 10 * n]); }), why: (10 * n) + ' minutes is ' + n + ' half-lives, so the mass is ' + N0 + ' / 2^' + n + ' = ' + ans + ' g.', fact: { t: 'half', N0: N0, n: n } };
  };
  var BY_SUBJ = { maths: ['ap', 'quad', 'comb', 'det', 'binom', 'dice', 'deriv', 'integ', 'dist', 'dot'], physics: ['kin', 'par', 'ke', 'lens', 'boyle', 'wave', 'collide'], chemistry: ['mole', 'molarity', 'ph', 'dilute', 'oxi', 'half'] };
  G.ids = Object.keys(GEN);
  G.subjects = BY_SUBJ;
  G.make = function (id) {
    var q = GEN[id](); q.id = id;
    if (q.kind === 'mcq') { q.choices = q.choices.map(String); q.ans = String(q.ans); } else q.ans = String(q.ans);
    return q;
  };
  G.any = function (subj) { var ids = subj === 'all' ? G.ids : BY_SUBJ[subj]; return G.make(pick(ids)); };

  /* ---------------- marks arithmetic (shared by the tools) ---------------- */
  G.score = function (correct, wrong) { return 4 * correct - wrong; };
  G.minScore = function (attempted, accuracy) { var c = Math.round(attempted * accuracy); return 4 * c - (attempted - c); };
  /* the least number of questions that must be attempted, at the given accuracy, to reach a target (paper of n questions) */
  G.needAttempts = function (target, accuracy, n) { for (var a = 0; a <= n; a++) { var c = Math.round(a * accuracy); if (4 * c - (a - c) >= target) return a; } return null; };
  G.minutesEach = function (total, reserve, questions) { return (total - reserve) / questions; };

  if (typeof module !== 'undefined' && module.exports) { module.exports = G; return; }
  window.JEE = G;

  /* ---------------- pages ---------------- */
  var d = document;
  function el(s) { return d.querySelector(s); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function sgn(n) { return String(n).replace('-', '−'); }
  function get(k) { try { return JSON.parse(localStorage.getItem('jee-' + k)); } catch (e) { return null; } }
  function put(k, v) { try { localStorage.setItem('jee-' + k, JSON.stringify(v)); } catch (e) {} }

  var box = el('[data-practice]');
  if (box) {
    var subj = box.getAttribute('data-practice'), st, label = { maths: 'Mathematics', physics: 'Physics', chemistry: 'Chemistry', all: 'Mixed' };
    var start = function () {
      var best = get('best-' + subj);
      box.innerHTML = '<div class="pq-setup"><p class="pq-lab">' + label[subj] + ' practice: 10 questions, marked +4 / −1 like the real paper</p><p>Multiple-choice questions lose 1 mark when wrong. Numerical questions need an integer or simple number typed in, and also lose 1 mark when wrong. Skip a question if you are not sure: it scores 0.</p>' +
        (best !== null ? '<p><b>Your best here: ' + best + ' / 40</b></p>' : '') + '<button type="button" class="btn pq-go">Start</button></div>';
      box.querySelector('.pq-go').onclick = function () { st = { n: 0, score: 0, right: 0, wrong: 0, skip: 0, log: [] }; next(); };
    };
    var next = function () {
      if (st.n >= 10) return done();
      var q = G.any(subj); st.n++; st.q = q; st.t0 = Date.now();
      var body = '<div class="pq-top"><span>Question ' + st.n + ' of 10</span><span>Score: ' + sgn(st.score) + '</span></div><p class="pq-topic">' + esc(q.topic) + ' · ' + (q.kind === 'mcq' ? 'Multiple choice' : 'Numerical value') + '</p><p class="pq-q">' + q.q + '</p>';
      if (q.kind === 'mcq') body += '<div class="pq-ch">' + q.choices.map(function (c, i) { return '<button type="button" data-v="' + esc(c) + '"><i>' + 'ABCD'[i] + '</i> ' + esc(sgn(c)) + '</button>'; }).join('') + '</div>';
      else body += '<div class="pq-num"><label for="pqa">Your answer</label><input id="pqa" inputmode="decimal" autocomplete="off" autocapitalize="off"><button type="button" class="btn pq-sub">Check</button></div>';
      body += '<div class="pq-btns"><button type="button" class="btn ghost pq-skip">Skip (0 marks)</button></div><div class="pq-fb" aria-live="polite"></div>';
      box.innerHTML = body;
      box.querySelector('.pq-skip').onclick = function () { st.skip++; st.log.push([st.q, 'skipped']); reveal('Skipped. 0 marks.', 'skp'); };
      if (q.kind === 'mcq') [].forEach.call(box.querySelectorAll('.pq-ch button'), function (b) { b.onclick = function () { judge(b.getAttribute('data-v'), b); }; });
      else { var inp = box.querySelector('#pqa'); box.querySelector('.pq-sub').onclick = function () { var v = inp.value.trim().replace('−', '-'); if (v === '' || isNaN(+v)) { box.querySelector('.pq-fb').textContent = 'Type a number first.'; return; } judge(String(+v), null); }; inp.onkeydown = function (e) { if (e.key === 'Enter') box.querySelector('.pq-sub').click(); }; }
    };
    var judge = function (v, btn) {
      var ok = v === st.q.ans;
      if (ok) { st.score += 4; st.right++; } else { st.score -= 1; st.wrong++; }
      st.log.push([st.q, ok ? 'right' : 'wrong']);
      if (btn) { btn.classList.add(ok ? 'good' : 'bad'); [].forEach.call(box.querySelectorAll('.pq-ch button'), function (b) { if (b.getAttribute('data-v') === st.q.ans) b.classList.add('good'); }); }
      reveal(ok ? 'Correct. +4 marks.' : 'Not quite. −1 mark. The answer is ' + sgn(st.q.ans) + '.', ok ? 'good' : 'bad');
    };
    var reveal = function (msg, cls) {
      [].forEach.call(box.querySelectorAll('button,input'), function (b) { b.disabled = true; });
      var fb = box.querySelector('.pq-fb'); fb.className = 'pq-fb ' + cls; fb.innerHTML = '<p><b>' + msg + '</b></p><p class="pq-why">' + st.q.why.replace(/-/g, '−') + '</p><button type="button" class="btn pq-next">' + (st.n >= 10 ? 'See result' : 'Next question') + '</button>';
      fb.querySelector('.pq-next').onclick = next; fb.querySelector('.pq-next').focus();
    };
    var done = function () {
      var best = get('best-' + subj); if (best === null || st.score > best) put('best-' + subj, st.score);
      var topics = {}; st.log.forEach(function (x) { if (x[1] === 'wrong') topics[x[0].topic] = 1; });
      var weak = Object.keys(topics);
      box.innerHTML = '<div class="pq-done"><p class="pq-big">' + sgn(st.score) + ' / 40</p><p>' + st.right + ' right (+4 each), ' + st.wrong + ' wrong (−1 each), ' + st.skip + ' skipped.</p>' +
        (weak.length ? '<p><b>Look again at:</b> ' + weak.map(esc).join(', ') + '.</p>' : '<p>No wrong answers this round.</p>') +
        '<p class="hint">These are our own questions and are easier than a real JEE paper. The score is a practice figure, not a prediction.</p><div class="pq-btns"><button type="button" class="btn pq-again">Play again</button></div></div>';
      box.querySelector('.pq-again').onclick = function () { st = { n: 0, score: 0, right: 0, wrong: 0, skip: 0, log: [] }; next(); };
    };
    start();
  }

  var mc = el('[data-marks-calc]');
  if (mc) {
    var subjects = ['Mathematics', 'Physics', 'Chemistry'];
    mc.innerHTML = '<div class="tbl"><table class="calc"><thead><tr><th>Subject</th><th>Section A: right (of 20)</th><th>Section A: wrong</th><th>Section B: right (of 5)</th><th>Section B: wrong</th><th>Marks</th></tr></thead><tbody>' +
      subjects.map(function (s, i) { return '<tr><th scope="row">' + s + '</th>' + ['ar', 'aw', 'br', 'bw'].map(function (k) { return '<td><input type="number" min="0" inputmode="numeric" value="0" data-k="' + k + i + '" aria-label="' + s + ' ' + k + '"></td>'; }).join('') + '<td class="n" data-sub="' + i + '">0</td></tr>'; }).join('') +
      '</tbody></table></div><p class="calc-msg" aria-live="polite"></p><p class="calc-tot">Total: <b data-total>0</b> / 300</p>';
    var calc = function () {
      var tot = 0, msg = [];
      subjects.forEach(function (s, i) {
        var v = function (k) { return Math.max(0, parseInt(mc.querySelector('[data-k="' + k + i + '"]').value, 10) || 0); }, ar = v('ar'), aw = v('aw'), br = v('br'), bw = v('bw');
        if (ar + aw > 20) msg.push(s + ': Section A has only 20 questions.');
        if (br + bw > 5) msg.push(s + ': Section B has only 5 questions.');
        var m = G.score(ar + br, aw + bw); tot += m; mc.querySelector('[data-sub="' + i + '"]').textContent = sgn(m);
      });
      mc.querySelector('[data-total]').textContent = sgn(tot); mc.querySelector('.calc-msg').textContent = msg.join(' ');
    };
    mc.addEventListener('input', calc); calc();
  }

  var pl = el('[data-planner]');
  if (pl) {
    pl.innerHTML = '<div class="fields"><label>Target total marks (of 300)<input type="number" id="pt" min="0" max="300" value="150" inputmode="numeric"></label><label>Accuracy on the questions you attempt (%)<input type="number" id="pa" min="1" max="100" value="80" inputmode="numeric"></label></div><div class="result" data-out aria-live="polite"></div>';
    var plan = function () {
      var t = Math.min(300, Math.max(0, +el('#pt').value || 0)), a = Math.min(100, Math.max(1, +el('#pa').value || 0)) / 100, n = G.needAttempts(t, a, 75), out = pl.querySelector('[data-out]');
      if (n === null) { out.innerHTML = '<p>At ' + Math.round(a * 100) + '% accuracy, even attempting all 75 questions gives ' + sgn(G.minScore(75, a)) + ' marks, which is below your target.</p>'; return; }
      var c = Math.round(n * a);
      out.innerHTML = '<p class="big">' + n + ' questions</p><p>You would need to attempt about <b>' + n + '</b> of the 75 questions (about ' + c + ' right and ' + (n - c) + ' wrong) to score <b>' + sgn(G.minScore(n, a)) + '</b>, which reaches ' + t + '.</p><p>That is about ' + (n / 3).toFixed(1) + ' attempts per subject. Each wrong answer costs 5 marks of swing (the +4 you did not get and the −1 you did), so raising accuracy usually helps more than attempting more.</p>';
    };
    pl.addEventListener('input', plan); plan();
  }

  var tp = el('[data-timer-plan]');
  if (tp) {
    tp.innerHTML = '<div class="fields"><label>Minutes kept for a final check<input type="number" id="tr" min="0" max="60" value="15" inputmode="numeric"></label><label>Minutes for the Section B numerical questions, per subject<input type="number" id="tb" min="5" max="60" value="30" inputmode="numeric"></label></div><div class="result" data-out aria-live="polite"></div>';
    var tplan = function () {
      var r = Math.min(60, Math.max(0, +el('#tr').value || 0)), b = Math.min(60, Math.max(5, +el('#tb').value || 0)), out = tp.querySelector('[data-out]'), total = 180, per = (total - r) / 3, a = per - b;
      if (a <= 0) { out.innerHTML = '<p>The numerical questions take all of the time. Lower their minutes.</p>'; return; }
      out.innerHTML = '<p>With ' + total + ' minutes in all and ' + r + ' kept for checking, each subject gets <b>' + per.toFixed(0) + ' minutes</b>. If ' + b + ' of them go to the 5 numerical questions (' + (b / 5).toFixed(1) + ' min each), the 20 multiple-choice questions get ' + a.toFixed(0) + ' minutes (' + (a / 20).toFixed(1) + ' min each).</p>';
    };
    tp.addEventListener('input', tplan); tplan();
  }
})();
