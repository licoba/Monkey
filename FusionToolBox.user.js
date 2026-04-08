// ==UserScript==
// @name         FusionToolBox
// @namespace    https://github.com/licoba/Monkey
// @version      0.1.5
// @description  Personal FusionToolBox userscript with per-site modules.
// @author       Codex
// @match        https://tempmail.plus/*
// @match        https://2925.com/*
// @run-at       document-start
// @grant        none
// @license      MIT
// ==/UserScript==

// Built from FusionToolBox.runtime.js via build.py.
(function () {
  'use strict';

  const FUSION_TOOLBOX_VERSION = '0.1.5';

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
    // Site module template:
    // 1. Copy this block.
    // 2. Replace name / match / run.
    // 3. Add the site's @match rule to the userscript header.
    {
      name: 'github.com-template',
      match() {
        return location.hostname === 'github.com';
      },
      run() {
        // Example:
        // Utils.addStyle('fusion-toolbox-github-demo', '.AppHeader { outline: 1px solid red !important; }');
      },
    },
    {
      name: 'example.com-template',
      match() {
        return location.hostname === 'example.com';
      },
      run() {
        // Copy this module and replace the site-specific logic.
      },
    },
  ];

  for (const module of modules) {
    if (module.match()) {
      module.run();
    }
  }
})();
