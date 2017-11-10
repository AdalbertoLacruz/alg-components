// @copyright 2017 ALG
// @ts-check

import { ObsString } from '../types/obs-string.js';
import * as Str from '../util/util-str.js';

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
   * @type {String}
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
   * @type {Map}
   */
  get bindings() {
    return this._bindings || (this._bindings = this.defineBindings());
  }

  /** @type {ObsString} */
  get bus() {
    return this._bus || (this._bus = new ObsString());
  }

  /**
   * Storage for controller defined in the application. {"controllerName" : classInstance}
   * @type {Map<String, *>}
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
   * @param  {Object} status - channel information
   * @return {any} - value
   */
  subscribe(channel, defaultValue, action, status) {
    const bind = this.getBinding(channel);
    if (!bind) {
      status.hasChannel = false;
      return defaultValue;
    }
    return bind.subscribe(channel, defaultValue, action, status);
  }

  /**
   * Search a channel in bindings or as observable
   * @param {String} channel
   * @return {*}
   */
  getBinding(channel) {
    let bind = this.bindings.get(channel);
    if (bind) return bind;
    const binderNames = Str.dashToCamelList(channel);

    for (let i = binderNames.length - 1; i >= 0; i--) {
      bind = this[binderNames[i]];
      if (bind) {
        this.bindings.set(channel, bind);
        return bind;
      }
    }
    return null;
  }

  /**
   * The controller receives (up) a message from the bus
   *
   * @param {String} channel - channel
   * @param {*} message
   */
  fire(channel, message) {
    // TODO: message
    this.bus.update(channel);
  }

  /**
   * Removes the association channel/action
   * @param {String} channel
   * @param {Function} action
   */
  unSubscribe(channel, action) {
    const bind = this.bindings.get(channel);
    if (bind) bind.unSubscribe(action);
  }
}

// TODO: on-load event ? propagate to registred controllers
// TODO: on-load page and controller association?

export { AlgController };
