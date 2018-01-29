// @copyright @polymer\iron-behaviors\iron-button-state.js
// @copyright 2017-2018 adalberto.lacruz@gmail.com

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
export const AlgIronButtonStateMixin = (base) => class extends base {
  /** @override */
  deferredConstructor() {
    super.deferredConstructor();

    this.fireHandlers.add('change'); // fire with toggles active

    this.attributeManager
      .define('active', 'boolean') // updated by tap
      .reflect()
      .onChangeFireMessage('change') // TODO: eventManager.onChangeFireMessage('active', this, 'change')
      .on(this._activeChanged.bind(this))

      .define('toggles', 'boolean')
      .reflect()
      .on(this._activeChanged.bind(this));

    this.eventManager
      .onChangeReflectToAttribute('pressed', this)

      .on('tap', this._tapHandler.bind(this))

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

    const active = this.attributeManager.getValue('active');
    const toggles = this.attributeManager.getValue('toggles');

    if (toggles) {
      FHtml.attributeToggle(this, 'aria-pressed', active, { type: 'true-false'});
    } else {
      this.removeAttribute('aria-pressed');
    }
  }

  /**
   * Response to a click event or enter key
   */
  _tapHandler() {
    if (this.hasAttribute('frozen')) return; // Don't let changes

    const active = this.attributeManager.get('active');
    const toggles = this.attributeManager.get('toggles');

    if (toggles.value) {
      active.toggle();
    } else {
      active.update(false);
    }
  }
};
