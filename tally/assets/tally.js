/* Learn Tally: table filters and the ledger-group quiz. Nothing is stored or sent. */
(function () {
  'use strict';
  var d = document;
  function filter(inputId, rowsSel, noneId, chipsSel) {
    var q = d.getElementById(inputId); if (!q) return;
    var rows = d.querySelectorAll(rowsSel), none = d.getElementById(noneId), area = '';
    function run() {
      var v = q.value.trim().toLowerCase(), n = 0;
      Array.prototype.forEach.call(rows, function (r) {
        var hit = (!v || r.textContent.toLowerCase().indexOf(v) > -1) && (!area || r.getAttribute('data-a') === area || (area === 'key' && r.getAttribute('data-e') === '1'));
        r.hidden = !hit; if (hit) n++;
      });
      if (none) none.hidden = n > 0;
    }
    q.addEventListener('input', run);
    if (chipsSel) Array.prototype.forEach.call(d.querySelectorAll(chipsSel), function (b) {
      b.addEventListener('click', function () {
        area = b.getAttribute('data-area');
        Array.prototype.forEach.call(d.querySelectorAll(chipsSel), function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        run();
      });
    });
  }
  filter('lg-q', '#lg-t tbody tr', 'lg-none');
  filter('sc-q', '#sc-t tbody tr', 'sc-none', '[data-area]');
  var pr = d.getElementById('sc-print'); if (pr) pr.addEventListener('click', function () { window.print(); });

  /* quiz */
  var box = d.getElementById('gq'); if (!box || !window.TLQ) return;
  var Q = window.TLQ.q, G = window.TLQ.g, $ = function (id) { return d.getElementById(id); }, order = [], pos = 0, right = 0, done = 0, answered = false;
  function shuffle(a) { for (var j = a.length - 1; j > 0; j--) { var k = Math.floor(Math.random() * (j + 1)), t = a[j]; a[j] = a[k]; a[k] = t; } return a; }
  function show() {
    if (pos >= order.length) { order = shuffle(Q.map(function (_, i) { return i; })); pos = 0; }
    var q = Q[order[pos]], opts = [q[1]], pool = shuffle(G.filter(function (g) { return g !== q[1]; }));
    while (opts.length < 5) opts.push(pool.pop());
    shuffle(opts); answered = false;
    $('gq-n').textContent = 'Ledger ' + (done + 1);
    $('gq-q').textContent = q[0];
    $('gq-o').innerHTML = opts.map(function (o) { return '<button type="button" data-g="' + SYG.esc(o) + '">' + SYG.esc(o) + '</button>'; }).join('');
    $('gq-r').hidden = true; $('gq-next').hidden = true;
  }
  $('gq-o').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b || answered) return;
    var q = Q[order[pos]], ok = b.getAttribute('data-g') === q[1];
    answered = true; done++; if (ok) right++;
    Array.prototype.forEach.call($('gq-o').children, function (x) { if (x.getAttribute('data-g') === q[1]) x.classList.add('good'); else if (x === b) x.classList.add('bad'); x.disabled = true; });
    $('gq-r').hidden = false; $('gq-r').className = 'result' + (ok ? '' : ' no');
    $('gq-r').innerHTML = '<h2>' + (ok ? 'Correct' : 'Not quite') + '</h2><p><b>' + SYG.esc(q[0]) + '</b> goes under <b>' + SYG.esc(q[1]) + '</b>.</p>';
    $('gq-s').textContent = 'Score: ' + right + ' of ' + done;
    $('gq-next').hidden = false; $('gq-next').focus();
  });
  $('gq-next').addEventListener('click', function () { pos++; show(); });
  order = shuffle(Q.map(function (_, i) { return i; })); show();
})();
