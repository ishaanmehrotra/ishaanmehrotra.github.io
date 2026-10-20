/* Two small things: the work/archive filters, and highlighting the nav link
   for whatever section you are looking at. Everything else is CSS.
   With JavaScript off, every item renders visible and the nav still jumps. */
(function () {
  'use strict';

  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------------- filters: Work and Archive ---------------- */
  $$('[data-filters]').forEach(function (group) {
    var key   = group.getAttribute('data-filters');
    var scope = $('[data-filterable="' + key + '"]');
    var empty = $('[data-empty="' + key + '"]');
    if (!scope) return;

    var items   = $$('[data-tags]', scope);
    var buttons = $$('.filter', group);

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var f = btn.getAttribute('data-f');
        buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });

        var shown = 0;
        items.forEach(function (it) {
          var match = f === 'all' ||
            (' ' + it.getAttribute('data-tags') + ' ').indexOf(' ' + f + ' ') > -1;
          it.hidden = !match;
          if (match) shown++;
        });

        /* a category heading hides itself when everything under it is filtered out */
        $$('.archive__group', scope).forEach(function (g) {
          var any = $$('[data-tags]', g).some(function (x) { return !x.hidden; });
          g.hidden = !any;
        });

        if (empty) empty.hidden = shown !== 0;
      });
    });
  });

  /* ---------------- nav highlight ---------------- */
  var links = $$('.nav__links a');
  if (!links.length) return;

  var targets = links.map(function (a) {
    var id = (a.getAttribute('href') || '').replace(/^#/, '');
    var el = id ? document.getElementById(id) : null;
    return el ? { link: a, el: el } : null;
  }).filter(Boolean);

  if (!targets.length) return;

  function mark(active) {
    targets.forEach(function (t) {
      if (t.link === active) t.link.setAttribute('aria-current', 'true');
      else t.link.removeAttribute('aria-current');
    });
  }

  /* Whichever linked section fills most of the window below the nav bar is the
     current one. If none of them is on screen — you are in a photo band or in
     the archive, neither of which has a nav link — the last section you
     scrolled past stays lit rather than the highlight blinking off. */
  var nav = $('.nav');
  var queued = false;

  function update() {
    queued = false;
    var line = (nav ? nav.getBoundingClientRect().height : 56) + 8;
    var floor = window.innerHeight;
    /* a sliver peeking in below the fold should not win: require a quarter of
       the window, so standing at the top of the hero lights nothing */
    var floorSeen = (floor - line) * 0.25;
    var bestSeen = 0, best = null, passed = null;

    var parked = null;
    targets.forEach(function (t) {
      var r = t.el.getBoundingClientRect();
      if (r.top <= line + 16) passed = t.link;
      /* heading sitting right under the nav: you just jumped here, or you
         scrolled it to the top. Either way it wins over a taller neighbour. */
      if (r.top >= line - 12 && r.top <= line + 48) parked = t.link;
      var seen = Math.min(r.bottom, floor) - Math.max(r.top, line);
      if (seen >= floorSeen && seen >= bestSeen) { bestSeen = seen; best = t.link; }
    });

    mark(parked || best || passed);
  }

  function onScroll() {
    if (queued) return;
    queued = true;
    window.requestAnimationFrame(update);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();
