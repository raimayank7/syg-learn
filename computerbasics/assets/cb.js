/* learn.shareyourgroup.com/computerbasics: a typing drill and a mouse practice game. The pure helpers come first (the build runs them in Node and recomputes every result in Python from
   separate code), then the page tools. Nothing leaves the browser; only the best typing speed and the last chosen level are kept in localStorage. */
(function () {
  'use strict';
  var CB = {};
  var LISTS = {"l1": ["sad", "dad", "fall", "lass", "flask", "glad", "hash", "gas", "ask", "has", "had", "salad", "slash", "shall", "flag", "lad", "dash", "half", "hall", "gash", "alfalfa", "sash", "fads", "glass", "flash", "sags", "lags"], "l2": ["the", "and", "you", "home", "time", "good", "with", "water", "phone", "family", "mother", "father", "market", "school", "garden", "friend", "letter", "morning", "evening", "simple", "careful", "message", "button", "screen", "mouse", "window", "folder", "number", "green", "yellow", "bottle", "candle", "doctor", "kitchen", "paper", "picture"], "l3": ["Please send me the photo tonight.", "The bus leaves at nine in the morning.", "My granddaughter showed me how to write a letter.", "Press the green button to start.", "We had tea and biscuits in the garden.", "Always check the name before you click.", "The market is closed on Sunday.", "Save your work before you close the window.", "Call me when you reach home.", "A good password is long and easy for you to remember.", "Never tell anyone your secret code.", "The cat sat quietly by the window.", "Read the whole message before you reply.", "I will bring the books tomorrow.", "Take a short rest and then try again.", "Slow and steady wins the race.", "Ask a trusted person if you are not sure.", "The train was late but we arrived safely.", "Please keep the door open for fresh air.", "Learning something new is a good habit."], "l4": ["2468", "1357 9", "10 20 30 40", "7 + 5 = 12", "25 x 4 = 100", "9 - 3 = 6", "48 / 6 = 8", "15 + 27 = 42", "100 - 36 = 64", "3 x 12 = 36", "120 + 80 = 200", "81 / 9 = 9", "5, 10, 15, 20", "Item 3 of 8", "Page 12 of 40", "2026-11-14", "64 - 19 = 45", "6 x 7 = 42"]};
  CB.LISTS = LISTS;
  CB.RAD = [0, 40, 25, 38];     /* target radius by level 1..3, in arena units (the arena is 320 x 320) */
  CB.N = 10; CB.SIZE = 320; CB.DBL = 600;

  /* a small seeded generator so the same seed gives the same drill and the same targets */
  function norm(seed) { return (Math.abs(Math.floor(seed)) % 2147483647) || 1; }
  function nxt(s) { return (s * 48271) % 2147483647; }

  /* typing drill: level 1 home row words, 2 common words, 3 sentences, 4 numbers; returns the text to type */
  CB.COUNT = [0, 8, 8, 2, 5];
  CB.drill = function (level, seed) {
    var list = LISTS['l' + level], s = norm(seed), out = [];
    for (var i = 0; i < CB.COUNT[level]; i++) { s = nxt(s); out.push(list[s % list.length]); }
    return out.join(' ');
  };
  /* compare what was typed with the target, place by place. Characters beyond the end of the target count as wrong. Accuracy and speed are rounded half up in whole numbers.
     Speed = right characters / 5 = words, per minute. */
  CB.typing = function (target, typed, ms) {
    var n = typed.length, c = 0;
    for (var i = 0; i < n; i++) if (i < target.length && typed.charAt(i) === target.charAt(i)) c++;
    var acc = n === 0 ? 0 : Math.floor((200 * c + n) / (2 * n));
    var wpm = ms > 0 ? Math.floor((24000 * c + ms) / (2 * ms)) : 0;
    return { correct: c, errors: n - c, acc: acc, wpm: wpm };
  };

  /* mouse game targets: ten circles, each at least 60 units from the one before */
  CB.targets = function (level, seed) {
    var r = CB.RAD[level], lo = r + 4, span = CB.SIZE - 2 * lo + 1, s = norm(seed), out = [], px = -1000, py = -1000;
    for (var k = 0; k < CB.N; k++) {
      var x = 0, y = 0;
      for (var a = 0; a < 50; a++) {
        s = nxt(s); x = lo + (s % span); s = nxt(s); y = lo + (s % span);
        if ((x - px) * (x - px) + (y - py) * (y - py) >= 3600) break;
      }
      out.push({ x: x, y: y, r: r }); px = x; py = y;
    }
    return out;
  };
  CB.hit = function (t, x, y) { var dx = x - t.x, dy = y - t.y; return dx * dx + dy * dy <= t.r * t.r; };
  /* play: feed the clicks in order [{x, y, t(ms)}]. Levels 1 and 2: one click on the target moves to the next. Level 3: a double click, two clicks on the target at most 600 ms apart.
     The first click of a pair is neither a hit nor a miss; a click off the target is a miss and cancels a half-done pair. */
  CB.play = function (level, seed, events) {
    var tg = CB.targets(level, seed), cur = 0, hits = 0, miss = 0, last = null;
    for (var i = 0; i < events.length; i++) {
      if (cur >= CB.N) break;
      var e = events[i], inside = CB.hit(tg[cur], e.x, e.y);
      if (!inside) { miss++; last = null; continue; }
      if (level === 3) {
        if (last !== null && last.cur === cur && e.t - last.t <= CB.DBL) { hits++; cur++; last = null; } else last = { cur: cur, t: e.t };
      } else { hits++; cur++; }
    }
    var tot = hits + miss;
    return { cur: cur, hits: hits, miss: miss, done: cur >= CB.N, acc: tot === 0 ? 0 : Math.floor((200 * hits + tot) / (2 * tot)), pending: last !== null };
  };

  if (typeof module !== 'undefined' && module.exports) { module.exports = CB; return; }
  window.CB = CB;

  var d = document;
  function el(q) { return d.querySelector(q); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function get(k) { try { return JSON.parse(localStorage.getItem('cb-' + k)); } catch (e) { return null; } }
  function put(k, v) { try { localStorage.setItem('cb-' + k, JSON.stringify(v)); } catch (e) {} }
  function seed() { return 1 + Math.floor(Math.random() * 2000000000); }

  /* ---- typing drill ---- */
  var ty = el('[data-typing]');
  if (ty) {
    var lv = get('tlevel') || 1, target = '', t0 = 0, fin = false;
    ty.innerHTML = '<div class="fields"><label>Practice level<select id="tl"><option value="1">1. Home row letters</option><option value="2">2. Common words</option><option value="3">3. Whole sentences</option><option value="4">4. Numbers and signs</option></select></label></div>' +
      '<div class="tgt" id="tg" aria-label="Text to type"></div>' +
      '<label class="tin">Type here<input id="ti" type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" aria-describedby="tmsg"></label>' +
      '<div class="btns"><button type="button" class="btn" id="tn">New practice text</button></div>' +
      '<p class="msg" id="tmsg" aria-live="polite">Start typing. The clock starts with your first key and stops when you reach the end.</p>' +
      '<div class="res" id="tr" hidden></div>';
    var sel = el('#tl'), inp = el('#ti'), tg = el('#tg'), msg = el('#tmsg'), res = el('#tr');
    sel.value = String(lv);
    var show = function () {
      var typed = inp.value, h = '';
      for (var i = 0; i < target.length; i++) {
        var c = target.charAt(i), cls = i < typed.length ? (typed.charAt(i) === c ? 'ok' : 'bad') : (i === typed.length ? 'cur' : '');
        h += '<span class="' + cls + '">' + (c === ' ' ? '&nbsp;' : esc(c)) + '</span>';
      }
      tg.innerHTML = h;
    };
    var fresh = function () { lv = +sel.value; put('tlevel', lv); target = CB.drill(lv, seed()); inp.value = ''; inp.disabled = false; fin = false; t0 = 0; res.hidden = true; msg.textContent = 'Start typing. The clock starts with your first key and stops when you reach the end.'; show(); };
    sel.addEventListener('change', fresh);
    el('#tn').addEventListener('click', function () { fresh(); inp.focus(); });
    inp.addEventListener('input', function () {
      if (fin) return;
      if (!t0) t0 = performance.now();
      show();
      if (inp.value.length >= target.length) {
        fin = true; inp.disabled = true;
        var ms = Math.max(1, Math.round(performance.now() - t0)), r = CB.typing(target, inp.value, ms), best = get('best') || 0, note = '';
        if (r.wpm > best && r.acc >= 90) { put('best', r.wpm); note = ' New best speed on this device.'; }
        res.hidden = false; res.setAttribute('data-ms', ms);
        res.innerHTML = '<p><b>Speed:</b> <span id="rw">' + r.wpm + '</span> words a minute</p><p><b>Accuracy:</b> <span id="ra">' + r.acc + '</span> per cent</p><p><b>Mistakes:</b> <span id="re">' + r.errors + '</span> &nbsp; <b>Time:</b> ' + (ms / 1000).toFixed(1) + ' seconds</p>';
        msg.textContent = 'Finished.' + note + ' Speed counts every five right characters as one word. Press New practice text to go again. Accuracy matters more than speed when you are learning.';
      }
    });
    fresh();
  }

  /* ---- mouse practice ---- */
  var ms = el('[data-mouse]');
  if (ms) {
    var level = get('mlevel') || 1, sd = 0, evs = [], st = null, t1 = 0, running = false, tgs = [];
    ms.innerHTML = '<div class="fields"><label>Practice level<select id="ml"><option value="1">1. Click big circles</option><option value="2">2. Click small circles</option><option value="3">3. Double-click circles</option></select></label></div>' +
      '<div class="mhud"><span id="mp">Target 0 of 10</span><span id="mh">Hits 0</span><span id="mm">Misses 0</span></div>' +
      '<div class="arena" id="ar" role="group" aria-label="Practice area. Use a mouse or tap with a finger."><div class="dot" id="dt" hidden></div></div>' +
      '<div class="btns"><button type="button" class="btn" id="mg">Start</button></div>' +
      '<p class="msg" id="mmsg" aria-live="polite">Press Start, then click the circle each time it appears.</p>';
    var msel = el('#ml'), ar = el('#ar'), dt = el('#dt'), mmsg = el('#mmsg');
    msel.value = String(level);
    var hint = function () { return level === 3 ? 'Double-click each circle: two quick clicks on it.' : 'Click the circle each time it appears.'; };
    var draw = function () {
      var s = CB.play(level, sd, evs);
      el('#mp').textContent = 'Target ' + Math.min(s.cur + 1, CB.N) + ' of ' + CB.N; el('#mh').textContent = 'Hits ' + s.hits; el('#mm').textContent = 'Misses ' + s.miss;
      if (s.done) {
        running = false; dt.hidden = true; el('#mg').textContent = 'Play again';
        var secs = ((evs[evs.length - 1].t - t1) / 1000).toFixed(1);
        mmsg.innerHTML = 'Done in ' + secs + ' seconds. Accuracy: <b id="macc">' + s.acc + '</b> per cent (' + s.hits + ' hits, ' + s.miss + ' misses). Try the next level, or go again and beat your time.';
        return;
      }
      var t = tgs[s.cur];
      dt.hidden = false; dt.style.width = (2 * t.r * 100 / CB.SIZE) + '%'; dt.style.left = ((t.x - t.r) * 100 / CB.SIZE) + '%'; dt.style.top = ((t.y - t.r) * 100 / CB.SIZE) + '%';
      dt.className = 'dot' + (s.pending ? ' half' : '');
    };
    var begin = function () { level = +msel.value; put('mlevel', level); sd = seed(); evs = []; tgs = CB.targets(level, sd); running = true; t1 = performance.now(); el('#mg').textContent = 'Restart'; mmsg.textContent = hint(); draw(); };
    msel.addEventListener('change', function () { level = +msel.value; put('mlevel', level); running = false; dt.hidden = true; el('#mg').textContent = 'Start'; mmsg.textContent = 'Press Start. ' + hint(); });
    el('#mg').addEventListener('click', begin);
    ar.addEventListener('pointerdown', function (e) {
      if (!running) return;
      var r = ar.getBoundingClientRect(), k = CB.SIZE / r.width;
      evs.push({ x: (e.clientX - r.left) * k, y: (e.clientY - r.top) * k, t: performance.now() });
      draw();
    });
    ar.addEventListener('dblclick', function (e) { e.preventDefault(); });
  }
})();
