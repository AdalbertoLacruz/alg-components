// @copyright @polymer\iron-behaviors\iron-control-state.js
// @copyright 2017 ALG
// @ts-check
import '../styles/iron-flex-layout.js';

import { AlgComponent } from '../components/alg-component.js';
import { ObsBoolean } from '../types/obs-boolean.js';

class AlgIronComponent extends AlgComponent {
  // this._oldTabIndex {Number}

  // /** @return {ObsBoolean} */
  // get active() { return this._active || (this._active = new ObsBoolean('active', false)); }

  /** If true, the user cannot interact with this element. @return {ObsBoolean} */
  get disabled() { return this._disabled || (this._disabled = new ObsBoolean('disabled', false)); }

  /** @return {ObsBoolean} */
  get focused() { return this._focused || (this._focused = new ObsBoolean('focused', false)); }

  /**
   * Attributes managed by the component
   * @override
   * @return {Array<String>}
   */
  static get observedAttributes() {
    return super.observedAttributes.concat(['disabled']);
  }

  // /** @return {ObsBoolean} */
  // get pressed() { return this._pressed || (this._pressed = new ObsBoolean('pressed', false)); }

  // /** @return {ObsBoolean} */
  // get receivedFocusFromKeyboard() {
  //   return this._receivedFocusFromKeyboard ||
  //   (this._receivedFocusFromKeyboard = new ObsBoolean('receivedFocusFromKeyboard', false));
  // }

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
      // this._setFocused(false);
      this.tabIndex = -1;
      this.blur();
      this.setAttribute('disabled', '');
      this.classList.add('disabled');
    } else {
      if (this._oldTabIndex !== undefined) {
        this.tabIndex = this._oldTabIndex;
      }
      this.removeAttribute('disabled');
      this.classList.remove('disabled');
    }
    this.disabled.update(disabled); // last, because fire other code
  }
}

export { AlgIronComponent };
