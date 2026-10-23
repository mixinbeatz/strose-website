/* Shared site tab bar. Include as the FIRST thing inside <body>:
 *   <script src="nav.js"></script>            (add `data-print` for a Print / Save PDF button)
 * The bar is inserted right where the script tag sits. Keep the link lists in
 * sync with index.html / calendar.html / documents.html / welcome.html. */
(function () {
  var script = document.currentScript;
  var page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  var FORMS = ['parish-registration.html', 'faith-formation-registration.html', 'youth-ministry-registration.html',
               'funeral-planning-form.html', 'advertise.html', 'delete-account.html'];
  var tabs = [
    ['Welcome', 'welcome.html', 'welcome.html'],
    ['Mass Times', 'index.html#mass-times', ''],
    ['Calendar', 'calendar.html', 'calendar.html'],
    ['Visit', 'index.html#location', ''],
    ['Bulletin', 'bulletin.html', 'bulletin.html'],
    ['Documents', 'documents.html', 'documents.html'],
    ['Directory', 'advertisers.html', 'advertisers.html']
  ];
  var forms = [
    ['Parish Registration', 'parish-registration.html'],
    ['Faith Formation Registration', 'faith-formation-registration.html'],
    ['Youth Ministry Registration', 'youth-ministry-registration.html'],
    ['Funeral Planning Form', 'funeral-planning-form.html'],
    ['Become an Advertiser', 'advertise.html'],
    ['Delete My Account', 'delete-account.html']
  ];
  var showPrint = script && script.hasAttribute('data-print');
  var onForms = FORMS.indexOf(page) !== -1;

  var css = [
    ':root{--sn-gold:#C9A84C;--sn-gold-light:#E8C96A;--sn-burgundy:#5C1A2E;--sn-dark:#3D0F1E;--sn-rose:#C17A8A}',
    'body{padding-top:68px}',
    '#site-nav{position:fixed;top:0;left:0;right:0;z-index:1000;background:rgba(92,26,46,.96);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);border-bottom:1px solid rgba(201,168,76,.2);padding:0 40px;display:flex;align-items:center;justify-content:space-between;height:68px;box-sizing:border-box}',
    '#site-nav *{box-sizing:border-box}',
    '#site-nav .sn-brand{font-family:"Cinzel",serif;color:var(--sn-gold);font-size:13px;letter-spacing:2px;line-height:1.4;text-decoration:none}',
    '#site-nav .sn-brand span{display:block;color:rgba(232,221,208,.6);font-size:10px;letter-spacing:3px;margin-top:2px}',
    '#site-nav .sn-links{display:flex;align-items:center;gap:32px}',
    '#site-nav .sn-links a,#site-nav .sn-print{color:rgba(232,221,208,.8);text-decoration:none;font-size:13px;letter-spacing:1.5px;font-family:"Cinzel",serif;transition:color .2s}',
    '#site-nav .sn-links a:hover,#site-nav .sn-links a.active{color:var(--sn-gold)}',
    '#site-nav .sn-links a.sn-cta{background:var(--sn-gold);color:var(--sn-dark);padding:10px 20px;border-radius:6px;font-weight:600}',
    '#site-nav .sn-links a.sn-cta:hover{background:var(--sn-gold-light);color:var(--sn-dark)}',
    '#site-nav .sn-print{background:none;border:1px solid rgba(201,168,76,.5);color:var(--sn-gold);padding:9px 16px;border-radius:6px;cursor:pointer;font-size:12px}',
    '#site-nav .sn-print:hover{background:rgba(201,168,76,.15)}',
    '#site-nav .sn-forms{position:relative}',
    '#site-nav .sn-forms-menu{display:none;position:absolute;right:0;top:100%;min-width:210px;background:var(--sn-dark);border:1px solid rgba(201,168,76,.25);border-radius:8px;padding:6px 0;z-index:200;box-shadow:0 8px 24px rgba(0,0,0,.3)}',
    '#site-nav .sn-forms:hover .sn-forms-menu,#site-nav .sn-forms:focus-within .sn-forms-menu{display:block}',
    '#site-nav .sn-forms-menu a{display:block;padding:10px 18px;font-size:13px;letter-spacing:1px;white-space:nowrap}',
    '#site-nav .sn-forms-menu a:hover{background:rgba(255,255,255,.06)}',
    '#site-nav .sn-right{display:flex;align-items:center;gap:12px}',
    '#site-nav .sn-links a,#site-nav .sn-print{white-space:nowrap}',
    '#site-nav.sn-has-print .sn-links{gap:20px}',
    '#site-nav.sn-has-print .sn-links a{letter-spacing:1px}',
    '#site-nav .sn-ham{display:none;flex-direction:column;gap:5px;background:none;border:none;cursor:pointer;padding:8px}',
    '#site-nav .sn-ham span{display:block;width:24px;height:2px;background:var(--sn-gold);border-radius:2px;transition:all .3s}',
    '#site-nav .sn-ham.open span:nth-child(1){transform:translateY(7px) rotate(45deg)}',
    '#site-nav .sn-ham.open span:nth-child(2){opacity:0}',
    '#site-nav .sn-ham.open span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}',
    '#sn-mobile{display:none;position:fixed;top:68px;left:0;right:0;background:var(--sn-dark);z-index:999;padding:16px 0;border-bottom:1px solid rgba(201,168,76,.2);flex-direction:column;max-height:calc(100vh - 68px);overflow-y:auto}',
    '#sn-mobile.open{display:flex}',
    '#sn-mobile a,#sn-mobile summary{color:rgba(232,221,208,.8);text-decoration:none;font-family:"Cinzel",serif;font-size:14px;letter-spacing:1.5px;padding:14px 32px;border-bottom:1px solid rgba(255,255,255,.05);cursor:pointer;list-style:none}',
    '#sn-mobile a:hover,#sn-mobile a.active{color:var(--sn-gold)}',
    '#sn-mobile summary::-webkit-details-marker{display:none}',
    '#sn-mobile summary::after{content:" \\25BE";opacity:.55}',
    '#sn-mobile details[open] summary::after{content:" \\25B4"}',
    '#sn-mobile details a{display:block;padding-left:48px}',
    '#sn-mobile .sn-div{height:1px;background:rgba(201,168,76,.2);margin:8px 0}',
    '#sn-mobile a.sn-admin{color:var(--sn-rose);font-size:12px}',
    '@media(max-width:900px){#site-nav{padding:0 24px}#site-nav .sn-links{display:none}#site-nav .sn-print{display:none}#site-nav .sn-ham{display:flex}}',
    '@media(min-width:901px){#sn-mobile .sn-print-item{display:none}}',
    '@media print{#site-nav,#sn-mobile{display:none!important}body{padding-top:0!important}}'
  ].join('\n');

  function link(t, h, active) { return '<a href="' + h + '"' + (active ? ' class="active"' : '') + '>' + t + '</a>'; }
  var desktop = tabs.map(function (t) { return link(t[0], t[1], t[2] && t[2] === page); }).join('') +
    '<div class="sn-forms"><a href="#" onclick="return false;" aria-haspopup="true"' + (onForms ? ' class="active"' : '') + '>Forms ▾</a>' +
    '<div class="sn-forms-menu">' + forms.map(function (f) { return link(f[0], f[1], f[1] === page); }).join('') + '</div></div>' +
    '<a href="index.html#app" class="sn-cta">Get the App</a>';
  var mobile = tabs.map(function (t) { return link(t[0], t[1], t[2] && t[2] === page); }).join('') +
    '<details' + (onForms ? ' open' : '') + '><summary>Forms</summary>' + forms.map(function (f) { return link(f[0], f[1], f[1] === page); }).join('') + '</details>' +
    '<a href="index.html#app">Get the App</a>' +
    (showPrint ? '<a href="#" class="sn-print-item" onclick="window.print();return false;">Print / Save PDF</a>' : '') + '<div class="sn-div"></div>' +
    '<a class="sn-admin" href="https://portal.saintroseanthem.org" target="_blank" rel="noopener">Admin Portal</a>' +
    '<a class="sn-admin" href="https://portal.saintroseanthem.org/finance.html" target="_blank" rel="noopener">Finance Portal</a>';
  var printBtn = showPrint ? '<button type="button" class="sn-print" onclick="window.print()">Print / Save PDF</button>' : '';

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
  var html = '<header id="site-nav"' + (showPrint ? ' class="sn-has-print"' : '') + '><a class="sn-brand" href="index.html">SAINT ROSE PHILIPPINE DUCHESNE<span>ANTHEM · ARIZONA</span></a>' +
    '<div class="sn-right"><div class="sn-links">' + desktop + '</div>' + printBtn +
    '<button type="button" class="sn-ham" id="sn-ham" aria-label="Menu"><span></span><span></span><span></span></button></div></header>' +
    '<div id="sn-mobile">' + mobile + '</div>';
  script.insertAdjacentHTML('beforebegin', html);

  var ham = document.getElementById('sn-ham'), menu = document.getElementById('sn-mobile');
  ham.addEventListener('click', function () { menu.classList.toggle('open'); ham.classList.toggle('open'); });
  document.addEventListener('click', function (e) {
    if (menu.classList.contains('open') && !menu.contains(e.target) && !ham.contains(e.target)) {
      menu.classList.remove('open'); ham.classList.remove('open');
    }
  });
})();
