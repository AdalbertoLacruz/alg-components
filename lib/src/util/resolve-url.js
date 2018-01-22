// @copyright @polymer\polymer\lib\utils\resolve-url.js 20170822
// @copyright 2017-2018 adalberto.lacruz@gmail.com
// @ts-nocheck

let CSS_URL_RX = /(url\()([^)]*)(\))/g;
const ABS_URL = /(^\/)|(^#)|(^[\w-\d]*:)/;
let workingURL;
let resolveDoc;

/**
 * Resolves the given URL against the provided `baseUri'.
 * @param {String} url Input URL to resolve
 * @param {String=} baseURI baseURI Base URI to resolve the URL against
 * @return {String} resolved URL
 */
export function resolveUrl(url, baseURI = null) {
  if (url && ABS_URL.test(url)) return url;

  // Lazy feature detection.
  if (workingURL === undefined) {
    workingURL = false;
    try {
      const u = new URL('b', 'http://a');
      u.pathname = 'c%20d';
      workingURL = (u.href === 'http://a/c%20d');
    } catch (e) {
      // silently fail
    }
  }

  if (!baseURI) {
    baseURI = document.baseURI || window.location.href;
  }

  if (workingURL) {
    return (new URL(url, baseURI)).href;
  }

  // Fallback to creating an anchor into a disconnected document.
  if (!resolveDoc) {
    resolveDoc = document.implementation.createHTMLDocument('temp');
    resolveDoc.base = resolveDoc.createElement('base');
    resolveDoc.head.appendChild(resolveDoc.base);
    resolveDoc.anchor = resolveDoc.createElement('a');
    resolveDoc.body.appendChild(resolveDoc.anchor);
  }
  resolveDoc.base.href = baseURI;
  resolveDoc.anchor.href = url;
  return resolveDoc.anchor.href || url;
};

/**
 * Resolves any relative URL's in the given CSS text against the provided
 * `ownerDocument`'s `baseURI`.
 *
 * @param {String} cssText CSS text to process
 * @param {String} baseURI Base URI to resolve the URL against
 * @return {String} Processed CSS text with resolved URL's
 */
export function resolveCss(cssText, baseURI) {
  return cssText.replace(CSS_URL_RX, (m, pre, url, post) =>
    pre + '\'' + resolveUrl(url.replace(/["']/g, ''), baseURI) + '\'' + post
  );
};

/**
 * Returns a path from a given `url`. The path includes the trailing
 * `/` from the url.
 *
 * @param {string} url Input URL to transform
 * @return {string} resolved path
 */
export function pathFromUrl(url) {
  return url.substring(0, url.lastIndexOf('/') + 1);
};
