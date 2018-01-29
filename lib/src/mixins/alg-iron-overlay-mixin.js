// @copyright @polymer\iron-overlay-behavior\iron-overlay-behavior.js
// @copyright 2017-2018 adalberto.lacruz@gmail.com

// REQUIRES:
//  AlgIronFitMixin

import { AlgIronFocusablesHelper } from '../types/alg-iron-focusables-helper.js';
import { AlgIronOverlayManager } from '../types/alg-iron-overlay-manager.js';
import * as FHtml from '../util/f-html.js';
import { ObservableEvent } from '../types/observable-event.js';

/**
 * Mixin Behavior
 *
 *
 *
 * @param {*} base
 */
export const AlgIronOverlayMixin = (base) => class extends base {
  /** @override */
  deferredConstructor() {
    super.deferredConstructor();

    this._ensureSetup();
    this.opened.update(false);

    // event iron-resize TODO:
  }

  // connectedCallback() {
  //   super.connectedCallback();
  //   // this.isAttached = true;
  //   this.opened.update(false);
  // }

  /**
   * Set to true to keep overlay always on top.
   * @type {Boolean}
   */
  get alwaysOnTop() { return this._alwaysOnTop || (this._alwaysOnTop = false); }
  set alwaysOnTop(value) { this._alwaysOnTop = value; }

  /**
   * The backdrop element.
   */
  get backdropElement() { return this._manager.backdropElement; }

  /**
   * True if the overlay was canceled when it was last closed.
   * @type {ObservableEvent}
   */
  get canceled() {
    return this._canceled || (this._canceled = new ObservableEvent('canceled').setType('boolean')
      .setValue(null)
      .observe((value) => {
        // this.closingReason = this.closingReason || {};
        this.closingReason.canceled = value;
      })
    );
  }

  /**
   * Contains the reason(s) this overlay was last closed (see `iron-overlay-closed`).
   * `IronOverlayBehavior` provides the `canceled` reason; implementers of the
   * behavior can provide other reasons in addition to `canceled`.
   */
  get closingReason() { return this._closingReason || (this._closingReason = {}); }
  // set closingReason(value) { this._closingReason = value; }

  /**
   * Used for wrapping the focus on TAB / Shift+TAB.
   */
  get __firstFocusableNode() { return this.___firstFocusableNode; }
  set __firstFocusableNode(value) { this.___firstFocusableNode = value; }

  /**
   * Array of nodes that can receive focus (overlay included), ordered by `tabindex`.
   * This is used to retrieve which is the first and last focusable nodes in order
   * to wrap the focus for overlays `with-backdrop`.
   *
   * If you know what is your content (specifically the first and last focusable children),
   * you can override this method to return only `[firstFocusable, lastFocusable];`
   * @type {Array<Node>}
   */
  // @ts-ignore
  get _focusableNodes() { return AlgIronFocusablesHelper.getTabbableNodes(this); }

  /**
   * The node being focused.
   * @type {?Node}
   */
  get _focusedChild() { return this.__focusedChild; }
  set _focusedChild(value) { this.__focusedChild = value; }

  /**
   * Returns the node to give focus to.
   * @type {HTMLElement}
   */
  get _focusNode() {
    return this._focusedChild || this.querySelector('[autofocus]') || this;
  }

  /**
   * Used to skip calls to notifyResize and refit while the overlay is animating.
   * @type {Boolean}
   */
  get __isAnimating() { return this.___isAnimating || (this.___isAnimating = false); }
  set __isAnimating(value) { this.___isAnimating = value; }

  /**
   * Used for wrapping the focus on TAB / Shift+TAB.
   */
  get __lastFocusableNode() { return this.___lastFocusableNode; }
  set __lastFocusableNode(value) { this.___lastFocusableNode = value; }

  /**
   * Shortcut to access to the overlay manager.
   */
  get _manager() { return this.__manager || (this.__manager = new AlgIronOverlayManager()); }

  /**
   * Set to true to disable auto-focusing the overlay or child nodes with
   * the `autofocus` attribute` when the overlay is opened.
   * @type {Boolean}
   */
  get noAutoFocus() { return this._noAutoFocus || (this._noAutoFocus = false); }
  set noAutoFocus(value) { this._noAutoFocus = value; }

  /**
   * Set to true to disable canceling the overlay with the ESC key.
   * @type {Boolean}
   */
  get noCancelOnEscKey() { return this._noCancelOnEscKey || (this._noCancelOnEscKey = false); }
  set noCancelOnEscKey(value) { this._noCancelOnEscKey = value; }

  /**
   * Set to true to disable canceling the overlay by clicking outside it.
   * @type {Boolean}
   */
  get noCancelOnOutsideClick() { return this._noCancelOnOutsideClick || (this._noCancelOnOutsideClick = false); }
  set noCancelOnOutsideClick(value) { this._noCancelOnOutsideClick = value; }

  /**
   * True if the overlay is currently displayed.
   * @type {ObservableEvent}
   */
  get opened() {
    return this._opened || (this._opened = new ObservableEvent('opened').setType('boolean')
      .setValue(null)
      .observe((opened) => { this._openedChanged(opened); })
    );
  }

  // _overlaySetup {Boolean}

  /**
   * Request Animation Frame ID
   * Used by __onNextAnimationFrame to cancel any previous callback.
   * @type {Number}
   */
  get __raf() { return this.___raf; }
  set __raf(value) { this.___raf = value; }

  /**
   * Focused node before overlay gets opened. Can be restored on close.
   */
  get __restoreFocusNode() { return this.___restoreFocusNode; }
  set __restoreFocusNode(value) { this.___restoreFocusNode = value; }

  /**
   * Set to true to enable restoring of focus when overlay is closed.
   * @type {Boolean}
   */
  get restoreFocusOnClose() { return this._restoreFocusOnClose || (this._restoreFocusOnClose = false); }
  set restoreFocusOnClose(value) { this._restoreFocusOnClose = value; }

  /**
   * with-backdrop needs tabindex to be set in order to trap the focus.
   * If it is not set, IronOverlayBehavior will set it, and remove it if with-backdrop = false.
   */
  get __shouldRemoveTabIndex() { return this.___shouldRemoveTabIndex || (this.___shouldRemoveTabIndex = false); }
  set __shouldRemoveTabIndex(value) { this.___shouldRemoveTabIndex = value; }

  /**
   * Set to true to display a backdrop behind the overlay. It traps the focus
   * within the light DOM of the overlay.
   * @type {ObservableEvent}
   */
  get withBackdrop() {
    return this._withBackdrop || (this._withBackdrop = new ObservableEvent('withBackdrop').setType('boolean')
      .observe(() => { // TODO:
        // // If tabindex is already set, no need to override it.
        // if (this.withBackdrop && !this.hasAttribute('tabindex')) {
        //   this.setAttribute('tabindex', '-1');
        //   this.__shouldRemoveTabIndex = true;
        // } else if (this.__shouldRemoveTabIndex) {
        //   this.removeAttribute('tabindex');
        //   this.__shouldRemoveTabIndex = false;
        // }
        // if (this.opened && this.isAttached) {
        //   this._manager.trackBackdrop();
        // }
      })
    );
  }

  /**
   * Applies focus according to the opened state.
   */
  _applyFocus() {
    if (this.opened.value) {
      if (!this.noAutoFocus) {
        this._focusNode.focus();
      }
    } else {
      this._focusNode.blur();
      this._focusedChild = null;

      // Restore focus.
      if (this.restoreFocusOnClose && this.__restoreFocusNode) {
        this.__restoreFocusNode.focus();
      }
      this.__restoreFocusNode = null;

      // If many overlays get closed at the same time, one of them would still
      // be the currentOverlay even if already closed, and would call _applyFocus
      // infinitely, so we check for this not to be the current overlay.
      const currentOverlay = this._manager.currentOverlay();
      // @ts-ignore
      if (currentOverlay && this !== currentOverlay) {
        // @ts-ignore
        currentOverlay._applyFocus();
      }
    }
  }

  /**
   * Cancels the overlay.
   * @param {Event=} event The original event
   */
  cancel(event) {
    //   var cancelEvent = this.fire('iron-overlay-canceled', event, { cancelable: true });
    //   if(cancelEvent.defaultPrevented) {
    //     return;
    //   }

    this.canceled.update(true);
    this.opened.update(false);
  }

  /**
   * Initial hide
   */
  _ensureSetup() {
    if (this._overlaySetup) return;

    this._overlaySetup = true;
    this.style.outline = 'none';
    this.style.display = 'none';
  }

  _finishPositioning() {
    // First, make it invisible & reactivate animations.
    this.style.display = 'none';
    // Force reflow before re-enabling animations so that they don't start.
    // Set scrollTop to itself so that Closure Compiler doesn't remove this.
    this.scrollTop = this.scrollTop;
    this.style.transition = this.style.webkitTransition = '';
    this.style.transform = this.style.webkitTransform = '';
    // Now that animations are enabled, make it visible again
    this.style.display = '';
    // Force reflow, so that following animations are properly started.
    // Set scrollTop to itself so that Closure Compiler doesn't remove this.
    this.scrollTop = this.scrollTop;
  }

  /**
   * Tasks to be performed at the end of close action. Will fire `iron-overlay-closed`.
   */
  _finishRenderClosed() {
    // Hide the overlay.
    this.style.display = 'none';
    // Reset z-index only at the end of the animation.
    this.style.zIndex = '';
    //   this.notifyResize(); // iron-resizable-behavior
    this.__isAnimating = false;
  //   this.fire('iron-overlay-closed', this.closingReason);
  }

  /**
   * Tasks to be performed at the end of open action. Will fire `iron-overlay-opened`.
   */
  _finishRenderOpened() {
  //   this.notifyResize();
    this.__isAnimating = false;

  //   this.fire('iron-overlay-opened');
  }

  /**
   * Cancels (closes) the overlay. Call when click happens outside the overlay.
   * @param {!Event} event
   */
  _onCaptureClick(event) {
    if (!this.noCancelOnOutsideClick) {
      this.cancel(event);
    }
  }

  /**
   * Handles the ESC key event and cancels (closes) the overlay.
   * @param {!Event} event
   */
  _onCaptureEsc(event) {
  //   if(!this.noCancelOnEscKey) { //TODO:
  //     this.cancel(event);
  //   }
  }

  /**
   * Keeps track of the focused child. If withBackdrop, traps focus within overlay.
   * @param {!Event} event
   */
  _onCaptureFocus(event) {
    if (!this.withBackdrop.value) return;

    const path = event.path;
    if (path.indexOf(this) === -1) {
      event.stopPropagation();
      this._applyFocus();
    } else {
      this._focusedChild = path[0];
    }
  }

  /**
   * Handles TAB key events to track focus changes.
   * Will wrap focus for overlays withBackdrop.
   * @param {!Event} event
   */
  _onCaptureTab(event) { // TODO:
  //   if(!this.withBackdrop) {
  //     return;
  //   }
  //   this.__ensureFirstLastFocusables();
  //   // TAB wraps from last to first focusable.
  //   // Shift + TAB wraps from first to last focusable.
  //   var shift = event.shiftKey;
  //   var nodeToCheck = shift ? this.__firstFocusableNode : this.__lastFocusableNode;
  //   var nodeToSet = shift ? this.__lastFocusableNode : this.__firstFocusableNode;
  //   var shouldWrap = false;
  //   if(nodeToCheck === nodeToSet) {
  //     // If nodeToCheck is the same as nodeToSet, it means we have an overlay
  //     // with 0 or 1 focusables; in either case we still need to trap the
  //     // focus within the overlay.
  //     shouldWrap = true;
  //   } else {
  //     // In dom=shadow, the manager will receive focus changes on the main
  //     // root but not the ones within other shadow roots, so we can't rely on
  //     // _focusedChild, but we should check the deepest active element.
  //     var focusedNode = this._manager.deepActiveElement;
  //     // If the active element is not the nodeToCheck but the overlay itself,
  //     // it means the focus is about to go outside the overlay, hence we
  //     // should prevent that (e.g. user opens the overlay and hit Shift+TAB).
  //     shouldWrap = (focusedNode === nodeToCheck || focusedNode === this);
  //   }

  //   if(shouldWrap) {
  //     // When the overlay contains the last focusable element of the document
  //     // and it's already focused, pressing TAB would move the focus outside
  //     // the document (e.g. to the browser search bar). Similarly, when the
  //     // overlay contains the first focusable element of the document and it's
  //     // already focused, pressing Shift+TAB would move the focus outside the
  //     // document (e.g. to the browser search bar).
  //     // In both cases, we would not receive a focus event, but only a blur.
  //     // In order to achieve focus wrapping, we prevent this TAB event and
  //     // force the focus. This will also prevent the focus to temporarily move
  //     // outside the overlay, which might cause scrolling.
  //     event.preventDefault();
  //     this._focusedChild = nodeToSet;
  //     this._applyFocus();
  //   }
  }

  /**
   * Executes a callback on the next animation frame, overriding any previous
   * callback awaiting for the next animation frame. e.g.
   * `__onNextAnimationFrame(callback1) && __onNextAnimationFrame(callback2)`;
   * `callback1` will never be invoked.
   * @param {!Function} callback Its `this` parameter is the overlay itself.
   */
  __onNextAnimationFrame(callback) {
    if (this.__raf) {
      window.cancelAnimationFrame(this.__raf);
    }
    this.__raf = window.requestAnimationFrame(() => {
      this.__raf = null;
      callback.call(this);
    });
  }

  /**
   * Open the overlay.
   */
  open() {
    this.canceled.update(false);
    this.opened.update(true);
  }

  _openedChanged(opened) {
    FHtml.attributeToggle(this, 'aria-hidden', !opened, { type: 'true-remove'});

    // Defer any animation-related code on attached
    // (_openedChanged gets called again on attached).
    if (!this.loaded) return;

    this.__isAnimating = true;

    // Use requestAnimationFrame for non-blocking rendering.
    this.__onNextAnimationFrame(this.__openedChanged);
  }

  /**
   * Tasks executed when opened changes: prepare for the opening, move the
   * focus, update the manager, render opened/closed.
   */
  __openedChanged() {
    if (this.opened.value) {
      // Make overlay visible, then add it to the manager.
      this._prepareRenderOpened();
      this._manager.addOverlay(this);

      // Move the focus to the child node with [autofocus].
      this._applyFocus();

      this._renderOpened();
    } else {
      // Remove overlay, then restore the focus before actually closing.
      this._manager.removeOverlay(this);
      this._applyFocus();

      this._renderClosed();
    }
  }

  /**
   *
   */
  _preparePositioning() {
    this.style.transition = this.style.webkitTransition = 'none';
    this.style.transform = this.style.webkitTransform = 'none';
    this.style.display = '';
  }

  /**
   * tasks which must occur before opening; e.g. making the element visible.
   */
  _prepareRenderOpened() {
    // Store focused node.
    this.__restoreFocusNode = this._manager.deepActiveElement;

    // Needed to calculate the size of the overlay so that transitions on its size
    // will have the correct starting points.
    this._preparePositioning();
    this.refit(); // iron-fit-behavior
    this._finishPositioning();

  //   // Safari will apply the focus to the autofocus element when displayed
  //   // for the first time, so we make sure to return the focus where it was.
  //   if(this.noAutoFocus && document.activeElement === this._focusNode) {
  //     this._focusNode.blur();
  //     this.__restoreFocusNode.focus();
  //   }
  }

  /**
   * Tasks which cause the overlay to actually close; typically play an animation.
   */
  _renderClosed() {
    this._finishRenderClosed();
  }

  /**
   * Tasks which cause the overlay to actually open; typically play an animation.
   */
  _renderOpened() {
    this._finishRenderOpened();
  }
};
