// @copyright @polymer\iron-checked-element-behavior\iron-checked-element-behavior.js
// @copyright 2017-2018 adalberto.lacruz@gmail.com

// import { ObservableEvent } from '../types/observable-event.js';

// TODO: validate, form. Review active/check relation
/**
 * [checked ⛳]
 * [required ⛳aria-required]
 * [toggles ⛳]
 * [value 💰on]
 *
 * Requires:
 *   AlgIronValidatableMixin
 *
 * @param {*} base
 */
export const AlgIronCheckedElementMixin = (base) => class extends base {
  /** @override */
  deferredConstructor() {
    super.deferredConstructor();

    this.fireHandlers.add('change'); // fire with checked

    const attributeManager = this.attributeManager;
    attributeManager
      .define('aria-required', 'boolean')
      .reflect({ type: 'true-remove'})

      .define('checked', 'boolean')
      .onChangeModify('active')
      .reflect({ noInit: true }) // With noInit, avoid modify the checked initial attribute value
      .on((value) => {
        if (this.disabled.value) return;
        if (!value && this.hasAttribute('frozen')) this.removeAttribute('frozen');
      })

      .define('required', 'boolean')
      .onChangeModify('aria-required')

      // If true, the button toggles the active state with each tap or press of the spacebar.
      .defineDefault('toggles', true)
      .toAttribute('toggles')
      .reflect()
      .read({alwaysUpdate: true})

      .define('value', 'string');

    attributeManager.get('value').onNullSet('on');

    this.checked = attributeManager.get('checked');
    this.disabled = attributeManager.get('disabled');
    this.required = attributeManager.get('required');
  }

  /**
   * Attributes managed by the component
   * @override
   * @type {Array<String>}
   */
  static get observedAttributes() {
    return super.observedAttributes.concat(['checked', 'on-change', 'required']);
  }

  /** @type {String} */
  get value() { return this.attributeManager.getValue('value'); }

  /**
   * Returns false if the element is required and not checked, and true otherwise.
   * @override
   * @param {*} _value Ignored.
   * @return {boolean} true if `required` is false or if `checked` is true.
   */
  _getValidity(_value = null) {
    return this.disabled.value || !this.required.value || this.checked.value;
  }
};
