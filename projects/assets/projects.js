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
;(function(){window.KIDS.init({"site":"projects","items":[{"id":"do-plants-need-light","title":"Do Plants Need Light?","tag":"Grow two bean plants, one in light and one in the dark, and compare them.","subject":"Science","lo":3,"hi":6,"mins":60,"adult":false,"place":"both","mat":[["Clear plastic cup",2],["Soil or damp cotton wool",1],["Bean seeds",4],["Small jug of water",1],["Ruler",1],["Notebook",1]],"url":"/projects/do-plants-need-light/"},{"id":"water-cycle-in-a-bag","title":"The Water Cycle in a Bag","tag":"A sealed bag on a sunny window shows how water rises, gathers and falls.","subject":"Science","lo":2,"hi":5,"mins":20,"adult":false,"place":"both","mat":[["Zip-lock bag (clear)",1],["Small jug of water",1],["Marker pen",1],["Sticky tape (roll)",1]],"url":"/projects/water-cycle-in-a-bag/"},{"id":"baking-soda-volcano","title":"A Model Volcano","tag":"A model volcano that foams up when baking soda meets vinegar.","subject":"Science","lo":4,"hi":8,"mins":45,"adult":true,"place":"both","mat":[["Plastic bottle (small)",1],["Tray",1],["Modelling clay",1],["Baking soda (spoonfuls)",3],["Vinegar (small cup)",1],["Red food colour",1]],"url":"/projects/baking-soda-volcano/"},{"id":"model-solar-system","title":"A Model of the Solar System","tag":"Eight clay planets in order from the Sun, with labels.","subject":"Science","lo":4,"hi":8,"mins":120,"adult":false,"place":"both","mat":[["Modelling clay (several colours)",1],["Cardboard sheet (large)",1],["Marker pen",1],["Paper labels",9],["Sticky tape (roll)",1]],"url":"/projects/model-solar-system/"},{"id":"lung-model","title":"A Model of Breathing","tag":"A bottle and two balloons show how the lungs fill and empty.","subject":"Science","lo":5,"hi":8,"mins":45,"adult":true,"place":"both","mat":[["Plastic bottle (clear)",1],["Balloons",3],["Straw",1],["Sticky tape (roll)",1],["Rubber band",1],["Scissors",1]],"url":"/projects/lung-model/"},{"id":"simple-circuit","title":"A Simple Electric Circuit","tag":"Light a small bulb with one battery and wires, and see what happens when the circuit has a gap.","subject":"Science","lo":6,"hi":8,"mins":30,"adult":true,"place":"both","mat":[["AA battery (1.5 volt)",1],["Small torch bulb in a holder (1.5 volt)",1],["Plastic-covered wire pieces",2],["Sticky tape (roll)",1],["Notebook",1]],"url":"/projects/simple-circuit/"},{"id":"rain-gauge","title":"A Home-Made Rain Gauge","tag":"A bottle with a scale to measure how much rain falls.","subject":"Environment","lo":3,"hi":6,"mins":30,"adult":true,"place":"both","mat":[["Clear plastic bottle with straight sides",1],["Scissors",1],["Ruler",1],["Marker pen",1],["Sticky tape (roll)",1],["Notebook",1]],"url":"/projects/rain-gauge/"},{"id":"paper-bridge","title":"The Strong Paper Bridge","tag":"Test how many coins a flat sheet of paper and a folded sheet can hold.","subject":"Science","lo":5,"hi":8,"mins":40,"adult":false,"place":"both","mat":[["Plain paper sheet",4],["Hardback books",4],["Small coins",30],["Ruler",1],["Notebook",1]],"url":"/projects/paper-bridge/"},{"id":"which-things-stick","title":"What Does a Magnet Pick Up?","tag":"Test everyday objects to see which are attracted to a magnet.","subject":"Science","lo":1,"hi":4,"mins":20,"adult":true,"place":"both","mat":[["Large toy magnet",1],["Everyday objects (spoon, key, foil, eraser, paper clip, wooden stick)",8],["Plain paper sheet",1],["Pencil",1]],"url":"/projects/which-things-stick/"},{"id":"shadow-sundial","title":"A Shadow Sundial","tag":"Watch a shadow move through the day to tell the time.","subject":"Science","lo":4,"hi":7,"mins":40,"adult":false,"place":"both","mat":[["Paper plate",1],["Pencil",1],["Modelling clay",1],["Marker pen",1],["Watch or clock",1]],"url":"/projects/shadow-sundial/"},{"id":"soil-layers","title":"Layers in the Soil","tag":"Shake soil and water in a jar and watch the layers settle.","subject":"Environment","lo":5,"hi":8,"mins":25,"adult":false,"place":"both","mat":[["Clear jar with a lid",1],["Garden soil (cups)",2],["Water (cups)",2],["Notebook",1],["Pencil",1]],"url":"/projects/soil-layers/"},{"id":"water-filter-model","title":"A Model Water Filter","tag":"Layers of sand, gravel and cotton wool clean muddy water a little.","subject":"Environment","lo":8,"hi":10,"mins":45,"adult":true,"place":"both","mat":[["Plastic bottle (clear)",1],["Scissors",1],["Cotton wool",1],["Sand (cups)",2],["Small gravel (cups)",2],["Muddy water in a jar",1],["Clear glass or cup",2]],"url":"/projects/water-filter-model/"},{"id":"my-neighbourhood-map","title":"A Map of My Neighbourhood","tag":"Draw a map of the streets and places around your home.","subject":"Social science","lo":2,"hi":5,"mins":90,"adult":false,"place":"both","mat":[["Large chart paper",1],["Pencil",1],["Coloured pencils (set)",1],["Ruler",1]],"url":"/projects/my-neighbourhood-map/"},{"id":"my-food-plate","title":"My Plate of Foods","tag":"A collage plate showing a mix of foods, sorted by colour.","subject":"Health","lo":1,"hi":3,"mins":30,"adult":false,"place":"both","mat":[["Paper plate",1],["Old magazines",2],["Glue stick",1],["Crayons (set)",1]],"url":"/projects/my-food-plate/"},{"id":"shape-hunt","title":"A Shape Hunt","tag":"Find shapes at home, draw them and count them in a table.","subject":"Maths","lo":1,"hi":3,"mins":40,"adult":false,"place":"both","mat":[["Plain paper sheet",4],["Pencil",1],["Coloured pencils (set)",1],["Ruler",1]],"url":"/projects/shape-hunt/"},{"id":"class-survey-bar-chart","title":"A Survey and Bar Chart","tag":"Ask twenty people a question, count the answers and draw a bar chart.","subject":"Maths","lo":5,"hi":8,"mins":60,"adult":false,"place":"both","mat":[["Squared paper sheet",2],["Pencil",1],["Ruler",1],["Coloured pencils (set)",1],["Notebook",1]],"url":"/projects/class-survey-bar-chart/"},{"id":"plant-cell-model","title":"A Model of a Plant Cell","tag":"A clay model of a plant cell with its main parts labelled.","subject":"Science","lo":8,"hi":10,"mins":90,"adult":false,"place":"both","mat":[["Modelling clay (several colours)",1],["Cardboard sheet (large)",1],["Paper labels",8],["Marker pen",1],["Sticky tape (roll)",1]],"url":"/projects/plant-cell-model/"},{"id":"cabbage-indicator","title":"A Red Cabbage Indicator","tag":"Red cabbage juice changes colour when you add acids and bases.","subject":"Science","lo":8,"hi":10,"mins":50,"adult":true,"place":"both","mat":[["Red cabbage (quarter)",1],["Hot water (cup)",1],["Clear cups",6],["Lemon juice, baking soda solution, soap solution and plain water",4],["Spoon",1],["Notebook",1]],"url":"/projects/cabbage-indicator/"},{"id":"weather-diary","title":"A Two-Week Weather Diary","tag":"Record the weather every day and show it in a chart.","subject":"Environment","lo":3,"hi":6,"mins":20,"adult":false,"place":"both","mat":[["Notebook",1],["Pencil",1],["Coloured pencils (set)",1],["Ruler",1]],"url":"/projects/weather-diary/"},{"id":"model-village","title":"A Cardboard Model Village","tag":"Build a model village from boxes, with roads, houses and a key.","subject":"Social science","lo":4,"hi":8,"mins":180,"adult":true,"place":"both","mat":[["Small cardboard boxes",8],["Large cardboard sheet for the base",1],["Scissors",1],["White glue",1],["Paints or crayons (set)",1],["Paper labels",8]],"url":"/projects/model-village/"},{"id":"sort-the-waste","title":"Sorting the Waste","tag":"Sort clean household waste into groups and make a chart.","subject":"Environment","lo":3,"hi":6,"mins":30,"adult":true,"place":"both","mat":[["Boxes or bags for sorting",4],["Marker pen",1],["Clean household waste",20],["Plain paper sheet",1]],"url":"/projects/sort-the-waste/"}],"filters":["age","subject","mins","noAdult","q"],"ageLabel":"Class","ages":[1,2,3,4,5,6,7,8,9,10],"subjects":["Science","Maths","Environment","Social science","Health"],"minsOpts":[[0,"Any time"],[30,"Up to 30 minutes"],[60,"Up to 1 hour"],[120,"Up to 2 hours"],[180,"Up to 3 hours"]]});})();