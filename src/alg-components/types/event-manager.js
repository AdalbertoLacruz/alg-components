// @copyright 2017 ALG
// @ts-check
import { ObsBoolean } from './obs-boolean.js';
import { Observable } from './observable.js';

/**
 * Let subscribe to mouse and keyboard events
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
   * Storage for event definition and data.
   * 'eventName': {
   *    custom: null/true for custom event
   *    data: Observable,
   *    init: function to create data,
   *    key: null/true
   *    handler: event function, (item == value definition object associate with that eventName)
   *    listener: handler function binded for unsubscribe
   *    switch: null/true, subscribe/unsubscribe specific for this event (mousemove)
   * }
   * @type {Map<String, Object>}
   */
  get register() {
    return this._register || (this._register = new Map()
      .set('default', {
        init: (item) => { item.data = new Observable('', null); },
        handler: (item, e) => { item.data.update(e); }
      })
      .set('blur', {
        init: (item) => { item.data = new Observable('blur', null); },
        handler: (item, e) => { item.data.update(e); }
      })
      .set('click', {
        init: (item) => { item.data = new Observable('click', null); },
        handler: (item, e) => { item.data.update(e); }
      }))
      .set('disabled', {
        init: (item) => { item.data = new ObsBoolean('disabled', false); },
        handler: null
      })
      .set('down', {
        init: (item) => {
          item.data = new Observable('down', null);
          this.on('mousedown', (value) => { item.data.update(value); }, null, true); // TODO: other touchs
        },
        handler: null
      })
      .set('focus', {
        init: (item) => { item.data = new Observable('focus', null); },
        handler: (item, e) => { item.data.update(e); }
      })
      .set('focused', {
        init: (item) => {
          item.data = new ObsBoolean('focused', false);
          this.on('focus', (event) => { item.data.copy(event, true); }, null, true);
          this.on('blur', (event) => { item.data.copy(event, false); }, null, true);
        },
        handler: null
      })
      // mouse or touch is pressed.
      // .set('holdDown', {
      //   init: (item) => {
      //     item.data = new ObsBoolean('holdDown', null);
      //     this.on('mousehold', (value, raw) => { item.data.raw = event; item.data.update(value); }, null, true);
      //   },
      //   handler: null
      // })
      .set('keydown', {
        init: (item) => { item.data = new Observable('keydown', null); },
        handler: (item, e) => { item.data.update(e); }
      })
      .set('keypress', {
        init: (item) => { item.data = new Observable('keypress', null); },
        handler: (item, e) => { item.data.update(e); }
      })
      .set('keyup', {
        init: (item) => { item.data = new Observable('keyup', null); },
        handler: (item, e) => { item.data.update(e); }
      })
      .set('mousedown', {
        init: (item) => { item.data = new Observable('mousedown', null, item); },
        handler: (item, e) => { item.data.update(e); }
      })
      .set('mouseup', {
        init: (item) => { item.data = new Observable('mouseup', null, item); },
        handler: (item, e) => { item.data.update(e); }
      })
      // true if mouse button is pressed
      .set('mousehold', {
        init: (item) => {
          item.data = new ObsBoolean('mousehold', null);
          this.on('mousedown', (event) => { item.data.copy(event, true); }, null, true);
          this.on('mouseup', (event) => { item.data.copy(event, false); }, null, true);
        },
        handler: null
      })
      // True if the element is currently being pressed by a "pointer," which is loosely
      // defined as mouse or touch input (but specifically excluding keyboard input).
      .set('pointerDown', {
        init: (item) => {
          item.data = new ObsBoolean('pointerDown', null);
          this.on('mousehold', (value, event) => { item.data.copy(event, value); }, null, true);
        },
        handler: null
      })
      // If true, the user is currently holding down the button (mouse down or spaceKey).
      .set('pressed', {
        init: (item) => {
          item.data = new ObsBoolean('pressed', null);
          this.on('blur', (event) => { item.data.copy(event, false); }, null, true);
          this.on('mousehold', (value, event) => { item.data.copy(event, value); }, null, true);
          this.onKey('space:keydown', (event) => {
            const keyboardEvent = event.keyboardEvent;
            keyboardEvent.preventDefault();
            keyboardEvent.stopImmediatePropagation();
            item.data.copy(keyboardEvent, true);
          }, true);
          this.onKey('space:keyup', (event) => { item.data.copy(event.keyboardEvent, false); }, true);
        },
        handler: null
      })
      // True if the input device that caused the element to receive focus was a keyboard.
      .set('receivedFocusFromKeyboard', {
        init: (item) => {
          item.data = new ObsBoolean('receivedFocusFromKeyboard', null, item);
          item.focused = false;
          item.pointerDown = false;
          item.isLastEventPointer = false;
          this.on('focused', (value, event) => {
            item.focused = value;
            item.isLastEventPointer = false;
            item.data.copy(event, !item.pointerDown && item.focused);
          }, null, true);
          this.on('pointerDown', (value, event) => {
            item.pointerDown = value;
            item.isLastEventPointer = true;
            item.data.copy(event, !item.pointerDown && item.focused);
          }, null, true);
        },
        handler: null
      })
      .set('tap', {
        init: (item) => {
          item.data = new Observable('tap', null);
          this.on('click', (value) => { item.data.update(value); }, null, true); // TODO: other touchs
        },
        handler: null
      })
      .set('up', {
        init: (item) => {
          item.data = new Observable('up', null);
          this.on('mouseup', (value) => { item.data.update(value); }, null, true); // TODO: other touchs
        },
        handler: null
      });
  }

  /**
   * Add a event definition on register if not exist
   * @param {String} eventName
   * @param {Boolean} custom
   * @return {Object}
   */
  _assureRegisterDefinition(eventName, custom = null) {
    let item = this.register.get(eventName);
    if (item) return item;

    const proto = this.register.get('default');
    item = Object.assign({}, proto);
    this.register.set(eventName, item);

    item.init(item);
    item.data.name = eventName;
    if (custom) item.handler = null;
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
   * Trigger async an event if exist
   * @param {String} eventName
   * @param {*} event
   * @return {EventManager}
   */
  fire(eventName, event = {}) {
    const item = this.register.get(eventName);
    if (!item) return;

    setTimeout(() => item.data.update(event), 0);
    return this;
  }

  /**
   * Return the Storage for the event. If not exist then create
   * @param {String} eventName
   * @return {Observable}
   */
  getObservable(eventName, custom = null) {
    let cache = this[this.cachedName(eventName)];
    if (cache != null) return cache;

    this.on(eventName, null, custom); // create if don't exist
    const item = this.register.get(eventName);
    if (!item) return; // ?
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
   * Look for e key replacement
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
   * @param {String} eventName - click, ...
   * @param {Function} handler - code to execute on event
   * @param {Boolean} custom
   * @param {Boolean} link
   * @return {EventManager}
   */
  on(eventName, handler = null, custom = null, link = false) {
    const item = this._assureRegisterDefinition(eventName, custom);
    if (!item.data) item.init(item);
    if (handler != null) {
      if (!link) item.data.observe(handler); else item.data.link(handler);
    }

    return this;
  }

  /**
   * Set Attrbute on Event
   * @param {String} eventName
   * @param {*} target - HTML element
   * @param {String} attrName - attribute to change
   * @param {Boolean} custom - true is a custom event if we need initialize
   * @return {EventManager}
   */
  onChangeReflectToAttribute(eventName, target, attrName, custom = null) {
    const item = this._assureRegisterDefinition(eventName, custom);
    if (!item.data) { // is predefined
      item.init(item);
    }
    item.data.onChangeReflectToAttribute(target, attrName);
    return this;
  }

  /**
   * Set Class on Event
   * @param {String} eventName
   * @param {*} target - HTML element
   * @param {String} className - attribute to change
   * @param {Boolean} custom - true is a custom event if we need initialize
   * @return {EventManager}
   */
  onChangeReflectToClass(eventName, target, className, custom = null) {
    const item = this._assureRegisterDefinition(eventName, custom);
    if (!item.data) { // is predefined
      item.init(item);
    }
    item.data.onChangeReflectToClass(target, className);
    return this;
  }

  onChangeReflectToEvent(eventName, target) {
    const item = this.getObservable(eventName);
    const reflected = this.getObservable(target);
    item.link((value, raw) => { reflected.copy(raw, value); });
    return this;
  }

  /**
   * Send a custom event on value change
   * @param {String} eventName
   * @param {*} target
   * @param {String} channel
   * @param {Boolean} custom
   * @param {*} to - objetive to trigger the message
   * @return {EventManager}
   */
  onChangeFireMessage(eventName, target, channel, custom = null, to = null) {
    // const item = this._assureRegisterDefinition(eventName, custom);
    // if (!item.data) { // is predefined
    //   item.init(item);
    // }
    const item = this.getObservable(eventName, custom);
    item.onChangeFireMessage(target, channel, to);
    return this;
  }

  /**
   * Subscription to a custom event. Don't attach on subscribe
   * @param {String} eventName
   * @param {Function} handler
   * @return {EventManager}
   */
  onCustom(eventName, handler = null) {
    return this.on(eventName, handler, true);
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

    const registerItem = this.register.get(event);
    if (registerItem.key == null) {
      registerItem.key = true;
      this.on(event, this._keyHandler.bind(this), null, link);
    }
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
    let item = this.register.get(eventName);
    if (item == null || item.switch == null) return;

    if (item.data == null) {
      item.init(item);
      this[this.cachedName(eventName)] = item.data;
    }
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
      if (!targetItem.data) targetItem.init(targetItem);
      targetItem['_' + eventName] = item;
    }
    return this;
  }
}

export { EventManager };
