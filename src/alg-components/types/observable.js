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
  constructor(name = '') {
    this.name = name;
  }

  /*  ___________________________________________ properties _____ */

  /**
   * Function called by init(value)
   * @return {Function}
   */
  get initHandler() {
    return this._initHandler;
  }

  set initHandler(handler) {
    this._initHandler = handler;
  }

  /**
   * If true, value changes must be logged
   * @return {Boolean}
   */
  get isLog() {
    if (this._isLog == null) this._isLog = false;
    return this._isLog;
  }
  /**
   * internal name used in logs
   * @return {String}
   */
  get name() {
    return this._name;
  }

  set name(value) {
    this._name = value;
  }

  /**
   * Observers are Functions defined at controller level
   * @return {Set}
   */
  get observers() {
    return this._observers || (this._observers = new Set());
  }

  /**
   * Subscribers are function used by components to know a change
   * @return {Set}
   */
  get subscribers() {
    return this._subscribers || (this._subscribers = new Set());
  }

  /**
   * The object value. All is around this.
   * @return {*}
   */
  get value() {
    return this._value;
  }

  set value(value) {
    this._value = value;
    // @ts-ignore
    if (this.isLog && window.AlgLog) window.AlgLog.add(null, `${this.name}: ${this.value}`);
  }

  /* ____________________________________________ methods _____ */

  /**
   * Changes the internal value, trigger the initHandler and the subscribers/observers
   *
   * @param  {*} value
   * @return {*} Observable
   */
  init(value) {
    if (this.initHandler) this.initHandler(value);
    this.set(value);
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
   * Call the observers and subscribers
   * @return {*} Observable
   */
  dispatch() {
    this.observers.forEach((handler) => {
      handler(this.value);
    });

    this.subscribers.forEach((handler) => {
      handler(this.value);
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
   * Changes a value and trigger the suscriptors and observers
   * @param  {*} value
   * @return {*} Observable
   */
  set(value) {
    if (this.value !== value) {
      this.value = value;
      this.dispatch();
    }
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
   * @param {Function} handler
   * @return {*} observable
   */
  subscribe(handler) {
    this.subscribers.add(handler);
    return this;
  }
}

export { Observable };
