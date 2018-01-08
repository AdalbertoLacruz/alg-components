// @copyright @polymer\iron-overlay-behavior\iron-overlay-manager.js
// @copyright 2017 ALG

import { AlgIronOverlayBackdrop } from '../iron/alg-iron-overlay-backdrop.js';
import { EventManager } from './event-manager.js';
import { List } from './list.js';

class AlgIronOverlayManager {
  constructor() {
    EventManager.document // TODO: unsubscribeMe
      // Ensures the click event is delegated to the right overlay.
      .on('tap', (event) => { // useCapture?
        console.log('document tap:', event);
        const overlay = /** @type {?} */ (this.currentOverlay());
        // Check if clicked outside of top overlay.
        if (overlay && this._overlayInPath(event.path) !== overlay) {
          overlay._onCaptureClick(event);
        }
      }, { me: this })
      .on('focus', (event) => { // useCapture?
        console.log('document focus:', event);

        const overlay = /** @type {?} */ (this.currentOverlay());
        if (overlay) overlay._onCaptureFocus(event);
      }, { me: this })
      .onKey('esc:keydown', (event) => {
        const overlay = /** @type {?} */ (this.currentOverlay());
        overlay._onCaptureEsc(event.keyboardEvent);
      }) // TODO: me
      .onKey('tab:keydown', (event) => {
        const overlay = /** @type {?} */ (this.currentOverlay());
        overlay._onCaptureTab(event.keyboardEvent);
      }) // TODO: me
      .subscribe();
  }

  /**
   * The shared backdrop element.
   * @type {!AlgIronOverlayBackdrop} backdropElement
   */
  get backdropElement() {
    return this._backdropElement ||
      (this._backdropElement = document.createElement('alg-iron-overlay-backdrop'));
  }

  /**
   * The deepest active element.
   * @type {!Element} activeElement the active element
   */
  get deepActiveElement() {
    // document.activeElement can be null
    // https://developer.mozilla.org/en-US/docs/Web/API/Document/activeElement
    // In case of null, default it to document.body.
    let active = document.activeElement || document.body;
    while (active.shadowRoot && active.shadowRoot.activeElement) {
      active = active.shadowRoot.activeElement;
    }
    return active;
  }

  /**
   * iframes have a default z-index of 100,
   * so this default should be at least that.
   * @type {Number}
   */
  get minimumZ() { return this._minimumZ || (this._minimumZ = 101); }
  set minimumZ(value) { this._minimumZ = value; }

  /**
   * Used to keep track of the opened overlays.
   * @type {List} List<Element>
   */
  get overlays() { return this._overlays || (this._overlays = new List()); }

  /**
   * Adds the overlay and updates its z-index if it's opened, or removes it if it's closed.
   * Also updates the backdrop z-index.
   * @param {?} overlay !HTMLElement
   */
  addOrRemoveOverlay(overlay) {
    if (overlay.opened.value) {
      this.addOverlay(overlay);
    } else {
      this.removeOverlay(overlay);
    }
  }

  /**
   * Tracks overlays for z-index and focus management.
   * Ensures the last added overlay with always-on-top remains on top.
   * @param {*} overlay !HTMLElement
   */
  addOverlay(overlay) {
    const i = this.overlays.indexOf(overlay);
    if (i >= 0) {
      this._bringOverlayAtIndexToFront(i);
      this.trackBackdrop();
      return;
    }

    let insertionIndex = this.overlays.length;
    const currentOverlay = this.overlays.last;
    let minimumZ = Math.max(this._getZ(currentOverlay), this.minimumZ);
    const newZ = this._getZ(overlay);

    // Ensure always-on-top overlay stays on top.
    if (currentOverlay && this._shouldBeBehindOverlay(overlay, currentOverlay)) {
      // This bumps the z-index of +2.
      this._applyOverlayZ(currentOverlay, minimumZ);
      insertionIndex--;
      // Update minimumZ to match previous overlay's z-index.
      const previousOverlay = this.overlays[insertionIndex - 1];
      minimumZ = Math.max(this._getZ(previousOverlay), this.minimumZ);
    }

    // Update z-index and insert overlay.
    if (newZ <= minimumZ) {
      this._applyOverlayZ(overlay, minimumZ);
    }
    this.overlays.insert(insertionIndex, overlay);

    this.trackBackdrop();
  }

