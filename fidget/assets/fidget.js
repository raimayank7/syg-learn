/* learn.shareyourgroup.com/fidget: calm toys: bubble wrap, sand drawing, a breathing circle. No scores, no accounts, nothing stored, nothing sent anywhere. Pure helpers first (the build checks them in Node against separate Python code). Not health advice. */
(function () {
  'use strict';
  var F = {};
  /* breathing patterns: seconds of [breathe in, hold, breathe out, rest] */
  F.PATTERNS = { even: [4, 0, 4, 0], slow: [4, 0, 6, 0], long: [4, 0, 8, 0], square: [4, 4, 4, 4] };
  F.LABELS = ['Breathe in', 'Hold', 'Breathe out', 'Rest'];
  F.MIN = 0.4;
  F.cycle = function (p) { return p[0] + p[1] + p[2] + p[3]; };
  function ease(x) { return (1 - Math.cos(Math.PI * x)) / 2; }
  /* t = seconds since the start; returns the phase, how far through it, the circle size (0.4 to 1) and whole seconds left in the phase */
  F.phaseAt = function (p, t) {
    var c = F.cycle(p), r = t - Math.floor(t / c) * c, i, len;
    for (i = 0; i < 4; i++) {
      len = p[i]; if (len <= 0) continue;
      if (r < len) {
        var x = r / len, s;
        if (i === 0) s = F.MIN + (1 - F.MIN) * ease(x); else if (i === 1) s = 1; else if (i === 2) s = F.MIN + (1 - F.MIN) * (1 - ease(x)); else s = F.MIN;
        return { phase: i, label: F.LABELS[i], p: x, scale: s, left: Math.ceil(len - r), round: Math.floor(t / c) };
      }
      r -= len;
    }
    return { phase: 3, label: F.LABELS[3], p: 1, scale: F.MIN, left: 0, round: Math.floor(t / c) };
  };
  /* the time (seconds) at which a session of about `minutes` minutes ends: the end of the cycle that reaches that time */
  F.endTime = function (p, minutes) { var c = F.cycle(p); return Math.ceil(minutes * 60 / c) * c; };
  /* bubble wrap: true = still whole */
  F.fill = function (n) { var a = []; for (var i = 0; i < n; i++) a.push(true); return a; };
  F.pop = function (a, i) { if (typeof i !== 'number' || Math.floor(i) !== i || i < 0 || i >= a.length) return 'out'; if (!a[i]) return 'already'; a[i] = false; return 'popped'; };
  F.left = function (a) { var c = 0; a.forEach(function (x) { if (x) c++; }); return c; };
  /* sand: a small seeded random generator, so the same stroke gives the same grains */
  F.rng = function (a) {
    return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  };
  /* points every `step` along a stroke segment, the first at the start; none beyond the end */
  F.dots = function (x0, y0, x1, y1, step) {
    var dx = x1 - x0, dy = y1 - y0, L = Math.sqrt(dx * dx + dy * dy), n = Math.floor(L / step), out = [], k;
    if (!(step > 0)) return [[x0, y0]];
    for (k = 0; k <= n; k++) out.push(L === 0 ? [x0, y0] : [x0 + dx * (k * step) / L, y0 + dy * (k * step) / L]);
    return out;
  };
  /* n grains around (x, y) within `spread` pixels */
  F.grains = function (x, y, n, spread, seed) {
    var r = F.rng(seed), out = [], i;
    for (i = 0; i < n; i++) { var a = r() * 2 * Math.PI, d = spread * Math.sqrt(r()); out.push([x + d * Math.cos(a), y + d * Math.sin(a)]); }
    return out;
  };
  /* a rake: n parallel lines `gap` apart, centred on the stroke segment */
  F.rake = function (x0, y0, x1, y1, n, gap) {
    var dx = x1 - x0, dy = y1 - y0, L = Math.sqrt(dx * dx + dy * dy), out = [], i;
    if (L === 0) return out;
    var nx = -dy / L, ny = dx / L;
    for (i = 0; i < n; i++) { var o = (i - (n - 1) / 2) * gap; out.push([x0 + nx * o, y0 + ny * o, x1 + nx * o, y1 + ny * o]); }
    return out;
  };
  if (typeof module !== 'undefined' && module.exports) { module.exports = F; return; }
  window.FIDGET = F;

  var d = document;
  function q(s, r) { return (r || d).querySelector(s); }
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ac = null;
  function click(freq) {
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      var o = ac.createOscillator(), g = ac.createGain(); o.frequency.value = freq || 180; o.type = 'triangle';
      g.gain.setValueAtTime(0.18, ac.currentTime); g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.09);
      o.connect(g); g.connect(ac.destination); o.start(); o.stop(ac.currentTime + 0.1);
    } catch (e) { /* no sound here */ }
  }

  /* ---- bubble wrap ---- */
  var bw = q('[data-bubbles]');
  if (bw) {
    var N = 48, st = F.fill(N), bt = [];
    bw.innerHTML = '<div class="fg-bar"><label class="fg-chk"><input type="checkbox" id="fgs"> Pop sound</label><button class="btn ghost" type="button" id="fgr">Fill the sheet again</button></div><div class="fg-sheet" id="fgb" aria-label="Bubble wrap"></div><p class="hint" id="fgm" aria-live="polite"></p>';
    var sheet = q('#fgb', bw), msg = q('#fgm', bw);
    for (var i = 0; i < N; i++) { var b = d.createElement('button'); b.type = 'button'; b.className = 'fg-b'; b.setAttribute('data-i', i); b.setAttribute('aria-label', 'Bubble ' + (i + 1) + ', whole'); sheet.appendChild(b); bt.push(b); }
    var upd = function () { var l = F.left(st); msg.textContent = l ? l + ' bubbles left. Press, tap or drag across them.' : 'All popped. Take a breath, or fill the sheet again.'; };
    var popIt = function (i) {
      if (F.pop(st, i) !== 'popped') return;
      bt[i].classList.add('p'); bt[i].setAttribute('aria-label', 'Bubble ' + (i + 1) + ', popped');
      if (q('#fgs', bw).checked) click(140 + (i % 5) * 30);
      upd();
    };
    var down = false;
    sheet.addEventListener('pointerdown', function (e) { var t = e.target.closest('.fg-b'); down = true; if (t) { popIt(+t.getAttribute('data-i')); e.preventDefault(); } });
    sheet.addEventListener('pointermove', function (e) { if (!down) return; var t = d.elementFromPoint(e.clientX, e.clientY); if (t && t.classList && t.classList.contains('fg-b')) popIt(+t.getAttribute('data-i')); });
    window.addEventListener('pointerup', function () { down = false; });
    sheet.addEventListener('click', function (e) { var t = e.target.closest('.fg-b'); if (t && e.detail === 0) popIt(+t.getAttribute('data-i')); });
    q('#fgr', bw).addEventListener('click', function () { st = F.fill(N); bt.forEach(function (x, i) { x.classList.remove('p'); x.setAttribute('aria-label', 'Bubble ' + (i + 1) + ', whole'); }); upd(); });
    upd();
  }

  /* ---- sand drawing ---- */
  var sd = q('[data-sand]');
  if (sd) {
    var COL = { sand: ['#d9b66d', '#c9a45a', '#e6c985', '#b88f45'], grey: ['#9aa3ad', '#8a929c', '#b0b8c0', '#79828c'], rose: ['#d98aa0', '#c97790', '#e8a6b8', '#b86580'], sea: ['#6fb7c4', '#5aa4b2', '#8ccad5', '#4a929f'] };
    sd.innerHTML = '<div class="fg-bar"><label>Tool <select id="sdm"><option value="sand">Draw in sand</option><option value="rake">Rake lines</option></select></label>' +
      '<label>Sand <select id="sdc"><option value="sand">Warm sand</option><option value="grey">Grey sand</option><option value="rose">Rose sand</option><option value="sea">Sea sand</option></select></label>' +
      '<button class="btn ghost" type="button" id="sdx">Smooth the sand</button><button class="btn ghost" type="button" id="sds">Save picture</button></div>' +
      '<canvas id="sdv" width="640" height="400" aria-label="Sand drawing area. Drag with a mouse or finger."></canvas><p class="hint">Drag on the sand. The picture is only on your screen; nothing is saved unless you press Save picture.</p>';
    var cv = q('#sdv', sd), cx = cv.getContext('2d'), bg = '#2b2f36';
    var smooth = function () { cx.fillStyle = bg; cx.fillRect(0, 0, cv.width, cv.height); };
    smooth();
    var last = null, seed = 1;
    var pos = function (e) { var r = cv.getBoundingClientRect(); return [(e.clientX - r.left) * cv.width / r.width, (e.clientY - r.top) * cv.height / r.height]; };
    var stroke = function (a, b) {
      var mode = q('#sdm', sd).value, pal = COL[q('#sdc', sd).value];
      if (mode === 'rake') {
        F.rake(a[0], a[1], b[0], b[1], 5, 9).forEach(function (s) { cx.strokeStyle = 'rgba(20,22,26,.55)'; cx.lineWidth = 2; cx.lineCap = 'round'; cx.beginPath(); cx.moveTo(s[0], s[1]); cx.lineTo(s[2], s[3]); cx.stroke(); });
        return;
      }
      F.dots(a[0], a[1], b[0], b[1], 3).forEach(function (p) {
        F.grains(p[0], p[1], 4, 7, seed++).forEach(function (g, k) { cx.fillStyle = pal[(seed + k) % pal.length]; cx.fillRect(g[0], g[1], 2, 2); });
      });
    };
    cv.addEventListener('pointerdown', function (e) { last = pos(e); stroke(last, last); try { cv.setPointerCapture(e.pointerId); } catch (x) { /* fine */ } e.preventDefault(); });
    cv.addEventListener('pointermove', function (e) { if (!last) return; var p = pos(e); stroke(last, p); last = p; });
    var end = function () { last = null; }; cv.addEventListener('pointerup', end); cv.addEventListener('pointercancel', end);
    q('#sdx', sd).addEventListener('click', smooth);
    q('#sds', sd).addEventListener('click', function () { cv.toBlob(function (bl) { if (!bl) return; var u = URL.createObjectURL(bl), a = d.createElement('a'); a.href = u; a.download = 'sand-picture.png'; d.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(u); }, 4000); }, 'image/png'); });
  }

  /* ---- breathing circle ---- */
  var br = q('[data-breath]');
  if (br) {
    br.innerHTML = '<div class="fg-bar"><label>Pattern <select id="brp"><option value="even">Even: in 4, out 4</option><option value="slow" selected>Slow out: in 4, out 6</option><option value="long">Long out: in 4, out 8</option><option value="square">Square: 4, 4, 4, 4</option></select></label>' +
      '<label>Stop after <select id="brm"><option value="0">I will stop it myself</option><option value="1">about 1 minute</option><option value="2">about 2 minutes</option><option value="3">about 3 minutes</option></select></label>' +
      '<button class="btn" type="button" id="brg">Start</button></div>' +
      '<div class="fg-stage"><div class="fg-ring" id="brc" role="img" aria-label="Breathing circle"><span class="fg-lab" id="brl" aria-live="off">Press Start</span><span class="fg-sec" id="brs"></span></div></div>' +
      '<div class="fg-prog" id="brb" hidden><i></i></div><p class="hint" id="brt" aria-live="polite">This is a calm-down toy and a timer. It is not health advice or a treatment.</p>';
    var circle = q('#brc', br), lab = q('#brl', br), sec = q('#brs', br), go = q('#brg', br), prog = q('#brb', br), note = q('#brt', br);
    var run = false, t0 = 0, acc = 0, raf = 0, lastPhase = -1;
    if (reduce) { prog.hidden = false; circle.classList.add('still'); }
    var frame = function () {
      var pat = F.PATTERNS[q('#brp', br).value], t = acc + (performance.now() - t0) / 1000, mins = +q('#brm', br).value;
      if (mins && t >= F.endTime(pat, mins)) { stop(true); return; }
      var r = F.phaseAt(pat, t);
      if (!reduce) circle.style.transform = 'scale(' + r.scale.toFixed(3) + ')';
      else q('i', prog).style.width = Math.round(r.p * 100) + '%';
      lab.textContent = r.label; sec.textContent = r.left ? String(r.left) : '';
      if (r.phase !== lastPhase) { lastPhase = r.phase; note.textContent = r.label + ' for ' + pat[r.phase] + ' seconds.'; }
      raf = requestAnimationFrame(frame);
    };
    var stop = function (done) {
      run = false; cancelAnimationFrame(raf); go.textContent = 'Start'; acc = 0; lastPhase = -1;
      if (!reduce) circle.style.transform = 'scale(' + F.MIN + ')';
      lab.textContent = done ? 'All done' : 'Press Start'; sec.textContent = '';
      note.textContent = done ? 'That is the end of the time you chose. You can start again whenever you like.' : 'Stopped.';
    };
    go.addEventListener('click', function () {
      if (run) { stop(false); return; }
      run = true; t0 = performance.now(); acc = 0; go.textContent = 'Stop'; raf = requestAnimationFrame(frame);
    });
    if (!reduce) circle.style.transform = 'scale(' + F.MIN + ')';
  }
})();
