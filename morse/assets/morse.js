/* learn.shareyourgroup.com/morse: International Morse code translator, player and trainer. The signals (window.MORSE_DATA) are copied at build time from Recommendation ITU-R M.1677-1 (10/2009).
   Pure helpers first (the build recomputes encoding, decoding and timing in Python), then the pages' tools. Nothing is sent anywhere. */
(function () {
  'use strict';
  var M = {}, DATA = null, REV = {};
  M.setData = function (d) {
    DATA = d; REV = {}; M.table = {};
    [d.letters, d.figures, d.punct].forEach(function (t) { Object.keys(t).forEach(function (k) { M.table[k] = t[k]; }); });
    Object.keys(M.table).forEach(function (k) { if (!(M.table[k] in REV)) REV[M.table[k]] = k; });
  };
  /* text -> signals: letters separated by one space, words by " / "; characters with no signal come back in `missing` */
  M.encode = function (text) {
    var words = String(text).toUpperCase().replace('É', 'é').split(/\s+/).filter(Boolean), missing = [], out = [];
    words.forEach(function (w) {
      var sigs = [];
      w.split('').forEach(function (ch) { var k = DATA.letters[ch] ? ch : ch; if (M.table[ch]) sigs.push(M.table[ch]); else if (M.table[ch.toLowerCase()]) sigs.push(M.table[ch.toLowerCase()]); else if (missing.indexOf(ch) < 0) missing.push(ch); });
      if (sigs.length) out.push(sigs.join(' '));
    });
    return { morse: out.join(' / '), missing: missing };
  };
  M.decode = function (morse) {
    var bad = [];
    var text = String(morse).trim().split(/\s*\/\s*|\s{3,}/).map(function (w) { return w.split(/\s+/).filter(Boolean).map(function (s) { s = s.replace(/[−–—]/g, '-').replace(/·|•/g, '.'); if (REV[s] !== undefined) return REV[s]; bad.push(s); return '?'; }).join(''); }).join(' ');
    return { text: text, bad: bad };
  };
  /* timing in dot lengths, from the spacing rules of the Recommendation: dash = 3, gap inside a letter = 1, gap between letters = 3, gap between words = 7 */
  M.timeline = function (morse) {
    var tl = [], words = String(morse).trim().split(/\s*\/\s*/);
    words.forEach(function (w, wi) {
      if (wi) tl.push({ on: false, u: 7 });
      w.split(/\s+/).filter(Boolean).forEach(function (s, si) {
        if (si) tl.push({ on: false, u: 3 });
        s.split('').forEach(function (c, ci) { if (ci) tl.push({ on: false, u: 1 }); tl.push({ on: true, u: c === '-' ? 3 : 1 }); });
      });
    });
    return tl;
  };
  M.units = function (morse) { return M.timeline(morse).reduce(function (a, x) { return a + x.u; }, 0); };
  M.seconds = function (morse, wpm) { return M.units(morse) * 1.2 / wpm; };
  M.ready = function () { return !!DATA; };
  var R = Math.random;
  M.seed = function (s) { var a = s >>> 0; R = function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; };
  function pick(l) { return l[Math.floor(R() * l.length)]; }
  function shuffle(l) { l = l.slice(); for (var j = l.length - 1; j > 0; j--) { var k = Math.floor(R() * (j + 1)), t = l[j]; l[j] = l[k]; l[k] = t; } return l; }
  M.pool = function (kind) { return kind === 'figures' ? Object.keys(DATA.figures) : kind === 'letters' ? Object.keys(DATA.letters).filter(function (c) { return c !== 'é'; }) : Object.keys(DATA.letters).filter(function (c) { return c !== 'é'; }).concat(Object.keys(DATA.figures)); };
  /* a question: show a character, pick its signal (four options), or show a signal, pick the character */
  M.make = function (kind, dir) {
    var pool = M.pool(kind), ch = pick(pool), sig = M.table[ch], opts = [dir === 'toChar' ? ch : sig], g = 0;
    while (opts.length < 4 && g++ < 500) { var c = pick(pool), v = dir === 'toChar' ? c : M.table[c]; if (opts.indexOf(v) < 0) opts.push(v); }
    return { kind: kind, dir: dir, ch: ch, sig: sig, q: dir === 'toChar' ? sig : ch, ans: dir === 'toChar' ? ch : sig, choices: shuffle(opts) };
  };
  if (typeof module !== 'undefined' && module.exports) { module.exports = M; return; }
  window.MORSE = M; M.setData(window.MORSE_DATA);

  var d = document;
  function el(q) { return d.querySelector(q); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function pretty(s) { return String(s).replace(/\./g, '·').replace(/-/g, '−'); }
  function get(k) { try { return JSON.parse(localStorage.getItem('morse-' + k)); } catch (e) { return null; } }
  function put(k, v) { try { localStorage.setItem('morse-' + k, JSON.stringify(v)); } catch (e) {} }

  var tr = el('[data-translate]');
  if (tr) {
    tr.innerHTML = '<div class="fields"><label>Text to Morse<input type="text" id="mt" maxlength="200" value="SOS" autocomplete="off"></label><label>Morse to text (dots and dashes, a slash between words)<input type="text" id="mm" maxlength="600" autocomplete="off" placeholder="... --- ..."></label><label>Speed (words a minute)<input type="number" id="mw" min="5" max="40" value="15" inputmode="numeric"></label></div><div class="result" data-out aria-live="polite"></div><p><button type="button" class="btn" id="mp">Play the sound</button> <button type="button" class="btn ghost" id="ms">Stop</button></p><div class="flash" data-flash aria-hidden="true"></div>';
    var run = function () {
      var e = M.encode(el('#mt').value), dm = el('#mm').value.trim() ? M.decode(el('#mm').value) : null, w = Math.min(40, Math.max(5, +el('#mw').value || 15)), out = tr.querySelector('[data-out]');
      out.innerHTML = '<p>Morse: <b class="mono">' + esc(pretty(e.morse)) + '</b></p>' + (e.missing.length ? '<p>No signal in the ITU table for: ' + esc(e.missing.join(' ')) + '</p>' : '') + (e.morse ? '<p>Length: ' + M.units(e.morse) + ' dot lengths, about ' + (Math.round(M.seconds(e.morse, w) * 10) / 10) + ' seconds at ' + w + ' words a minute.</p>' : '') + (dm ? '<p>Decoded: <b>' + esc(dm.text) + '</b>' + (dm.bad.length ? ' (no letter for: ' + esc(dm.bad.join(' ')) + ')' : '') + '</p>' : '');
      return e;
    };
    var ctx = null, timers = [];
    var stop = function () { timers.forEach(clearTimeout); timers = []; tr.querySelector('[data-flash]').className = 'flash'; };
    tr.addEventListener('input', run);
    tr.addEventListener('click', function (e) {
      if (e.target.id === 'ms') return stop();
      if (e.target.id !== 'mp') return;
      stop(); var enc = run(), w = Math.min(40, Math.max(5, +el('#mw').value || 15)), unit = 1.2 / w, t = 0, tl = M.timeline(enc.morse), fl = tr.querySelector('[data-flash]');
      try { var AC = window.AudioContext || window.webkitAudioContext; ctx = ctx || new AC(); } catch (x) { ctx = null; }
      if (ctx && ctx.resume) ctx.resume();
      tl.forEach(function (s) {
        if (s.on) {
          if (ctx) { var o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.value = 600; g.gain.setValueAtTime(0.0001, ctx.currentTime + t); g.gain.linearRampToValueAtTime(0.2, ctx.currentTime + t + 0.005); g.gain.setValueAtTime(0.2, ctx.currentTime + t + s.u * unit - 0.005); g.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + t + s.u * unit); o.connect(g); g.connect(ctx.destination); o.start(ctx.currentTime + t); o.stop(ctx.currentTime + t + s.u * unit + 0.01); }
          timers.push(setTimeout(function () { fl.className = 'flash on'; }, t * 1000)); timers.push(setTimeout(function () { fl.className = 'flash'; }, (t + s.u * unit) * 1000));
        }
        t += s.u * unit;
      });
    });
    run();
  }

  var box = el('[data-trainer]');
  if (box) {
    var kind = box.getAttribute('data-trainer'), dir = box.getAttribute('data-dir'), st;
    var start = function () {
      var best = get('best-' + kind + dir);
      box.innerHTML = '<div class="pq-setup"><p class="pq-lab">' + (dir === 'toChar' ? 'Read the signal, pick the ' + (kind === 'figures' ? 'figure' : 'character') : 'See the ' + (kind === 'figures' ? 'figure' : 'character') + ', pick its signal') + ': 10 questions</p><p>Signals are shown as dots and dashes, as in Recommendation ITU-R M.1677-1.</p>' + (best !== null ? '<p><b>Your best here: ' + best + ' / 10</b></p>' : '') + '<button type="button" class="btn pq-go">Start</button></div>';
      box.querySelector('.pq-go').onclick = function () { st = { n: 0, right: 0 }; next(); };
    };
    var next = function () {
      if (st.n >= 10) return done();
      var q = M.make(kind, dir); st.n++; st.q = q;
      box.innerHTML = '<div class="pq-top"><span>Question ' + st.n + ' of 10</span><span>Right: ' + st.right + '</span></div><p class="pq-q mono">' + esc(dir === 'toChar' ? pretty(q.q) : q.q) + '</p><div class="pq-ch">' + q.choices.map(function (c, i) { return '<button type="button" data-v="' + esc(c) + '"><i>' + 'ABCD'[i] + '</i> <span class="mono">' + esc(dir === 'toChar' ? c : pretty(c)) + '</span></button>'; }).join('') + '</div><div class="pq-fb" aria-live="polite"></div>';
      [].forEach.call(box.querySelectorAll('.pq-ch button'), function (b) { b.onclick = function () { judge(b.getAttribute('data-v'), b); }; });
    };
    var judge = function (v, btn) {
      var ok = v === st.q.ans; if (ok) st.right++;
      btn.classList.add(ok ? 'good' : 'bad');
      [].forEach.call(box.querySelectorAll('.pq-ch button'), function (b) { b.disabled = true; if (b.getAttribute('data-v') === st.q.ans) b.classList.add('good'); });
      var fb = box.querySelector('.pq-fb'); fb.className = 'pq-fb ' + (ok ? 'good' : 'bad'); fb.innerHTML = '<p><b>' + (ok ? 'Correct.' : 'Not quite.') + '</b> ' + esc(st.q.ch) + ' is ' + esc(pretty(st.q.sig)) + '.</p><button type="button" class="btn pq-next">' + (st.n >= 10 ? 'See result' : 'Next question') + '</button>';
      fb.querySelector('.pq-next').onclick = next; fb.querySelector('.pq-next').focus();
    };
    var done = function () {
      var best = get('best-' + kind + dir); if (best === null || st.right > best) put('best-' + kind + dir, st.right);
      box.innerHTML = '<div class="pq-done"><p class="pq-big">' + st.right + ' / 10</p><p class="hint">The questions change each time.</p><div class="pq-btns"><button type="button" class="btn pq-again">Play again</button></div></div>';
      box.querySelector('.pq-again').onclick = function () { st = { n: 0, right: 0 }; next(); };
    };
    start();
  }
})();
