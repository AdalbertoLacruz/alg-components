// @copyright 2017-2018 adalberto.lacruz@gmail.com

import { AlgController } from '../../controller/alg-controller.js';
import { AttributeManager } from '../types/attribute-manager.js';
import { BinderParser } from './binder-parser.js';
import { EventManager } from '../types/event-manager.js';
import { executeTaskQueue } from '../util/misc.js';
import * as Str from '../util/util-str.js';

/**
 * Add bindings to the component
 * <p>
 * Para definir un componente en html:<p>
 * &lt;alg-component attribute1="[[controller:channel:defaultValue]]" <br>
 * attribute2="{{controller:channel:defaultValue}}" (reflects the value to the tag) <br>
 * attribute3="final value" <br>
 * on-click="[[controller:ID_EVENT]]
 * <p>
 * Controller by default: controller tag ascending in the tree until body,
 * or the first instantiated AlgController.
 * <p>
 * A component could have events by default.
 * <p>
 * A controller and defaultValue could be ommited in the handler. attribute1="[[:channel]]".
 * <p>
 * style="property:[[controller:channel:defaultValue]];otherProperty:[[*]]" or
 * style="property:value;..."
 * <br>
 * In this last case try autobinding to default-controller, with channel= id-style-property
 *
 * @type {class}
 */
class BinderElement extends HTMLElement {
  /* **************** to override *************** */

  /**
   * Default events for the component.
   * To @override
   */
  addDefaultEventHandlers() {
    // this.eventHandlers.set('click', null);
  }

  /**
   * Contains the functions to update the binded attributes. To @override.
   * @type {Map<String, Function>}
   */
  get attributeHandlers() {
    return this._attributeHandlers || (this._attributeHandlers = new Map()
      .set('style', this.bindedStyle));
  }

  /**
   * Attributes managed by the component. To @override.
   * @type {Array<String>}
   */
  static get observedAttributes() {
    return ['style'];
  }

  //  ******************* end overrides **********************

  constructor() {
    super();
    this.loaded = false;
    this.addDefaultEventHandlers();
  }

  /**
   * The behavior occurs when an attribute of the element is added, removed, updated, or replaced.
   * <p>
   * If newVal is binder we must register it, else we must update the attribute.
   * <p>
   * The behavior is delayed until the component is loaded.
   * @override
   * @param  {String} attrName - Attribute Name
   * @param  {string} oldVal   - Old Value
   * @param  {String} newVal   - New Value
   */
  attributeChangedCallback(attrName, oldVal, newVal) {
    if (!this.loaded) {
      this.taskQueue.add(this.attributeChangedCallback.bind(this, attrName, oldVal, newVal));
      return;
    }

    if (newVal == null) return this.attributeUpdate(attrName, newVal); // happens in attribute removal

    if (this.attributeRegister.has(attrName)) {
      if (attrName !== 'style') this.attributeUpdate(attrName, newVal);
    } else {
      // binder is not processed yet
      this.attributeSubscribe(attrName, newVal);
    }
  }

  /**
   * Called every time the element is inserted into the DOM
   * @override
   */
  connectedCallback() {
    this.findController();
    this.updateEventHandlersDefinition();
    this.loaded = true; // rename to isAttached ?
    executeTaskQueue(this.taskQueue);
    this.addEventHandlers();
    // this.bindeddHiden(hidden, false);
  }

  /**
   * Called every time the element is removed from the DOM. Unsubscribe.
   * @override
   */
  disconnectedCallback() {
    executeTaskQueue(this.unsubscribeHandlers); // controller
    this.eventManager.unsubscribe();
  }

  // ******************* own class members **********************

  /** @type {AttributeManager} */
  get attributeManager() { return this._attributeManager || (this._attributeManager = new AttributeManager(this)); }

  /**
   * Contains the last value from an attribute. This meaning that has been checked for binding
   * @type {Map<String, String>}
   */
  get attributeRegister() {
    return this._attributeRegister || (this._attributeRegister = new Map());
  }

  /**
   * Store the list of attributes what must be synchronize with html {{}}
   * @type {Set<String>}
   */
  get attributeSync() {
    return this._attributeSync || (this._attributeSync = new Set());
  }

  /** Controller Name associate to the component @type  {String} value */
  set controller(value) { this._controller = value; }
  get controller() { return this._controller; }

  /** eventHandlers that don't addEventListener @type {Set} */
  get customHandlers() { return this._customHandlers || (this._customHandlers = new Set()); }

