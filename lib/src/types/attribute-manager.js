// @copyright 2017-2018 adalberto.lacruz@gmail.com

import { ObservableEvent } from './observable-event.js';
import { valueByDefault } from '../util/misc.js';

/**
 * Manages the component attributes
 * @class
 */
class AttributeManager {
  /**
   * @constructor
   * @param {HTMLElement} target
   */
  constructor(target) {
    this.target = target;

    /**
     * cache for last attribute information
     * @type {ObservableEvent}
     */
    this.entry = null; // cache for last
  }

  /**
   * Attributes storage
   * @type {Map<String, ObservableEvent>}
   */
  get register() { return this._register || (this._register = new Map()); }

  /**
   * Change the attribute value
   * @param {String} name
   * @param {*} value
   * @return {AttributeManager}
   */
  change(name, value) {
    this.get(name).update(value);
    return this;
  }

  /**
   * Initialize observable with attribute value or default
   * @param {?} value
   * @param {String} name
   * @return {AttributeManager}
   */
  default(value, name = null) {
    const attrValue = this._getAttributeValueOrDefault(value, name);
    this.entry.setValue(attrValue); // we get this.entry as lateral effect
    return this;
  }

  /**
   * Update with attribute value or default
   * @param {?} value
   * @param {String} name
   * @return {AttributeManager}
   */
  defaultAndUpdate(value, name = null) {
    const attrValue = this._getAttributeValueOrDefault(value, name);
    const entry = this.entry; // assure that don't change in promise

    entry.setValue(attrValue);
    Promise.resolve().then(() => entry.dispatch()); // assure all handlers are executed now
    return this;
  }

  /**
   * Defines an attribute
   * @param {String} name
   * @param {String} type 'string' | 'boolean' | 'number'
   * @param {Object} options
   * @return {AttributeManager}
   */
  define(name, type = null, options = null) {
    let entry = this.register.get(name);
    if (!entry) {
      entry = new ObservableEvent(name)
        .setType(valueByDefault(type, 'string'))
        .setContext(valueByDefault(options, {}));
      this.register.set(name, entry);
    }

    if (type === 'boolean') {
      entry.transformer = (value) => (value === '') ? true : Boolean(value);
    }

    this.entry = entry;
    return this;
  }

  /**
   * Assure an entry
   * @param {String} name
   * @return {ObservableEvent}
   */
  get(name) {
    if (this.register.has(name)) return this.register.get(name);

    this.define(name);
    return this.entry;
  }

  /**
   * Get the attribute value or default if null
   * @param {?} value
   * @param {String} name
   * @return {?}
   */
  _getAttributeValueOrDefault(value, name = null) {
    const entry = (name == null) ? this.entry : this.get(name);
    const attrName = entry.name;
    return this.target.hasAttribute(attrName)
      ? this.target.getAttribute(entry.name)
      : value;
  }

  /**
   * Returns the attribute value
   * @param {String} name
   */
  getValue(name) {
    return this.get(name).value;
  }

  /**
   * Action on attribute change. Use toAttribute() to identify the attribute.
   * @param {Function} handler
   */
  on(handler) {
    if (handler == null) return this;

    this.entry.observe(handler);
    return this;
  }

  /**
   * As on, but with name. Used for attributes defined elsewhere
   * @param {String} name
   * @param {Function} handler
   */
  onChange(name, handler) {
    this.entry = this.get(name);
    return this.on(handler);
  }

  /**
   * On change reflect to attribute. Use toAttribute() to identify the attribute.
   * @param {String} type - '-remove', 'true-false', ...
   * @return {AttributeManager}
   */
  reflect(type = null) {
    const options = {};
    if (type != null) options.type = type;
    this.entry.onChangeReflectToAttribute(this.target, options);
    return this;
  }

  /**
   * Set this.entry to the attribute, for further processing
   * @param {String} name
   */
  toAttribute(name) {
    this.entry = this.get(name);
  }
}

export { AttributeManager };
