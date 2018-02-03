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
   * Default values for read(), default()
   * @type {Map<String, *>}
   */
  get defaults() { return this._defaults || (this._defaults = new Map()); }

  /**
   * Change the attribute value
   * @param {String} name
   * @param {*} value
   * @return {AttributeManager}
   */
  change(name, value) {
    const entry = this.get(name);
    entry.binded = true;
    entry.update(value);

    return this;
  }

  /**
   * Initialize observable with attribute value or default.
   * Don't trigger handlers.
   * @param {?} value
   * @param {Object} options
   * @return {AttributeManager}
   */
  default(value, options = {}) {
    const entry = this.entry;
    const name = entry.name;
    if (this.target.hasAttribute(name)) {
      entry.setValue(this.target.getAttribute(name));
    } else if (this.defaults.has(name)) {
      entry.setValue(this.defaults.get(name));
    } else {
      entry.setValue(value);
    }
    return this;
  }

  /**
   * Defines an attribute, if not previously defined.
   * @param {String} name
   * @param {String} type 'string' | 'boolean' | 'number'
   * @param {Object} options
   * @return {AttributeManager}
   */
  define(name, type = null, options = {}) {
    let entry = this.register.get(name);
    if (!entry) {
      entry = new ObservableEvent(name)
        .setType(valueByDefault(type, 'string'))
        .setContext(options);
      this.register.set(name, entry);

      if (type === 'boolean') {
        entry.transformer = (value) => (value === '') ? true : Boolean(value);
      }
    }

    this.entry = entry;
    return this;
  }

  /**
   * Load defaults, for read(). options = {important = true/false}
   * @param {String} name
   * @param {*} value
   * @param {Object} options
   * @return {AttributeManager}
   */
  defineDefault(name, value, options = {}) {
    if (options.important || !this.defaults.has(name)) {
      this.defaults.set(name, value);
    }
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
   * Returns the attribute value
   * @param {String} name
   */
  getValue(name) {
    return this.get(name).value;
  }

  /**
   * Binded to the controller is ...
   * @return {Boolean}
   */
  isBinded(name) {
    return this.get(name).binded;
  }

  /**
   * Don't repeat same actions
   * True if 'name' is not included in this.entry.context.'action'
   * @param {String} action
   * @param {String} name - if null, action: true/false, else ['name']
   * @return {Boolean}
   */
  isUniqueAction(action, name = null) {
    const context = this.entry.context;
    if (name == null) {
      const token = context[action];
      return token ? false : (context[action] = true);
    }
    /** @type {Array<String>} */
    const token = context[action] || (context[action] = []);
    return (token.indexOf(name) > -1) ? false : (token.push(name) > 0); // true
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
   * Inmediate Action on attribute change.
   * @param {Function} handler
   */
  onLink(handler) {
    if (handler == null) return this;

    this.entry.link(handler);
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
   *
   * @param {*} message
   * @return {AttributeManager}
   */
  onChangeFireMessage(message) { // TODO: use messageManager?
    this.entry.onChangeFireMessage(this.target, message);
    return this;
  }

  /**
   * Copy value to other attribute, only once
   * @param {String} name - target
   * @return {AttributeManager}
   */
  onChangeModify(name) {
    if (this.isUniqueAction('modify', name)) {
      const target = this.get(name);
      this.entry.link((value) => { target.update(value); });
    }
    return this;
  }

  /**
   * Read, now,  the attribute associate with this.entry
   * If attribute isn't found use defaults if possible.
   * options = {alwaysUpdate: true/false}
   * @param {Object} options
   * @return {AttributeManager}
   */
  read(options = {}) {
    const {alwaysUpdate} = options;
    const entry = this.entry;
    const name = entry.name;

    if (this.target.hasAttribute(name)) {
      entry.update(this.target.getAttribute(name));
    } else if (this.defaults.has(name)) {
      entry.update(this.defaults.get(name));
    } else if (alwaysUpdate) {
      entry.dispatch();
    }

    return this;
  }

  /**
   * On change reflect to attribute. Use toAttribute() to identify the attribute.
   * @param {Object} options
   *  - options.type - '-remove', 'true-false', ...
   *  - options.noInit: true
   * @return {AttributeManager}
   */
  reflect(options = {}) {
    if (this.isUniqueAction('reflect')) {
      this.entry.onChangeReflectToAttribute(this.target, options);
    }
    return this;
  }

  /**
   * Set this.entry to the attribute, for further processing
   * @param {String} name
   * @return {AttributeManager}
   */
  toAttribute(name) {
    this.entry = this.get(name);
    return this;
  }
}

export { AttributeManager };
