/* learn.shareyourgroup.com/magic: the number and logic tricks worked out step by step. The pure functions come first (the build runs them in Node and checks them against separate Python code on every input);
   the page code comes after. Nothing is sent anywhere. */
(function () {
  'use strict';
  var M = {};
  function digs(n) { return String(n).split('').map(Number); }
  function sum(a) { return a.reduce(function (x, y) { return x + y; }, 0); }
  function rev(s) { return String(s).split('').reverse().join(''); }
  function isInt(n, lo, hi) { return typeof n === 'number' && isFinite(n) && Math.floor(n) === n && n >= lo && n <= hi; }

  /* Think of a number: always 5 */
  M.think = function (n) {
    if (!isInt(n, 0, 9999)) return { valid: false, why: 'Type a whole number from 0 to 9999.' };
    return { valid: true, steps: [['Think of a number', n], ['Double it', 2 * n], ['Add 10', 2 * n + 10], ['Halve it', n + 5], ['Take away the number you started with', 5]], final: 5 };
  };
  /* 1089: three digits whose first and last digits differ */
  M.t1089 = function (n) {
    if (!isInt(n, 100, 999)) return { valid: false, why: 'Type a number with three digits (100 to 999).' };
    var s = String(n);
    if (s[0] === s[2]) return { valid: false, why: 'The first and the last digit must be different.' };
    var r = parseInt(rev(s), 10), d = Math.abs(n - r), ds = ('000' + d).slice(-3), rd = parseInt(rev(ds), 10);
    return { valid: true, steps: [['Your number', n], ['Reversed', r], ['Big take away small', d], ['That answer reversed (with a zero in front if it has two digits)', rd], ['Add the last two answers', d + rd]], final: d + rd };
  };
  /* Always nine */
  M.nine = function (n) {
    if (!isInt(n, 10, 99)) return { valid: false, why: 'Type a number with two digits (10 to 99).' };
    var ds = sum(digs(n)), r = n - ds, f = sum(digs(r));
    return { valid: true, steps: [['Your number', n], ['Add its two digits', ds], ['Take that away from your number', r], ['Add the digits of the answer', f]], final: f };
  };
  /* Missing digit: n and a shuffled copy, subtract, hide one non-zero digit of the answer */
  M.missing = function (a, b, pos) {
    var sa = String(a), sb = String(b);
    if (!/^[1-9]\d{2,8}$/.test(sa) || !/^[1-9]\d{2,8}$/.test(sb)) return { valid: false, why: 'Type two numbers with 3 to 9 digits, not starting with 0.' };
    if (sa.split('').sort().join('') !== sb.split('').sort().join('')) return { valid: false, why: 'The second number must use exactly the same digits as the first, in a different order.' };
    var d = Math.abs(parseInt(sa, 10) - parseInt(sb, 10));
    if (d === 0) return { valid: false, why: 'The two numbers must be different.' };
    var ds = String(d), p = pos - 1;
    if (!isInt(pos, 1, ds.length)) return { valid: false, why: 'The answer is ' + d + ', which has ' + ds.length + ' digits. Choose a place from 1 to ' + ds.length + '.' };
    if (ds[p] === '0') return { valid: false, why: 'Hide a digit that is not 0.' };
    var others = sum(digs(ds)) - Number(ds[p]), m = (9 - others % 9) % 9;
    if (m === 0) m = 9;
    return { valid: true, steps: [['Big number take away small number', d], ['Digit you hide', Number(ds[p])], ['Add the other digits', others], ['Missing digit: the number that makes the total a multiple of 9', m]], final: m };
  };
  /* 1001: a three digit number written twice, divided by 7, 11 and 13 */
  M.t1001 = function (n) {
    if (!isInt(n, 100, 999)) return { valid: false, why: 'Type a number with three digits (100 to 999).' };
    var big = parseInt(String(n) + String(n), 10);
    return { valid: true, steps: [['Your number', n], ['Written twice', big], ['Divide by 7', big / 7], ['Divide by 11', big / 77], ['Divide by 13', big / 1001]], final: big / 1001 };
  };
  /* birthday: the month and day come back in the answer */
  M.birthday = function (m, d) {
    var dim = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (!isInt(m, 1, 12) || !isInt(d, 1, 31) || d > dim[m - 1]) return { valid: false, why: 'Type a real month number (1 to 12) and day.' };
    var x = m * 5; x += 6; x *= 4; x += 9; x *= 5; x += d; x -= 165;
    return { valid: true, steps: [['Month number', m], ['Times 5', m * 5], ['Add 6', m * 5 + 6], ['Times 4', (m * 5 + 6) * 4], ['Add 9', (m * 5 + 6) * 4 + 9], ['Times 5', ((m * 5 + 6) * 4 + 9) * 5], ['Add the day of the month', ((m * 5 + 6) * 4 + 9) * 5 + d], ['Take away 165', x]], final: x, month: Math.floor(x / 100), day: x % 100 };
  };
  /* coins: left x2 plus right x3: even total means an even number in the right hand */
  M.coins = function (left, right) {
    if (!isInt(left, 0, 99) || !isInt(right, 0, 99)) return { valid: false, why: 'Type whole numbers from 0 to 99.' };
    var t = left * 2 + right * 3;
    return { valid: true, steps: [['Left hand times 2', left * 2], ['Right hand times 3', right * 3], ['Add them', t]], final: t, rightEven: t % 2 === 0 };
  };
  /* calendar: the smallest of nine dates in a 3 by 3 square; start = weekday of the 1st (0 Monday ... 6 Sunday) */
  M.calendar = function (len, start, s) {
    if (!isInt(len, 28, 31) || !isInt(start, 0, 6) || !isInt(s, 1, 31)) return { valid: false, why: 'Type the length of the month (28 to 31), the weekday of the 1st and a date.' };
    var col = (start + s - 1) % 7;
    if (col > 4 || s + 16 > len) return { valid: false, why: 'A 3 by 3 square cannot start at that date: it would run off the side or the end of the month.' };
    var cells = [s, s + 1, s + 2, s + 7, s + 8, s + 9, s + 14, s + 15, s + 16];
    return { valid: true, cells: cells, steps: [['Smallest date', s], ['Add 8 to find the middle date', s + 8], ['Times 9', 9 * (s + 8)]], final: 9 * (s + 8), total: sum(cells) };
  };
  /* magician's choice: three objects 0,1,2; you want target T; the audience points to a pair, then to one of the pair */
  M.choice = function (T, pair, x) {
    if (!isInt(T, 0, 2) || !Array.isArray(pair) || pair.length !== 2 || pair[0] === pair[1] || pair.some(function (v) { return !isInt(v, 0, 2); })) return { valid: false, why: 'Pick two different objects.' };
    var lines = [];
    if (pair.indexOf(T) < 0) { lines.push('Say: "We put those two away and keep the last one." The last one is your target.'); return { valid: true, lines: lines, final: T }; }
    lines.push('Say: "We keep those two and put the third away." Your target is one of the two.');
    if (pair.indexOf(x) < 0) return { valid: false, why: 'The second choice must be one of the two kept objects.' };
    lines.push(x === T ? 'They point to the target. Say: "That is the one you chose."' : 'They point to the other one. Say: "We put that one away, so the one left is your choice."');
    return { valid: true, lines: lines, final: T };
  };
  /* mind-reading cards: card i holds every number from 1 to 31 that has the bit 2^i; the guess adds the first numbers of the cards with a yes */
  M.card = function (i) { var o = []; for (var n = 1; n <= 31; n++) if ((n >> i) & 1) o.push(n); return o; };
  M.guess = function (yes) { var t = 0; yes.forEach(function (i) { t += 1 << i; }); return t; };
  if (typeof module !== 'undefined' && module.exports) { module.exports = M; return; }
  window.MAGIC = M;

  var d = document;
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function inp(id, label, val, min, max) { return '<label>' + esc(label) + '<input type="number" inputmode="numeric" id="' + id + '" value="' + val + '" min="' + min + '" max="' + max + '"></label>'; }
  var DEMOS = {
    think: { title: 'Think of a number', form: function (k) { return inp(k + 'a', 'Your number', 7, 0, 9999); }, run: function (k) { return M.think(num(k + 'a')); } },
    t1089: { title: '1089', form: function (k) { return inp(k + 'a', 'A number with three digits, first and last different', 832, 100, 999); }, run: function (k) { return M.t1089(num(k + 'a')); } },
    nine: { title: 'Always nine', form: function (k) { return inp(k + 'a', 'A number with two digits', 47, 10, 99); }, run: function (k) { return M.nine(num(k + 'a')); } },
    missing: { title: 'Missing digit', form: function (k) { return inp(k + 'a', 'A number (3 to 9 digits)', 7482, 100, 999999999) + inp(k + 'b', 'The same digits shuffled', 2847, 100, 999999999) + inp(k + 'c', 'Which place to hide, from the left', 2, 1, 9); }, run: function (k) { return M.missing(num(k + 'a'), num(k + 'b'), num(k + 'c')); } },
    t1001: { title: '1001', form: function (k) { return inp(k + 'a', 'A number with three digits', 538, 100, 999); }, run: function (k) { return M.t1001(num(k + 'a')); } },
    birthday: { title: 'Birthday', form: function (k) { return inp(k + 'a', 'Birth month (1 to 12)', 3, 1, 12) + inp(k + 'b', 'Day of the month', 15, 1, 31); }, run: function (k) { var r = M.birthday(num(k + 'a'), num(k + 'b')); if (r.valid) r.after = 'The answer ' + r.final + ' reads as month ' + r.month + ', day ' + r.day + '.'; return r; } },
    coins: { title: 'Coins', form: function (k) { return inp(k + 'a', 'Coins in the left hand', 4, 0, 99) + inp(k + 'b', 'Coins in the right hand', 3, 0, 99); }, run: function (k) { var r = M.coins(num(k + 'a'), num(k + 'b')); if (r.valid) r.after = 'The total is ' + (r.rightEven ? 'even, so the right hand holds an even number of coins.' : 'odd, so the right hand holds an odd number of coins.'); return r; } },
    calendar: { title: 'Calendar square', form: function (k) { return inp(k + 'a', 'Days in the month', 30, 28, 31) + '<label>First of the month falls on<select id="' + k + 'b"><option value="0">Monday</option><option value="1">Tuesday</option><option value="2">Wednesday</option><option value="3">Thursday</option><option value="4">Friday</option><option value="5">Saturday</option><option value="6">Sunday</option></select></label>' + inp(k + 'c', 'Smallest date in the square', 9, 1, 31); }, run: function (k) { var r = M.calendar(num(k + 'a'), num(k + 'b'), num(k + 'c')); if (r.valid) r.after = 'The nine dates are ' + r.cells.join(', ') + ', and they really add up to ' + r.total + '.'; return r; } },
    choice: { title: "Magician's choice", form: function (k) { return '<label>Object you want chosen<select id="' + k + 'a"><option value="0">First</option><option value="1">Second</option><option value="2">Third</option></select></label><label>Two the audience points to<select id="' + k + 'b"><option value="0,1">First and second</option><option value="0,2">First and third</option><option value="1,2">Second and third</option></select></label><label>Then they point to<select id="' + k + 'c"><option value="0">The lower one</option><option value="1">The higher one</option></select></label>'; }, run: function (k) { var p = d.getElementById(k + 'b').value.split(',').map(Number); var r = M.choice(num(k + 'a'), p, p[num(k + 'c')]); if (r.valid) { r.steps = r.lines.map(function (l) { return [l, '']; }); r.after = 'Whatever they do, the object that ends up chosen is number ' + (r.final + 1) + ' of three, the one you wanted.'; r.noFinal = true; } return r; } }
  };
  function num(id) { var e = d.getElementById(id); return e && e.value !== '' ? Number(e.value) : NaN; }
  function showDemo(box, id) {
    var D = DEMOS[id], k = 'm' + id + Math.floor(Math.random() * 1e6);
    if (!D) return;
    box.innerHTML = '<div class="fcalc">' + D.form(k) + '</div><div data-out aria-live="polite"></div>';
    function run() {
      var r = D.run(k), o = box.querySelector('[data-out]');
      if (!r.valid) { o.innerHTML = '<p class="fnote">' + esc(r.why) + '</p>'; return; }
      o.innerHTML = '<table class="pl"><tbody>' + r.steps.map(function (s) { return '<tr><td>' + esc(s[0]) + '</td><td>' + (s[1] === '' ? '' : '<b>' + esc(s[1]) + '</b>') + '</td></tr>'; }).join('') + '</tbody></table>' + (r.after ? '<p class="ans">' + esc(r.after) + '</p>' : (r.noFinal ? '' : '<p class="ans">Final answer: ' + esc(r.final) + '</p>'));
    }
    box.addEventListener('input', run); box.addEventListener('change', run); run();
  }
  d.querySelectorAll('[data-trick]').forEach(function (b) { showDemo(b, b.getAttribute('data-trick')); });
  var tr = d.querySelector('[data-trainer]');
  if (tr) {
    tr.innerHTML = '<label>Choose a trick<select id="mtsel">' + Object.keys(DEMOS).map(function (k) { return '<option value="' + k + '">' + esc(DEMOS[k].title) + '</option>'; }).join('') + '</select></label><div data-demo></div>';
    var sw = function () { showDemo(tr.querySelector('[data-demo]'), d.getElementById('mtsel').value); };
    tr.querySelector('#mtsel').addEventListener('change', sw); sw();
  }
  var cb = d.querySelector('[data-cards]');
  if (cb) {
    var h = '<div class="mcards">';
    for (var i = 0; i < 5; i++) h += '<div class="mcard"><h3>Card ' + (i + 1) + '</h3><p>' + M.card(i).map(function (n) { return '<span>' + n + '</span>'; }).join('') + '</p></div>';
    h += '</div><div class="kbtns nopr"><button type="button" class="btn" data-cprint>Print the five cards</button></div><div class="nopr"><h3>Try the guess</h3><p>Think of a number from 1 to 31. Tick every card that has your number on it.</p><div class="fcalc">';
    for (i = 0; i < 5; i++) h += '<label class="kchk"><input type="checkbox" data-yes="' + i + '"> Card ' + (i + 1) + '</label>';
    h += '</div><p class="ans" data-guess aria-live="polite"></p></div>';
    cb.innerHTML = h;
    var g = function () { var yes = []; cb.querySelectorAll('[data-yes]').forEach(function (e) { if (e.checked) yes.push(Number(e.getAttribute('data-yes'))); }); var n = M.guess(yes); cb.querySelector('[data-guess]').textContent = n ? 'Your number is ' + n + '.' : 'Tick the cards that have your number. If it is on none of them, it is not between 1 and 31.'; };
    cb.addEventListener('change', g); g();
    cb.addEventListener('click', function (e) { if (e.target.hasAttribute('data-cprint')) window.print(); });
  }
})();
