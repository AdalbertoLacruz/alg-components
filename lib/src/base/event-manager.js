// @copyright 2017-2018 adalberto.lacruz@gmail.com

import { AlgComponent } from './alg-component.js';
import { ObservableEvent } from '../types/observable-event.js';
import { TYPE_BOOL, TYPE_EVENT } from '../util/constants.js';

/**
 * Manages mouse and keyboard events (and others)
 *
 * @class
 */
class EventManager {
  /**
   * @constructor
   * @param {*} target
   */
  constructor(target) {
    // Element that fire events: AlgComponent | document | window
    this.target = target;

    /** @type {EventItem} Last recovered EventItem from register */
    this.entry = new EventItem(); // to avoid check nulls

    /** @type {String} To name non HTMLElements */
    this.prefix = '';

    /** @type {Map<String, EventItem>} Active storage for event definition and data. */
    this.register = new Map();
  }

  /**
   * Cache to let a component unsubscribe to global events
   * Component - [{eventName, handler, isLink}, ...]
   * @type {WeakMap<HTMLElement, Array<HandlersRegisterItem>>}
   */
  get handlersRegister() {
    return this._handlersRegister || (this._handlersRegister = new WeakMap());
  }

  /**
   * Storage for key events definition associated with handlers
   * 'ctrl+shift+enter:keypress': KeyItem
   * @type {Map<String, KeyItem>}
   */
  get keyRegister() {
    return this._keyRegister || (this._keyRegister = new Map());
  }

  // /**
  //  * Active storage for event definition and data.
  //  * 'eventName': {
  //  *    custom: null/true for custom event
  //  *    data: Observable,
  //  *    init: function to create data,
  //  *    key: null/true
  //  *    handler: event function, (item == value definition object associate with that eventName)
  //  *    listener: handler function binded for unsubscribe
  //  *    reflectToAttribute: Set(Attribute names)
  //  *    switch: null/true, subscribe/unsubscribe specific for this event (mousemove)
  //  * }
  //  * @type {Map<String, Object>}
  //  */
  // get register() {
  //   return this._register || (this._register = new Map());
  // }

  // /**
  //  * Add a event definition on register if not exist, and initialize it.
  //  *
  //  * options
  //  *  custom: true/false. false => addEventHandler
  //  *
  //  * @param {String} eventName
  //  * @param {Object} options
  //  * @return {Object}
  //  */
  // _assureRegisterDefinition(eventName, options = {}) {
  //   let item = this.register.get(eventName);
  //   if (item) return item;

  //   let proto = EventManager.definitions.get(eventName);
  //   const generic = proto != null;
  //   if (!proto) proto = EventManager.definitions.get('default');

  //   item = Object.assign({}, proto);
  //   this.register.set(eventName, item);
  //   item.init(item, this);
  //   if (generic) item.data.name = eventName;
  //   if (options.custom) item.handler = null;
  //   this[this.cachedName(eventName)] = item.data;

  //   return item;
  // }

  // /**
  //  * Cache name for data in event
  //  * @param {String} eventName
  //  * @return {String}
  //  */
  // cachedName(eventName) { return '__' + eventName; }

  /**
   * Compose the name prefix
   * @return {String}
   */
  calculatePrefix() {
    if (this.target.id != null) { // HTMLElement
      const id = this.target.id ? this.target.id : this.target.tagName;
      return `${id}_${this.target.hash}<event>`;
    } else {
      return this.prefix; // windows
    }
  }

  /**
   * Add an item to the register
   * Ex.: define(
   *   'trackStart',
   *   new ObservableEvent('trackStart').setType(TYPE_EVENT),
   *   ['mousedown'])
   *
   * @param {String} name
   * @param {ObservableEvent} data
   * @param {Array<String>} visibility
   * @return {*}
   */
  define(name, data, visibility = null) {
    // const item = { data: data };
    // this.register.set(eventName, item);
    // item.data.context = item;
    // this[this.cachedName(eventName)] = data;
    // if (visibility != null) this.visibleTo(eventName, visibility);
    // return this;
    data.prefix = this.calculatePrefix();
    this.entry = new EventItem({ data, name });
    this.register.set(name, this.entry);

    if (visibility != null) this.visibleTo(name, visibility);
    return this;
  }

  /**
   * Disable the observable event
   * @param {String} eventName
   * @return {EventManager}
   */
  disableEvent(eventName) {
    this.getObservable(eventName).disabled = true;
    return this;
  }

