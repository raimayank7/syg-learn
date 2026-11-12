/* Full Forms: home search, page filters, quiz. Data: /data/ff.json rows [abbr, full, meaning, subjectKey, subjectSlug, id, explainedSlug] */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var data = null;
  function load() { return data ? Promise.resolve(data) : fetch('/fullform/data/ff.json').then(function (r) { return r.json(); }).then(function (d) { data = d; return d; }); }
  var norm = function (s) { return String(s).toLowerCase().replace(/[^a-z0-9 ]/g, ''); };
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  /* ---------- home search ---------- */
  var box = $('ffs'), out = $('ffr');
  if (box && out) {
    var run = function () {
      var v = norm(box.value).trim();
      if (!v) { out.innerHTML = ''; return; }
      load().then(function (d) {
        var exact = [], starts = [], words = [];
        d.forEach(function (r) {
          var a = norm(r[0]).replace(/ /g, ''), f = norm(r[1]);
          if (a === v.replace(/ /g, '')) exact.push(r);
          else if (a.indexOf(v.replace(/ /g, '')) === 0) starts.push(r);
          else if (v.length > 2 && (' ' + f).indexOf(' ' + v) > -1) words.push(r);
        });
        var res = exact.concat(starts, words).slice(0, 24);
        if (!res.length) { out.innerHTML = '<div class="result"><h2>Nothing found for "' + esc(box.value) + '"</h2><p>Check the letters, or look through the <a href="/fullform/a-z/">A to Z list</a>. If it is a full form we should have, tell us through the <a href="/contact/">contact page</a>.</p></div>'; return; }
        out.innerHTML = '<ul class="ff-list">' + res.map(function (r) {
          var nf = r[1].indexOf('no ') === 0;
          return '<li class="ff-e"><h3>' + esc(r[0]) + '</h3><p class="ff-f">' + (nf ? '<i>' + esc(r[1]) + '</i>' : esc(r[1].charAt(0).toUpperCase() + r[1].slice(1))) + '</p><p class="ff-m">' + esc(r[2]) + '</p><p class="ff-acts">' +
            (r[6] ? '<a class="btn sm" href="/fullform/explained/' + r[6] + '/">' + esc(r[0]) + ' explained</a> ' : '') + '<a class="btn sm ghost" href="/fullform/subjects/' + r[4] + '/#' + r[5] + '">More in this subject</a> ' +
            '<button class="btn sm ghost" type="button" data-copy="' + esc(r[0] + (nf ? '' : ': ' + r[1]) + '. ' + r[2]) + '">Copy</button></p></li>';
        }).join('') + '</ul>';
      });
    };
    var t; box.addEventListener('input', function () { clearTimeout(t); t = setTimeout(run, 120); });
    document.addEventListener('click', function (e) { var b = e.target.closest('[data-ff]'); if (!b) return; box.value = b.getAttribute('data-ff'); run(); out.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); });
    var q0 = new URLSearchParams(location.search).get('q'); if (q0) { box.value = q0; run(); }
  }

  /* ---------- filter on subject pages and A to Z ---------- */
  var fq = $('ffq'), fn = $('ffn');
  if (fq) {
    var items = [].slice.call(document.querySelectorAll('.ff-list > li, .ff-az tbody tr'));
    fq.addEventListener('input', function () {
      var v = fq.value.trim().toLowerCase(), n = 0;
      items.forEach(function (li) { var hit = !v || (li.getAttribute('data-q') || '').indexOf(v) > -1; li.hidden = !hit; if (hit) n++; });
      fn.textContent = v ? (n ? n + ' found' : 'Nothing on this page matches. Try the search on the home page.') : '';
    });
  }

  /* ---------- quiz ---------- */
  var qz = $('qz');
  if (qz) {
    var sel = $('qz-s'), st;
    var best = function () { try { return JSON.parse(localStorage.getItem('ff-best') || '{}'); } catch (e) { return {}; } };
    var ask = function () {
      var q = st.qs[st.i];
      qz.innerHTML = '<p class="ff-count">Question ' + (st.i + 1) + ' of ' + st.qs.length + ' · score ' + st.ok + '</p><h2 class="ff-qq">What is the full form of <b>' + esc(q.r[0]) + '</b>?</h2><div class="ff-opts">' +
        q.opts.map(function (o, k) { return '<button type="button" class="ff-opt" data-k="' + k + '">' + esc(o) + '</button>'; }).join('') + '</div><div id="qz-fb"></div>';
      qz.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    };
    qz.addEventListener('click', function (e) {
      var b = e.target.closest('.ff-opt'); if (!b || b.disabled) return;
      var q = st.qs[st.i], right = q.opts[+b.getAttribute('data-k')] === q.r[1];
      [].forEach.call(qz.querySelectorAll('.ff-opt'), function (o) { o.disabled = true; if (o.textContent === q.r[1]) o.classList.add('ok'); });
      if (right) st.ok++; else { b.classList.add('no'); st.miss.push(q.r); }
      $('qz-fb').innerHTML = '<p><b>' + (right ? 'Correct.' : 'Not quite.') + '</b> ' + esc(q.r[0]) + ': ' + esc(q.r[1]) + '. ' + esc(q.r[2]) + '</p><p class="ff-cta"><button class="btn" type="button" id="qz-next">' + (st.i + 1 < st.qs.length ? 'Next question' : 'See my score') + '</button></p>';
      $('qz-next').focus();
      $('qz-next').addEventListener('click', function () { st.i++; if (st.i < st.qs.length) ask(); else done(); });
    });
    var done = function () {
      var b = best(), key = sel.value || 'all';
      if (!(b[key] >= st.ok)) { b[key] = st.ok; try { localStorage.setItem('ff-best', JSON.stringify(b)); } catch (e) { } }
      qz.innerHTML = '<h2>You scored ' + st.ok + ' out of ' + st.qs.length + '</h2><p>Best so far for this choice on this device: ' + b[key] + ' out of ' + st.qs.length + '.</p>' +
        (st.miss.length ? '<h3>To go over</h3><ul class="ff-list">' + st.miss.map(function (r) { return '<li class="ff-e"><h3>' + esc(r[0]) + '</h3><p class="ff-f">' + esc(r[1]) + '</p><p class="ff-m">' + esc(r[2]) + '</p></li>'; }).join('') + '</ul>' : '<p>All correct. Well done.</p>') +
        '<p class="ff-cta"><button class="btn" type="button" id="qz-again">Play again</button> <button class="btn ghost" type="button" data-share="I scored ' + st.ok + '/' + st.qs.length + ' in the full form quiz. Try it: https://learn.shareyourgroup.com/fullform/quiz/">Share my score</button></p>';
      $('qz-again').addEventListener('click', start); $('qz-set').hidden = false;
    };
    var start = function () {
      load().then(function (d) {
        var pool = d.filter(function (r) { return r[1].indexOf('no ') !== 0 && (!sel.value || r[3] === sel.value); });
        var qs = shuffle(pool).slice(0, 10).map(function (r) {
          var same = shuffle(pool.filter(function (x) { return x[1] !== r[1] && x[0] !== r[0]; })).slice(0, 3).map(function (x) { return x[1]; });
          return { r: r, opts: shuffle(same.concat([r[1]])) };
        });
        st = { qs: qs, i: 0, ok: 0, miss: [] }; qz.hidden = false; $('qz-set').hidden = true; ask();
      }).catch(function () { qz.hidden = false; qz.innerHTML = '<p>The questions could not be loaded. Check your connection and try again.</p>'; });
    };
    $('qz-go').addEventListener('click', start);
  }
})();
