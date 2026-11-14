/* learn.shareyourgroup.com/mathsteps: school maths with the working shown: fractions, linear equations, HCF and LCM. Pure helpers first (the build checks the answers in Node against separate Python code
   using exact fractions), then the tools. Nothing is sent anywhere. Whole numbers only, up to 1,000,000 in size. */
(function () {
  'use strict';
  var M = {};
  M.LIMIT = 1000000;
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a; }
  M.gcd = gcd;
  function ok(x) { return typeof x === 'number' && isFinite(x) && Math.floor(x) === x && Math.abs(x) <= M.LIMIT; }
  /* a fraction n/d is kept as {n, d} with d > 0 */
  function norm(n, d) { if (d < 0) { n = -n; d = -d; } return { n: n, d: d }; }
  function red(f) { var g = gcd(f.n, f.d) || 1; return { n: f.n / g, d: f.d / g }; }
  function show(f) { return f.d === 1 ? String(f.n) : f.n + '/' + f.d; }
  function mixed(f) { if (f.d === 1 || Math.abs(f.n) < f.d) return ''; var w = Math.trunc(f.n / f.d), r = Math.abs(f.n) % f.d; return (f.n < 0 ? '-' : '') + Math.abs(w) + ' and ' + r + '/' + f.d; }
  M.show = show; M.mixed = mixed;
  /* Euclid's method: a = q b + r until r = 0; the last divisor is the HCF */
  M.euclid = function (a, b) {
    if (!ok(a) || !ok(b) || a <= 0 || b <= 0) return null;
    var x = Math.max(a, b), y = Math.min(a, b), rows = [];
    while (y) { var q = Math.floor(x / y), r = x % y; rows.push({ a: x, b: y, q: q, r: r }); x = y; y = r; }
    return { hcf: x, rows: rows, lcm: a / x * b };
  };
  /* op: '+', '-', '*', '/'. Returns {n, d, steps} or {error}. */
  M.frac = function (an, ad, op, bn, bd) {
    if (![an, ad, bn, bd].every(ok)) return { error: 'Use whole numbers up to 1,000,000.' };
    if (ad === 0 || bd === 0) return { error: 'A denominator cannot be 0.' };
    if (op === '/' && bn === 0) return { error: 'You cannot divide by zero.' };
    var a = norm(an, ad), b = norm(bn, bd), steps = [], r;
    if (op === '+' || op === '-') {
      var l = a.d / gcd(a.d, b.d) * b.d, x = a.n * (l / a.d), y = b.n * (l / b.d);
      steps.push('Make the denominators equal. The smallest common denominator of ' + a.d + ' and ' + b.d + ' is ' + l + '.');
      steps.push(show(a) + ' = ' + x + '/' + l + ' and ' + show(b) + ' = ' + y + '/' + l + '.');
      r = { n: op === '+' ? x + y : x - y, d: l };
      steps.push((op === '+' ? 'Add' : 'Subtract') + ' the numerators: ' + x + (op === '+' ? ' + ' : ' − ') + y + ' = ' + r.n + ', so the result is ' + r.n + '/' + l + '.');
    } else if (op === '*') {
      r = { n: a.n * b.n, d: a.d * b.d };
      steps.push('Multiply the numerators and the denominators: ' + a.n + ' × ' + b.n + ' = ' + r.n + ' and ' + a.d + ' × ' + b.d + ' = ' + r.d + ', so ' + r.n + '/' + r.d + '.');
    } else {
      var inv = norm(b.d, b.n);
      steps.push('To divide, multiply by the reciprocal of the second fraction: ' + show(b) + ' becomes ' + show(inv) + '.');
      r = { n: a.n * inv.n, d: a.d * inv.d };
      steps.push('Multiply: ' + a.n + ' × ' + inv.n + ' = ' + r.n + ' and ' + a.d + ' × ' + inv.d + ' = ' + r.d + ', so ' + r.n + '/' + r.d + '.');
    }
    r = norm(r.n, r.d);
    var g = gcd(r.n, r.d) || 1, s = red(r);
    steps.push(g > 1 ? 'Simplify by dividing top and bottom by their HCF, ' + g + ': ' + r.n + '/' + r.d + ' = ' + show(s) + '.' : (r.n === 0 ? 'The result is 0.' : 'The fraction cannot be simplified further.'));
    if (r.n === 0) s = { n: 0, d: 1 };
    var m = mixed(s); if (m) steps.push('As a mixed number: ' + m + '.');
    return { n: s.n, d: s.d, steps: steps, answer: show(s) };
  };
  /* a x + b = c  (a not 0): x = (c - b) / a */
  M.linear = function (a, b, c) {
    if (![a, b, c].every(ok)) return { error: 'Use whole numbers up to 1,000,000.' };
    if (a === 0) return { error: 'The number with x cannot be 0.' };
    var steps = [], rhs = c - b;
    steps.push('Write the equation: ' + a + 'x ' + (b < 0 ? '− ' + (-b) : '+ ' + b) + ' = ' + c + '.');
    steps.push('Take ' + b + ' from both sides: ' + a + 'x = ' + c + (b < 0 ? ' + ' + (-b) : ' − ' + b) + ' = ' + rhs + '.');
    var f = red(norm(rhs, a));
    if (rhs === 0) f = { n: 0, d: 1 };
    var raw = rhs + '/' + a;
    steps.push('Divide both sides by ' + a + ': x = ' + raw + (show(f) !== raw ? ' = ' + show(f) : '') + '.');
    steps.push('Check: ' + a + ' × ' + show(f) + ' ' + (b < 0 ? '− ' + (-b) : '+ ' + b) + ' = ' + c + '.');
    return { n: f.n, d: f.d, steps: steps, answer: 'x = ' + show(f) };
  };
  if (typeof module !== 'undefined' && module.exports) { module.exports = M; return; }
  window.MATHSTEPS = M;

  var d = document;
  function el(q) { return d.querySelector(q); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function lst(steps) { return '<ol class="steps">' + steps.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ol>'; }
  function num(id) { var v = el(id).value; return v === '' ? NaN : +v; }
  var f1 = el('[data-frac]');
  if (f1) {
    f1.innerHTML = '<div class="fcalc"><label>Top<input type="number" id="an" value="3"></label><label>Bottom<input type="number" id="ad" value="4"></label><label>Operation<select id="op"><option value="+">+</option><option value="-">−</option><option value="*">×</option><option value="/">÷</option></select></label><label>Top<input type="number" id="bn" value="5"></label><label>Bottom<input type="number" id="bd" value="6"></label></div><div data-out aria-live="polite"></div>';
    var run = function () { var r = M.frac(num('#an'), num('#ad'), el('#op').value, num('#bn'), num('#bd')); f1.querySelector('[data-out]').innerHTML = r.error ? '<p class="msg">' + esc(r.error) + '</p>' : '<p class="ans">= ' + esc(r.answer) + '</p>' + lst(r.steps); };
    f1.addEventListener('input', run); f1.addEventListener('change', run); run();
  }
  var l1 = el('[data-linear]');
  if (l1) {
    l1.innerHTML = '<div class="fcalc"><label>a (with x)<input type="number" id="la" value="3"></label><label>b<input type="number" id="lb" value="5"></label><label>c<input type="number" id="lc" value="20"></label></div><p>Solves <b>a x + b = c</b>.</p><div data-out aria-live="polite"></div>';
    var run2 = function () { var r = M.linear(num('#la'), num('#lb'), num('#lc')); l1.querySelector('[data-out]').innerHTML = r.error ? '<p class="msg">' + esc(r.error) + '</p>' : '<p class="ans">' + esc(r.answer) + '</p>' + lst(r.steps); };
    l1.addEventListener('input', run2); run2();
  }
  var h1 = el('[data-hcf]');
  if (h1) {
    h1.innerHTML = '<div class="fcalc"><label>First number<input type="number" id="ha" value="84"></label><label>Second number<input type="number" id="hb" value="36"></label></div><div data-out aria-live="polite"></div>';
    var run3 = function () {
      var r = M.euclid(num('#ha'), num('#hb')), o = h1.querySelector('[data-out]');
      if (!r) { o.innerHTML = '<p class="msg">Use whole numbers from 1 to 1,000,000.</p>'; return; }
      o.innerHTML = '<p class="ans">HCF = ' + r.hcf + ', LCM = ' + r.lcm + '</p>' + lst(r.rows.map(function (x) { return x.a + ' = ' + x.q + ' × ' + x.b + ' + ' + x.r; }).concat(['The last divisor, ' + r.hcf + ', is the HCF.', 'LCM = first × second / HCF = ' + num('#ha') + ' × ' + num('#hb') + ' / ' + r.hcf + ' = ' + r.lcm + '.']));
    };
    h1.addEventListener('input', run3); run3();
  }
})();