  /**
   * Trigger an event
   * @param {String} eventName
   * @param {*} event
   * @return {EventManager}
   */
  fire(eventName, event = null) {
    this.getObservable(eventName).update(event);
    // setTimeout(() => data.update(event), 0);

    return this;
  }

  /**
   * Returns an entry from the register
   * If not exist, then create and initialize it
   * @param {String} eventName
   * @return {EventItem}
   */
  get(eventName) {
    if (this.entry.name === eventName) return this.entry;

    if (this.register.has(eventName)) {
      this.entry = this.register.get(eventName);
      return this.entry;
    }

    const entry = this.entry = EventManager.definitions.has(eventName)
      ? EventManager.definitions.get(eventName).clone()
      : EventManager.definitions.get('default').clone();
    entry.init(entry, this); // reentry code
    entry.name = entry.data.name = eventName;
    entry.data.prefix = this.calculatePrefix();
    this.register.set(eventName, entry);

    return entry;
  }

  // /**
  //  * Return the Storage for the event. If not exist then create it.
  //  *
  //  * options
  //  *  custom: true/false
  //  *  link: true/false
  //  *
  //  * @param {String} eventName
  //  * @param {Object} options
  //  * @return {ObservableEvent}
  //  */
  // getObservable(eventName, options = {}) {
  //   let cache = this[this.cachedName(eventName)];
  //   if (cache != null) return cache;

  //   const item = this._assureRegisterDefinition(eventName, options);
  //   cache = item.data;
  //   this[this.cachedName(eventName)] = cache;
  //   return cache;
  // }

  /**
   * Return the Storage for the event. If not exist then create it.
   * @param {String} eventName
   * @return {ObservableEvent}
   */
  getObservable(eventName) {
    return this.get(eventName).data;
  }

  /**
   * True if eventName is defined in register
   * @param {String} eventName
   * @return {Boolean}
   */
  isDefined(eventName) { // TODO: deprecated?
    return this.register.has(eventName);
  }

  /**
   * Returns the handlers Set for the keyEvent
   * @param {String} keyEvent
   * @return {KeyItem}
   */
  _keyDefinition(keyEvent) {
    let item = this.keyRegister.get(keyEvent);
    if (item == null) {
      item = new KeyItem();
      this.keyRegister.set(keyEvent, item);
    }
    return item;
  }

  /**
   * Process the keyboard event
   * @param {KeyboardEvent} event
   * @param {Map<String, *>} context
   */
  _keyHandler(event, context) {
    if (event.repeat) return;

    // Build keyEvent
    // let keyEvent = '';
    // ['alt', 'ctrl', 'shift'].forEach((key) => {
    //   if (event[key + 'Key']) {
    //     if (keyEvent.length > 0) keyEvent += '+';
    //     keyEvent += key;
    //   }
    // });
    let keyEvent = ['alt', 'ctrl', 'shift'].reduce((acc, key) => {
      return (event[key + 'Key'])
        ? `${acc}${acc.length ? '+' : ''}${key}`
        : acc;
    }, '');

    const combo = keyEvent;
    let key = this._normalize(event.key, event.keyCode);

    // if (keyEvent.length > 0) keyEvent += '+';
    // keyEvent += (key + ':' + event.type);
    // keyEvent = keyEvent.toLowerCase();
    keyEvent = `${keyEvent}${keyEvent.length ? '+' : ''}${key}:${event.type}`.toLowerCase();

    const response = new ExtKeyboardEvent({
      combo: combo.toLowerCase(),
      key: key.toLowerCase(),
      event: event.type,
      keyboardEvent: event
    });

    // const item = this.keyRegister.get(keyEvent);
    // if (item != null) {
    //   item.forEach((handler) => handler(response));
    // }
    if (this.keyRegister.has(keyEvent)) {
      const item = this.keyRegister.get(keyEvent);
      if (item.linkers) {
        item.linkers.forEach((handler) => handler(response));
      }
      if (item.observers) {
        item.observers.forEach((handler) => {
          Promise.resolve().then(() => handler(response));
        });
      }
    }
  }

