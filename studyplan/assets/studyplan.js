/* learn.shareyourgroup.com/studyplan: a day-by-day study plan and a weekly timetable, pure calculation in the page. Helpers first (the build checks them in Node against separate Python code),
   then the tools. Nothing is sent anywhere; the subjects you type are kept only in this browser. */
(function () {
  'use strict';
  var S = {};
  function pd(iso) { var p = iso.split('-'); return Date.UTC(+p[0], +p[1] - 1, +p[2]); }
  function iso(ms) { var d = new Date(ms); return d.getUTCFullYear() + '-' + ('0' + (d.getUTCMonth() + 1)).slice(-2) + '-' + ('0' + d.getUTCDate()).slice(-2); }
  var DAY = 86400000, NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  S.NAMES = NAMES;
  function r2(x) { return Math.round(x * 100) / 100; }
  /* the days from start to the day before the exam, leaving out the rest weekday (0 = Sunday ... 6 = Saturday, -1 = none) */
  S.days = function (start, exam, rest) {
    var a = pd(start), b = pd(exam), out = [];
    for (var t = a; t < b; t += DAY) { var wd = new Date(t).getUTCDay(); if (wd !== rest) out.push({ date: iso(t), wd: wd }); }
    return out;
  };
  /* revision days = the last ceil(days x revisionPercent / 100) study days; the rest are learning days */
  S.split = function (n, revPct) { var rev = n ? Math.min(n, Math.ceil(n * revPct / 100)) : 0; return { learn: n - rev, rev: rev }; };
  /* subjects: [{name, weight, chapters}]. Hours per learning day are shared by weight; chapters are covered in proportion to hours. */
  S.plan = function (start, exam, hours, subjects, revPct, rest) {
    var days = S.days(start, exam, rest), sp = S.split(days.length, revPct), tw = subjects.reduce(function (a, s) { return a + s.weight; }, 0), rows = [], i;
    var done = subjects.map(function () { return 0; });
    for (i = 0; i < days.length; i++) {
      var isRev = i >= sp.learn, row = { date: days[i].date, wd: days[i].wd, rev: isRev, parts: [] };
      subjects.forEach(function (s, k) {
        var h = hours * s.weight / tw, from = done[k], to = from;
        if (!isRev && sp.learn) { to = from + s.chapters / sp.learn; done[k] = to; }
        row.parts.push({ name: s.name, hours: r2(h), from: from, to: to });
      });
      rows.push(row);
    }
    return { days: days.length, learn: sp.learn, rev: sp.rev, rows: rows, totalHours: r2(days.length * hours) };
  };
  S.subjectHours = function (p, k) { return r2(p.rows.reduce(function (a, r) { return a + r.parts[k].hours; }, 0)); };
  /* weekly timetable: hours per study weekday shared by weight */
  S.week = function (hours, subjects, rest) {
    var tw = subjects.reduce(function (a, s) { return a + s.weight; }, 0), out = [];
    for (var wd = 0; wd < 7; wd++) out.push({ wd: wd, parts: wd === rest ? [] : subjects.map(function (s) { return { name: s.name, hours: r2(hours * s.weight / tw) }; }) });
    return out;
  };
  if (typeof module !== 'undefined' && module.exports) { module.exports = S; return; }
  window.STUDYPLAN = S;

  var d = document;
  function el(q) { return d.querySelector(q); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function get(k) { try { return JSON.parse(localStorage.getItem('studyplan-' + k)); } catch (e) { return null; } }
  function put(k, v) { try { localStorage.setItem('studyplan-' + k, JSON.stringify(v)); } catch (e) {} }
  function today() { var t = new Date(); return t.getFullYear() + '-' + ('0' + (t.getMonth() + 1)).slice(-2) + '-' + ('0' + t.getDate()).slice(-2); }
  function subjRows(list) { return list.map(function (s, i) { return '<tr><td><input type="text" data-f="name" data-i="' + i + '" value="' + esc(s.name) + '" aria-label="Subject name" maxlength="40"></td><td><input type="number" data-f="weight" data-i="' + i + '" min="1" max="10" value="' + s.weight + '" aria-label="Weight" inputmode="numeric"></td><td><input type="number" data-f="chapters" data-i="' + i + '" min="1" max="200" value="' + s.chapters + '" aria-label="Chapters" inputmode="numeric"></td><td><button type="button" class="btn ghost" data-rm="' + i + '">Remove</button></td></tr>'; }).join(''); }
  function readSubjects(box, subs) {
    return subs.map(function (s, i) {
      var n = box.querySelector('[data-f="name"][data-i="' + i + '"]'), w = box.querySelector('[data-f="weight"][data-i="' + i + '"]'), c = box.querySelector('[data-f="chapters"][data-i="' + i + '"]');
      return { name: (n.value || 'Subject ' + (i + 1)).slice(0, 40), weight: Math.min(10, Math.max(1, +w.value || 1)), chapters: Math.min(200, Math.max(1, +c.value || 1)) };
    });
  }
  var DEFAULT = [{ name: 'Mathematics', weight: 3, chapters: 14 }, { name: 'Science', weight: 3, chapters: 13 }, { name: 'English', weight: 2, chapters: 10 }];

  var pb = el('[data-plan]');
  if (pb) {
    var subs = get('subjects') || DEFAULT;
    var t0 = new Date(); var ex = new Date(t0.getTime() + 60 * DAY);
    pb.innerHTML = '<div class="fields"><label>Start date<input type="date" id="ps" value="' + today() + '"></label><label>Exam date<input type="date" id="pe" value="' + iso(Date.UTC(ex.getFullYear(), ex.getMonth(), ex.getDate())) + '"></label><label>Hours a study day<input type="number" id="ph" min="1" max="16" value="4" step="0.5" inputmode="decimal"></label><label>Rest day<select id="pr"><option value="-1">None</option>' + NAMES.map(function (n, i) { return '<option value="' + i + '"' + (i === 0 ? ' selected' : '') + '>' + n + '</option>'; }).join('') + '</select></label><label>Share kept for revision (per cent of days)<input type="number" id="pv" min="0" max="60" value="25" inputmode="numeric"></label></div><div class="tbl"><table><thead><tr><th>Subject</th><th>Weight (1 to 10)</th><th>Chapters</th><th></th></tr></thead><tbody data-subj></tbody></table></div><p><button type="button" class="btn ghost" id="padd">Add a subject</button> <button type="button" class="btn" id="pprint">Print the plan</button></p><p class="calc-msg" data-msg aria-live="polite"></p><div data-out></div>';
    var run = function () {
      subs = readSubjects(pb, subs);
      var st = el('#ps').value, en = el('#pe').value, h = Math.min(16, Math.max(1, +el('#ph').value || 1)), rest = +el('#pr').value, rv = Math.min(60, Math.max(0, +el('#pv').value || 0)), out = pb.querySelector('[data-out]'), msg = pb.querySelector('[data-msg]');
      put('subjects', subs);
      if (!st || !en || pd(en) <= pd(st)) { msg.textContent = 'The exam date must be after the start date.'; out.innerHTML = ''; return; }
      var p = S.plan(st, en, h, subs, rv, rest);
      if (!p.days) { msg.textContent = 'There is no study day between the two dates.'; out.innerHTML = ''; return; }
      msg.textContent = p.days + ' study days (' + p.learn + ' for learning, then ' + p.rev + ' for revision), ' + p.totalHours + ' hours in all.';
      var fmt = function (x) { return (Math.round(x * 10) / 10).toString(); };
      out.innerHTML = '<h2>Hours by subject</h2><ul>' + subs.map(function (s, k) { return '<li>' + esc(s.name) + ': ' + S.subjectHours(p, k) + ' hours, ' + s.chapters + ' chapters</li>'; }).join('') + '</ul><h2>Day by day</h2><div class="tbl"><table><thead><tr><th>Date</th><th>Day</th><th>What to do</th></tr></thead><tbody>' + p.rows.map(function (r) { return '<tr><td>' + r.date + '</td><td>' + NAMES[r.wd] + '</td><td>' + (r.rev ? '<b>Revision</b>: ' : '') + r.parts.map(function (x) { return esc(x.name) + ' ' + x.hours + ' h' + (r.rev ? '' : ' (chapters ' + fmt(x.from) + ' to ' + fmt(x.to) + ')'); }).join('; ') + '</td></tr>'; }).join('') + '</tbody></table></div>';
    };
    var draw = function () { pb.querySelector('[data-subj]').innerHTML = subjRows(subs); run(); };
    pb.addEventListener('input', run); pb.addEventListener('change', run);
    pb.addEventListener('click', function (e) {
      if (e.target.id === 'padd') { subs = readSubjects(pb, subs); if (subs.length < 12) subs.push({ name: 'Subject ' + (subs.length + 1), weight: 2, chapters: 10 }); draw(); }
      else if (e.target.id === 'pprint') window.print();
      else if (e.target.getAttribute('data-rm') !== null && subs.length > 1) { subs = readSubjects(pb, subs); subs.splice(+e.target.getAttribute('data-rm'), 1); draw(); }
    });
    draw();
  }

  var wb = el('[data-week]');
  if (wb) {
    var ws = get('week-subjects') || DEFAULT;
    wb.innerHTML = '<div class="fields"><label>Hours a study day<input type="number" id="wh" min="1" max="16" value="4" step="0.5" inputmode="decimal"></label><label>Rest day<select id="wr"><option value="-1">None</option>' + NAMES.map(function (n, i) { return '<option value="' + i + '"' + (i === 0 ? ' selected' : '') + '>' + n + '</option>'; }).join('') + '</select></label></div><div class="tbl"><table><thead><tr><th>Subject</th><th>Weight (1 to 10)</th><th>Chapters</th><th></th></tr></thead><tbody data-subj></tbody></table></div><p><button type="button" class="btn ghost" id="wadd">Add a subject</button> <button type="button" class="btn" id="wprint">Print the timetable</button></p><div data-out></div>';
    var wrun = function () {
      ws = readSubjects(wb, ws); put('week-subjects', ws);
      var h = Math.min(16, Math.max(1, +el('#wh').value || 1)), rest = +el('#wr').value, wk = S.week(h, ws, rest);
      wb.querySelector('[data-out]').innerHTML = '<div class="tbl"><table><thead><tr><th>Day</th>' + ws.map(function (s) { return '<th>' + esc(s.name) + '</th>'; }).join('') + '<th>Total</th></tr></thead><tbody>' + [1, 2, 3, 4, 5, 6, 0].map(function (wd) { var r = wk[wd]; return '<tr><th scope="row">' + NAMES[wd] + '</th>' + (r.parts.length ? r.parts.map(function (x) { return '<td class="n">' + x.hours + '</td>'; }).join('') + '<td class="n">' + r2(r.parts.reduce(function (a, x) { return a + x.hours; }, 0)) + '</td>' : '<td colspan="' + (ws.length + 1) + '">Rest</td>') + '</tr>'; }).join('') + '</tbody></table></div>';
    };
    var wdraw = function () { wb.querySelector('[data-subj]').innerHTML = subjRows(ws); wrun(); };
    wb.addEventListener('input', wrun); wb.addEventListener('change', wrun);
    wb.addEventListener('click', function (e) {
      if (e.target.id === 'wadd') { ws = readSubjects(wb, ws); if (ws.length < 12) ws.push({ name: 'Subject ' + (ws.length + 1), weight: 2, chapters: 10 }); wdraw(); }
      else if (e.target.id === 'wprint') window.print();
      else if (e.target.getAttribute('data-rm') !== null && ws.length > 1) { ws = readSubjects(wb, ws); ws.splice(+e.target.getAttribute('data-rm'), 1); wdraw(); }
    });
    wdraw();
  }
})();
