// @copyright 2017-2018 adalberto.lacruz@gmail.com

/**
 * Common code for observable types.
 *    ```update(value)``` => trigger linkers and observers handlers.
 *    ```init(value)``` => initHandler and update.
 * init is used to sync with other variable.
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

    this.context = {}; // additional information
    this.disabled = false; // true, avoid update

    /** @type {Function} */
    this.initHandler = null; // Function called by init(value)

    this._isLogHandler = false; // true => a log handler is defined
    this._isLogActive = false; // true =>  log is active
    this.isNewValue = false; // true => value change

    /** @type {Function} */
    this.transformer = null; // set value transformer handler. `this.newValue = this.transformer(value)`
  }

  /*  ___________________________________________ properties _____ */

  // /**
  //  * Where the observable is defined (this, item, ...)
  //  * @type {*}
  //  */
  // get context() { return this._context; }
  // set context(value) { this._context = value; }

  // /**
  //  * true, avoid update
  //  * @type {Boolean}
  //  */
  // get disabled() { return this._disabled || (this._disabled = false); }
  // set disabled(value) { this._disabled = value; }

  // /**
  //  * Function called by init(value)
  //  * @type {Function} handler
  //  */
  // get initHandler() { return this._initHandler; }
  // set initHandler(handler) { this._initHandler = handler; }

  /**
   * Linkers are like observers but the value is transmited faster.
   * Necessary for integrity in events.
   * @type {Set}
   */
  get linkers() { return this._linkers || (this._linkers = new Set()); }

  // /**
  //  * internal name used in logs, attributes, ...
  //  * @type {String}
  //  */
  // get name() { return this._name; }
  // set name(value) { this._name = value; }

  /**
   * Observers are Functions defined at controller level
   * @type {Set}
   */
  get observers() { return this._observers || (this._observers = new Set()); }

  /**
   * The object value. All is around this.
   * @type {*}
   */
  get value() { return this._value; }
  set value(value) {
    const newValue = (this.transformer == null) ? value : this.transformer(value);
    if (this._value !== newValue) {
      this.isNewValue = true;
      this.context.old = this._value;
      this._value = newValue;
    } else {
      this.isNewValue = false;
    }
    // this._context.old = this._value;
    // this._value = (this.transformer == null)
    //   ? value
    //   : this.transformer(value);
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
    if (this._type === 'number') this.update(this.value + value);
    return this;
  }

  /**
   * Call async the observers and subscribers
   * @param {*} data
   * @return {Observable}
   */
  dispatch(data = null) {
    if (data === null) data = this.value;

    this.linkers.forEach((handler) => {
      handler(data, this.context);
    });

    this.observers.forEach((handler) => {
      setTimeout(() => handler(data, this.context), 0);
    });

    return this;
  }

  /**
   * Changes the internal value, trigger the initHandler and the subscribers/observers
   *
   * @param  {*} value
   * @return {Observable}
   */
  init(value) {
    if (this.initHandler) this.initHandler(value);
    this.update(value);
    return this;
  }

  /**
   * Function used to sync with other variables
   * @param  {Function} handler
   * @return {Observable}
   */
  initializer(handler) {
    this.initHandler = handler;
    return this;
  }

  /**
   * Add a Function to be execued inmediatly at once in value change. Used at eventManager level.
   * @param  {Function} handler
   * @return {Observable}
   */
  link(handler) {
    this.linkers.add(handler);
    return this;
  }

  /**
   * Add a Function to be execued in value change. Used at controller level.
   * @param  {Function} handler
   * @return {Observable}
   */
  observe(handler) {
    this.observers.add(handler);
    return this;
  }

  /**
   * If value is null/undefined changes to newValue // TODO: as transformer
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
  setContext(value) {
    this.context = value;
    return this;
  }

  /**
   * enable/disable logging in value change
   * @param  {Boolean} flag true, log is enabled
   * @return {Observable}
   */
  setLog(flag = true) {
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
  setName(value) {
    this.name = value;
    return this;
  }

  /**
   * Initialize type = boolean | string | number
   * Initialize value = false for boolean
   * @param {string} value
   */
  setType(value) {
    this._type = value.toLowerCase();
    if (this._type === 'boolean') this._value = false;
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
  subscribe(channel, defaultValue, handler, status) {
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
    if (this._type === 'boolean') this.update(!this.value);
    return this;
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
   * Changes a value and trigger the suscriptors and observers
   * Options: force = true, dispatch any case
   * @param  {*} value
   * @param  {Object} options
   * @return {Observable}
   */
  update(value, options = {}) {
    const {force} = options;
    if (this.disabled) return this;

    this.value = value; // could use transformer
    // if (force || this.value !== this._context.old) {
    //   this.dispatch();
    // }
    if (force || this.isNewValue) {
      this.dispatch();
    }

    return this;
  }
}

export { Observable };
