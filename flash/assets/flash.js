/* learn.shareyourgroup.com/flash: make flashcards from text, study them with a five-box schedule, and print them. Pure helpers first (the build checks them in Node against separate Python code),
   then the tools. Your cards and progress are kept only in this browser; nothing is sent anywhere. */
(function () {
  'use strict';
  var F = {};
  F.INTERVAL = [0, 1, 2, 4, 8, 16];   /* days until a card in box 1..5 is due again; our own choice, not a rule */
  F.MAX = 300;
  function pd(iso) { var p = iso.split('-'); return Date.UTC(+p[0], +p[1] - 1, +p[2]); }
  function iso(ms) { var d = new Date(ms); return d.getUTCFullYear() + '-' + ('0' + (d.getUTCMonth() + 1)).slice(-2) + '-' + ('0' + d.getUTCDate()).slice(-2); }
  F.addDays = function (day, n) { return iso(pd(day) + n * 86400000); };
  /* one card a line: front | back (a tab also works). Lines without a separator, or with an empty side, are skipped and counted. */
  F.parse = function (text) {
    var cards = [], skipped = 0;
    String(text).split(/\r?\n/).forEach(function (line) {
      if (!line.trim()) return;
      var i = line.indexOf('|'); if (i < 0) i = line.indexOf('\t');
      if (i < 0) { skipped++; return; }
      var f = line.slice(0, i).replace(/\s+/g, ' ').trim(), b = line.slice(i + 1).replace(/\s+/g, ' ').trim();
      if (!f || !b) { skipped++; return; }
      if (cards.length >= F.MAX) { skipped++; return; }
      cards.push({ f: f, b: b });
    });
    return { cards: cards, skipped: skipped };
  };
  F.key = function (c) { return c.f + '\u0001' + c.b; };
  /* a card's state: {box 1..5, due 'YYYY-MM-DD' or null for a card never studied} */
  F.review = function (st, ok, today) {
    var box = ok ? Math.min(5, (st ? st.box : 1) + 1) : 1;
    return { box: box, due: F.addDays(today, F.INTERVAL[box]) };
  };
  /* cards due today: never studied, or due on or before today; fewer-box cards first, then deck order */
  F.dueList = function (cards, states, today) {
    var out = [];
    cards.forEach(function (c, i) { var st = states[F.key(c)]; if (!st || !st.due || st.due <= today) out.push({ i: i, box: st ? st.box : 1 }); });
    out.sort(function (a, b) { return a.box - b.box || a.i - b.i; });
    return out.map(function (x) { return x.i; });
  };
  F.counts = function (cards, states) {
    var n = [0, 0, 0, 0, 0, 0];
    cards.forEach(function (c) { var st = states[F.key(c)]; n[st ? st.box : 0]++; });
    return n;   /* index 0 = new, 1..5 = box */
  };
  if (typeof module !== 'undefined' && module.exports) { module.exports = F; return; }
  window.FLASH = F;

  var d = document;
  function el(q) { return d.querySelector(q); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function get(k) { try { return JSON.parse(localStorage.getItem('flash-' + k)); } catch (e) { return null; } }
  function put(k, v) { try { localStorage.setItem('flash-' + k, JSON.stringify(v)); } catch (e) {} }
  function today() { var t = new Date(); return t.getFullYear() + '-' + ('0' + (t.getMonth() + 1)).slice(-2) + '-' + ('0' + t.getDate()).slice(-2); }
  var SAMPLE = '7 x 8 | 56\n9 x 6 | 54\nPlural of child | children\nPast tense of go | went\nSquare root of 144 | 12\nOpposite of ancient | modern';
  var deck = function () { var t = get('deck'); return t === null ? SAMPLE : t; };

  var box = el('[data-study]');
  if (box) {
    var cards = [], states = get('states') || {}, queue = [], cur = -1, shown = false, skipped = 0;
    var load = function () { var p = F.parse(el('#ft').value); cards = p.cards; skipped = p.skipped; put('deck', el('#ft').value); };
    box.innerHTML = '<label>Your cards, one on each line as: front | back<textarea class="names" id="ft" maxlength="30000" aria-describedby="fth">' + esc(deck()) + '</textarea></label><p class="hint" id="fth">Up to 300 cards. They stay in this browser.</p><div class="boxes" data-counts></div><div data-card></div><div class="btns" data-btns></div><p class="msg" aria-live="polite" data-msg></p>';
    var counts = function () { var n = F.counts(cards, states); box.querySelector('[data-counts]').innerHTML = '<span>New: ' + n[0] + '</span>' + [1, 2, 3, 4, 5].map(function (b) { return '<span>Box ' + b + ': ' + n[b] + '</span>'; }).join('') + '<span>Due today: ' + F.dueList(cards, states, today()).length + '</span>'; };
    var draw = function () {
      var c = box.querySelector('[data-card]'), b = box.querySelector('[data-btns]'), m = box.querySelector('[data-msg]');
      m.textContent = skipped ? skipped + ' line(s) skipped: each card needs text on both sides of a | sign.' : '';
      counts();
      if (!cards.length) { c.innerHTML = ''; b.innerHTML = ''; m.textContent = 'Type some cards above.'; return; }
      if (cur < 0) { c.innerHTML = ''; b.innerHTML = '<button type="button" class="btn" id="fs">Study the cards due today</button>'; if (!F.dueList(cards, states, today()).length) m.textContent = 'Nothing is due today. Come back tomorrow, or press study again to go through the deck.'; return; }
      var card = cards[cur];
      c.innerHTML = '<div class="fc' + (shown ? ' back' : '') + '" id="fcard" role="button" tabindex="0" aria-label="Card, press to turn over">' + esc(shown ? card.b : card.f) + '</div>';
      b.innerHTML = shown ? '<button type="button" class="btn" id="fk">I knew it</button> <button type="button" class="btn ghost" id="fn">Not yet</button>' : '<button type="button" class="btn" id="ff">Show the answer</button>';
    };
    var mark = function (ok) { var key = F.key(cards[cur]); states[key] = F.review(states[key], ok, today()); put('states', states); queue.shift(); cur = queue.length ? queue[0] : -1; shown = false; if (cur < 0) box.querySelector('[data-msg]').textContent = 'Round finished.'; draw(); if (cur < 0) box.querySelector('[data-msg]').textContent = 'Round finished.'; };
    box.addEventListener('input', function (e) { if (e.target.id === 'ft') { load(); cur = -1; queue = []; draw(); } });
    box.addEventListener('click', function (e) {
      var id = e.target.id;
      if (id === 'fs') { queue = F.dueList(cards, states, today()); if (!queue.length) queue = cards.map(function (x, i) { return i; }); cur = queue[0]; shown = false; draw(); }
      else if (id === 'ff' || id === 'fcard') { shown = !shown; draw(); }
      else if (id === 'fk') mark(true);
      else if (id === 'fn') mark(false);
    });
    box.addEventListener('keydown', function (e) { if (e.target.id === 'fcard' && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); shown = !shown; draw(); } });
    load(); draw();
  }

  var pr = el('[data-print]');
  if (pr) {
    pr.innerHTML = '<label>Your cards, one on each line as: front | back<textarea class="names" id="pt" maxlength="30000">' + esc(deck()) + '</textarea></label><div class="btns"><button type="button" class="btn" id="pp">Print</button></div><p class="msg" aria-live="polite" data-msg></p><div class="sheet" data-sheet></div>';
    var pdraw = function () {
      var p = F.parse(el('#pt').value); put('deck', el('#pt').value);
      pr.querySelector('[data-msg]').textContent = p.cards.length + ' cards' + (p.skipped ? ', ' + p.skipped + ' line(s) skipped' : '') + '. Each row prints the front on the left and the back on the right: cut along the dotted lines and fold or paste.';
      pr.querySelector('[data-sheet]').innerHTML = p.cards.map(function (c) { return '<div>' + esc(c.f) + '</div><div>' + esc(c.b) + '</div>'; }).join('');
    };
    pr.addEventListener('input', pdraw);
    pr.addEventListener('click', function (e) { if (e.target.id === 'pp') window.print(); });
    pdraw();
  }
})();
