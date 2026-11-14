/* learn.shareyourgroup.com/mindmap: draw a mind map in the browser. Pure model helpers first (the build checks them in Node against separate Python code), then the page. Maps are saved in this browser only; nothing is sent anywhere. */
(function () {
  'use strict';
  var M = {};
  M.MAXNODES = 150; M.MAXTEXT = 40; M.H = 40; M.HGAP = 24; M.VGAP = 48; M.PAD = 24;
  var FILL = ['#ffe08a', '#bfe3ff', '#c8f0c8', '#ffd0d0', '#e3d4ff', '#ffe0f0'];
  var LINE = ['#9a6b00', '#2a6fa8', '#2f7a2f', '#b04040', '#6b4fb0', '#b0407f'];
  M.clean = function (t) { t = String(t == null ? '' : t).replace(/\s+/g, ' ').trim().slice(0, M.MAXTEXT).trim(); return t || 'Idea'; };
  M.W = function (t) { return Math.min(344, Math.max(72, 24 + 8 * t.length)); };
  M.create = function (t) { return { nodes: [{ id: 1, p: 0, t: M.clean(t) }], next: 2 }; };
  M.find = function (m, id) { for (var i = 0; i < m.nodes.length; i++) if (m.nodes[i].id === id) return m.nodes[i]; return null; };
  M.kids = function (m, id) { return m.nodes.filter(function (n) { return n.p === id; }); };
  /* ids of id and everything below it */
  M.sub = function (m, id) {
    var set = {}; set[id] = true; var grew = true;
    while (grew) { grew = false; m.nodes.forEach(function (n) { if (!set[n.id] && set[n.p]) { set[n.id] = true; grew = true; } }); }
    return set;
  };
  M.add = function (m, p, t) {
    if (!M.find(m, p) || m.nodes.length >= M.MAXNODES) return 0;
    var id = m.next++; m.nodes.push({ id: id, p: p, t: M.clean(t) }); return id;
  };
  M.addBeside = function (m, id, t) { var n = M.find(m, id); if (!n || n.p === 0) return 0; return M.add(m, n.p, t); };
  M.rename = function (m, id, t) { var n = M.find(m, id); if (!n) return false; n.t = M.clean(t); return true; };
  M.remove = function (m, id) {
    var n = M.find(m, id); if (!n || n.p === 0) return false;
    var set = M.sub(m, id); m.nodes = m.nodes.filter(function (x) { return !set[x.id]; }); return true;
  };
  M.move = function (m, id, np) {
    var n = M.find(m, id), t = M.find(m, np);
    if (!n || !t || n.p === 0) return false;
    if (M.sub(m, id)[np]) return false;
    n.p = np; return true;
  };
  M.depth = function (m, id) { var d = 0, n = M.find(m, id); while (n && n.p !== 0) { n = M.find(m, n.p); d++; } return d; };
  /* tidy tree: depth sets the row, every node stays inside the span of its own branch; manual positions (fx, fy) then override */
  M.layout = function (m) {
    var by = {}; m.nodes.forEach(function (n) { (by[n.p] = by[n.p] || []).push(n); });
    var root = (by[0] || [])[0]; if (!root) return;
    var sp = {};
    function span(n) {
      var ch = by[n.id] || [], w = M.W(n.t), s = 0;
      ch.forEach(function (c, i) { s += span(c) + (i ? M.HGAP : 0); });
      sp[n.id] = Math.max(w, s); return sp[n.id];
    }
    function place(n, left, d) {
      var ch = by[n.id] || [], w = M.W(n.t);
      n.w = w; n.h = M.H; n.y = d * (M.H + M.VGAP);
      if (!ch.length) { n.x = left + (sp[n.id] - w) / 2; return; }
      var s = 0; ch.forEach(function (c) { s += sp[c.id]; }); s += M.HGAP * (ch.length - 1);
      var cx = left + (sp[n.id] - s) / 2;
      ch.forEach(function (c) { place(c, cx, d + 1); cx += sp[c.id] + M.HGAP; });
      var f = ch[0], l = ch[ch.length - 1];
      var x = ((f.x + f.w / 2) + (l.x + l.w / 2)) / 2 - w / 2;
      n.x = Math.max(left, Math.min(x, left + sp[n.id] - w));
    }
    span(root); place(root, 0, 0);
    m.nodes.forEach(function (n) { if (typeof n.fx === 'number' && typeof n.fy === 'number') { n.x = n.fx; n.y = n.fy; } });
  };
  M.bounds = function (m) {
    var x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    m.nodes.forEach(function (n) { x0 = Math.min(x0, n.x); y0 = Math.min(y0, n.y); x1 = Math.max(x1, n.x + n.w); y1 = Math.max(y1, n.y + n.h); });
    return { x: x0 - M.PAD, y: y0 - M.PAD, w: x1 - x0 + 2 * M.PAD, h: y1 - y0 + 2 * M.PAD };
  };
  M.esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  /* the picture: used on screen (with ids) and for PNG, SVG and print (without) */
  M.svg = function (m, o) {
    o = o || {}; M.layout(m); var b = M.bounds(m), out = [];
    out.push('<svg xmlns="http://www.w3.org/2000/svg" width="' + b.w + '" height="' + b.h + '" viewBox="' + b.x + ' ' + b.y + ' ' + b.w + ' ' + b.h + '" font-family="Arial, Helvetica, sans-serif" font-size="15">');
    out.push('<rect x="' + b.x + '" y="' + b.y + '" width="' + b.w + '" height="' + b.h + '" fill="#ffffff"/>');
    m.nodes.forEach(function (n) {
      if (n.p === 0) return; var p = M.find(m, n.p), x1 = p.x + p.w / 2, y1 = p.y + p.h, x2 = n.x + n.w / 2, y2 = n.y, my = (y1 + y2) / 2;
      out.push('<path d="M' + x1 + ' ' + y1 + ' C' + x1 + ' ' + my + ' ' + x2 + ' ' + my + ' ' + x2 + ' ' + y2 + '" fill="none" stroke="#7a7a7a" stroke-width="2"/>');
    });
    m.nodes.forEach(function (n) {
      var d = M.depth(m, n.id) % FILL.length, sel = o.sel === n.id;
      var at = o.ids ? ' data-id="' + n.id + '" tabindex="0" role="button" aria-label="' + M.esc(n.t) + (sel ? ', selected' : '') + '"' : '';
      out.push('<g' + at + (sel ? ' class="sel"' : '') + '><rect x="' + n.x + '" y="' + n.y + '" width="' + n.w + '" height="' + n.h + '" rx="10" fill="' + FILL[d] + '" stroke="' + LINE[d] + '" stroke-width="' + (sel ? 4 : 2) + '"/>' +
        '<text x="' + (n.x + n.w / 2) + '" y="' + (n.y + n.h / 2 + 5) + '" text-anchor="middle" fill="#1b1b1b">' + M.esc(n.t) + '</text></g>');
    });
    out.push('</svg>'); return out.join('');
  };
  M.toJSON = function (m) {
    return JSON.stringify({ v: 1, next: m.next, nodes: m.nodes.map(function (n) { var o = { i: n.id, p: n.p, t: n.t }; if (typeof n.fx === 'number' && typeof n.fy === 'number') { o.fx = n.fx; o.fy = n.fy; } return o; }) });
  };
  M.fromJSON = function (s) {
    var d; try { d = JSON.parse(s); } catch (e) { return null; }
    if (!d || d.v !== 1 || !Array.isArray(d.nodes) || d.nodes.length < 1 || d.nodes.length > M.MAXNODES) return null;
    var ids = {}, nodes = [], roots = 0, mx = 0, i;
    for (i = 0; i < d.nodes.length; i++) {
      var o = d.nodes[i];
      if (!o || typeof o.i !== 'number' || o.i < 1 || Math.floor(o.i) !== o.i || ids[o.i]) return null;
      if (typeof o.p !== 'number' || o.p < 0 || Math.floor(o.p) !== o.p || typeof o.t !== 'string') return null;
      var n = { id: o.i, p: o.p, t: M.clean(o.t) };
      if (o.fx !== undefined || o.fy !== undefined) {
        if (typeof o.fx !== 'number' || typeof o.fy !== 'number' || !isFinite(o.fx) || !isFinite(o.fy) || Math.abs(o.fx) > 5000 || Math.abs(o.fy) > 5000) return null;
        n.fx = o.fx; n.fy = o.fy;
      }
      ids[o.i] = true; if (o.p === 0) roots++; mx = Math.max(mx, o.i); nodes.push(n);
    }
    if (roots !== 1) return null;
    var m = { nodes: nodes, next: 0 };
    for (i = 0; i < nodes.length; i++) {
      if (nodes[i].p !== 0 && !ids[nodes[i].p]) return null;
      var k = 0, cur = nodes[i];
      while (cur && cur.p !== 0) { cur = M.find(m, cur.p); if (++k > nodes.length) return null; }
    }
    if (typeof d.next !== 'number' || Math.floor(d.next) !== d.next || d.next <= mx) return null;
    m.next = d.next; return m;
  };
  /* ready-made starting maps */
  var EX = {
    blank: ['My topic', []],
    essay: ['My essay', [['Introduction', ['Hook', 'Main question']], ['Point one', ['Evidence', 'Example']], ['Point two', ['Evidence', 'Example']], ['Point three', ['Evidence', 'Example']], ['Conclusion', ['Answer the question', 'Last thought']]]],
    revision: ['Revision plan', [['Topics', ['Topic A', 'Topic B', 'Topic C']], ['Hard parts', ['Ask for help', 'Practise again']], ['Timetable', ['Week one', 'Week two']], ['Check', ['Past questions', 'Teach a friend']]]],
    trip: ['Day trip', [['Where', ['Place', 'Travel']], ['Who', ['Family', 'Friends']], ['Pack', ['Water', 'Snacks', 'Bag']], ['Plan', ['Morning', 'Afternoon']]]],
    project: ['Group project', [['Goal', ['What we make', 'Who it is for']], ['People', ['Jobs', 'Meeting times']], ['Steps', ['Plan', 'Make', 'Check']], ['Show', ['Poster', 'Talk']]]]
  };
  M.exampleNames = function () { return Object.keys(EX); };
  M.example = function (name) {
    var e = EX[name]; if (!e) return null; var m = M.create(e[0]);
    e[1].forEach(function (b) { var id = M.add(m, 1, b[0]); b[1].forEach(function (c) { M.add(m, id, c); }); });
    return m;
  };
  if (typeof module !== 'undefined' && module.exports) { module.exports = M; return; }
  window.MINDMAP = M;

  var d = document;
  function q(s) { return d.querySelector(s); }
  var host = q('[data-mm]'); if (!host) return;
  var KEY = 'syg-mindmap-v1', m = null, sel = 1;
  try { var sv = localStorage.getItem(KEY); if (sv) m = M.fromJSON(sv); } catch (e) { m = null; }
  if (!m) m = M.example('essay');
  host.innerHTML =
    '<div class="mm-bar" role="toolbar" aria-label="Map tools">' +
    '<button class="btn" type="button" data-a="child">Add idea under selected</button>' +
    '<button class="btn ghost" type="button" data-a="beside">Add beside selected</button>' +
    '<button class="btn ghost" type="button" data-a="del">Delete selected</button>' +
    '<button class="btn ghost" type="button" data-a="tidy">Auto-arrange</button></div>' +
    '<div class="mm-edit"><label>Text of the selected idea<input type="text" id="mmt" maxlength="40" autocomplete="off"></label>' +
    '<label>Move it under<select id="mmp"></select></label>' +
    '<label>Start from<select id="mmx"></select></label></div>' +
    '<p class="hint" id="mmh">Click an idea to select it. Drag it to move it. Press Enter in the text box to add the next idea.</p>' +
    '<div class="mm-wrap" id="mmw" tabindex="-1"></div>' +
    '<div class="mm-bar mm-out" role="toolbar" aria-label="Save and print">' +
    '<button class="btn ghost" type="button" data-a="png">Save picture (PNG)</button><button class="btn ghost" type="button" data-a="svg">Save picture (SVG)</button>' +
    '<button class="btn ghost" type="button" data-a="print">Print</button><button class="btn ghost" type="button" data-a="file">Save map file</button>' +
    '<button class="btn ghost" type="button" data-a="open">Open map file</button><input type="file" id="mmf" accept=".json,application/json" hidden></div>' +
    '<p class="hint" id="mms" aria-live="polite"></p>';
  var wrap = q('#mmw'), inp = q('#mmt'), psel = q('#mmp'), xsel = q('#mmx'), stat = q('#mms');
  M.exampleNames().forEach(function (k) { var o = d.createElement('option'); o.value = k; o.textContent = { blank: 'A blank map', essay: 'Essay plan', revision: 'Revision plan', trip: 'Day trip', project: 'Group project' }[k]; xsel.appendChild(o); });
  var ph = d.createElement('option'); ph.value = ''; ph.textContent = 'Choose a starter map'; xsel.insertBefore(ph, xsel.firstChild); xsel.value = '';
  function say(t) { stat.textContent = t; }
  function save() { try { localStorage.setItem(KEY, M.toJSON(m)); say('Saved in this browser only.'); } catch (e) { say('Could not save in this browser; use Save map file to keep it.'); } }
  function fillParents() {
    psel.innerHTML = ''; var n = M.find(m, sel), set = M.sub(m, sel);
    m.nodes.forEach(function (x) { if (set[x.id]) return; var o = d.createElement('option'); o.value = x.id; o.textContent = x.t; psel.appendChild(o); });
    if (n && n.p) psel.value = n.p; psel.disabled = !n || n.p === 0;
  }
  function draw() {
    if (!M.find(m, sel)) sel = 1;
    wrap.innerHTML = M.svg(m, { ids: true, sel: sel });
    var n = M.find(m, sel); if (d.activeElement !== inp) inp.value = n ? n.t : '';
    fillParents();
  }
  function change() { draw(); save(); }
  function select(id, focusText) { sel = id; draw(); if (focusText) { inp.focus(); inp.select(); } }
  function addChild(beside) {
    var id = beside ? M.addBeside(m, sel, 'New idea') : M.add(m, sel, 'New idea');
    if (!id) { say(beside ? 'The first idea has no neighbours; add under it instead.' : 'This map is full (150 ideas).'); return 0; }
    sel = id; change(); inp.value = 'New idea'; inp.focus(); inp.select(); return id;
  }
  host.addEventListener('click', function (e) {
    var b = e.target.closest('[data-a]'); if (!b) return; var a = b.getAttribute('data-a');
    if (a === 'child') addChild(false);
    else if (a === 'beside') addChild(true);
    else if (a === 'del') { var n = M.find(m, sel); if (!M.remove(m, sel)) say('The first idea cannot be deleted. Rename it instead.'); else { sel = n.p; change(); say('Deleted, with everything under it.'); } }
    else if (a === 'tidy') { m.nodes.forEach(function (n) { delete n.fx; delete n.fy; }); change(); say('Arranged.'); }
    else if (a === 'print') { window.print(); }
    else if (a === 'png') toPng();
    else if (a === 'svg') download(new Blob([M.svg(m, {})], { type: 'image/svg+xml' }), 'mind-map.svg');
    else if (a === 'file') download(new Blob([M.toJSON(m)], { type: 'application/json' }), 'mind-map.json');
    else if (a === 'open') q('#mmf').click();
  });
  function download(blob, name) { var u = URL.createObjectURL(blob), a = d.createElement('a'); a.href = u; a.download = name; d.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(u); }, 4000); say('Saved ' + name + ' to your downloads.'); }
  function toPng() {
    var s = M.svg(m, {}), b = M.bounds(m), sc = 2, img = new Image();
    img.onload = function () {
      var c = d.createElement('canvas'); c.width = Math.round(b.w * sc); c.height = Math.round(b.h * sc);
      var x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); x.drawImage(img, 0, 0, c.width, c.height);
      c.toBlob(function (bl) { if (bl) download(bl, 'mind-map.png'); else say('Could not make the picture here; try SVG.'); }, 'image/png');
    };
    img.onerror = function () { say('Could not make the picture here; try SVG.'); };
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s);
  }
  q('#mmf').addEventListener('change', function (e) {
    var f = e.target.files[0]; if (!f) return;
    if (f.size > 200000) { say('That file is too large to be a map from this page.'); return; }
    var r = new FileReader(); r.onload = function () { var nm = M.fromJSON(String(r.result)); if (!nm) say('That file is not a map made on this page.'); else { m = nm; sel = 1; change(); say('Map opened.'); } }; r.readAsText(f); e.target.value = '';
  });
  inp.addEventListener('input', function () { M.rename(m, sel, inp.value); draw(); save(); });
  inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); addChild(e.shiftKey); } });
  psel.addEventListener('change', function () { if (M.move(m, sel, +psel.value)) change(); else say('That move is not possible.'); });
  xsel.addEventListener('change', function () {
    var nm = M.example(xsel.value); xsel.value = ''; if (!nm) return;
    if (m.nodes.length > 1 && !window.confirm('Replace the map on screen with a new one?')) return;
    m = nm; sel = 1; change(); say('New map started.');
  });
  /* selecting, dragging and keys on the picture */
  var drag = null;
  function pt(e) { var s = wrap.querySelector('svg'), p = s.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; return p.matrixTransform(s.getScreenCTM().inverse()); }
  wrap.addEventListener('pointerdown', function (e) {
    var g = e.target.closest('g[data-id]'); if (!g) return; var id = +g.getAttribute('data-id'), n = M.find(m, id), p = pt(e);
    drag = { id: id, dx: p.x - n.x, dy: p.y - n.y, moved: false, sx: e.clientX, sy: e.clientY }; e.preventDefault();
    if (sel !== id) { sel = id; draw(); }
  });
  window.addEventListener('pointermove', function (e) {
    if (!drag) return; if (!drag.moved && Math.abs(e.clientX - drag.sx) + Math.abs(e.clientY - drag.sy) < 6) return;
    drag.moved = true; var n = M.find(m, drag.id), p = pt(e); n.fx = Math.round(p.x - drag.dx); n.fy = Math.round(p.y - drag.dy);
    n.fx = Math.max(-4000, Math.min(4000, n.fx)); n.fy = Math.max(-4000, Math.min(4000, n.fy)); draw();
  });
  window.addEventListener('pointerup', function () { if (drag && drag.moved) save(); drag = null; });
  wrap.addEventListener('keydown', function (e) {
    var g = e.target.closest && e.target.closest('g[data-id]'); if (!g) return; var id = +g.getAttribute('data-id');
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(id, true); }
    else if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); sel = id; var n = M.find(m, id); if (M.remove(m, id)) { sel = n.p; change(); } }
  });
  draw(); say('Your map is saved in this browser only, and only on this device.');
})();
