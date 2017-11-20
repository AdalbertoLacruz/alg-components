// @copyright 2017 ALG
// @ts-check

/**
 * Common code for observable types
 * <br>
 * set(value) => subscribers and observers
 * <br>
 * init(value) => initHandler
 * <br>
 * suscribers is a list of components methods
 * <br>
 * observers is a list of controller methods
 * <br>
 * init is used to sync with other variable
 *
 * @class
 */
class Observable {
  /**
   * @param {String} name - Used to identify the variable in logs
   */
  constructor(name = '', value = null, context = null) {
    this._name = name;
    this._value = value;
    this._context = context;
  }

  /*  ___________________________________________ properties _____ */

  /** Where the observable is defined (this, item, ...) @type {*} */
  set context(value) { this._context = value; }
  get context() { return this._context; }

  /**
   * true, avoid update
   * @type {Boolean}
   */
  get disabled() { return this._disabled || (this._disabled = false); }
  set disabled(value) { this._disabled = value; }

  /** Function called by init(value) @type {Function} handler */
  get initHandler() { return this._initHandler; }
  set initHandler(handler) { this._initHandler = handler; }

  /**
   * If true, value changes must be logged
   * @type {Boolean}
   */
  get isLog() {
    if (this._isLog == null) this._isLog = false;
    return this._isLog;
  }

  /**
   * Linkers are like observers but the value is transmited faster.
   * Necessary for integrity in events.
   * @type {Set}
   */
  get linkers() { return this._linkers || (this._linkers = new Set()); }

  /** internal name used in logs, attributes, ... @type {String} */
  set name(value) { this._name = value; }
  get name() { return this._name; }

  /**
   * Observers are Functions defined at controller level
   * @type {Set}
   */
  get observers() { return this._observers || (this._observers = new Set()); }

  /**
   * Auxiliary data related to value
   * @type {*}
   */
  set raw(value) { this._raw = value; }
  get raw() { return this._raw; }

  /**
   * Subscribers are function used by components to know a change
   * @type {Set}
   */
  get subscribers() { return this._subscribers || (this._subscribers = new Set()); }

  /**
   * The object value. All is around this.
   * @type {*}
   */
  get value() { return this._value; }
  set value(value) {
    this._value = value;
    // @ts-ignore
    if (this.isLog && window.AlgLog) window.AlgLog.add(null, `${this.name}: ${this.value}`);
  }

  /* ____________________________________________ methods _____ */

  /**
   * Copy values (from other observer) and trigger the notification process
   * @param {*} raw
   * @param {*} value
   * @return {Observable}
   */
  copy(raw, value) {
    this.raw = raw;
    this.update(value);
    return this;
  }

  /**
   * Call async the observers and subscribers
   * @param {*} data
   * @return {*} Observable
   */
  dispatch(data = null) {
    if (data === null) data = this.value;

    this.linkers.forEach((handler) => {
      handler(data, this.raw, this.context);
    });

    this.observers.forEach((handler) => {
      setTimeout(() => handler(data, this.raw, this.context), 0);
    });

    this.subscribers.forEach((handler) => {
      setTimeout(() => handler(data), 0);
    });

    return this;
  }

  /**
   * get the value.
   * @return {*}
   */
  get() {
    return this.value;
  }

  /**
   * Changes the internal value, trigger the initHandler and the subscribers/observers
   *
   * @param  {*} value
   * @return {*} Observable
   */
  init(value) {
    if (this.initHandler) this.initHandler(value);
    this.update(value);
    return this;
  }

  /**
   * Function used to sync with other variables
   * @param  {Function} handler
   * @return {*} Observable
   */
  initializer(handler) {
    this.initHandler = handler;
    return this;
  }

  /**
   * Add a Function to be execued inmediatly at once in value change. Used at eventManager level.
   * @param  {Function} handler
   * @return {*} Observable
   */
  link(handler) {
    this.linkers.add(handler);
    return this;
  }

  /**
   * enable/disable logging in value change
   * @param  {Boolean} flag true, log is enabled
   * @return {*} Observable
   */
  log(flag = true) {
    this._isLog = Boolean(flag);
    return this;
  }

  /**
   * Add a Function to be execued in value change. Used at controller level.
   * @param  {Function} handler
   * @return {*} Observable
   */
  observe(handler) {
    this.observers.add(handler);
    return this;
  }

  /**
   * Send a custom event on value change, or value objective
   * @param {*} item
   * @param {String} event - name
   * @param {*} to - value to trigger the change (true, a number, ...)
   */
  onChangeFireMessage(item, event, to = null) {
    if (to == null) {
      this.observe((value) => {
        item.fire(event, this.value);
      });
    } else {
      this.observe((value) => {
        if (value === to) item.fire(event, this.value);
      });
    }
    return this;
  }

  /**
   * Set attribute in a value change
   * @param {*} item - Element to set attribute
   * @param {String} attrName - // TODO:
   * @return {Observable}
   */
  onChangeReflectToAttribute(item, attrName = null) {
    this.observe((value) => {
      item.setAttribute(this.name, value.toString());
    });
    return this;
  }

  /**
   * If value is null/undefined changes to newValue
   * @param {*} newValue
   * @return {Observable}
   */
  onNullSet(newValue) {
    this.observe((value) => {
      if (value === null || value === undefined) this.update(newValue);
    });
    const handlers = Array.from(this.observers.values());
    handlers[handlers.length - 1](); // execute the handler just defined
    return this;
  }

  /**
   * Change the name used in log
   * @param {String} value
   * @return {*} Observable
   */
  setName(value) {
    this.name = value;
    return this;
  }

  // stop logging
  // silence() {

  // }

  /**
   * A value change execute the subscriber functions
   * @param {String} channel - For internal subscription inside complex objects
   * @param {*} defaultValue
   * @param {Function} handler
   * @param {Object} status
   * @return {*} observable
   */
  subscribe(channel, defaultValue, handler, status) {
    status.hasChannel = true;
    this.subscribers.add(handler);
    if (defaultValue != null) this.init(defaultValue);
    return this.value;
  }

  /**
   * Remove the susbscriber
   * @param {Function} handler
   * @return {*} observable
   */
  unSubscribe(handler) {
    this.subscribers.delete(handler);
    return this;
  }

  /**
   * Changes a value and trigger the suscriptors and observers
   * Options: force = true, dispatch any case
   * @param  {*} value
   * @param  {Object} options
   * @return {*} Observable
   */
  update(value, options = {}) {
    if (this.disabled) return this;
    if (this.value !== value || options.force) {
      this.value = value;
      this.dispatch();
    }
    return this;
  }
}

export { Observable };
