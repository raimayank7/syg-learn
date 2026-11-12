/* learn.shareyourgroup.com/sql: the practice box. SQLite runs in this browser (sql.js); nothing typed here is sent anywhere. */
(function () {
  'use strict';
  var d = document, box = d.querySelector('[data-pb]');
  if (!box) return;
  var $ = function (s) { return box.querySelector(s); };
  var ta = $('#pb-q'), out = $('[data-pb-out]'), status = $('[data-pb-status]'), histEl = $('[data-pb-hist]'), exEl = $('[data-pb-ex]'), checkBtn = $('[data-pb-check]');
  var db = null, SQL = null, seed = null, loading = null, exercise = null, exercises = null;
  var HKEY = 'sql-hist', DKEY = 'sql-ex-done';
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  function get(k) { try { return JSON.parse(localStorage.getItem(k) || '[]'); } catch (e) { return []; } }
  function set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  function script(src) {
    return new Promise(function (ok, bad) { var s = d.createElement('script'); s.src = src; s.onload = ok; s.onerror = function () { bad(new Error('could not load ' + src)); }; d.head.appendChild(s); });
  }
  function ready() {
    if (db) return Promise.resolve();
    if (loading) return loading;
    status.textContent = 'Loading the database (about 700 KB, once)...';
    loading = Promise.all([script('/sql/assets/sql-wasm.js'), fetch('/sql/assets/seed.sql').then(function (r) { return r.text(); })]).then(function (a) {
      seed = a[1];
      return window.initSqlJs({ locateFile: function (f) { return '/sql/assets/' + f; } });
    }).then(function (S) { SQL = S; fresh(); status.textContent = 'Database ready. It lives in this browser tab; Reset puts it back as new.'; })
      .catch(function (e) { loading = null; status.textContent = 'The database could not load (' + e.message + '). Check your connection and press Run again.'; throw e; });
    return loading;
  }
  function fresh() { if (db) db.close(); db = new SQL.Database(); db.run(seed); }

  function tableHtml(r) {
    var rows = r.values, show = rows.slice(0, 200);
    return '<div class="tbl res"><table><thead><tr>' + r.columns.map(function (c) { return '<th>' + esc(c) + '</th>'; }).join('') + '</tr></thead><tbody>' +
      show.map(function (row) { return '<tr>' + row.map(function (v) { return '<td>' + (v === null ? '<i class="null">NULL</i>' : esc(v)) + '</td>'; }).join('') + '</tr>'; }).join('') +
      '</tbody></table></div><p class="rc">' + rows.length + ' row' + (rows.length === 1 ? '' : 's') + (rows.length > 200 ? ' (first 200 shown)' : '') + '</p>';
  }
  function norm(v) {
    if (v === null) return null;
    if (typeof v === 'number' && !Number.isInteger(v)) return String(parseFloat(v.toFixed(4)));
    return String(v);
  }
  function runSql(sql) {
    var res = db.exec(sql), n = db.getRowsModified();
    return { res: res, changed: n };
  }
  function run(check) {
    var sql = ta.value.trim();
    if (!sql) { out.innerHTML = '<p class="msg bad">Type some SQL first, for example: SELECT * FROM customers;</p>'; return; }
    ready().then(function () {
      var r;
      try {
        if (check) fresh();
        r = runSql(sql);
      } catch (e) {
        out.innerHTML = '<p class="msg bad"><b>Error:</b> ' + esc(e.message) + '</p><p class="hint">Read the message for the word it stopped at. Usual causes: a spelling slip in a table or column name, a missing comma or quotation mark, or text without single quotes.</p>';
        return;
      }
      var html = r.res.map(tableHtml).join('');
      if (!r.res.length) html = '<p class="msg ok">Done. ' + (/^\s*(insert|update|delete|replace)/i.test(sql) ? r.changed + ' row' + (r.changed === 1 ? '' : 's') + ' changed.' : 'The statement ran and returned no rows.') + '</p>';
      if (check && exercise) html = verdict(r.res) + html;
      out.innerHTML = html;
      var h = get(HKEY).filter(function (x) { return x !== sql; }); h.unshift(sql); set(HKEY, h.slice(0, 10)); hist();
    }).catch(function () {});
  }
  function verdict(res) {
    if (res.length !== 1) return '<p class="msg bad">Not yet. The answer should be one SELECT that returns rows.</p>';
    var got = res[0].values.map(function (r) { return r.map(norm); }), want = exercise.rows.map(function (r) { return r.slice(); });
    if (res[0].columns.length !== exercise.cols) return '<p class="msg bad">Not yet. The answer has ' + exercise.cols + ' column' + (exercise.cols === 1 ? '' : 's') + ' and yours has ' + res[0].columns.length + '. Read the question again for what to show.</p>';
    if (got.length !== want.length) return '<p class="msg bad">Not yet. The answer has ' + want.length + ' row' + (want.length === 1 ? '' : 's') + ' and yours has ' + got.length + '.</p>';
    var key = function (r) { return JSON.stringify(r); };
    var a = got.map(key), b = want.map(key);
    if (!exercise.ordered) { a.sort(); b.sort(); }
    for (var i = 0; i < a.length; i++) if (a[i] !== b[i]) {
      var sorted = a.slice().sort().join() === b.slice().sort().join();
      return '<p class="msg bad">Not yet. ' + (sorted ? 'The rows are right but the order is not. Check ORDER BY.' : 'The right number of rows and columns, but some values differ. Check the columns you chose and your conditions.') + '</p>';
    }
    var done = get(DKEY); if (done.indexOf(exercise.id) < 0) { done.push(exercise.id); set(DKEY, done); }
    return '<p class="msg ok"><b>Correct.</b> Your result matches the answer. <a href="/sql/' + exercise.lesson + '/sql/#ex' + exercise.n + '">Compare with our answer</a> or <a href="/sql/exercises/">pick another exercise</a>.</p>';
  }
  function hist() {
    var h = get(HKEY);
    if (!h.length) return;
    histEl.innerHTML = h.map(function (q, i) { return '<li><button type="button" data-pb-h="' + i + '">' + esc(q.length > 120 ? q.slice(0, 120) + '...' : q) + '</button></li>'; }).join('');
  }
  function fromHash() {
    var m = /^#(q|ex)=(.*)$/.exec(location.hash);
    exercise = null; exEl.hidden = true; checkBtn.hidden = true;
    if (!m) return;
    if (m[1] === 'q') { try { ta.value = decodeURIComponent(m[2]); } catch (e) {} out.innerHTML = ''; run(false); return; }
    (exercises ? Promise.resolve(exercises) : fetch('/sql/data/exercises.json').then(function (r) { return r.json(); })).then(function (j) {
      exercises = j;
      var e = j[m[2]];
      if (!e) return;
      e.id = m[2]; exercise = e;
      exEl.hidden = false; checkBtn.hidden = false;
      exEl.innerHTML = '<p class="cap">Exercise from lesson: <a href="/sql/' + e.lesson + '/">' + esc(e.title) + '</a></p><p><b>' + esc(e.q) + '</b></p><p class="hint">Write a query, then press Check my answer. The check runs on a fresh copy of the database and compares your rows with ours' + (e.ordered ? ', in order' : '') + '. Column names do not matter.</p>';
      ta.value = ''; out.innerHTML = ''; ta.focus();
    });
  }
  box.addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (!b) return;
    if (b.hasAttribute('data-pb-run')) run(false);
    else if (b.hasAttribute('data-pb-check')) run(true);
    else if (b.hasAttribute('data-pb-clear')) { ta.value = ''; out.innerHTML = ''; ta.focus(); }
    else if (b.hasAttribute('data-pb-reset')) ready().then(function () { fresh(); out.innerHTML = '<p class="msg ok">The practice database is back to how it started.</p>'; });
    else if (b.hasAttribute('data-pb-t')) { ta.value = 'SELECT * FROM ' + b.getAttribute('data-pb-t') + ';'; run(false); }
    else if (b.hasAttribute('data-pb-h')) { ta.value = get(HKEY)[+b.getAttribute('data-pb-h')] || ''; ta.focus(); }
  });
  ta.addEventListener('keydown', function (e) { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); run(!!exercise); } });
  window.addEventListener('hashchange', fromHash);
  hist(); fromHash();
})();
