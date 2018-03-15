// @copyright 2017-2018 adalberto.lacruz@gmail.com

import { TYPE_BOOL, TYPE_NUM } from '../util/constants.js';

/**
 * Common code for observable types.
 * ```update(value)``` => trigger linkers and observers handlers.
 * linkers is a list of handlers executed inmediatly in a value change.
 * observers is a list of handlers executed async.
 *
 * @class
 */
class Observable {
  /**
   * @param {String} name - Used to identify the variable in logs
   */
  constructor(name = '') {
    /** @type {String} */
    this.name = name; // internal name used in logs, attributes, ...

    /** @type {Object} */
    this.context = {}; // additional information
    this.context.me = this;

    /** @type {*} */
    this.delayedValue = null; // Last value received when delayed == true

    /** @type {Boolean} */
    this.disabled = false; // true, avoid update

    /** @type {Function} */
    this.initHandler = null; // Function called by init(value) TODO: deprecated
    this._isLogHandler = false; // true => a log handler is defined TODO: deprecated
    this._isLogActive = false; // true =>  log is active TODO: deprecated

    /** @type {Boolean} */
    this.isNewValue = false; // true => value change

    /** @type {*} */
    this.oldValue = null; // Previous value

    /** @type {String} */
    this.prefix = ''; // For log name = 'prefix#name'

    /** @type {Function} */
    this.transformer = null; // set value transformer handler. `this.newValue = this.transformer(value);`

    /** @type {String} */
    this._type = null; // Observable value type - const
  }

  // _________________________________________________ properties

  /**
   * Stop updated in true, until false. Then update with the last delayed value received.
   * Used to avoid bumping
   * @type {Boolean}
   */
  get delayed() { return this._delayed || (this._delayed = false); }
  set delayed(value) {
    this._delayed = value;
    if (value === false && this.delayedValue != null) {
      const delayedValue = this.delayedValue;
      this.delayedValue = null;
      this.update(delayedValue);
    }
  }

  /**
   * Linkers are like observers but the value is propagated faster.
   * Necessary for integrity in events.
   * @type {Set<Function>}
   */
  get linkers() { return this._linkers || (this._linkers = new Set()); }

  /**
   * Handlers to be executed async in value change
   * @type {Set<Function>}
   */
  get observers() { return this._observers || (this._observers = new Set()); }

  /**
   * The object value. All is around this.
   * @type {*}
   */
  get value() { return this._value; }
  set value(value) {
    // AlgLog.log(`${this.prefix}#${this.name}`, value); TODO:

    const newValue = (this.transformer == null) ? value : this.transformer(value);
    if (this._value !== newValue) {
      this.isNewValue = true;
      this.oldValue = this._value;
      this.context.old = this._value;
      this._value = newValue;
    } else {
      this.isNewValue = false;
    }
  }

  /**
   * @param {*} value
   */
  setValue(value) {
    this.value = value;
    return this;
  }

  /* ____________________________________________ methods _____ */

  /**
  * add value to number observable
  * @param  {*} value - to add to number value
  * @return {Observable}
  */
  add(value) {
    if (this._type === TYPE_NUM) this.update(this.value + value);
    return this;
  }

  /**
   * Call the subscribers (async observers/linkers)
   * Async values could change when processed if not receveid by value.
   *   link: handler(value)
   *   observe: handler(value, context)
   * @param {*} data
   * @return {Observable}
   */
  dispatch(data = null) {
    if (data === null) data = this.value;

    this.linkers.forEach((handler) => {
      handler(data, this.context);
    });

    // async calls only could receive parameters by value
    this.observers.forEach((handler) => {
      // setTimeout(() => handler(data, this.context), 0); // only send data
      Promise.resolve().then(() => handler(data));
    });

    return this;
  }

  /**
   * Changes the internal value, trigger the initHandler and the subscribers/observers
   *
   * @param  {*} value
   * @return {Observable}
   */
  init(value) { // TODO: deprecated
    if (this.initHandler) this.initHandler(value);
    this.update(value);
    return this;
  }

  /**
   * Function used to sync with other variables
   * @param  {Function} handler
   * @return {Observable}
   */
  initializer(handler) { // TODO: deprecated
    this.initHandler = handler;
    return this;
  }

