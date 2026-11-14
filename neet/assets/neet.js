/* learn.shareyourgroup.com/neet: practice questions of our own for NEET UG style preparation (all multiple choice), plus marks tools. Question makers first (pure, seedable;
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
  /* ---------------- biology ---------------- */
  GEN.chargaff = function () {
    var x = ri(15, 35), ans = 50 - x;
    return { subj: 'biology', topic: 'Molecular basis of inheritance', kind: 'num', q: 'In a double-stranded DNA molecule, adenine makes up ' + x + '% of the bases. What percentage of the bases is guanine?', ans: ans, why: 'A pairs with T, so T is also ' + x + '%. A + T = ' + 2 * x + '%, leaving ' + (100 - 2 * x) + '% for G + C, shared equally, so G = ' + ans + '%.', fact: { t: 'chargaff', x: x } };
  };
  GEN.mitosis = function () {
    var n = ri(3, 8), ans = Math.pow(2, n);
    return { subj: 'biology', topic: 'Cell cycle and cell division', kind: 'num', q: 'A single cell divides by mitosis, and every daughter cell keeps dividing, ' + n + ' times in all (every cell divides each time). How many cells are there at the end?', ans: ans, why: 'Each round of mitosis doubles the number of cells, so after ' + n + ' rounds there are 2^' + n + ' = ' + ans + ' cells.', fact: { t: 'mitosis', n: n } };
  };
  GEN.meiosis = function () {
    var n = ri(3, 12), ans = 4 * n;
    return { subj: 'biology', topic: 'Cell cycle and cell division', kind: 'num', q: n + ' primary spermatocytes each complete meiosis. How many sperm cells are formed in all?', ans: ans, why: 'Each primary spermatocyte gives four sperm through meiosis I and II, so ' + n + ' × 4 = ' + ans + '.', fact: { t: 'meiosis', n: n } };
  };
  GEN.chromatid = function () {
    var k = pick([8, 14, 20, 24, 38, 46]), ans = 2 * k;
    return { subj: 'biology', topic: 'Cell cycle and cell division', kind: 'num', q: 'A diploid cell has 2n = ' + k + ' chromosomes. How many chromatids does it have at metaphase of mitosis?', ans: ans, why: 'At metaphase each of the ' + k + ' chromosomes consists of two sister chromatids, so there are 2 × ' + k + ' = ' + ans + ' chromatids.', fact: { t: 'chromatid', k: k } };
  };
  GEN.monohybrid = function () {
    var k = ri(2, 12) * 4 * 5, kind = pick(['tall', 'short']), ans = kind === 'tall' ? k * 3 / 4 : k / 4;
    return { subj: 'biology', topic: 'Principles of inheritance', kind: 'num', q: 'Two heterozygous tall pea plants (Tt × Tt) are crossed and produce ' + k + ' offspring. About how many are expected to be ' + kind + '? (Tall is dominant over short.)', ans: ans, why: 'A monohybrid cross of two heterozygotes gives a 3 tall : 1 short ratio, so the expected number of ' + kind + ' plants is ' + (kind === 'tall' ? '3/4' : '1/4') + ' of ' + k + ' = ' + ans + '.', fact: { t: 'monohybrid', k: k, kind: kind } };
  };
  GEN.hardy = function () {
    var pq = pick([[1, 0.1], [4, 0.2], [9, 0.3], [16, 0.4], [25, 0.5]]), N = pick([1000, 2000, 5000]), q = pq[1], p = Math.round((1 - q) * 10) / 10, ans = Math.round(2 * p * q * N);
    return { subj: 'biology', topic: 'Evolution', kind: 'num', q: 'In a population in Hardy-Weinberg equilibrium, ' + pq[0] + '% of individuals show a recessive trait (genotype aa). In a population of ' + N + ', how many individuals are expected to be heterozygous carriers (Aa)?', ans: ans, why: 'q² = ' + pq[0] / 100 + ', so q = ' + q + ' and p = ' + p + '. Carriers = 2pq = ' + (2 * p * q).toFixed(2) + ', so ' + (2 * p * q).toFixed(2) + ' × ' + N + ' = ' + ans + '.', fact: { t: 'hardy', pct: pq[0], N: N } };
  };
  GEN.hbonds = function () {
    var at = ri(4, 20), gc = ri(4, 20), ans = 2 * at + 3 * gc;
    return { subj: 'biology', topic: 'Molecular basis of inheritance', kind: 'num', q: 'A short DNA segment has ' + at + ' A-T base pairs and ' + gc + ' G-C base pairs. How many hydrogen bonds hold the two strands together?', ans: ans, why: 'A-T pairs have 2 hydrogen bonds and G-C pairs have 3: 2 × ' + at + ' + 3 × ' + gc + ' = ' + ans + '.', fact: { t: 'hbonds', at: at, gc: gc } };
  };
  GEN.tenpct = function () {
    var E = pick([10000, 20000, 50000, 100000]), n = ri(2, 4), ans = E / Math.pow(10, n - 1);
    return { subj: 'biology', topic: 'Ecosystem', kind: 'num', q: 'Producers (the first trophic level) fix ' + E + ' J of energy. Using the 10 per cent law, how much energy, in joules, reaches trophic level ' + n + '?', ans: ans, why: 'Only 10% passes to each next level: ' + E + ' × (1/10)^' + (n - 1) + ' = ' + ans + ' J.', fact: { t: 'tenpct', E: E, n: n } };
  };
  GEN.glyco = function () {
    var n = ri(2, 12), ans = 2 * n;
    return { subj: 'biology', topic: 'Respiration in plants', kind: 'num', q: 'Counting only glycolysis, how many net ATP molecules are produced when ' + n + ' molecules of glucose are broken down?', ans: ans, why: 'Glycolysis gives a net gain of 2 ATP per glucose molecule, so ' + n + ' × 2 = ' + ans + ' ATP.', fact: { t: 'glyco', n: n } };
  };
  var BY_SUBJ = { physics: ['kin', 'par', 'ke', 'lens', 'boyle', 'wave', 'collide'], chemistry: ['mole', 'molarity', 'ph', 'dilute', 'oxi', 'half'], biology: ['chargaff', 'mitosis', 'meiosis', 'chromatid', 'monohybrid', 'hardy', 'hbonds', 'tenpct', 'glyco'] };
  G.ids = Object.keys(GEN);
  G.subjects = BY_SUBJ;
  G.make = function (id) {
    var q = GEN[id](); q.id = id;
    if (q.kind === 'num') { var a = +q.ans, spread = Math.max(3, Math.round(Math.abs(a) * 0.3)); q.choices = opts(a, function () { return a + ri(-spread, spread); }); q.kind = 'mcq'; q.fromNum = true; }
    q.choices = q.choices.map(String); q.ans = String(q.ans);
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
  window.NEET = G;

  /* ---------------- pages ---------------- */
  var d = document;
  function el(s) { return d.querySelector(s); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function sgn(n) { return String(n).replace('-', '−'); }
  function get(k) { try { return JSON.parse(localStorage.getItem('neet-' + k)); } catch (e) { return null; } }
  function put(k, v) { try { localStorage.setItem('neet-' + k, JSON.stringify(v)); } catch (e) {} }

  var box = el('[data-practice]');
  if (box) {
    var subj = box.getAttribute('data-practice'), st, label = { physics: 'Physics', chemistry: 'Chemistry', biology: 'Biology', all: 'Mixed' };
    var start = function () {
      var best = get('best-' + subj);
      box.innerHTML = '<div class="pq-setup"><p class="pq-lab">' + label[subj] + ' practice: 10 questions, marked +4 / −1 like the real paper</p><p>Every question has four options and one best answer. A wrong answer loses 1 mark. Skip a question if you are not sure: it scores 0.</p>' +
        (best !== null ? '<p><b>Your best here: ' + best + ' / 40</b></p>' : '') + '<button type="button" class="btn pq-go">Start</button></div>';
      box.querySelector('.pq-go').onclick = function () { st = { n: 0, score: 0, right: 0, wrong: 0, skip: 0, log: [] }; next(); };
    };
    var next = function () {
      if (st.n >= 10) return done();
      var q = G.any(subj); st.n++; st.q = q; st.t0 = Date.now();
      var body = '<div class="pq-top"><span>Question ' + st.n + ' of 10</span><span>Score: ' + sgn(st.score) + '</span></div><p class="pq-topic">' + esc(q.topic) + ' · ' + 'Multiple choice' + '</p><p class="pq-q">' + q.q + '</p>';
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
        '<p class="hint">These are our own questions and are easier than a real NEET paper. The score is a practice figure, not a prediction.</p><div class="pq-btns"><button type="button" class="btn pq-again">Play again</button></div></div>';
      box.querySelector('.pq-again').onclick = function () { st = { n: 0, score: 0, right: 0, wrong: 0, skip: 0, log: [] }; next(); };
    };
    start();
  }

  var mc = el('[data-marks-calc]');
  if (mc) {
    var subjects = ['Physics', 'Chemistry', 'Biology'], MAXQ = [45, 45, 90];
    mc.innerHTML = '<div class="tbl"><table class="calc"><thead><tr><th>Subject</th><th>Right</th><th>Wrong</th><th>Marks</th></tr></thead><tbody>' +
      subjects.map(function (s, i) { return '<tr><th scope="row">' + s + ' (of ' + MAXQ[i] + ')</th>' + ['r', 'w'].map(function (k) { return '<td><input type="number" min="0" inputmode="numeric" value="0" data-k="' + k + i + '" aria-label="' + s + ' ' + (k === 'r' ? 'right' : 'wrong') + '"></td>'; }).join('') + '<td class="n" data-sub="' + i + '">0</td></tr>'; }).join('') +
      '</tbody></table></div><p class="calc-msg" aria-live="polite"></p><p class="calc-tot">Total: <b data-total>0</b> / 720</p>';
    var calc = function () {
      var tot = 0, msg = [];
      subjects.forEach(function (s, i) {
        var v = function (k) { return Math.max(0, parseInt(mc.querySelector('[data-k="' + k + i + '"]').value, 10) || 0); }, r = v('r'), w = v('w');
        if (r + w > MAXQ[i]) msg.push(s + ' has only ' + MAXQ[i] + ' questions.');
        var m = G.score(r, w); tot += m; mc.querySelector('[data-sub="' + i + '"]').textContent = sgn(m);
      });
      mc.querySelector('[data-total]').textContent = sgn(tot); mc.querySelector('.calc-msg').textContent = msg.join(' ');
    };
    mc.addEventListener('input', calc); calc();
  }

  var pl = el('[data-planner]');
  if (pl) {
    pl.innerHTML = '<div class="fields"><label>Target total marks (of 720)<input type="number" id="pt" min="0" max="720" value="500" inputmode="numeric"></label><label>Accuracy on the questions you attempt (%)<input type="number" id="pa" min="1" max="100" value="80" inputmode="numeric"></label></div><div class="result" data-out aria-live="polite"></div>';
    var plan = function () {
      var t = Math.min(720, Math.max(0, +el('#pt').value || 0)), a = Math.min(100, Math.max(1, +el('#pa').value || 0)) / 100, n = G.needAttempts(t, a, 180), out = pl.querySelector('[data-out]');
      if (n === null) { out.innerHTML = '<p>At ' + Math.round(a * 100) + '% accuracy, even attempting all 180 questions gives ' + sgn(G.minScore(180, a)) + ' marks, which is below your target.</p>'; return; }
      var c = Math.round(n * a);
      out.innerHTML = '<p class="big">' + n + ' questions</p><p>You would need to attempt about <b>' + n + '</b> of the 180 questions (about ' + c + ' right and ' + (n - c) + ' wrong) to score <b>' + sgn(G.minScore(n, a)) + '</b>, which reaches ' + t + '.</p><p>Each wrong answer costs 5 marks of swing (the +4 you did not get and the −1 you did), so raising accuracy usually helps more than attempting more.</p>';
    };
    pl.addEventListener('input', plan); plan();
  }

  var tp = el('[data-timer-plan]');
  if (tp) {
    tp.innerHTML = '<div class="fields"><label>Minutes kept for a final check<input type="number" id="tr" min="0" max="60" value="15" inputmode="numeric"></label><label>Minutes for Biology (90 questions)<input type="number" id="tb" min="20" max="120" value="60" inputmode="numeric"></label></div><div class="result" data-out aria-live="polite"></div>';
    var tplan = function () {
      var r = Math.min(60, Math.max(0, +el('#tr').value || 0)), b = Math.min(120, Math.max(20, +el('#tb').value || 0)), out = tp.querySelector('[data-out]'), left = 180 - r - b;
      if (left <= 0) { out.innerHTML = '<p>Biology takes all of the time. Lower its minutes.</p>'; return; }
      out.innerHTML = '<p>With 180 minutes in all and ' + r + ' kept for checking, ' + b + ' minutes for Biology gives ' + (b / 90).toFixed(2) + ' minutes a question. Physics and Chemistry (90 questions together) then share ' + left + ' minutes, which is ' + (left / 90).toFixed(2) + ' minutes a question.</p>';
    };
    tp.addEventListener('input', tplan); tplan();
  }
})();
