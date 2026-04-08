// ==UserScript==
// @name         FusionToolBox Loader
// @namespace    local.fusion.toolbox
// @version      0.1.1
// @description  Dev loader for local userscript development.
// @author       Codex
// @match        https://tempmail.plus/*
// @match        https://2925.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const baseUrl = 'http://127.0.0.1:8123';
  const headTarget = document.head || document.documentElement;
  const criticalStyles = [
    {
      match: () => location.hostname === 'tempmail.plus',
      css: `
        #email > .title,
        header .d-flex.flex-row.align-items-center > .d-none.d-md-block,
        header .link,
        #email .row > .col p.text-left.text-white,
        #ads-del2,
        #ads-del4,
        #ads-del5,
        .ad-banners,
        .ad-banners a,
        .main [id*="ads-del"],
        [id^="ads-del"],
        [id*="ads-del"],
        [class*="ad-banner"],
        [class*="ads-banner"],
        iframe[src*="googlesyndication"],
        iframe[src*="doubleclick"],
        iframe[id*="google_ads"] {
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
        }
        .info.mb-50.mb-xl-70 {
          display: none !important;
        }
      `,
    },
    {
      match: () =>
        location.hostname === '2925.com' &&
        location.hash.startsWith('#/mailList'),
      css: `
        .left-adv {
          display: none !important;
        }
      `,
    },
  ];

  function injectCriticalStyles() {
    for (const item of criticalStyles) {
      if (!item.match()) {
        continue;
      }

      const style = document.createElement('style');
      style.textContent = item.css;
      headTarget.appendChild(style);
    }
  }

  function injectScript(src) {
    const script = document.createElement('script');
    script.src = `${src}?t=${Date.now()}`;
    script.async = false;
    headTarget.appendChild(script);
  }

  injectCriticalStyles();
  injectScript(`${baseUrl}/toolbox-runtime.js`);
  injectScript(`${baseUrl}/dev-client.js`);
})();
