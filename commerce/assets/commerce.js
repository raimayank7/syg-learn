/* learn.shareyourgroup.com/commerce: journal, ledger, trial balance, simple final accounts, depreciation and bank reconciliation from the entries you type.
   Pure functions first (the build checks them in Node against a separate Python program using Decimal), then the tools. Amounts are whole paise/cents.
   Nothing you type is sent anywhere or saved. */
(function () {
  'use strict';
  var C = {};
  C.TYPES = [['asset', 'Asset'], ['liability', 'Liability'], ['capital', 'Capital (owner\'s money put in)'], ['drawings', 'Drawings (owner took out)'], ['revenue', 'Sales or service income'], ['direct', 'Direct cost (purchases, freight in)'], ['expense', 'Other expense'], ['otherinc', 'Other income']];
  var DEBIT_NATURE = { asset: 1, drawings: 1, direct: 1, expense: 1 };

  C.parse = function (s) {
    s = String(s === null || s === undefined ? '' : s).replace(/[,\s]/g, '');
    if (s === '') return { ok: true, c: 0 };
    var m = /^(\d{0,10})(?:\.(\d{1,2}))?$/.exec(s);
    if (!m || (m[1] === '' && m[2] === undefined)) return { ok: false };
    return { ok: true, c: parseInt(m[1] || '0', 10) * 100 + (m[2] ? parseInt((m[2] + '0').slice(0, 2), 10) : 0) };
  };
  C.norm = function (n) { return String(n === null || n === undefined ? '' : n).replace(/\s+/g, ' ').trim(); };
  C.fmt = function (c) {
    var neg = c < 0; if (neg) c = -c;
    var i = Math.floor(c / 100), f = c % 100;
    return (neg ? '-' : '') + String(i).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.' + (f < 10 ? '0' : '') + f;
  };
  function check(acct, d, c) {
    if (!d.ok || !c.ok) return 'bad';
    if (d.c > 0 && c.c > 0) return 'both';
    if (acct === '') return 'noacct';
    if (d.c === 0 && c.c === 0) return 'noamt';
    return null;
  }
  function sum(a, k) { var t = 0; a.forEach(function (x) { t += x[k]; }); return t; }

  /* rows: [{no, acct, dr, cr}] as typed (strings). */
  C.post = function (rows) {
    var errors = [], lines = [], prev = '1';
    rows.forEach(function (r, i) {
      var acct = C.norm(r.acct), dr = String(r.dr || '').trim(), cr = String(r.cr || '').trim(), no = C.norm(r.no);
      if (acct === '' && dr === '' && cr === '') return;
      var eno = no || prev; prev = eno;
      var d = C.parse(dr), c = C.parse(cr), code = check(acct, d, c);
      if (code) { errors.push({ row: i, code: code }); return; }
      lines.push({ no: eno, acct: acct, dr: d.c, cr: c.c });
    });
    var display = {};
    lines.forEach(function (l) { var k = l.acct.toLowerCase(); if (!(k in display)) display[k] = l.acct; });
    var entries = {}, eorder = [];
    lines.forEach(function (l) { if (!entries.hasOwnProperty(l.no)) { entries[l.no] = []; eorder.push(l.no); } entries[l.no].push(l); });
    var entOut = eorder.map(function (no) { var dr = sum(entries[no], 'dr'), cr = sum(entries[no], 'cr'); return { no: no, dr: dr, cr: cr, diff: dr - cr, n: entries[no].length }; });
    var ledger = {}, order = [];
    lines.forEach(function (l) {
      var k = l.acct.toLowerCase();
      if (!ledger.hasOwnProperty(k)) { ledger[k] = { name: display[k], lines: [], dr: 0, cr: 0, bal: 0 }; order.push(k); }
      var L = ledger[k]; L.dr += l.dr; L.cr += l.cr; L.bal = L.dr - L.cr;
      var other = [], seen = {};
      entries[l.no].forEach(function (o) {
        if ((l.dr > 0 && o.cr > 0) || (l.cr > 0 && o.dr > 0)) { var ok = o.acct.toLowerCase(); if (!seen[ok]) { seen[ok] = 1; other.push(display[ok]); } }
      });
      L.lines.push({ no: l.no, dr: l.dr, cr: l.cr, bal: L.bal, other: other });
    });
    var tbRows = order.map(function (k) { var b = ledger[k].bal; return { name: ledger[k].name, dr: b > 0 ? b : 0, cr: b < 0 ? -b : 0 }; });
    var tdr = sum(tbRows, 'dr'), tcr = sum(tbRows, 'cr');
    return { errors: errors, entries: entOut, ledger: order.map(function (k) { return ledger[k]; }), tb: { rows: tbRows, dr: tdr, cr: tcr, diff: tdr - tcr } };
  };

  /* rows: [{acct, type, dr, cr}] */
  C.final = function (rows) {
    var errors = [], out = [];
    rows.forEach(function (r, i) {
      var acct = C.norm(r.acct), dr = String(r.dr || '').trim(), cr = String(r.cr || '').trim(), t = r.type || '';
      if (acct === '' && dr === '' && cr === '') return;
      var d = C.parse(dr), c = C.parse(cr), code = check(acct, d, c);
      if (!code && !C.TYPES.some(function (x) { return x[0] === t; })) code = 'notype';
      if (code) { errors.push({ row: i, code: code }); return; }
      out.push({ acct: acct, type: t, dr: d.c, cr: c.c });
    });
    var unusual = out.filter(function (r) { return DEBIT_NATURE[r.type] ? r.dr - r.cr < 0 : r.dr - r.cr > 0; }).map(function (r) { return r.acct; });
    var sums = {};
    C.TYPES.forEach(function (x) {
      var net = 0; out.forEach(function (r) { if (r.type === x[0]) net += r.dr - r.cr; });
      sums[x[0]] = DEBIT_NATURE[x[0]] ? net : -net;
    });
    var tdr = sum(out, 'dr'), tcr = sum(out, 'cr');
    var gp = sums.revenue - sums.direct, np = gp + sums.otherinc - sums.expense, ccap = sums.capital + np - sums.drawings, lhs = sums.liability + ccap;
    return { errors: errors, rows: out, tb: { dr: tdr, cr: tcr, diff: tdr - tcr }, sums: sums, gp: gp, np: np, ccap: ccap, assets: sums.asset, lhs: lhs, diff: sums.asset - lhs, unusual: unusual };
  };

  /* o: {cost, salvage, life, method: 'slm'|'wdv', rate} as typed */
  C.depr = function (o) {
    var cost = C.parse(o.cost), salv = C.parse(o.salvage);
    if (!cost.ok || cost.c <= 0 || String(o.cost || '').trim() === '') return { ok: false, error: 'cost' };
    if (!salv.ok || salv.c > cost.c) return { ok: false, error: 'salvage' };
    var ls = String(o.life === undefined || o.life === null ? '' : o.life).trim();
    if (!/^\d{1,3}$/.test(ls) || +ls < 1 || +ls > 100) return { ok: false, error: 'life' };
    var life = +ls, rbp = 0;
    if (o.method === 'wdv') {
      var rt = C.parse(o.rate);
      if (!rt.ok || rt.c <= 0 || rt.c > 10000 || String(o.rate || '').trim() === '') return { ok: false, error: 'rate' };
      rbp = rt.c;
    }
    var rows = [], open = cost.c, total = cost.c - salv.c, base = Math.floor(total / life), t = 0;
    for (var y = 1; y <= life; y++) {
      var dep;
      if (o.method === 'wdv') {
        dep = Number((2n * BigInt(open) * BigInt(rbp) + 10000n) / 20000n);
        if (dep > open - salv.c) dep = open - salv.c;
      } else dep = y < life ? base : total - base * (life - 1);
      rows.push({ year: y, open: open, dep: dep, close: open - dep });
      open -= dep; t += dep;
    }
    return { ok: true, rows: rows, total: t, cost: cost.c, salvage: salv.c };
  };

  /* o: {cbSign, cb, bkSign, bk, items: [{t, a}]} t = cb_in | cb_out | bk_dep | bk_chq */
  C.bank = function (o) {
    var errors = [];
    function val(where, s, sign) { var p = C.parse(s); if (!p.ok) { errors.push({ where: where, code: 'bad' }); return 0; } return sign === 'over' ? -p.c : p.c; }
    var cb = val('cb', o.cb, o.cbSign), bk = val('bk', o.bk, o.bkSign);
    var sums = { cb_in: 0, cb_out: 0, bk_dep: 0, bk_chq: 0 };
    (o.items || []).forEach(function (it, i) {
      var a = String(it.a === undefined || it.a === null ? '' : it.a).trim();
      if (a === '') return;
      if (!sums.hasOwnProperty(it.t)) { errors.push({ where: 'item' + i, code: 'type' }); return; }
      var p = C.parse(a);
      if (!p.ok) { errors.push({ where: 'item' + i, code: 'bad' }); return; }
      sums[it.t] += p.c;
    });
    var cbadj = cb + sums.cb_in - sums.cb_out, bkadj = bk + sums.bk_dep - sums.bk_chq;
    return { errors: errors, cb: cb, bk: bk, sums: sums, cbadj: cbadj, bkadj: bkadj, diff: cbadj - bkadj };
  };

  if (typeof module !== 'undefined' && module.exports) { module.exports = C; return; }
  window.COMMERCE = C;

  /* ---------- the tools ---------- */
  var d = document, fmt = C.fmt;
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function tbl(head, rows, cls) {
    return '<div class="tbl"><table' + (cls ? ' class="' + cls + '"' : '') + '><thead><tr>' + head.map(function (h, i) { return '<th' + (/^~/.test(h) ? ' class="n"' : '') + '>' + esc(h.replace(/^~/, '')) + '</th>'; }).join('') + '</tr></thead><tbody>' +
      rows.map(function (r) { return '<tr' + (r.cls ? ' class="' + r.cls + '"' : '') + '>' + r.c.map(function (c, i) { return '<td' + (/^~/.test(head[i]) ? ' class="n"' : '') + '>' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>';
  }
  function amt(c) { return c ? fmt(c) : ''; }
  function side(c) { return c === 0 ? '0.00' : fmt(Math.abs(c)) + (c > 0 ? ' Dr' : ' Cr'); }
  function msg(ok, text) { return '<p class="cm-msg ' + (ok ? 'ok' : 'bad') + '" role="status"><b>' + (ok ? '✔ ' : '✘ ') + '</b>' + text + '</p>'; }
  var ERR = {
    bad: 'an amount is not a number (use digits, and at most 2 decimals)',
    both: 'has both a debit and a credit amount; put each on its own line',
    noacct: 'has an amount but no account name',
    noamt: 'has an account but no amount',
    notype: 'has no type chosen'
  };
  function errList(errs) {
    if (!errs.length) return '';
    return '<div class="cm-err"><p><b>These rows were not used:</b></p><ul>' + errs.map(function (e) { return '<li>Row ' + (e.row + 1) + ' ' + ERR[e.code] + '.</li>'; }).join('') + '</ul></div>';
  }
  function inp(cls, label, v, extra) { return '<input class="' + cls + '" type="text" inputmode="' + (cls === 'cm-a' ? 'text' : (cls === 'cm-n' ? 'text' : 'decimal')) + '" autocomplete="off" aria-label="' + esc(label) + '" value="' + esc(v || '') + '"' + (extra || '') + '>'; }

  function rowsTool(box, kind) {
    var sample = [];
    try { sample = JSON.parse(box.getAttribute('data-sample') || '[]'); } catch (e) { }
    var MAXR = 300;
    var tbody, out;
    function typeSel(v, n) { return '<select class="cm-t" aria-label="Row ' + n + ' type">' + '<option value="">Type…</option>' + C.TYPES.map(function (t) { return '<option value="' + t[0] + '"' + (t[0] === v ? ' selected' : '') + '>' + esc(t[1]) + '</option>'; }).join('') + '</select>'; }
    function rowHtml(v, n) {
      if (kind === 'journal') return '<tr><td>' + inp('cm-n', 'Row ' + n + ' entry number', v.no) + '</td><td>' + inp('cm-a', 'Row ' + n + ' account', v.acct) + '</td><td>' + inp('cm-d', 'Row ' + n + ' debit', v.dr) + '</td><td>' + inp('cm-c', 'Row ' + n + ' credit', v.cr) + '</td></tr>';
      return '<tr><td>' + inp('cm-a', 'Row ' + n + ' account', v.acct) + '</td><td>' + typeSel(v.type, n) + '</td><td>' + inp('cm-d', 'Row ' + n + ' debit', v.dr) + '</td><td>' + inp('cm-c', 'Row ' + n + ' credit', v.cr) + '</td></tr>';
    }
    function add(vals) { tbody.insertAdjacentHTML('beforeend', rowHtml(vals || {}, tbody.children.length + 1)); }
    function fill(rows, min) {
      tbody.innerHTML = '';
      rows.forEach(function (r) { add(r); });
      while (tbody.children.length < min) add();
    }
    function read() {
      return [].map.call(tbody.children, function (tr) {
        var q = function (c) { var e = tr.querySelector(c); return e ? e.value : ''; };
        return kind === 'journal' ? { no: q('.cm-n'), acct: q('.cm-a'), dr: q('.cm-d'), cr: q('.cm-c') } : { acct: q('.cm-a'), type: q('.cm-t'), dr: q('.cm-d'), cr: q('.cm-c') };
      });
    }
    var head = kind === 'journal' ? ['Entry no.', 'Account', 'Debit', 'Credit'] : ['Account', 'Type', 'Debit', 'Credit'];
    box.innerHTML = '<p class="fnote">' + (kind === 'journal' ? 'One line per account. Leave the entry number empty to continue the entry above. Put the amount in Debit or in Credit, never both. Use the same spelling for the same account (capitals and extra spaces do not matter).' : 'Type your trial balance: one line per account, the amount in Debit or Credit, and choose what kind of account it is.') + '</p>' +
      '<div class="tbl"><table class="cm-in"><thead><tr>' + head.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr></thead><tbody data-rows></tbody></table></div>' +
      '<div class="btns"><button type="button" class="btn ghost" data-act="more">Add 5 rows</button> <button type="button" class="btn ghost" data-act="less">Remove last row</button> <button type="button" class="btn ghost" data-act="sample">Sample</button> <button type="button" class="btn ghost" data-act="clear">Clear all</button> <button type="button" class="btn" data-act="print">Print</button></div><div data-out aria-live="polite"></div>';
    tbody = box.querySelector('[data-rows]'); out = box.querySelector('[data-out]');
    fill(sample, 8);

    function run() {
      var rows = read();
      if (kind === 'journal') out.innerHTML = showJournal(C.post(rows)); else out.innerHTML = showFinal(C.final(rows));
    }
    box.addEventListener('input', run);
    box.addEventListener('change', run);
    box.addEventListener('click', function (e) {
      var a = e.target.getAttribute && e.target.getAttribute('data-act');
      if (!a) return;
      if (a === 'print') return window.print();
      if (a === 'more') { for (var i = 0; i < 5 && tbody.children.length < MAXR; i++) add(); }
      if (a === 'less' && tbody.children.length > 1) tbody.removeChild(tbody.lastChild);
      if (a === 'sample') fill(sample, 8);
      if (a === 'clear') fill([], 8);
      run();
    });
    run();
  }

  function showJournal(r) {
    var h = errList(r.errors);
    if (!r.entries.length) return h + '<p class="fnote">Type some entries above. The checks, ledger accounts and trial balance appear here.</p>';
    var bad = r.entries.filter(function (e) { return e.diff !== 0; }), sumbad = 0;
    bad.forEach(function (e) { sumbad += e.diff; });
    h += '<h3>1. Does each entry balance?</h3>' + tbl(['Entry', '~Debits', '~Credits', 'Check'], r.entries.map(function (e) {
      return { c: [esc(e.no), fmt(e.dr), fmt(e.cr), e.diff === 0 ? '✔ balanced' : '✘ NOT balanced: ' + (e.diff > 0 ? 'debits are more by ' : 'credits are more by ') + fmt(Math.abs(e.diff))], cls: e.diff === 0 ? '' : 'bad' };
    }));
    h += bad.length ? msg(false, bad.length + (bad.length === 1 ? ' entry does' : ' entries do') + ' not balance. Every entry must have equal debits and credits. Fix those first.') : msg(true, 'Every entry has equal debits and credits.');
    h += '<h3>2. Ledger accounts</h3>';
    r.ledger.forEach(function (L) {
      h += '<h4>' + esc(L.name) + ' account</h4>' + tbl(['Entry', 'Other account(s) in the entry', '~Debit', '~Credit', '~Balance'], L.lines.map(function (l) {
        return { c: [esc(l.no), esc(l.other.join(', ') || '—'), amt(l.dr), amt(l.cr), side(l.bal)] };
      }).concat([{ cls: 'tot', c: ['', '<b>Total</b>', '<b>' + fmt(L.dr) + '</b>', '<b>' + fmt(L.cr) + '</b>', '<b>' + side(L.bal) + '</b>'] }]));
    });
    h += '<h3>3. Trial balance</h3>' + tbl(['Account', '~Debit balance', '~Credit balance'], r.tb.rows.map(function (x) { return { c: [esc(x.name), amt(x.dr), amt(x.cr)] }; }).concat([{ cls: 'tot', c: ['<b>Total</b>', '<b>' + fmt(r.tb.dr) + '</b>', '<b>' + fmt(r.tb.cr) + '</b>'] }]));
    if (r.tb.diff === 0) h += msg(true, 'The trial balance totals agree. That shows the debits and credits are equal; it does not prove every account is right (see <a href="/commerce/common-accounting-mistakes/">mistakes a trial balance cannot catch</a>).');
    else h += msg(false, 'The trial balance does NOT agree: ' + (r.tb.diff > 0 ? 'debits are more by ' : 'credits are more by ') + fmt(Math.abs(r.tb.diff)) + '. ' + (bad.length ? 'The unbalanced entries above add up to the same difference (' + fmt(Math.abs(sumbad)) + '), so find and fix them.' : 'Look for a wrong amount or an account typed with two different spellings.'));
    return h;
  }

  function showFinal(r) {
    var h = errList(r.errors);
    if (!r.rows.length) return h + '<p class="fnote">Type a trial balance above. The profit statement and the position statement appear here.</p>';
    var s = r.sums, N = function (c) { return c < 0 ? '(' + fmt(-c) + ')' : fmt(c); };
    h += r.tb.diff === 0 ? msg(true, 'The trial balance agrees: debits ' + fmt(r.tb.dr) + ' and credits ' + fmt(r.tb.cr) + '.') : msg(false, 'The trial balance does NOT agree: debits ' + fmt(r.tb.dr) + ' and credits ' + fmt(r.tb.cr) + ' (difference ' + fmt(Math.abs(r.tb.diff)) + '). The statements below cannot be trusted until it agrees.');
    h += '<h3>Profit statement</h3>' + tbl(['Item', '~Amount'], [
      { c: ['Sales or service income', fmt(s.revenue)] }, { c: ['Less: direct costs', N(-s.direct)] }, { cls: 'tot', c: ['<b>Gross profit</b>', '<b>' + N(r.gp) + '</b>'] },
      { c: ['Add: other income', fmt(s.otherinc)] }, { c: ['Less: other expenses', N(-s.expense)] }, { cls: 'tot', c: ['<b>' + (r.np < 0 ? 'Net loss' : 'Net profit') + '</b>', '<b>' + N(r.np) + '</b>'] }]);
    h += '<h3>Position statement (balance sheet)</h3>' + tbl(['Item', '~Amount'], [
      { c: ['Capital at the start (as in the trial balance)', fmt(s.capital)] }, { c: ['Add: ' + (r.np < 0 ? 'net loss' : 'net profit'), N(r.np)] }, { c: ['Less: drawings', N(-s.drawings)] }, { cls: 'tot', c: ['<b>Closing capital</b>', '<b>' + N(r.ccap) + '</b>'] },
      { c: ['Liabilities', fmt(s.liability)] }, { cls: 'tot', c: ['<b>Capital + liabilities</b>', '<b>' + N(r.lhs) + '</b>'] }, { cls: 'tot', c: ['<b>Assets</b>', '<b>' + N(r.assets) + '</b>'] }]);
    h += r.diff === 0 ? msg(true, 'Assets equal capital plus liabilities (' + N(r.assets) + '). This always follows when the trial balance agrees, so it checks the arithmetic, not your choice of types.') : msg(false, 'Assets and capital plus liabilities differ by ' + fmt(Math.abs(r.diff)) + '. This follows from the trial balance not agreeing.');
    if (r.unusual.length) h += msg(false, 'Unusual balance for the type chosen: ' + esc(r.unusual.join(', ')) + '. An asset or cost normally has a debit balance, and a liability, capital or income a credit balance. Check the type, or whether the account really has such a balance (for example an overdraft).');
    h += '<p class="fnote">This is a simple version: it has no closing stock, accruals or prepayments. Put those in the trial balance first, and use the layout your own course asks for.</p>';
    return h;
  }

  function deprTool(box) {
    box.innerHTML = '<div class="fields"><label>Cost of the asset<input type="text" inputmode="decimal" data-f="cost" value="500000"></label><label>Scrap (residual) value<input type="text" inputmode="decimal" data-f="salvage" value="50000"></label><label>Life in whole years<input type="text" inputmode="numeric" data-f="life" value="5"></label>' +
      '<label>Method<select data-f="method"><option value="slm">Straight line</option><option value="wdv">Reducing balance (written down value)</option></select></label><label data-ratef hidden>Rate per year, % of the opening value<input type="text" inputmode="decimal" data-f="rate" value="20"></label></div><div class="btns"><button type="button" class="btn" data-act="print">Print</button></div><div data-out aria-live="polite"></div>';
    var out = box.querySelector('[data-out]'), rf = box.querySelector('[data-ratef]');
    var E = { cost: 'The cost must be a number above 0 (digits, at most 2 decimals).', salvage: 'The scrap value must be a number from 0 up to the cost.', life: 'The life must be a whole number of years from 1 to 100.', rate: 'The rate must be above 0 and at most 100.' };
    function run() {
      var o = {}; [].forEach.call(box.querySelectorAll('[data-f]'), function (x) { o[x.getAttribute('data-f')] = x.value; });
      rf.hidden = o.method !== 'wdv';
      var r = C.depr(o);
      if (!r.ok) { out.innerHTML = msg(false, E[r.error]); return; }
      var first = r.rows[0];
      var h = tbl(['Year', '~Opening value', '~Depreciation', '~Closing value'], r.rows.map(function (x) { return { c: [x.year, fmt(x.open), fmt(x.dep), fmt(x.close)] }; }).concat([{ cls: 'tot', c: ['<b>Total</b>', '', '<b>' + fmt(r.total) + '</b>', '']}]));
      var last = r.rows[r.rows.length - 1];
      h += msg(r.total + last.close === r.cost, 'Total depreciation ' + fmt(r.total) + ' + closing value ' + fmt(last.close) + ' = cost ' + fmt(r.cost) + '.');
      h += '<p><b>Year 1 journal entry:</b> Depreciation account Dr ' + fmt(first.dep) + ', to the asset account (or to accumulated depreciation) Cr ' + fmt(first.dep) + '.</p>';
      if (o.method === 'wdv') h += '<p class="fnote">Depreciation is never taken below the scrap value you typed, and each year is rounded to the nearest paisa or cent.</p>'; else h += '<p class="fnote">Any odd paise left by dividing are added to the last year.</p>';
      out.innerHTML = h;
    }
    box.addEventListener('input', run); box.addEventListener('change', run);
    box.addEventListener('click', function (e) { if (e.target.getAttribute('data-act') === 'print') window.print(); });
    run();
  }

  var BTYPES = [['cb_in', 'Cash book side: money the bank received that the cash book does not show (direct deposit, interest)'], ['cb_out', 'Cash book side: money the bank took that the cash book does not show (charges, standing order, dishonoured cheque)'], ['bk_dep', 'Bank side: cheques or cash paid in, not yet credited by the bank'], ['bk_chq', 'Bank side: cheques issued, not yet presented to the bank']];
  function bankTool(box) {
    var sample = [];
    try { sample = JSON.parse(box.getAttribute('data-sample') || '[]'); } catch (e) { }
    var items;
    function sel(v, n) { return '<select class="cm-t" aria-label="Item ' + n + ' kind">' + BTYPES.map(function (t) { return '<option value="' + t[0] + '"' + (t[0] === v ? ' selected' : '') + '>' + esc(t[1]) + '</option>'; }).join('') + '</select>'; }
    function itemHtml(v, n) { return '<tr><td>' + sel(v.t, n) + '</td><td>' + inp('cm-a', 'Item ' + n + ' note', v.note) + '</td><td>' + inp('cm-d', 'Item ' + n + ' amount', v.a) + '</td></tr>'; }
    function fill(rows, min) { items.innerHTML = ''; rows.forEach(function (r, i) { items.insertAdjacentHTML('beforeend', itemHtml(r, i + 1)); }); while (items.children.length < min) items.insertAdjacentHTML('beforeend', itemHtml({}, items.children.length + 1)); }
    box.innerHTML = '<div class="fields"><label>Balance in the cash book<input type="text" inputmode="decimal" data-f="cb"></label><label>That balance is<select data-f="cbSign"><option value="fav">In the bank (favourable)</option><option value="over">Overdrawn</option></select></label>' +
      '<label>Balance on the bank statement<input type="text" inputmode="decimal" data-f="bk"></label><label>That balance is<select data-f="bkSign"><option value="fav">In the bank (favourable)</option><option value="over">Overdrawn</option></select></label></div>' +
      '<div class="tbl"><table class="cm-in"><thead><tr><th>Kind of difference</th><th>Note (optional)</th><th>Amount</th></tr></thead><tbody data-items></tbody></table></div>' +
      '<div class="btns"><button type="button" class="btn ghost" data-act="more">Add 3 rows</button> <button type="button" class="btn ghost" data-act="sample">Sample</button> <button type="button" class="btn ghost" data-act="clear">Clear all</button> <button type="button" class="btn" data-act="print">Print</button></div><div data-out aria-live="polite"></div>';
    items = box.querySelector('[data-items]');
    var out = box.querySelector('[data-out]');
    function setBal(s) { ['cb', 'cbSign', 'bk', 'bkSign'].forEach(function (k) { box.querySelector('[data-f="' + k + '"]').value = s[k] || (/Sign/.test(k) ? 'fav' : ''); }); }
    function load() { var s = sample.length ? sample[0] : {}; setBal(s.bal || {}); fill(s.items || [], 5); }
    function run() {
      var o = { items: [] };
      ['cb', 'cbSign', 'bk', 'bkSign'].forEach(function (k) { o[k] = box.querySelector('[data-f="' + k + '"]').value; });
      [].forEach.call(items.children, function (tr) { o.items.push({ t: tr.querySelector('.cm-t').value, a: tr.querySelector('.cm-d').value }); });
      var r = C.bank(o), h = '';
      if (r.errors.length) h += '<div class="cm-err"><p><b>Please check:</b></p><ul>' + r.errors.map(function (e) { return '<li>' + (e.where === 'cb' ? 'The cash book balance' : e.where === 'bk' ? 'The bank statement balance' : 'Item ' + (+e.where.slice(4) + 1) + '\'s amount') + ' is not a number (digits and at most 2 decimals).</li>'; }).join('') + '</ul></div>';
      var s = r.sums;
      h += '<h3>Corrected cash book balance</h3>' + tbl(['Item', '~Amount'], [{ c: ['Balance as per cash book (' + (r.cb < 0 ? 'overdrawn' : 'favourable') + ')', side2(r.cb)] }, { c: ['Add: received by the bank, not in the cash book', fmt(s.cb_in)] }, { c: ['Less: taken by the bank, not in the cash book', fmt(s.cb_out)] }, { cls: 'tot', c: ['<b>Corrected cash book balance</b>', '<b>' + side2(r.cbadj) + '</b>'] }]);
      h += '<h3>Corrected bank statement balance</h3>' + tbl(['Item', '~Amount'], [{ c: ['Balance as per bank statement (' + (r.bk < 0 ? 'overdrawn' : 'favourable') + ')', side2(r.bk)] }, { c: ['Add: paid in, not yet credited', fmt(s.bk_dep)] }, { c: ['Less: cheques issued, not yet presented', fmt(s.bk_chq)] }, { cls: 'tot', c: ['<b>Corrected bank statement balance</b>', '<b>' + side2(r.bkadj) + '</b>'] }]);
      h += r.diff === 0 ? msg(true, 'The two corrected balances agree at ' + side2(r.cbadj) + ': the statement is reconciled.') : msg(false, 'The two corrected balances do NOT agree: they differ by ' + fmt(Math.abs(r.diff)) + '. Something is missing or wrong: a difference not listed, an amount typed wrongly, or the wrong sign.');
      out.innerHTML = h;
    }
    function side2(c) { return c < 0 ? fmt(-c) + ' overdrawn' : fmt(c); }
    box.addEventListener('input', run); box.addEventListener('change', run);
    box.addEventListener('click', function (e) {
      var a = e.target.getAttribute && e.target.getAttribute('data-act');
      if (!a) return;
      if (a === 'print') return window.print();
      if (a === 'more') for (var i = 0; i < 3; i++) items.insertAdjacentHTML('beforeend', itemHtml({}, items.children.length + 1));
      if (a === 'sample') load();
      if (a === 'clear') { setBal({}); fill([], 5); }
      run();
    });
    load(); run();
  }

  [].forEach.call(d.querySelectorAll('[data-cm]'), function (box) {
    var k = box.getAttribute('data-cm');
    if (k === 'journal' || k === 'final') rowsTool(box, k); else if (k === 'depr') deprTool(box); else if (k === 'bank') bankTool(box);
  });
})();
