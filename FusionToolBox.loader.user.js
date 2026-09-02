// ==UserScript==
// @name         FusionToolBox Loader
// @namespace    https://github.com/licoba/Monkey
// @version      0.1.5
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
// @match        https://finance.sina.com.cn/*
// @match        https://v2ex.com/*
// @match        https://www.nodeseek.com/*
// @match        https://www.tampermonkey.net/scripts.php*
// @match        https://mail.chatgpt.org.uk/*
// @match        https://chatgpt.com/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @connect      127.0.0.1
// ==/UserScript==

(function () {
  'use strict';

  const baseUrl = 'http://127.0.0.1:8123';
  const headTarget = document.head || document.documentElement;
  const criticalStyles = [
    {
      match: () =>
        location.hostname === 'www.tampermonkey.net' &&
        location.pathname === '/scripts.php',
      css: `
        .row:has(> .col-12 > .searcad.incontent),
        .searcad,
        ins.adsbygoogle,
        iframe[id^="aswift_"],
        iframe[id^="google_ads_iframe_"],
        iframe[src*="googleads.g.doubleclick.net"],
        [id^="aswift_"][id$="_host"] {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
          width: 0 !important;
          height: 0 !important;
          min-height: 0 !important;
          max-height: 0 !important;
        }

        body.scripts {
          padding-bottom: 0 !important;
        }
      `,
    },
    {
      match: () => location.hostname === 'www.nodeseek.com',
      css: `
        body {
          background-color: var(--bg-main-color) !important;
          background-image: none !important;
        }

        .post-list-item > a:has(> img.avatar-normal) {
          display: none !important;
        }

        .post-list-item > .post-list-content {
          margin-left: 0 !important;
        }

        .user-head > a:has(> img.avatar-normal) {
          display: none !important;
        }

        .nsk-panel > h4:has(+ .nsk-new-member-board),
        .nsk-new-member-board {
          display: none !important;
        }
      `,
    },
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
    {
      match: () => location.hostname === 'finance.sina.com.cn',
      css: `
        ins.sinaads,
        [data-ad-pdps],
        [data-ad-client],
        [data-ad-slot],
        #sinaads-script,
        #left_hzh_ad,
        #last_ad_wrap,
        #last_side_ad,
        #PublicRelation2,
        #PublicRelation3,
        #PublicRelation6,
        #PublicRelation8,
        #left_focus_ad,
        #pl_sideAd,
        #pradc1,
        #pradc2,
        #pradc3,
        #pradc4,
        #pradc5,
        #pradc6,
        #pradc7,
        #pradc8,
        #pradc9,
        #pradc10,
        #pradc11,
        .tb-left.auto_switch,
        .cj-r-qr,
        .blk-zcapp,
        .blk-wxfollow,
        .tab_related_app_imglink,
        .tab_related_app_imglink1,
        .page-right-bar .zc-app-btn,
        .tool-icon .fapp,
        .side-btns-answer2022,
        #heimaogif,
        #tab_related,
        .blk-related,
        .page-right-bar .btn-home,
        .page-right-bar .btn-audio,
        .page-right-bar .btn-related,
        [data-sudaclick="right_discovery_p"],
        [data-sudaclick="right_scientist_p"],
        [data-sudaclick="right_apple_p"],
        [data-sudaclick="right_zhongce_p"],
        [data-sudaclick="right_zt_p"],
        [data-sudaclick="right_weibo_p"],
        .top-ad,
        .right-side-ad,
        .ad.high-ad,
        div.ad[id^="pradc"],
        script[src*="/sinaads/"],
        script[src*="/litong/zhitou/"],
        script[src*="/d1images/button/rotator.js"],
        script[src*="/finance/blackcat/pc/bcat.js"],
        script[src*="pluto.sina.cn/gk/match"],
        script[id="ttzz"],
        script[src*="bytegoofy.com/goofy/ttzz/push.js"] {
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
      match: () => location.hostname === 'v2ex.com' || location.hostname === 'www.v2ex.com',
      css: `
        #Rightbar .box:has(a[href*="statistics.wlai.vip"]),
        #Rightbar .box:has(a[href*="wlai.vip"]),
        #Rightbar .box:has(a[href*="/ads/"]),
        #Rightbar .box:has(a[href*="utm_source=v2ex"]),
        #Rightbar .box:has(img[src*="ads"]),
        #Rightbar .box:has(img[src*="ad"]) {
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
      match: () => location.hostname === 'mail.chatgpt.org.uk',
      css: `
        ins.adsbygoogle,
        iframe[id^="google_ads_iframe"],
        iframe[src*="googlesyndication"],
        iframe[src*="doubleclick"],
        [id^="google_ads_iframe"],
        [class*="adsbygoogle"],
        [data-ad-client],
        [data-ad-slot],
        .affiliate-banner,
        script[src*="pagead2.googlesyndication.com"],
        script[src*="googlesyndication.com"],
        script[src*="doubleclick.net"] {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
          min-height: 0 !important;
          max-height: 0 !important;
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

  function requestLocalText(path, onLoad) {
    GM_xmlhttpRequest({
      method: 'GET',
      url: `${baseUrl}/${path}?t=${Date.now()}`,
      timeout: 5000,
      onload(response) {
        if (response.status < 200 || response.status >= 300) {
          console.error(`[FusionToolBox] Failed to load ${path}: HTTP ${response.status}`);
          return;
        }

        onLoad(response.responseText);
      },
      onerror() {
        console.error(`[FusionToolBox] Failed to load ${path}: request error`);
      },
      ontimeout() {
        console.error(`[FusionToolBox] Failed to load ${path}: request timeout`);
      },
    });
  }

  function loadRuntime() {
    requestLocalText('FusionToolBox.runtime.js', (source) => {
      const blob = new Blob([source], { type: 'text/javascript' });
      const runtimeUrl = URL.createObjectURL(blob);
      const script = document.createElement('script');

      script.src = runtimeUrl;
      script.async = false;
      script.onload = () => {
        URL.revokeObjectURL(runtimeUrl);
        script.remove();
      };
      script.onerror = () => {
        URL.revokeObjectURL(runtimeUrl);
        script.remove();
        console.error('[FusionToolBox] Failed to execute Blob runtime');
      };
      headTarget.appendChild(script);
    });
  }

  function watchRevision() {
    let currentRevision = null;
    let requestInFlight = false;

    const checkRevision = () => {
      if (requestInFlight) {
        return;
      }

      requestInFlight = true;
      GM_xmlhttpRequest({
        method: 'GET',
        url: `${baseUrl}/revision?t=${Date.now()}`,
        timeout: 5000,
        onload(response) {
          requestInFlight = false;

          if (response.status < 200 || response.status >= 300) {
            return;
          }

          const nextRevision = response.responseText.trim();

          if (currentRevision === null) {
            currentRevision = nextRevision;
            return;
          }

          if (nextRevision && nextRevision !== currentRevision) {
            location.reload();
          }
        },
        onerror() {
          requestInFlight = false;
        },
        ontimeout() {
          requestInFlight = false;
        },
      });
    };

    checkRevision();
    setInterval(checkRevision, 1000);
  }

  injectCriticalStyles();
  loadRuntime();
  watchRevision();
})();
