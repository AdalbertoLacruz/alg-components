// @copyright 2017-2018 adalberto.lacruz@gmail.com

import { BusManager } from '../src/base/bus-manager.js';
import { Observable } from '../src/types/observable.js';
import { TYPE_OTHER } from '../src/util/constants.js';

/**
 * Base class for page controllers
 *
 * @type {class}
 */
class AlgController {
  /**
   * @constructor
   */
  constructor() {
    AlgController.controllers.set(this.name, this);

    /** @type {BusManager} Bus controller */
    this.busManager = new BusManager();

    /** @type {Map<String, Observable>} */
    this.register = new Map(); // Storage

    this.define('bus', TYPE_OTHER);
  }

  /** @type {String} */
  get name() { return ''; } // controllerName, to @override

  /**
   * Storage for controller defined in the application.
   *  {"controllerName" : classInstance}
   * @type {Map<String, AlgController>}
   */
  static get controllers() { return this._controllers || (this._controllers = new Map()); }

  /**
   * Update the channel observable value
   * @param {String} channel
   * @param {*} value
   */
  change(channel, value) {
    const entry = this.register.get(channel);
    if (entry) entry.update(value);

    return this;
  }

  /**
   * Define a new registry entry
   * @param {String} name
   * @param {String} type
   * @param {*} value
   * @return {Observable}
   */
  define(name, type, value = null) {
    const entry = new Observable(name)
      .setType(type, { useTransformer: true })
      .setPrefix(this.name);

    if (value != null) entry.value = value;

    this.register.set(name, entry);
    return entry;
  }

  /**
   * The controller receives (up) a message from the bus
   *
   * @param {String} channel - channel
   * @param {*} message
   */
  fire(channel, message) {
    this.register.get('bus').update(new BusMessage(channel, message));
    this.busManager.fire(channel, message);
  }

  /**
   * Returns the channel observable value
   * @param {String} channel
   */
  getValue(channel) {
    const entry = this.register.get(channel);
    return (entry != null) ? entry.value : null;
  }

  /**
   * Associates an action with a channel.
   *
   * @param  {String} channel
   * @param  {*} defaultValue - if != null, set the value in channel.
   * @param  {Function} handler - Function to be called in channel value change.
   * @param  {Object} status - is a return variable, with information about channel find success.
   * @return {*} - The channel value / default value.
   */
  subscribe(channel, defaultValue, handler, status) {
    if (!this.register.has(channel)) {
      status.hasChannel = false;
      return defaultValue;
    }

    status.hasChannel = true;
    const entry = this.register.get(channel).observe(handler);
    if (defaultValue != null) entry.update(defaultValue);

    return entry.value;
  }

  /**
   * Removes the association channel/handler
   * @param {String} channel
   * @param {Function} handler
   */
  unSubscribe(channel, handler) {
    const entry = this.register.get(channel);
    if (entry) entry.unSubscribe(handler);
  }
}

// --------------------------------------------------- BussMessage

/**
 * Object for message in bus
 */
class BusMessage {
  /**
   * @param {String} channel
   * @param {*} message
   */
  constructor(channel, message) {
    this.channel = channel;
    this.message = message;
  }

  /** @override */
  toString() {
    return `${this.channel} = ${this.message}`;
  }
}

// --------------------------------------------------- ControllerStatus

/**
 * Status in controller operations
 */
class ControllerStatus {
  /**
   * options:
   *   Boolean hasChannel: True, Channel found in controller register
   * @param {Object} options
   */
  constructor(options = {}) {
    this.hasChannel = options.hasChannel;
  }
}

export { AlgController, BusMessage, ControllerStatus };
