// @copyright 2017-2018 adalberto.lacruz@gmail.com

import { ObservableEvent } from './observable-event.js';

/**
 * Let subscribe to mouse and keyboard events and state variables
 *
 * @class
 */
class EventManager {
  /**
   * @constructor
   * @param {EventTarget} target
   */
  constructor(target) {
    this.target = target;
  }

  /** global (ducument) eventManager  */
  static get document() { return this._document || (this._document = new EventManager(document)); }

  /** global (window) eventManager */
  static get window() { return this._window || (this._window = new EventManager(window)); }

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
      .set('default', {
        init: (item, evm) => { item.data = new ObservableEvent('').setContext(item); },
        handler: (item, e) => { item.data.update(e); }
      })
      .set('blur', {
        init: (item, evm) => { item.data = new ObservableEvent('blur').setContext(item); },
        handler: (item, e) => { item.data.update(e); }
      })
      .set('click', {
        init: (item, evm) => { item.data = new ObservableEvent('click').setContext(item); },
        handler: (item, e) => {
          (e.captured = e.captured || []).push(e.currentTarget);
          item.data.update(e);
        }
      }))
      .set('down', {
        init: (item, evm) => {
          item.data = new ObservableEvent('down').setContext(item);
          evm.on('mousedown', (value) => { item.data.update(value); }, { link: true }); // TODO: other touchs
        },
        handler: null
      })
      .set('focus', {
        init: (item, evm) => { item.data = new ObservableEvent('focus').setContext(item); },
        handler: (item, e) => { item.data.update(e); }
      })
      .set('focused', {
        init: (item, evm) => {
          item.data = new ObservableEvent('focused').setType('boolean').setContext(item);
          item.event = null;
          evm.on('focus', (event) => {
            item.event = event;
            item.data.update(true);
          }, { link: true });
          evm.on('blur', (event) => {
            item.event = event;
            item.data.update(false);
          }, { link: true });
        },
        handler: null
      })
      .set('keydown', {
        init: (item, evm) => { item.data = new ObservableEvent('keydown').setContext(item); },
        handler: (item, e) => { item.data.update(e); }
      })
      .set('keypress', {
        init: (item, evm) => { item.data = new ObservableEvent('keypress').setContext(item); },
        handler: (item, e) => { item.data.update(e); }
      })
      .set('keyup', {
        init: (item, evm) => { item.data = new ObservableEvent('keyup').setContext(item); },
        handler: (item, e) => { item.data.update(e); }
      })
      .set('mousedown', {
        init: (item, evm) => { item.data = new ObservableEvent('mousedown').setContext(item); },
        handler: (item, e) => { item.data.update(e); }
      })
      .set('mousemove', {
        init: (item, evm) => { item.data = new ObservableEvent('mousemove').setContext(item); },
        handler: (item, e) => { item.data.update(e); },
        switch: true
      })
      .set('mouseup', {
        init: (item, evm) => { item.data = new ObservableEvent('mouseup').setContext(item); },
        handler: (item, e) => { item.data.update(e); }
      })
      // true if mouse button is pressed
      .set('mousehold', {
        init: (item, evm) => {
          item.data = new ObservableEvent('mousehold').setType('boolean').setContext(item);
          item.event = null;
          evm.on('mousedown', (event) => {
            item.event = event;
            item.data.update(true);
          }, { link: true });
          evm.on('mouseup', (event) => {
            item.event = event;
            item.data.update(false);
          }, { link: true });
        },
        handler: null
      })
      // True if the element is currently being pressed by a "pointer," which is loosely
      // defined as mouse or touch input (but specifically excluding keyboard input).
      .set('pointerDown', {
        init: (item, evm) => {
          item.data = new ObservableEvent('pointerDown').setType('boolean').setContext(item);
          item.event = null;
          evm.on('mousehold', (value, context) => {
            item.event = context.event;
            item.data.update(value);
          }, { link: true });
        },
        handler: null
      })
      // If true, the user is currently holding down the button (mouse down or spaceKey).
      .set('pressed', {
        init: (item, evm) => {
          item.data = new ObservableEvent('pressed').setType('boolean').setContext(item);
          item.event = null;
          evm.on('blur', (event) => {
            item.event = event;
            item.data.update(false);
          }, { link: true });
          evm.on('mousehold', (value, context) => {
            item.event = context.event;
            item.data.update(value);
          }, { link: true });
          evm.onKey('space:keydown', (event) => {
            const keyboardEvent = event.keyboardEvent;
            keyboardEvent.preventDefault();
            keyboardEvent.stopImmediatePropagation();
            item.event = keyboardEvent;
            item.data.update(true);
          }, true);
          evm.onKey('space:keyup', (event) => {
            item.event = event.keyboardEvent;
            item.data.update(false);
          }, true);
        },
        handler: null
      })
      // True if the input device that caused the element to receive focus was a keyboard.
      .set('receivedFocusFromKeyboard', {
        init: (item, evm) => {
          item.data = new ObservableEvent('receivedFocusFromKeyboard').setType('boolean').setContext(item);
          item.focused = false;
          item.pointerDown = false;
          item.isLastEventPointer = false;
          item.event = null;
          evm.on('focused', (value, context) => {
            item.focused = value;
            item.event = context.event;
            item.isLastEventPointer = false;
            item.data.update(!item.pointerDown && item.focused);
          }, { link: true });
          evm.on('pointerDown', (value, context) => {
            item.pointerDown = value;
            item.event = context.event;
            item.isLastEventPointer = true;
            item.data.update(!item.pointerDown && item.focused);
          }, { link: true });
        },
        handler: null
      })
      .set('tap', {
        init: (item, evm) => {
          item.data = new ObservableEvent('tap').setContext(item);
          evm.on('click', (value) => { item.data.update(value); }, { link: true }); // TODO: other touchs
        },
        handler: null
      })
      .set('up', {
        init: (item, evm) => {
          item.data = new ObservableEvent('up').setContext(item);
          evm.on('mouseup', (value) => { item.data.update(value); }, { link: true }); // TODO: other touchs
        },
        handler: null
      });
  }

  /**
   * Cache to let a component unsubscribe to global events
   * Component - [{eventName, handler}, ...]
   * @type {WeakMap<HTMLElement, Array<Object>>}
   */
  get handlersRegister() {
    return this._handlersRegister || (this._handlersRegister = new WeakMap());
  }

  /**
   * Storage for key events definition.
   * 'ctrl+shift+enter:keypress': Set<handlers>
   * @type {Map<String, Set>}
   */
  get keyRegister() {
    return this._keyRegister || (this._keyRegister = new Map());
  }

  /**
   * Table for key code change. First numeric, then by text
   * @type {Object<(Number | String), String>}
   */
  get keyNormalizer() {
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

  /**
   * Active storage for event definition and data.
   * 'eventName': {
   *    custom: null/true for custom event
   *    data: Observable,
   *    init: function to create data,
   *    key: null/true
   *    handler: event function, (item == value definition object associate with that eventName)
   *    listener: handler function binded for unsubscribe
   *    reflectToAttribute: Set(Attribute names)
   *    switch: null/true, subscribe/unsubscribe specific for this event (mousemove)
   * }
   * @type {Map<String, Object>}
   */
  get register() {
    return this._register || (this._register = new Map());
  }

  /**
   * Add a event definition on register if not exist, and initialize it.
   *
   * options
   *  custom: true/false. false => addEventHandler
   *
   * @param {String} eventName
   * @param {Object} options
   * @return {Object}
   */
  _assureRegisterDefinition(eventName, options = {}) {
    let item = this.register.get(eventName);
    if (item) return item;

    let proto = EventManager.definitions.get(eventName);
    const generic = proto != null;
    if (!proto) proto = EventManager.definitions.get('default');

    item = Object.assign({}, proto);
    this.register.set(eventName, item);
    item.init(item, this);
    if (generic) item.data.name = eventName;
    if (options.custom) item.handler = null;
    this[this.cachedName(eventName)] = item.data;

    return item;
  }

  /**
   * Cache name for data in event
   * @param {String} eventName
   * @return {String}
   */
  cachedName(eventName) { return '__' + eventName; }

  /**
   * Add an item to the register
   * @param {String} eventName
   * @param {*} data
   * @return {*}
   */
  define(eventName, data, visibility = null) {
    const item = { data: data };
    this.register.set(eventName, item);
    item.data.context = item;
    this[this.cachedName(eventName)] = data;
    if (visibility != null) this.visibleTo(eventName, visibility);
    return this;
  }

  /**
   * Trigger async an event
   * @param {String} eventName
   * @param {*} event
   * @return {EventManager}
   */
  fire(eventName, event = {}) {
    const data = this.getObservable(eventName);
    setTimeout(() => data.update(event), 0);

    return this;
  }

  /**
   * Return the Storage for the event. If not exist then create it.
   *
   * options
   *  custom: true/false
   *  link: true/false
   *
   * @param {String} eventName
   * @param {Object} options
   * @return {ObservableEvent}
   */
  getObservable(eventName, options = {}) {
    let cache = this[this.cachedName(eventName)];
    if (cache != null) return cache;

    const item = this._assureRegisterDefinition(eventName, options);
    cache = item.data;
    this[this.cachedName(eventName)] = cache;
    return cache;
  }

  /**
   * True if eventName is defined in register
   * @param {String} eventName
   * @return {Boolean}
   */
  isDefined(eventName) {
    return this.register.has(eventName);
  }

  /**
   * Returns the handlers Set for the keyEvent
   * @param {String} keyEvent
   * @return {Set}
   */
  _keyDefinition(keyEvent) {
    let item = this.keyRegister.get(keyEvent);
    if (item == null) {
      item = new Set();
      this.keyRegister.set(keyEvent, item);
    }
    return item;
  }

  /**
   * Process the keyboard event
   * @param {KeyboardEvent} event
   */
  _keyHandler(event) {
    if (event.repeat) return;

    // Build keyEvent
    let keyEvent = '';
    ['alt', 'ctrl', 'shift'].forEach((key) => {
      if (event[key + 'Key']) {
        if (keyEvent.length > 0) keyEvent += '+';
        keyEvent += key;
      }
    });
    const combo = keyEvent;
    let key = this._normalize(event.key, event.keyCode);

    if (keyEvent.length > 0) keyEvent += '+';
    keyEvent += (key + ':' + event.type);
    keyEvent = keyEvent.toLowerCase();

    const response = {
      combo: combo.toLowerCase(),
      key: key.toLowerCase(),
      event: event.type,
      keyboardEvent: event
    };

    const item = this.keyRegister.get(keyEvent);
    if (item != null) {
      item.forEach((handler) => handler(response));
    }
  }

  /**
   * Look for a key replacement
   * @param {String} key
   * @param {Number} code
   * @return {String}
   */
  _normalize(key, code) {
    let normal = this.keyNormalizer[code];
    if (normal == null) normal = this.keyNormalizer[key];
    return (normal != null) ? normal : key;
  }

  /**
   * External subscription to the event
   *
   * options
   *   custom: true/false
   *   link: true/false
   *   me: this (calling component) - to store in handlers cache
   *
   * @param {String} eventName - click, ...
   * @param {Function} handler - code to execute on event. If hander == null, only forces event definition
   * @param {Object} options
   * @return {EventManager}
   */
  on(eventName, handler = null, options = {}) {
    const data = this.getObservable(eventName, options);
    if (handler != null) {
      if (options.link) data.link(handler); else data.observe(handler);
    }
    const me = options.me;
    if (me != null && handler != null) {
      this.storeHandler(me, eventName, handler, options.link);
    }
    return this;
  }

  /**
   * Set Attrbute on Event. Assure only one handler for attribute name.
   *
   * options
   *  attribute: attribute to change
   *  custom: true is a custom event if we need initialize
   *
   * @param {String} eventName
   * @param {*} target - HTML element
   * @param {Object} options {type: 'true-false' for attribute,
   *    noInit: true for avoid outside attribute reflect}
   * @return {EventManager}
   */
  onChangeReflectToAttribute(eventName, target, options = {}) {
    const item = this._assureRegisterDefinition(eventName, options);
    const itemReflectToAttribute = item.reflectToAttribute || (item.reflectToAttribute = new Set());
    const attribute = options.attribute || eventName;
    if (!itemReflectToAttribute.has(attribute)) { // We assume target is always the same
      itemReflectToAttribute.add(attribute);
      item.data.onChangeReflectToAttribute(target, options);
    }

    return this;
  }

  /**
   * Set Class on Event
   *
   * options
   *  custom: true is a custom event if we need initialize
   *
   * @param {String} eventName
   * @param {*} target - HTML element
   * @param {String} className - attribute to change
   * @param {Object} options
   * @return {EventManager}
   */
  onChangeReflectToClass(eventName, target, className, options = {}) {
    const item = this._assureRegisterDefinition(eventName, options);
    const itemReflectToClass = item.reflectToClass || (item.reflectToClass = new Set());
    if (!itemReflectToClass.has(className)) {
      itemReflectToClass.add(className);
      item.data.onChangeReflectToClass(target, className);
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
  onChangeFireMessage(eventName, target, channel, options = {}) {
    const item = this._assureRegisterDefinition(eventName, options);
    const itemFireMessage = item.fireMessage || (item.fireMessage = new Set());
    if (!itemFireMessage.has(channel)) {
      itemFireMessage.add(channel);
      item.data.onChangeFireMessage(target, channel, options.to);
    }
    return this;
  }

  /**
   * Manages key events such as:
   *  'alt+ctrl+shift+enter:keydown'
   *  'space enter'
   * Must keep strictly the order.
   * @param {String} events
   * @param {Function} handler
   * @return {EventManager}
   */
  onKey(events, handler, link = false) {
    const eventsList = events.split(' ');
    eventsList.forEach((eventName) => { this._onKeySingle(eventName, handler, link); });
    return this;
  }

  /**
   * Manages a single key event definition (enter:keydown)
   * @param {String} eventName
   * @param {Function} handler
   */
  _onKeySingle(eventName, handler, link = false) {
    const parts = eventName.split(':');
    const keys = parts[0];
    let event = parts[1];
    if (event == null) event = 'keypress';
    const _eventName = (keys + ':' + event).toLowerCase();
    const item = this._keyDefinition(_eventName);
    item.add(handler);

    const registerItem = this._assureRegisterDefinition(event);
    if (registerItem.key == null) {
      registerItem.key = true;
      this.on(event, this._keyHandler.bind(this), { link: true });
    }
  }

  /**
   * Cache information for further component unsubscribe to global events
   * @param {HTMLElement} me
   * @param {String} eventName
   * @param {Function} handler
   * @param {Boolean} isLink - The handler is attached as link (not as observe)
   */
  storeHandler(me, eventName, handler, isLink) {
    const handlersRegister = this.handlersRegister;

    let register = handlersRegister.get(me);
    if (!register) {
      register = [];
      handlersRegister.set(me, register);
    }

    const item = {eventName, handler, isLink};
    register.push(item);
  }

  /**
   * After on(...), subscribe the events to the target. Supports multiple calls
   * @return {EventManager}
   */
  subscribe() {
    const target = this.target;
    for (const [event, item] of this.register) {
      if (item.data != null && item.handler != null && item.listener == null && item.switch == null) {
        item.listener = item.handler.bind(this, item);
        target.addEventListener(event, item.listener);
      }
    }
    return this;
  }

  /**
   * Subscribe only the eventName
   * @param {String} eventName
   * @return {EventManager}
   */
  subscribeSwitch(eventName) {
    let item = this.register.get(eventName); // We must have a active handler
    if (item == null || item.switch == null) return;

    item.switchListener = item.handler.bind(this, item);
    this.target.addEventListener(eventName, item.switchListener);
    return this;
  }

  /**
   * Remove all target event listeners
   * @return {EventManager}
   */
  unsubscribe() { // more modular unsubscribe?
    for (const [event, item] of this.register) {
      if (item.listener != null) {
        this.target.removeEventListener(event, item.listener);
        item.listener = null;
      }
    }
    return this;
  }

  /**
   * Unsubscribe the component (me) in global events or partial in parents
   * @param {HTMLElement} me
   * @param {String} name - only unsubscribe to this event
   * @return {EventManager}
   */
  unsubscribeMe(me, name = null) {
    const register = this.handlersRegister.get(me);
    let indexDeleted;

    if (register) {
      register.forEach((item, index) => {
        const {eventName, handler, isLink} = item;
        if (name == null || name === eventName) {
          this.getObservable(eventName).unSubscribe(handler, isLink);
          indexDeleted = index;
        }
      });
    }

    // delete
    if (name == null) {
      this.handlersRegister.delete(me);
    } else {
      if (indexDeleted != null) register.splice(indexDeleted, 1);
    }

    return this;
  }

  /**
   * Unsubscribe only eventName
   * @param {*} eventName
   * @return {EventManager}
   */
  unsubscribeSwitch(eventName) {
    let item = this.register.get(eventName);
    if (item == null || item.switchListener == null) return;
    this.target.removeEventListener(eventName, item.switchListener);
    item.switchListener = null;
    return this;
  }

  /**
   * The eventName is visible in the targets items
   * ex. visibleTo('mouseup', ['trackEnd']) => in trackEnd item._mouseup = observable
   * @param {String} eventName
   * @param {Array<String>} targets
   * @return {EventManager}
   */
  visibleTo(eventName, targets) {
    const item = this.getObservable(eventName);
    for (const target of targets) {
      const targetItem = this._assureRegisterDefinition(target);
      targetItem['_' + eventName] = item;
    }
    return this;
  }
}

export { EventManager };
