/* Site analytics (Google tag for this site's GA stream) + the few actions we count.
 * Every page loads this as the first thing in <head>:  <script src="/analytics.js"></script>
 * Anonymous totals only: no names, no form contents. */
(function () {
  var ID = 'GTM-WF7MTM53';
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;
  gtag('js', new Date());
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtm.js?id=' + ID;
  document.head.appendChild(s);

  function track(name, params) { try { gtag('event', name, params || {}); } catch (e) {} }
  window.trackSiteEvent = track;

  // Link clicks we care about (works for every page, no per-page wiring)
  document.addEventListener('click', function (ev) {
    var a = ev.target && ev.target.closest ? ev.target.closest('a[href]') : null;
    if (!a) return;
    var h = (a.getAttribute('href') || '').toLowerCase();
    var page = (location.pathname.split('/').pop() || 'index.html').replace('.html', '');
    if (h.indexOf('apps.apple.com') > -1) track('app_store_click', { store: 'ios', page: page });
    else if (h.indexOf('play.google.com') > -1) track('app_store_click', { store: 'android', page: page });
    else if (h.indexOf('wesharegiving.org') > -1) track('giving_click', { page: page });
    else if (h.indexOf('youtube.com') > -1 || h.indexOf('youtu.be') > -1) track('youtube_click', { page: page });
    else if (h.indexOf('docs.google.com') > -1 || h.indexOf('drive.google.com') > -1 || /\.pdf(\?|#|$)/.test(h)) track('document_open', { page: page });
    else if (h.indexOf('mailto:') === 0) track('email_click', { page: page });
    else if (h.indexOf('tel:') === 0) track('phone_click', { page: page });
  }, true);

  // A registration or advertising form counts as sent when its success screen appears.
  // (Counts the form name only -- nothing the person typed.)
  document.addEventListener('DOMContentLoaded', function () {
    var el = document.getElementById('success-screen');
    if (!el || !window.MutationObserver) return;
    var form = (location.pathname.split('/').pop() || '').replace('.html', '');
    var fired = false;
    function check() {
      if (fired) return;
      if (getComputedStyle(el).display !== 'none') { fired = true; track('form_submit', { form: form }); }
    }
    new MutationObserver(check).observe(el, { attributes: true, attributeFilter: ['style', 'class'] });
  });
})();
