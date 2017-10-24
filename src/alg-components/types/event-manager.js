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
   * @return {Map<String, Set>}
   */
  get keyRegister() {
    return this._keyRegister || (this._keyRegister = new Map());
  }

  /**
   * Table for key code change. First numeric, then by text
   * @return {Object<(Number | String), String>}
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
   * }
   * @return {Map<String, Object>}
   */
  get register() {
    return this._register || (this._register = new Map()
      .set('default', {
        init: (item) => { item.data = new Observable('', null); },
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
      .set('focused', {
        init: (item) => {
          item.data = new ObsBoolean('focused', false);
          this.on('focus', () => { item.data.update(true); });
          this.on('blur', () => { item.data.update(false); });
        },
        handler: null
      })
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
        init: (item) => { item.data = new Observable('mousedown', null); },
        handler: (item, e) => { item.data.update(e); }
      })
      .set('mouseup', {
        init: (item) => { item.data = new Observable('mouseup', null); },
        handler: (item, e) => { item.data.update(e); }
      })
      // true if mouse button is pressed
      .set('mousehold', {
        init: (item) => {
          item.data = new ObsBoolean('mousehold', false);
          this.on('mousedown', () => { item.data.update(true); });
          this.on('mouseup', () => { item.data.update(false); });
        },
        handler: null
      })
      // True if the element is currently being pressed by a "pointer," which is loosely
      // defined as mouse or touch input (but specifically excluding keyboard input).
      .set('pointerDown', {
        init: (item) => {
          item.data = new ObsBoolean('pointerDown', false);
          this.on('mousehold', (value) => { item.data.update(value); });
        },
        handler: null
      })
      // If true, the user is currently holding down the button (mouse down or spaceKey).
      .set('pressed', {
        init: (item) => {
          item.data = new ObsBoolean('pressed', false);
          this.on('blur', () => { item.data.update(false); });
          this.on('mousehold', (value) => { item.data.update(value); });
          this.onKey('space:keydown', (event) => {
            const keyboardEvent = event.keyboardEvent;
            keyboardEvent.preventDefault();
            keyboardEvent.stopImmediatePropagation();
            item.data.update(true);
          });
          this.onKey('space:keyup', () => { item.data.update(false); });
        },
        handler: null
      })
      // True if the input device that caused the element to receive focus was a keyboard.
      .set('receivedFocusFromKeyboard', {
        init: (item) => {
          item.data = new ObsBoolean('receivedFocusFromKeyboard', false);
          item.focused = false;
          item.pointerDown = false;
          this.on('focused', (value) => {
            item.focused = value;
            item.data.update(!item.pointerDown && item.focused);
          });
          this.on('pointerDown', (value) => {
            item.pointerDown = value;
            item.data.update(!item.pointerDown && item.focused);
          });
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
    return item;
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
    this.on(eventName, null, custom); // create if don't exist
    const item = this.register.get(eventName);
    if (!item) return; // ?
    return item.data;
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
   * @return {EventManager}
   */
  on(eventName, handler = null, custom = null) {
    const item = this._assureRegisterDefinition(eventName, custom);
    if (!item.data) item.init(item);
    if (handler != null) item.data.observe(handler);

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

  /**
   * Send a custom event on value change
   * @param {String} eventName
   * @param {*} target
   * @param {String} channel
   * @param {Boolean} custom
   */
  onChangeFireMessage(eventName, target, channel, custom = null) {
    const item = this._assureRegisterDefinition(eventName, custom);
    if (!item.data) { // is predefined
      item.init(item);
    }
    item.data.onChangeFireMessage(target, channel);
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
  onKey(events, handler) {
    const eventsList = events.split(' ');
    eventsList.forEach((eventName) => { this._onKeySingle(eventName, handler); });
    return this;
  }

  /**
   * Manages a single key event definition (enter:keydown)
   * @param {String} eventName
   * @param {Function} handler
   */
  _onKeySingle(eventName, handler) {
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
      this.on(event, this._keyHandler.bind(this));
    }
  }

  /**
   * After on(...), subscribe the events to the target. Supports multiple calls
   * @return {EventManager}
   */
  subscribe() {
    const target = this.target;
    for (const [event, item] of this.register) {
      if (item.data != null && item.handler != null && item.listener == null) {
        item.listener = item.handler.bind(this, item);
        target.addEventListener(event, item.listener);
      }
    }
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
}

export { EventManager };
