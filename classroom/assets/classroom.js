/* learn.shareyourgroup.com/classroom: group maker, name picker, seating chart and countdown timer. Pure helpers first (the build checks them in Node against separate Python code),
   then the tools. Names you type are kept only in this browser; nothing is sent anywhere. */
(function () {
  'use strict';
  var C = {}, R = Math.random;
  C.seed = function (s) { var a = s >>> 0; R = function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; };
  C.clean = function (text) { return String(text).split(/\r?\n|,/).map(function (x) { return x.replace(/\s+/g, ' ').trim(); }).filter(Boolean).slice(0, 200); };
  C.shuffle = function (l) { l = l.slice(); for (var j = l.length - 1; j > 0; j--) { var k = Math.floor(R() * (j + 1)), t = l[j]; l[j] = l[k]; l[k] = t; } return l; };
  /* mode 'size': groups of about n people (number of groups = ceil(N / n)); mode 'count': exactly n groups (never more than there are people). Group sizes differ by at most one. */
  C.groups = function (names, mode, n) {
    var N = names.length; if (!N) return [];
    var g = mode === 'count' ? Math.min(n, N) : Math.ceil(N / Math.max(1, n)); g = Math.max(1, g);
    var sh = C.shuffle(names), out = [], i, from = 0, base = Math.floor(N / g), extra = N % g;
    for (i = 0; i < g; i++) { var sz = base + (i < extra ? 1 : 0); out.push(sh.slice(from, from + sz)); from += sz; }
    return out;
  };
  /* the order in which names are picked: a shuffle, so nobody comes up twice until everybody has */
  C.order = function (names) { return C.shuffle(names); };
  /* seating: rows x cols grid filled in shuffled order, row by row; empty seats are null */
  C.seats = function (names, rows, cols) {
    var sh = C.shuffle(names), grid = [], r, c, k = 0;
    for (r = 0; r < rows; r++) { var row = []; for (c = 0; c < cols; c++) row.push(k < sh.length ? sh[k++] : null); grid.push(row); }
    return grid;
  };
  C.clock = function (sec) { sec = Math.max(0, Math.ceil(sec)); var m = Math.floor(sec / 60), s = sec % 60; return m + ':' + ('0' + s).slice(-2); };
  if (typeof module !== 'undefined' && module.exports) { module.exports = C; return; }
  window.CLASSROOM = C;

  var d = document;
  function el(q) { return d.querySelector(q); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function get(k) { try { return JSON.parse(localStorage.getItem('classroom-' + k)); } catch (e) { return null; } }
  function put(k, v) { try { localStorage.setItem('classroom-' + k, JSON.stringify(v)); } catch (e) {} }
  var SAMPLE = 'Asha\nBilal\nCharu\nDev\nEsha\nFarid\nGita\nHari\nIna\nJoy';
  function namesBox() { return '<label>Names, one on each line (or separated by commas)<textarea class="names" id="cn" maxlength="6000" aria-describedby="cnh">' + esc(get('names') || SAMPLE) + '</textarea></label><p class="hint" id="cnh">Up to 200 names. They stay in this browser.</p>'; }
  function readNames() { var n = C.clean(el('#cn').value); put('names', el('#cn').value); return n; }

  var gb = el('[data-groups]');
  if (gb) {
    gb.innerHTML = namesBox() + '<div class="fields"><label>Make<select id="gm"><option value="size">groups of about this many people</option><option value="count">this many groups</option></select></label><label>Number<input type="number" id="gn" min="1" max="100" value="3" inputmode="numeric"></label></div><div class="btns"><button type="button" class="btn" id="gg">Make groups</button> <button type="button" class="btn ghost" id="gp">Print</button></div><div class="msg" aria-live="polite" data-msg></div><div data-out></div>';
    gb.addEventListener('click', function (e) {
      if (e.target.id === 'gp') return window.print();
      if (e.target.id !== 'gg') return;
      var names = readNames(), msg = gb.querySelector('[data-msg]'), out = gb.querySelector('[data-out]');
      if (names.length < 2) { msg.textContent = 'Type at least two names.'; out.innerHTML = ''; return; }
      var n = Math.min(100, Math.max(1, +el('#gn').value || 1)), g = C.groups(names, el('#gm').value, n);
      msg.textContent = names.length + ' names in ' + g.length + ' groups.';
      out.innerHTML = '<div class="grp">' + g.map(function (x, i) { return '<div><h3>Group ' + (i + 1) + ' (' + x.length + ')</h3><ul>' + x.map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('') + '</ul></div>'; }).join('') + '</div>';
    });
  }

  var pk = el('[data-picker]');
  if (pk) {
    var queue = [], last = '';
    pk.innerHTML = namesBox() + '<div class="pick" data-name aria-live="polite">Press Pick</div><p class="hint" data-left></p><div class="btns"><button type="button" class="btn" id="pn">Pick a name</button> <button type="button" class="btn ghost" id="pr">Start again</button></div>';
    pk.addEventListener('click', function (e) {
      if (e.target.id === 'pr') { queue = []; pk.querySelector('[data-name]').textContent = 'Press Pick'; pk.querySelector('[data-left]').textContent = ''; return; }
      if (e.target.id !== 'pn') return;
      var names = readNames();
      if (!names.length) { pk.querySelector('[data-name]').textContent = 'Type some names first.'; return; }
      if (!queue.length) { queue = C.order(names); if (queue.length > 1 && queue[0] === last) queue.push(queue.shift()); }
      last = queue.shift(); pk.querySelector('[data-name]').textContent = last;
      pk.querySelector('[data-left]').textContent = queue.length ? queue.length + ' names left in this round.' : 'That was the last name. The next press starts a new round.';
    });
  }

  var sb = el('[data-seats]');
  if (sb) {
    sb.innerHTML = namesBox() + '<div class="fields"><label>Rows<input type="number" id="sr" min="1" max="20" value="4" inputmode="numeric"></label><label>Seats in a row<input type="number" id="sc" min="1" max="20" value="4" inputmode="numeric"></label></div><div class="btns"><button type="button" class="btn" id="sg">Make seating chart</button> <button type="button" class="btn ghost" id="sp">Print</button></div><div class="msg" aria-live="polite" data-msg></div><div data-out></div>';
    sb.addEventListener('click', function (e) {
      if (e.target.id === 'sp') return window.print();
      if (e.target.id !== 'sg') return;
      var names = readNames(), r = Math.min(20, Math.max(1, +el('#sr').value || 1)), c = Math.min(20, Math.max(1, +el('#sc').value || 1)), msg = sb.querySelector('[data-msg]'), out = sb.querySelector('[data-out]');
      if (!names.length) { msg.textContent = 'Type some names.'; out.innerHTML = ''; return; }
      if (names.length > r * c) { msg.textContent = 'There are ' + names.length + ' names but only ' + r * c + ' seats. Add rows or seats.'; out.innerHTML = ''; return; }
      var grid = C.seats(names, r, c);
      msg.textContent = names.length + ' names, ' + r * c + ' seats, ' + (r * c - names.length) + ' empty.';
      out.innerHTML = '<div class="board">Front of the room</div><div class="seats" style="grid-template-columns:repeat(' + c + ',1fr)">' + grid.map(function (row) { return row.map(function (p) { return p === null ? '<span class="e">empty</span>' : '<span>' + esc(p) + '</span>'; }).join(''); }).join('') + '</div>';
    });
  }

  var tm = el('[data-timer]');
  if (tm) {
    tm.innerHTML = '<div class="fields"><label>Minutes<input type="number" id="tmn" min="0" max="180" value="5" inputmode="numeric"></label><label>Seconds<input type="number" id="tsc" min="0" max="59" value="0" inputmode="numeric"></label></div><div class="clock" data-clock>5:00</div><div class="btns"><button type="button" class="btn" id="ts">Start</button> <button type="button" class="btn ghost" id="tp">Pause</button> <button type="button" class="btn ghost" id="tr">Reset</button> <button type="button" class="btn ghost" id="tf">Full screen</button></div><p class="msg" aria-live="polite" data-msg></p>';
    var end = 0, left = 0, run = null, clk = tm.querySelector('[data-clock]');
    var total = function () { return Math.min(180 * 60, Math.max(0, (+el('#tmn').value || 0) * 60 + (+el('#tsc').value || 0))); };
    var show = function (s) { clk.textContent = C.clock(s); clk.className = 'clock' + (s <= 0 ? ' done' : ''); };
    var tick = function () { var s = (end - Date.now()) / 1000; if (s <= 0) { clearInterval(run); run = null; left = 0; show(0); tm.querySelector('[data-msg]').textContent = 'Time is up.'; try { if (navigator.vibrate) navigator.vibrate(300); } catch (x) {} return; } left = s; show(s); };
    tm.addEventListener('input', function () { if (!run) { left = total(); show(left); } });
    tm.addEventListener('click', function (e) {
      var id = e.target.id;
      if (id === 'ts') { if (run) return; if (!left) left = total(); if (!left) return; end = Date.now() + left * 1000; tm.querySelector('[data-msg]').textContent = ''; run = setInterval(tick, 200); tick(); }
      else if (id === 'tp') { if (run) { tick(); clearInterval(run); run = null; } }
      else if (id === 'tr') { clearInterval(run); run = null; left = total(); show(left); tm.querySelector('[data-msg]').textContent = ''; }
      else if (id === 'tf') { try { (clk.requestFullscreen || clk.webkitRequestFullscreen).call(clk); } catch (x) {} }
    });
  }
})();
