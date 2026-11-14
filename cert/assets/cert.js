/* learn.shareyourgroup.com/cert: make printable certificates for one name or many names pasted from a spreadsheet. Pure helpers first (the build checks them in Node against separate Python code),
   then the tool. Nothing is sent anywhere. */
(function () {
  'use strict';
  var K = {};
  K.MAXN = 200; K.NAMELEN = 60; K.LINELEN = 200;
  /* one certificate for each line: "name" or "name <tab> own reason". Empty lines are skipped; a name longer than 60 characters is cut. */
  K.parse = function (text) {
    var out = [];
    String(text).split(/\r?\n/).forEach(function (line) {
      if (out.length >= K.MAXN) return;
      var i = line.indexOf('\t'), name = (i < 0 ? line : line.slice(0, i)).replace(/\s+/g, ' ').trim(), own = i < 0 ? '' : line.slice(i + 1).replace(/\s+/g, ' ').trim();
      if (!name) return;
      out.push({ name: name.slice(0, K.NAMELEN), line: own ? own.slice(0, K.LINELEN) : '' });
    });
    return out;
  };
  /* {name} and {date} in the reason text are replaced; a reason with neither stays as typed */
  K.fill = function (tpl, name, date) { return String(tpl).split('{name}').join(name).split('{date}').join(date); };
  function ex(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  /* opts: style (classic|modern|plain), title, lead, reason, date, sign1, sign2 */
  K.html = function (c, o) {
    var style = ['classic', 'modern', 'plain'].indexOf(o.style) < 0 ? 'classic' : o.style, reason = c.line || K.fill(o.reason, c.name, o.date);
    return '<div class="cert ' + style + '"><p class="c-title">' + ex(o.title) + '</p><p class="c-line">' + ex(o.lead) + '</p><p class="c-name">' + ex(c.name) + '</p><p class="c-reason">' + ex(reason) + '</p>' +
      (o.date ? '<p class="c-date">' + ex(o.date) + '</p>' : '') + ((o.sign1 || o.sign2) ? '<div class="c-sign">' + (o.sign1 ? '<span>' + ex(o.sign1) + '</span>' : '') + (o.sign2 ? '<span>' + ex(o.sign2) + '</span>' : '') + '</div>' : '') + '</div>';
  };
  if (typeof module !== 'undefined' && module.exports) { module.exports = K; return; }
  window.CERT = K;

  var d = document;
  function el(q) { return d.querySelector(q); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function get(k) { try { return JSON.parse(localStorage.getItem('cert-' + k)); } catch (e) { return null; } }
  function put(k, v) { try { localStorage.setItem('cert-' + k, JSON.stringify(v)); } catch (e) {} }
  var box = el('[data-cert]');
  if (box) {
    var st = get('opts') || {};
    var D = { title: 'Certificate of Achievement', lead: 'This certificate is proudly presented to', reason: 'for outstanding effort and achievement.', date: '', sign1: 'Teacher', sign2: 'Principal', style: 'classic', names: 'Asha Verma\nBilal Khan\t1st place in the quiz' };
    var v = function (k) { return st[k] !== undefined ? st[k] : D[k]; };
    box.innerHTML = '<div class="fields"><label>Title<input type="text" id="ct" maxlength="60" value="' + esc(v('title')) + '"></label><label>Line above the name<input type="text" id="cl" maxlength="80" value="' + esc(v('lead')) + '"></label><label>Reason (use {name} and {date} if you like)<input type="text" id="cr" maxlength="200" value="' + esc(v('reason')) + '"></label><label>Date<input type="text" id="cd" maxlength="30" value="' + esc(v('date')) + '" placeholder="e.g. 14 November 2026"></label><label>Left signature<input type="text" id="c1" maxlength="40" value="' + esc(v('sign1')) + '"></label><label>Right signature<input type="text" id="c2" maxlength="40" value="' + esc(v('sign2')) + '"></label><label>Design<select id="cs"><option value="classic">Classic gold border</option><option value="modern">Modern side bands</option><option value="plain">Plain thin border</option></select></label></div>' +
      '<label>Names, one on each line. To give someone their own reason, put a tab and the reason after the name (this is what you get when you copy two columns from Excel).<textarea class="names" id="cn" maxlength="20000">' + esc(v('names')) + '</textarea></label><div class="btns"><button type="button" class="btn" id="cp">Print all certificates</button></div><p class="msg" aria-live="polite" data-msg></p><div class="cwrap" data-sheet></div>';
    el('#cs').value = v('style');
    var run = function () {
      var o = { title: el('#ct').value, lead: el('#cl').value, reason: el('#cr').value, date: el('#cd').value, sign1: el('#c1').value, sign2: el('#c2').value, style: el('#cs').value }, list = K.parse(el('#cn').value);
      var s = { names: el('#cn').value }; for (var k in o) s[k] = o[k]; put('opts', s);
      box.querySelector('[data-msg]').textContent = list.length ? list.length + ' certificate' + (list.length === 1 ? '' : 's') + '. Each prints on its own landscape A4 page.' : 'Type at least one name.';
      box.querySelector('[data-sheet]').innerHTML = list.map(function (c) { return K.html(c, o); }).join('');
    };
    box.addEventListener('input', run); box.addEventListener('change', run);
    box.addEventListener('click', function (e) { if (e.target.id === 'cp') window.print(); });
    run();
  }
})();
