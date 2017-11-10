// @copyright @polymer\iron-behaviors\iron-control-state.js
// @copyright 2017 ALG
// @ts-check
import '../styles/iron-flex-layout.js';

import { AlgComponent } from '../components/alg-component.js';

class AlgIronComponent extends AlgComponent {
  constructor() {
    super();
    this.eventManager.onCustom('disabled');
  }

  /**
   * Attributes managed by the component
   * @override
   * @type {Array<String>}
   */
  static get observedAttributes() {
    return super.observedAttributes.concat(['disabled']);
  }

  /**
   * Delayed execution of fn
   * @param {Function} fn
   * @param {Number} delay
   * @return {Number} id
   */
  async(fn, delay = 0) {
    return setTimeout(fn.bind(this), delay);
  }

  /**
   * Set Disabled attribute
   *
   * @param {String} attrName - Attribute Name
   * @param {*} value    - true => set, false => remove
   */
  bindedDisabled(attrName, value) { // iron-control-state: _disabledChanged
    if (this.bindedAttributeSuper(attrName, value)) return;

    const disabled = value != null;
    this.setAttribute('aria-disabled', disabled ? 'true' : 'false');
    this.style.pointerEvents = disabled ? 'none' : '';

    if (disabled) {
      this._oldTabIndex = this.tabIndex;
      // see blur() - this._setFocused(false);
      this.tabIndex = -1;
      this.blur(); // focused = false, pressed = false
      this.setAttribute('disabled', '');
      this.classList.add('disabled');
    } else {
      if (this._oldTabIndex !== undefined) {
        this.tabIndex = this._oldTabIndex;
      }
      this.removeAttribute('disabled');
      this.classList.remove('disabled');
    }
    this.eventManager.fire('disabled', disabled);
  }
}

export { AlgIronComponent };