  /**
   * Attributes that define a handler as:<br>
   *     on-click="[[app-controller:BTN2_CLICK]]"
   *
   * @type {Map<String, Object>} - handlerName, {controller, channel}
   */
  get eventHandlers() {
    return this._eventHandlers || (this._eventHandlers = new Map());
  }

  /** @type {EventManager} */
  get eventManager() { return this._eventManager || (this._eventManager = new EventManager(this)); }

  /**
   * If true, the component don't fire any message to the controller
   * @type {Boolean}
   */
  get fireDisabled() { return this._fireDisabled || (this._fireDisabled = false); }
  set fireDisabled(value) { this._fireDisabled = value; }

  /** eventHandlers that don't add to eventManager, only fire messages. @type {Set} */
  get fireHandlers() { return this._fireHandlers || (this._fireHandlers = new Set()); }

  /**
   * List of Functions pending execution.
   * @type {Set<Function>}
   */
  get taskQueue() {
    return this._taskQueue || (this._taskQueue = new Set());
  }

  /**
   * List of handlers to unsubscribe from the controller (attribute, style)
   * @type {Set<Function>}
   */
  get unsubscribeHandlers() {
    return this._unsubscribeHandlers || (this._unsubscribeHandlers = new Set());
  }

  /**
   * Trought eventManager add EventListener's for the component, using this.handlers.<br>
   * 'event': { controller: '...', channel: '...' }
   */
  addEventHandlers() {
    this.eventHandlers.forEach((value, key) => {
      const controller = AlgController.controllers.get(value.controller);
      const channel = value.channel;
      const isFire = this.fireHandlers.has(key);
      if (!isFire && controller && channel) {
        const custom = this.customHandlers.has(key);
        const handler = (value) => { controller.fire(channel, value); };
        this.eventManager.on(key, handler, {custom: custom});
      }
    });
    this.eventManager.subscribe();
  }

  /**
   * Process attr="[[controller:channel:defaultValue]]" or
   * attr="{{controller:channel:defaultValue}}"
   *
   * @param {BinderParser} binderParser
   */
  attributeIsBinder(binderParser) {
    const attrName = binderParser.attrName;
    const status = { hasChannel: false};

    const controller = AlgController.controllers.get(binderParser.controller);
    if (!controller) return this.attributeUpdate(attrName, binderParser.value);

    const attributeHandler = this.getAttributeHandler(attrName);
    if (attributeHandler != null) {
      if (binderParser.isSync) this.attributeSync.add(attrName); // order is important
      const channel = binderParser.autoChannel;
      let value = binderParser.autoValue;
      if (channel) {
        value = value === '' ? null : value; // support attribute without value
        const handler = attributeHandler.bind(this, attrName);
        value = controller.subscribe(channel, value, handler, status);
        if (status.hasChannel) {
          this.unsubscribeHandlers.add(controller.unSubscribe.bind(controller, channel, handler));
        }
      }
      if (value === null) value = binderParser.autoValue; // support attribute without value
      if (value !== null) this.attributeUpdate(attrName, value);
      if (!binderParser.isSync && status.hasChannel) this.removeAttribute(attrName);
    } else {
      this.attributeUpdate(attrName, binderParser.value);
    }
  }

  /**
   * Process on-handler="[[controller:ID_CHANNEL]]"
   *
   * @param  {BinderParser} binderParser
   */
  attributeIsEvent(binderParser) {
    this.eventHandlers.set(binderParser.handler, {
      'controller': binderParser.controller,
      'channel': binderParser.channel
    });
    this.removeAttribute(binderParser.attrName);
  }

  /**
   * Process style="propiedad1:[[controller:channel:default_value]];propiedad2:[[*]]"
   *
   * @param {BinderParser} binderParser
   */
  attributeIsStyle(binderParser) {
    let attributeHandler, channel, controller, property, value;
    const status = { hasChannel: false };

    do {
      controller = AlgController.controllers.get(binderParser.controller);
      property = binderParser.styleProperty;
      if (!controller) return this.bindedStyle(property, binderParser.value);
      attributeHandler = this.getAttributeHandler('style');
      channel = binderParser.getAutoStyleChannel(property);
      value = binderParser.autoValue;
      if (channel) {
        value = value === '' ? null : value; // support attribute without value
        const handler = attributeHandler.bind(this, property);
        value = controller.subscribe(channel, value, handler, status);
        if (status.hasChannel) {
          this.unsubscribeHandlers.add(controller.unSubscribe.bind(controller, channel, handler));
        }
      }

      if (value !== null) this.bindedStyle(property, value);
    } while (binderParser.next());
  }

