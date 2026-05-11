// ==UserScript==
// @name         FusionToolBox
// @name:zh-CN   FusionToolBox 聚合工具箱
// @namespace    https://github.com/licoba/Monkey
// @version      0.1.25
// @description  Personal FusionToolBox userscript with per-site modules.
// @description:zh-CN  带有按站点模块的个人 FusionToolBox 用户脚本。
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
// @run-at       document-start
// @grant        none
// @license      MIT
// ==/UserScript==

// Built from FusionToolBox.runtime.js via build.py.
(function () {
  'use strict';

  const FUSION_TOOLBOX_VERSION = '0.1.25';

  const Utils = {
    addStyle(id, cssText) {
      if (document.getElementById(id)) {
        return;
      }

      const style = document.createElement('style');
      style.id = id;
      style.textContent = cssText;
      (document.head || document.documentElement).appendChild(style);
    },

    hideSelectors(selectors, root = document) {
      for (const selector of selectors) {
        for (const node of root.querySelectorAll(selector)) {
          node.style.setProperty('visibility', 'hidden', 'important');
          node.style.setProperty('opacity', '0', 'important');
          node.style.setProperty('pointer-events', 'none', 'important');
        }
      }
    },

    removeSelectors(selectors, root = document) {
      for (const selector of selectors) {
        for (const node of root.querySelectorAll(selector)) {
          node.style.setProperty('display', 'none', 'important');
        }
      }
    },

    observeAddedNodes(callback) {
      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          for (const node of mutation.addedNodes) {
            if (node instanceof Element) {
              callback(node);
            }
          }
        }
      });

      observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
      });

      return observer;
    },

    onReady(callback) {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback, { once: true });
      } else {
        callback();
      }
    },
  };

  const modules = [
{
  name: '2925.com-hide-ads',
  match() {
    return location.hostname === '2925.com';
  },
  run() {
    const styleId = 'fusion-toolbox-2925-hide-ads';
    const removeSelectors = [
      '.adv-container',
      '.left-adv',
      '.index-adv',
    ];

    Utils.addStyle(
      styleId,
      `${removeSelectors.join(',\n')} {
        display: none !important;
      }`
    );

    const hide = (root = document) => {
      Utils.removeSelectors(removeSelectors, root);
    };

    Utils.onReady(() => {
      hide();

      Utils.observeAddedNodes((node) => {
        if (node.matches?.(removeSelectors.join(','))) {
          hide(node.parentElement || document);
          return;
        }

        hide(node);
      });
    });
  },
},
{
  name: 'finance.sina.com.cn-hide-ads',
  match() {
    return location.hostname === 'finance.sina.com.cn';
  },
  run() {
    const styleId = 'fusion-toolbox-finance-sina-hide-ads';
    const removeSelectors = [
      'ins.sinaads',
      '[data-ad-pdps]',
      '[data-ad-client]',
      '[data-ad-slot]',
      '#sinaads-script',
      '#left_hzh_ad',
      '#last_ad_wrap',
      '#last_side_ad',
      '#PublicRelation2',
      '#PublicRelation3',
      '#PublicRelation6',
      '#PublicRelation8',
      '#left_focus_ad',
      '#pl_sideAd',
      '#pradc1',
      '#pradc2',
      '#pradc3',
      '#pradc4',
      '#pradc5',
      '#pradc6',
      '#pradc7',
      '#pradc8',
      '#pradc9',
      '#pradc10',
      '#pradc11',
      '.tb-left.auto_switch',
      '.cj-r-qr',
      '.blk-zcapp',
      '.blk-wxfollow',
      '.tab_related_app_imglink',
      '.tab_related_app_imglink1',
      '.page-right-bar .zc-app-btn',
      '.tool-icon .fapp',
      '.side-btns-answer2022',
      '#heimaogif',
      '#tab_related',
      '.blk-related',
      '.page-right-bar .btn-home',
      '.page-right-bar .btn-audio',
      '.page-right-bar .btn-related',
      '[data-sudaclick="right_discovery_p"]',
      '[data-sudaclick="right_scientist_p"]',
      '[data-sudaclick="right_apple_p"]',
      '[data-sudaclick="right_zhongce_p"]',
      '[data-sudaclick="right_zt_p"]',
      '[data-sudaclick="right_weibo_p"]',
      '.top-ad',
      '.right-side-ad',
      '.ad.high-ad',
      'div.ad[id^="pradc"]',
      'script[src*="/sinaads/"]',
      'script[src*="/litong/zhitou/"]',
      'script[src*="/d1images/button/rotator.js"]',
      'script[src*="/finance/blackcat/pc/bcat.js"]',
      'script[src*="pluto.sina.cn/gk/match"]',
      'script[id="ttzz"]',
      'script[src*="bytegoofy.com/goofy/ttzz/push.js"]',
    ];

    const selectorText = removeSelectors.join(',\n');

    const disableSinaAdsQueue = () => {
      const sink = {
        push() {
          return 0;
        },
      };

      try {
        window.sinaads = sink;
      } catch (error) {
        // Ignore pages that make the property non-writable.
      }
    };

    const hideEmptyAdParent = (node) => {
      if (!(node instanceof Element)) {
        return;
      }

      const parent = node.parentElement;

      if (!parent || parent === document.body || parent === document.documentElement) {
        return;
      }

      if (
        parent.matches?.('.top-ad, .right-side-ad, .ad, [id*="ad"], [id*="Ad"]') &&
        !parent.textContent.trim()
      ) {
        parent.style.setProperty('display', 'none', 'important');
      }
    };

    const hideElement = (node) => {
      node.style.setProperty('display', 'none', 'important');
      node.style.setProperty('visibility', 'hidden', 'important');
      node.style.setProperty('opacity', '0', 'important');
      node.style.setProperty('pointer-events', 'none', 'important');
      node.style.setProperty('min-height', '0', 'important');
      node.style.setProperty('max-height', '0', 'important');
    };

    const getPromotionalContainer = (node) => {
      let current = node;
      let fallback = node;

      while (current && current !== document.body && current !== document.documentElement) {
        if (
          current.matches?.(
            [
              '.tb-left',
              '.auto_switch',
              '.cj-r-qr',
              '.blk-zcapp',
              '.blk-wxfollow',
              '.tab_related_app_imglink',
              '.page-right-bar .zc-app-btn',
              '.right-bar-btn',
              '.ad',
              '[id*="ad"]',
              '[id*="Ad"]',
            ].join(',')
          )
        ) {
          return current;
        }

        const rect = current.getBoundingClientRect();
        const isFloatingPromo =
          getComputedStyle(current).position === 'fixed' &&
          rect.width >= 80 &&
          rect.height >= 80;
        const isBannerLike = rect.width >= 500 && rect.height >= 60 && rect.top < 260;

        fallback = current;

        if (isFloatingPromo || isBannerLike) {
          return current;
        }

        current = current.parentElement;
      }

      return fallback;
    };

    const hide = (root = document) => {
      const targetRoot = root instanceof Document ? root : root.ownerDocument || document;

      for (const node of targetRoot.querySelectorAll(selectorText)) {
        hideEmptyAdParent(node);
        hideElement(node);
      }
    };

    disableSinaAdsQueue();
    Utils.addStyle(
      styleId,
      `${selectorText} {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
        min-height: 0 !important;
        max-height: 0 !important;
      }`
    );

    Utils.onReady(() => {
      disableSinaAdsQueue();
      hide();

      Utils.observeAddedNodes((node) => {
        disableSinaAdsQueue();

        if (node.matches?.(selectorText)) {
          hideEmptyAdParent(node);
          hideElement(node);
          return;
        }

        hide(node);
      });
    });
  },
},
{
  name: 'greasyfork.org-hide-bottom-ads',
  match() {
    return location.hostname === 'greasyfork.org';
  },
  run() {
    const styleId = 'fusion-toolbox-greasyfork-hide-bottom-ads';
    const hideSelectors = [
      'ins.adsbygoogle',
      'iframe[id^="google_ads_iframe"]',
      'iframe[src*="googlesyndication"]',
      'iframe[src*="doubleclick"]',
      '[id^="google_ads_iframe"]',
      '[class*="adsbygoogle"]',
    ];
    const removeSelectors = [
      '[class*="ad-container"]',
      '[class*="ad-slot"]',
      '[class*="advert"]',
      '[data-ad-client]',
      '[data-ad-slot]',
    ];

    Utils.addStyle(
      styleId,
      `${hideSelectors.join(',\n')} {
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
        min-height: 0 !important;
        max-height: 0 !important;
      }
      ${removeSelectors.join(',\n')} {
        display: none !important;
      }`
    );

    const hide = (root = document) => {
      Utils.hideSelectors(hideSelectors, root);
      Utils.removeSelectors(removeSelectors, root);
    };

    Utils.onReady(() => {
      hide();

      Utils.observeAddedNodes((node) => {
        if (node.matches?.([...hideSelectors, ...removeSelectors].join(','))) {
          hide(node.parentElement || document);
          return;
        }

        hide(node);
      });
    });
  },
},
{
  name: 'ip.sb-hide-ads',
  match() {
    return location.hostname === 'ip.sb' || location.hostname === 'www.ip.sb';
  },
  run() {
    const styleId = 'fusion-toolbox-ip-sb-hide-ads';
    const hideSelectors = [
      'ins.adsbygoogle',
      'iframe[id^="google_ads_iframe"]',
      'iframe[src*="googlesyndication"]',
      'iframe[src*="doubleclick"]',
      '[id^="google_ads_iframe"]',
      '[class*="adsbygoogle"]',
    ];
    const removeSelectors = [
      '[data-ad-client]',
      '[data-ad-slot]',
      'a[href*="sa.net"]',
      'a[href*="riven.cloud"]',
      'a[href*="crmeb"]',
      'a[href*="duomall"]',
    ];
    const affiliateTextPattern = /Riven Cloud|极云网络|优惠码\s*IPSB|广告|多商户商城|B2B2C商家入驻|CRMEB|IPv6\s*地址查询/i;
    const contentTextPattern = /IPv4 connectivity|IPv6 connectivity|Address|Hostname|ASN Organization/i;
    const footerTextPattern = /Copyright|Terms of Use|Privacy Policy|All rights reserved/i;

    Utils.addStyle(
      styleId,
      `${hideSelectors.join(',\n')} {
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
        min-height: 0 !important;
        max-height: 0 !important;
      }
      ${removeSelectors.join(',\n')} {
        display: none !important;
      }`
    );

    const normalizeText = (value) => value.replace(/\s+/g, ' ').trim();

    const hideElement = (element) => {
      element.style.setProperty('display', 'none', 'important');
    };

    const findAffiliateBlock = (element) => {
      let current = element;
      let fallback = element;

      while (current && current !== document.body && current !== document.documentElement) {
        const text = normalizeText(current.textContent || '');

        if (affiliateTextPattern.test(text)) {
          if (!contentTextPattern.test(text) && text.length <= 320) {
            return current;
          }

          if (!contentTextPattern.test(text) && text.length <= 500) {
            fallback = current;
          }
        }

        current = current.parentElement;
      }

      return fallback;
    };

    const hideAffiliateClusterFromHeading = (heading) => {
      hideElement(heading);

      let sibling = heading.nextElementSibling;
      let hiddenCount = 0;

      while (sibling && hiddenCount < 4) {
        const text = normalizeText(sibling.textContent || '');

        if (contentTextPattern.test(text)) {
          break;
        }

        const next = sibling.nextElementSibling;
        hideElement(sibling);
        sibling = next;
        hiddenCount += 1;
      }
    };

    const removeAffiliateAds = (root = document) => {
      const scope = root instanceof Document ? root : root.ownerDocument || document;

      for (const link of root.querySelectorAll?.('a[href*="sa.net"], a[href*="riven.cloud"]') || []) {
        hideElement(findAffiliateBlock(link));
      }

      for (const link of root.querySelectorAll?.('a[href*="crmeb"], a[href*="duomall"]') || []) {
        hideElement(findAffiliateBlock(link));
      }

      for (const heading of scope.querySelectorAll('h1, h2, h3, h4, h5, h6, div, section, aside')) {
        const text = normalizeText(heading.textContent || '');

        if (!affiliateTextPattern.test(text)) {
          continue;
        }

        if (contentTextPattern.test(text) || footerTextPattern.test(text)) {
          continue;
        }

        const block = findAffiliateBlock(heading);
        hideElement(block);

        if (block === heading) {
          hideAffiliateClusterFromHeading(heading);
        }
      }
    };

    const removeBottomAdCards = () => {
      for (const element of document.querySelectorAll('body *')) {
        const text = normalizeText(element.textContent || '');

        if (!affiliateTextPattern.test(text) || contentTextPattern.test(text) || footerTextPattern.test(text)) {
          continue;
        }

        if (!element.querySelector('img') && !element.querySelector('svg') && text.length > 180) {
          continue;
        }

        const rect = element.getBoundingClientRect();

        if (rect.width < 180 || rect.height < 40 || rect.top < window.innerHeight * 0.45) {
          continue;
        }

        hideElement(element);
      }
    };

    const removeFloatingPromos = () => {
      for (const element of document.querySelectorAll('body *')) {
        const text = normalizeText(element.textContent || '');

        if (!affiliateTextPattern.test(text) || footerTextPattern.test(text)) {
          continue;
        }

        const style = window.getComputedStyle(element);

        if (style.position !== 'fixed' && style.position !== 'sticky') {
          continue;
        }

        const rect = element.getBoundingClientRect();

        if (rect.width < 120 || rect.height < 32 || rect.top < window.innerHeight * 0.35) {
          continue;
        }

        hideElement(element);
      }
    };

    const hide = (root = document) => {
      Utils.hideSelectors(hideSelectors, root);
      Utils.removeSelectors(removeSelectors, root);
      removeAffiliateAds(root);
      removeBottomAdCards();
      removeFloatingPromos();
    };

    Utils.onReady(() => {
      hide();

      Utils.observeAddedNodes((node) => {
        if (node.matches?.([...hideSelectors, ...removeSelectors].join(','))) {
          hide(node.parentElement || document);
          return;
        }

        hide(node);
      });
    });
  },
},
{
  name: 'json.cn-hide-all-ads',
  match() {
    return location.hostname === 'www.json.cn';
  },
  run() {
    const styleId = 'fusion-toolbox-jsoncn-hide-all-ads';
    const runtimeState = {
      intervalId: null,
    };
    const removeSelectors = [
      '.show-hide-adv',
      '.wwads-cn',
      '.wwads-sticky',
      '.wwads-horizontal',
      '.wwads-vertical',
      '[class*="wwads"]',
      '[class*="wwads"][class*="sticky"]',
      'script[src*="cdn.wwads.cn/js/makemoney.js"]',
      'script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]',
      'script[src*="/d/dt/"]',
      'iframe[src*="wwads"]',
      'iframe[src*="googlesyndication"]',
      'iframe[src*="doubleclick"]',
    ];

    Utils.addStyle(
      styleId,
      `${removeSelectors.join(',\n')} {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
        min-height: 0 !important;
        max-height: 0 !important;
      }`
    );

    const hideFloatingBottomAds = () => {
      for (const node of document.body?.querySelectorAll('*') || []) {
        if (!(node instanceof HTMLElement)) {
          continue;
        }

        const style = window.getComputedStyle(node);
        if (style.position !== 'fixed') {
          continue;
        }

        const rect = node.getBoundingClientRect();
        const nearBottom = rect.bottom >= window.innerHeight - 40;
        const wideEnough = rect.width >= Math.min(window.innerWidth * 0.45, 280);
        const tallEnough = rect.height >= 72;
        const elevated = style.zIndex !== 'auto' && Number(style.zIndex || 0) >= 1;
        const likelyHandle =
          rect.width >= 40 &&
          rect.width <= 140 &&
          rect.height >= 20 &&
          rect.height <= 80 &&
          rect.bottom <= window.innerHeight &&
          rect.top >= window.innerHeight - 180;

        if ((nearBottom && wideEnough && tallEnough) || likelyHandle) {
          node.style.setProperty('display', 'none', 'important');
          node.style.setProperty('visibility', 'hidden', 'important');
          node.style.setProperty('opacity', '0', 'important');
          if (elevated) {
            node.style.setProperty('pointer-events', 'none', 'important');
          }
        }
      }
    };

    const hide = (root = document) => {
      Utils.removeSelectors(removeSelectors, root);
      hideFloatingBottomAds();
    };

    Utils.onReady(() => {
      hide();
      runtimeState.intervalId = window.setInterval(hideFloatingBottomAds, 800);

      Utils.observeAddedNodes((node) => {
        if (node.matches?.(removeSelectors.join(','))) {
          hide(node.parentElement || document);
          return;
        }

        hide(node);
      });
    });
  },
},
{
  name: 'linshiyouxiang.net-hide-bottom-ads',
  match() {
    return location.hostname === 'www.linshiyouxiang.net';
  },
  run() {
    const styleId = 'fusion-toolbox-linshiyouxiang-hide-bottom-ads';
    const hideSelectors = [
      'ins.adsbygoogle',
      'iframe[id^="google_ads_iframe"]',
      'iframe[src*="googlesyndication"]',
      'iframe[src*="doubleclick"]',
      '[id^="google_ads_iframe"]',
      '[class*="adsbygoogle"]',
    ];
    const removeSelectors = [
      '.site-description',
      '.px-2.text-center',
      '.d-none.d-lg-block.col-md-3.no-padding.text-center',
      '[data-ad-client]',
      '[data-ad-slot]',
    ];
    const floatingPromoSelectors = [
      '[style*="position:fixed"][style*="bottom"][style*="right"]',
      '[style*="position: fixed"][style*="bottom"][style*="right"]',
      '[style*="position:fixed"][style*="bottom"]',
      '[style*="position: fixed"][style*="bottom"]',
    ];

    const shouldRemoveFloatingPromo = (node) => {
      if (!(node instanceof Element)) {
        return false;
      }

      const inlineStyle = (node.getAttribute('style') || '').toLowerCase();
      const computedStyle = window.getComputedStyle(node);
      const position = (computedStyle.position || '').toLowerCase();
      if (
        position !== 'fixed' &&
        !inlineStyle.includes('position:fixed') &&
        !inlineStyle.includes('position: fixed')
      ) {
        return false;
      }

      const hasBottomAnchor =
        inlineStyle.includes('bottom') ||
        (computedStyle.bottom && computedStyle.bottom !== 'auto');
      if (!hasBottomAnchor) {
        return false;
      }

      const text = (node.textContent || '').replace(/\s+/g, ' ').trim().toLowerCase();
      if (!text) {
        return false;
      }

      return (
        (text.includes('电子邮件') && text.includes('即时消息')) ||
        (text.includes('email') && text.includes('message')) ||
        text.includes('数据恢复服务')
      );
    };

    Utils.addStyle(
      styleId,
      `:root {
        color-scheme: dark;
      }
      html,
      body {
        background: #0b1220 !important;
        color: #dbe4ee !important;
      }
      body,
      #top,
      #main,
      #foot,
      .container,
      .row,
      .msglist,
      .mail,
      .mail-info,
      .mail-content,
      .history-list,
      .modal-content,
      .dropdown-menu,
      .table-responsive,
      .input-group-addon,
      .form-control,
      .btn-default {
        background-color: #111827 !important;
        color: #dbe4ee !important;
        border-color: #334155 !important;
        box-shadow: none !important;
      }
      #top,
      #foot,
      .mail-info,
      .table thead th,
      .modal-header,
      .modal-footer {
        background: #0f172a !important;
        color: #e5edf6 !important;
        border-color: #334155 !important;
      }
      #main .msglist,
      #main .history-list,
      .content .mail-info,
      .content .mail-content,
      .table-responsive {
        background: #111827 !important;
        border: 1px solid #334155 !important;
      }
      #main .table-striped > tbody > tr:nth-of-type(2n),
      .table-striped > tbody > tr:nth-of-type(2n),
      .table-hover > tbody > tr:hover,
      .dropdown-menu > li > a:hover,
      .dropdown-item:hover {
        background: #172033 !important;
        color: #f8fafc !important;
      }
      #main .table-striped > tbody > tr:nth-of-type(2n+1),
      .table-striped > tbody > tr:nth-of-type(2n+1),
      table.table tbody tr,
      table.table tbody td {
        background: #111827 !important;
        color: #dbe4ee !important;
        border-color: #243041 !important;
      }
      a,
      .dropdown-menu > li > a,
      .dropdown-item,
      .state li a,
      #message-list a,
      .content .mail-top ul li a {
        color: #7dd3fc !important;
      }
      a:hover,
      .dropdown-menu > li > a:hover,
      .dropdown-item:hover,
      .state li a:hover,
      #message-list a:hover,
      .content .mail-top ul li a:hover {
        color: #f59e0b !important;
      }
      .text-muted,
      .description,
      .receiveTime,
      .tooltip-inner,
      .msglist form label,
      input::placeholder {
        color: #94a3b8 !important;
      }
      #no-emails-row,
      #loading-row,
      #gmail-loading-row,
      #no-emails-row td,
      #loading-row td,
      #gmail-loading-row td,
      #no-emails-text,
      #check-tip,
      #check-tip-text,
      .text-black-50,
      .bg-white {
        background: #111827 !important;
        color: #cbd5e1 !important;
        border-color: #243041 !important;
      }
      #top .active-mail .input-group input,
      #active-mail,
      input,
      textarea,
      select {
        background: #0f172a !important;
        color: #e5edf6 !important;
        border-color: #334155 !important;
      }
      .input-group-addon,
      .btn.dropdown-toggle,
      .btn-default,
      button,
      .modal-content .btn {
        background: #1e293b !important;
        color: #e5edf6 !important;
        border-color: #475569 !important;
      }
      .left-side li,
      #main .left-side li a {
        background: #1b3146 !important;
        border-color: #24364d !important;
        color: #d8e4f0 !important;
      }
      #main .left-side li a:hover {
        background: #223a52 !important;
        color: #f8fafc !important;
      }
      .badge,
      .open,
      .btn.btn-orange.active,
      .btn.btn-orange:active,
      .btn.btn-orange:focus,
      .btn.btn-orange:hover {
        background: #0ea5e9 !important;
        color: #eff6ff !important;
        border-color: #0284c7 !important;
      }
      .btn.btn-orange,
      .btn.btn-orange .fa {
        color: #7dd3fc !important;
        border-color: #0369a1 !important;
        background: #082f49 !important;
      }
      .tooltip.bottom .tooltip-arrow {
        border-bottom-color: #1e293b !important;
      }
      .tooltip.bs-tooltip-right .tooltip-inner,
      #top .active-mail .tooltip-inner {
        background: #1e293b !important;
        color: #e5edf6 !important;
      }
      ${hideSelectors.join(',\n')} {
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
        min-height: 0 !important;
        max-height: 0 !important;
      }
      ${removeSelectors.join(',\n')} {
        display: none !important;
      }`
    );

    const hide = (root = document) => {
      Utils.hideSelectors(hideSelectors, root);
      Utils.removeSelectors(removeSelectors, root);

      const candidates = [];
      if (root instanceof Element) {
        candidates.push(root);
      }
      for (const selector of floatingPromoSelectors) {
        candidates.push(...root.querySelectorAll(selector));
      }
      candidates.push(...document.body.querySelectorAll('div, section, aside, a, button'));
      for (const node of candidates) {
        if (shouldRemoveFloatingPromo(node)) {
          node.style.setProperty('display', 'none', 'important');
        }
      }
    };

    Utils.onReady(() => {
      hide();

      Utils.observeAddedNodes((node) => {
        if (node.matches?.([...hideSelectors, ...removeSelectors].join(','))) {
          hide(node.parentElement || document);
          return;
        }

        hide(node);
      });
    });
  },
},
{
  name: 'linux.do-hide-community-slogan-banner',
  match() {
    return location.hostname === 'linux.do';
  },
  run() {
    const bannerTextPattern = /真诚[、,，]\s*友善[、,，]\s*团结[、,，]\s*专业[，,]\s*共建你我引以为荣之社区[。!！]?|Where possible begins/i;
    const candidateSelectors = [
      '#banner',
      '.banner-box',
      '.custom-header-banner',
      '.custom-homepage-banner',
      '.global-notice',
      '.top-notice',
      '.alert.alert-info',
    ];

    const normalizeText = (value) => value.replace(/\s+/g, ' ').trim();

    const hideElement = (element) => {
      element.style.setProperty('display', 'none', 'important');
      element.style.setProperty('visibility', 'hidden', 'important');
      element.style.setProperty('opacity', '0', 'important');
      element.style.setProperty('pointer-events', 'none', 'important');
      element.style.setProperty('min-height', '0', 'important');
      element.style.setProperty('max-height', '0', 'important');
    };

    const isNearTop = (element) => {
      const rect = element.getBoundingClientRect();
      return rect.top >= 0 && rect.top < Math.max(window.innerHeight * 0.3, 220);
    };

    const findSloganContainer = (element) => {
      let current = element;
      let fallback = element;

      while (current && current !== document.body && current !== document.documentElement) {
        const text = normalizeText(current.textContent || '');

        if (bannerTextPattern.test(text)) {
          fallback = current;

          if (text.length <= 180 && isNearTop(current)) {
            return current;
          }
        }

        current = current.parentElement;
      }

      return fallback;
    };

    const hideSloganBanner = (root = document) => {
      const scope = root instanceof Document ? root : root.ownerDocument || document;

      for (const candidate of scope.querySelectorAll(candidateSelectors.join(','))) {
        const text = normalizeText(candidate.textContent || '');

        if (bannerTextPattern.test(text) && isNearTop(candidate)) {
          hideElement(candidate);
        }
      }

      const walker = scope.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let textNode = walker.nextNode();

      while (textNode) {
        const text = normalizeText(textNode.nodeValue || '');
        const parent = textNode.parentElement;

        if (!parent || !bannerTextPattern.test(text) || !isNearTop(parent)) {
          textNode = walker.nextNode();
          continue;
        }

        hideElement(findSloganContainer(parent));
        textNode = walker.nextNode();
      }
    };

    Utils.onReady(() => {
      hideSloganBanner();

      Utils.observeAddedNodes((node) => {
        hideSloganBanner(node);
      });
    });
  },
},
{
  name: 'meiguodizhi.com-hide-right-ad-iframe',
  match() {
    return location.hostname === 'www.meiguodizhi.com';
  },
  run() {
    const styleId = 'fusion-toolbox-meiguodizhi-theme-and-hide-right-ad-iframe';

    Utils.addStyle(
      styleId,
      `:root {
        color-scheme: dark;
      }
      body,
      .content,
      .detail,
      .indexpage,
      .item,
      .container,
      .container-fluid,
      .panel,
      .panel-body,
      .panel-default,
      .panel-primary,
      .panel-info,
      .well,
      .breadcrumb,
      .list-group-item,
      .table,
      .table-responsive,
      .table-striped > tbody > tr:nth-of-type(odd),
      .table-striped > tbody > tr:nth-of-type(even),
      .table-hover > tbody > tr:hover,
      .form-control,
      .input-group-addon,
      .navbar,
      .navbar-default,
      .dropdown-menu,
      .modal-content,
      .pagination > li > a,
      .pagination > li > span,
      .jumbotron,
      footer {
        background: #111827 !important;
        color: #e5e7eb !important;
        border-color: #374151 !important;
      }
      html,
      body {
        background: #0b1220 !important;
        color: #e5e7eb !important;
      }
      .content {
        background: #111827 !important;
        border: 1px solid #334155 !important;
        box-shadow: none !important;
      }
      .navbar.navbar-default,
      #nav-top-1,
      #nav-top-1 .i-m-n,
      #nav-top-1 .item,
      .navbar-header.sign-2,
      .visible-xs.sign {
        background: #111827 !important;
        border-color: #334155 !important;
        background-image: none !important;
        box-shadow: none !important;
      }
      #nav-top-1 .item {
        border-bottom: 1px solid #243041 !important;
      }
      #nav-top-1 .item a,
      .navbar-header.sign-2 a,
      .visible-xs.sign a {
        color: #e5e7eb !important;
      }
      .navbar-default .navbar-toggle {
        border-color: #475569 !important;
        background: #0f172a !important;
      }
      .navbar-default .navbar-toggle .icon-bar {
        background-color: #e5e7eb !important;
      }
      .detail,
      .indexpage,
      .item,
      .item .right,
      .row.item,
      .row.detail {
        background: transparent !important;
        color: #e5e7eb !important;
        border-color: #334155 !important;
      }
      .c-te,
      .c-te tr,
      .c-te td,
      .table.c-te,
      .table.c-te > tbody > tr > td,
      .table.c-te > tbody > tr > th {
        background: transparent !important;
        color: #e5e7eb !important;
        border-color: #334155 !important;
      }
      .boder-none,
      input.boder-none {
        background: transparent !important;
        color: #e5e7eb !important;
        border: none !important;
        box-shadow: none !important;
      }
      #city {
        background: #0f172a !important;
        color: #e5e7eb !important;
        border: 1px solid #475569 !important;
      }
      h1, h2, h3, h4, h5, h6,
      p, span, div, li, dt, dd, td, th, label, strong, small,
      a:not(.btn) {
        color: #e5e7eb !important;
      }
      a,
      .breadcrumb > li + li:before,
      .list-group-item a,
      .panel-title,
      .nav > li > a,
      .navbar-brand {
        color: #7dd3fc !important;
      }
      .panel-heading,
      .navbar,
      .navbar-default,
      .btn-success,
      .btn-primary,
      .label,
      .badge,
      [class*="header"] {
        background: #1f6feb !important;
        color: #f8fafc !important;
        border-color: #2563eb !important;
      }
      p.title,
      .title {
        background: #172033 !important;
        color: #e5e7eb !important;
        border-left: 3px solid #38bdf8 !important;
        border-bottom: 1px solid #334155 !important;
      }
      p.title b,
      .title b {
        color: #f8fafc !important;
      }
      .btn,
      button,
      input,
      select,
      textarea {
        background: #0f172a !important;
        color: #e5e7eb !important;
        border-color: #475569 !important;
      }
      input::placeholder,
      textarea::placeholder {
        color: #94a3b8 !important;
      }
      hr,
      .table > thead > tr > th,
      .table > tbody > tr > td,
      .table > tbody > tr > th,
      .list-group-item,
      .breadcrumb,
      .panel,
      .panel-heading,
      .panel-footer {
        border-color: #334155 !important;
      }
      .row,
      .col-md-12,
      .col-sm-12,
      .col-xs-12,
      .page-header,
      .page-header h1,
      .page-header h2,
      .page-header h3,
      .country-list,
      .country-list a,
      .links,
      .links a,
      #all-c,
      #all-c ul,
      #all-c li,
      .tag,
      .tags,
      .friend-link,
      .friend-links,
      .link-list,
      .city-list,
      .area-list,
      .bottom-links,
      .bottom-nav,
      .site-links,
      .site-map,
      .address-links,
      .panel:last-of-type,
      .panel-body:last-of-type,
      .container > .row:last-of-type,
      .container-fluid > .row:last-of-type,
      [class*="country"],
      [class*="footer-links"],
      [class*="all-country"],
      [class*="all-country"] a,
      [class*="area-list"],
      [class*="area-list"] a {
        background: #111827 !important;
        color: #cbd5e1 !important;
        border-color: #334155 !important;
      }
      #all-c {
        background: #111827 !important;
        border-top: 1px solid #334155 !important;
      }
      #all-c .all-c-t,
      #all-c p,
      #all-c a {
        color: #e5e7eb !important;
      }
      #all-c .all-c-t {
        background: #111827 !important;
        color: #e5e7eb !important;
        border-bottom: 1px solid #334155 !important;
      }
      #all-c a:hover {
        color: #7dd3fc !important;
      }
      h2.text-center,
      h3.text-center,
      h4.text-center,
      .text-center {
        color: #e5e7eb !important;
      }
      #all-c + * {
        display: none !important;
      }
      footer,
      .footer,
      #footer,
      .copyright,
      [class*="copyright"],
      [class*="beian"],
      [class*="备案"] {
        display: none !important;
      }
      iframe[style*="position: fixed"][style*="z-index: 2147483647"][style*="max-width: 420px"][style*="height: 190px"] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
      }`
    );

    function isTargetAdFrame(node) {
      if (!(node instanceof HTMLIFrameElement)) {
        return false;
      }

      const style = node.style;
      const rect = node.getBoundingClientRect();

      return (
        style.position === 'fixed' &&
        style.background === 'transparent' &&
        style.maxWidth === '420px' &&
        style.height === '190px' &&
        style.width === '100%' &&
        style.zIndex === '2147483647' &&
        rect.top <= 30 &&
        rect.right >= window.innerWidth - 5 &&
        rect.height >= 150 &&
        rect.width >= 300
      );
    }

    function hideFrame(node) {
      node.style.setProperty('display', 'none', 'important');
      node.style.setProperty('visibility', 'hidden', 'important');
      node.style.setProperty('opacity', '0', 'important');
      node.style.setProperty('pointer-events', 'none', 'important');
    }

    function hideFrames(root = document) {
      const scope = root instanceof HTMLElement ? root : document;
      const nodes =
        scope === document
          ? document.querySelectorAll('iframe')
          : scope.querySelectorAll('iframe');

      for (const node of nodes) {
        if (!isTargetAdFrame(node)) {
          continue;
        }
        hideFrame(node);
      }

      if (scope instanceof HTMLIFrameElement && isTargetAdFrame(scope)) {
        hideFrame(scope);
      }
    }

    Utils.onReady(() => {
      hideFrames();

      Utils.observeAddedNodes((node) => {
        hideFrames(node);
      });

      const observer = new MutationObserver(() => {
        hideFrames();
      });

      observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style'],
      });

      Utils.removeSelectors([
        '#all-c + *',
        'footer',
        '.footer',
        '#footer',
        '.copyright',
        '[class*="copyright"]',
        '[class*="beian"]',
        '.container > .row:last-of-type + .row',
        '.container-fluid > .row:last-of-type + .row',
      ]);
    });
  },
},
{
  name: 'tempmail.plus-hide-side-ads',
  match() {
    return location.hostname === 'tempmail.plus';
  },
  run() {
    const styleId = 'fusion-toolbox-tempmail-plus-hide-ads';
    const hideSelectors = [
      '#email > .title',
      'header .d-flex.flex-row.align-items-center > .d-none.d-md-block',
      'header .link',
      '#email .row > .col p.text-left.text-white',
      '#ads-del2',
      '#ads-del4',
      '#ads-del5',
      '.ad-banners',
      '.ad-banners a',
      '.main [id*="ads-del"]',
      '[id^="ads-del"]',
      '[id*="ads-del"]',
      '[class*="ad-banner"]',
      '[class*="ads-banner"]',
      'iframe[src*="googlesyndication"]',
      'iframe[src*="doubleclick"]',
      'iframe[id*="google_ads"]',
    ];
    const removeSelectors = [
      '.info.mb-50.mb-xl-70',
    ];

    Utils.addStyle(
      styleId,
      `${hideSelectors.join(',\n')} {
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
      }
      ${removeSelectors.join(',\n')} {
        display: none !important;
      }`
    );

    const hide = (root = document) => {
      Utils.hideSelectors(hideSelectors, root);
      Utils.removeSelectors(removeSelectors, root);
    };

    Utils.onReady(() => {
      hide();

      Utils.observeAddedNodes((node) => {
        if (node.matches?.([...hideSelectors, ...removeSelectors].join(','))) {
          hide(node.parentElement || document);
          return;
        }

        hide(node);
      });
    });
  },
},
{
  name: 'toolhelper.cn-hide-jsonformat-bottom-ad',
  match() {
    return (
      location.hostname === 'www.toolhelper.cn' &&
      location.pathname === '/JSON/JSONFormat'
    );
  },
  run() {
    const styleId = 'fusion-toolbox-toolhelper-hide-jsonformat-bottom-ad';
    const removeSelectors = [
      '#divAd',
      '#divAd script',
      '#divAd ins.adsbygoogle',
      'script[src*="pagead2.googlesyndication.com"]',
      '[data-ad-client]',
      '[data-ad-slot]',
    ];

    Utils.addStyle(
      styleId,
      `${removeSelectors.join(',\n')} {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
        min-height: 0 !important;
        max-height: 0 !important;
      }`
    );

    const hide = (root = document) => {
      Utils.removeSelectors(removeSelectors, root);
    };

    Utils.onReady(() => {
      hide();

      Utils.observeAddedNodes((node) => {
        if (node.matches?.(removeSelectors.join(','))) {
          hide(node.parentElement || document);
          return;
        }

        hide(node);
      });
    });
  },
}
];

  for (const module of modules) {
    if (module.match()) {
      module.run();
    }
  }
})();
