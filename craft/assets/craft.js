/* Shared helpers for the learn kids sites (craft, kidsfun, projects): filter ideas, add them to a list, add up the materials, pick one at random, make a bingo card.
   The pure functions come first (the build checks them in Node against separate Python code); the page code comes after. Nothing is sent anywhere; the ticked ideas are kept in the browser only. */
(function () {
  'use strict';
  var K = {};
  K.norm = function (s) { return String(s).replace(/\s+/g, ' ').trim().toLowerCase(); };
  /* f: {age, mins (0 = any), noAdult, place ('' | 'in' | 'out'), energy ('' | 'calm' | 'active'), subject, q (words that must all appear)} */
  K.match = function (items, f) {
    f = f || {};
    var words = K.norm(f.q || '').split(' ').filter(function (w) { return w; });
    return items.filter(function (it) {
      if (f.age !== undefined && f.age !== null && f.age !== '' && !(it.lo <= f.age && f.age <= it.hi)) return false;
      if (f.mins && it.mins > f.mins) return false;
      if (f.noAdult && it.adult) return false;
      if (f.place && it.place !== 'both' && it.place !== f.place) return false;
      if (f.energy && it.energy && it.energy !== f.energy) return false;
      if (f.subject && it.subject !== f.subject) return false;
      if (words.length) {
        var hay = K.norm(it.title + ' ' + it.tag + ' ' + it.mat.map(function (m) { return m[0]; }).join(' '));
        for (var i = 0; i < words.length; i++) if (hay.indexOf(words[i]) < 0) return false;
      }
      return true;
    });
  };
  /* the materials of the chosen ideas added up by name (names compared without capitals); sorted by name */
  K.sum = function (items, ids) {
    var map = {}, order = [];
    items.forEach(function (it) {
      if (ids.indexOf(it.id) < 0) return;
      it.mat.forEach(function (m) {
        var k = K.norm(m[0]);
        if (!(k in map)) { map[k] = { name: m[0], n: 0 }; order.push(k); }
        map[k].n += m[1];
      });
    });
    order.sort(function (a, b) { return a < b ? -1 : a > b ? 1 : 0; });
    return order.map(function (k) { return [map[k].name, map[k].n]; });
  };
  K.fmtMins = function (m) {
    if (m < 60) return m + ' min';
    var h = Math.floor(m / 60), r = m % 60;
    return h + ' h' + (r ? ' ' + r + ' min' : '');
  };
  K.pick = function (list, r) { return list.length ? list[Math.min(list.length - 1, Math.floor(r * list.length))] : null; };
  K.rng = function (seed) { var s = seed >>> 0; return function () { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; }; };
  /* nine different ideas for an age (null when fewer than nine fit), chosen by a seed so the same seed gives the same card */
  K.bingo = function (items, age, seed) {
    var pool = items.filter(function (it) { return it.lo <= age && age <= it.hi; }).map(function (it) { return it.id; });
    if (pool.length < 9) return null;
    var r = K.rng(seed), i, j, t;
    for (i = pool.length - 1; i > 0; i--) { j = Math.floor(r() * (i + 1)); t = pool[i]; pool[i] = pool[j]; pool[j] = t; }
    return pool.slice(0, 9);
  };
  if (typeof module !== 'undefined' && module.exports) { module.exports = K; return; }
  window.KIDS = K;

  var d = document;
  d.addEventListener('click', function (e) { if (e.target.hasAttribute && e.target.hasAttribute('data-print')) window.print(); });
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function opt(v, l, cur) { return '<option value="' + esc(v) + '"' + (String(cur) === String(v) ? ' selected' : '') + '>' + esc(l) + '</option>'; }

  K.init = function (cfg) {
    var root = d.querySelector('[data-kids]');
    if (!root) return;
    var items = cfg.items, key = 'kids-' + cfg.site, sel = [], byId = {};
    items.forEach(function (it) { byId[it.id] = it; });
    try { sel = JSON.parse(localStorage.getItem(key)) || []; } catch (e) { sel = []; }
    sel = sel.filter(function (id) { return byId[id]; });
    function save() { try { localStorage.setItem(key, JSON.stringify(sel)); } catch (e) {} }
    var fl = cfg.filters, h = '<div class="kfilters">';
    if (fl.indexOf('age') >= 0) h += '<label>' + esc(cfg.ageLabel) + '<select id="kf-age"><option value="">Any</option>' + cfg.ages.map(function (a) { return opt(a, a, ''); }).join('') + '</select></label>';
    if (fl.indexOf('subject') >= 0) h += '<label>Subject<select id="kf-subject"><option value="">Any</option>' + cfg.subjects.map(function (a) { return opt(a, a, ''); }).join('') + '</select></label>';
    if (fl.indexOf('mins') >= 0) h += '<label>Time<select id="kf-mins">' + cfg.minsOpts.map(function (o) { return opt(o[0], o[1], 0); }).join('') + '</select></label>';
    if (fl.indexOf('place') >= 0) h += '<label>Where<select id="kf-place"><option value="">Anywhere</option><option value="in">Indoors</option><option value="out">Outdoors</option></select></label>';
    if (fl.indexOf('energy') >= 0) h += '<label>Energy<select id="kf-energy"><option value="">Any</option><option value="calm">Calm</option><option value="active">Active</option></select></label>';
    if (fl.indexOf('q') >= 0) h += '<label>Search<input type="text" id="kf-q" placeholder="a word, like paper"></label>';
    if (fl.indexOf('noAdult') >= 0) h += '<label class="kchk"><input type="checkbox" id="kf-na"> Needs no adult</label>';
    h += '</div><p class="kcount" aria-live="polite" data-kcount></p><div class="kbtns"><button type="button" class="btn ghost" data-kpick>Pick one for me</button></div><div data-kpicked aria-live="polite"></div><ul class="kcards" data-klist></ul>' +
      '<div class="kmy"><h3>My list</h3><p class="knote" data-kempty>Tick the ideas you like and the things you need are added up here.</p><div data-kmy></div><div class="kbtns"><button type="button" class="btn" data-kprint>Print my list</button> <button type="button" class="btn ghost" data-kclear>Clear my list</button></div></div>';
    root.innerHTML = h;
    function filt() {
      var g = function (id) { var e = d.getElementById(id); return e ? e.value : ''; };
      var a = g('kf-age');
      return { age: a === '' ? null : parseInt(a, 10), mins: parseInt(g('kf-mins') || '0', 10) || 0, noAdult: !!(d.getElementById('kf-na') || {}).checked, place: g('kf-place'), energy: g('kf-energy'), subject: g('kf-subject'), q: g('kf-q') };
    }
    var shown = items;
    function meta(it) {
      return cfg.ageLabel + ' ' + (it.lo === it.hi ? it.lo : it.lo + ' to ' + it.hi) + ' · ' + K.fmtMins(it.mins) + (it.adult ? ' · Adult needed' : '');
    }
    function draw() {
      shown = K.match(items, filt());
      root.querySelector('[data-kcount]').textContent = shown.length + (shown.length === 1 ? ' idea' : ' ideas') + ' match';
      root.querySelector('[data-klist]').innerHTML = shown.map(function (it) {
        return '<li><label class="kadd"><input type="checkbox" data-id="' + esc(it.id) + '"' + (sel.indexOf(it.id) >= 0 ? ' checked' : '') + '> Add to my list</label><a href="' + esc(it.url) + '"><b>' + esc(it.title) + '</b></a><span>' + esc(meta(it)) + '</span><span class="kt">' + esc(it.tag) + '</span></li>';
      }).join('') || '<li class="kno">Nothing matches. Try fewer filters.</li>';
      var rows = K.sum(items, sel);
      root.querySelector('[data-kempty]').style.display = sel.length ? 'none' : '';
      root.querySelector('[data-kmy]').innerHTML = sel.length ? '<p><b>Chosen:</b> ' + sel.map(function (id) { return '<a href="' + esc(byId[id].url) + '">' + esc(byId[id].title) + '</a>'; }).join(', ') + '</p>' +
        (rows.length ? '<div class="tbl"><table><thead><tr><th>You need</th><th>How many</th></tr></thead><tbody>' + rows.map(function (r) { return '<tr><td>' + esc(r[0]) + '</td><td>' + r[1] + '</td></tr>'; }).join('') + '</tbody></table></div>' : '<p>These ideas need no materials.</p>') : '';
    }
    root.addEventListener('input', function (e) { if (e.target.getAttribute && e.target.getAttribute('data-id')) return; draw(); });
    root.addEventListener('change', function (e) {
      var id = e.target.getAttribute && e.target.getAttribute('data-id');
      if (id) { var i = sel.indexOf(id); if (e.target.checked && i < 0) sel.push(id); if (!e.target.checked && i >= 0) sel.splice(i, 1); save(); }
      draw();
    });
    root.addEventListener('click', function (e) {
      var t = e.target;
      if (t.hasAttribute('data-kprint')) window.print();
      if (t.hasAttribute('data-kclear')) { sel = []; save(); draw(); }
      if (t.hasAttribute('data-kpick')) {
        var it = K.pick(shown, Math.random()), box = root.querySelector('[data-kpicked]');
        box.innerHTML = it ? '<div class="kpicked"><b>Try this:</b> <a href="' + esc(it.url) + '">' + esc(it.title) + '</a><br><span>' + esc(it.tag) + '</span></div>' : '<div class="kpicked">Nothing to pick. Try fewer filters.</div>';
      }
    });
    draw();
  };

  K.initBingo = function (cfg) {
    var root = d.querySelector('[data-bingo]');
    if (!root) return;
    var byId = {};
    cfg.items.forEach(function (it) { byId[it.id] = it; });
    var ages = [], a;
    for (a = cfg.ageMin; a <= cfg.ageMax; a++) ages.push(a);
    root.innerHTML = '<div class="kfilters"><label>Age<select id="kb-age">' + ages.map(function (x) { return opt(x, x, 6); }).join('') + '</select></label></div><div class="kbtns"><button type="button" class="btn" data-bnew>Make a new card</button> <button type="button" class="btn ghost" data-bprint>Print the card</button></div><div data-bcard></div>';
    function make() {
      var age = parseInt(d.getElementById('kb-age').value, 10), ids = K.bingo(cfg.items, age, Math.floor(Math.random() * 4294967295));
      root.querySelector('[data-bcard]').innerHTML = ids ? '<div class="bingo">' + ids.map(function (id) { return '<div>' + esc(byId[id].title) + '</div>'; }).join('') + '</div><p class="knote">Do an idea, then colour its square. Three in a row wins a small prize you choose together.</p>' : '<p>Not enough ideas for this age.</p>';
    }
    root.addEventListener('click', function (e) {
      if (e.target.hasAttribute('data-bnew')) make();
      if (e.target.hasAttribute('data-bprint')) window.print();
    });
    root.addEventListener('change', make);
    make();
  };
})();
;(function(){window.KIDS.init({"site":"craft","items":[{"id":"paper-plane","title":"Paper Plane","tag":"A fast, straight-flying dart made from one sheet.","lo":5,"hi":12,"mins":10,"adult":false,"place":"both","mat":[["A4 paper sheet",1]],"url":"/craft/paper-plane/"},{"id":"paper-boat","title":"Paper Boat","tag":"The classic folded boat that floats for a while on a bowl of water.","lo":6,"hi":12,"mins":15,"adult":false,"place":"both","mat":[["A4 paper sheet",1]],"url":"/craft/paper-boat/"},{"id":"paper-fan","title":"Paper Fan","tag":"A folded fan for a hot day, made by folding the paper like a concertina.","lo":4,"hi":10,"mins":10,"adult":false,"place":"both","mat":[["A4 paper sheet",1],["Sticky tape (roll)",1]],"url":"/craft/paper-fan/"},{"id":"fortune-teller","title":"Paper Fortune Teller","tag":"A folded game where friends choose colours and numbers and read a kind message.","lo":7,"hi":13,"mins":20,"adult":false,"place":"both","mat":[["Square paper sheet",1],["Crayons or markers (set)",1]],"url":"/craft/fortune-teller/"},{"id":"newspaper-hat","title":"Newspaper Hat","tag":"A big folded hat for dressing up, made from one sheet of newspaper.","lo":5,"hi":12,"mins":10,"adult":false,"place":"both","mat":[["Newspaper sheet (double page)",1]],"url":"/craft/newspaper-hat/"},{"id":"bag-puppet","title":"Paper Bag Puppet","tag":"A talking puppet made from a paper bag, with a mouth that opens and closes.","lo":4,"hi":9,"mins":25,"adult":false,"place":"both","mat":[["Small paper bag",1],["Crayons or markers (set)",1],["Glue stick",1],["Coloured paper scraps",4]],"url":"/craft/bag-puppet/"},{"id":"pinwheel","title":"Paper Pinwheel","tag":"A spinning pinwheel that turns when you blow on it or hold it in the wind.","lo":6,"hi":12,"mins":25,"adult":true,"place":"both","mat":[["Square paper sheet",1],["Scissors",1],["Ruler",1],["Pencil with a rubber end",1],["Pin with a round head",1]],"url":"/craft/pinwheel/"},{"id":"paper-lantern","title":"Paper Lantern","tag":"A hanging paper lantern with slits, to decorate a room.","lo":6,"hi":12,"mins":30,"adult":true,"place":"both","mat":[["A4 paper sheet",2],["Scissors",1],["Glue stick",1],["Ruler",1],["Pencil",1]],"url":"/craft/paper-lantern/"},{"id":"paper-chain","title":"Paper Chain","tag":"A long, colourful chain of paper loops to decorate a room.","lo":5,"hi":12,"mins":20,"adult":true,"place":"both","mat":[["Coloured paper sheet",4],["Scissors",1],["Glue stick",1],["Ruler",1]],"url":"/craft/paper-chain/"},{"id":"tissue-flower","title":"Tissue Paper Flower","tag":"A fluffy flower made by folding and fanning out sheets of tissue paper.","lo":6,"hi":12,"mins":25,"adult":true,"place":"both","mat":[["Tissue paper sheet",6],["Scissors",1],["Pipe cleaner (soft craft wire)",1]],"url":"/craft/tissue-flower/"},{"id":"paper-snowflake","title":"Paper Snowflake","tag":"A lacy snowflake cut from a folded square, different every time.","lo":5,"hi":12,"mins":15,"adult":true,"place":"both","mat":[["Square paper sheet",1],["Scissors",1]],"url":"/craft/paper-snowflake/"},{"id":"paper-helicopter","title":"Spinning Paper Helicopter","tag":"A paper helicopter that spins like a seed as it falls.","lo":6,"hi":12,"mins":15,"adult":true,"place":"both","mat":[["A4 paper sheet",1],["Scissors",1],["Ruler",1],["Paper clip",1]],"url":"/craft/paper-helicopter/"},{"id":"torn-paper-collage","title":"Torn Paper Collage","tag":"A picture made by tearing coloured paper and gluing the pieces down.","lo":3,"hi":10,"mins":30,"adult":false,"place":"both","mat":[["Old magazine",2],["Glue stick",1],["Card or thick paper sheet",1]],"url":"/craft/torn-paper-collage/"},{"id":"handprint-peacock","title":"Handprint Peacock","tag":"A bright peacock made from your own handprint, for a wall or a card.","lo":2,"hi":8,"mins":20,"adult":false,"place":"both","mat":[["A4 paper sheet",2],["Washable paint (set of three colours)",1],["Paint brush",1],["Damp cloth",1],["Crayons or markers (set)",1]],"url":"/craft/handprint-peacock/"}],"filters":["age","mins","noAdult","q"],"ageLabel":"Age","ages":[3,4,5,6,7,8,9,10,11,12],"minsOpts":[[0,"Any time"],[10,"Up to 10 minutes"],[20,"Up to 20 minutes"],[30,"Up to 30 minutes"]]});})();