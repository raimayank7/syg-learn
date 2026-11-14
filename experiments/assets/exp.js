/* learn.shareyourgroup.com/experiments: choose experiments and get one combined, printable materials checklist. The pure helper comes first (the build checks it in Node against separate
   Python code), then the page tool. Nothing leaves the browser; ticks are kept only in this browser. */
(function () {
  'use strict';
  var EX = {};
  EX.LIST = [{"title": "Baking Soda and Vinegar Fizz", "mat": ["baking soda", "vinegar", "empty plastic bottle", "big tray", "spoon", "food colouring (optional)"]}, {"title": "Dancing Raisins", "mat": ["clear plastic cup", "plain fizzy water (soda water)", "raisins", "spoon"]}, {"title": "Floating Egg in Salt Water", "mat": ["raw egg", "two tall clear plastic cups", "water", "table salt", "spoon"]}, {"title": "Walking Water", "mat": ["three clear plastic cups", "paper towels", "water", "food colouring (red and blue)", "tray"]}, {"title": "Static Balloon and Paper", "mat": ["balloon", "small pieces of paper", "clean dry hair or a woollen cloth"]}, {"title": "Magnet Hunt", "mat": ["fridge magnet or small bar magnet", "tray of small household things", "pencil and paper"]}, {"title": "Shadows Long and Short", "mat": ["torch", "small toy or a block", "ruler", "sheet of paper", "pencil and paper"]}, {"title": "Flat Paper and Paper Ball", "mat": ["two sheets of paper of the same size", "pencil and paper"]}, {"title": "Ice Melting Race", "mat": ["two ice cubes of the same size", "two plates", "table salt", "spoon", "clock or timer"]}, {"title": "Sugar in Warm and Cold Water", "mat": ["two clear plastic cups", "sugar", "spoon", "cold tap water", "warm water from the tap", "clock or timer"]}, {"title": "Rubber Band Guitar", "mat": ["empty plastic container with an open top", "three rubber bands of different thickness", "pencil"]}, {"title": "Seed in a Bag", "mat": ["dried bean or other seed", "paper towel", "clear zip bag", "water", "tape", "pencil and paper"]}, {"title": "Mixing Paint Colours", "mat": ["water paints in red, yellow and blue", "white paper", "paintbrush", "plastic plate", "cup of water", "newspaper"]}, {"title": "Paper Spinner", "mat": ["sheet of paper", "paper clip", "scissors (for the adult)", "ruler", "pencil"]}];
  /* chosen: array of experiment numbers (0-based). Returns [[material, number of chosen experiments that use it]] sorted by name. */
  EX.combine = function (chosen) {
    var seen = {}, names = [];
    for (var i = 0; i < chosen.length; i++) {
      var mats = EX.LIST[chosen[i]].mat;
      for (var j = 0; j < mats.length; j++) {
        var m = mats[j];
        if (!Object.prototype.hasOwnProperty.call(seen, m)) { seen[m] = 0; names.push(m); }
        seen[m]++;
      }
    }
    names.sort(function (a, b) { return a < b ? -1 : a > b ? 1 : 0; });
    return names.map(function (n) { return [n, seen[n]]; });
  };
  if (typeof module !== 'undefined' && module.exports) { module.exports = EX; return; }
  window.EXPT = EX;

  var d = document;
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function get(k) { try { return JSON.parse(localStorage.getItem('ex-' + k)); } catch (e) { return null; } }
  function put(k, v) { try { localStorage.setItem('ex-' + k, JSON.stringify(v)); } catch (e) {} }

  var box = d.querySelector('[data-pick]');
  if (box) {
    var on = get('chosen') || [];
    box.innerHTML = '<fieldset><legend>Tick the experiments you plan to do</legend><div class="picks">' +
      EX.LIST.map(function (x, i) { return '<label class="pk"><input type="checkbox" data-i="' + i + '"' + (on.indexOf(i) >= 0 ? ' checked' : '') + '> <span>' + esc(x.title) + '</span></label>'; }).join('') +
      '</div></fieldset><div class="btns"><button type="button" class="btn ghost" id="xa">Tick all</button><button type="button" class="btn ghost" id="xn">Clear</button><button type="button" class="btn" id="xp">Print this list</button></div>' +
      '<p class="msg" id="xm" aria-live="polite"></p><div id="xl" class="chk-list"></div>';
    var draw = function () {
      var ch = [].slice.call(box.querySelectorAll('input[data-i]')).filter(function (c) { return c.checked; }).map(function (c) { return +c.getAttribute('data-i'); });
      put('chosen', ch);
      var list = EX.combine(ch);
      box.querySelector('#xm').textContent = ch.length ? ch.length + ' experiment' + (ch.length === 1 ? '' : 's') + ' chosen, ' + list.length + ' different things to find.' : 'Tick one or more experiments to see the things you need.';
      box.querySelector('#xl').innerHTML = list.length ? '<ul class="chk">' + list.map(function (r) { return '<li class="chk"><span class="cell"></span> ' + esc(r[0]) + (r[1] > 1 ? ' <i>(used in ' + r[1] + ')</i>' : '') + '</li>'; }).join('') + '</ul>' : '';
    };
    box.addEventListener('change', draw);
    box.addEventListener('click', function (e) {
      var id = e.target.id;
      if (id === 'xa' || id === 'xn') { box.querySelectorAll('input[data-i]').forEach(function (c) { c.checked = id === 'xa'; }); draw(); }
      if (id === 'xp') window.print();
    });
    draw();
  }
})();
