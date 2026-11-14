/* learn.shareyourgroup.com/kidsgames: preschool games, played by touch. Question makers first (pure, seedable; the build asks Node for thousands of
   questions and re-works every answer in Python from its own tables), then the play screen. No sound unless "Read aloud" is pressed, no tracking,
   best results kept only in this browser. */
(function () {
  'use strict';
  var G = {}, R = Math.random;
  G.seed = function (s) { var a = s >>> 0; R = function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; };
  function ri(a, b) { return a + Math.floor(R() * (b - a + 1)); }
  function pick(l) { return l[Math.floor(R() * l.length)]; }
  function shuffle(l) { l = l.slice(); for (var j = l.length - 1; j > 0; j--) { var k = Math.floor(R() * (j + 1)), t = l[j]; l[j] = l[k]; l[k] = t; } return l; }
  function some(l, n) { return shuffle(l).slice(0, n); }
  function without(l, x) { return l.filter(function (y) { return y !== x; }); }

  /* ---------- tables ---------- */
  var COL = { red: '#e53935', blue: '#1e66d0', yellow: '#fdd835', green: '#2e9e47', orange: '#fb8c00', purple: '#8e44ad', pink: '#f48fb1', brown: '#795548', black: '#212121', white: '#ffffff', grey: '#9e9e9e' };
  var COL1 = ['red', 'blue', 'yellow', 'green'], COL2 = COL1.concat(['orange', 'purple', 'pink', 'brown']), COL3 = Object.keys(COL);
  var THING = [['banana', '🍌', 'yellow'], ['tomato', '🍅', 'red'], ['leaf', '🍃', 'green'], ['carrot', '🥕', 'orange'], ['elephant', '🐘', 'grey'], ['lemon', '🍋', 'yellow'], ['orange', '🍊', 'orange'], ['frog', '🐸', 'green'], ['chocolate', '🍫', 'brown'], ['bear', '🐻', 'brown'], ['snowman', '⛄', 'white'], ['top hat', '🎩', 'black']];
  function swatch(c) { return '<svg class="sw" viewBox="0 0 60 60" aria-hidden="true"><circle cx="30" cy="30" r="26" fill="' + COL[c] + '" stroke="#555" stroke-width="3"/></svg>'; }

  var SH = {
    circle: '<circle cx="50" cy="50" r="38"/>', square: '<rect x="14" y="14" width="72" height="72"/>', triangle: '<polygon points="50,10 92,86 8,86"/>', rectangle: '<rect x="6" y="28" width="88" height="44"/>',
    star: '<polygon points="50,6 61,38 95,38 67,58 78,92 50,71 22,92 33,58 5,38 39,38"/>', heart: '<path class="heart" d="M50 88 C10 58 6 30 24 20 C38 12 48 22 50 30 C52 22 62 12 76 20 C94 30 90 58 50 88 Z"/>',
    oval: '<ellipse cx="50" cy="50" rx="44" ry="26"/>', diamond: '<polygon points="50,6 90,50 50,94 10,50"/>'
  };
  function shape(name) { return '<svg class="sh" viewBox="0 0 100 100" aria-hidden="true">' + SH[name] + '</svg>'; }
  function poly(n) { var pts = [], i; for (i = 0; i < n; i++) { var a = -Math.PI / 2 + 2 * Math.PI * i / n; pts.push((50 + 40 * Math.cos(a)).toFixed(1) + ',' + (52 + 40 * Math.sin(a)).toFixed(1)); } return '<svg class="sh big" viewBox="0 0 100 100" role="img" aria-label="A shape"><polygon points="' + pts.join(' ') + '"/></svg>'; }

  var ITEMS = ['🍎', '⭐', '🐟', '🎈', '🚗', '🌸', '🐥', '⚽'];
  var LET_CONF = [['b', 'd', 'p', 'q'], ['n', 'u'], ['m', 'w'], ['i', 'l'], ['M', 'W'], ['E', 'F'], ['O', 'Q'], ['I', 'L'], ['B', 'D', 'P', 'R'], ['C', 'G'], ['V', 'U'], ['N', 'Z'], ['g', 'q'], ['h', 'n'], ['a', 'o']];
  var WORDS = { A: ['apple', '🍎'], B: ['ball', '⚽'], C: ['cat', '🐱'], D: ['dog', '🐶'], E: ['egg', '🥚'], F: ['fish', '🐟'], G: ['goat', '🐐'], H: ['hat', '🎩'], I: ['ice cream', '🍦'], J: ['juice', '🧃'], K: ['kite', '🪁'], L: ['lion', '🦁'], M: ['mango', '🥭'], N: ['nose', '👃'], O: ['orange', '🍊'], P: ['pig', '🐷'], Q: ['queen', '👸'], R: ['rabbit', '🐰'], S: ['sun', '☀️'], T: ['tiger', '🐯'], U: ['umbrella', '☂️'], V: ['van', '🚐'], W: ['watch', '⌚'], Y: ['yo-yo', '🪀'], Z: ['zebra', '🦓'] };
  var CAT = { fruit: ['🍎', '🍌', '🍇', '🍓', '🍊', '🍋'], animal: ['🐶', '🐱', '🐮', '🐷', '🐘', '🦁'], vehicle: ['🚗', '🚌', '🚲', '🚂', '✈️', '🚢'], clothes: ['👕', '👖', '🧦', '🧢', '👗', '🧣'], flower: ['🌸', '🌻', '🌹', '🌷', '🌼', '🌺'], sweet: ['🍦', '🍩', '🍪', '🍰', '🍫', '🍭'] };
  var CAT2 = { pet: ['🐶', '🐱', '🐰', '🐹'], jungle: ['🦁', '🐯', '🐘', '🦓'], bird: ['🐦', '🦆', '🦉', '🐔'], sea: ['🐟', '🐬', '🐳', '🐙'] };
  var SND = { cow: ['🐮', 'moo'], dog: ['🐶', 'woof'], cat: ['🐱', 'meow'], duck: ['🦆', 'quack'], sheep: ['🐑', 'baa'], horse: ['🐴', 'neigh'], hen: ['🐔', 'cluck'], pig: ['🐷', 'oink'], lion: ['🦁', 'roar'], frog: ['🐸', 'croak'], owl: ['🦉', 'hoot'], bee: ['🐝', 'buzz'] };
  var OPP = [['hot', 'cold'], ['big', 'small'], ['up', 'down'], ['day', 'night'], ['open', 'close'], ['full', 'empty'], ['fast', 'slow'], ['happy', 'sad'], ['in', 'out'], ['on', 'off'], ['old', 'new'], ['hard', 'soft'], ['wet', 'dry'], ['heavy', 'light'], ['clean', 'dirty'], ['near', 'far'], ['loud', 'quiet'], ['thick', 'thin'], ['asleep', 'awake'], ['push', 'pull'], ['buy', 'sell'], ['left', 'right'], ['front', 'back']];
  var HI = { 'क': ['ka', 'kela'], 'ख': ['kha', 'khargosh'], 'ग': ['ga', 'gaay'], 'च': ['cha', 'chaand'], 'ज': ['ja', 'jahaaz'], 'त': ['ta', 'taara'], 'द': ['da', 'deeya'], 'न': ['na', 'naav'], 'प': ['pa', 'patang'], 'ब': ['ba', 'bakri'], 'म': ['ma', 'machhli'], 'र': ['ra', 'rail'], 'स': ['sa', 'seb'], 'ह': ['ha', 'haathi'], 'आ': ['aa', 'aam'], 'इ': ['i', 'imli'], 'ई': ['ee', 'eekh'], 'उ': ['u', 'ullu'], 'ऊ': ['oo', 'oont'] };
  var HIWORD = [['आम', '🥭'], ['केला', '🍌'], ['गाय', '🐄'], ['घर', '🏠'], ['चाँद', '🌙'], ['छाता', '☂️'], ['जहाज़', '🚢'], ['टमाटर', '🍅'], ['तारा', '⭐'], ['दीया', '🪔'], ['नाव', '⛵'], ['पतंग', '🪁'], ['फूल', '🌸'], ['बकरी', '🐐'], ['मछली', '🐟'], ['रेल', '🚆'], ['सेब', '🍎'], ['हाथी', '🐘'], ['ऊँट', '🐫'], ['उल्लू', '🦉'], ['अंगूर', '🍇']];

  function btn(k, h, label) { return { k: String(k), h: h, a: label || String(k) }; }
  function make4(ansItem, pool, n) { return shuffle([ansItem].concat(some(without(pool, ansItem), (n || 4) - 1))); }

  /* ---------- makers ---------- */
  var GEN = {};
  GEN.colours = function (lv) {
    if (lv < 3) {
      var pool = lv === 1 ? COL1 : COL2, a = pick(pool), ch = make4(a, pool, 4);
      return { q: 'Tap the ' + a + ' one', hear: 'Tap the ' + a + ' one', choices: ch.map(function (c) { return btn(c, swatch(c), c); }), ans: a, say: 'That is ' + a + '.', fact: { t: 'col', name: a } };
    }
    var th = pick(THING), ch3 = make4(th[2], COL3, 4);
    return { q: 'What colour is a ' + th[0] + '?', hear: 'What colour is a ' + th[0] + '?', vis: '<p class="g-emoji" aria-hidden="true">' + th[1] + '</p>', choices: ch3.map(function (c) { return btn(c, swatch(c), c); }), ans: th[2], say: 'A ' + th[0] + ' is ' + th[2] + '.', fact: { t: 'col', name: th[2], thing: th[0] } };
  };
  GEN.shapes = function (lv) {
    if (lv < 3) {
      var pool = lv === 1 ? ['circle', 'square', 'triangle', 'rectangle'] : Object.keys(SH), a = pick(pool), ch = make4(a, pool, 4);
      return { q: 'Tap the ' + a, hear: 'Tap the ' + a, choices: ch.map(function (s) { return btn(s, shape(s), s); }), ans: a, say: 'That is a ' + a + '.', fact: { t: 'shape', name: a } };
    }
    var n = ri(3, 6), nums = shuffle([3, 4, 5, 6]);
    return { q: 'How many corners does it have?', hear: 'How many corners does this shape have?', vis: poly(n), choices: nums.map(function (x) { return btn(x, '<b>' + x + '</b>', String(x)); }), ans: String(n), say: 'It has ' + n + ' corners.', fact: { t: 'corners', n: n } };
  };
  GEN.count = function (lv) {
    var n = lv === 1 ? ri(1, 5) : lv === 2 ? ri(3, 10) : ri(8, 20), it = pick(ITEMS), cand = [], i, spread = lv === 3 ? 4 : 3;
    for (i = Math.max(1, n - spread); i <= n + spread; i++) if (i !== n) cand.push(i);
    var ch = shuffle([n].concat(some(cand, 3)));
    var s = ''; for (i = 0; i < n; i++) s += '<i>' + it + '</i>';
    return { q: 'How many are there?', hear: 'How many are there?', vis: '<p class="g-items" role="img" aria-label="Some things to count">' + s + '</p>', choices: ch.map(function (x) { return btn(x, '<b>' + x + '</b>', String(x)); }), ans: String(n), say: 'There are ' + n + '.', fact: { t: 'count', n: n } };
  };
  GEN.numbers = function (lv) {
    var max = lv === 1 ? 5 : lv === 2 ? 10 : 20, pool = [], i;
    if (lv < 3) {
      for (i = 1; i <= max; i++) pool.push(i);
      var a = pick(pool), ch = make4(a, pool, lv === 1 ? 3 : 4);
      return { q: 'Tap the number ' + a, hear: 'Tap the number ' + a, choices: ch.map(function (x) { return btn(x, '<b>' + x + '</b>', String(x)); }), ans: String(a), say: 'That is ' + a + '.', fact: { t: 'numtap', n: a } };
    }
    var kind = pick(['after', 'before', 'between']), n, text, ans;
    if (kind === 'after') { n = ri(1, 19); ans = n + 1; text = 'What comes after ' + n + '?'; }
    else if (kind === 'before') { n = ri(2, 20); ans = n - 1; text = 'What comes before ' + n + '?'; }
    else { n = ri(1, 18); ans = n + 1; text = n + ',  ?  , ' + (n + 2); }
    var cand = []; for (i = Math.max(1, ans - 3); i <= Math.min(20, ans + 3); i++) if (i !== ans) cand.push(i);
    var ch3 = shuffle([ans].concat(some(cand, 3)));
    return { q: text, hear: kind === 'between' ? 'Which number is missing between ' + n + ' and ' + (n + 2) + '?' : text, choices: ch3.map(function (x) { return btn(x, '<b>' + x + '</b>', String(x)); }), ans: String(ans), say: kind === 'between' ? n + ', ' + ans + ', ' + (n + 2) + '.' : (kind === 'after' ? n + ' then ' + ans + '.' : ans + ' then ' + n + '.'), fact: { t: 'numseq', kind: kind, n: n } };
  };
  function okLetters(set) { return LET_CONF.every(function (g) { return set.filter(function (x) { return g.indexOf(x) > -1; }).length < 2; }); }
  function letterSet(a, pool, n) { var guard = 0, set; do { set = shuffle([a].concat(some(without(pool, a), n - 1))); } while (!okLetters(set) && guard++ < 300); return set; }
  var UP = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''), LO = 'abcdefghijklmnopqrstuvwxyz'.split('');
  GEN.letters = function (lv) {
    var a, ch, text, say, f;
    if (lv === 1) { a = pick(UP); ch = letterSet(a, UP, 4); text = 'Tap the letter ' + a; say = 'That is ' + a + '.'; f = { t: 'let', kind: 'up', l: a }; }
    else if (lv === 2) { a = pick(LO); ch = letterSet(a, LO, 4); text = 'Tap the small letter ' + a; say = 'That is a small ' + a + '.'; f = { t: 'let', kind: 'lo', l: a }; }
    else { var s = pick(LO); a = s.toUpperCase(); ch = letterSet(a, UP, 4); text = 'Which big letter goes with ' + s + '?'; say = 'Big ' + a + ' goes with small ' + s + '.'; f = { t: 'let', kind: 'pair', l: s }; }
    return { q: text, hear: text.replace(/ ([a-z])$/, ' $1'), choices: ch.map(function (x) { return btn(x, '<b class="lt">' + x + '</b>', x); }), ans: a, say: say, fact: f };
  };
  GEN.firstletter = function (lv) {
    var keys = Object.keys(WORDS), k = pick(keys), w = WORDS[k];
    if (lv < 3) {
      var ch = shuffle([k].concat(some(without(keys, k), lv === 1 ? 2 : 3)));
      return { q: 'What letter does ' + w[0] + ' start with?', hear: 'What letter does ' + w[0] + ' start with?', vis: '<p class="g-emoji" aria-hidden="true">' + w[1] + '</p><p class="g-word">' + w[0] + '</p>', choices: ch.map(function (x) { return btn(x, '<b class="lt">' + x + '</b>', x); }), ans: k, say: w[0] + ' starts with ' + k + '.', fact: { t: 'first', letter: k, word: w[0] } };
    }
    var others = some(without(keys, k), 3), all = shuffle([k].concat(others));
    return { q: 'Tap the picture that starts with ' + k, hear: 'Tap the picture that starts with ' + k, choices: all.map(function (x) { return btn(x, '<span class="em">' + WORDS[x][1] + '</span>', WORDS[x][0]); }), ans: k, say: WORDS[k][0] + ' starts with ' + k + '.', fact: { t: 'first3', letter: k, words: all.map(function (x) { return WORDS[x][0]; }) } };
  };
  GEN.size = function (lv) {
    var want, ch, text, n;
    if (lv === 1) {
      want = pick(['bigger', 'smaller']); var big = ri(70, 86), small = ri(26, 40), items = shuffle([{ v: big }, { v: small }]);
      ch = items.map(function (x) { return { k: String(x.v), h: '<svg class="sz" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="' + x.v / 2 + '" fill="#e8743b"/></svg>', a: x.v > 50 ? 'big circle' : 'small circle', v: x.v }; });
      text = 'Tap the ' + want + ' one'; n = 2;
    } else if (lv === 2) {
      want = pick(['biggest', 'smallest']); var sizes = shuffle([ri(22, 30), ri(40, 50), ri(62, 72)]), em = pick(['🐘', '🐱', '🍎', '🐶', '⭐', '🚗']);
      ch = sizes.map(function (v) { return { k: String(v), h: '<span class="em" style="font-size:' + v + 'px">' + em + '</span>', a: 'a picture', v: v }; });
      text = 'Tap the ' + want + ' one'; n = 3;
    } else {
      want = pick(['longest', 'shortest']); var ls = some([30, 45, 60, 75, 90, 100], 4);
      ch = ls.map(function (v) { return { k: String(v), h: '<svg class="bar" viewBox="0 0 100 24" aria-hidden="true"><rect x="0" y="4" width="' + v + '" height="16" rx="8" fill="#2a8f8a"/></svg>', a: 'a bar', v: v }; });
      text = 'Tap the ' + want + ' bar'; n = 4;
    }
    var hi = /bigger|biggest|longest/.test(want), vals = ch.map(function (c) { return c.v; }), tv = hi ? Math.max.apply(0, vals) : Math.min.apply(0, vals);
    return { q: text, hear: text, choices: ch, ans: String(tv), say: 'That one is the ' + want + '.', fact: { t: 'size', want: want, n: n } };
  };
  GEN.oddone = function (lv) {
    var T = lv === 3 ? CAT2 : CAT, names = lv === 1 ? ['fruit', 'animal', 'vehicle'] : Object.keys(T), a = pick(names), b = pick(without(names, a)), three = some(T[a], 3), odd = pick(T[b]), all = shuffle(three.concat([odd]));
    return { q: 'Which one is different?', hear: 'Which one is different?', choices: all.map(function (x) { return btn(x, '<span class="em">' + x + '</span>', 'a picture'); }), ans: odd, say: 'The other three are the same kind. This one is not.', fact: { t: 'odd', lv: lv, three: three, odd: odd } };
  };
  GEN.patterns = function (lv) {
    var cols = some(COL2, 3), unit = lv === 1 ? [0, 1] : lv === 2 ? pick([[0, 0, 1], [0, 1, 1]]) : [0, 1, 2], len = lv === 1 ? 6 : lv === 2 ? 7 : 7, seq = [], i;
    for (i = 0; i < len; i++) seq.push(cols[unit[i % unit.length]]);
    var ans = cols[unit[len % unit.length]], pool = cols.slice(0, lv === 3 ? 3 : 2); if (pool.indexOf(ans) < 0) pool.push(ans);
    var extra = without(COL2, ans).filter(function (c) { return pool.indexOf(c) < 0; }); while (pool.length < 3) pool.push(extra.shift());
    var dots = seq.map(function (c) { return '<span class="pd" style="background:' + COL[c] + '" data-c="' + c + '"></span>'; }).join('') + '<span class="pd q">?</span>';
    return { q: 'What comes next?', hear: 'What colour comes next?', vis: '<p class="g-pat" role="img" aria-label="A pattern of coloured dots">' + dots + '</p>', choices: shuffle(pool).map(function (c) { return btn(c, swatch(c), c); }), ans: ans, say: 'The pattern repeats, so ' + ans + ' comes next.', fact: { t: 'pat', seq: seq, unit: unit.length } };
  };
  GEN.sounds = function (lv) {
    var keys = lv === 1 ? ['cow', 'dog', 'cat', 'duck'] : lv === 2 ? ['cow', 'dog', 'cat', 'duck', 'sheep', 'horse', 'hen', 'pig', 'lion'] : Object.keys(SND), a = pick(keys);
    if (lv < 3) {
      var ch = make4(a, keys, 4);
      return { q: 'Which animal says "' + SND[a][1] + '"?', hear: 'Which animal says ' + SND[a][1] + '?', choices: ch.map(function (x) { return btn(x, '<span class="em">' + SND[x][0] + '</span>', x); }), ans: a, say: 'The ' + a + ' says "' + SND[a][1] + '".', fact: { t: 'snd', animal: a, mode: 'animal' } };
    }
    var words = Object.keys(SND).map(function (k) { return SND[k][1]; }), w = SND[a][1], ch3 = make4(w, words, 4);
    return { q: 'What does the ' + a + ' say?', hear: 'What does the ' + a + ' say?', vis: '<p class="g-emoji" aria-hidden="true">' + SND[a][0] + '</p>', choices: ch3.map(function (x) { return btn(x, '<b>' + x + '</b>', x); }), ans: w, say: 'The ' + a + ' says "' + w + '".', fact: { t: 'snd', animal: a, mode: 'sound' } };
  };
  GEN.opposites = function (lv) {
    var lo = lv === 1 ? 0 : lv === 2 ? 4 : 0, hi = lv === 1 ? 4 : lv === 2 ? 14 : OPP.length, pairs = OPP.slice(lo, hi), p = pick(pairs), flip = R() < 0.5, w = p[flip ? 1 : 0], opp = p[flip ? 0 : 1];
    var others = shuffle(OPP.filter(function (x) { return x !== p; })), ch = [opp], i, used = [];
    for (i = 0; i < others.length && ch.length < 4; i++) { var x = others[i][R() < 0.5 ? 0 : 1]; ch.push(x); }
    return { q: 'What is the opposite of "' + w + '"?', hear: 'What is the opposite of ' + w + '?', choices: shuffle(ch).map(function (x) { return btn(x, '<b>' + x + '</b>', x); }), ans: opp, say: w + ' and ' + opp + ' are opposites.', fact: { t: 'opp', word: w } };
  };
  GEN.hindi = function (lv) {
    if (lv < 3) {
      var pool = lv === 1 ? 'कखगचजतदनपबमरसह'.split('') : 'आइईउऊ'.split(''), a = pick(pool), ch = make4(a, pool, lv === 1 ? 4 : 4);
      if (ch.length < 4) ch = shuffle(ch);
      return { q: 'Tap the letter "' + HI[a][0] + '" as in ' + HI[a][1], hear: '', lang: 'hi', choices: ch.map(function (x) { return btn(x, '<b class="lt hi" lang="hi">' + x + '</b>', HI[x][0]); }), ans: a, say: 'That is ' + a + ' (' + HI[a][0] + ').', fact: { t: 'hi', l: a } };
    }
    var w = pick(HIWORD), firsts = HIWORD.map(function (x) { return x[0].charAt(0); }).filter(function (x, i, l) { return l.indexOf(x) === i; }), k = w[0].charAt(0), ch3 = make4(k, firsts, 4);
    return { q: 'Which letter does this word start with?', hear: '', vis: '<p class="g-emoji" aria-hidden="true">' + w[1] + '</p><p class="g-word hi" lang="hi">' + w[0] + '</p>', choices: ch3.map(function (x) { return btn(x, '<b class="lt hi" lang="hi">' + x + '</b>', x); }), ans: k, say: w[0] + ' starts with ' + k + '.', fact: { t: 'hiw', word: w[0] } };
  };
  GEN.memory = function (lv) {
    var n = lv === 1 ? 3 : lv === 2 ? 6 : 8, pool = ['🍎', '🐶', '🚗', '🌸', '⭐', '🐱', '🎈', '🍌', '🐟', '🚂', '🦁', '🍦'], faces = some(pool, n);
    return { cards: shuffle(faces.concat(faces)), pairs: n, fact: { t: 'mem', n: n } };
  };
  G.make = function (id, lv) { return GEN[id](lv); };
  G.ids = Object.keys(GEN);
  if (typeof module !== 'undefined' && module.exports) { module.exports = { make: G.make, seed: G.seed, ids: G.ids }; return; }
  window.KG = G;

  /* ---------- play screen ---------- */
  var d = document, box = d.querySelector('[data-game]');
  if (!box) return;
  var id = box.getAttribute('data-game'), levels = JSON.parse(box.getAttribute('data-levels')), st = {}, voice = false;
  var PRAISE = ['Yes!', 'Well done!', 'That is right!', 'Good one!', 'You got it!', 'Great!'];
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function get(k) { try { return JSON.parse(localStorage.getItem('kg-' + id + '-' + k)); } catch (e) { return null; } }
  function put(k, v) { try { localStorage.setItem('kg-' + id + '-' + k, JSON.stringify(v)); } catch (e) {} }
  function stars(n) { return '<span class="stars" aria-label="' + n + ' of 3 stars">' + '★★★'.slice(0, n) + '<i>' + '★★★'.slice(n) + '</i></span>'; }
  function say(t) { if (!voice || !t || !window.speechSynthesis) return; try { speechSynthesis.cancel(); var u = new SpeechSynthesisUtterance(t); u.lang = 'en-IN'; u.rate = 0.9; speechSynthesis.speak(u); } catch (e) {} }

  function setup() {
    var lv = get('lv') || 1; if (lv > levels.length) lv = 1;
    box.innerHTML = '<div class="g-setup"><p class="g-lab">Choose a level (a grown-up can help)</p><div class="g-levels">' + levels.map(function (l, i) { var b = get('best' + (i + 1)); return '<button type="button" data-lv="' + (i + 1) + '" aria-pressed="' + (i + 1 === lv) + '"><b>Level ' + (i + 1) + '</b><span>' + esc(l) + '</span>' + (b ? '<em>' + stars(b) + '</em>' : '') + '</button>'; }).join('') + '</div>' +
      (window.speechSynthesis && id !== 'hindi' && id !== 'memory' ? '<label class="g-voice"><input type="checkbox" data-voice' + (voice ? ' checked' : '') + '> Read each question aloud</label>' : '') +
      '<button type="button" class="btn g-start">Play</button></div>';
    box.onclick = function (e) {
      var b = e.target.closest('button'); if (!b) return;
      if (b.hasAttribute('data-lv')) { lv = +b.getAttribute('data-lv'); put('lv', lv); [].forEach.call(box.querySelectorAll('[data-lv]'), function (x) { x.setAttribute('aria-pressed', x === b); }); }
      else if (b.classList.contains('g-start')) { box.onclick = null; st = { lv: lv, n: 0, first: 0, slips: 0, t0: Date.now() }; (id === 'memory' ? memory : quiz)(); }
    };
    box.onchange = function (e) { if (e.target.hasAttribute('data-voice')) { voice = e.target.checked; } };
  }
  function finish(extra) {
    var total = id === 'memory' ? 0 : st.total, s;
    if (id === 'memory') { var pairs = st.pairs, t = st.turns; s = t <= pairs + 2 ? 3 : t <= pairs * 2 ? 2 : 1; }
    else { var p = st.first / total; s = p >= 0.85 ? 3 : p >= 0.6 ? 2 : 1; }
    var old = get('best' + st.lv) || 0; if (s > old) put('best' + st.lv, s);
    box.innerHTML = '<div class="g-done"><p class="g-big">' + (s === 3 ? 'Wonderful!' : s === 2 ? 'Well done!' : 'Good trying!') + '</p>' + stars(s) + '<p class="g-score">' + extra + '</p>' +
      '<div class="g-btns"><button type="button" class="btn g-again">Play again</button><button type="button" class="btn ghost g-menu">Change level</button></div></div>';
    box.querySelector('.g-again').onclick = function () { st = { lv: st.lv, n: 0, first: 0, slips: 0, t0: Date.now() }; (id === 'memory' ? memory : quiz)(); };
    box.querySelector('.g-menu').onclick = setup;
  }
  function quiz() {
    var total = 8, q, lock = false, slipped = false, wrongs = 0;
    st.total = total;
    box.innerHTML = '<div class="g-play"><div class="g-top"><span class="g-count"></span><button type="button" class="g-quit" aria-label="Stop the game">Stop</button></div><p class="g-q" aria-live="polite"></p><div class="g-pic"></div><div class="g-choices"></div><p class="g-fb" aria-live="polite">&nbsp;</p></div>';
    var $ = function (s) { return box.querySelector(s); };
    $('.g-quit').onclick = function () { if (st.n > 1) finish(st.first + ' of ' + (st.n - 1) + ' right the first time'); else setup(); };
    function next() {
      if (st.n >= total) return finish(st.first + ' of ' + total + ' right the first time');
      q = G.make(id, st.lv); lock = false; slipped = false; wrongs = 0; st.n++;
      $('.g-count').textContent = 'Question ' + st.n + ' of ' + total;
      var qEl = $('.g-q'); qEl.textContent = q.q; if (q.lang) qEl.setAttribute('lang', 'en');
      $('.g-pic').innerHTML = q.vis || ''; var fb = $('.g-fb'); fb.innerHTML = '&nbsp;'; fb.className = 'g-fb';
      var cls = q.choices.length === 2 ? 'g-choices two' : q.choices.length === 3 ? 'g-choices three' : 'g-choices';
      $('.g-choices').className = cls; $('.g-choices').innerHTML = q.choices.map(function (c, i) { return '<button type="button" data-i="' + i + '" aria-label="' + esc(c.a) + '">' + c.h + '</button>'; }).join('');
      say(q.hear);
    }
    $('.g-choices').addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b || lock || b.disabled) return;
      var c = q.choices[+b.getAttribute('data-i')], fb = $('.g-fb');
      if (c.k === q.ans) {
        lock = true; b.classList.add('good'); if (!slipped) st.first++;
        fb.textContent = PRAISE[st.n % PRAISE.length] + ' ' + q.say; fb.className = 'g-fb good'; say(q.say);
        setTimeout(next, 1700);
      } else {
        slipped = true; wrongs++; b.classList.add('try'); b.disabled = true; fb.textContent = 'Not that one. Have another go.'; fb.className = 'g-fb try';
        if (wrongs >= 2) { [].forEach.call(box.querySelectorAll('.g-choices button'), function (x) { if (q.choices[+x.getAttribute('data-i')].k === q.ans) x.classList.add('hint'); }); fb.textContent = 'Look at the one that is glowing.'; }
      }
    });
    next();
  }
  function memory() {
    var p = G.make('memory', st.lv), open = [], left = p.pairs, busy = false, turns = 0; st.pairs = p.pairs;
    box.innerHTML = '<div class="g-play"><div class="g-top"><span class="g-count">Turns: 0</span><button type="button" class="g-quit">Stop</button></div><p class="g-q">Find the pairs that match</p><div class="g-grid mem c' + (p.pairs * 2) + '">' +
      p.cards.map(function (c, i) { return '<button type="button" data-i="' + i + '" aria-label="A hidden card"><span>?</span></button>'; }).join('') + '</div><p class="g-fb" aria-live="polite">&nbsp;</p></div>';
    var $ = function (s) { return box.querySelector(s); };
    $('.g-quit').onclick = setup;
    $('.g-grid').onclick = function (e) {
      var b = e.target.closest('button'); if (!b || busy || b.disabled || open.indexOf(b) > -1) return;
      b.innerHTML = '<span class="em">' + p.cards[+b.getAttribute('data-i')] + '</span>'; b.classList.add('up'); open.push(b);
      if (open.length === 2) {
        turns++; $('.g-count').textContent = 'Turns: ' + turns; var a = open[0], c = open[1];
        if (p.cards[+a.getAttribute('data-i')] === p.cards[+c.getAttribute('data-i')]) { a.classList.add('good'); c.classList.add('good'); a.disabled = c.disabled = true; open = []; left--; $('.g-fb').textContent = 'A pair!'; $('.g-fb').className = 'g-fb good'; if (!left) setTimeout(function () { st.turns = turns; finish('All pairs found in ' + turns + ' turns'); }, 900); }
        else { busy = true; $('.g-fb').textContent = 'Not a pair. Remember where they are.'; $('.g-fb').className = 'g-fb try'; setTimeout(function () { open.forEach(function (x) { x.innerHTML = '<span>?</span>'; x.classList.remove('up'); }); open = []; busy = false; $('.g-fb').innerHTML = '&nbsp;'; $('.g-fb').className = 'g-fb'; }, 1300); }
      }
    };
  }
  setup();
})();