  /**
   * Look for a key replacement
   * @param {String} key
   * @param {Number} code
   * @return {String}
   */
  _normalize(key, code) {
    // let normal = EventManager.keyNormalizer[code];
    // if (normal == null) normal = EventManager.keyNormalizer[key];
    // return (normal != null) ? normal : key;
    const normal = EventManager.keyNormalizer[code] || EventManager.keyNormalizer[key];
    return normal || key;
  }

  /**
   * External subscription to the event
   *
   * options
   *   link: true, synchronous dispath
   *   me: this (calling component) - to unsubscribe
   *
   * @param {String} eventName - click, ...
   * @param {Function} handler - code to execute on event. If hander == null, only forces event definition
   * @param {Object} options
   * @return {EventManager}
   */
  on(eventName, handler = null, options = {}) {
    const {link, me} = options;
    const data = this.getObservable(eventName);

    if (handler != null) {
      // if (options.link) data.link(handler); else data.observe(handler);
      link ? data.link(handler) : data.observe(handler);
    }
    if (me != null && handler != null) {
      this.storeHandler(me, eventName, handler, link);
    }
    return this;
  }

  /**
   * Set Attrbute on event change. Assure don't repeat.
   *
   * options
   *  String attributeName: attribute to change
   *  HTMLElement target: by default the component
   *  String attributeType: 'true-false' or similar
   *  Boolean init: True, inmediate attribute reflect
   *
   * @param {String} eventName
   * @param {Object} options
   * @return {EventManager}
   */
  onChangeReflectToAttribute(eventName, options = {}) { // TODO: review callers
    // const item = this._assureRegisterDefinition(eventName, options);
    // const itemReflectToAttribute = item.reflectToAttribute || (item.reflectToAttribute = new Set());
    // const attribute = options.attribute || eventName;
    // if (!itemReflectToAttribute.has(attribute)) { // We assume target is always the same
    //   itemReflectToAttribute.add(attribute);
    //   item.data.onChangeReflectToAttribute(target, options);
    // }
    let {attributeName, target, attributeType, init} = options;
    if (!attributeName) attributeName = eventName;
    const item = this.get(eventName);

    if (!item.hasAttributeReflected(attributeName)) {
      item.data.onChangeReflectToAttribute(target || this.target, {
        attribute: attributeName,
        type: attributeType,
        init
      });
    }

    return this;
  }

  /**
   * Set Class on Event
   *
   * options
   *  String className: class to set/remove
   *  HTMLElement target: by default, the component
   *
   * @param {String} eventName
   * @param {Object} options
   * @return {EventManager}
   */
  onChangeReflectToClass(eventName, options = {}) { // TODO: review callers
    // const item = this._assureRegisterDefinition(eventName, options);
    // const itemReflectToClass = item.reflectToClass || (item.reflectToClass = new Set());
    // if (!itemReflectToClass.has(className)) {
    //   itemReflectToClass.add(className);
    //   item.data.onChangeReflectToClass(target, className);
    // }

    let { className, target } = options;
    if (!className) className = eventName;
    const item = this.get(eventName);

    if (!item.hasClassReflected(className)) {
      item.data.onChangeReflectToClass(target || this.target, className);
    }

    return this;
  }

  /**
   * Copy from event
   *
   * @param {String} eventName
   * @param {*} target - HTML element
   */
  onChangeReflectToEvent(eventName, target) {
    const item = this.getObservable(eventName);
    const reflected = this.getObservable(target);
    item.link((value, context) => {
      reflected.context.event = context.event;
      reflected.update(value);
    });
    return this;
  }

  /**
   * Send a custom event on value change
   *
   * options
   *  custom: true/false
   *  to: objetive to trigger the message
   *
   * @param {String} eventName
   * @param {*} target
   * @param {String} channel
   * @param {Object} options
   * @return {EventManager}
   */
  onChangeFireMessage(eventName, target, channel, options = {}) { // TODO: deprecated?
    // const item = this._assureRegisterDefinition(eventName, options);
    // const itemFireMessage = item.fireMessage || (item.fireMessage = new Set());
    // if (!itemFireMessage.has(channel)) {
    //   itemFireMessage.add(channel);
    //   item.data.onChangeFireMessage(target, channel, options.to);
    // }
    console.log('onChangeFireMessage deprecated');
    return this;
  }