  /**
   *
   * @param {!HTMLElement} overlay
   * @param {Number} aboveZ
   */
  _applyOverlayZ(overlay, aboveZ) {
    this._setZ(overlay, aboveZ + 2);
  }

  /**
   * Returns the z-index for the backdrop.
   * @return {Number}
   */
  backdropZ() {
    return this._getZ(this._overlayWithBackdrop()) - 1;
  }

  /**
   * Brings the overlay at the specified index to the front.
   * @param {Number} i
   */
  _bringOverlayAtIndexToFront(i) {
    const overlay = this.overlays[i];
    if (!overlay) return;

    let lastI = this.overlays.length - 1;
    const currentOverlay = this.overlays[lastI];

    // Ensure always-on-top overlay stays on top.
    if (currentOverlay && this._shouldBeBehindOverlay(overlay, currentOverlay)) {
      lastI--;
    }

    // If already the top element, return.
    if (i >= lastI) return;

    // Update z-index to be on top.
    const minimumZ = Math.max(this.currentOverlayZ(), this.minimumZ);
    if (this._getZ(overlay) <= minimumZ) {
      this._applyOverlayZ(overlay, minimumZ);
    }

    // Shift other overlays behind the new on top.
    while (i < lastI) {
      this.overlays[i] = this.overlays[i + 1];
      i++;
    }
    this.overlays[lastI] = overlay;
  }

  /**
   * Returns the current overlay.
   * @return {HTMLElement|undefined}
   */
  currentOverlay() {
    return this.overlays.last;
  }

  /**
   * Returns the current overlay z-index.
   * @return {Number}
   */
  currentOverlayZ() {
    return this._getZ(this.currentOverlay());
  }

  /**
   * Ensures that the minimum z-index of new overlays is at least `minimumZ`.
   * This does not effect the z-index of any existing overlays.
   * @param {Number} minimumZ
   */
  ensureMinimumZ(minimumZ) {
    this.minimumZ = Math.max(this.minimumZ, minimumZ);
  }

  focusOverlay() {
    const current = /** @type {?} */ (this.currentOverlay());
    if (current) current._applyFocus();
  }

  /**
   * @return {Array<Element>}
   */
  getBackdrops() {
    return this.overlays.filter((overlay) => overlay.withBackdrop.value);
  }

  /**
   * Calculates the minimum z-index for the overlay.
   * @param {HTMLElement=} overlay
   * @return {Number}
   */
  _getZ(overlay = null) {
    let z = this.minimumZ;

    if (overlay) {
      const z1 = Number(overlay.style.zIndex || window.getComputedStyle(overlay).zIndex);
      if (!Number.isNaN) z = z1; // Check if is a number
    }
    return z;
  }

  /**
   * Returns the deepest overlay in the path.
   * @param {Array<Element>=} path
   * @return {HTMLElement|undefined}
   */
  _overlayInPath(path = []) {
    path.forEach((pathItem, i) => {
      // @ts-ignore
      if (pathItem._manager === this) return pathItem;
    });
    return null;
  }

  /**
   * Returns the first opened overlay that has a backdrop.
   * @return {HTMLElement|undefined}
   */
  _overlayWithBackdrop() {
    this.overlays.forEach((overlay) => {
      if (overlay.withBackdrop) return overlay;
    });
    return null;
  }

  /**
   * @param {*} overlay !HTMLElement
   */
  removeOverlay(overlay) {
    if (!this.overlays.contains(overlay)) return;

    this.overlays.remove(overlay);
    this.trackBackdrop();
  }

  /**
   * Returns if the overlay1 should be behind overlay2.
   * @param {*} overlay1 !Element
   * @param {*} overlay2 !Element
   * @return {boolean}
   */
  _shouldBeBehindOverlay(overlay1, overlay2) {
    return !overlay1.alwaysOnTop && overlay2.alwaysOnTop;
  }

  /**
   * @param {!HTMLElement} element
   * @param {*} z Number|String
   */
  _setZ(element, z) {
    element.style.zIndex = z;
  }

  /**
   * Updates the backdrop z-index.
   */
  trackBackdrop() {
    const overlay = this._overlayWithBackdrop();
    // Avoid creating the backdrop if there is no overlay with backdrop.
    if (!overlay && !this._backdropElement) return; // TODO: backdropElemeent always true!!

    this.backdropElement.style.zIndex = (this._getZ(overlay) - 1).toString();
    this.backdropElement.opened.update(!!overlay);
    this.backdropElement.prepare();
  }
}

export { AlgIronOverlayManager };
