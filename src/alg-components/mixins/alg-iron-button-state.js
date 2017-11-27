// @copyright @polymer\iron-behaviors\iron-button-state.js
// @copyright 2017 ALG
// @ts-check

import * as FHtml from '../util/f-html.js';

/**
 * Mixin behavior
 * Manages active state if present toggles attribute
 * Attribute: toggles
 * Fire: change
 *
 * active ⛳(active, aria-pressed) 🔥change
 * tap, enter, space ⛳pressed -> toggles ⛳
 *
 * @param {*} base
 */
export const AlgIronButtonState = (base) => class extends base {
  constructor() {
    // @ts-ignore
    super();

    this.fireHandlers.add('change'); // fire with toggles active

    this.eventManager
      .on('active', this._activeChanged.bind(this)) // updated by tap
      .onChangeReflectToAttribute('active', this)
      .onChangeFireMessage('active', this, 'change')

      .onChangeReflectToAttribute('pressed', this)

      .on('tap', this._tapHandler.bind(this))

      .on('toggles', this._activeChanged.bind(this))
      .onChangeReflectToAttribute('toggles', this)

      .onKey('enter:keydown', this._tapHandler.bind(this))
      .onKey('space:keyup', this._tapHandler.bind(this))

      .subscribe(); // always, last
  }

  /**
   * Attributes managed by the component
   * @override
   * @type {Array<String>}
   */
  static get observedAttributes() {
    return super.observedAttributes.concat(['toggles', 'on-change']);
  }

  /**
   * aria-pressed attribute
   */
  _activeChanged() {
    const active = this.eventManager.getObservable('active').value;
    const toggles = this.eventManager.getObservable('toggles').value;
    if (toggles) {
      FHtml.attributeToggle(this, 'aria-pressed', active, { type: 'true-false'});
    } else {
      this.removeAttribute('aria-pressed');
    }
  }

  /**
   * Toggles attribute change
   * @param {String} attrName - Attribute Name
   * @param {String} value
   */
  bindedToggles(attrName, value) {
    if (this.bindedAttributeSuper(attrName, value)) return;

    this.eventManager.getObservable('toggles').update(this.toBoolean(value));
  }

  /**
   * Response to a click event or enter key
   */
  _tapHandler() {
    const active = this.eventManager.getObservable('active');
    const toggles = this.eventManager.getObservable('toggles');
    if (toggles.value) {
      active.toggle();
    } else {
      active.update(false);
    }
  }
};
