/* learn.shareyourgroup.com/classics: book finder filter + quiz. Nothing is sent or stored. */
(function () {
  'use strict';
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  /* ---------- finder ---------- */
  var fd = $('[data-finder]');
  if (fd) {
    var lenF = 'all', themeF = 'all';
    var cards = $$('li[data-len]', fd);
    var cnt = $('.finder-count', fd);
    var apply = function () {
      var n = 0;
      cards.forEach(function (c) {
        var okL = lenF === 'all' || c.getAttribute('data-len') === lenF;
        var okT = themeF === 'all' || (' ' + c.getAttribute('data-themes') + ' ').indexOf(' ' + themeF + ' ') >= 0;
        c.hidden = !(okL && okT);
        if (!c.hidden) n++;
      });
      cnt.textContent = n === 1 ? '1 book matches' : n + ' books match';
      if (n === 0) cnt.textContent = 'No book matches both choices. Try "Any".';
    };
    $$('[data-group]', fd).forEach(function (grp) {
      var kind = grp.getAttribute('data-group');
      $$('button', grp).forEach(function (b) {
        b.addEventListener('click', function () {
          $$('button', grp).forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
          if (kind === 'len') lenF = b.getAttribute('data-v'); else themeF = b.getAttribute('data-v');
          apply();
        });
      });
    });
    apply();
  }

  /* ---------- quiz ---------- */
  var root = $('[data-quiz]');
  if (!root) return;
  var src = root.getAttribute('data-src');
  var count = parseInt(root.getAttribute('data-count') || '8', 10);
  var box = $('.q-box', root);
  box.textContent = 'Loading questions...';
  fetch(src).then(function (r) { return r.json(); }).then(start).catch(function () { box.textContent = 'The questions could not load. Please reload the page.'; });

  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }

  function start(all) {
    var qs = shuffle(all.q).slice(0, count);
    var i = 0, score = 0;
    function show() {
      box.textContent = '';
      var q = qs[i];
      box.appendChild(el('p', 'q-meta', 'Question ' + (i + 1) + ' of ' + qs.length + ' · ' + q.book));
      var h = el('h3', '', q.q); h.setAttribute('tabindex', '-1'); box.appendChild(h);
      var opts = el('div', 'q-opts');
      var note = el('div'); note.setAttribute('aria-live', 'polite');
      var order = shuffle(q.o.map(function (t, k) { return { t: t, k: k }; }));
      order.forEach(function (o) {
        var b = el('button', '', o.t); b.type = 'button';
        b.addEventListener('click', function () {
          var good = o.k === 0;
          if (good) score++;
          $$('button', opts).forEach(function (x) { x.disabled = true; });
          b.classList.add(good ? 'good' : 'wrong');
          if (!good) $$('button', opts).forEach(function (x) { if (x.textContent === q.o[0]) x.classList.add('good'); });
          var n = el('div', 'q-note ' + (good ? 'ok' : 'bad'));
          n.appendChild(el('b', '', good ? 'Correct. ' : 'Not quite. The answer is ' + q.o[0] + '. '));
          n.appendChild(document.createTextNode('See ' + q.ref + ' of the text.'));
          note.appendChild(n);
          var nx = el('button', 'btn', i + 1 < qs.length ? 'Next question' : 'See my score'); nx.type = 'button';
          nx.addEventListener('click', function () { i++; if (i < qs.length) show(); else done(); });
          var w = el('div', 'btns'); w.appendChild(nx); note.appendChild(w);
          nx.focus();
        });
        opts.appendChild(b);
      });
      box.appendChild(opts); box.appendChild(note);
      h.focus();
    }
    function done() {
      box.textContent = '';
      var h = el('h3', '', 'You scored ' + score + ' out of ' + qs.length + '.'); h.setAttribute('tabindex', '-1');
      box.appendChild(h);
      var msg = score === qs.length ? 'A perfect round.' : score === 0 ? 'No points this time: read the guide, then try again.' : 'Read the chapter summaries for the ones you missed, then play again.';
      box.appendChild(el('p', '', msg));
      var b = el('button', 'btn', 'Play again'); b.type = 'button';
      b.addEventListener('click', function () { start(all); });
      var w = el('div', 'btns'); w.appendChild(b); box.appendChild(w);
      h.focus();
    }
    show();
  }
})();
