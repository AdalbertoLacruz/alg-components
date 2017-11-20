// @copyright @polymer\iron-behaviors\iron-button-state.js
// @copyright 2017 ALG
// @ts-check

import { ObsBoolean } from '../types/obs-boolean.js';

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

    this.fireHandlers.add('change'); // fire with toggles

    this.eventManager
      .define('active', new ObsBoolean('active', false).log(true)
        .onChangeReflectToAttribute(this)
        .onChangeFireMessage(this, 'change')
        .observe(() => this._activeChanged())
      )
      // If true, the button toggles the active state with each tap or press of the spacebar.
      .define('toggles', new ObsBoolean('toggles', false)
        .onChangeReflectToAttribute(this)
        .observe(() => this._activeChanged())
      )
      .on('tap', this._tapHandler.bind(this))
      .onChangeReflectToAttribute('pressed', this, 'pressed', true)
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
      this.setAttribute('aria-pressed', active ? 'true' : 'false');
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

    this.eventManager.getObservable('toggles').update(value !== null);
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
