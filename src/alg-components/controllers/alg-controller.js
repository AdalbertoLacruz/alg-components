// @ts-check
const TYPE_BOOLEAN = 'boolean';
const TYPE_NUMBER = 'number';
const TYPE_STRING = 'string';

// TODO: controller and page association?
// TODO: observerString and other types

/**
 * Base class for page controllers
 *
 * @type {class}
 */
class AlgController {
  /**
   * controllerName, to @override
   * @return {String}
   */
  get name() {
    return '';
  }

  // *************************** ****************************

  constructor() {
    AlgController.controllers.set(this.name, this);
  }

  /**
   * Storage for controller defined in the application. {"controllerName" : classInstance}
   * @return {Map<String, *>}
   */
  static get controllers() {
    return this._controllers || (this._controllers = new Map());
  }

  /**
   * Storage for the binders
   * @return {Object} Messages, values and subscriptors
   */
  get register() {
    return this._register || (this._register = {});
  }

  /**
   * Read or create a register item
   *
   * 'message': {
   *   'actions': [action, ...]
   *   'value':  defaultValue
   *  }
   *
   * @param {String} name - message
   * @return {Object}
   */
  getRegisterItem(name) {
    return this.register[name] || (this.register[name] = {
      'actions': [],
      'type': TYPE_STRING,
      'value': null
    });
  }

  /**
   * If raw converts to string the item.value
   *
   * @param  {Object} item - registem item
   * @param  {Boolean} [raw=false] - true, keep value type
   * @return {Object} value
   */
  getRegisterValue(item, raw) {
    let value = item.value;
    if (!raw && item.type !== TYPE_STRING) {
      value = String(value);
    }
    return value;
  }

  /**
   * Initialize the type for a message
   *
   * @param {String} message
   * @param {String} type - TYPE_STRING, ...
   */
  setRegisterType(message, type) {
    const item = this.getRegisterItem(message);
    item.type = type;
  }

  /**
   * Writes message.value = value, according to type
   *
   * @param  {Object} item - Optiona, the message item
   * @param  {String} message
   * @param  {any} value
   * @param  {Boolean} [raw] - true, don't check type
   * @param  {Boolean} [dispatch] - true, send message to subscribers
   */
  setRegisterValue(item, message, value, raw, dispatch) {
    if (item === null) item = this.getRegisterItem(message);
    let newValue = value;
    if (!raw) {
      const type = item.type;
      switch (type) {
        case TYPE_BOOLEAN:
          newValue = Boolean(value);
          break;
        case TYPE_NUMBER:
          newValue = Number.parseFloat(value);
          break;
        case TYPE_STRING:
          newValue = String(value);
          break;
        default:
      }
    }
    item.value = newValue;
    if (dispatch) this.dispatch(message);
  }

  /**
   * Associates an action with a message
   *
   * @param  {String} message
   * @param  {any} defaultValue - if no null, set de value in message
   * @param  {Function} action - to process a change in dispatch
   * @return {any} - value
   */
  subscribe(message, defaultValue, action) {
    const item = this.getRegisterItem(message);
    item.actions.push(action);
    if (defaultValue != null) this.setRegisterValue(item, message, defaultValue);
    const value = this.getRegisterValue(item);
    if (value != null) {
      this.dispatch(message);
    }
    return value;
  }

  /**
   * The controller sends (down) a message to subscribers
   *
   * @param {String} message - channel
   */
  dispatch(message) {
    // TODO: String conversion if not necessary
    const item = this.getRegisterItem(message);
    item.actions.forEach((action) => action(this.getRegisterValue(item)));
  }

  /**
   * The controller receives (up) a message from the bus
   *
   * @param {String} message - channel
   */
  fire(message) {
    // TODO: data support

    // dispatch message to the bus subscribers
    this.setRegisterValue(null, 'bus', message, true, true);
  }
}

// TODO: on-load event ? propagate to registred controllers
// TODO: on-load page and controller association?

export { AlgController, TYPE_BOOLEAN, TYPE_NUMBER, TYPE_STRING };
