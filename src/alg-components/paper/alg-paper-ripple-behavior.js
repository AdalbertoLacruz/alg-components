// @copyright @polymer\paper-behaviors\paper-ripple-behavior.js
// @copyright 2017 ALG
// @ts-check

import { AlgPaperComponent } from '../paper/alg-paper-component.js';
import { AlgPaperRipple } from './alg-paper-ripple.js';
import { ObsBoolean } from '../types/obs-boolean.js';

/**
 * Append `alg-paper-ripple` for ripple effect in component
 *
 * Attribute: `noink` (add to observedAttributes)
 * Properties: .rippleContainer = HTMLElement
 * Methods: .getRipple()
 */
class AlgPaperRippleBehavior {
  /**
   * @param {*} item - AlgPaperButton, ...
   * @constructor
   */
  constructor(item) {
    this.item = item;

    // -----------------------------        handlers

    const eventManager = item.eventManager;
    eventManager
      .on('focused', this.ensureRipple.bind(this))
      .on('pressed', this.ensureRipple.bind(this)) // mouse, space
      .subscribe();

    // -----------------------------        properties

    // If true, the button toggles the active state with each tap or press of the spacebar.
    item.noink = new ObsBoolean('noink', false)
      .onChangeReflectToAttribute(item)
      .observe((value) => {
        if (this.hasRipple()) this._ripple.noink = value;
      });

    // -----------------------------        Attribute change management

    item.bindedNoink = this.bindedNoink;
  }

  /**
   * Where to add the ripple component
   * @return {*}
   */
  get rippleContainer() { return this._rippleContainer || (this._rippleContainer = this.item.shadowRoot); }
  set rippleContainer(value) { this._rippleContainer = value; }

  /**
   * Noink attribute change, injected to item (this).
   * If true, no ink used in ripple effect
   * @param {String} attrName - Attribute Name
   * @param {String} value
   */
  bindedNoink(attrName, value) {
    // @ts-ignore
    if (this.bindedAttributeSuper(attrName, value)) return;
    // @ts-ignore
    this.noink.update(this.toBoolean(value));
  }

  /**
   * Create the element's ripple effect via creating a `<alg-paper-ripple>`.
   * Override this method to customize the ripple element.
   * @return {AlgPaperRipple} Returns a `<alg-paper-ripple>` element.
   */
  _createRipple() {
    const element = /** @type {AlgPaperRipple} */ (document.createElement('alg-paper-ripple'));
    if (element.controller == null) element.controller = '';
    element.noink = this.item.noink.value;
    return element;
  }

  /**
   * Ensures this element contains a ripple effect. For startup efficiency
   * the ripple effect is dynamically on demand when needed.
   * @param {UIEvent=} optTriggeringEvent (optional) event that triggered the action
   */
  ensureRipple(optTriggeringEvent) {
    if (!this.hasRipple()) {
      this._ripple = this._createRipple();
      if (this.rippleContainer) this.rippleContainer.appendChild(this._ripple);
      if (optTriggeringEvent) {
        if (!this._ripple.noink) this._ripple.uiDownAction(optTriggeringEvent);
      }
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
}

export { AlgPaperRippleBehavior };
