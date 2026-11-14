/* learn.shareyourgroup.com/ratios: financial ratios from the numbers you type. Pure helpers first (the build checks them in Node against separate Python code), then the tool.
   Nothing is sent anywhere or saved. Every ratio uses the closing figures you type (no averages) and 365 days in a year, and the page says so. */
(function () {
  'use strict';
  var Q = {};
  /* inputs: key, label, group */
  Q.INPUTS = [
    ['revenue', 'Revenue (sales)', 'Profit and loss'], ['cogs', 'Cost of goods sold', 'Profit and loss'], ['ebit', 'Operating profit (EBIT)', 'Profit and loss'], ['interest', 'Interest expense', 'Profit and loss'], ['profit', 'Net profit', 'Profit and loss'],
    ['cash', 'Cash and bank', 'Balance sheet'], ['receivables', 'Receivables (debtors)', 'Balance sheet'], ['inventory', 'Inventory (stock)', 'Balance sheet'], ['ca', 'Total current assets', 'Balance sheet'], ['assets', 'Total assets', 'Balance sheet'],
    ['payables', 'Payables (creditors)', 'Balance sheet'], ['cl', 'Total current liabilities', 'Balance sheet'], ['liab', 'Total liabilities', 'Balance sheet'], ['equity', 'Shareholders\' equity', 'Balance sheet'], ['debt', 'Borrowings (total debt)', 'Balance sheet']
  ];
  /* ratio: key, name, group, unit, inputs needed, formula text, function of the inputs map */
  function div(a, b) { return b === 0 ? null : a / b; }
  Q.RATIOS = [
    ['current', 'Current ratio', 'Liquidity', 'times', ['ca', 'cl'], 'current assets / current liabilities', function (v) { return div(v.ca, v.cl); }],
    ['quick', 'Quick ratio', 'Liquidity', 'times', ['ca', 'inventory', 'cl'], '(current assets − inventory) / current liabilities', function (v) { return div(v.ca - v.inventory, v.cl); }],
    ['cashr', 'Cash ratio', 'Liquidity', 'times', ['cash', 'cl'], 'cash and bank / current liabilities', function (v) { return div(v.cash, v.cl); }],
    ['gross', 'Gross profit margin', 'Profitability', '%', ['revenue', 'cogs'], '(revenue − cost of goods sold) / revenue × 100', function (v) { var r = div(v.revenue - v.cogs, v.revenue); return r === null ? null : r * 100; }],
    ['opm', 'Operating profit margin', 'Profitability', '%', ['ebit', 'revenue'], 'operating profit / revenue × 100', function (v) { var r = div(v.ebit, v.revenue); return r === null ? null : r * 100; }],
    ['npm', 'Net profit margin', 'Profitability', '%', ['profit', 'revenue'], 'net profit / revenue × 100', function (v) { var r = div(v.profit, v.revenue); return r === null ? null : r * 100; }],
    ['roa', 'Return on assets', 'Profitability', '%', ['profit', 'assets'], 'net profit / total assets × 100', function (v) { var r = div(v.profit, v.assets); return r === null ? null : r * 100; }],
    ['roe', 'Return on equity', 'Profitability', '%', ['profit', 'equity'], 'net profit / shareholders\' equity × 100', function (v) { var r = div(v.profit, v.equity); return r === null ? null : r * 100; }],
    ['de', 'Debt to equity', 'Leverage', 'times', ['debt', 'equity'], 'borrowings / shareholders\' equity', function (v) { return div(v.debt, v.equity); }],
    ['dr', 'Debt ratio', 'Leverage', 'times', ['liab', 'assets'], 'total liabilities / total assets', function (v) { return div(v.liab, v.assets); }],
    ['icr', 'Interest cover', 'Leverage', 'times', ['ebit', 'interest'], 'operating profit / interest expense', function (v) { return div(v.ebit, v.interest); }],
    ['invt', 'Inventory turnover', 'Efficiency', 'times', ['cogs', 'inventory'], 'cost of goods sold / inventory', function (v) { return div(v.cogs, v.inventory); }],
    ['invd', 'Inventory days', 'Efficiency', 'days', ['inventory', 'cogs'], 'inventory / cost of goods sold × 365', function (v) { var r = div(v.inventory, v.cogs); return r === null ? null : r * 365; }],
    ['recd', 'Receivable days', 'Efficiency', 'days', ['receivables', 'revenue'], 'receivables / revenue × 365', function (v) { var r = div(v.receivables, v.revenue); return r === null ? null : r * 365; }],
    ['payd', 'Payable days', 'Efficiency', 'days', ['payables', 'cogs'], 'payables / cost of goods sold × 365', function (v) { var r = div(v.payables, v.cogs); return r === null ? null : r * 365; }],
    ['at', 'Asset turnover', 'Efficiency', 'times', ['revenue', 'assets'], 'revenue / total assets', function (v) { return div(v.revenue, v.assets); }]
  ];
  /* values: map key -> number, or null / undefined when not typed. Returns a map ratio key -> {value|null, why}: why is 'missing' (an input not typed) or 'zero' (the divisor is 0). */
  Q.compute = function (values) {
    var out = {};
    Q.RATIOS.forEach(function (r) {
      var missing = r[4].some(function (k) { return values[k] === null || values[k] === undefined || isNaN(values[k]); });
      if (missing) { out[r[0]] = { value: null, why: 'missing' }; return; }
      var x = r[6](values);
      out[r[0]] = x === null ? { value: null, why: 'zero' } : { value: x, why: '' };
    });
    return out;
  };
  Q.round = function (x, unit) { return Math.round(x * (unit === 'days' ? 10 : 100)) / (unit === 'days' ? 10 : 100); };
  if (typeof module !== 'undefined' && module.exports) { module.exports = Q; return; }
  window.RATIOS = Q;

  var d = document;
  function el(q) { return d.querySelector(q); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  var SAMPLE = { revenue: 1200000, cogs: 780000, ebit: 150000, interest: 30000, profit: 90000, cash: 60000, receivables: 150000, inventory: 140000, ca: 380000, assets: 900000, payables: 110000, cl: 250000, liab: 520000, equity: 380000, debt: 300000 };
  var box = el('[data-ratios]');
  if (box) {
    var groups = [], seen = {};
    Q.INPUTS.forEach(function (i) { if (!seen[i[2]]) { seen[i[2]] = 1; groups.push(i[2]); } });
    box.innerHTML = '<p class="fnote">Type the figures from your statements, all in the same currency and unit. You can leave a box empty: only the ratios that need it will be skipped.</p>' + groups.map(function (g) { return '<h3>' + esc(g) + '</h3><div class="fcalc">' + Q.INPUTS.filter(function (i) { return i[2] === g; }).map(function (i) { return '<label>' + esc(i[1]) + '<input type="number" step="any" inputmode="decimal" data-k="' + i[0] + '" value="' + SAMPLE[i[0]] + '" style="width:9em"></label>'; }).join('') + '</div>'; }).join('') + '<div class="btns"><button type="button" class="btn ghost" id="rclear">Clear all</button> <button type="button" class="btn ghost" id="rsample">Sample figures</button> <button type="button" class="btn" id="rprint">Print</button></div><div data-out aria-live="polite"></div>';
    var run = function () {
      var v = {};
      [].forEach.call(box.querySelectorAll('input[data-k]'), function (x) { v[x.getAttribute('data-k')] = x.value === '' ? null : +x.value; });
      var res = Q.compute(v), rows = '', shown = 0;
      Q.RATIOS.forEach(function (r) {
        var o = res[r[0]], cell = o.value !== null ? '<b>' + esc(String(Q.round(o.value, r[3]))) + ' ' + (r[3] === '%' ? '%' : r[3]) + '</b>' : (o.why === 'zero' ? 'cannot be worked out: divisor is 0' : 'type the figures needed');
        if (o.value !== null) shown++;
        rows += '<tr><td>' + esc(r[1]) + '</td><td>' + cell + '</td><td>' + esc(r[5]) + '</td></tr>';
      });
      box.querySelector('[data-out]').innerHTML = '<p class="fout">' + shown + ' of ' + Q.RATIOS.length + ' ratios worked out.</p><div class="tbl"><table><thead><tr><th>Ratio</th><th>Result</th><th>How it is worked out</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
    };
    box.addEventListener('input', run);
    box.addEventListener('click', function (e) {
      if (e.target.id === 'rprint') return window.print();
      if (e.target.id === 'rclear' || e.target.id === 'rsample') { [].forEach.call(box.querySelectorAll('input[data-k]'), function (x) { x.value = e.target.id === 'rsample' ? SAMPLE[x.getAttribute('data-k')] : ''; }); run(); }
    });
    run();
  }
})();