  /**
   * Manages key events such as:
   *  'alt+ctrl+shift+enter:keydown'
   *  'space enter'
   * Must keep strictly the order (alt, ctrl, shift).
   * Prefer ':keydown' or ':keyup' to ':keypress' (default)
   *
   * @param {String} events
   * @param {Function} handler
   * @param {Boolean} link
   * @return {EventManager}
   */
  onKey(events, handler, link = false) {
    // const eventsList = events.split(' ');
    // eventsList.forEach((eventName) => { this._onKeySingle(eventName, handler, link); });
    events.trim().split(' ').forEach((eventName) => {
      if (eventName) this._onKeySingle(eventName, handler, link);
    });

    return this;
  }

  /**
   * Manages a single key event definition (enter:keydown)
   * @param {String} eventName
   * @param {Function} handler
   * @param {Boolean} link
   */
  _onKeySingle(eventName, handler, link = false) {
    const parts = eventName.split(':');
    const keys = parts[0];
    // let event = parts[1];
    // if (event == null) event = 'keypress';
    const event = (parts.length > 1) ? parts[1] : 'keypress';
    // const _eventName = (keys + ':' + event).toLowerCase();
    const _eventName = `${keys}:${event}`.toLowerCase();

    // const item = this._keyDefinition(_eventName);
    // item.add(handler);

    // save user key handler
    this._keyDefinition(_eventName).add(handler, link);

    // const registerItem = this._assureRegisterDefinition(event);

    // Subscribe general event
    const registerItem = this.get(event);
    if (!registerItem.key) {
      registerItem.key = true;
      this.onLink(event, this._keyHandler.bind(this));
    }
  }

  /**
   * on specialized for link subscription
   * @param {String} eventName
   * @param {Function} handler
   * @return {EventManager}
   */
  onLink(eventName, handler) {
    return this.on(eventName, handler, {link: true});
  }

  /**
   * Cache information for further component unsubscribe to global events
   * @param {HTMLElement} me
   * @param {String} eventName
   * @param {Function} handler
   * @param {Boolean} isLink - The handler is attached as link (not as observe)
   */
  storeHandler(me, eventName, handler, isLink) {
    let register = this.handlersRegister.get(me);
    if (!register) {
      register = [];
      this.handlersRegister.set(me, register);
    }

    // const item = {eventName, handler, isLink};
    // register.push(item);
    register.push(new HandlersRegisterItem({eventName, handler, isLink}));
  }

  /**
   * After on(...), subscribe the events to the target. Supports multiple calls
   * @return {EventManager}
   */
  subscribe() {
    const target = this.target;
    // for (const [event, item] of this.register) {
    //   if (item.data != null && item.handler != null && item.listener == null && item.switch == null) {
    //     item.listener = item.handler.bind(this, item);
    //     target.addEventListener(event, item.listener);
    //   }
    // }

    this.register.forEach((item, eventName) => {
      if (item.data != null &&
          item.handler != null &&
          item.listener == null &&
          item.switchSubscriber == null) {
        item.listener = item.handler.bind(this, item);

        target.addEventListener(eventName, item.listener);
      }
    });
    return this;
  }

  /**
   * Subscribe only the eventName
   * @param {String} eventName
   * @return {EventManager}
   */
  subscribeSwitch(eventName) {
    let item = this.register.get(eventName); // We must have a active handler
    if (item == null || item.switchSubscriber == null) return;

    item.switchListener = item.handler.bind(this, item);
    this.target.addEventListener(eventName, item.switchListener);

    return this;
  }

  /**
   * Remove all target event listeners
   * @return {EventManager}
   */
  unsubscribe() {
    // for (const [event, item] of this.register) {
    //   if (item.listener != null) {
    //     this.target.removeEventListener(event, item.listener);
    //     item.listener = null;
    //   }
    // }
    this.register.forEach((item, eventName) => {
      if (item.listener != null) {
        this.target.removeEventListener(eventName, item.listener);
        item.listener = null;
      }
    });

    return this;
  }

