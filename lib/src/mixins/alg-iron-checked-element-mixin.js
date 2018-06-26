// @copyright @polymer\iron-checked-element-behavior\iron-checked-element-behavior.js
// @copyright 2017-2018 adalberto.lacruz@gmail.com

import { TYPE_BOOL, TYPE_STRING } from '../util/constants.js';

// TODO: validate, form. Review active/check relation
/**
 * [checked ⛳]
 * [required ⛳aria-required]
 * [toggles ⛳]
 * [value 💰on]
 *
 * Requires:
 *   AlgIronButtonStateMixin
 *   AlgIronValidatableMixin
 *
 * @param {*} base
 */
export const AlgIronCheckedElementMixin = (base) => class extends base {
  /** @override */
  deferredConstructor() {
    super.deferredConstructor();

    this.attributeManager
      .define('aria-required', TYPE_BOOL)
      .reflect({ type: 'true-remove'})

      .define('checked', TYPE_BOOL)
      .onChangeModify('active')
      .reflect()
      .on((value) => {
        if (!value && this.hasAttribute('frozen')) this.removeAttribute('frozen');
      })
      .store((entry$) => { this.checked$ = entry$; })

      .define('required', TYPE_BOOL)
      .onChangeModify('aria-required')
      .store((entry$) => { this.required$ = entry$; })

      .define('toggles', TYPE_BOOL, { value: true}) // yet defined else
      .reflect()
      .autoDispatch()

      .define('value', TYPE_STRING)
      .setTransformer((value) => value == null ? 'on' : value); // onNullSet('on');

    // Duplicate from active definition?
    this.messageManager
      .define('change', { toAttribute: 'active' }); // message: true/false
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
    return this.disabled$.value || !this.required$.value || this.checked$.value;
  }
};
