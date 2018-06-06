// @copyright 2017-2018 adalberto.lacruz@gmail.com

// eslint-disable-next-line
import { MessageManager } from './message-manager.js';
// eslint-disable-next-line
import { ObservableEvent } from '../types/observable-event.js';

/**
 * Manager for actions subscription
 * The controlled components define actions in their messageManager.
 */
class BusManager {
  /** @constructor */
  constructor() {
    /** @type {Map<String, Array<MessageManager>>} <id, [messageManager, ...]> from components controlled */
    this.actors = new Map();
  }

  /** @type {Map<String, Set<Function>>} Register for onFire handlers */
  get fireRegister() { return this._fireRegister || (this._fireRegister = new Map()); }

  /**
   * Add an Actor to actors list. The entry point for the actor is the messageManager.
   * @param {String} id
   * @param {MessageManager} mm
   * @return {BusManager}
   */
  addActor(id, mm) {
    const entry = this.actors.has(id)
      ? this.actors.get(id)
      : this.actors.set(id, []).get(id);
    entry.push(mm);
    return this;
  }

  /**
   * Execute actions in the component
   * @param {String} id
   * @param {String} action
   * @param {*} message
   * @return {BusManager}
   */
  actorFire(id, action, message) {
    if (this.actors.has(id)) {
      this.actors.get(id).forEach((mm) => mm.dispatchAction(action, message));
    }
    return this;
  }

  /**
   * When controller receive a message execute the associate handlers
   * @param {String} channel
   * @param {*} message
   * @return {BusManager}
   */
  fire(channel, message) {
    if (!this.fireRegister.has(channel)) return this;

    this.fireRegister.get(channel).forEach((handler) => handler(message));
    return this;
  }

  /**
   * Send actions to execute in components
   * @param {String} id
   * @param {String} action
   * @param {*} message
   * @return {BusManager}
   */
  fireAction(id, action, message) {
    if (id != null) {
      Promise.resolve().then(() => this.actorFire(id, action, message));
    } else { // broadcast
      this.actors.forEach((mmArray, id) => {
        Promise.resolve().then(() => this.actorFire(id, action, message));
      });
    }
    return this;
  }

  /**
   * True if id is in actors list
   * @param {String} id
   */
  hasActor(id) {
    return this.actors.has(id);
  }

  /**
   * Recovers an observable exported by an actor. Could be null
   * @param {String} id
   * @param {String} name
   * @return {ObservableEvent}
   */
  import(id, name) {
    return this.actors.has(id)
      ? this.actors.get(id)[0].exportRegister.get(name)
      : null;
  }

  /**
   * Define what to do (handler) when a essage is received.
   * Ex.
   *   (['CLICK', 'ACTION'], handler). If CLICK or ACTION is received the handler is executed.
   * @param {Array<String>} channels
   * @param {Function} handler
   * @return {BusManager}
   */
  onFire(channels, handler) {
    if (!channels || !handler) return;

    channels.forEach((channel) => {
      const entry = this.fireRegister.has(channel)
        ? this.fireRegister.get(channel)
        : this.fireRegister.set(channel, new Set()).get(channel);
      entry.add(handler);
    });
    return this;
  }
}

export { BusManager };
