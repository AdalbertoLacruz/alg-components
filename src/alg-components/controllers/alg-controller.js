// @ts-check

import { ObsString } from '../types/obsString.js';
// TODO: controller and page association?
// TODO: global (app-controller) constructor(isGlobal)

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

  constructor() { // TODO: isGlobal = false
    AlgController.controllers.set(this.name, this);
  }
  /**
   * Assosiate channel - variable
   * @return {Map}
   */
  get bindings() {
    return this._bindings || (this._bindings = this.defineBindings());
  }

  get bus() {
    return this._bus || (this._bus = new ObsString());
  }

  /**
   * Storage for controller defined in the application. {"controllerName" : classInstance}
   * @return {Map<String, *>}
   */
  static get controllers() {
    return this._controllers || (this._controllers = new Map());
  }

  // to @override
  defineBindings() {
    const bindings = new Map();
    bindings.set('bus', this.bus);
    return bindings;
  }

  /**
   * Associates an action with a channel
   *
   * @param  {String} channel
   * @param  {any} defaultValue - if no null, set the value in channel
   * @param  {Function} action - to process a change in dispatch
   * @return {any} - value
   */
  subscribe(channel, defaultValue, action) {
    if (!this.bindings.has(channel)) return defaultValue;
    const bind = this.bindings.get(channel); // observable
    bind.subscribe(action);
    if (defaultValue != null) bind.init(defaultValue);
    return bind.value;
  }

  /**
   * The controller receives (up) a message from the bus
   *
   * @param {String} channel - channel
   */
  fire(channel) {
    // TODO: message
    this.bus.set(channel);
  }
}

// TODO: on-load event ? propagate to registred controllers
// TODO: on-load page and controller association?

export { AlgController };
