// @copyright @polymer\iron-validatable-behavior\iron-validatable-behavior.js
// @copyright 2017-2018 adalberto.lacruz@gmail.com

import { ValidatorManager } from '../types/validator-manager.js';
import { TYPE_BOOL, TYPE_STRING } from '../util/constants.js';
/**
 * Validator behavior
 * @param {*} base
 */
export const AlgIronValidatableMixin = (base) => class extends base {
  /** @override */
  deferredConstructor() {
    super.deferredConstructor();

    this.attributeManager
      .define('aria-invalid', TYPE_BOOL)
      .reflect({type: 'true-remove'})

      // True if the last call to `validate` is invalid.
      .define('invalid', TYPE_BOOL)
      .reflect()
      .onChangeModify('aria-invalid')
      .store((entry$) => { this.invalid$ = entry$; })

      // Name of the validator to use.
      .define('validator', TYPE_STRING)
      .store((entry$) => { this.validator$ = entry$; });
  }

  /**
   * Attributes managed by the component
   * @override
   * @type {Array<String>}
   */
  static get observedAttributes() {
    return super.observedAttributes.concat(['validator']);
  }

  /**
   * Recompute this every time it's needed, because we don't know if the
   * `validator` has changed
   */
  get _validator() {
    return ValidatorManager.getValidator(this.validator$.value);
  }

  /**
   * Could be overrided
   * @param {Object} value The value to be validated.
   * @return {boolean} True if `value` is valid.
   */
  _getValidity(value) {
    return this.hasValidator() ? this._validator(value) : true;
  }

  /**
   * @return {boolean} True if the validator `validator` exists.
   */
  hasValidator() {
    return this._validator != null;
  }

  /**
   * Don't override
   * @param {Object} value - The value to be validated. If undefined the element value property is used.
   * @return {boolean} True if `value` is valid.
   */
  validate(value) {
    // If this is an element that also has a value property, and there was
    // no explicit value argument passed, use the element's property instead.
    const invalid = (value === undefined && this.value !== undefined)
      ? !this._getValidity(this.value)
      : !this._getValidity(value);

    this.invalid$.update(invalid);
    return !invalid;
  }
};
