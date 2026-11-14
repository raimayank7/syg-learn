/* learn.shareyourgroup.com/allowance: a printable weekly chore chart and a pocket-money planner. Pure helpers first (the build checks them in Node against separate Python code), then the tools.
   Money is worked in whole hundredths (paise or cents) so there are no rounding slips. Nothing is sent anywhere. */
(function () {
  'use strict';
  var A = {};
  A.DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  function lines(t, max, len) { var o = []; String(t).split(/\r?\n|,/).forEach(function (x) { x = x.replace(/\s+/g, ' ').trim(); if (x && o.length < max) o.push(x.slice(0, len)); }); return o; }
  A.list = lines;
  /* a sheet for each child (or one blank sheet): a row for each chore, a box for each day */
  A.chart = function (kids, chores, days) {
    var k = lines(kids, 12, 30), c = lines(chores, 15, 50), n = Math.min(7, Math.max(1, days | 0));
    if (!k.length) k = [''];
    return k.map(function (name) { return { kid: name, days: A.DAYS.slice(0, n), rows: c.map(function (x) { return { chore: x, cells: n }; }) }; });
  };
  /* "12", "12.5", "12.50" -> 1250; anything else (negative, 3 decimals, letters, empty) -> null; at most 9,999,999.99 */
  A.cents = function (s) {
    s = String(s).trim(); if (!/^\d{1,7}(\.\d{1,2})?$/.test(s)) return null;
    var p = s.split('.'); return parseInt(p[0], 10) * 100 + (p[1] ? parseInt((p[1] + '0').slice(0, 2), 10) : 0);
  };
  A.money = function (c) { var w = Math.floor(c / 100), f = c % 100; return w + '.' + (f < 10 ? '0' : '') + f; };
  /* earnings for a week: a base amount plus, for each chore, the money for one time x the times done (0 to 7) */
  A.earn = function (baseC, chores) { var t = baseC; chores.forEach(function (c) { t += c.valueC * Math.min(7, Math.max(0, c.done | 0)); }); return t; };
  /* whole weeks to save for a goal: 0 when the saved money already reaches it; null when nothing is saved each week */
  A.weeks = function (goalC, savedC, weeklyC) { if (savedC >= goalC) return 0; if (weeklyC <= 0) return null; return Math.ceil((goalC - savedC) / weeklyC); };
  if (typeof module !== 'undefined' && module.exports) { module.exports = A; return; }
  window.ALLOWANCE = A;

  var d = document;
  function el(q) { return d.querySelector(q); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function get(k) { try { return JSON.parse(localStorage.getItem('allowance-' + k)); } catch (e) { return null; } }
  function put(k, v) { try { localStorage.setItem('allowance-' + k, JSON.stringify(v)); } catch (e) {} }
  var cb = el('[data-chart]');
  if (cb) {
    var st = get('chart') || {};
    cb.innerHTML = '<label>Children\'s names, one on each line (leave empty for one blank sheet)<textarea class="names" id="ck">' + esc(st.kids !== undefined ? st.kids : 'Asha\nBilal') + '</textarea></label><label>Chores, one on each line<textarea class="names" id="cc">' + esc(st.chores !== undefined ? st.chores : 'Make the bed\nBrush teeth\nTidy toys\nHelp lay the table\nRead for 15 minutes') + '</textarea></label><div class="fields"><label>Days on the chart<select id="cdn"><option value="7">7 (Monday to Sunday)</option><option value="5">5 (Monday to Friday)</option></select></label></div><div class="btns"><button type="button" class="btn" id="cprint">Print the charts</button></div><div data-sheet></div>';
    if (st.days) el('#cdn').value = String(st.days);
    var run = function () {
      put('chart', { kids: el('#ck').value, chores: el('#cc').value, days: +el('#cdn').value });
      var sheets = A.chart(el('#ck').value, el('#cc').value, +el('#cdn').value);
      cb.querySelector('[data-sheet]').innerHTML = sheets.map(function (s) { return '<div class="ch"><h3>' + (s.kid ? esc(s.kid) + ': ' : '') + 'chores this week</h3><div class="chw"><table><thead><tr><th>Chore</th>' + s.days.map(function (x) { return '<th>' + x + '</th>'; }).join('') + '</tr></thead><tbody>' + (s.rows.length ? s.rows.map(function (r) { return '<tr><td>' + esc(r.chore) + '</td>' + new Array(r.cells + 1).join('<td class="b"></td>') + '</tr>'; }).join('') : '<tr><td colspan="' + (s.days.length + 1) + '">Type some chores.</td></tr>') + '</tbody></table></div></div>'; }).join('');
    };
    cb.addEventListener('input', run); cb.addEventListener('change', run);
    cb.addEventListener('click', function (e) { if (e.target.id === 'cprint') window.print(); });
    run();
  }
  var pb = el('[data-pocket]');
  if (pb) {
    pb.innerHTML = '<h3>This week\'s pocket money</h3><div class="fcalc"><label>Basic pocket money<input type="text" inputmode="decimal" id="pb" value="100"></label></div><div class="fcalc"><label>Chore<input type="text" id="n1" value="Tidy room"></label><label>Money each time<input type="text" inputmode="decimal" id="v1" value="10"></label><label>Times done (0 to 7)<input type="number" id="d1" min="0" max="7" value="5"></label></div><div class="fcalc"><label>Chore<input type="text" id="n2" value="Wash dishes"></label><label>Money each time<input type="text" inputmode="decimal" id="v2" value="15"></label><label>Times done (0 to 7)<input type="number" id="d2" min="0" max="7" value="3"></label></div><p class="ans" data-earn aria-live="polite"></p>' +
      '<h3>Saving for something</h3><div class="fcalc"><label>Price of the goal<input type="text" inputmode="decimal" id="gg" value="1500"></label><label>Saved so far<input type="text" inputmode="decimal" id="gs" value="200"></label><label>Saved each week<input type="text" inputmode="decimal" id="gw" value="75"></label></div><p class="ans" data-goal aria-live="polite"></p>';
    var run2 = function () {
      var b = A.cents(el('#pb').value), v1 = A.cents(el('#v1').value), v2 = A.cents(el('#v2').value), e = pb.querySelector('[data-earn]');
      if (b === null || v1 === null || v2 === null) e.textContent = 'Type amounts as plain numbers, like 10 or 12.50.';
      else { var t = A.earn(b, [{ valueC: v1, done: +el('#d1').value }, { valueC: v2, done: +el('#d2').value }]); e.textContent = 'Total for the week: ' + A.money(t) + ' (' + A.money(b) + ' basic + chores)'; }
      var g = A.cents(el('#gg').value), s = A.cents(el('#gs').value), w = A.cents(el('#gw').value), o = pb.querySelector('[data-goal]');
      if (g === null || s === null || w === null) o.textContent = 'Type amounts as plain numbers, like 1500 or 12.50.';
      else { var k = A.weeks(g, s, w); o.textContent = k === 0 ? 'The goal is already reached.' : k === null ? 'Save something each week to reach the goal.' : 'About ' + k + ' week' + (k === 1 ? '' : 's') + ' to go.'; }
    };
    pb.addEventListener('input', run2); run2();
  }
})();
