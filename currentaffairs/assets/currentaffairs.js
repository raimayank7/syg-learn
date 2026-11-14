/* learn.shareyourgroup.com/currentaffairs: the UN list of international days and weeks (window.UN_DAYS = [month, day, name, authority], copied at build time from the UN page), a finder, a quiz
   made from that list and a notes keeper. Pure helpers and the quiz makers first (the build checks them in Node against Python), then the pages' tools.
   Nothing is sent anywhere; notes and best scores stay in this browser. */
(function () {
  'use strict';
  var G = {}, R = Math.random;
  G.seed = function (s) { var a = s >>> 0; R = function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; };
  function ri(a, b) { return a + Math.floor(R() * (b - a + 1)); }
  function pick(l) { return l[Math.floor(R() * l.length)]; }
  function shuffle(l) { l = l.slice(); for (var j = l.length - 1; j > 0; j--) { var k = Math.floor(R() * (j + 1)), t = l[j]; l[j] = l[k]; l[k] = t; } return l; }
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  G.MONTHS = MONTHS;
  G.dateText = function (m, d) { return d + ' ' + MONTHS[m - 1]; };
  G.on = function (data, m, d) { return data.filter(function (r) { return r[0] === +m && r[1] === +d; }); };
  G.inMonth = function (data, m) { return data.filter(function (r) { return r[0] === +m; }); };
  G.search = function (data, text) { var q = String(text || '').trim().toLowerCase(); return q ? data.filter(function (r) { return r[2].toLowerCase().indexOf(q) >= 0; }) : data; };
  var DAYS = [];
  G.setData = function (data) { var cnt = {}; data.forEach(function (r) { cnt[r[2]] = (cnt[r[2]] || 0) + 1; }); DAYS = data.filter(function (r) { return /Day/.test(r[2]) && !/Week/.test(r[2]) && cnt[r[2]] === 1; }); G.all = data; };
  /* quiz: a name-to-date question and a date-to-name question; only dates with exactly one entry in the whole list are asked */
  function onlyOne(m, d) { return G.on(G.all, m, d).length === 1; }
  function dateOptions(ans) {
    var out = [ans], g = 0, r;
    while (out.length < 4 && g++ < 500) { r = pick(DAYS); var t = G.dateText(r[0], r[1]); if (out.indexOf(t) < 0) out.push(t); }
    return shuffle(out);
  }
  function nameOptions(ans, month) {
    var out = [ans], g = 0, r, pool = DAYS.filter(function (x) { return x[2] !== ans; });
    while (out.length < 4 && g++ < 500) { r = pick(pool); if (out.indexOf(r[2]) < 0) out.push(r[2]); }
    return shuffle(out);
  }
  G.makeDate = function () {
    var r = pick(DAYS.filter(function (x) { return true; })), ans = G.dateText(r[0], r[1]);
    return { subj: 'date', topic: 'Date of the day', q: 'On which date each year is "' + r[2] + '" observed?', ans: ans, choices: dateOptions(ans), why: 'The United Nations list gives ' + ans + ' for "' + r[2] + '".', fact: { t: 'date', m: r[0], d: r[1], name: r[2] }, id: 'date' };
  };
  G.makeName = function () {
    var cand = DAYS.filter(function (x) { return onlyOne(x[0], x[1]); }), r = pick(cand);
    return { subj: 'name', topic: 'Name of the day', q: 'Which international day is on the list for ' + G.dateText(r[0], r[1]) + '?', ans: r[2], choices: nameOptions(r[2]), why: 'The United Nations list shows "' + r[2] + '" on ' + G.dateText(r[0], r[1]) + '.', fact: { t: 'name', m: r[0], d: r[1], name: r[2] }, id: 'name' };
  };
  G.any = function (subj) { return subj === 'date' ? G.makeDate() : subj === 'name' ? G.makeName() : (R() < 0.5 ? G.makeDate() : G.makeName()); };
  G.ids = ['date', 'name'];

  if (typeof module !== 'undefined' && module.exports) { module.exports = G; return; }
  window.CURRENT = G;
  G.setData(window.UN_DAYS || []);

  var d = document;
  function el(s) { return d.querySelector(s); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function get(k) { try { return JSON.parse(localStorage.getItem('current-' + k)); } catch (e) { return null; } }
  function put(k, v) { try { localStorage.setItem('current-' + k, JSON.stringify(v)); } catch (e) {} }
  function rows(list) { return list.length ? '<div class="tbl"><table><thead><tr><th>Date</th><th>Day or week</th><th>Authority named on the UN page</th></tr></thead><tbody>' + list.map(function (r) { return '<tr><td>' + G.dateText(r[0], r[1]) + '</td><td>' + esc(r[2]) + '</td><td>' + esc(r[3] || 'none shown') + '</td></tr>'; }).join('') + '</tbody></table></div>' : '<p>No match.</p>'; }

  var fd = el('[data-finder]');
  if (fd) {
    var now = new Date();
    fd.innerHTML = '<div class="fields"><label>Month<select id="fm"><option value="">All months</option>' + MONTHS.map(function (m, i) { return '<option value="' + (i + 1) + '">' + m + '</option>'; }).join('') + '</select></label><label>Search the name<input type="search" id="ft" placeholder="for example Women" autocomplete="off"></label></div><p class="calc-msg" data-count aria-live="polite"></p><div data-list></div><h2>Today in the list</h2><div data-today></div>';
    var draw = function () {
      var l = G.search(el('#fm').value ? G.inMonth(G.all, el('#fm').value) : G.all, el('#ft').value);
      fd.querySelector('[data-count]').textContent = l.length + ' entr' + (l.length === 1 ? 'y' : 'ies') + (l.length > 40 ? ' (showing the first 40: narrow the search)' : '');
      fd.querySelector('[data-list]').innerHTML = rows(l.slice(0, 40));
    };
    var t = G.on(G.all, now.getMonth() + 1, now.getDate());
    fd.querySelector('[data-today]').innerHTML = '<p>Your device date is ' + G.dateText(now.getMonth() + 1, now.getDate()) + '. The UN list shows ' + (t.length ? t.length + ' observance' + (t.length > 1 ? 's' : '') + ' for it:' : 'none for it.') + '</p>' + (t.length ? rows(t) : '');
    fd.addEventListener('input', draw); draw();
  }

  var box = el('[data-practice]');
  if (box) {
    var subj = box.getAttribute('data-practice'), st, label = { date: 'Dates of days', name: 'Names of days', all: 'Mixed' };
    var start = function () {
      var best = get('best-' + subj);
      box.innerHTML = '<div class="pq-setup"><p class="pq-lab">' + label[subj] + ': 10 questions from the UN list of international days</p><p>Each question has four options and one right answer taken from the United Nations list. There is no penalty.</p>' + (best !== null ? '<p><b>Your best here: ' + best + ' / 10</b></p>' : '') + '<button type="button" class="btn pq-go">Start</button></div>';
      box.querySelector('.pq-go').onclick = function () { st = { n: 0, right: 0, log: [] }; next(); };
    };
    var next = function () {
      if (st.n >= 10) return done();
      var q = G.any(subj); st.n++; st.q = q;
      box.innerHTML = '<div class="pq-top"><span>Question ' + st.n + ' of 10</span><span>Right: ' + st.right + '</span></div><p class="pq-topic">' + esc(q.topic) + '</p><p class="pq-q">' + esc(q.q) + '</p><div class="pq-ch pq-wide">' + q.choices.map(function (c, i) { return '<button type="button" data-v="' + esc(c) + '"><i>' + 'ABCD'[i] + '</i> ' + esc(c) + '</button>'; }).join('') + '</div><div class="pq-fb" aria-live="polite"></div>';
      [].forEach.call(box.querySelectorAll('.pq-ch button'), function (b) { b.onclick = function () { judge(b.getAttribute('data-v'), b); }; });
    };
    var judge = function (v, btn) {
      var ok = v === st.q.ans; if (ok) st.right++; st.log.push([st.q, ok ? 'right' : 'wrong']);
      btn.classList.add(ok ? 'good' : 'bad');
      [].forEach.call(box.querySelectorAll('.pq-ch button'), function (b) { b.disabled = true; if (b.getAttribute('data-v') === st.q.ans) b.classList.add('good'); });
      var fb = box.querySelector('.pq-fb'); fb.className = 'pq-fb ' + (ok ? 'good' : 'bad'); fb.innerHTML = '<p><b>' + (ok ? 'Correct.' : 'Not quite.') + '</b></p><p class="pq-why">' + esc(st.q.why) + '</p><button type="button" class="btn pq-next">' + (st.n >= 10 ? 'See result' : 'Next question') + '</button>';
      fb.querySelector('.pq-next').onclick = next; fb.querySelector('.pq-next').focus();
    };
    var done = function () {
      var best = get('best-' + subj); if (best === null || st.right > best) put('best-' + subj, st.right);
      box.innerHTML = '<div class="pq-done"><p class="pq-big">' + st.right + ' / 10</p><p>' + (st.right === 10 ? 'All ten right.' : 'Look again at the months of the days you missed.') + '</p><p class="hint">This quiz covers only the UN list of international days. It says nothing about the news.</p><div class="pq-btns"><button type="button" class="btn pq-again">Play again</button></div></div>';
      box.querySelector('.pq-again').onclick = function () { st = { n: 0, right: 0, log: [] }; next(); };
    };
    start();
  }

  var nb = el('[data-notes]');
  if (nb) {
    var CATS = ['Polity and governance', 'Economy', 'International relations', 'Science and technology', 'Environment', 'Schemes and policies', 'Awards and sports', 'Other'];
    var notes = get('notes') || [];
    nb.innerHTML = '<div class="fields"><label>Date<input type="date" id="nd"></label><label>Topic<select id="nc">' + CATS.map(function (c) { return '<option>' + c + '</option>'; }).join('') + '</select></label></div><label class="wide">One-line note (what happened, who, where)<input type="text" id="nt" maxlength="200" autocomplete="off"></label><label class="wide">Source (the page or paper you read)<input type="text" id="ns" maxlength="120" autocomplete="off"></label><p><button type="button" class="btn" id="nadd">Save note</button> <button type="button" class="btn ghost" id="ncopy">Copy all notes</button></p><p class="calc-msg" data-msg aria-live="polite"></p><div class="fields"><label>Show topic<select id="nf"><option value="">All topics</option>' + CATS.map(function (c) { return '<option>' + c + '</option>'; }).join('') + '</select></label></div><div data-nlist></div>';
    var today = new Date(); el('#nd').value = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
    var drawN = function () {
      var f = el('#nf').value, l = notes.filter(function (n) { return !f || n.c === f; }).sort(function (a, b) { return a.d < b.d ? 1 : -1; });
      nb.querySelector('[data-nlist]').innerHTML = l.length ? '<ul>' + l.map(function (n) { return '<li><b>' + esc(n.d) + '</b> (' + esc(n.c) + '): ' + esc(n.t) + (n.s ? ' <i>[' + esc(n.s) + ']</i>' : '') + ' <button type="button" class="btn ghost" data-del="' + n.id + '">Delete</button></li>'; }).join('') + '</ul>' : '<p>No notes yet.</p>';
    };
    nb.addEventListener('click', function (e) {
      var id = e.target.id;
      if (id === 'nadd') { var t = el('#nt').value.trim(); if (!t) { nb.querySelector('[data-msg]').textContent = 'Type a one-line note first.'; return; } notes.push({ id: Date.now() + '' + Math.floor(Math.random() * 1000), d: el('#nd').value, c: el('#nc').value, t: t, s: el('#ns').value.trim() }); put('notes', notes); el('#nt').value = ''; el('#ns').value = ''; nb.querySelector('[data-msg]').textContent = 'Saved in this browser (' + notes.length + ' notes).'; drawN(); }
      else if (id === 'ncopy') { var txt = notes.slice().sort(function (a, b) { return a.d < b.d ? -1 : 1; }).map(function (n) { return n.d + ' | ' + n.c + ' | ' + n.t + (n.s ? ' | ' + n.s : ''); }).join('\n'); try { navigator.clipboard.writeText(txt).then(function () { nb.querySelector('[data-msg]').textContent = 'Copied ' + notes.length + ' notes.'; }, function () { nb.querySelector('[data-msg]').textContent = 'Copying is blocked here: select the notes and copy them by hand.'; }); } catch (x) { nb.querySelector('[data-msg]').textContent = 'Copying is blocked here.'; } }
      else if (e.target.getAttribute('data-del')) { notes = notes.filter(function (n) { return n.id !== e.target.getAttribute('data-del'); }); put('notes', notes); drawN(); }
    });
    nb.addEventListener('change', function (e) { if (e.target.id === 'nf') drawN(); });
    drawN();
  }
})();
