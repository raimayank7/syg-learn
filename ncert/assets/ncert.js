/* learn.shareyourgroup.com/ncert: NCERT textbook finder, chapter tracker and pace planner. The book list (window.NCERT_BOOKS = [class, subject, title, code, chapters]) is copied at build time from the
   official NCERT textbook page. Pure helpers first (the build checks them in Node), then the pages' tools. Nothing is sent anywhere; ticks are kept only in this browser. */
(function () {
  'use strict';
  var N = {};
  N.find = function (books, cls, subj, text) {
    var q = String(text || '').trim().toLowerCase();
    return books.filter(function (b) { return (!cls || b[0] === +cls) && (!subj || b[1] === subj) && (!q || (b[2] + ' ' + b[1]).toLowerCase().indexOf(q) >= 0); });
  };
  N.subjects = function (books, cls) { var s = {}; books.forEach(function (b) { if (!cls || b[0] === +cls) s[b[1]] = 1; }); return Object.keys(s).sort(); };
  N.progress = function (done, total) { return total ? Math.round(100 * done / total) : 0; };
  N.pace = function (chaptersLeft, days) { return days > 0 ? Math.round(chaptersLeft / days * 100) / 100 : null; };
  N.daysPer = function (chaptersLeft, days) { return chaptersLeft > 0 ? Math.round(days / chaptersLeft * 100) / 100 : null; };
  N.url = function (b) { return 'https://ncert.nic.in/textbook.php?' + b[3] + '=0-' + b[4]; };
  if (typeof module !== 'undefined' && module.exports) { module.exports = N; return; }
  window.NCERT = N;

  var d = document, B = window.NCERT_BOOKS || [];
  function el(s) { return d.querySelector(s); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function get(k) { try { return JSON.parse(localStorage.getItem('ncert-' + k)); } catch (e) { return null; } }
  function put(k, v) { try { localStorage.setItem('ncert-' + k, JSON.stringify(v)); } catch (e) {} }
  function opts(list, all) { return (all ? '<option value="">' + all + '</option>' : '') + list.map(function (x) { return '<option value="' + esc(x) + '">' + esc(x) + '</option>'; }).join(''); }

  var fd = el('[data-finder]');
  if (fd) {
    fd.innerHTML = '<div class="fields"><label>Class<select id="fc"><option value="">All classes</option>' + [6, 7, 8, 9, 10, 11, 12].map(function (c) { return '<option value="' + c + '">Class ' + c + '</option>'; }).join('') + '</select></label><label>Subject<select id="fs"></select></label><label>Search the title<input type="search" id="ft" placeholder="for example Ganita" autocomplete="off"></label></div><p class="calc-msg" data-count aria-live="polite"></p><div data-list></div>';
    var drawSubj = function () { var cur = el('#fs').value; el('#fs').innerHTML = opts(N.subjects(B, el('#fc').value), 'All subjects'); el('#fs').value = cur; if (el('#fs').value !== cur) el('#fs').value = ''; };
    var draw = function () {
      var r = N.find(B, el('#fc').value, el('#fs').value, el('#ft').value), shown = r.slice(0, 60);
      fd.querySelector('[data-count]').textContent = r.length + ' book' + (r.length === 1 ? '' : 's') + (r.length > 60 ? ' (showing the first 60: narrow the search)' : '');
      fd.querySelector('[data-list]').innerHTML = shown.length ? '<div class="tbl"><table><thead><tr><th>Class</th><th>Subject</th><th>Book</th><th>Files 1 to N</th><th>NCERT page</th></tr></thead><tbody>' + shown.map(function (b) { return '<tr><td class="n">' + b[0] + '</td><td>' + esc(b[1]) + '</td><td>' + esc(b[2]) + '</td><td class="n">' + b[4] + '</td><td><a href="' + N.url(b) + '" rel="noopener" target="_blank">Open</a></td></tr>'; }).join('') + '</tbody></table></div>' : '<p>No book matches. Try fewer words.</p>';
    };
    fd.addEventListener('input', function (e) { if (e.target.id === 'fc') drawSubj(); draw(); });
    drawSubj(); draw();
  }

  var tr = el('[data-tracker]');
  if (tr) {
    var saved = get('track') || {};
    tr.innerHTML = '<div class="fields"><label>Class<select id="tc">' + [6, 7, 8, 9, 10, 11, 12].map(function (c) { return '<option value="' + c + '">Class ' + c + '</option>'; }).join('') + '</select></label><label>Subject<select id="ts"></select></label><label>Book<select id="tb"></select></label></div><div data-boxes></div><p class="calc-tot" data-prog></p><h2>Your saved books</h2><div data-all></div>';
    var cur = function () { var l = N.find(B, el('#tc').value, el('#ts').value, '').filter(function (b) { return b[3] === el('#tb').value; }); return l[0]; };
    var redrawAll = function () {
      var keys = Object.keys(saved).filter(function (k) { return saved[k].length; });
      el('[data-all]').innerHTML = keys.length ? '<ul>' + keys.map(function (k) { var b = B.filter(function (x) { return x[3] === k; })[0]; return b ? '<li>Class ' + b[0] + ' ' + esc(b[1]) + ', ' + esc(b[2]) + ': ' + saved[k].length + ' of ' + b[4] + ' (' + N.progress(saved[k].length, b[4]) + '%)</li>' : ''; }).join('') + '</ul>' : '<p>Nothing ticked yet.</p>';
    };
    var fillBooks = function () { var l = N.find(B, el('#tc').value, el('#ts').value, ''); el('#tb').innerHTML = l.map(function (b) { return '<option value="' + b[3] + '">' + esc(b[2]) + ' (' + b[4] + ')</option>'; }).join(''); boxes(); };
    var fillSubj = function () { el('#ts').innerHTML = opts(N.subjects(B, el('#tc').value)); fillBooks(); };
    var boxes = function () {
      var b = cur(), done = b ? (saved[b[3]] || []) : [];
      el('[data-boxes]').innerHTML = b ? '<div class="chk">' + Array.apply(null, Array(b[4])).map(function (_, i) { return '<label><input type="checkbox" data-n="' + (i + 1) + '"' + (done.indexOf(i + 1) >= 0 ? ' checked' : '') + '> ' + (i + 1) + '</label>'; }).join('') + '</div>' : '';
      el('[data-prog]').textContent = b ? done.length + ' of ' + b[4] + ' done (' + N.progress(done.length, b[4]) + '%)' : '';
      redrawAll();
    };
    tr.addEventListener('change', function (e) {
      if (e.target.id === 'tc') return fillSubj(); if (e.target.id === 'ts') return fillBooks(); if (e.target.id === 'tb') return boxes();
      if (e.target.getAttribute('data-n')) { var b = cur(), n = +e.target.getAttribute('data-n'), a = saved[b[3]] || []; a = e.target.checked ? a.concat([n]) : a.filter(function (x) { return x !== n; }); saved[b[3]] = a; put('track', saved); boxes(); }
    });
    el('#tc').value = '10'; fillSubj();
  }

  var pp = el('[data-pace]');
  if (pp) {
    pp.innerHTML = '<div class="fields"><label>Chapters still to read<input type="number" id="pl" min="0" max="500" value="40" inputmode="numeric"></label><label>Days you have<input type="number" id="pd" min="1" max="1000" value="30" inputmode="numeric"></label></div><div class="result" data-out aria-live="polite"></div>';
    var run = function () {
      var l = Math.max(0, +el('#pl').value || 0), dd = Math.max(1, +el('#pd').value || 1), p = N.pace(l, dd), q = N.daysPer(l, dd);
      el('[data-out]').innerHTML = l ? '<p class="big">' + p + ' chapters a day</p><p>To read ' + l + ' chapters in ' + dd + ' days you need about <b>' + p + '</b> chapters a day, which is <b>' + q + '</b> days for each chapter.</p>' + (p > 3 ? '<p>That is a lot of reading each day. Leave some chapters for later or add days.</p>' : '') : '<p>No chapters left.</p>';
    };
    pp.addEventListener('input', run); run();
  }
})();