  /**
   * Unsubscribe the component (me) in global events or partial in parents
   * @param {HTMLElement} me
   * @param {String} name if != null, only unsubscribe to this event
   * @return {EventManager}
   */
  unsubscribeMe(me, name = null) {
    // const register = this.handlersRegister.get(me);
    // let indexDeleted;

    // if (register) {
    //   register.forEach((item, index) => {
    //     const {eventName, handler, isLink} = item;
    //     if (name == null || name === eventName) {
    //       this.getObservable(eventName).unSubscribe(handler, isLink);
    //       indexDeleted = index;
    //     }
    //   });
    // }

    // // delete
    // if (name == null) {
    //   this.handlersRegister.delete(me);
    // } else {
    //   if (indexDeleted != null) register.splice(indexDeleted, 1);
    // }

    let register = this.handlersRegister.get(me);
    if (!register) return this;

    register = register.filter((item) => {
      const { eventName, handler, isLink } = item;
      if (name == null || name === eventName) {
        this.getObservable(eventName).unSubscribe(handler, isLink);
        return false;
      }
      return true; // to keep item
    });

    register.length
      ? this.handlersRegister.set(me, register)
      : this.handlersRegister.delete(me);

    return this;
  }

  /**
   * Unsubscribe only eventName
   * @param {String} eventName
   * @return {EventManager}
   */
  unsubscribeSwitch(eventName) {
    let item = this.register.get(eventName);
    if (item == null || item.switchListener == null) return this;

    this.target.removeEventListener(eventName, item.switchListener);
    item.switchListener = null;
    return this;
  }

  /**
   * Make the eventName visible to the targets context
   * ex. visibleTo('mouseup', ['trackEnd']) => in trackEnd context['mouseup'] == observable
   * @param {String} eventName
   * @param {Array<String>} targets
   * @return {EventManager}
   */
  visibleTo(eventName, targets) {
    if (targets == null) return this;

    const item = this.getObservable(eventName);
    // for (const target of targets) {
    //   const targetItem = this._assureRegisterDefinition(target);
    //   targetItem['_' + eventName] = item;
    // }
    targets.forEach((target) => {
      this.get(target).data.context[eventName] = item;
    });

    return this;
  }

  // ------------------------------------------------- Static

