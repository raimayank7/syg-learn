/* learn.shareyourgroup.com/teachers: a report comment bank with pronouns filled in, a rubric maker and a lesson plan form. Pure helpers first (the build checks them in Node against separate Python code),
   then the tools. The comments (window.COMMENTS) are generated at build time. Nothing is sent anywhere. */
(function () {
  'use strict';
  var T = {};
  /* pronoun sets for the tokens {they} {They} {them} {their} {Their} {is} {has} {s}; {name} is the child's name */
  T.PRON = {
    they: { they: 'they', They: 'They', them: 'them', their: 'their', Their: 'Their', is: 'are', has: 'have', s: '' },
    he: { they: 'he', They: 'He', them: 'him', their: 'his', Their: 'His', is: 'is', has: 'has', s: 's' },
    she: { they: 'she', They: 'She', them: 'her', their: 'her', Their: 'Her', is: 'is', has: 'has', s: 's' }
  };
  T.fill = function (tpl, name, pron) {
    var p = T.PRON[pron] || T.PRON.they, n = String(name).replace(/\s+/g, ' ').trim() || 'The child';
    return String(tpl).replace(/\{(name|they|They|them|their|Their|is|has|s)\}/g, function (m, k) { return k === 'name' ? n : p[k]; });
  };
  T.LABELS = { 2: ['Met', 'Not yet'], 3: ['Strong', 'Secure', 'Developing'], 4: ['Excellent', 'Good', 'Developing', 'Beginning'], 5: ['Outstanding', 'Very good', 'Good', 'Developing', 'Beginning'], 6: ['Outstanding', 'Very good', 'Good', 'Satisfactory', 'Developing', 'Beginning'] };
  /* a rubric: a row for each criterion (up to 12, one per line), a column for each level (2 to 6), the top level worth the most points */
  T.rubric = function (criteriaText, n) {
    n = Math.min(6, Math.max(2, n | 0));
    var rows = [], seen = 0;
    String(criteriaText).split(/\r?\n|,/).forEach(function (x) { x = x.replace(/\s+/g, ' ').trim(); if (x && rows.length < 12) rows.push(x.slice(0, 60)); seen++; });
    var levels = T.LABELS[n].map(function (l, i) { return { label: l, points: n - i }; });
    return { levels: levels, rows: rows, max: rows.length * n };
  };
  T.percent = function (score, max) { return max > 0 ? Math.round(score / max * 1000) / 10 : null; };
  if (typeof module !== 'undefined' && module.exports) { module.exports = T; return; }
  window.TEACHERS = T;

  var d = document;
  function el(q) { return d.querySelector(q); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function get(k) { try { return JSON.parse(localStorage.getItem('teachers-' + k)); } catch (e) { return null; } }
  function put(k, v) { try { localStorage.setItem('teachers-' + k, JSON.stringify(v)); } catch (e) {} }
  var cb = el('[data-comments]');
  if (cb) {
    var C = window.COMMENTS || [], cats = window.COMMENT_CATS || [], st = get('c') || {};
    cb.innerHTML = '<div class="fields"><label>Child\'s first name<input type="text" id="cn" maxlength="30" value="' + esc(st.name || 'Asha') + '" autocomplete="off"></label><label>Pronoun<select id="cp"><option value="she">she / her</option><option value="he">he / him</option><option value="they">they / them</option></select></label></div><p class="fnote">Type a name, choose the pronoun, and copy the sentences you want. Change them to fit the child: they are starting points.</p><div data-list></div><p><button type="button" class="btn ghost" id="cpa">Copy all shown</button></p>';
    el('#cp').value = st.pron || 'she';
    var run = function () {
      var name = el('#cn').value, pron = el('#cp').value; put('c', { name: name, pron: pron });
      cb.querySelector('[data-list]').innerHTML = cats.map(function (c) { return '<h2>' + esc(c[1]) + '</h2>' + C.filter(function (x) { return x[0] === c[0]; }).map(function (x) { return '<div class="cm"><p>' + esc(T.fill(x[1], name, pron)) + '</p><button type="button" class="btn ghost" data-copy>Copy</button></div>'; }).join(''); }).join('');
    };
    var copy = function (t, b) { var ok = function () { var o = b.textContent; b.textContent = 'Copied'; setTimeout(function () { b.textContent = o; }, 1200); }; try { navigator.clipboard.writeText(t).then(ok, function () { b.textContent = 'Select and copy by hand'; }); } catch (e) { b.textContent = 'Select and copy by hand'; } };
    cb.addEventListener('input', run); cb.addEventListener('change', run);
    cb.addEventListener('click', function (e) {
      if (e.target.hasAttribute('data-copy')) copy(e.target.parentNode.querySelector('p').textContent, e.target);
      else if (e.target.id === 'cpa') copy([].map.call(cb.querySelectorAll('.cm p'), function (p) { return p.textContent; }).join('\n'), e.target);
    });
    run();
  }
  var rb = el('[data-rubric]');
  if (rb) {
    var rs = get('r') || {};
    rb.innerHTML = '<label>Title<input type="text" id="rt" maxlength="80" value="' + esc(rs.title || 'Project rubric') + '"></label><label>Criteria, one on each line (up to 12)<textarea class="names" id="rc">' + esc(rs.crit !== undefined ? rs.crit : 'Content\nOrganisation\nPresentation\nTeamwork') + '</textarea></label><div class="fields"><label>Levels<select id="rn"><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="2">2</option></select></label></div><div class="btns"><button type="button" class="btn" id="rp">Print the rubric</button></div><div class="rub" data-out></div>';
    el('#rn').value = String(rs.n || 4);
    var run2 = function () {
      put('r', { title: el('#rt').value, crit: el('#rc').value, n: +el('#rn').value });
      var r = T.rubric(el('#rc').value, +el('#rn').value);
      rb.querySelector('[data-out]').innerHTML = '<h2>' + esc(el('#rt').value) + '</h2><div style="overflow-x:auto"><table><thead><tr><th>Criterion</th>' + r.levels.map(function (l) { return '<th>' + esc(l.label) + ' (' + l.points + ')</th>'; }).join('') + '<th>Score</th></tr></thead><tbody>' + r.rows.map(function (c) { return '<tr><td>' + esc(c) + '</td>' + r.levels.map(function () { return '<td></td>'; }).join('') + '<td></td></tr>'; }).join('') + '</tbody></table></div><p>Total: ______ out of ' + r.max + '</p>';
    };
    rb.addEventListener('input', run2); rb.addEventListener('change', run2);
    rb.addEventListener('click', function (e) { if (e.target.id === 'rp') window.print(); });
    run2();
  }
  var lb = el('[data-lesson]');
  if (lb) {
    var rows = ['Class and subject', 'Date and time', 'Topic', 'Learning aims (what pupils will know or do by the end)', 'Resources needed', 'Starter (first 5 to 10 minutes)', 'Main activity', 'Questions to ask', 'Support for pupils who need it', 'Extension for pupils who are ready', 'Plenary (how I will check learning)', 'Homework', 'Notes after the lesson'];
    lb.innerHTML = '<div class="btns"><button type="button" class="btn" id="lp">Print the lesson plan</button></div><div class="lp"><table style="width:100%;border-collapse:collapse">' + rows.map(function (r, i) { return '<tr><td class="l">' + esc(r) + '</td><td class="t" style="height:' + (i < 3 ? '2.4em' : '5em') + '"></td></tr>'; }).join('') + '</table></div>';
    lb.addEventListener('click', function (e) { if (e.target.id === 'lp') window.print(); });
  }
})();