  /**
   * Check for binder if value == '[[controller:channel:default value]]' or {{}}.
   * In that case, subscribe the attribute to changes in the controller register.
   *
   * @param  {String} attrName - Attribute Name
   * @param  {String} value    - value to binder or update
   */
  attributeSubscribe(attrName, value) {
    if (value === null) return;
    const binderParser = new BinderParser(attrName, value, this.controller, this.id);

    if (binderParser.isEventBinder) return this.attributeIsEvent(binderParser);
    if (binderParser.isStyleBinder) return this.attributeIsStyle(binderParser);
    return this.attributeIsBinder(binderParser);
  }

  /**
   * Call the function defined to update the attribute. Used if not binder.
   *
   * @param  {String} attrName - Attribute Name
   * @param  {String} value    - value to update
   */
  attributeUpdate(attrName, value) {
    const attributeHandler = this.getAttributeHandler(attrName);
    if (attributeHandler != null) attributeHandler.bind(this, attrName)(value);
    this.attributeManager.change(attrName, value);
  }

  /**
   * Common task to set a attribute value, with or not sync
   *
   * @param {String} attrName - Attribute Name
   * @param {String} value    - Attribute value, could be null
   * @return {Boolean} true if nothing more to do
   */
  bindedAttributeSuper(attrName, value) {
    if (this.attributeRegister.has(attrName) && (this.attributeRegister.get(attrName) === value)) return true;
    this.attributeRegister.set(attrName, value);
    if (this.attributeSync.has(attrName)) this.setAttribute(attrName, value);

    return false;
  }

  /**
   * Hide/Unhide the component
   *
   * @param {String} attrName - Attribute Name
   * @param {Boolean} value - true hide the component
   */
  bindedHiden(attrName, value) {
    if (this.bindedAttributeSuper(attrName, value.toString())) return;

    if (value) this.style.visibility = 'hidden';
    if (!value) this.style.visibility = '';
  }

  /**
   * style="property:value"
   * @param {String} property @param {String} value
   */
  bindedStyle(property, value) {
    if (this.bindedAttributeSuper('style', property + value)) return;

    this.style[property] = value;
  }

  /**
   * Stamp this component and the upper tree with this.controller = controllerName
   * defined with the attribute controller="..." in upper scope.
   * If not found, use the first controller instantiated.
   */
  findController() {
    if (this.controller != null) return;

    const elementsToSet = new Set();
    let element = this;
    let controllerName;

    while ((element !== null) && (element.localName !== 'html') && controllerName == null) {
      if (element.controller != null) {
        controllerName = element.controller;
      } else {
        elementsToSet.add(element);
        if (element.hasAttribute('controller')) {
          controllerName = element.getAttribute('controller');
        } else {
          // element = element.parentElement;

          // @ts-ignore
          element = element.parentNode;
          if (element && element.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
            // @ts-ignore
            element = element.host;
          }
        }
      }
    }

    if (!controllerName) controllerName = AlgController.controllers.keys().next().value || ''; // first key

    elementsToSet.forEach((element) => {
      element.controller = controllerName;
    });
  }

  /**
   * Send a message to the controller
   * @param {String} customEvent
   * @param {*} message
   */
  fire(customEvent, message) {
    if (this.fireDisabled) return;
    const handler = this.eventHandlers.get(customEvent);
    if (handler == null) return;
    const controller = AlgController.controllers.get(handler.controller);
    const channel = handler.channel;
    controller.fire(channel, message);
  }

  /**
   * Search a handler for attrName in attributeHandlers or as bindedAttrName
   * @param {String} attrName
   * @return {Function}
   */
  getAttributeHandler(attrName) {
    let handler = this.attributeHandlers.get(attrName);
    if (handler) return handler;
    const handlerName = Str.dashToCamelString('binded-' + attrName);
    handler = this[handlerName];
    this.attributeHandlers.set(attrName, handler);
    return handler;
  }

  /**
   * in Attribute change on == '', off == null
   * and the controller could be true/false. Then:
   *
   * true: true, ''
   * false: false, null
   *
   * @param {*} value
   * @return {Boolean}
   */
  toBoolean(value) {
    if (value === '') return true;
    return Boolean(value);
  }

  /**
   * Update event handlers with the default information.
   * Only if we have a handler name and no controller/channel defined.
   */
  updateEventHandlersDefinition() {
    const id = this.id;
    const controller = this.controller;

    this.eventHandlers.forEach((value, key) => {
      if (!value) {
        const channel = id ? `${id}_${key}`.toUpperCase() : null;
        if (!channel || !controller) {
          this.eventHandlers.delete(key);
        } else {
          this.eventHandlers.set(key, {
            'controller': controller,
            'channel': channel
          });
        }
      }
    });
  }
}

export { BinderElement };