  /**
   * Global definitions for events
   * 'eventName': {
   *    data: Observable,
   *    init(item, evm): function to create data. item => local object, evm = this eventManager
   *    handler: event function, (item == value definition object associate with that eventName)
   *    switch: null/true, subscribe/unsubscribe specific for this event (mousemove)
   * }
   * @type {Map<String, Object>}
   */
  static get definitions() {
    return this._definitions || (this._definitions = new Map()
      .set('default', new EventItem({
        init: (item, evm) => { item.data = new ObservableEvent('').setType(TYPE_EVENT); },
        handler: (item, e) => { item.data.update(e); }
      }))
      .set('blur', new EventItem({
        init: (item, evm) => { item.data = new ObservableEvent('blur').setType(TYPE_EVENT); },
        handler: (item, e) => { item.data.update(e); }
      }))
      .set('click', new EventItem({
        init: (item, evm) => { item.data = new ObservableEvent('click').setType(TYPE_EVENT); },
        handler: (item, e) => {
          (e.captured = e.captured || []).push(e.currentTarget);
          item.data.update(e);
        }
      }))
      .set('down', new EventItem({
        init: (item, evm) => {
          item.data = new ObservableEvent('down').setType(TYPE_EVENT);
          evm.onLink('mousedown', (event, context) => { item.data.update(event); });
        },
        handler: null
      }))
      .set('focus', new EventItem({
        init: (item, evm) => { item.data = new ObservableEvent('focus').setType(TYPE_EVENT); },
        handler: (item, e) => { item.data.update(e); }
      }))
      .set('focused', new EventItem({
        init: (item, evm) => {
          item.data = new ObservableEvent('focused').setType(TYPE_BOOL, {useTransformer: false});
          item.data.context['event'] = null;

          evm.onLink('focus', (event, context) => {
            item.data.context['event'] = event;
            item.data.update(true);
          });
          evm.onLink('blur', (event, context) => {
            item.data.context['event'] = event;
            item.data.update(false);
          });
        },
        handler: null
      }))
      .set('keydown', new EventItem({
        init: (item, evm) => { item.data = new ObservableEvent('keydown').setType(TYPE_EVENT); },
        handler: (item, e) => { item.data.update(e); }
      }))
      .set('keypress', new EventItem({
        init: (item, evm) => { item.data = new ObservableEvent('keypress').setType(TYPE_EVENT); },
        handler: (item, e) => { item.data.update(e); }
      }))
      .set('keyup', new EventItem({
        init: (item, evm) => { item.data = new ObservableEvent('keyup').setType(TYPE_EVENT); },
        handler: (item, e) => { item.data.update(e); }
      }))
      .set('mousedown', new EventItem({
        init: (item, evm) => { item.data = new ObservableEvent('mousedown').setType(TYPE_EVENT); },
        handler: (item, e) => { item.data.update(e); }
      }))
      // true if mouse button is pressed
      .set('mousehold', new EventItem({
        init: (item, evm) => {
          item.data = new ObservableEvent('mousehold').setType(TYPE_BOOL, {useTransformer: false});
          item.data.context['event'] = null;

          evm.onLink('mousedown', (event, context) => {
            item.data.context['event'] = event;
            item.data.update(true);
          });
          evm.onLink('mouseup', (event, context) => {
            item.data.context['event'] = event;
            item.data.update(false);
          });
        },
        handler: null
      }))
      .set('mousemove', new EventItem({
        init: (item, evm) => { item.data = new ObservableEvent('mousemove').setType(TYPE_EVENT); },
        handler: (item, e) => { item.data.update(e); },
        switchSubscriber: true
      }))
      .set('mouseup', new EventItem({
        init: (item, evm) => { item.data = new ObservableEvent('mouseup').setType(TYPE_EVENT); },
        handler: (item, e) => { item.data.update(e); }
      }))
      // True if the element is currently being pressed by a "pointer," which is loosely
      // defined as mouse or touch input (but specifically excluding keyboard input).
      .set('pointerDown', new EventItem({
        init: (item, evm) => {
          item.data = new ObservableEvent('pointerDown').setType(TYPE_BOOL, {useTransformer: false});
          item.data.context['event'] = null;

          evm.onLink('mousehold', (value, context) => {
            item.data.context['event'] = context.event;
            item.data.update(value);
          });
        },
        handler: null
      }))
      // If true, the user is currently holding down the button (mouse down or spaceKey).
      .set('pressed', new EventItem({
        init: (item, evm) => {
          item.data = new ObservableEvent('pressed').setType(TYPE_BOOL, {useTransformer: false});
          const idcontext = item.data.context;
          idcontext['event'] = null;

          evm.onLink('blur', (event, context) => {
            idcontext['event'] = event;
            item.data.update(false);
          });
          evm.onLink('mousehold', (value, context) => {
            idcontext['event'] = context['event'];
            item.data.update(value);
          });
          evm.onKey('space:keydown', (event) => {
            const keyboardEvent = event.keyboardEvent;
            keyboardEvent.preventDefault();
            keyboardEvent.stopImmediatePropagation();
            idcontext['event'] = keyboardEvent;
            item.data.update(true);
          }, true);
          evm.onKey('space:keyup', (event) => {
            idcontext['event'] = event.keyboardEvent;
            item.data.update(false);
          }, true);
        },
        handler: null
      }))
      // True if the input device that caused the element to receive focus was a keyboard.
      .set('receivedFocusFromKeyboard', new EventItem({
        init: (item, evm) => {
          item.data = new ObservableEvent('receivedFocusFromKeyboard')
            .setType(TYPE_BOOL, {useTransformer: false});
          const idcontext = item.data.context;
          idcontext['event'] = null;
          idcontext['focused'] = false;
          idcontext['isLastEventPointer'] = false;
          idcontext['pointerDown'] = false;

          evm.onLink('focused', (value, context) => {
            idcontext['focused'] = value;
            idcontext['event'] = context.event;
            idcontext['isLastEventPointer'] = false;
            item.data.update(!idcontext['pointerDown'] && idcontext['focused']);
          });
          evm.onLink('pointerDown', (value, context) => {
            idcontext['pointerDown'] = value;
            idcontext['event'] = context.event;
            idcontext['isLastEventPointer'] = true;
            item.data.update(!idcontext['pointerDown'] && idcontext['focused']);
          });
        },
        handler: null
      }))
      .set('tap', new EventItem({
        init: (item, evm) => {
          item.data = new ObservableEvent('tap').setType(TYPE_EVENT);

          evm.onLink('click', (event, context) => { item.data.update(event); });
        },
        handler: null
      }))
      .set('up', new EventItem({
        init: (item, evm) => {
          item.data = new ObservableEvent('up').setType(TYPE_EVENT);
          evm.onLink('mouseup', (event, context) => { item.data.update(event); });
        },
        handler: null
      }))
    );
  }

