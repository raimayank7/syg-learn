/* learn.shareyourgroup.com/codekids: first coding for children: a turtle that draws shapes from a list of steps. The interpreter is a pure function (the build checks it in Node against a separate Python interpreter). Nothing is stored or sent anywhere. */
(function () {
  'use strict';
  var K = {};
  K.LIMIT = 5000; K.DEPTH = 5;
  K.COLORS = { black: '#111111', red: '#d62828', orange: '#e36414', yellow: '#d4a20a', green: '#2a9d3f', blue: '#1d5fd1', purple: '#7b3fb8', pink: '#d6409f', brown: '#8a5a2b', gray: '#6b7280' };
  K.COMMANDS = ['forward', 'back', 'left', 'right', 'penup', 'pendown', 'color', 'repeat', 'end', 'home'];
  var RANGE = { forward: [0, 1000], back: [0, 1000], left: [0, 360], right: [0, 360], repeat: [1, 360] };
  function dist(a, b) {
    var m = [], i, j;
    for (i = 0; i <= a.length; i++) { m[i] = [i]; }
    for (j = 1; j <= b.length; j++) m[0][j] = j;
    for (i = 1; i <= a.length; i++) for (j = 1; j <= b.length; j++) m[i][j] = Math.min(m[i - 1][j] + 1, m[i][j - 1] + 1, m[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return m[a.length][b.length];
  }
  K.suggest = function (w) {
    var best = '', bd = 99;
    K.COMMANDS.forEach(function (c) { var x = dist(w, c); if (x < bd) { bd = x; best = c; } });
    return bd <= 2 ? best : '';
  };
  /* turns the text into a tree of steps, or an error with its line number */
  function parse(src) {
    var lines = String(src).split(/\r?\n/), root = [], stack = [{ body: root, line: 0, n: 0 }], i;
    for (i = 0; i < lines.length; i++) {
      var ln = i + 1, s = lines[i].replace(/#.*/, '').trim().toLowerCase();
      if (!s) continue;
      var tok = s.split(/\s+/), c = tok[0], top = stack[stack.length - 1];
      function fail(msg) { return { line: ln, error: 'Line ' + ln + ': ' + msg }; }
      if (K.COMMANDS.indexOf(c) < 0) { var sg = K.suggest(c); return fail("I do not know the command '" + c + "'." + (sg ? " Did you mean '" + sg + "'?" : '')); }
      if (RANGE[c]) {
        var lo = RANGE[c][0], hi = RANGE[c][1], ex = c + ' ' + (c === 'repeat' ? '4' : c === 'left' || c === 'right' ? '90' : '100');
        if (tok.length !== 2) return fail("'" + c + "' needs a number, like: " + ex + '.');
        if (!/^[0-9]+$/.test(tok[1]) || parseInt(tok[1], 10) < lo || parseInt(tok[1], 10) > hi) return fail("'" + c + "' needs a whole number from " + lo + ' to ' + hi + ', like: ' + ex + '.');
        var n = parseInt(tok[1], 10);
        if (c === 'repeat') {
          if (stack.length > K.DEPTH) return fail('loops are nested too deeply (up to ' + K.DEPTH + ' are allowed).');
          var node = { op: 'repeat', n: n, body: [] }; top.body.push(node); stack.push({ body: node.body, line: ln, n: n });
        } else top.body.push({ op: c, n: n });
      } else if (c === 'color') {
        if (tok.length !== 2) return fail("'color' needs a colour name, like: color red.");
        if (!K.COLORS.hasOwnProperty(tok[1])) return fail("I do not know the colour '" + tok[1] + "'. Try: " + Object.keys(K.COLORS).join(', ') + '.');
        top.body.push({ op: 'color', name: tok[1] });
      } else if (c === 'end') {
        if (tok.length !== 1) return fail("'end' does not need anything after it.");
        if (stack.length === 1) return fail("'end' has no 'repeat' to close.");
        stack.pop();
      } else {
        if (tok.length !== 1) return fail("'" + c + "' does not need anything after it.");
        top.body.push({ op: c });
      }
    }
    if (stack.length > 1) { var l = stack[stack.length - 1].line; return { line: l, error: 'Line ' + l + ": 'repeat' has no 'end'. Add a line with 'end' after its steps." }; }
    return { tree: root };
  }
  /* runs the program: the turtle starts in the middle facing up; moves are every step of the turtle, segments are the ones drawn with the pen down */
  K.run = function (src) {
    var p = parse(src), out = { moves: [], segments: [], steps: 0, stopped: false, error: '', line: 0, final: null };
    var st = { x: 0, y: 0, a: 0, pen: true, color: 'black' };
    if (p.error) { out.error = p.error; out.line = p.line; out.final = { x: 0, y: 0, a: 0, pen: true, color: 'black' }; return out; }
    var halt = false;
    function tick() { if (out.steps >= K.LIMIT) { halt = true; out.stopped = true; return false; } out.steps++; return true; }
    function go(dd) {
      if (dd === 0) return;
      var r = st.a * Math.PI / 180, nx = st.x + dd * Math.sin(r), ny = st.y - dd * Math.cos(r);
      var mv = { x1: st.x, y1: st.y, x2: nx, y2: ny, pen: st.pen, c: st.color };
      out.moves.push(mv); if (st.pen) out.segments.push(mv); st.x = nx; st.y = ny;
    }
    function exec(list) {
      for (var i = 0; i < list.length && !halt; i++) {
        var s = list[i]; if (!tick()) return;
        if (s.op === 'forward') go(s.n); else if (s.op === 'back') go(-s.n);
        else if (s.op === 'left') st.a = (((st.a - s.n) % 360) + 360) % 360; else if (s.op === 'right') st.a = (((st.a + s.n) % 360) + 360) % 360;
        else if (s.op === 'penup') st.pen = false; else if (s.op === 'pendown') st.pen = true;
        else if (s.op === 'color') st.color = s.name; else if (s.op === 'home') { st.x = 0; st.y = 0; st.a = 0; }
        else if (s.op === 'repeat') { for (var k = 0; k < s.n && !halt; k++) exec(s.body); }
      }
    }
    exec(p.tree);
    out.final = { x: st.x, y: st.y, a: st.a, pen: st.pen, color: st.color };
    if (out.stopped) out.error = 'Stopped after ' + K.LIMIT + ' steps so that your page does not freeze. Check your repeat numbers.';
    return out;
  };
  /* scale so that the whole drawing fits in a square of side 2 * half around the start */
  K.fit = function (moves, half) {
    var m = 0; moves.forEach(function (v) { m = Math.max(m, Math.abs(v.x1), Math.abs(v.y1), Math.abs(v.x2), Math.abs(v.y2)); });
    return m <= half ? 1 : half / m;
  };
  K.EXAMPLES = {
    square: ['A square', 'repeat 4\n  forward 100\n  right 90\nend'],
    triangle: ['A triangle', 'repeat 3\n  forward 120\n  right 120\nend'],
    star: ['A five-point star', 'color purple\nrepeat 5\n  forward 160\n  right 144\nend'],
    hexagon: ['A hexagon', 'color green\nrepeat 6\n  forward 90\n  right 60\nend'],
    circle: ['A circle (many tiny steps)', 'color blue\nrepeat 36\n  forward 12\n  right 10\nend'],
    flower: ['A flower', 'color pink\nrepeat 12\n  repeat 6\n    forward 50\n    right 60\n  end\n  right 30\nend'],
    house: ['A house', 'color brown\nrepeat 4\n  forward 100\n  right 90\nend\ncolor red\nforward 100\nright 30\nforward 100\nright 120\nforward 100',],
    stairs: ['Stairs', 'color orange\nrepeat 5\n  forward 30\n  right 90\n  forward 30\n  left 90\nend']
  };
  if (typeof module !== 'undefined' && module.exports) { module.exports = K; return; }
  window.CODEKIDS = K;

  var d = document;
  function q(s) { return d.querySelector(s); }
  var host = q('[data-turtle]'); if (!host) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var SIZE = 480, HALF = 215;
  host.innerHTML =
    '<div class="ck-grid"><div class="ck-code"><label for="ckt"><b>Your steps</b> (one on each line)</label>' +
    '<textarea id="ckt" rows="12" spellcheck="false" autocapitalize="off" autocomplete="off" aria-describedby="ckh"></textarea>' +
    '<p class="hint" id="ckh">Commands: forward, back, left, right, penup, pendown, color, repeat ... end, home. Text after # is a note to yourself.</p>' +
    '<div class="ck-blocks" role="group" aria-label="Add a step"><label>Number <input type="number" id="ckn" value="100" min="0" max="1000" inputmode="numeric"></label>' +
    '<button class="btn ghost" type="button" data-add="forward">forward</button><button class="btn ghost" type="button" data-add="back">back</button><button class="btn ghost" type="button" data-add="left">left</button><button class="btn ghost" type="button" data-add="right">right</button>' +
    '<button class="btn ghost" type="button" data-add="penup">penup</button><button class="btn ghost" type="button" data-add="pendown">pendown</button><button class="btn ghost" type="button" data-add="repeat">repeat ... end</button>' +
    '<label>Colour <select id="ckc"></select></label><button class="btn ghost" type="button" data-add="color">add colour</button><button class="btn ghost" type="button" data-add="undo">Remove last line</button></div>' +
    '<div class="ck-run"><button class="btn" type="button" id="ckr">Run</button><button class="btn ghost" type="button" id="ckw">Watch it draw</button><button class="btn ghost" type="button" id="ckx">Clear picture</button>' +
    '<label>Example <select id="cke"><option value="">Choose one</option></select></label></div></div>' +
    '<div class="ck-pic"><canvas id="ckv" width="' + SIZE + '" height="' + SIZE + '" aria-label="Drawing area"></canvas>' +
    '<p class="ck-msg" id="ckm" aria-live="polite">Press Run to see your steps.</p><div class="ck-run"><button class="btn ghost" type="button" id="cks">Save picture</button></div></div></div>';
  var ta = q('#ckt'), cv = q('#ckv'), cx = cv.getContext('2d'), msg = q('#ckm'), timer = 0;
  Object.keys(K.COLORS).forEach(function (n) { var o = d.createElement('option'); o.value = n; o.textContent = n; q('#ckc').appendChild(o); });
  Object.keys(K.EXAMPLES).forEach(function (k) { var o = d.createElement('option'); o.value = k; o.textContent = K.EXAMPLES[k][0]; q('#cke').appendChild(o); });
  ta.value = K.EXAMPLES.square[1];
  var qm = /[?&]example=([a-z]+)/.exec(window.location.search); if (qm && K.EXAMPLES.hasOwnProperty(qm[1])) ta.value = K.EXAMPLES[qm[1]][1];
  function P(x, y, s) { return [SIZE / 2 + x * s, SIZE / 2 + y * s]; }
  function blank() { cx.fillStyle = '#ffffff'; cx.fillRect(0, 0, SIZE, SIZE); cx.strokeStyle = '#e5e7eb'; cx.lineWidth = 1; cx.beginPath(); cx.moveTo(SIZE / 2, 0); cx.lineTo(SIZE / 2, SIZE); cx.moveTo(0, SIZE / 2); cx.lineTo(SIZE, SIZE / 2); cx.stroke(); }
  function turtle(f, s) {
    var p = P(f.x, f.y, s), r = f.a * Math.PI / 180;
    cx.save(); cx.translate(p[0], p[1]); cx.rotate(r); cx.fillStyle = '#2a9d3f'; cx.strokeStyle = '#14532d'; cx.lineWidth = 2;
    cx.beginPath(); cx.moveTo(0, -12); cx.lineTo(8, 8); cx.lineTo(0, 4); cx.lineTo(-8, 8); cx.closePath(); cx.fill(); cx.stroke(); cx.restore();
  }
  function seg(m, s) { var a = P(m.x1, m.y1, s), b = P(m.x2, m.y2, s); cx.strokeStyle = K.COLORS[m.c]; cx.lineWidth = 3; cx.lineCap = 'round'; cx.beginPath(); cx.moveTo(a[0], a[1]); cx.lineTo(b[0], b[1]); cx.stroke(); }
  function line(n) { var L = ta.value.split(/\r?\n/), a = 0, i; for (i = 0; i < n - 1; i++) a += L[i].length + 1; return [a, a + (L[n - 1] || '').length]; }
  function show(res, anim) {
    clearInterval(timer); blank();
    var s = K.fit(res.moves, HALF);
    if (res.error && !res.stopped) { msg.textContent = res.error; msg.className = 'ck-msg bad'; var r = line(res.line); ta.focus(); ta.setSelectionRange(r[0], r[1]); return; }
    msg.className = 'ck-msg';
    var done = function () {
      blank(); res.moves.forEach(function (m) { if (m.pen) seg(m, s); }); turtle(res.final, s);
      msg.textContent = (res.stopped ? res.error : 'Done: ' + res.steps + ' steps, ' + res.segments.length + ' lines drawn' + (s < 1 ? ', shrunk to fit.' : '.')); if (res.stopped) msg.className = 'ck-msg bad';
    };
    if (!anim || reduce || !res.moves.length) { done(); return; }
    var i = 0, per = Math.max(1, Math.ceil(res.moves.length / 150));
    msg.textContent = 'Drawing...';
    timer = setInterval(function () {
      for (var k = 0; k < per && i < res.moves.length; k++, i++) if (res.moves[i].pen) seg(res.moves[i], s);
      if (i >= res.moves.length) { clearInterval(timer); done(); }
    }, 25);
  }
  q('#ckr').addEventListener('click', function () { show(K.run(ta.value), false); });
  q('#ckw').addEventListener('click', function () { show(K.run(ta.value), true); });
  q('#ckx').addEventListener('click', function () { clearInterval(timer); blank(); msg.textContent = 'The picture is clear. Your steps are still here.'; msg.className = 'ck-msg'; });
  q('#cke').addEventListener('change', function (e) { var v = e.target.value; if (!v) return; ta.value = K.EXAMPLES[v][1]; show(K.run(ta.value), false); e.target.value = ''; });
  q('#cks').addEventListener('click', function () { cv.toBlob(function (bl) { if (!bl) return; var u = URL.createObjectURL(bl), a = d.createElement('a'); a.href = u; a.download = 'turtle-picture.png'; d.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(u); }, 4000); }, 'image/png'); });
  host.addEventListener('click', function (e) {
    var b = e.target.closest('[data-add]'); if (!b) return; var a = b.getAttribute('data-add'), n = parseInt(q('#ckn').value, 10), t = ta.value.replace(/\s+$/, ''), add;
    if (a === 'undo') { var L = t.split(/\r?\n/); L.pop(); ta.value = L.join('\n'); return; }
    if (a === 'penup' || a === 'pendown') add = a; else if (a === 'color') add = 'color ' + q('#ckc').value; else {
      if (isNaN(n) || n < 0) { msg.textContent = 'Type a whole number in the Number box first.'; msg.className = 'ck-msg bad'; return; }
      add = a === 'repeat' ? 'repeat ' + Math.max(1, Math.min(360, n || 1)) + '\n  \nend' : a + ' ' + n;
    }
    ta.value = (t ? t + '\n' : '') + add; ta.focus();
    if (a === 'repeat') { var pos = ta.value.length - 4; ta.setSelectionRange(pos, pos); }
  });
  show(K.run(ta.value), false);
})();
