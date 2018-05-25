// @copyright @polymer\paper-behaviors\paper-ripple-behavior.js
// @copyright 2017-2018 adalberto.lacruz@gmail.com

import { AlgPaperRipple } from '../../src/base/alg-paper-ripple.js';
import { TYPE_BOOL } from '../util/constants.js';

/**
 * Mixin behavior
 *
 * Append `alg-paper-ripple` for ripple effect in component
 *
 * Attribute: `noink` (add to observedAttributes)
 * Properties: .rippleContainer = HTMLElement
 * Methods: .getRipple()
 *
 * @param {*} base
 * @mixin
 */
export const AlgPaperRippleMixin = (base) => class extends base {
  /** @override */
  deferredConstructor() {
    super.deferredConstructor();

    /** @type {AlgPaperRipple} */
    this._ripple = null;

    /** @type {Node} Where to add the ripple component */
    this.rippleContainer = this.shadowRoot;

    this.attributeManager
      // If true, no ink used in ripple effect
      .define('noink', TYPE_BOOL, { isLocal: true }) // TODO: alias
      .reflect()
      .on((value) => {
        if (this.hasRipple()) this._ripple.noink = value;
      });

    this.eventManager
      .on('down', this.ensureRipple.bind(this)) // a mouse event has x,y
      .on('focused', this.ensureRipple.bind(this))
      .subscribe();
  }

  /**
   * Attributes managed by the component
   * @override
   * @type {Array<String>}
   */
  static get observedAttributes() {
    return super.observedAttributes.concat(['noink']);
  }

  /**
   * Create the element's ripple effect via creating a `<alg-paper-ripple>`.
   * Override this method to customize the ripple element.
   * @return {AlgPaperRipple} Returns a `<alg-paper-ripple>` element.
   */
  _createRipple() {
    const element = /** @type {AlgPaperRipple} */ (document.createElement('alg-paper-ripple'));
    if (element.controller == null) element.controller = '';
    element.noink = this.attributeManager.getValue('noink');
    return element;
  }

  /**
   * Ensures this element contains a ripple effect. For startup efficiency
   * the ripple effect is created dynamically on demand when needed.
   * @param {UIEvent} event
   */
  ensureRipple(event = null) {
    if (!this.hasRipple()) {
      this._ripple = this._createRipple();
      if (this.rippleContainer) this.rippleContainer.appendChild(this._ripple);
      if (event) this._ripple.uiDownAction(event);
    }
  }

  /**
   * Returns the `<alg-paper-ripple>` element used by this element to create
   * ripple effects. The element's ripple is created on demand, when
   * necessary, and calling this method will force the
   * ripple to be created.
   * @return {AlgPaperRipple}
   */
  getRipple() {
    this.ensureRipple();
    return this._ripple;
  }

  /**
   * Returns true if this element currently contains a ripple effect.
   * @return {boolean}
   */
  hasRipple() {
    return Boolean(this._ripple);
  }
};
