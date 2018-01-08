// @copyright @polymer\iron-overlay-behavior\iron-focusables-helper.js
// @copyright 2017 ALG

import { List } from './list.js';

class AlgIronFocusablesHelper {
  /**
   * Searches for nodes that are tabbable and adds them to the `result` array.
   * Returns if the `result` array needs to be sorted by tabindex.
   * @param {!Node} node The starting point for the search; added to `result` if tabbable.
   * @param {List} result
   * @return {boolean}
   */
  static _collectTabbableNodes(node, result) {
    // If not an element or not visible, no need to explore children.
    if (node.nodeType !== Node.ELEMENT_NODE || !this._isVisible(node)) {
      return false;
    }
    const element = /** @type {HTMLElement} */ (node);
    const tabIndex = this._normalizedTabIndex(element);
    let needsSort = tabIndex > 0;
    if (tabIndex >= 0) result.add(element);

    // In ShadowDOM v1, tab order is affected by the order of distrubution.
    // E.g. getTabbableNodes(#root) in ShadowDOM v1 should return [#A, #B];
    // in ShadowDOM v0 tab order is not affected by the distrubution order,
    // in fact getTabbableNodes(#root) returns [#B, #A].
    //  <div id="root">
    //   <!-- shadow -->
    //     <slot name="a">
    //     <slot name="b">
    //   <!-- /shadow -->
    //   <input id="A" slot="a">
    //   <input id="B" slot="b" tabindex="1">
    //  </div>

    let children;
    if (element.localName === 'content' || element.localName === 'slot') {
      children = element.getDistributedNodes(); // TODO: shadow or content element
    } else {
      // Use shadow root if possible, will check for distributed nodes.
      children = (element.shadowRoot || element).children;
    }
    for (var i = 0; i < children.length; i++) {
      // Ensure method is always invoked to collect tabbable children.
      needsSort = this._collectTabbableNodes(children[i], result) || needsSort;
    }
    return needsSort;
  }

  /**
   * Returns a sorted array of tabbable nodes, including the root node.
   * It searches the tabbable nodes in the light and shadow dom of the chidren,
   * sorting the result by tabindex.
   * @param {!Node} node
   * @return {Array<HTMLElement>}
   */
  static getTabbableNodes(node) {
    console.log('getTabbableNodes');
    const result = new List();
    // If there is at least one element with tabindex > 0, we need to sort
    // the final array by tabindex.
    const needsSortByTabIndex = this._collectTabbableNodes(node, result);
    if (needsSortByTabIndex) {
      // return this._sortByTabIndex(result);
      return result.stableSort((left, right) => this._hasLowerTabOrder(left, right));
    }
    return result;
  }

  /**
   * Returns if element `a` has lower tab order compared to element `b`
   * (both elements are assumed to be focusable and tabbable).
   * Elements with tabindex = 0 have lower tab order compared to elements
   * with tabindex > 0.
   * If both have same tabindex, it returns false.
   * @param {!HTMLElement} a
   * @param {!HTMLElement} b
   * @return {Boolean}
   */
  static _hasLowerTabOrder(a, b) {
    // Normalize tabIndexes
    // e.g. in Firefox `<div contenteditable>` has `tabIndex = -1`
    const ati = Math.max(a.tabIndex, 0);
    const bti = Math.max(b.tabIndex, 0);
    return (ati === 0 || bti === 0) ? bti > ati : ati > bti;
  }

  /**
   * Returns if a element is focusable.
   * @param {!HTMLElement} element
   * @return {Boolean}
   */
  static isFocusable(element) {
    // From http://stackoverflow.com/a/1600194/4228703:
    // There isn't a definite list, it's up to the browser. The only
    // standard we have is DOM Level 2 HTML https://www.w3.org/TR/DOM-Level-2-HTML/html.html,
    // according to which the only elements that have a focus() method are
    // HTMLInputElement,  HTMLSelectElement, HTMLTextAreaElement and
    // HTMLAnchorElement. This notably omits HTMLButtonElement and
    // HTMLAreaElement.
    // Referring to these tests with tabbables in different browsers
    // http://allyjs.io/data-tables/focusable.html

    // Elements that cannot be focused if they have [disabled] attribute.
    if (element.matches('input, select, textarea, button, object')) {
      return element.matches(':not([disabled])');
    }
    // Elements that can be focused even if they have [disabled] attribute.
    return element.matches('a[href], area[href], iframe, [tabindex], [contentEditable]');
  }

  /**
   * Returns if a element is tabbable. To be tabbable, a element must be
   * focusable, visible, and with a tabindex !== -1.
   * @param {!HTMLElement} element
   * @return {Boolean}
   */
  static isTabbable(element) {
    return this.isFocusable(element) &&
      element.matches(':not([tabindex="-1"])') &&
      this._isVisible(element);
  }

  /**
   * Returns false if the element has `visibility: hidden` or `display: none`
   * @param {?} element !HTMLElement
   * @return {Boolean}
   */
  static _isVisible(element) {
    // Check inline style first to save a re-flow. If looks good, check also computed style.
    let style = element.style;
    if (style.visibility !== 'hidden' && style.display !== 'none') {
      style = window.getComputedStyle(element);
      return (style.visibility !== 'hidden' && style.display !== 'none');
    }
    return false;
  }

  // /**
  //  * Merge sort iterator, merges the two arrays into one, sorted by tab index.
  //  * @param {!Array<HTMLElement>} left
  //  * @param {!Array<HTMLElement>} right
  //  * @return {Array<HTMLElement>}
  //  */
  // static _mergeSortByTabIndex(left, right) {
  // //   var result = [];
  // //   while((left.length > 0) && (right.length > 0)) {
  // //     if (this._hasLowerTabOrder(left[0], right[0])) {
  // //       result.push(right.shift());
  // //     } else {
  // //       result.push(left.shift());
  // //     }
  // //   }

  // //   return result.concat(left, right);
  // }

  /**
   * Returns the normalized element tabindex. If not focusable, returns -1.
   * It checks for the attribute "tabindex" instead of the element property
   * `tabIndex` since browsers assign different values to it.
   * e.g. in Firefox `<div contenteditable>` has `tabIndex = -1`
   * @param {!HTMLElement} element
   * @return {!Number}
   */
  static _normalizedTabIndex(element) {
    if (this.isFocusable(element)) {
      const tabIndex = element.getAttribute('tabindex') || 0;
      return Number(tabIndex);
    }
    return -1;
  }

  // /**
  //  * Sorts an array of tabbable elements by tabindex. Returns a new array.
  //  * @param {List} tabbables !Array<HTMLElement>
  //  * @return {List} Array<HTMLElement>
  //  */
  // static _sortByTabIndex(tabbables) {
  // //   // Implement a merge sort as Array.prototype.sort does a non-stable sort
  // //   // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
  // //   var len = tabbables.length;
  // //   if(len < 2) {
  // //     return tabbables;
  // //   }
  // //   var pivot = Math.ceil(len / 2);
  // //   var left = this._sortByTabIndex(tabbables.slice(0, pivot));
  // //   var right = this._sortByTabIndex(tabbables.slice(pivot));
  // //   return this._mergeSortByTabIndex(left, right);
  // }
}

export { AlgIronFocusablesHelper };
