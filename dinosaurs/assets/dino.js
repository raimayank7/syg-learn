/* learn.shareyourgroup.com/dinosaurs: time chart (when each genus appears in the fossil record) and a "which dinosaur is it" quiz.
   Data: Paleobiology Database (CC BY 4.0). The pure helpers (DT.bar, DT.summary, DQ.make) come first; the build runs them in Node and re-derives every result in Python
   from the saved database answers. Nothing leaves the browser; only harmless settings (chosen genera, best quiz score) are kept on this device.
   Keys of a genus: n name, f family, d diet ('' when the data gives none), fm first appearance oldest possible age, fn first appearance youngest possible age,
   lx last appearance oldest possible age, ln last appearance youngest possible age (Ma = million years ago), o fossil records, ei earliest interval, li latest interval, p period of the earliest interval, s page address. */
(function () {
  'use strict';
  var D = [{"n": "Acrocanthosaurus", "f": "Carcharodontosauridae", "d": "carnivore", "fm": 121.4, "fn": 113.2, "lx": 106.3, "ln": 93.9, "o": 14, "ei": "Aptian", "li": "Cenomanian", "p": "Cretaceous", "s": "/dinosaurs/genus/acrocanthosaurus/"}, {"n": "Alamosaurus", "f": "Saltasauridae", "d": "herbivore", "fm": 83.6, "fn": 72.2, "lx": 72.2, "ln": 66, "o": 38, "ei": "Campanian", "li": "Maastrichtian", "p": "Cretaceous", "s": "/dinosaurs/genus/alamosaurus/"}, {"n": "Albertosaurus", "f": "Tyrannosauridae", "d": "carnivore", "fm": 85.7, "fn": 72.2, "lx": 72.2, "ln": 66, "o": 32, "ei": "Santonian", "li": "Maastrichtian", "p": "Cretaceous", "s": "/dinosaurs/genus/albertosaurus/"}, {"n": "Ankylosaurus", "f": "Ankylosauridae", "d": "herbivore", "fm": 83.6, "fn": 72.2, "lx": 72.2, "ln": 66, "o": 16, "ei": "Campanian", "li": "Maastrichtian", "p": "Cretaceous", "s": "/dinosaurs/genus/ankylosaurus/"}, {"n": "Bagaceratops", "f": "Protoceratopsidae", "d": "herbivore", "fm": 83.6, "fn": 72.2, "lx": 72.2, "ln": 66, "o": 18, "ei": "Campanian", "li": "Maastrichtian", "p": "Cretaceous", "s": "/dinosaurs/genus/bagaceratops/"}, {"n": "Brontosaurus", "f": "Diplodocidae", "d": "herbivore", "fm": 154.8, "fn": 145.06, "lx": 149.2, "ln": 143.1, "o": 23, "ei": "Kimmeridgian", "li": "Tithonian", "p": "Jurassic", "s": "/dinosaurs/genus/brontosaurus/"}, {"n": "Camarasaurus", "f": "Camarasauridae", "d": "herbivore", "fm": 161.5, "fn": 152.21, "lx": 149.2, "ln": 143.1, "o": 138, "ei": "Oxfordian", "li": "Tithonian", "p": "Jurassic", "s": "/dinosaurs/genus/camarasaurus/"}, {"n": "Carcharodontosaurus", "f": "Carcharodontosauridae", "d": "carnivore", "fm": 143.1, "fn": 121.4, "lx": 83.6, "ln": 72.2, "o": 44, "ei": "Berriasian", "li": "Campanian", "p": "Cretaceous", "s": "/dinosaurs/genus/carcharodontosaurus/"}, {"n": "Centrosaurus", "f": "Ceratopsidae", "d": "herbivore", "fm": 83.6, "fn": 72.2, "lx": 83.6, "ln": 66, "o": 57, "ei": "Campanian", "li": "Maastrichtian", "p": "Cretaceous", "s": "/dinosaurs/genus/centrosaurus/"}, {"n": "Chirostenotes", "f": "Caenagnathidae", "d": "omnivore", "fm": 83.6, "fn": 72.2, "lx": 72.2, "ln": 66, "o": 28, "ei": "Campanian", "li": "Maastrichtian", "p": "Cretaceous", "s": "/dinosaurs/genus/chirostenotes/"}, {"n": "Coelophysis", "f": "Coelophysidae", "d": "carnivore", "fm": 227.3, "fn": 205.7, "lx": 201.4, "ln": 192.9, "o": 26, "ei": "Norian", "li": "Sinemurian", "p": "Triassic", "s": "/dinosaurs/genus/coelophysis/"}, {"n": "Dacentrurus", "f": "Stegosauridae", "d": "herbivore", "fm": 154.8, "fn": 149.2, "lx": 132.6, "ln": 121.4, "o": 31, "ei": "Kimmeridgian", "li": "Barremian", "p": "Jurassic", "s": "/dinosaurs/genus/dacentrurus/"}, {"n": "Daspletosaurus", "f": "Tyrannosauridae", "d": "carnivore", "fm": 83.6, "fn": 72.2, "lx": 72.2, "ln": 66, "o": 21, "ei": "Campanian", "li": "Maastrichtian", "p": "Cretaceous", "s": "/dinosaurs/genus/daspletosaurus/"}, {"n": "Deinonychus", "f": "Dromaeosauridae", "d": "carnivore", "fm": 143.1, "fn": 125.77, "lx": 100.5, "ln": 93.9, "o": 47, "ei": "Berriasian", "li": "Cenomanian", "p": "Cretaceous", "s": "/dinosaurs/genus/deinonychus/"}, {"n": "Dicraeosaurus", "f": "Dicraeosauridae", "d": "herbivore", "fm": 161.5, "fn": 154.8, "lx": 149.2, "ln": 143.1, "o": 19, "ei": "Oxfordian", "li": "Tithonian", "p": "Jurassic", "s": "/dinosaurs/genus/dicraeosaurus/"}, {"n": "Dryosaurus", "f": "Dryosauridae", "d": "herbivore", "fm": 154.8, "fn": 152.21, "lx": 149.2, "ln": 143.1, "o": 24, "ei": "Kimmeridgian", "li": "Tithonian", "p": "Jurassic", "s": "/dinosaurs/genus/dryosaurus/"}, {"n": "Edmontonia", "f": "Nodosauridae", "d": "herbivore", "fm": 83.6, "fn": 72.2, "lx": 72.2, "ln": 66, "o": 16, "ei": "Campanian", "li": "Maastrichtian", "p": "Cretaceous", "s": "/dinosaurs/genus/edmontonia/"}, {"n": "Edmontosaurus", "f": "Hadrosauridae", "d": "herbivore", "fm": 89.8, "fn": 72.2, "lx": 72.2, "ln": 66, "o": 85, "ei": "Coniacian", "li": "Maastrichtian", "p": "Cretaceous", "s": "/dinosaurs/genus/edmontosaurus/"}, {"n": "Euoplocephalus", "f": "Ankylosauridae", "d": "herbivore", "fm": 83.6, "fn": 72.2, "lx": 72.2, "ln": 66, "o": 18, "ei": "Campanian", "li": "Maastrichtian", "p": "Cretaceous", "s": "/dinosaurs/genus/euoplocephalus/"}, {"n": "Gallimimus", "f": "Ornithomimidae", "d": "herbivore, omnivore", "fm": 93.9, "fn": 89.8, "lx": 72.2, "ln": 66, "o": 30, "ei": "Turonian", "li": "Maastrichtian", "p": "Cretaceous", "s": "/dinosaurs/genus/gallimimus/"}, {"n": "Giraffatitan", "f": "Brachiosauridae", "d": "herbivore", "fm": 161.5, "fn": 154.8, "lx": 149.2, "ln": 143.1, "o": 42, "ei": "Oxfordian", "li": "Tithonian", "p": "Jurassic", "s": "/dinosaurs/genus/giraffatitan/"}, {"n": "Gorgosaurus", "f": "Tyrannosauridae", "d": "carnivore", "fm": 83.6, "fn": 72.2, "lx": 72.2, "ln": 66, "o": 20, "ei": "Campanian", "li": "Maastrichtian", "p": "Cretaceous", "s": "/dinosaurs/genus/gorgosaurus/"}, {"n": "Gryposaurus", "f": "Hadrosauridae", "d": "herbivore", "fm": 83.6, "fn": 72.2, "lx": 72.2, "ln": 66, "o": 22, "ei": "Campanian", "li": "Maastrichtian", "p": "Cretaceous", "s": "/dinosaurs/genus/gryposaurus/"}, {"n": "Hypacrosaurus", "f": "Hadrosauridae", "d": "herbivore", "fm": 83.6, "fn": 72.2, "lx": 72.2, "ln": 66, "o": 37, "ei": "Campanian", "li": "Maastrichtian", "p": "Cretaceous", "s": "/dinosaurs/genus/hypacrosaurus/"}, {"n": "Kentrosaurus", "f": "Stegosauridae", "d": "herbivore", "fm": 161.5, "fn": 154.8, "lx": 149.2, "ln": 143.1, "o": 27, "ei": "Oxfordian", "li": "Tithonian", "p": "Jurassic", "s": "/dinosaurs/genus/kentrosaurus/"}, {"n": "Kritosaurus", "f": "Hadrosauridae", "d": "herbivore", "fm": 85.7, "fn": 83.6, "lx": 72.2, "ln": 66, "o": 25, "ei": "Santonian", "li": "Maastrichtian", "p": "Cretaceous", "s": "/dinosaurs/genus/kritosaurus/"}, {"n": "Lufengosaurus", "f": "Massospondylidae", "d": "", "fm": 201.4, "fn": 199.5, "lx": 174.7, "ln": 168.2, "o": 28, "ei": "Hettangian", "li": "Bajocian", "p": "Jurassic", "s": "/dinosaurs/genus/lufengosaurus/"}, {"n": "Mamenchisaurus", "f": "Mamenchisauridae", "d": "herbivore", "fm": 168.2, "fn": 161.5, "lx": 119.57, "ln": 113.2, "o": 24, "ei": "Bathonian", "li": "Aptian", "p": "Jurassic", "s": "/dinosaurs/genus/mamenchisaurus/"}, {"n": "Massospondylus", "f": "Massospondylidae", "d": "", "fm": 237, "fn": 227.3, "lx": 192.9, "ln": 174.7, "o": 80, "ei": "Carnian", "li": "Toarcian", "p": "Triassic", "s": "/dinosaurs/genus/massospondylus/"}, {"n": "Megalosaurus", "f": "Megalosauridae", "d": "carnivore", "fm": 205.7, "fn": 201.4, "lx": 72.2, "ln": 66, "o": 60, "ei": "Rhaetian", "li": "Maastrichtian", "p": "Triassic", "s": "/dinosaurs/genus/megalosaurus/"}, {"n": "Neuquensaurus", "f": "Saltasauridae", "d": "herbivore", "fm": 85.7, "fn": 83.6, "lx": 72.2, "ln": 66, "o": 15, "ei": "Santonian", "li": "Maastrichtian", "p": "Cretaceous", "s": "/dinosaurs/genus/neuquensaurus/"}, {"n": "Ornithomimus", "f": "Ornithomimidae", "d": "herbivore, omnivore", "fm": 83.6, "fn": 72.2, "lx": 72.2, "ln": 66, "o": 35, "ei": "Campanian", "li": "Maastrichtian", "p": "Cretaceous", "s": "/dinosaurs/genus/ornithomimus/"}, {"n": "Pachyrhinosaurus", "f": "Ceratopsidae", "d": "herbivore", "fm": 83.6, "fn": 72.2, "lx": 72.2, "ln": 66, "o": 16, "ei": "Campanian", "li": "Maastrichtian", "p": "Cretaceous", "s": "/dinosaurs/genus/pachyrhinosaurus/"}, {"n": "Panoplosaurus", "f": "Nodosauridae", "d": "herbivore", "fm": 83.6, "fn": 72.2, "lx": 72.2, "ln": 66, "o": 15, "ei": "Campanian", "li": "Maastrichtian", "p": "Cretaceous", "s": "/dinosaurs/genus/panoplosaurus/"}, {"n": "Pinacosaurus", "f": "Ankylosauridae", "d": "herbivore", "fm": 89.8, "fn": 83.6, "lx": 83.6, "ln": 72.2, "o": 24, "ei": "Coniacian", "li": "Campanian", "p": "Cretaceous", "s": "/dinosaurs/genus/pinacosaurus/"}, {"n": "Plateosaurus", "f": "Plateosauridae", "d": "herbivore", "fm": 227.3, "fn": 211.18, "lx": 201.4, "ln": 199.5, "o": 36, "ei": "Norian", "li": "Hettangian", "p": "Triassic", "s": "/dinosaurs/genus/plateosaurus/"}, {"n": "Prosaurolophus", "f": "Hadrosauridae", "d": "herbivore", "fm": 83.6, "fn": 72.2, "lx": 83.6, "ln": 66, "o": 15, "ei": "Campanian", "li": "Maastrichtian", "p": "Cretaceous", "s": "/dinosaurs/genus/prosaurolophus/"}, {"n": "Protoceratops", "f": "Protoceratopsidae", "d": "herbivore", "fm": 121.4, "fn": 100.5, "lx": 83.6, "ln": 72.2, "o": 38, "ei": "Aptian", "li": "Campanian", "p": "Cretaceous", "s": "/dinosaurs/genus/protoceratops/"}, {"n": "Rhabdodon", "f": "Rhabdodontidae", "d": "herbivore", "fm": 83.6, "fn": 72.2, "lx": 72.2, "ln": 66, "o": 37, "ei": "Campanian", "li": "Maastrichtian", "p": "Cretaceous", "s": "/dinosaurs/genus/rhabdodon/"}, {"n": "Richardoestesia", "f": "Dromaeosauridae", "d": "carnivore", "fm": 154.8, "fn": 149.2, "lx": 72.2, "ln": 66, "o": 239, "ei": "Kimmeridgian", "li": "Maastrichtian", "p": "Jurassic", "s": "/dinosaurs/genus/richardoestesia/"}, {"n": "Saurolophus", "f": "Hadrosauridae", "d": "herbivore", "fm": 83.6, "fn": 72.2, "lx": 72.2, "ln": 66, "o": 38, "ei": "Campanian", "li": "Maastrichtian", "p": "Cretaceous", "s": "/dinosaurs/genus/saurolophus/"}, {"n": "Sauropelta", "f": "Nodosauridae", "d": "herbivore", "fm": 121.4, "fn": 113.2, "lx": 106.3, "ln": 93.9, "o": 34, "ei": "Aptian", "li": "Cenomanian", "p": "Cretaceous", "s": "/dinosaurs/genus/sauropelta/"}, {"n": "Saurornitholestes", "f": "Dromaeosauridae", "d": "carnivore", "fm": 83.6, "fn": 72.2, "lx": 72.2, "ln": 66, "o": 148, "ei": "Campanian", "li": "Maastrichtian", "p": "Cretaceous", "s": "/dinosaurs/genus/saurornitholestes/"}, {"n": "Spinosaurus", "f": "Spinosauridae", "d": "carnivore", "fm": 125.77, "fn": 110.1, "lx": 83.6, "ln": 72.2, "o": 44, "ei": "Barremian", "li": "Campanian", "p": "Cretaceous", "s": "/dinosaurs/genus/spinosaurus/"}, {"n": "Stegosaurus", "f": "Stegosauridae", "d": "herbivore", "fm": 161.5, "fn": 149.2, "lx": 100.5, "ln": 93.9, "o": 86, "ei": "Oxfordian", "li": "Cenomanian", "p": "Jurassic", "s": "/dinosaurs/genus/stegosaurus/"}, {"n": "Struthiomimus", "f": "Ornithomimidae", "d": "herbivore, omnivore", "fm": 83.6, "fn": 72.2, "lx": 72.2, "ln": 66, "o": 18, "ei": "Campanian", "li": "Maastrichtian", "p": "Cretaceous", "s": "/dinosaurs/genus/struthiomimus/"}, {"n": "Struthiosaurus", "f": "Nodosauridae", "d": "herbivore", "fm": 83.6, "fn": 72.2, "lx": 72.2, "ln": 66, "o": 23, "ei": "Campanian", "li": "Maastrichtian", "p": "Cretaceous", "s": "/dinosaurs/genus/struthiosaurus/"}, {"n": "Tarbosaurus", "f": "Tyrannosauridae", "d": "carnivore", "fm": 89.8, "fn": 83.6, "lx": 72.2, "ln": 66, "o": 56, "ei": "Coniacian", "li": "Maastrichtian", "p": "Cretaceous", "s": "/dinosaurs/genus/tarbosaurus/"}, {"n": "Telmatosaurus", "f": "Telmatosauridae", "d": "herbivore", "fm": 83.6, "fn": 66, "lx": 72.2, "ln": 66, "o": 23, "ei": "Campanian", "li": "Maastrichtian", "p": "Cretaceous", "s": "/dinosaurs/genus/telmatosaurus/"}, {"n": "Tenontosaurus", "f": "Tenontosauridae", "d": "herbivore", "fm": 121.4, "fn": 113.2, "lx": 106.3, "ln": 93.9, "o": 83, "ei": "Aptian", "li": "Cenomanian", "p": "Cretaceous", "s": "/dinosaurs/genus/tenontosaurus/"}, {"n": "Thescelosaurus", "f": "Thescelosauridae", "d": "herbivore", "fm": 93.9, "fn": 89.8, "lx": 72.2, "ln": 66, "o": 55, "ei": "Turonian", "li": "Maastrichtian", "p": "Cretaceous", "s": "/dinosaurs/genus/thescelosaurus/"}, {"n": "Torvosaurus", "f": "Megalosauridae", "d": "carnivore", "fm": 165.3, "fn": 161.5, "lx": 149.2, "ln": 143.1, "o": 28, "ei": "Callovian", "li": "Tithonian", "p": "Jurassic", "s": "/dinosaurs/genus/torvosaurus/"}, {"n": "Triceratops", "f": "Ceratopsidae", "d": "herbivore", "fm": 83.6, "fn": 72.2, "lx": 72.2, "ln": 66, "o": 166, "ei": "Campanian", "li": "Maastrichtian", "p": "Cretaceous", "s": "/dinosaurs/genus/triceratops/"}, {"n": "Troodon", "f": "Troodontidae", "d": "carnivore, omnivore", "fm": 83.6, "fn": 72.2, "lx": 72.2, "ln": 66, "o": 103, "ei": "Campanian", "li": "Maastrichtian", "p": "Cretaceous", "s": "/dinosaurs/genus/troodon/"}, {"n": "Tyrannosaurus", "f": "Tyrannosauridae", "d": "carnivore", "fm": 83.6, "fn": 72.2, "lx": 72.2, "ln": 66, "o": 85, "ei": "Campanian", "li": "Maastrichtian", "p": "Cretaceous", "s": "/dinosaurs/genus/tyrannosaurus/"}, {"n": "Velociraptor", "f": "Dromaeosauridae", "d": "carnivore", "fm": 89.8, "fn": 83.6, "lx": 83.6, "ln": 66, "o": 20, "ei": "Coniacian", "li": "Maastrichtian", "p": "Cretaceous", "s": "/dinosaurs/genus/velociraptor/"}];
  var AX = [251.902, 66];
  var DT = {}, DQ = {};

  /* ---------- time chart helpers ---------- */
  DT.bar = function (g) {   /* percent from the left edge of the axis and percent width of the bar from the oldest possible start to the youngest possible end */
    var span = AX[0] - AX[1];
    return { left: (AX[0] - g.fm) / span * 100, width: (g.fm - g.ln) / span * 100 };
  };
  DT.tick = function (ma) { return (AX[0] - ma) / (AX[0] - AX[1]) * 100; };
  DT.summary = function (idx) {   /* idx: array of positions in D. Returns the facts shown under the chart */
    if (!idx.length) return null;
    var oldest = idx[0], newest = idx[0], most = idx[0];
    idx.forEach(function (i) {
      if (D[i].fm > D[oldest].fm || (D[i].fm === D[oldest].fm && D[i].n < D[oldest].n)) oldest = i;
      if (D[i].ln < D[newest].ln || (D[i].ln === D[newest].ln && D[i].n < D[newest].n)) newest = i;
      if (D[i].o > D[most].o || (D[i].o === D[most].o && D[i].n < D[most].n)) most = i;
    });
    return { count: idx.length, oldest: D[oldest].n, newest: D[newest].n, most: D[most].n, overlapAll: DT.overlapAll(idx) };
  };
  DT.overlap = function (a, b) { return a.fm > b.ln && b.fm > a.ln; };   /* the two possible time windows share some time (touching ends do not count) */
  DT.overlapAll = function (idx) {
    for (var i = 0; i < idx.length; i++) for (var j = i + 1; j < idx.length; j++) if (!DT.overlap(D[idx[i]], D[idx[j]])) return false;
    return true;
  };
  DT.sort = function (idx, how) {
    var c = idx.slice();
    c.sort(function (a, b) {
      var x = D[a], y = D[b];
      if (how === 'old') return y.fm - x.fm || (x.n < y.n ? -1 : 1);
      if (how === 'recs') return y.o - x.o || (x.n < y.n ? -1 : 1);
      return x.n < y.n ? -1 : x.n > y.n ? 1 : 0;
    });
    return c;
  };

  /* ---------- quiz ---------- */
  function rng(seed) { var a = seed >>> 0; return function () { a = (a + 0x6D2B79F5) >>> 0; var t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function pick(r, arr) { return arr[Math.floor(r() * arr.length)]; }
  function shuffle(r, arr) { var a = arr.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function words(s) { return s ? s.split(', ') : []; }
  function hasWord(g, w) { return words(g.d).indexOf(w) >= 0; }
  function sample(r, pool, k) { return shuffle(r, pool).slice(0, k); }
  var KINDS = ['diet', 'family', 'older', 'records', 'which'];
  DQ.KINDS = KINDS;
  /* every question: {kind, text, opts: [names], ans: index of the right option, ...the facts used, so that the build can re-derive the answer} */
  DQ.make = function (r, kind) {
    var i, g, pool, opts, ans;
    if (kind === 'diet') {
      var w = pick(r, ['carnivore', 'herbivore']);
      var yes = D.filter(function (x) { return x.d === w; }), no = D.filter(function (x) { return x.d && !hasWord(x, w); });
      g = pick(r, yes); opts = shuffle(r, [g].concat(sample(r, no, 3)));
      return { kind: kind, word: w, text: 'The database lists one of these dinosaurs with the diet "' + w + '". Which one?', opts: opts.map(function (x) { return x.n; }), ans: opts.indexOf(g) };
    }
    if (kind === 'family') {
      g = pick(r, D);
      var fams = []; D.forEach(function (x) { if (fams.indexOf(x.f) < 0 && x.f !== g.f) fams.push(x.f); });
      var o = shuffle(r, [g.f].concat(sample(r, fams, 3)));
      return { kind: kind, subject: g.n, text: 'Which family is ' + g.n + ' listed in?', opts: o, ans: o.indexOf(g.f) };
    }
    if (kind === 'older') {
      for (;;) {
        var a = pick(r, D), b = pick(r, D);
        if (a === b || Math.abs(a.fm - b.fm) < 10) continue;
        opts = shuffle(r, [a, b]);
        var older = a.fm > b.fm ? a : b;
        return { kind: kind, text: 'Which of these two has the OLDER earliest age in the database?', opts: opts.map(function (x) { return x.n; }), ans: opts.indexOf(older) };
      }
    }
    if (kind === 'records') {
      for (;;) {
        var c = pick(r, D), e = pick(r, D);
        if (c === e || Math.max(c.o, e.o) < Math.min(c.o, e.o) * 1.25) continue;
        opts = shuffle(r, [c, e]);
        var more = c.o > e.o ? c : e;
        return { kind: kind, text: 'Which of these two has MORE fossil records in the database?', opts: opts.map(function (x) { return x.n; }), ans: opts.indexOf(more) };
      }
    }
    /* which: three clues (diet, earliest interval, latest interval); exactly one of the four options matches all three */
    for (;;) {
      g = pick(r, D.filter(function (x) { return x.d; }));
      var others = D.filter(function (x) { return x !== g && !(x.d === g.d && x.ei === g.ei && x.li === g.li); });
      if (others.length < 3) continue;
      opts = shuffle(r, [g].concat(sample(r, others, 3)));
      return { kind: 'which', diet: g.d, ei: g.ei, li: g.li, text: 'Which dinosaur is it? Its diet in the database is "' + g.d + '". Its earliest interval is ' + g.ei + ' and its latest interval is ' + g.li + '.', opts: opts.map(function (x) { return x.n; }), ans: opts.indexOf(g) };
    }
  };
  DQ.round = function (seed, n) {   /* n questions, a mix of kinds, no genus asked about twice as the right answer */
    var r = rng(seed), out = [], used = {}, guard = 0;
    while (out.length < n && guard++ < 500) {
      var q = DQ.make(r, KINDS[out.length % KINDS.length]);
      var key = q.kind + '|' + q.opts[q.ans];
      if (used[key]) continue;
      used[key] = 1; out.push(q);
    }
    return out;
  };

  if (typeof module !== 'undefined' && module.exports) { module.exports = { DT: DT, DQ: DQ, D: D, AX: AX, rng: rng }; return; }
  window.DINO = { DT: DT, DQ: DQ, D: D };

  /* ---------- page code ---------- */
  var d = document;
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function get(k) { try { return JSON.parse(localStorage.getItem('dn-' + k)); } catch (e) { return null; } }
  function put(k, v) { try { localStorage.setItem('dn-' + k, JSON.stringify(v)); } catch (e) {} }
  function fmt(x) { return String(+x.toFixed(3)); }
  var DIETC = { carnivore: 'c', herbivore: 'h', omnivore: 'o' };
  function dclass(g) { return DIETC[g.d] || 'x'; }

  var tc = d.querySelector('[data-chart]');
  if (tc) {
    var names = D.map(function (g) { return g.n; });
    var sel = get('chosen');
    var hash = decodeURIComponent((location.hash || '').slice(1)).split(',').map(function (s) { return names.indexOf(s); }).filter(function (i) { return i >= 0; });
    if (hash.length) sel = hash;
    if (!sel || !sel.length) sel = ['Stegosaurus', 'Tyrannosaurus', 'Triceratops', 'Velociraptor', 'Plateosaurus', 'Spinosaurus'].map(function (n) { return names.indexOf(n); }).filter(function (i) { return i >= 0; });
    sel = sel.filter(function (i) { return i >= 0 && i < D.length; });
    tc.innerHTML = '<fieldset><legend>Choose dinosaurs to compare</legend><div class="picks">' +
      D.map(function (g, i) { return '<label class="pk"><input type="checkbox" data-i="' + i + '"' + (sel.indexOf(i) >= 0 ? ' checked' : '') + '> <span>' + esc(g.n) + '</span></label>'; }).join('') +
      '</div></fieldset><div class="btns"><button type="button" class="btn ghost" data-act="all">Choose all</button><button type="button" class="btn ghost" data-act="none">Clear</button>' +
      ['Triassic', 'Jurassic', 'Cretaceous'].map(function (p) { return '<button type="button" class="btn ghost" data-act="' + p + '">' + p + ' only</button>'; }).join('') +
      '<label class="srt">Order: <select id="so"><option value="old">Oldest first</option><option value="recs">Most fossil records first</option><option value="az">A to Z</option></select></label></div>' +
      '<p class="msg" id="tm" aria-live="polite"></p><div id="to"></div>';
    var draw = function () {
      var idx = [].slice.call(tc.querySelectorAll('input[data-i]')).filter(function (c) { return c.checked; }).map(function (c) { return +c.getAttribute('data-i'); });
      put('chosen', idx);
      var how = tc.querySelector('#so').value;
      var list = DT.sort(idx, how), s = DT.summary(idx);
      tc.querySelector('#tm').textContent = s ? s.count + ' chosen. Oldest earliest age: ' + s.oldest + '. Youngest latest age: ' + s.newest + '. Most fossil records: ' + s.most + '. ' + (s.count > 1 ? (s.overlapAll ? 'All of the chosen time windows overlap.' : 'Not all of the chosen time windows overlap.') : '') : 'Choose one or more dinosaurs to see the chart.';
      var ticks = [250, 200, 150, 100].map(function (m) { return '<span class="tk" style="left:' + DT.tick(m).toFixed(3) + '%">' + m + '</span>'; }).join('') + '<span class="tk" style="left:' + DT.tick(AX[1]).toFixed(3) + '%">' + fmt(AX[1]) + '</span>';
      tc.querySelector('#to').innerHTML = list.length ? '<div class="axis" aria-hidden="true"><span class="axl">Million years ago</span>' + ticks + '</div>' +
        list.map(function (i) {
          var g = D[i], b = DT.bar(g);
          return '<div class="tr"><div class="tn"><a href="' + g.s + '">' + esc(g.n) + '</a> <small>' + esc(g.d || 'diet not given') + ', ' + g.o + ' records</small></div>' +
            '<div class="trk"><span class="bar ' + dclass(g) + '" style="left:' + b.left.toFixed(3) + '%;width:' + b.width.toFixed(3) + '%"></span></div>' +
            '<div class="tw">' + fmt(g.fm) + ' to ' + fmt(g.ln) + ' million years ago</div></div>';
        }).join('') +
        '<p class="leg"><span class="sw c"></span> carnivore <span class="sw h"></span> herbivore <span class="sw o"></span> omnivore <span class="sw x"></span> diet not given or mixed. A bar runs from the oldest possible start to the youngest possible end given in the data.</p>' : '';
    };
    tc.addEventListener('change', draw);
    tc.addEventListener('click', function (e) {
      var a = e.target.getAttribute && e.target.getAttribute('data-act');
      if (!a) return;
      tc.querySelectorAll('input[data-i]').forEach(function (c) { var g = D[+c.getAttribute('data-i')]; c.checked = a === 'all' ? true : a === 'none' ? false : g.p === a; });
      draw();
    });
    draw();
  }

  var qz = d.querySelector('[data-quiz]');
  if (qz) {
    var best = get('best'), st = null;
    var start = function () {
      var seed = Math.floor(Math.random() * 4294967296);
      st = { qs: DQ.round(seed, 10), i: 0, score: 0, locked: false };
      window.DQSTATE = st;
      show();
    };
    var show = function () {
      if (st.i >= st.qs.length) {
        if (best === null || st.score > best) { best = st.score; put('best', best); }
        qz.innerHTML = '<div class="qres"><h2>Your score: <span id="qs">' + st.score + '</span> out of ' + st.qs.length + '</h2><p>' + (st.score === st.qs.length ? 'Perfect score!' : st.score >= 7 ? 'Well done.' : 'Good try. Read a few pages and play again.') + ' Best score on this device: ' + best + '.</p><div class="btns"><button type="button" class="btn" id="qa">Play again</button></div></div>';
        return;
      }
      var q = st.qs[st.i];
      qz.innerHTML = '<p class="qn">Question ' + (st.i + 1) + ' of ' + st.qs.length + (best !== null ? ' &middot; best so far ' + best : '') + '</p><h2 class="qt" id="qt">' + esc(q.text) + '</h2>' +
        '<div class="qo">' + q.opts.map(function (o, k) { return '<button type="button" class="btn ghost qb" data-k="' + k + '">' + esc(o) + '</button>'; }).join('') + '</div><p class="qf" id="qf" role="status" aria-live="polite"></p><div class="btns" id="qx"></div>';
      st.locked = false;
    };
    qz.addEventListener('click', function (e) {
      var t = e.target.closest('button'); if (!t) return;
      if (t.id === 'qa') { start(); return; }
      if (t.id === 'qn') { st.i++; show(); return; }
      if (t.classList.contains('qb') && !st.locked) {
        st.locked = true;
        var q = st.qs[st.i], k = +t.getAttribute('data-k'), ok = k === q.ans;
        if (ok) st.score++;
        qz.querySelectorAll('.qb').forEach(function (b, j) { b.disabled = true; if (j === q.ans) b.classList.add('right'); else if (j === k) b.classList.add('wrong'); });
        qz.querySelector('#qf').textContent = ok ? 'Correct!' : 'Not this time. The right answer is ' + q.opts[q.ans] + '.';
        qz.querySelector('#qx').innerHTML = '<button type="button" class="btn" id="qn">' + (st.i + 1 >= st.qs.length ? 'See my score' : 'Next question') + '</button>';
        qz.querySelector('#qn').focus();
      }
    });
    qz.innerHTML = '<p>Ten questions made from the database numbers. Pick an answer, then press Next.</p><div class="btns"><button type="button" class="btn" id="qa">Start the quiz</button></div>' + (best !== null ? '<p class="msg">Best score on this device: ' + best + ' out of 10.</p>' : '');
  }
})();
