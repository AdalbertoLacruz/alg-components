// @copyright 2017-2018 adalberto.lacruz@gmail.com

import { AlgComponent } from '../base/alg-component.js';
import { AlgController } from '../../controller/alg-controller.js';
import { ObservableAction } from '../types/observable-action.js';
// eslint-disable-next-line
import { ObservableEvent } from '../types/observable-event.js';
import { ObservableMessage } from '../types/observable-message.js';

/**
 * Manager for the component messages emited to the bus
 * @class
 */
class MessageManager {
  /**
   * @param {AlgComponent} target Element who fire messages
   */
  constructor(target) {
    this.target = target;

    /** @type {ObservableMessage} Cache for last defined */
    this.entry = null;

    /** @type {Map<String, ObservableMessage>} Messages storage */
    this.register = new Map();
  }

  // ------------------------------------------------- MESSAGE

  /**
   * Compose the name prefix
   * @return {String}
   */
  calculatePrefix() {
    const id = this.target.id ? this.target.id : this.target.tagName;
    return `${id}_${this.target.hash}<msg>`;
  }

  /**
   * Defines a message (output).
   *
   * options:
   *   isPrebinded - Boolean, attribute on-name predefined
   *   letRepeat - Boolean, Could send same message as previous to the bus
   *   toAttribute - Boolean true/String name
   *   toEvent - Boolean true/String name
   *
   * @param {String} name messageName
   * @param {Object} options
   * @return {MessageManager} this.entry has the definded message
   */
  define(name, options = {}) {
    const {isPreBinded, letRepeat, toAttribute, toEvent} = options;
    const register = this.register;

    if (register.has(name)) {
      this.entry = register.get(name);
    } else {
      let entry = this.entry = new ObservableMessage(name);
      entry.prefix = this.calculatePrefix();
      register.set(name, entry);

      if (toAttribute != null) entry.toAttribute = toAttribute;
      if (toEvent != null) entry.toEvent = toEvent;
      if (isPreBinded != null) entry.isPreBinded = isPreBinded;
      if (letRepeat != null) entry.letRepeat = letRepeat;
    }

    return this;
  }

  /**
   * We have readed the binded information from attribute
   * such as on-event=[[controller:channel]].
   * If name was not previously defined is an system event, such as `on-click`
   *
   * @param {String} name
   * @param {String | Object} controller
   * @param {String} channel
   * @return {MessageManager}
   */
  defineBinded(name, controller, channel) {
    this.define(name, { toEvent: true });
    this.entry.controllerHandler = (typeof controller === 'string')
      ? AlgController.controllers.get(controller)
      : controller;
    this.entry.channel = channel;

    return this;
  }

  /**
   * Emits a message
   *
   * @param {String} name
   * @param {*} value
   * @return {MessageManager}
   */
  fire(name, value) {
    this.get(name).update(value);

    return this;
  }

  /**
   * Assure an entry
   *
   * @param {String} name
   * @return {ObservableMessage}
   */
  get(name) {
    this.entry = (this.register.has(name))
      ? this.register.get(name)
      : this.define(name).entry;
    return this.entry;
  }

  /**
   * Action on message fire
   *
   * @param {String} name
   * @param {Function} handler
   * @return {MessageManager}
   */
  on(name, handler) {
    if (handler == null) return this;

    this.get(name).observe(handler);

    return this;
  }

  /**
   * Propagates changes in events/attributes to messages
   *
   * @return {MessageManager}
   */
  subscribeTo() {
    let isEventManager = false;

    this.register.forEach((entry, key) => {
      const {toAttribute, toEvent} = entry;
      if (toEvent) {
        const name = (typeof toEvent === 'boolean') ? key : toEvent;
        this.target.eventManager.on(name, (value) => { entry.update(value); });
        isEventManager = true;
      } else if (toAttribute) {
        const name = (typeof toAttribute === 'boolean') ? key : toAttribute;
        this.target.attributeManager.onChange(name, (value) => { entry.update(value); });
      }
    });
    if (isEventManager) this.target.eventManager.subscribe();

    return this;
  }

  /**
   * Defines a transformer to set the value
   *
   * @param {Function} handler
   * @return {MessageManager}
   */
  transformer(handler) {
    this.entry.transformer = handler;
    return this;
  }

  /**
   * Function to calculate when fire the message
   * @param {Function} handler handler(value)
   * @return {MessageManager}
   */
  trigger(handler) {
    this.entry.trigger = handler;
    return this;
  }

  /**
   * For PrBinded definition, update controller/channel
   * @return {MessageManager}
   */
  updatePreBinded() {
    const {controllerHandler, id} = this.target;
    if (!controllerHandler || !id) return this;

    this.register.forEach((entry, key) => {
      if (entry.isPreBinded) {
        entry.controllerHandler = controllerHandler;
        entry.channel = `${id}_${key}`.toUpperCase();
      }
    });

    return this;
  }

  // ------------------------------------------------- ACTION

  /** @type {Map<String, ObservableAction>} Input actions definition */
  get actions() { return this._actions || (this._actions = new Map()); }

  /**
   * Subscribe actions/exports to the controller
   */
  connectToController() {
    if (!this._actions && !this._exportRegister) return;

    const controllerHandler = this.target.controllerHandler;
    const id = this.target.id;
    if (!controllerHandler || !id) return;

    controllerHandler.busManager.addActor(id, this);
  }

  /**
   * If action is defined, execute it. options:
   *  bool isLink
   * @param {String} action
   * @param {*} message
   * @param {Object} options
   * @return {MessageManager}
   */
  dispatchAction(action, message, options = {}) {
    const { isLink } = options;
    if (this.actions.has(action)) this.actions.get(action).dispatch(message, { isLink });
    return this;
  }

  /**
   * Defines an action (input)
   * @param {String} name
   * @param {Function} handler
   * @return {MessageManager}
   */
  from(name, handler) {
    const entry = this.actions.has(name)
      ? this.actions.get(name)
      : this.actions.set(name, new ObservableAction()).get(name);
    entry.subscribe(handler);
    return this;
  }

  // ------------------------------------------------- Export

  /** @type {Map<String, ObservableEvent>} component export */
  get exportRegister() { return this._exportRegister || (this._exportRegister = new Map()); }

  /**
   * Define an observable as visible outside the comopnent, through the BusController import
   * @param {String} name
   * @param {ObservableEvent} observable
   * @return {MessageManager}
   */
  export(name, observable) {
    this.exportRegister.set(name, observable);
    return this;
  }
}

export { MessageManager };
