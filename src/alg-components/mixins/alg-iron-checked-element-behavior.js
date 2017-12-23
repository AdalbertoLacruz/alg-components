// @copyright @polymer\iron-checked-element-behavior\iron-checked-element-behavior.js
// @copyright 2017 ALG
// @ts-check

import { ObservableEvent } from '../types/observable-event.js';

// TODO: validate, form. Review active/check relation
/**
 * [checked ⛳]
 * [required ⛳aria-required]
 * [toggles ⛳]
 * [value 💰on]
 *
 * @param {*} base
 */
export const AlgIronCheckedElementBehavior = (base) => class extends base {
  constructor() {
    // @ts-ignore
    super();

    this.fireHandlers.add('change'); // fire with checked

    this.eventManager
      // If true, the button toggles the active state with each tap or press of the spacebar.
      .onChangeReflectToAttribute('toggles', this)
      .fire('toggles', true)

      // With noInit, avoid modify the checked initial attribute value
      .onChangeReflectToAttribute('checked', this, { noInit: true })
      // .onChangeFireMessage('checked', this, 'change')

      .define('required', new ObservableEvent('required').setType('boolean')
        .onChangeReflectToAttribute(this, { attribute: 'aria-required', type: 'true-remove'})
      )
      .define('value', new ObservableEvent('value').setType('string')
        .onNullSet('on'));
  }

  /**
   * Attributes managed by the component
   * @override
   * @type {Array<String>}
   */
  static get observedAttributes() {
    return super.observedAttributes.concat(['checked', 'on-change', 'required']);
  }

  /**
   * Checked attribute change.
   * If disabled, do nothing.
   *
   * @param {String} attrName - Attribute Name
   * @param {String} value
   */
  bindedChecked(attrName, value) {
    if (this.bindedAttributeSuper(attrName, value)) return;

    if (this.hasAttribute('disabled')) return;

    const _value = this.toBoolean(value);
    if (!_value && this.hasAttribute('frozen')) this.removeAttribute('frozen');

    this.eventManager.getObservable('active').update(_value);
  }

  /**
   * Required attribute change
   * @param {String} attrName - Attribute Name
   * @param {String} value
   */
  bindedRequired(attrName, value) {
    if (this.bindedAttributeSuper(attrName, value)) return;
    this.eventManager.getObservable('required').update(this.toBoolean(value));
  }
};