  /**
   * Table for key code change. First numeric, then by text
   * @type {Object<(Number | String), String>}
   */
  static get keyNormalizer() {
    return this._normalizer || (this._normalizer = {
      10: 'Enter',
      ' ': 'Space',
      '↵': 'Enter',
      'ArrowLeft': 'left',
      'ArrowRight': 'right',
      'ArrowUp': 'up',
      'ArrowDown': 'down'
    });
  }

  /** global (ducument) eventManager  */
  static get documentEvm() { return this._documentEvm || (this._documentEvm = new EventManager(document)); }

  /** global (window) eventManager */
  static get windowEvm() { return this._windowEvm || (this._windowEvm = new EventManager(window)); }
}

// --------------------------------------------------- Aux Classes

/**
 * Extended Keyboard Event, for onKey handlers
 */
class ExtKeyboardEvent {
  /**
   * @constructor
   * @param {Object} options
   */
  constructor(options = {}) {
    /** @type {String} alt+ctrl+shift modifiers */
    this.combo = options.combo;

    /** @type {String} char */
    this.key = options.key;

    /** @type {KeyboardEvent} original KeyboardEvent */
    this.keyboardEvent = options.keyboardEvent;

    /** @type {String} keyboardEvent.type, such as keydown, keyup, keypress */
    this.event = options.event;
  }
}

/**
 * Event definition
 */
class EventItem {
  /**
   * @param {Object} options
   */
  constructor(options = {}) {
    /** @type {ObservableEvent} */
    this.data = options.data; // The observable itself

    /** @type {Function} */
    this.handler = options.handler; // event function. handler(item, event)

    /** @type {Function} */
    this.init = options.init; // Function to create data. init(item, eventManager)

    /** @type {String} */
    this.name = options.name; // eventName, used for entry cache

    // null or true, subscribe/unsubscribe specific to this event (mousemove)
    /** @type {Boolean} */
    this.switchSubscriber = options.switchSubscriber;

    //

    /** @type {Boolean} */
    this.key = false; // True, if it is a key handler (keypress, keydown, ...)

    /** @type {*} */
    this.listener = null; // handler used for addEventListener. Used also for unsubscribe

    /** @type {Array<String>} */
    this.reflectToAttribute = null; // Attributes to modify on event change

    /** @type {Array<String>} */
    this.reflectToClass = null; // css classes to modify on event change

    /** @type {*} */
    this.switchListener = null; // Handler, as listener, but only for switch subscription
  }

  /**
   * @return {EventItem}
   */
  clone() {
    return new EventItem({
      data: this.data,
      handler: this.handler,
      init: this.init,
      switchSubscriber: this.switchSubscriber
    });
  }

  /**
   * True, if attributeName was previously used
   * @param {String} attributeName
   */
  hasAttributeReflected(attributeName) {
    const reflectToAttribute = this.reflectToAttribute || (this.reflectToAttribute = []);
    return (reflectToAttribute.indexOf(attributeName) > -1)
      ? true
      : (reflectToAttribute.push(attributeName) == null); // false
  }

  /**
   * True, if className was previously used
   * @param {String} className
   */
  hasClassReflected(className) {
    const reflectToClass = this.reflectToClass || (this.reflectToClass = []);
    return (reflectToClass.indexOf(className) > -1)
      ? true
      : (reflectToClass.push(className) == null); // false
  }
}

/**
 * Each item in the handlersRegister
 */
class HandlersRegisterItem {
  /**
   * @constructor
   * @param {Object} options
   */
  constructor(options = {}) {
    /** @type {String} */
    this.eventName = options.eventName;

    /** @type {Function} */
    this.handler = options.handler;

    /** @type {Boolean} */
    this.isLink = options.isLink;
  }
}

/**
 * For each keyEventName ('enter:keydown') the subscribers/linkers handlers list
 */
class KeyItem {
  /** @constructor */
  constructor() {
    /** @type {Array<Function>} Sync handlers list */
    this.linkers = null;

    /** @type {Array<Function>} Async handlers list */
    this.observers = null;
  }

  /**
   * add a handler to linkers/subscribers accordind to link
   * @param {Function} handler
   * @param {Boolean} link
   */
  add(handler, link = false) {
    if (link) {
      const linkers = this.linkers || (this.linkers = []);
      linkers.push(handler);
    } else {
      const observers = this.observers || (this.observers = []);
      observers.push(handler);
    }
  }
}

export { EventManager, ExtKeyboardEvent, EventItem };
