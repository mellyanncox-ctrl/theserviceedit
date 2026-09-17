/* Mobile menu — shared by every page.

   Below 560px, Services / Pricing / About were display:none with no control to
   reveal them, so three of the header links did not exist on a phone.

   The scroll lock is the position:fixed + negative-top one rather than
   overflow:hidden on <body>: overflow:hidden does not hold on iOS Safari, the
   page scrolls underneath it and you come back somewhere else. The exact
   scroll position is captured on open and restored on close. */
(function () {
  var btn = document.getElementById('tseMenuBtn');
  var nav = document.getElementById('tseMenu');
  if (!btn || !nav) return;
  var body = document.body, docEl = document.documentElement;
  var lockedY = 0, open = false, lastFocus = null;

  function lock() {
    lockedY = window.scrollY || docEl.scrollTop;
    body.style.position = 'fixed';
    body.style.top = -lockedY + 'px';
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
  }
  function unlock() {
    body.style.position = ''; body.style.top = '';
    body.style.left = ''; body.style.right = ''; body.style.width = '';
    // 'instant' so the restore is not animated by scroll-behavior: smooth.
    window.scrollTo({ top: lockedY, left: 0, behavior: 'instant' });
  }

  function setOpen(next) {
    if (next === open) return;
    open = next;
    if (open) { lastFocus = document.activeElement; lock(); }
    body.classList.toggle('tse-menu-open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (open) {
      var first = nav.querySelector('a');
      if (first) first.focus({ preventScroll: true });
    } else {
      unlock();
      if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    }
  }

  btn.addEventListener('click', function () { setOpen(!open); });

  // Any link closes it — including the in-page anchors, which must be able to
  // scroll once the lock is off, so the close happens before the jump.
  nav.addEventListener('click', function (e) {
    var a = e.target.closest('a');
    if (!a) return;
    var hash = a.getAttribute('href');
    if (hash && hash.charAt(0) === '#') {
      e.preventDefault();
      setOpen(false);
      var t = document.querySelector(hash);
      if (t) requestAnimationFrame(function () { t.scrollIntoView({ block: 'start' }); history.pushState(null, '', hash); });
    } else {
      setOpen(false);
    }
  });

  document.addEventListener('keydown', function (e) {
    if (!open) return;
    if (e.key === 'Escape') { setOpen(false); return; }
    if (e.key !== 'Tab') return;
    var f = nav.querySelectorAll('a[href]');
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  // Growing past the breakpoint with the panel open would leave the body locked.
  var mq = window.matchMedia('(min-width: 561px)');
  (mq.addEventListener ? mq.addEventListener.bind(mq, 'change') : mq.addListener.bind(mq))(function (e) {
    if ((e.matches !== undefined ? e.matches : mq.matches) && open) setOpen(false);
  });
})();