  /**
   * Add a Function to be execued inmediatly at once in value change.
   * Used at eventManager level.
   * @param  {Function} handler
   * @return {Observable}
   */
  link(handler) {
    this.linkers.add(handler);
    return this;
  }

  /**
   * Add a Function to be execued async in value change.
   * @param  {Function} handler
   * @return {*}
   */
  observe(handler) {
    this.observers.add(handler);
    return this;
  }

  /**
   * If value is null/undefined changes to newValue // TODO: as transformer // deprecated?
   * @param {*} newValue
   * @return {Observable}
   */
  onNullSet(newValue) {
    let handler;
    this.observe(handler = (value) => {
      if (value === null || value === undefined) this.update(newValue);
    });
    handler(this._value);
    return this;
  }

  /**
   * @param {*} value
   */
  setContext(value) { // TODO: deprecated?
    this.context = value;
    return this;
  }

  /**
   * enable/disable logging in value change
   * @param  {Boolean} flag true, log is enabled
   * @return {Observable}
   */
  setLog(flag = true) { // TODO: deprecated?
    this._isLogActive = flag;

    if (flag && !this._isLogHandler) {
      this.link((value) => {
        // @ts-ignore
        if (this._isLogActive && window.AlgLog) window.AlgLog.add(null, `${this.name}: ${this.value}`);
      });
    }

    return this;
  }

  /**
   * Change the name used in log
   * @param {String} value
   * @return {Observable}
   */
  setName(value) { // TODO: deprecated?
    this.name = value;
    return this;
  }

  /**
   * @param {String} value
   */
  setPrefix(value) {
    this.prefix = value;
    return this;
  }

  /**
   * Initialize type = TYPE_BOOL, TYPE_NUM, TYPE_STRING, TYPE_EVENT, TYPE_OTHER
   * Initialize value/transformer according
   * @param {String} type
   * @param {Object} options  bool useTransformer
   */
  setType(type, options = {}) {
    const { useTransformer } = options;
    this._type = type;

    // this._type = value.toLowerCase();
    // if (this._type === 'boolean') this._value = false;

    switch (type) {
      case TYPE_BOOL:
        this._value = false;
        if (useTransformer) this.transformer = this.transformerBool;
        break;
      case TYPE_NUM:
        if (useTransformer) this.transformer = this.transformerNum;
        break;
      default:
        break;
    }
    return this;
  }

  /**
   * A value change execute the subscriber functions. Used by the bindind system
   * @param {String} channel - For internal subscription inside complex objects
   * @param {*} defaultValue
   * @param {Function} handler
   * @param {Object} status
   * @return {Observable}
   */
  subscribe(channel, defaultValue, handler, status) { // TODO: deprecated?
    status.hasChannel = true;
    this.observers.add(handler);
    if (defaultValue != null) this.init(defaultValue);
    return this.value;
  }

  /**
   * If value is true, set to false and vice versa
   * @return {Observable}
   */
  toggle() {
    // if (this._type === 'boolean') this.update(!this.value);
    if (typeof this.value === 'boolean') this.update(!this.value);
    return this;
  }

  /**
   * Default transformer for boolean value
   * @param {*} value
   */
  transformerBool(value) {
    return (typeof value === 'boolean')
      ? value
      : (value === '') ? true : Boolean(value);
  }

  /**
   * Default transformer for num value
   * @param {*} value
   */
  transformerNum(value) {
    return (typeof value === 'number')
      ? value
      : (typeof value === 'string' && value !== '') ? parseFloat(value) : null;
  }

  /**
   * Remove the susbscriber
   * @param {Function} handler
   * @param {Boolean} isLink - True if the handler is in the link list
   * @return {Observable}
   */
  unSubscribe(handler, isLink = false) {
    if (isLink) {
      this.linkers.delete(handler);
    } else {
      this.observers.delete(handler);
    }
    return this;
  }

  /**
   * Changes a value and trigger the linkers/observers
   * @param  {*} value
   * @param  {Object} options -> force = true, dispatch any case
   * @return {Observable}
   */
  update(value, options = {}) {
    const {force} = options;

    if (this.disabled) return this;
    if (this.delayed) {
      this.delayedValue = value;
      return this;
    }

    this.value = value;
    if (force || this.isNewValue) { this.dispatch(); }

    return this;
  }
}

export { Observable };
