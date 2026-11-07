/* One job: highlight the nav link for whatever section you are looking at.
   Everything else on this page is HTML and CSS. With JavaScript off, the nav
   still jumps and every project and archive item is visible. */
(function () {
  'use strict';

  var nav = document.querySelector('.nav');
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav__links a'));
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
     current one. If none of them is on screen, because you are in a photo band
     or the archive, neither of which has a nav link, the last section you
     scrolled past stays lit rather than the highlight blinking off. */
  var queued = false;

  function update() {
    queued = false;
    var line = (nav ? nav.getBoundingClientRect().height : 56) + 8;
    var floor = window.innerHeight;
    /* a sliver peeking in below the fold should not win: require a quarter of
       the window, so standing at the top of the hero lights nothing */
    var floorSeen = (floor - line) * 0.25;
    var bestSeen = 0, best = null, passed = null, parked = null;

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
