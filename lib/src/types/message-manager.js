import { ObservableMessage } from './observable-message.js';
import { AlgComponent } from '../base/alg-component.js';
import { AlgController } from '../../controller/alg-controller.js';

// @copyright 2017-2018 adalberto.lacruz@gmail.com

/**
 * Manager for the component messages emited to the bus
 * @class
 */
class MessageManager {
  /**
   *
   * @param {?} target - AlgComponent
   */
  constructor(target) {
    this.target = target;

    /** @type {ObservableMessage} Last defined */
    this.entry = null;
  }

  /**
   * Messages storage
   * @type {Map<String, ObservableMessage>}
   */
  get register() { return this._register || (this._register = new Map()); }

  /**
   * Defines a message
   * @param {String} name
   * @param {Object} options
   * @return {MessageManager}
   */
  define(name, options = {}) {
    const {isPreBinded, letRepeat, toAttribute, toEvent} = options;
    const register = this.register;

    if (register.has(name)) {
      this.entry = register.get(name);
    } else {
      let entry;
      register.set(name, entry = this.entry = new ObservableMessage(name));
      if (toAttribute != null) entry.toAttribute = toAttribute;
      if (toEvent != null) entry.toEvent = toEvent;
      if (isPreBinded != null) entry.isPreBinded = true;
      if (letRepeat != null) entry.letRepeat = true;
    }

    return this;
  }

  /**
   * We have readed the binded information from attribute
   * such on-event=[[controller:channel]].
   * If name was not previously defined is an system event, such as `on-click`
   * @param {String} name
   * @param {String | Object} controller
   * @param {String} channel
   * @return {MessageManager}
   */
  defineBinded(name, controller, channel) {
    const register = this.register;
    let entry = this.entry = register.get(name);

    if (!entry) {
      this.register.set(name, entry = this.entry = new ObservableMessage(name));
      entry.toEvent = true;
    }

    if (typeof controller === 'string') {
      entry.controllerHandler = AlgController.controllers.get(controller);
    } else {
      entry.controllerHandler = controller;
    }
    entry.channel = channel;

    return this;
  }

  /**
   * Emits a message
   * @param {String} name
   * @param {*} value
   * @return {MessageManager}
   */
  fire(name, value) {
    this.entry = this.register.get(name); // TODO:
    if (!this.entry) { this.define(name); }
    this.entry.update(value);

    return this;
  }

  /**
   * Assure an entry
   * @param {String} name
   * @return {ObservableMessage}
   */
  get(name) {
    if (this.register.has(name)) return this.register.get(name);

    this.define(name);
    return this.entry;
  }

  /**
   * Action on message fire
   * @param {String} name
   * @param {Function} handler
   * @return {MessageManager}
   */
  on(name, handler) {
    if (handler == null) return this;
    this.entry = this.get(name);
    this.entry.observe(handler);

    return this;
  }

  /**
   * Propagates changes in events/attributes to messages TODO: attributes
   * @return {MessageManager}
   */
  subscribeTo() {
    // avoid create innecesary managers
    let attributeManager;
    let eventManager;

    this.register.forEach((entry, key) => {
      const {toAttribute, toEvent} = entry;
      if (toEvent) {
        if (!eventManager) eventManager = this.target.eventManager;
        const name = (typeof toEvent === 'boolean') ? key : toEvent;
        eventManager.on(name, (value) => { entry.update(value); });
      } else if (toAttribute) {
        if (!attributeManager) attributeManager = this.target.attributeManager;
        const name = (typeof toAttribute === 'boolean') ? key : toAttribute;
        attributeManager.onChange(name, (value) => { entry.update(value); });
      }
    });
    // @ts-ignore
    if (eventManager) eventManager.subscribe();

    return this;
  }

  /**
   * Defines a transformer to set the value
   * @param {Function} handler
   * @return {MessageManager}
   */
  transformer(handler) {
    this.entry.transformer = handler;
    return this;
  }

  /**
   * Function to calculate when fire the message
   * @param {Function} handler
   * @return {MessageManager}
   */
  trigger(handler) {
    this.entry.trigger = handler;
    return this;
  }

  /**
   * For Prebinded definition, update controller/channel
   * @return {MessageManager}
   */
  updatePrebinded() {
    const {controller, id} = this.target;
    if (!controller || !id) return this;

    const controllerHandler = (typeof controller === 'string')
      ? AlgController.controllers.get(controller)
      : controller;

    this.register.forEach((entry, key) => {
      if (entry.isPreBinded) {
        entry.controllerHandler = controllerHandler;
        entry.channel = `${id}_${key}`.toUpperCase();
      }
    });

    return this;
  }
}

export { MessageManager };
