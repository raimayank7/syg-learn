/* Syllabus: study planner. Data: /data/syl.json rows {c: class, s: slug, n: name, t: theory marks, r: [[unit or group, marks]]} */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var sel = $('pl-s'); if (!sel) return;
  var out = $('pl-out'), days = $('pl-d'), rev = $('pl-r'), data = null, q = new URLSearchParams(location.search);
  function share(total, rows) {
    /* largest remainder method, at least one day for each row */
    var sum = rows.reduce(function (a, r) { return a + r[1]; }, 0), n = rows.length;
    if (total < n) return null;
    var base = rows.map(function (r) { return Math.max(1, Math.floor(total * r[1] / sum)); }), used = base.reduce(function (a, b) { return a + b; }, 0);
    var order = rows.map(function (r, i) { return [total * r[1] / sum - Math.floor(total * r[1] / sum), i]; }).sort(function (a, b) { return b[0] - a[0]; });
    var k = 0;
    while (used < total) { base[order[k % n][1]]++; used++; k++; }
    k = 0; order.reverse();
    while (used > total && k < 10 * n) { var i = order[k % n][1]; if (base[i] > 1) { base[i]--; used--; } k++; }
    return base;
  }
  function run() {
    if (!data) return;
    var v = sel.value.split('|'), s = data.filter(function (x) { return String(x.c) === v[0] && x.s === v[1]; })[0];
    var d = parseInt(days.value, 10), r = +rev.value;
    if (!s) return;
    if (!/^\d+$/.test(days.value.trim()) || d < 1 || d > 400) { out.hidden = false; out.innerHTML = '<p>Type the number of days as a whole number from 1 to 400.</p>'; return; }
    var rd = Math.round(d * r / 100), study = d - rd, parts = share(study, s.r);
    if (!parts) { out.hidden = false; out.innerHTML = '<p>' + esc(s.n) + ' has ' + s.r.length + ' units or groups in its marks table. With ' + study + ' study day' + (study === 1 ? '' : 's') + ' there is less than a day for each. Add days, or keep fewer for revision.</p>'; return; }
    var rows = s.r.map(function (u, i) { return '<tr><td data-l="Unit">' + esc(u[0]) + '</td><td data-l="Marks">' + u[1] + '</td><td data-l="Days">' + parts[i] + '</td></tr>'; }).join('');
    var text = 'Study plan: CBSE class ' + s.c + ' ' + s.n + ', ' + d + ' days\n' + s.r.map(function (u, i) { return u[0] + ' (' + u[1] + ' marks): ' + parts[i] + ' day' + (parts[i] === 1 ? '' : 's'); }).join('\n') + (rd ? '\nRevision and practice papers: ' + rd + ' day' + (rd === 1 ? '' : 's') : '');
    out.hidden = false;
    out.innerHTML = '<h2>CBSE class ' + s.c + ' ' + esc(s.n) + ': ' + d + ' days</h2><div class="tbl"><table class="stack"><thead><tr><th>Unit</th><th>Marks</th><th>Days</th></tr></thead><tbody>' + rows +
      (rd ? '<tr><td data-l="Unit"><b>Revision and practice papers</b></td><td data-l="Marks"></td><td data-l="Days"><b>' + rd + '</b></td></tr>' : '') +
      '<tr><td data-l="Unit"><b>Total</b></td><td data-l="Marks"><b>' + s.t + '</b></td><td data-l="Days"><b>' + d + '</b></td></tr></tbody></table></div>' +
      '<p class="sy-cta"><button class="btn sm" type="button" data-copy="' + esc(text) + '">Copy the plan</button> <button class="btn sm ghost" type="button" onclick="print()">Print</button> <a class="btn sm ghost" href="/syllabus/cbse/class-' + s.c + '/' + s.s + '/">See the syllabus</a></p>' +
      '<p class="hint">A first draft. Move days towards the units you find hard.</p>';
  }
  fetch('/syllabus/data/syl.json').then(function (r) { return r.json(); }).then(function (d) {
    data = d;
    var c = q.get('c'), s = q.get('s');
    if (c) { var opt = [].filter.call(sel.options, function (o) { return o.value.indexOf(c + '|') === 0 && (!s || o.value === c + '|' + s); })[0]; if (opt) sel.value = opt.value; }
    run();
  }).catch(function () { out.hidden = false; out.innerHTML = '<p>The syllabus data could not be loaded. Check your connection and try again.</p>'; });
  sel.addEventListener('change', run); days.addEventListener('input', run); rev.addEventListener('change', run);
})();
