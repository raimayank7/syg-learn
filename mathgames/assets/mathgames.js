/* learn.shareyourgroup.com/mathgames: small maths games for classes 1 to 8. Question makers first (pure, seedable; the build asks Node for thousands of
   questions and re-works every answer in Python), then the play screens. No sound, no tracking, scores kept only in this browser. */
(function () {
  'use strict';
  var G = {}, R = Math.random;
  G.seed = function (s) { var a = s >>> 0; R = function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; };
  function ri(a, b) { return a + Math.floor(R() * (b - a + 1)); }
  function pick(l) { return l[Math.floor(R() * l.length)]; }
  function shuffle(l) { for (var j = l.length - 1; j > 0; j--) { var k = Math.floor(R() * (j + 1)), t = l[j]; l[j] = l[k]; l[k] = t; } return l; }
  function gcd(a, b) { while (b) { var t = a % b; a = b; b = t; } return a; }
  function isPrime(n) { if (n < 2) return false; for (var d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; }
  function comma(n) { var s = String(Math.abs(n)), neg = n < 0 ? '−' : ''; if (s.length <= 3) return neg + s; return neg + s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + s.slice(-3); }
  /* the answer plus three different wrong answers, mixed up. make() proposes a wrong answer. */
  function opts(ans, make, n) { var out = [ans], guard = 0; while (out.length < (n || 4) && guard++ < 400) { var w = make(); if (w !== null && out.indexOf(w) < 0) out.push(w); } return shuffle(out); }
  function near(ans, spread, min) { return function () { var w = ans + ri(-spread, spread); return (min !== undefined && w < min) ? null : w; }; }
  var OPS = { '+': function (a, b) { return a + b; }, '−': function (a, b) { return a - b; }, '×': function (a, b) { return a * b; }, '÷': function (a, b) { return b !== 0 && a % b === 0 ? a / b : NaN; } };

  var GEN = {};
  GEN.count = function (lv) {
    var n = lv === 1 ? ri(1, 6) : lv === 2 ? ri(4, 12) : ri(8, 20), cols = 5, cells = [], i, s = '';
    for (i = 0; i < 20; i++) cells.push(i);
    shuffle(cells);
    for (i = 0; i < n; i++) { var c = cells[i], x = 26 + (c % cols) * 47 + ri(-7, 7), y = 24 + Math.floor(c / cols) * 40 + ri(-6, 6); s += '<circle cx="' + x + '" cy="' + y + '" r="13"/>'; }
    return { q: 'How many dots?', html: '<svg class="g-svg dots" viewBox="0 0 260 172" role="img" aria-label="Some dots to count">' + s + '</svg>', choices: opts(n, near(n, 3, 1)), ans: n, why: 'There are ' + n + ' dots.', fact: { t: 'count', n: n } };
  };
  function cmpVal(lv) {
    if (lv === 1) return String(ri(1, 99));
    if (lv === 2) return String(ri(100, 9999));
    if (lv === 3) { var op = pick(['+', '−', '×']); if (op === '×') return ri(2, 9) + ' × ' + ri(2, 9); if (op === '+') return ri(5, 60) + ' + ' + ri(5, 40); var a = ri(20, 99); return a + ' − ' + ri(1, a - 1); }
    if (lv === 4) { var d = ri(2, 12), n = ri(1, d - 1); return n + '/' + d; }
    return pick([function () { return (ri(1, 999) / 100).toFixed(2); }, function () { return (ri(1, 99) / 10).toFixed(1); }, function () { return '−' + ri(1, 30); }, function () { return String(ri(0, 12)); }])();
  }
  function num(s) { s = String(s).replace('−', '-'); var m; if ((m = /^(-?\d+) ([+×]|-|−) (\d+)$/.exec(s.replace(' − ', ' - ')))) return m[2] === '+' ? +m[1] + +m[3] : m[2] === '×' ? m[1] * m[3] : m[1] - m[3]; if ((m = /^(\d+)\/(\d+)$/.exec(s))) return m[1] / m[2]; return parseFloat(s); }
  GEN.bigger = function (lv) {
    var a, b, guard = 0;
    do { a = cmpVal(lv); b = cmpVal(lv); } while (Math.abs(num(a) - num(b)) < 1e-9 && guard++ < 50);
    var want = R() < 0.7 ? 'bigger' : 'smaller', big = num(a) > num(b) ? a : b, small = big === a ? b : a, ans = want === 'bigger' ? big : small;
    return { q: 'Tap the ' + want + ' one', choices: [a, b], ans: ans, wide: true, why: big + ' is bigger than ' + small + '.', fact: { t: 'cmp', a: a, b: b, want: want } };
  };
  GEN.sign = function (lv) {
    var a, b, op, c, ok, k, guard = 0;
    do {
      op = pick(lv === 1 ? ['+', '−'] : ['+', '−', '×', '÷']);
      if (op === '+') { a = ri(1, lv === 1 ? 10 : 40); b = ri(1, lv === 1 ? 10 : 40); } else if (op === '−') { a = ri(2, lv === 1 ? 20 : 80); b = ri(1, a - 1); }
      else if (op === '×') { a = ri(2, lv === 2 ? 9 : 12); b = ri(2, lv === 2 ? 9 : 12); } else { b = ri(2, lv === 2 ? 9 : 12); a = b * ri(2, lv === 2 ? 9 : 12); }
      c = OPS[op](a, b); ok = 0; for (k in OPS) if (OPS[k](a, b) === c) ok++;
    } while (ok !== 1 && guard++ < 200);
    return { q: a + ' ? ' + b + ' = ' + c, choices: lv === 1 ? ['+', '−'] : ['+', '−', '×', '÷'], ans: op, why: a + ' ' + op + ' ' + b + ' = ' + c + '.', fact: { t: 'sign', a: a, b: b, c: c } };
  };
  function arith(lv) {
    var op, a, b;
    if (lv === 1) { op = '+'; a = ri(1, 10); b = ri(1, 10); }
    else if (lv === 2) { op = pick(['+', '−']); if (op === '+') { a = ri(10, 60); b = ri(5, 39); } else { a = ri(20, 99); b = ri(2, a - 1); } }
    else if (lv === 3) { op = pick(['×', '÷']); if (op === '×') { a = ri(2, 10); b = ri(2, 10); } else { b = ri(2, 10); a = b * ri(2, 10); } }
    else if (lv === 4) { op = pick(['+', '−', '×', '÷']); if (op === '+') { a = ri(100, 600); b = ri(50, 399); } else if (op === '−') { a = ri(200, 999); b = ri(20, a - 1); } else if (op === '×') { a = ri(11, 25); b = ri(3, 12); } else { b = ri(3, 12); a = b * ri(11, 25); } }
    else { op = pick(['+', '−', '×']); a = ri(-12, 12); b = ri(-12, 12); if (op === '×') { a = ri(-9, 9); b = ri(-9, 9); } }
    return [a, op, b, OPS[op](a, b)];
  }
  function show(n) { return n < 0 ? '(−' + (-n) + ')' : String(n); }
  GEN.sprint = function (lv) { var x = arith(lv); return { q: (lv === 5 ? show(x[0]) : x[0]) + ' ' + x[1] + ' ' + (lv === 5 ? show(x[2]) : x[2]) + ' = ?', pad: true, neg: lv === 5, ans: x[3], why: x[0] + ' ' + x[1] + ' ' + show(x[2]) + ' = ' + String(x[3]).replace('-', '−') + '.', fact: { t: 'arith', a: x[0], op: x[1], b: x[2] } }; };
  GEN.odd = function (lv) {
    var kind = lv === 1 ? pick(['even', 'oddn']) : lv === 2 ? 'mult' : pick(['prime', 'square', 'mult']), k = lv === 2 ? pick([3, 4, 5, 6, 10]) : pick([6, 7, 8, 9]), max = lv === 1 ? 40 : 100, has, text, good = [], bad, n, guard = 0;
    if (kind === 'even') { has = function (x) { return x % 2 === 0; }; text = 'even numbers'; }
    else if (kind === 'oddn') { has = function (x) { return x % 2 === 1; }; text = 'odd numbers'; }
    else if (kind === 'mult') { has = function (x) { return x % k === 0; }; text = 'multiples of ' + k; }
    else if (kind === 'prime') { has = isPrime; text = 'prime numbers'; }
    else { has = function (x) { var r = Math.round(Math.sqrt(x)); return r * r === x; }; text = 'square numbers'; max = 150; }
    while (good.length < 3 && guard++ < 5000) { n = ri(2, max); if (has(n) && good.indexOf(n) < 0) good.push(n); }
    do { bad = ri(2, max); } while (has(bad) || good.indexOf(bad) > -1);
    return { q: 'Three of these are ' + text + '. Tap the one that is not.', choices: shuffle(good.concat([bad])), ans: bad, why: good.sort(function (x, y) { return x - y; }).join(', ') + ' are ' + text + '. ' + bad + ' is not.', fact: { t: 'odd', kind: kind, k: k, nums: good.concat([bad]) } };
  };
  GEN.pattern = function (lv) {
    var kind = lv === 1 ? pick(['add', 'sub']) : lv === 2 ? pick(['add', 'sub', 'mul']) : pick(['grow', 'square', 'fib', 'mul', 'alt']), t = [], i, a, d, next, why;
    if (kind === 'add') { a = ri(1, lv === 1 ? 20 : 60); d = ri(2, lv === 1 ? 5 : 12); for (i = 0; i < 5; i++) t.push(a + i * d); next = a + 5 * d; why = 'Add ' + d + ' each time.'; }
    else if (kind === 'sub') { d = ri(2, lv === 1 ? 5 : 11); a = ri(5 * d + 1, 5 * d + 40); for (i = 0; i < 5; i++) t.push(a - i * d); next = a - 5 * d; why = 'Take away ' + d + ' each time.'; }
    else if (kind === 'mul') { a = ri(1, 5); d = pick([2, 2, 3]); for (i = 0; i < 5; i++) t.push(a * Math.pow(d, i)); next = a * Math.pow(d, 5); why = 'Multiply by ' + d + ' each time.'; }
    else if (kind === 'grow') { a = ri(1, 9); d = ri(1, 3); t.push(a); for (i = 1; i < 5; i++) t.push(t[i - 1] + d + i - 1); next = t[4] + d + 4; why = 'The step grows by 1 each time: +' + d + ', +' + (d + 1) + ', +' + (d + 2) + ', +' + (d + 3) + ', so next is +' + (d + 4) + '.'; }
    else if (kind === 'square') { a = ri(1, 6); for (i = 0; i < 5; i++) t.push((a + i) * (a + i)); next = (a + 5) * (a + 5); why = 'These are square numbers: ' + a + ' × ' + a + ', ' + (a + 1) + ' × ' + (a + 1) + ' and so on. Next is ' + (a + 5) + ' × ' + (a + 5) + '.'; }
    else if (kind === 'fib') { t = [ri(1, 4), ri(1, 5)]; for (i = 2; i < 6; i++) t.push(t[i - 1] + t[i - 2]); next = t[5] + t[4]; why = 'Each number is the sum of the two before it: ' + t[4] + ' + ' + t[5] + ' = ' + next + '.'; }
    else { a = ri(2, 20); d = ri(3, 7); var e = ri(1, d - 2); t.push(a); for (i = 1; i < 6; i++) t.push(t[i - 1] + (i % 2 ? d : -e)); next = t[5] + (6 % 2 ? d : -e); why = 'The steps take turns: +' + d + ', then −' + e + '.'; }
    return { q: t.join(',  ') + ',  ?', choices: opts(next, near(next, Math.max(4, Math.round(Math.abs(next) * 0.2)), 0)), ans: next, why: why, fact: { t: 'seq', kind: kind, terms: t, d: d, e: e } };
  };
  var PLACES = ['ones', 'tens', 'hundreds', 'thousands', 'ten thousands', 'lakhs'];
  GEN.place = function (lv) {
    var len = lv === 1 ? 3 : lv === 2 ? 4 : ri(5, 6), ds, n, p, digit, kind = R() < 0.5 ? 'digit' : 'value';
    do { ds = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, len); if (len > 3 && R() < 0.4) ds[ri(1, len - 1)] = 0; } while (ds[0] === 0);
    n = +ds.join(''); p = ri(0, len - 1); digit = ds[len - 1 - p]; if (digit === 0) kind = 'digit';
    if (kind === 'digit') return { q: 'In ' + comma(n) + ', which digit is in the ' + PLACES[p] + ' place?', choices: shuffle(ds.filter(function (x, i) { return ds.indexOf(x) === i; }).slice(0)), ans: digit, why: 'The ' + PLACES[p] + ' place of ' + comma(n) + ' holds ' + digit + '.', fact: { t: 'place', n: n, p: p, kind: kind } };
    var val = digit * Math.pow(10, p), c = [val], i; for (i = 0; i < 6 && c.length < 4; i++) { var w = digit * Math.pow(10, i); if (c.indexOf(w) < 0) c.push(w); }
    return { q: 'In ' + comma(n) + ', what is the value of the digit ' + digit + '?', choices: shuffle(c).map(function (x) { return x; }), fmt: 'comma', ans: val, why: 'The ' + digit + ' is in the ' + PLACES[p] + ' place, so it is worth ' + comma(val) + '.', fact: { t: 'place', n: n, p: p, kind: kind } };
  };
  function tstr(h, m) { return h + ':' + (m < 10 ? '0' : '') + m; }
  G.clockSvg = function (h, m) {
    var s = '<circle class="face" cx="100" cy="100" r="92"/>', i, a;
    for (i = 1; i <= 12; i++) { a = i * 30 * Math.PI / 180; s += '<text x="' + (100 + 74 * Math.sin(a)).toFixed(1) + '" y="' + (100 - 74 * Math.cos(a) + 6).toFixed(1) + '" text-anchor="middle">' + i + '</text>'; }
    for (i = 0; i < 60; i++) { a = i * 6 * Math.PI / 180; var r1 = i % 5 ? 88 : 84; s += '<line class="tick" x1="' + (100 + r1 * Math.sin(a)).toFixed(1) + '" y1="' + (100 - r1 * Math.cos(a)).toFixed(1) + '" x2="' + (100 + 91 * Math.sin(a)).toFixed(1) + '" y2="' + (100 - 91 * Math.cos(a)).toFixed(1) + '"/>'; }
    var ha = ((h % 12) + m / 60) * 30 * Math.PI / 180, ma = m * 6 * Math.PI / 180;
    s += '<line class="hh" x1="100" y1="100" x2="' + (100 + 46 * Math.sin(ha)).toFixed(1) + '" y2="' + (100 - 46 * Math.cos(ha)).toFixed(1) + '"/><line class="mh" x1="100" y1="100" x2="' + (100 + 68 * Math.sin(ma)).toFixed(1) + '" y2="' + (100 - 68 * Math.cos(ma)).toFixed(1) + '"/><circle class="pin" cx="100" cy="100" r="5"/>';
    return '<svg class="g-svg clock" viewBox="0 0 200 200" role="img" aria-label="A clock face">' + s + '</svg>';
  };
  GEN.clock = function (lv) {
    var h = ri(1, 12), m = lv === 1 ? pick([0, 30]) : lv === 2 ? pick([0, 15, 30, 45]) : lv === 3 ? ri(0, 11) * 5 : ri(0, 59), ans = tstr(h, m);
    var c = opts(ans, function () { var k = ri(0, 3); if (k === 0 && m % 5 === 0 && m > 0) return tstr(m / 5, (h % 12) * 5); if (k === 1) return tstr(h % 12 + 1, m); if (k === 2) return tstr(h, lv === 4 ? ri(0, 59) : (m + pick([15, 30, 45, 5, 10])) % 60); return tstr(h === 1 ? 12 : h - 1, m); });
    return { q: 'What time is it?', html: G.clockSvg(h, m), choices: c, ans: ans, why: 'The short hand shows the hour (' + h + ') and the long hand shows ' + m + ' minutes.', fact: { t: 'clock', h: h, m: m } };
  };
  G.pie = function (n, d) {
    var s = '', i, a0, a1, p = function (a) { return (100 + 88 * Math.sin(a)).toFixed(1) + ' ' + (100 - 88 * Math.cos(a)).toFixed(1); };
    if (d === 1) return '<svg class="g-svg pie" viewBox="0 0 200 200"><circle class="on" cx="100" cy="100" r="88"/></svg>';
    for (i = 0; i < d; i++) { a0 = i * 2 * Math.PI / d; a1 = (i + 1) * 2 * Math.PI / d; s += '<path class="' + (i < n ? 'on' : 'off') + '" d="M100 100 L' + p(a0) + ' A88 88 0 ' + (d === 1 ? 1 : 0) + ' 1 ' + p(a1) + ' Z"/>'; }
    return '<svg class="g-svg pie" viewBox="0 0 200 200" role="img" aria-label="A circle cut into ' + d + ' equal parts with ' + n + ' shaded">' + s + '</svg>';
  };
  GEN.fraction = function (lv) {
    var d, n, g, ans, c;
    if (lv < 3) { d = lv === 1 ? ri(2, 6) : ri(5, 12); n = ri(1, d - 1); ans = n + '/' + d; c = opts(ans, function () { var k = ri(0, 3); if (k === 0) return (d - n) + '/' + d; if (k === 1) return n + '/' + (d + 1); if (k === 2 && n > 1) return (n - 1) + '/' + d; var x = ri(1, d); return x + '/' + (x === d ? d + 1 : d); }).filter(function (x) { return x !== ans || true; });
      return { q: 'What fraction is shaded?', html: G.pie(n, d), choices: c, ans: ans, why: n + ' of the ' + d + ' equal parts are shaded: ' + ans + '.', fact: { t: 'frac', n: n, d: d, simp: false } }; }
    do { d = pick([4, 6, 8, 9, 10, 12]); n = ri(1, d - 1); g = gcd(n, d); } while (g === 1);
    ans = (n / g) + '/' + (d / g);
    c = opts(ans, function () { var a = ri(1, 5), b = ri(2, 6); if (a >= b || gcd(a, b) !== 1 || a * d === b * n) return null; return a + '/' + b; });
    return { q: 'What fraction is shaded, in its simplest form?', html: G.pie(n, d), choices: c, ans: ans, why: n + '/' + d + ' is shaded. Divide top and bottom by ' + g + ' to get ' + ans + '.', fact: { t: 'frac', n: n, d: d, simp: true } };
  };
  GEN.money = function (lv) {
    var kinds = lv === 3 ? [1, 2, 5, 10, 20, 50, 100] : [1, 2, 5, 10], cnt = lv === 1 ? ri(2, 3) : lv === 2 ? ri(3, 5) : ri(3, 6), items = [], i, sum = 0, s = '', x = 8, y = 10;
    for (i = 0; i < cnt; i++) { var v = pick(kinds); if (lv === 3 && i === 0) v = pick([20, 50, 100]); items.push(v); sum += v; }
    items.sort(function (a, b) { return b - a; });
    items.forEach(function (v) {
      var note = lv === 3 && v >= 20, w = note ? 92 : 50;
      if (x + w > 292) { x = 8; y += 60; }
      s += note ? '<g><rect class="note n' + v + '" x="' + x + '" y="' + (y + 4) + '" width="88" height="42" rx="5"/><text x="' + (x + 44) + '" y="' + (y + 31) + '" text-anchor="middle">₹' + v + '</text></g>'
        : '<g><circle class="coin" cx="' + (x + 25) + '" cy="' + (y + 25) + '" r="' + (v === 10 ? 24 : v === 5 ? 22 : v === 2 ? 21 : 19) + '"/><text x="' + (x + 25) + '" y="' + (y + 31) + '" text-anchor="middle">₹' + v + '</text></g>';
      x += w + 6;
    });
    return { q: 'How much money is this?', html: '<svg class="g-svg money" viewBox="0 0 300 ' + (y + 62) + '" role="img" aria-label="Coins and notes to add up">' + s + '</svg>', choices: opts(sum, near(sum, lv === 3 ? 30 : 6, 1)).map(function (v) { return v; }), fmt: 'rupee', ans: sum, why: items.join(' + ') + ' = ₹' + sum + '.', fact: { t: 'sum', items: items } };
  };
  GEN.equation = function (lv) {
    var a, b, c, d, x, q, why;
    if (lv === 1) { x = ri(1, 20); a = ri(1, 20); if (R() < 0.5) { q = 'x + ' + a + ' = ' + (x + a); why = 'Take ' + a + ' from both sides: x = ' + (x + a) + ' − ' + a + ' = ' + x + '.'; return eqOut(q, x, why, { form: 'x+a=b', a: a, b: x + a }); } q = 'x − ' + a + ' = ' + x; why = 'Add ' + a + ' to both sides: x = ' + x + ' + ' + a + ' = ' + (x + a) + '.'; return eqOut(q, x + a, why, { form: 'x-a=b', a: a, b: x }); }
    if (lv === 2) { x = ri(2, 12); a = ri(2, 12); if (R() < 0.6) return eqOut(a + 'x = ' + a * x, x, 'Divide both sides by ' + a + ': x = ' + a * x + ' ÷ ' + a + ' = ' + x + '.', { form: 'ax=b', a: a, b: a * x }); return eqOut('x ÷ ' + a + ' = ' + x, a * x, 'Multiply both sides by ' + a + ': x = ' + x + ' × ' + a + ' = ' + a * x + '.', { form: 'x/a=b', a: a, b: x }); }
    if (lv === 3) { x = ri(1, 12); a = ri(2, 9); b = ri(1, 20); c = a * x + b; return eqOut(a + 'x + ' + b + ' = ' + c, x, 'Take away ' + b + ': ' + a + 'x = ' + (c - b) + '. Divide by ' + a + ': x = ' + x + '.', { form: 'ax+b=c', a: a, b: b, c: c }); }
    x = ri(-6, 9); c = ri(1, 5); a = c + ri(1, 5); b = ri(1, 15); d = a * x - b - c * x;
    return eqOut(a + 'x − ' + b + ' = ' + (c === 1 ? '' : c) + 'x ' + (d < 0 ? '− ' + (-d) : '+ ' + d), x, 'Bring the x terms together: ' + (a - c) + 'x = ' + (d + b) + '. So x = ' + String(x).replace('-', '−') + '.', { form: 'ax-b=cx+d', a: a, b: b, c: c, d: d });
  };
  function eqOut(q, x, why, f) { f.t = 'eq'; return { q: 'Find x:  ' + q, choices: opts(x, near(x, 5)), ans: x, why: why, fact: f }; }
  var PCT = [[50, '1/2', '0.5'], [25, '1/4', '0.25'], [75, '3/4', '0.75'], [10, '1/10', '0.1'], [20, '1/5', '0.2'], [40, '2/5', '0.4'], [60, '3/5', '0.6'], [80, '4/5', '0.8'], [5, '1/20', '0.05'], [30, '3/10', '0.3'], [70, '7/10', '0.7'], [90, '9/10', '0.9'], [12.5, '1/8', '0.125'], [100, '1', '1.0'], [1, '1/100', '0.01']];
  GEN.percent = function (lv) {
    var r, i;
    if (lv === 2) { var p = pick([10, 20, 25, 50, 75, 5, 30, 40, 15]), base = pick([20, 40, 60, 80, 100, 120, 160, 200, 240, 300, 400]), val = p * base / 100; return { q: 'What is ' + p + '% of ' + base + '?', choices: opts(val, near(val, Math.max(6, Math.round(val * 0.4)), 1)), ans: val, why: p + '% of ' + base + ' is ' + p + ' ÷ 100 × ' + base + ' = ' + val + '.', fact: { t: 'pctof', p: p, base: base } }; }
    r = pick(lv === 1 ? PCT.slice(0, 8) : PCT); var from = lv === 1 ? 0 : ri(0, 2), to; do { to = ri(0, 2); } while (to === from);
    var lab = function (row, k) { return k === 0 ? row[0] + '%' : row[k]; }, ans = lab(r, to), c = [ans], guard = 0;
    while (c.length < 4 && guard++ < 200) { var o = pick(PCT); if (o[0] !== r[0] && c.indexOf(lab(o, to)) < 0) c.push(lab(o, to)); }
    return { q: 'Which is the same as ' + lab(r, from) + '?', choices: shuffle(c), ans: ans, why: r[0] + '% = ' + r[1] + ' = ' + r[2] + '.', fact: { t: 'pct', from: lab(r, from), choices: c.slice(), ans: ans } };
  };
  GEN.powers = function (lv) {
    var n, e;
    if (lv === 1) { n = ri(2, 12); return { q: n + '² = ?', pad: true, ans: n * n, why: n + ' × ' + n + ' = ' + n * n + '.', fact: { t: 'pow', n: n, e: 2 } }; }
    if (lv === 2) { n = ri(2, 20); return { q: '√' + n * n + ' = ?', pad: true, ans: n, why: n + ' × ' + n + ' = ' + n * n + ', so the square root of ' + n * n + ' is ' + n + '.', fact: { t: 'root', v: n * n, e: 2 } }; }
    if (lv === 3) { n = ri(2, 10); if (R() < 0.5) return { q: n + '³ = ?', pad: true, ans: n * n * n, why: n + ' × ' + n + ' × ' + n + ' = ' + n * n * n + '.', fact: { t: 'pow', n: n, e: 3 } }; return { q: '∛' + n * n * n + ' = ?', pad: true, ans: n, why: n + ' × ' + n + ' × ' + n + ' = ' + n * n * n + ', so the cube root is ' + n + '.', fact: { t: 'root', v: n * n * n, e: 3 } }; }
    n = pick([2, 2, 3, 5, 10]); e = n === 2 ? ri(3, 10) : n === 10 ? ri(2, 5) : ri(2, 4); var sup = '⁰¹²³⁴⁵⁶⁷⁸⁹', es = String(e).split('').map(function (ch) { return sup[+ch]; }).join('');
    return { q: n + es + ' = ?', pad: true, ans: Math.pow(n, e), why: n + ' multiplied by itself ' + e + ' times is ' + Math.pow(n, e) + '.', fact: { t: 'pow', n: n, e: e } };
  };
  G.angleSvg = function (deg) {
    var a = deg * Math.PI / 180, x = 110 + 95 * Math.cos(a), y = 150 - 95 * Math.sin(a), ax = 110 + 28 * Math.cos(a), ay = 150 - 28 * Math.sin(a);
    return '<svg class="g-svg angle" viewBox="0 0 220 180" role="img" aria-label="An angle to estimate"><path class="arc" d="M138 150 A28 28 0 ' + (deg > 180 ? 1 : 0) + ' 0 ' + ax.toFixed(1) + ' ' + ay.toFixed(1) + '"/><line x1="110" y1="150" x2="205" y2="150"/><line x1="110" y1="150" x2="' + x.toFixed(1) + '" y2="' + y.toFixed(1) + '"/><circle cx="110" cy="150" r="4"/></svg>';
  };
  GEN.angle = function (lv) {
    var step = lv === 1 ? 30 : lv === 2 ? 15 : 10, gap = lv === 1 ? 30 : lv === 2 ? 30 : 20, deg = ri(1, Math.floor(170 / step)) * step, c = [deg], guard = 0;
    if (lv === 1 && R() < 0.3) deg = pick([45, 90, 135]); c = [deg];
    while (c.length < 4 && guard++ < 300) { var w = deg + pick([-3, -2, -1, 1, 2, 3]) * gap; if (w >= 10 && w <= 175 && c.indexOf(w) < 0) c.push(w); }
    guard = 0; while (c.length < 4 && guard++ < 300) { var w2 = ri(1, 17) * 10; if (Math.abs(w2 - deg) >= gap && c.every(function (v) { return Math.abs(v - w2) >= 10; })) c.push(w2); }
    var kind = deg < 90 ? 'an acute angle (less than 90°)' : deg === 90 ? 'a right angle' : 'an obtuse angle (more than 90°)';
    return { q: 'About how big is this angle?', html: G.angleSvg(deg), choices: shuffle(c), fmt: 'deg', ans: deg, why: 'It is ' + deg + '°, ' + kind + '.', fact: { t: 'angle', deg: deg } };
  };
  /* special games: each returns a puzzle with a fact for the build to check */
  GEN.catch = function (lv) {
    var kind = lv === 1 ? pick(['even', 'mult']) : lv === 2 ? pick(['mult', 'factor']) : pick(['prime', 'factor', 'square']), k = kind === 'mult' ? pick(lv === 1 ? [2, 5, 10] : [3, 4, 6, 7, 8, 9]) : pick([24, 30, 36, 48, 60, 72, 100]), max = kind === 'factor' ? k : kind === 'mult' ? Math.max(50, k * 10) : lv === 1 ? 50 : 100, has, rule, nums = [], good = [], guard = 0, n;
    if (kind === 'even') { has = function (x) { return x % 2 === 0; }; rule = 'Tap all the even numbers'; }
    else if (kind === 'mult') { has = function (x) { return x % k === 0; }; rule = 'Tap all the multiples of ' + k; }
    else if (kind === 'factor') { has = function (x) { return k % x === 0; }; rule = 'Tap all the factors of ' + k; }
    else if (kind === 'prime') { has = isPrime; rule = 'Tap all the prime numbers'; }
    else { has = function (x) { var r = Math.round(Math.sqrt(x)); return r * r === x; }; rule = 'Tap all the square numbers'; max = 144; }
    var want = ri(4, 6);
    while (nums.length < 12 && guard++ < 20000) { n = ri(1, max); if (nums.indexOf(n) > -1) continue; var g = has(n); if (g && good.length < want) { nums.push(n); good.push(n); } else if (!g && nums.length - good.length < 12 - want) nums.push(n); }
    return { rule: rule, nums: shuffle(nums), good: good.sort(function (a, b) { return a - b; }), fact: { t: 'catch', kind: kind, k: k } };
  };
  GEN.maketen = function (lv) {
    var target = lv === 1 ? 10 : lv === 2 ? 20 : 100, nums = [], i;
    for (i = 0; i < 6; i++) { var a = lv === 3 ? ri(1, 19) * 5 : ri(1, target - 1); nums.push(a, target - a); }
    return { target: target, nums: shuffle(nums), fact: { t: 'pairs', target: target } };
  };
  GEN.memory = function (lv) {
    var pairs = [], vals = {}, guard = 0;
    while (pairs.length < 6 && guard++ < 2000) { var x = arith(lv === 1 ? 1 : lv === 2 ? 2 : 3); if (vals[x[3]]) continue; vals[x[3]] = 1; pairs.push([x[0] + ' ' + x[1] + ' ' + x[2], x[3]]); }
    var cards = []; pairs.forEach(function (p, i) { cards.push({ k: i, t: p[0] }, { k: i, t: String(p[1]) }); });
    return { cards: shuffle(cards), pairs: pairs, fact: { t: 'match' } };
  };
  GEN.target = function (lv) {
    var guard = 0;
    for (;;) {
      var n = lv === 3 ? 4 : 3, nums = [], i, cur, steps = [], pool, ok = true;
      for (i = 0; i < n; i++) nums.push(ri(1, lv === 1 ? 9 : 10));
      pool = nums.map(function (v, j) { return { v: v, id: j }; }); var nextId = n;
      while (pool.length > 1 && ok) {
        var a = pool.splice(ri(0, pool.length - 1), 1)[0], b = pool.splice(ri(0, pool.length - 1), 1)[0], op = pick(lv === 1 ? ['+', '−'] : lv === 2 ? ['+', '−', '×'] : ['+', '−', '×', '÷']);
        if (op === '−' && a.v < b.v) { var t = a; a = b; b = t; }
        var r = OPS[op](a.v, b.v); if (isNaN(r) || r < 0 || r > 200 || (op === '÷' && b.v === 1) || (op === '×' && (a.v === 1 || b.v === 1))) { ok = false; break; }
        steps.push([a.v, op, b.v, r]); pool.push({ v: r, id: nextId++ });
      }
      if (ok && pool[0].v >= (lv === 1 ? 1 : 5) && pool[0].v <= (lv === 1 ? 25 : 100) && nums.indexOf(pool[0].v) < 0) return { nums: nums, target: pool[0].v, sol: steps, ops: lv === 1 ? ['+', '−'] : lv === 2 ? ['+', '−', '×'] : ['+', '−', '×', '÷'], fact: { t: 'target' } };
      if (guard++ > 5000) return { nums: [2, 3, 4], target: 9, sol: [[2, '+', 3, 5], [5, '+', 4, 9]], ops: ['+', '−'], fact: { t: 'target' } };
    }
  };
  GEN.magic = function (lv) {
    var b = [8, 1, 6, 3, 5, 7, 4, 9, 2], i, k, g = b.slice(), t;
    for (k = ri(0, 3); k > 0; k--) { t = g.slice(); for (i = 0; i < 9; i++) g[(i % 3) * 3 + 2 - Math.floor(i / 3)] = t[i]; }
    if (R() < 0.5) { t = g.slice(); for (i = 0; i < 9; i++) g[Math.floor(i / 3) * 3 + 2 - i % 3] = t[i]; }
    var off = lv === 3 ? ri(1, 10) : 0, mul = lv === 3 && R() < 0.4 ? 2 : 1; g = g.map(function (v) { return v * mul + off; });
    var blanks = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8]).slice(0, lv === 1 ? 4 : 5), given = g.map(function (v, j) { return blanks.indexOf(j) < 0; });
    return { grid: g, given: given, sum: g[0] + g[1] + g[2], fact: { t: 'magic' } };
  };
  G.GEN = GEN;
  G.make = function (id, lv) { return GEN[id](lv); };
  G.magicOk = function (g, sum) { var L = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]; return L.every(function (l) { return g[l[0]] + g[l[1]] + g[l[2]] === sum; }); };
  if (typeof module !== 'undefined') { module.exports = G; return; }

  /* ---------------------------------------------------------------- play ---------------------------------------------------------------- */
  var d = document, box = d.querySelector('[data-game]');
  if (!box) return;
  var id = box.getAttribute('data-game'), levels = JSON.parse(box.getAttribute('data-levels')), SPECIAL = { catch: 1, maketen: 1, memory: 1, target: 1, magic: 1 }, st = {};
  function el(html) { var t = d.createElement('div'); t.innerHTML = html; return t.firstChild; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function fmt(v, f) { return f === 'rupee' ? '₹' + v : f === 'deg' ? v + '°' : f === 'comma' ? comma(v) : String(v).replace(/^-/, '−'); }
  function get(k) { try { return JSON.parse(localStorage.getItem('mg-' + id + '-' + k)); } catch (e) { return null; } }
  function put(k, v) { try { localStorage.setItem('mg-' + id + '-' + k, JSON.stringify(v)); } catch (e) {} }
  function stars(n) { return '<span class="stars" aria-label="' + n + ' of 3 stars">' + '★★★'.slice(0, n) + '<i>' + '★★★'.slice(n) + '</i></span>'; }

  function setup() {
    var lv = get('lv') || 1, race = get('race') || false;
    if (lv > levels.length) lv = 1;
    box.innerHTML = '<div class="g-setup"><p class="g-lab">Choose a level</p><div class="g-levels">' + levels.map(function (l, i) { return '<button type="button" data-lv="' + (i + 1) + '" aria-pressed="' + (i + 1 === lv) + '"><b>Level ' + (i + 1) + '</b><span>' + esc(l) + '</span>' + (get('best' + (i + 1)) ? '<em>Best: ' + get('best' + (i + 1)) + '</em>' : '') + '</button>'; }).join('') + '</div>' +
      (SPECIAL[id] ? '' : '<p class="g-lab">How to play</p><div class="g-modes"><button type="button" data-race="0" aria-pressed="' + !race + '"><b>Relaxed</b><span>10 questions, no clock</span></button><button type="button" data-race="1" aria-pressed="' + !!race + '"><b>Race</b><span>As many as you can in 60 seconds</span></button></div>') +
      '<button type="button" class="btn g-start">Start</button></div>';
    box.onclick = function (e) {
      var b = e.target.closest('button'); if (!b) return;
      if (b.hasAttribute('data-lv')) { lv = +b.getAttribute('data-lv'); put('lv', lv); [].forEach.call(box.querySelectorAll('[data-lv]'), function (x) { x.setAttribute('aria-pressed', x === b); }); }
      else if (b.hasAttribute('data-race')) { race = b.getAttribute('data-race') === '1'; put('race', race); [].forEach.call(box.querySelectorAll('[data-race]'), function (x) { x.setAttribute('aria-pressed', x === b); }); }
      else if (b.classList.contains('g-start')) { box.onclick = null; st = { lv: lv, race: race, n: 0, right: 0, wrong: [], t0: Date.now() }; (SPECIAL[id] ? special : quiz)(); }
    };
  }

  function finish(score, total, extra, wrong, slips) {
    clearInterval(st.timer); d.onkeydown = null;
    var pct = total ? score / total : 0, s = st.race ? (score >= 15 ? 3 : score >= 8 ? 2 : score >= 3 ? 1 : 0) : (pct >= 0.9 ? 3 : pct >= 0.7 ? 2 : pct >= 0.4 ? 1 : 0), key = 'best' + st.lv, old = get(key), label = st.race ? score + ' in 60 s' : score + ' / ' + total, better;
    if (slips !== undefined && s > 0) s = Math.max(1, Math.min(s, slips <= 2 ? 3 : slips <= 6 ? 2 : 1));
    var oldNum = old ? parseInt(old, 10) : -1; better = score > oldNum || (score === oldNum && old && !st.race && /\//.test(old) === false);
    if (!old || score > oldNum) put(key, label);
    var h = '<div class="g-done"><p class="g-big">' + (s === 3 ? 'Excellent!' : s === 2 ? 'Well done!' : s === 1 ? 'Good try!' : 'Keep practising!') + '</p>' + stars(s) + '<p class="g-score">' + label + '</p>' + (extra ? '<p>' + extra + '</p>' : '') +
      (!old || score > oldNum ? '<p class="g-new">A new best for this level.</p>' : '<p>Your best for this level: ' + esc(old) + '</p>');
    if (wrong && wrong.length) h += '<div class="g-review"><p class="g-lab">Look at these again</p><ul>' + wrong.slice(0, 8).map(function (w) { return '<li>' + esc(w) + '</li>'; }).join('') + '</ul></div>';
    h += '<div class="g-btns"><button type="button" class="btn g-again">Play again</button><button type="button" class="btn ghost g-menu">Change level</button></div></div>';
    box.innerHTML = h;
    box.querySelector('.g-again').onclick = function () { st = { lv: st.lv, race: st.race, n: 0, right: 0, wrong: [], t0: Date.now() }; (SPECIAL[id] ? special : quiz)(); };
    box.querySelector('.g-menu').onclick = setup;
  }

  function quiz() {
    var total = 10, q, typed = '', lock = false;
    box.innerHTML = '<div class="g-play"><div class="g-top"><span class="g-count"></span><span class="g-clock"></span><button type="button" class="g-quit" aria-label="Stop the game">Stop</button></div><p class="g-q" aria-live="polite"></p><div class="g-pic"></div><div class="g-ans"></div><p class="g-fb" aria-live="polite">&nbsp;</p></div>';
    var $ = function (s) { return box.querySelector(s); };
    $('.g-quit').onclick = function () { finish(st.right, st.race ? st.n : Math.max(st.n, 1), '', st.wrong); };
    if (st.race) { var end = Date.now() + 60000; st.timer = setInterval(function () { var left = Math.max(0, Math.ceil((end - Date.now()) / 1000)); $('.g-clock').textContent = left + ' s'; if (left <= 0) finish(st.right, st.n, '', st.wrong); }, 250); }
    function next() {
      if (!st.race && st.n >= total) return finish(st.right, total, '', st.wrong);
      q = G.make(id, st.lv); typed = ''; lock = false; st.n++;
      $('.g-count').textContent = st.race ? 'Right: ' + st.right : 'Question ' + st.n + ' of ' + total;
      $('.g-q').textContent = q.q; $('.g-pic').innerHTML = q.html || ''; $('.g-fb').innerHTML = '&nbsp;'; $('.g-fb').className = 'g-fb';
      if (q.pad) $('.g-ans').innerHTML = '<p class="g-typed">&nbsp;</p><div class="g-pad">' + [1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (k) { return '<button type="button" data-k="' + k + '">' + k + '</button>'; }).join('') + '<button type="button" data-k="' + (q.neg ? 'neg' : 'del') + '">' + (q.neg ? '−' : '⌫') + '</button><button type="button" data-k="0">0</button><button type="button" data-k="ok" class="ok">OK</button>' + (q.neg ? '<button type="button" data-k="del" class="wide">⌫ Delete</button>' : '') + '</div>';
      else $('.g-ans').innerHTML = '<div class="g-choices' + (q.wide ? ' two' : q.choices.length === 2 ? ' two' : '') + '">' + q.choices.map(function (c, i) { return '<button type="button" data-i="' + i + '">' + esc(fmt(c, q.fmt)) + '</button>'; }).join('') + '</div>';
    }
    function judge(ok, btn) {
      lock = true; var fb = $('.g-fb');
      if (ok) { st.right++; fb.textContent = 'Right!'; fb.className = 'g-fb good'; if (btn) btn.classList.add('good'); }
      else { fb.textContent = q.why; fb.className = 'g-fb bad'; if (btn) btn.classList.add('bad'); st.wrong.push(q.pad ? q.q.replace(' = ?', '') + ' = ' + fmt(q.ans, q.fmt) : (q.html || /^Tap the|^Three of/.test(q.q)) ? q.why : q.q.replace(',  ?', '') + ' → ' + fmt(q.ans, q.fmt)); [].forEach.call(box.querySelectorAll('.g-choices button'), function (b) { if (q.choices[+b.getAttribute('data-i')] === q.ans) b.classList.add('good'); }); }
      if (st.race) $('.g-count').textContent = 'Right: ' + st.right;
      setTimeout(next, ok ? 550 : st.race ? 1500 : 2600);
    }
    function press(k) {
      if (lock) return;
      if (k === 'del') typed = typed.slice(0, -1); else if (k === 'neg') typed = typed.charAt(0) === '-' ? typed.slice(1) : '-' + typed; else if (k === 'ok') { if (typed === '' || typed === '-') return; return judge(+typed === q.ans); } else if (typed.replace('-', '').length < 6) typed += k;
      $('.g-typed').textContent = typed.replace('-', '−') || ' ';
    }
    $('.g-ans').addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b || lock) return;
      if (b.hasAttribute('data-k')) press(b.getAttribute('data-k')); else judge(q.choices[+b.getAttribute('data-i')] === q.ans, b);
    });
    d.onkeydown = function (e) { if (!q || !q.pad) return; if (/^[0-9]$/.test(e.key)) press(e.key); else if (e.key === 'Backspace') { press('del'); e.preventDefault(); } else if (e.key === 'Enter') { press('ok'); e.preventDefault(); } else if (e.key === '-' && q.neg) press('neg'); };
    next();
  }

  function special() {
    var round = 0, rounds = id === 'memory' || id === 'magic' ? 1 : id === 'target' ? 5 : 3, slips = 0, solved = 0;
    function top(msg) { return '<div class="g-top"><span class="g-count">' + (rounds > 1 ? 'Round ' + (round + 1) + ' of ' + rounds : '') + '</span><span class="g-clock"></span><button type="button" class="g-quit">Stop</button></div><p class="g-q">' + msg + '</p>'; }
    function done() { var secs = Math.round((Date.now() - st.t0) / 1000), total = rounds; st.race = false; finish(solved, total, 'Time: ' + secs + ' seconds. Slips: ' + slips + '.', [], slips); }
    function quit() { box.querySelector('.g-quit').onclick = done; }
    function nextRound() { round++; if (round >= rounds) done(); else play(); }
    function play() {
      var p = G.make(id, st.lv);
      if (id === 'catch') {
        var left = p.good.length;
        box.innerHTML = '<div class="g-play">' + top(esc(p.rule)) + '<div class="g-grid">' + p.nums.map(function (n) { return '<button type="button" data-n="' + n + '">' + n + '</button>'; }).join('') + '</div><p class="g-fb">' + left + ' to find</p></div>'; quit();
        box.querySelector('.g-grid').onclick = function (e) { var b = e.target.closest('button'); if (!b || b.disabled) return; var n = +b.getAttribute('data-n'); if (p.good.indexOf(n) > -1) { b.classList.add('good'); b.disabled = true; left--; box.querySelector('.g-fb').textContent = left ? left + ' to find' : 'All found!'; if (!left) { solved++; setTimeout(nextRound, 900); } } else { b.classList.add('bad'); b.disabled = true; slips++; } };
      } else if (id === 'maketen') {
        var first = null, remain = p.nums.length;
        box.innerHTML = '<div class="g-play">' + top('Tap two numbers that make ' + p.target) + '<div class="g-grid">' + p.nums.map(function (n, i) { return '<button type="button" data-i="' + i + '">' + n + '</button>'; }).join('') + '</div><p class="g-fb">&nbsp;</p></div>'; quit();
        box.querySelector('.g-grid').onclick = function (e) {
          var b = e.target.closest('button'); if (!b || b.disabled) return;
          if (!first) { first = b; b.classList.add('sel'); return; } if (first === b) { b.classList.remove('sel'); first = null; return; }
          var x = +first.textContent, y = +b.textContent, fb = box.querySelector('.g-fb');
          if (x + y === p.target) { first.classList.remove('sel'); first.classList.add('good'); b.classList.add('good'); first.disabled = b.disabled = true; remain -= 2; fb.textContent = x + ' + ' + y + ' = ' + p.target; fb.className = 'g-fb good'; if (!remain) { solved++; setTimeout(nextRound, 900); } }
          else { slips++; fb.textContent = x + ' + ' + y + ' = ' + (x + y) + ', not ' + p.target; fb.className = 'g-fb bad'; first.classList.remove('sel'); }
          first = null;
        };
      } else if (id === 'memory') {
        var open = [], pairsLeft = 6, busy = false, turns = 0;
        box.innerHTML = '<div class="g-play">' + top('Turn over two cards. Match each sum with its answer.') + '<div class="g-grid mem">' + p.cards.map(function (c, i) { return '<button type="button" data-i="' + i + '" aria-label="Card"><span>?</span></button>'; }).join('') + '</div><p class="g-fb">&nbsp;</p></div>'; quit();
        box.querySelector('.g-grid').onclick = function (e) {
          var b = e.target.closest('button'); if (!b || busy || b.disabled || b.classList.contains('up')) return;
          var c = p.cards[+b.getAttribute('data-i')]; b.classList.add('up'); b.firstChild.textContent = c.t; open.push([b, c]);
          if (open.length < 2) return; turns++; busy = true;
          var a = open[0], z = open[1]; open = [];
          if (a[1].k === z[1].k) { a[0].classList.add('good'); z[0].classList.add('good'); a[0].disabled = z[0].disabled = true; busy = false; pairsLeft--; box.querySelector('.g-fb').textContent = pairsLeft ? pairsLeft + ' pairs left' : 'All matched in ' + turns + ' turns!'; if (!pairsLeft) { solved = 1; slips = Math.max(0, turns - 6); setTimeout(done, 1000); } }
          else setTimeout(function () { [a, z].forEach(function (o) { o[0].classList.remove('up'); o[0].firstChild.textContent = '?'; }); busy = false; }, 1100);
        };
      } else if (id === 'target') {
        var tiles, selA = null, selOp = null, hist = [];
        var draw = function (msg, cls) {
          box.innerHTML = '<div class="g-play">' + top('Make <b>' + p.target + '</b> using every number once') + '<div class="g-tiles">' + tiles.map(function (v, i) { return '<button type="button" data-i="' + i + '" class="' + (selA === i ? 'sel' : '') + '">' + v + '</button>'; }).join('') + '</div><div class="g-ops">' + p.ops.map(function (o) { return '<button type="button" data-op="' + o + '" class="' + (selOp === o ? 'sel' : '') + '">' + o + '</button>'; }).join('') + '</div>' +
            '<p class="g-fb ' + (cls || '') + '">' + (msg || 'Tap a number, a sign, then another number.') + '</p><div class="g-btns"><button type="button" class="btn sm ghost" data-act="undo">Start this one again</button><button type="button" class="btn sm ghost" data-act="skip">Show the answer</button></div></div>'; quit();
        };
        var reset = function () { tiles = p.nums.slice(); selA = selOp = null; hist = []; };
        reset(); draw();
        box.onclick = function (e) {
          var b = e.target.closest('button'); if (!b) return;
          if (b.getAttribute('data-act') === 'undo') { reset(); return draw(); }
          if (b.getAttribute('data-act') === 'skip') { slips++; box.onclick = null; box.querySelector('.g-fb').textContent = 'One way: ' + p.sol.map(function (s) { return s[0] + ' ' + s[1] + ' ' + s[2] + ' = ' + s[3]; }).join(', then '); box.querySelector('.g-fb').className = 'g-fb bad'; box.querySelector('.g-btns').innerHTML = '<button type="button" class="btn sm">Next</button>'; box.querySelector('.g-btns button').onclick = nextRound; return; }
          if (b.hasAttribute('data-op')) { if (selA === null) return; selOp = b.getAttribute('data-op'); return draw(); }
          if (!b.hasAttribute('data-i')) return;
          var i = +b.getAttribute('data-i');
          if (selA === null || selOp === null) { selA = selA === i ? null : i; selOp = null; return draw(); }
          if (i === selA) return;
          var r = OPS[selOp](tiles[selA], tiles[i]);
          if (isNaN(r) || r < 0) { var m = selOp === '÷' ? 'That does not divide exactly.' : 'That would go below zero.'; selOp = null; return draw(m, 'bad'); }
          var line = tiles[selA] + ' ' + selOp + ' ' + tiles[i] + ' = ' + r; tiles = tiles.filter(function (v, j) { return j !== selA && j !== i; }); tiles.push(r); selA = selOp = null;
          if (tiles.length === 1) { if (tiles[0] === p.target) { solved++; draw(line + '. You made ' + p.target + '!', 'good'); box.onclick = null; setTimeout(nextRound, 1100); } else { slips++; var got = tiles[0]; reset(); draw('That made ' + got + ', not ' + p.target + '. Try again.', 'bad'); } return; }
          draw(line);
        };
      } else if (id === 'magic') {
        var g = p.grid.map(function (v, i) { return p.given[i] ? v : null; }), cur = null, typed = '';
        var paint = function (msg, cls) {
          box.innerHTML = '<div class="g-play">' + top('Fill the empty boxes so that every row, column and diagonal adds up to <b>' + p.sum + '</b>') + '<div class="g-magic">' + g.map(function (v, i) { return '<button type="button" data-i="' + i + '" class="' + (p.given[i] ? 'given' : '') + (cur === i ? ' sel' : '') + '"' + (p.given[i] ? ' disabled' : '') + '>' + (cur === i && typed ? typed : v === null ? '' : v) + '</button>'; }).join('') + '</div>' +
            '<div class="g-pad small">' + [1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (k) { return '<button type="button" data-k="' + k + '">' + k + '</button>'; }).join('') + '<button type="button" data-k="del">⌫</button><button type="button" data-k="0">0</button><button type="button" data-k="ok" class="ok">OK</button></div><p class="g-fb ' + (cls || '') + '">' + (msg || 'Tap an empty box, then tap the number and OK.') + '</p></div>'; quit();
        };
        paint();
        box.onclick = function (e) {
          var b = e.target.closest('button'); if (!b) return;
          if (b.hasAttribute('data-i')) { cur = +b.getAttribute('data-i'); typed = ''; return paint(); }
          if (!b.hasAttribute('data-k') || cur === null) return;
          var k = b.getAttribute('data-k');
          if (k === 'del') { typed = typed.slice(0, -1); if (!typed) g[cur] = null; return paint(); }
          if (k !== 'ok') { if (typed.length < 2) typed += k; return paint(); }
          if (!typed) return; g[cur] = +typed; cur = null; typed = '';
          if (g.indexOf(null) > -1) return paint();
          if (G.magicOk(g, p.sum)) { solved = 1; paint('Every line adds up to ' + p.sum + '. Solved!', 'good'); box.onclick = null; setTimeout(done, 1200); }
          else { slips++; paint('Not yet. Check each row, column and diagonal: all must add up to ' + p.sum + '.', 'bad'); }
        };
      }
    }
    play();
  }
  setup();
})();
