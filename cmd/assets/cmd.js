/* learn.shareyourgroup.com/cmd: command finder */
(function () {
  'use strict';
  var d = document, q = d.getElementById('cq');
  if (!q) return;
  var items = d.querySelectorAll('.fl li'), heads = d.querySelectorAll('.cx h2'), count = d.querySelector('[data-ccount]');
  q.addEventListener('input', function () {
    var words = q.value.toLowerCase().trim().split(/\s+/).filter(Boolean), n = 0;
    for (var i = 0; i < items.length; i++) {
      var k = items[i].getAttribute('data-k'), ok = true;
      for (var j = 0; j < words.length; j++) if (k.indexOf(words[j]) < 0) { ok = false; break; }
      items[i].hidden = !ok; if (ok) n++;
    }
    for (var h = 0; h < heads.length; h++) { var ul = heads[h].nextElementSibling; if (ul) heads[h].hidden = ul.hidden = !ul.querySelector('li:not([hidden])'); }
    count.textContent = words.length ? (n ? n + ' page' + (n === 1 ? '' : 's') + ' found' : 'Nothing found. Try a simpler word, such as "copy", "delete" or "search".') : '';
  });
})();
