/* learn.shareyourgroup.com/sql: "lesson done" ticks and solved-exercise ticks, kept in this browser only */
(function () {
  'use strict';
  var d = document, KEY = 'sql-done';
  function load(k) { try { return JSON.parse(localStorage.getItem(k) || '[]'); } catch (e) { return []; } }
  function save(a) { try { localStorage.setItem(KEY, JSON.stringify(a)); } catch (e) {} }
  d.addEventListener('click', function (e) {
    var b = e.target.closest('[data-done]');
    if (b) {
      var slug = b.closest('[data-lesson]').getAttribute('data-lesson'), a = load(KEY), i = a.indexOf(slug);
      if (i > -1) a.splice(i, 1); else a.push(slug);
      save(a); paint();
    }
    if (e.target.closest('[data-print]')) window.print();
  });
  function paint() {
    var a = load(KEY), art = d.querySelector('[data-lesson]'), btn = d.querySelector('[data-done]');
    if (art && btn) {
      var on = a.indexOf(art.getAttribute('data-lesson')) > -1;
      btn.classList.toggle('on', on); btn.textContent = on ? 'Done ✓ (tap to undo)' : 'Mark this lesson as done';
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    }
    var links = d.querySelectorAll('.ll a[data-l]'), n = 0, next = null;
    for (var i = 0; i < links.length; i++) {
      var done = a.indexOf(links[i].getAttribute('data-l')) > -1;
      links[i].classList.toggle('done', done);
      if (done) n++; else if (!next) next = links[i];
    }
    var p = d.querySelector('[data-progress]');
    if (p && links.length && n) {
      p.hidden = false;
      p.textContent = n + ' of ' + links.length + ' lessons done.' + (next ? ' Next: ' + next.querySelector('span').textContent : ' You have finished the course.');
    }
    var ex = load('sql-ex-done'), items = d.querySelectorAll('[data-ex]'), m = 0;
    for (var j = 0; j < items.length; j++) { var ok = ex.indexOf(items[j].getAttribute('data-ex')) > -1; items[j].classList.toggle('solved', ok); if (ok) m++; }
    var q = d.querySelector('[data-exprog]');
    if (q && m) { q.hidden = false; q.textContent = m + ' exercises solved in the practice box so far.'; }
  }
  paint();
})();
