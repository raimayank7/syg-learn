/* Citizenship Test: hide answers, version picker, practice test, flashcards, state filter. Data: /data/q2025.json, /data/q2008.json */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var store = { get: function (k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }, set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } } };
  var qs = new URLSearchParams(location.search), cache = {};
  function load(v) { return cache[v] ? Promise.resolve(cache[v]) : fetch('/citizenship/data/q' + v + '.json').then(function (r) { return r.json(); }).then(function (d) { cache[v] = d; return d; }); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function answers(q) {
    var varies = q.a.some(function (a) { return /^(Answers will vary|Visit uscis\.gov)/.test(a); });
    return '<ul class="cz-a">' + q.a.map(function (a) { return '<li>' + esc(a) + '</li>'; }).join('') + '</ul><p class="cz-note">' + esc(q.t) +
      (varies ? ' <a href="/citizenship/guide/answers-that-change/">Answers that change</a>' : '') + '</p>';
  }

  /* hide / show answers on list pages */
  var hb = document.querySelector('[data-cz-hide]');
  if (hb) hb.addEventListener('click', function () {
    var on = document.body.classList.toggle('cz-hidden'); hb.textContent = on ? 'Show the answers' : 'Hide the answers';
  });
  document.addEventListener('click', function (e) {
    var li = e.target.closest('.cz-hidden .cz-q'); if (li && !e.target.closest('a')) li.classList.toggle('cz-open');
  });

  /* home: which version */
  var pick = $('cz-d');
  if (pick) {
    var showv = function (v) {
      [].forEach.call(pick.querySelectorAll('button'), function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-ver') === v ? 'true' : 'false'); });
      var box = $('cz-v'); box.hidden = false;
      box.innerHTML = v === '2025' ? '<p><b>You take the 2025 version.</b> 128 questions in the list. The officer asks up to 20; you need 12 correct.</p><p class="cz-cta"><a class="btn" href="/citizenship/2025/">Study the 2025 list</a> <a class="btn ghost" href="/citizenship/practice/?v=2025">Practice test</a></p>'
        : '<p><b>You take the 2008 version.</b> 100 questions in the list. The officer asks up to 10; you need 6 correct.</p><p class="cz-cta"><a class="btn" href="/citizenship/2008/">Study the 2008 list</a> <a class="btn ghost" href="/citizenship/practice/?v=2008">Practice test</a></p>';
    };
    pick.addEventListener('click', function (e) { var b = e.target.closest('[data-ver]'); if (!b) return; store.set('cz-ver', b.getAttribute('data-ver')); showv(b.getAttribute('data-ver')); });
    var sv = store.get('cz-ver', ''); if (sv) showv(sv);
  }

  /* practice test */
  var pt = $('pt');
  if (pt) {
    var sel = $('pt-v'), RULE = { '2025': [20, 12, 9], '2008': [10, 6, 5], '2025s': [10, 6, 5], '2008s': [10, 6, 5] }, st;
    var pre = (qs.get('v') || store.get('cz-ver', '2025')) + (qs.get('s') ? 's' : ''); if (RULE[pre]) sel.value = pre;
    var ask = function () {
      var q = st.list[st.i], r = RULE[st.key];
      pt.innerHTML = '<p class="pt-count">Question ' + (st.i + 1) + ' of up to ' + r[0] + ' · right ' + st.ok + ' · wrong ' + st.no + '</p><h2 class="pt-q">' + esc(q.q) + '</h2>' +
        '<p class="hint">Say your answer aloud. Then:</p><p class="cz-cta"><button class="btn" type="button" id="pt-show">Show the accepted answers</button></p><div id="pt-ans" hidden></div>';
      $('pt-show').addEventListener('click', function () {
        this.parentNode.hidden = true; var box = $('pt-ans'); box.hidden = false;
        box.innerHTML = answers(q) + '<p class="cz-cta"><button class="btn" type="button" data-m="1">I was right</button> <button class="btn ghost" type="button" data-m="0">I was wrong</button></p>';
        box.querySelector('[data-m]').focus();
      });
      pt.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    };
    pt.addEventListener('click', function (e) {
      var b = e.target.closest('[data-m]'); if (!b) return;
      var q = st.list[st.i], r = RULE[st.key];
      if (b.getAttribute('data-m') === '1') st.ok++; else { st.no++; st.missed.push(q); }
      st.i++;
      if (st.ok >= r[1] || st.no >= r[2] || st.i >= r[0]) return done();
      ask();
    });
    var done = function () {
      var r = RULE[st.key], pass = st.ok >= r[1], hist = store.get('cz-hist', []);
      hist.unshift({ k: st.key, ok: st.ok, no: st.no, p: pass ? 1 : 0, d: new Date().toISOString().slice(0, 10) }); hist = hist.slice(0, 10); store.set('cz-hist', hist);
      pt.innerHTML = '<h2>' + (pass ? 'Passed' : 'Not passed this time') + '</h2><p class="big">' + st.ok + ' right, ' + st.no + ' wrong</p>' +
        '<p>' + (pass ? 'You reached ' + r[1] + ' correct answers, so the officer would stop here.' : 'You reached ' + r[2] + ' incorrect answers, so the officer would stop here.') + '</p>' +
        (st.missed.length ? '<h3>Questions to go over</h3><ol class="cz-list">' + st.missed.map(function (q) { return '<li class="cz-q"><h3><span class="cz-n">' + q.n + '</span> ' + esc(q.q) + '</h3>' + answers(q) + '</li>'; }).join('') + '</ol>' : '<p>No mistakes. Well done.</p>') +
        '<p class="cz-cta"><button class="btn" type="button" id="pt-again">Another test</button> <a class="btn ghost" href="/citizenship/flashcards/?v=' + st.key.slice(0, 4) + '">Flashcards</a></p>' +
        '<h3>Your last tests on this device</h3><ul>' + hist.map(function (h) { return '<li>' + h.d + ' · ' + (h.k.length > 4 ? '65/20, ' : '') + h.k.slice(0, 4) + ' version · ' + h.ok + ' right, ' + h.no + ' wrong · ' + (h.p ? 'passed' : 'not passed') + '</li>'; }).join('') + '</ul>';
      $('pt-again').addEventListener('click', start);
      $('pt-set').hidden = false;
    };
    var start = function () {
      var key = sel.value, v = key.slice(0, 4);
      load(v).then(function (d) {
        var pool = key.length > 4 ? d.filter(function (q) { return q.s; }) : d;
        st = { key: key, list: shuffle(pool).slice(0, RULE[key][0]), i: 0, ok: 0, no: 0, missed: [] };
        pt.hidden = false; $('pt-set').hidden = true; ask();
      }).catch(function () { pt.hidden = false; pt.innerHTML = '<p>The questions could not be loaded. Check your connection and try again.</p>'; });
    };
    $('pt-go').addEventListener('click', start);
  }

  /* flashcards */
  var fc = $('fc');
  if (fc) {
    var fv = $('fc-v'), fp = $('fc-p'), fm = $('fc-m'), fst = $('fc-st'), deck = [], pos = 0, marks;
    var v0 = qs.get('v') || store.get('cz-ver', '2025'); if (v0 === '2008' || v0 === '2025') fv.value = v0;
    if (qs.get('s')) fm.value = 'star';
    var parts = function () {
      var names = JSON.parse(fp.getAttribute(fv.value === '2025' ? 'data-p25' : 'data-p08'));
      fp.innerHTML = '<option value="">Whole list</option>' + names.map(function (n, i) { return '<option value="' + i + '">' + esc(n) + '</option>'; }).join('');
    };
    var build = function () {
      marks = store.get('cz-marks-' + fv.value, {});
      load(fv.value).then(function (d) {
        deck = shuffle(d.filter(function (q) {
          return (fp.value === '' || q.p === +fp.value) && (fm.value !== 'star' || q.s) && (fm.value !== 'todo' || marks[q.n] !== 1);
        }));
        pos = 0; card();
      });
    };
    var status = function () {
      var all = cache[fv.value] || [], k = all.filter(function (q) { return marks[q.n] === 1; }).length, n = all.filter(function (q) { return marks[q.n] === 0; }).length;
      fst.textContent = 'Whole ' + fv.value + ' list: ' + k + ' marked "know it", ' + n + ' marked "not yet", ' + (all.length - k - n) + ' not seen. Cards in this round: ' + deck.length + '.';
    };
    var card = function () {
      status(); fc.hidden = false;
      if (!deck.length) { fc.innerHTML = '<h2>No cards to show</h2><p>' + (fm.value === 'todo' ? 'Every card in this choice is marked "know it". Well done. Choose "All cards" to go through them again.' : 'Nothing matches this choice.') + '</p>'; return; }
      if (pos >= deck.length) { fc.innerHTML = '<h2>End of the round</h2><p>You went through ' + deck.length + ' cards.</p><p class="cz-cta"><button class="btn" type="button" id="fc-re">Go again</button> <a class="btn ghost" href="/citizenship/practice/?v=' + fv.value + '">Take a practice test</a></p>'; $('fc-re').addEventListener('click', build); return; }
      var q = deck[pos];
      fc.innerHTML = '<p class="pt-count">Card ' + (pos + 1) + ' of ' + deck.length + ' · question ' + q.n + (q.s ? ' · 65/20' : '') + (marks[q.n] === 1 ? ' · marked "know it"' : marks[q.n] === 0 ? ' · marked "not yet"' : '') + '</p><h2 class="pt-q">' + esc(q.q) + '</h2>' +
        '<p class="cz-cta" id="fc-turnp"><button class="btn" type="button" id="fc-turn">Turn the card</button></p><div id="fc-back" hidden>' + answers(q) +
        '<p class="cz-cta"><button class="btn" type="button" data-k="1">Know it</button> <button class="btn ghost" type="button" data-k="0">Not yet</button></p></div>' +
        '<p class="hint"><button class="cz-link" type="button" id="fc-forget">Forget my marks for this list</button></p>';
      $('fc-turn').addEventListener('click', function () { $('fc-turnp').hidden = true; $('fc-back').hidden = false; });
      $('fc-forget').addEventListener('click', function () { marks = {}; store.set('cz-marks-' + fv.value, marks); build(); });
    };
    fc.addEventListener('click', function (e) {
      var b = e.target.closest('[data-k]'); if (!b) return;
      marks[deck[pos].n] = +b.getAttribute('data-k'); store.set('cz-marks-' + fv.value, marks); pos++; card();
    });
    fv.addEventListener('change', function () { parts(); build(); });
    fp.addEventListener('change', build); fm.addEventListener('change', build);
    parts(); if (qs.get('p') !== null && qs.get('p') !== '') fp.value = qs.get('p');
    build();
  }

  /* state capitals filter */
  var czf = $('czf');
  if (czf) czf.addEventListener('input', function () {
    var v = czf.value.trim().toLowerCase();
    [].forEach.call(document.querySelectorAll('.cz-cap tbody tr'), function (tr) { tr.hidden = !!v && tr.textContent.toLowerCase().indexOf(v) < 0; });
  });
})();
