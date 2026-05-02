// ==UserScript==
// @name         FusionToolBox Loader
// @namespace    https://github.com/licoba/Monkey
// @version      0.1.1
// @description  Dev loader for local userscript development.
// @author       Codex
// @match        https://tempmail.plus/*
// @match        https://2925.com/*
// @match        https://www.linshiyouxiang.net/*
// @match        https://www.meiguodizhi.com/*
// @match        https://greasyfork.org/*
// @match        https://www.toolhelper.cn/*
// @match        https://www.json.cn/*
// @match        https://ip.sb/*
// @match        https://www.ip.sb/*
// @match        https://linux.do/*
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
      match: () => location.hostname === '2925.com',
      css: `
        .adv-container,
        .left-adv,
        .index-adv {
          display: none !important;
        }
      `,
    },
    {
      match: () => location.hostname === 'www.linshiyouxiang.net',
      css: `
        ins.adsbygoogle,
        iframe[id^="google_ads_iframe"],
        iframe[src*="googlesyndication"],
        iframe[src*="doubleclick"],
        [id^="google_ads_iframe"],
        [class*="adsbygoogle"],
        .px-2.text-center,
        .d-none.d-lg-block.col-md-3.no-padding.text-center,
        [data-ad-client],
        [data-ad-slot] {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
          min-height: 0 !important;
          max-height: 0 !important;
        }
      `,
    },
    {
      match: () => location.hostname === 'greasyfork.org',
      css: `
        ins.adsbygoogle,
        iframe[id^="google_ads_iframe"],
        iframe[src*="googlesyndication"],
        iframe[src*="doubleclick"],
        [id^="google_ads_iframe"],
        [class*="adsbygoogle"],
        [class*="ad-container"],
        [class*="ad-slot"],
        [class*="advert"],
        [data-ad-client],
        [data-ad-slot] {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
        }
      `,
    },
    {
      match: () => location.hostname === 'www.toolhelper.cn' && location.pathname === '/JSON/JSONFormat',
      css: `
        #divAd,
        #divAd *,
        ins.adsbygoogle,
        script[src*="pagead2.googlesyndication.com"],
        [data-ad-client],
        [data-ad-slot] {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
          min-height: 0 !important;
          max-height: 0 !important;
        }
      `,
    },
    {
      match: () => location.hostname === 'www.json.cn',
      css: `
        .show-hide-adv,
        .show-hide-adv *,
        .wwads-cn,
        .wwads-sticky,
        .wwads-sticky *,
        .wwads-horizontal,
        .wwads-vertical,
        [class*="wwads"],
        [class*="wwads"][class*="sticky"],
        script[src*="cdn.wwads.cn/js/makemoney.js"],
        script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"],
        script[src*="/d/dt/"],
        iframe[src*="wwads"],
        iframe[src*="googlesyndication"],
        iframe[src*="doubleclick"] {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
          min-height: 0 !important;
          max-height: 0 !important;
        }
      `,
    },
    {
      match: () => location.hostname === 'ip.sb' || location.hostname === 'www.ip.sb',
      css: `
        ins.adsbygoogle,
        iframe[id^="google_ads_iframe"],
        iframe[src*="googlesyndication"],
        iframe[src*="doubleclick"],
        [id^="google_ads_iframe"],
        [class*="adsbygoogle"],
        [data-ad-client],
        [data-ad-slot],
        a[href*="sa.net"],
        a[href*="riven.cloud"],
        a[href*="crmeb"],
        a[href*="duomall"] {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
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
  injectScript(`${baseUrl}/FusionToolBox.runtime.js`);
  injectScript(`${baseUrl}/dev-client.js`);
})();
