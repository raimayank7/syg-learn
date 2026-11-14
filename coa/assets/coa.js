/* learn.shareyourgroup.com/coa: ready charts of accounts to read, tick, add to and download as CSV. Pure helpers first (the build checks them in Node against separate Python code),
   then the tool. The CSV is made in the browser; nothing is sent anywhere. */
(function () {
  'use strict';
  var K = {};
  K.CLASS = { A: 'Asset', L: 'Liability', E: 'Equity', I: 'Income', X: 'Expense' };
  K.HEADER = ['Code', 'Account', 'Class', 'Normal balance', 'Appears in', 'Contra account', 'Description'];
  var DEF = { A: 'Debit', L: 'Credit', E: 'Credit', I: 'Credit', X: 'Debit' };
  K.normal = function (cls, contra) { var d = DEF[cls]; return contra ? (d === 'Debit' ? 'Credit' : 'Debit') : d; };
  K.statement = function (cls) { return 'ALE'.indexOf(cls) >= 0 ? 'Position statement' : 'Profit statement'; };
  /* RFC 4180: quote a field that holds a comma, a quote or a line break */
  K.csv = function (header, rows) {
    function f(x) { x = String(x); return /[",\r\n]/.test(x) ? '"' + x.replace(/"/g, '""') + '"' : x; }
    return [header].concat(rows).map(function (r) { return r.map(f).join(','); }).join('\r\n') + '\r\n';
  };
  K.line = function (r) { return [r.code, r.name, K.CLASS[r.cls], K.normal(r.cls, r.contra), K.statement(r.cls), r.contra ? 'Yes' : 'No', r.desc]; };
  /* accounts: [{code, name, cls, contra, desc}], picked: array of booleans */
  K.export = function (accounts, picked) {
    return K.csv(K.HEADER, accounts.filter(function (a, i) { return picked[i]; }).map(K.line));
  };
  K.filter = function (accounts, q, cls) {
    var words = String(q || '').toLowerCase().split(/\s+/).filter(Boolean), out = [];
    accounts.forEach(function (a, i) {
      if (cls && a.cls !== cls) return;
      var hay = (a.code + ' ' + a.name + ' ' + a.desc + ' ' + K.CLASS[a.cls]).toLowerCase();
      if (words.every(function (w) { return hay.indexOf(w) >= 0; })) out.push(i);
    });
    return out;
  };
  K.stats = function (accounts) {
    var s = { A: 0, L: 0, E: 0, I: 0, X: 0, contra: 0 };
    accounts.forEach(function (a) { s[a.cls]++; if (a.contra) s.contra++; });
    return s;
  };
  function key(a) { return /^\d+$/.test(a.code) ? [parseInt(a.code, 10), a.code] : [1e18, a.code]; }
  K.sort = function (accounts) {
    return accounts.slice().sort(function (x, y) { var a = key(x), b = key(y); return a[0] - b[0] || (a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0); });
  };
  /* returns {ok:true, accounts} or {ok:false, error: 'code'|'dup'|'name'|'cls'} */
  K.add = function (accounts, n) {
    var code = String(n.code || '').trim(), name = String(n.name || '').replace(/\s+/g, ' ').trim();
    if (!code || code.length > 12 || /[\r\n]/.test(code)) return { ok: false, error: 'code' };
    if (accounts.some(function (a) { return a.code === code; })) return { ok: false, error: 'dup' };
    if (!name || name.length > 80) return { ok: false, error: 'name' };
    if (!DEF.hasOwnProperty(n.cls)) return { ok: false, error: 'cls' };
    return { ok: true, accounts: K.sort(accounts.concat([{ code: code, name: name, cls: n.cls, contra: !!n.contra, desc: String(n.desc || '').replace(/\s+/g, ' ').trim() }])) };
  };
  if (typeof module !== 'undefined' && module.exports) { module.exports = K; return; }
  window.COA = K;

  /* ---------- the tool ---------- */
  var d = document;
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  var box = d.querySelector('[data-coa]');
  if (!box) return;
  var fixed = box.getAttribute('data-chart');
  var DATA = null, accounts = [], picked = [], key0 = fixed || 'starter';
  box.innerHTML = '<p class="fnote" data-loading>Loading the charts…</p>';
  fetch('/coa/data/charts.json').then(function (r) { return r.json(); }).then(function (j) { DATA = j; start(); }).catch(function () { box.innerHTML = '<p class="cm-msg bad" role="status"><b>✘ </b>The chart could not be loaded. Reload the page, or use the table further down the page.</p>'; });

  function start() {
    var opts = Object.keys(DATA.charts).map(function (k) { return '<option value="' + k + '"' + (k === key0 ? ' selected' : '') + '>' + esc(DATA.charts[k].name) + '</option>'; }).join('');
    box.innerHTML = '<div class="fields">' + (fixed ? '' : '<label>Kind of business<select data-f="chart">' + opts + '</select></label>') +
      '<label>Show<select data-f="cls"><option value="">All classes</option>' + Object.keys(K.CLASS).map(function (c) { return '<option value="' + c + '">' + K.CLASS[c] + '</option>'; }).join('') + '</select></label><label>Search<input type="search" data-f="q" placeholder="for example rent or loan" autocomplete="off"></label></div>' +
      '<p class="fnote">Tick the accounts you want. Untick the ones you will never use. The download contains only the ticked accounts, including any you add.</p>' +
      '<div class="btns"><button type="button" class="btn" data-act="csv">Download CSV</button> <button type="button" class="btn ghost" data-act="copy">Copy as text</button> <button type="button" class="btn ghost" data-act="all">Tick all shown</button> <button type="button" class="btn ghost" data-act="none">Untick all shown</button> <button type="button" class="btn ghost" data-act="print">Print</button></div>' +
      '<p class="fout" data-count aria-live="polite"></p><div data-table></div><div data-msg aria-live="polite"></div>' +
      '<details><summary>Add your own account</summary><div class="fields"><label>Code<input type="text" data-n="code" maxlength="12"></label><label>Account name<input type="text" data-n="name" maxlength="80"></label><label>Class<select data-n="cls">' + Object.keys(K.CLASS).map(function (c) { return '<option value="' + c + '">' + K.CLASS[c] + '</option>'; }).join('') + '</select></label><label>Description (optional)<input type="text" data-n="desc"></label><label class="chk"><input type="checkbox" data-n="contra"> Contra account (balance on the opposite side)</label></div><div class="btns"><button type="button" class="btn ghost" data-act="add">Add the account</button></div></details>';
    load(key0);
    box.addEventListener('input', render);
    box.addEventListener('change', function (e) { if (e.target.getAttribute('data-f') === 'chart') load(e.target.value); else render(); });
    box.addEventListener('click', onClick);
  }
  function load(k) { key0 = k; accounts = DATA.charts[k].rows.map(function (r) { return { code: r.code, name: r.name, cls: r.cls, contra: r.contra, desc: r.desc }; }); picked = accounts.map(function () { return true; }); render(); }
  function shown() { return K.filter(accounts, box.querySelector('[data-f=q]').value, box.querySelector('[data-f=cls]').value); }
  function render() {
    var idx = shown(), body = idx.map(function (i) { var a = accounts[i]; return '<tr><td><input type="checkbox" data-i="' + i + '"' + (picked[i] ? ' checked' : '') + ' aria-label="Use ' + esc(a.name) + '"></td><td>' + esc(a.code) + '</td><td>' + esc(a.name) + (a.contra ? ' <i>(contra)</i>' : '') + '<br><span class="fnote">' + esc(a.desc) + '</span></td><td>' + K.CLASS[a.cls] + '</td><td>' + K.normal(a.cls, a.contra) + '</td></tr>'; }).join('');
    box.querySelector('[data-table]').innerHTML = '<div class="tbl"><table><thead><tr><th>Use</th><th>Code</th><th>Account</th><th>Class</th><th>Normal balance</th></tr></thead><tbody>' + (body || '<tr><td colspan="5">No account matches.</td></tr>') + '</tbody></table></div>';
    var n = picked.filter(Boolean).length;
    box.querySelector('[data-count]').textContent = n + ' of ' + accounts.length + ' accounts ticked (' + idx.length + ' shown).';
  }
  function say(ok, t) { box.querySelector('[data-msg]').innerHTML = '<p class="cm-msg ' + (ok ? 'ok' : 'bad') + '" role="status"><b>' + (ok ? '✔ ' : '✘ ') + '</b>' + esc(t) + '</p>'; }
  function onClick(e) {
    var t = e.target, a = t.getAttribute && t.getAttribute('data-act');
    if (t.getAttribute && t.getAttribute('data-i') !== null) { picked[+t.getAttribute('data-i')] = t.checked; box.querySelector('[data-count]').textContent = picked.filter(Boolean).length + ' of ' + accounts.length + ' accounts ticked (' + shown().length + ' shown).'; return; }
    if (!a) return;
    if (a === 'print') return window.print();
    if (a === 'all' || a === 'none') { shown().forEach(function (i) { picked[i] = a === 'all'; }); render(); return; }
    if (a === 'csv' || a === 'copy') {
      if (!picked.some(Boolean)) { say(false, 'Nothing is ticked. Tick at least one account.'); return; }
      var text = K.export(accounts, picked);
      if (a === 'copy') {
        var plain = accounts.filter(function (x, i) { return picked[i]; }).map(function (r) { return K.line(r).slice(0, 4).join('\t'); }).join('\n');
        (navigator.clipboard && navigator.clipboard.writeText ? navigator.clipboard.writeText(plain) : Promise.reject()).then(function () { say(true, 'Copied. Paste it into a spreadsheet or a document.'); }, function () { say(false, 'Your browser did not allow copying. Use Download CSV instead.'); });
        return;
      }
      var blob = new Blob(['﻿' + text], { type: 'text/csv;charset=utf-8' }), url = URL.createObjectURL(blob), l = d.createElement('a');
      l.href = url; l.download = 'chart-of-accounts-' + key0 + '.csv'; d.body.appendChild(l); l.click(); d.body.removeChild(l);
      setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
      say(true, 'Downloaded ' + picked.filter(Boolean).length + ' accounts as chart-of-accounts-' + key0 + '.csv. Open it in a spreadsheet.');
      return;
    }
    if (a === 'add') {
      var n = {}; [].forEach.call(box.querySelectorAll('[data-n]'), function (x) { n[x.getAttribute('data-n')] = x.type === 'checkbox' ? x.checked : x.value; });
      var r = K.add(accounts, n);
      if (!r.ok) { say(false, { code: 'Give a code of 1 to 12 characters.', dup: 'That code is already used by another account.', name: 'Give an account name of 1 to 80 characters.', cls: 'Choose a class.' }[r.error]); return; }
      var tick = {}; accounts.forEach(function (x, i) { tick[x.code] = picked[i]; });
      accounts = r.accounts; picked = accounts.map(function (x) { return x.code in tick ? tick[x.code] : true; });
      [].forEach.call(box.querySelectorAll('[data-n]'), function (x) { if (x.type === 'checkbox') x.checked = false; else if (x.tagName !== 'SELECT') x.value = ''; });
      say(true, 'Added. It is ticked and will be in the download.'); render();
    }
  }
})();
