// @copyright 2017-2018 adalberto.lacruz@gmail.com

import { AlgComponent } from './alg-component.js';
import { AlgController, ControllerStatus } from '../../controller/alg-controller.js';
import { BinderParser } from './binder-parser.js';
import { ObservableEvent } from '../types/observable-event.js';
import { TYPE_BOOL, TYPE_STRING } from '../util/constants.js';

/**
 * Manages the component attributes
 * @class
 */
class AttributeManager {
  /**
   * @constructor
   * @param {AlgComponent} target
   */
  constructor(target) {
    /** @type {AlgComponent} Element to get/set attributes */
    this.target = target;

    /** @type {Array<String>} Attributes we have try to subscribe. Don't try anymore. */
    this.binded = [];

    /** @type {ObservableEvent} cache for last attribute information */
    this.entry = null;

    /** @type {Map<String, ObservableEvent>} Attributes storage */
    this.register = new Map();

    /** @type {Array<String>} Attributes removed, pending to receive null in attributeChanged */
    this.removedAttributes = [];

    this._setInitialAttributes(); // define disabled
  }

  /**
   * <alias, name> for observable names. Let an alternative name
   * @type {Map<String, String>}
   */
  get aliasRegister() { return this._aliasRegister || (this._aliasRegister = new Map()); }

  /**
   * Storage for hasChanged key
   * @type {Map<String, number>}
   */
  get changedRegister() { return this._changedRegister || (this._changedRegister = new Map()); }

  /**
   * Default values for read(), default() // TODO: deprecated
   * @type {Map<String, *>}
   */
  get defaults() { return this._defaults || (this._defaults = new Map()); }

  /**
   * Compose the name prefix
   * @return {String}
   */
  calculatePrefix() {
    const id = this.target.id ? this.target.id : this.target.tagName;
    return `${id}_${this.target.hash}<attr>`;
  }

  /**
   * Update the attribute value
   * @param {String} name
   * @param {*} value
   * @return {AttributeManager}
   */
  change(name, value) {
    this.get(name).update(value);
    return this;
  }

  /**
   * Initialize observable with attribute value or default.
   * Don't trigger handlers.
   * @param {?} value
   * @return {AttributeManager}
   */
  defaultValue(value) { // TODO: deprecated
    const entry = this.entry;
    const name = entry.name;
    if (this.target.hasAttribute(name)) {
      entry.value = this.target.getAttribute(name);
    } else if (this.defaults.has(name)) {
      entry.value = this.defaults.get(name);
    } else {
      entry.value = value;
    }
    return this;
  }

  /**
   * Defines an attribute, if not previously defined.
   * @param {String} name
   * @param {String} type 'string' | 'boolean' | 'number'
   * @param {Object} options <String>[] alias, bool countChanges, bool isLocal, bool isPreBinded, * value
   * @return {AttributeManager}
   */
  define(name, type = TYPE_STRING, options = {}) {
    const { alias, countChanges, isLocal, isPreBinded, value } = options;

    this.entry = this.has(name);
    if (this.entry == null) {
      this.entry = new ObservableEvent(name)
        .setType(type)
        .setPrefix(this.calculatePrefix());
      this.register.set(name, this.entry);
      if (alias != null) {
        alias.forEach((aliasName) => this.aliasRegister.set(aliasName, name));
      }
      if (countChanges) this.entry.changed = 0; // activate changed counter
    }

    if (value != null) this.entry.value = value;
    if (isLocal != null) this.entry.isLocal = isLocal;
    if (isPreBinded != null) this.entry.isPreBinded = isPreBinded;

    return this;
  }

  /**
   * Load defaults, for read().
   *   options = {important}true, load any case
   * @param {String} name
   * @param {*} value
   * @param {Object} options
   * @return {AttributeManager}
   */
  defineDefault(name, value, options = {}) { // TODO: deprecated
    const { important } = options;

    if (important || !this.defaults.has(name)) {
      this.defaults.set(name, value);
    }
    return this;
  }

  /**
   * Assure an entry
   * @param {String} name
   * @return {ObservableEvent}
   */
  get(name) {
    return this.define(name).entry;
  }

  /**
   * Returns the attribute value
   * @param {String} name
   */
  getValue(name) {
    return this.get(name).value;
  }

  /**
   * If name is in register or alias return it, else null
   * @param {String} name
   * @return {ObservableEvent}
   */
  has(name) {
    if (this.register.has(name)) {
      return (this.entry = this.register.get(name));
    } else if (this._aliasRegister && this.aliasRegister.get(name)) {
      const aliasName = this.aliasRegister.get(name);
      if (this.register.has(aliasName)) return (this.entry = this.register.get(aliasName));
    }
    return null;
  }

  /**
   * True if targets have changed since last call with key.
   * The observables have to be defined with countChanges = true.
   * @param {String} key
   * @param {Array<String>} targets
   * @return {Boolean}
   */
  hasChanged(key, targets) {
    const changesCount = targets.reduce((sum, target) => sum + this.get(target).changed || 0, 0);
    return this.changedRegister.get(key) === changesCount
      ? false
      : (this.changedRegister.set(key, changesCount) != null); // true
  }

  /**
   * true if it is Binded to the controller
   * @param {String} name
   * @return {Boolean}
   */
  isSubscriptionTried(name) {
    return this.binded.includes(name) ? true : this.binded.push(name) == null; // false
  }

  /**
   * true if name is in removedAttributes list. Also removes from list
   * @param {String} name
   * @return {Boolean}
   */
  isRemoved(name) {
    const index = this.removedAttributes.indexOf(name);
    return (index > -1)
      ? this.removedAttributes.splice(index, 1) != null // true
      : false;
  }

  /**
   * Don't repeat same actions
   * True if 'name' is not included in this.entry.context.'action'
   * @param {String} action
   * @param {String} name - if null, action: true/false, else ['name']
   * @return {Boolean}
   */
  isUniqueAction(action, name = null) {
    const context = this.entry.context;
    if (name == null) {
      return context[action] ? false : (context[action] = true);
    }
    /** @type {Array<String>} */
    const token = context[action] || (context[action] = []);
    return (token.indexOf(name) > -1) ? false : (token.push(name) != null); // true
  }

  /**
   * Action on attribute change. Use toAttribute() to identify the attribute.
   * @param {Function} handler
   */
  on(handler) {
    if (handler == null) return this;

    this.entry.observe(handler);
    return this;
  }

  /**
   * As on, but with name. Used for attributes defined elsewhere
   * @param {String} name
   * @param {Function} handler
   */
  onChange(name, handler) {
    this.entry = this.get(name);
    return this.on(handler);
  }

  /**
   *
   * @param {*} message
   * @return {AttributeManager}
   */
  onChangeFireMessage(message) { // TODO: deprecated
    console.log('AttributeManager.onChangeFireMessage DEPRECATED');
    this.entry.onChangeFireMessage(this.target, message);
    return this;
  }

  /**
   * Copy value to other attribute, only once
   * @param {String} name - target
   * @return {AttributeManager}
   */
  onChangeModify(name) {
    const entry = this.entry; // avoid collateral get() effects

    if (this.isUniqueAction('modify', name)) {
      const target = this.get(name); // must be outside link
      entry.link((value, context) => { target.update(value); });
      this.entry = entry;
    }
    return this;
  }

  /**
   * Immediate Action on attribute change.
   * @param {Function} handler
   */
  onLink(handler) {
    if (handler == null) return this;

    this.entry.link(handler);
    return this;
  }

  /**
   * Read, now,  the attribute associate with this.entry
   * If attribute isn't found use defaults if possible.
   * options = {alwaysUpdate} true, execute the observers any case
   * @param {Object} options
   * @return {AttributeManager}
   */
  read(options = {}) { // TODO: deprecated
    const { alwaysUpdate } = options;
    const name = this.entry.name;

    if (this.target.hasAttribute(name)) {
      this.entry.update(this.target.getAttribute(name));
    } else if (this.defaults.has(name)) {
      this.entry.update(this.defaults.get(name));
    } else if (alwaysUpdate) {
      this.entry.dispatch();
    }

    return this;
  }

  /**
   * On change reflect to attribute. Use toAttribute() to identify the attribute.
   * @param {Object} options
   *  - options.type - '-remove', 'true-false', ...
   *  - options.init: true, reflect the change now
   * @return {AttributeManager}
   */
  reflect(options = {}) {
    if (this.isUniqueAction('reflect')) {
      this.entry.onChangeReflectToAttribute(this.target, options);
    }
    return this;
  }

  /**
   * Removes and attribute. target.attributeChanged will receive a null
   * @param {String} name
   */
  removeAttribute(name) {
    this.removedAttributes.push(name);
    this.target.removeAttribute(name);
  }

  /**
   * Define disabled/aria-disabled
   */
  _setInitialAttributes() {
    this
      .define('aria-disabled', TYPE_BOOL)
      .reflect('true-false')

      .define('disabled', TYPE_BOOL, { isLocal: true })
      .reflect()
      .onChangeModify('aria-disabled')
      .on((disabled) => {
        const target = this.target;
        target.style.pointerEvents = disabled ? 'none' : '';
        if (disabled) {
          target._oldTabIndex = target.tabIndex;
          target.tabIndex = -1;
          target.blur(); // focused = false, pressed = false
        } else {
          if (target._oldTabIndex !== undefined) {
            target.tabIndex = target._oldTabIndex;
          }
        }
      });
  }

  /**
   * Set this.entry to the attribute, for further processing
   * @param {String} name
   * @return {AttributeManager}
   */
  toAttribute(name) {
    this.get(name);
    return this;
  }

  /**
   * For each entry, unsubscribe from the controoler
   * @return {AttributeManager}
   */
  unsubscribe() {
    this.register.forEach((entry, name) => {
      if (entry.bindedController) {
        entry.bindedController.unsubscribe(entry.bindedChannel, entry.receiverHandler);
        entry.bindedController = null;
      }
    });

    return this;
  }

  /**
   * For PreBinded definitin, update controller/channel
   */
  updatePreBinded() {
    const id = this.target.id;
    const controllerHandler = this.target.controllerHandler;
    if (!id || !controllerHandler) return;

    this.register.forEach((entry, attrName) => {
      if (entry.isPreBinded && !this.isSubscriptionTried(attrName)) {
        const status = new ControllerStatus({ hasChannel: false });
        const channel = `${id}-${attrName}`;
        const value = controllerHandler.subscribe(channel, null, entry.receiverHandler, status);

        // Needed for unsubscribe
        if (status.hasChannel) {
          entry.bindedChannel = channel;
          entry.bindedController = controllerHandler;
        }
        if (value != null) entry.update(value);
      }
    });
  }

  // ------------------------------------------------- static
  /**
   * Set or remove the attribute according to force.
   * If force is null, set the attribute if not exist and vice versa.
   *
   * options.type =
   *  null '-remove' => attribute=""
   *  'true-false'   => attribute="true", attribute="false"
   *  'true-remove'  => attribute="true"
   *
   * @param {*} target
   * @param {String} attrName
   * @param {Boolean} force
   * @param {Object} options String type
   */
  static attributeToggle(target, attrName, force, options = {}) {
    let { type } = options;
    type = type || '-remove';

    const types = type.split('-');
    const on = types[0].trim().toLowerCase();
    const off = types[1].trim().toLowerCase();
    const value = force != null ? force : !target.hasAttribute(attrName);
    const attrValue = target.getAttribute(attrName);

    if (value) {
      if (attrValue !== on) target.setAttribute(attrName, on);
    } else {
      if (off === 'remove') {
        if (target.hasAttribute(attrName)) target.removeAttribute(attrName);
      } else {
        if (attrValue !== off) target.setAttribute(attrName, off);
      }
    }
  };

  /**
   * Set/Remove class for target.
   * Ex.: '+addClass -removeClass !toggleClass addClass'
   * @param {HTMLElement} target
   * @param {String} value
   */
  static classUpdate(target, value) {
    if (!value) return;

    value.split(' ').forEach((name) => {
      name = name.trim();
      if (name) {
        if (name.startsWith('+')) {
          target.classList.add(name.substring(1));
        } else if (name.startsWith('-')) {
          target.classList.remove(name.substring(1));
        } else if (name.startsWith('!')) {
          target.classList.toggle(name.substring(1));
        } else {
          target.classList.add(name);
        }
      }
    });
  }

  /**
   * Stamp this component and the upper tree with this.controller = controllerName
   * defined with the attribute controller="..." in upper scope.
   * If not found, use the first controller instantiated.
   * @param {AlgComponent} target
   */
  static findController(target) {
    const setHandler = () => {
      target.controllerHandler = (typeof target.controller === 'string')
        ? AlgController.controllers.get(target.controller)
        : target.controller;
    };

    if (target.controllerHandler != null) return;
    if (target.controller != null) return setHandler();

    const elementsToSet = new Set();
    let controller; // String | class instance
    let element = target;

    while ((element !== null) &&
           (element.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) &&
           (element.localName !== 'html') &&
           (controller == null)) {
      if (element.controller != null) {
        controller = element.controller;
      } else {
        elementsToSet.add(element);
        if (element.hasAttribute('controller')) {
          controller = element.getAttribute('controller');
        } else {
          // @ts-ignore
          element = element.parentNode;
          if (element && element.nodeType === Node.DOCUMENT_FRAGMENT_NODE) { // TODO: ???
            // @ts-ignore
            element = element.host;
          }
        }
      }
    }

    if (!controller) controller = AlgController.controllers.keys().next().value || ''; // first key

    elementsToSet.forEach((element) => {
      element.controller = controller;
    });

    setHandler();
  }

  /**
   * Check for binder if value == '[[controller:channel:default value]]' or {{}}.
   * In that case, subscribe the attribute to changes in the controller register.
   *
   * @param {AlgComponent} target
   * @param {String} name Attribute Name
   * @param {String} value value to binder or update
   */
  static subscribeBindings(target, name, value) {
    if (value === null) return;
    const binderParser = new BinderParser(name, value, target.controller, target.id);

    if (binderParser.isEventBinder) return this.attributeIsEvent(target, binderParser);
    if (binderParser.isStyleBinder) return this.attributeIsStyle(target, binderParser);
    return this.attributeIsBinder(target, binderParser);
  }

  /**
   * Process on-handler="[[controller:ID_CHANNEL]]"
   *
   * @param {AlgComponent} target
   * @param  {BinderParser} binderParser
   */
  static attributeIsEvent(target, binderParser) {
    const { attrName, channel, controller, handler } = binderParser;
    target.messageManager.defineBinded(handler, controller, channel);

    target.attributeManager.removeAttribute(attrName);
  }

  /**
   * Process style="property1:[[controller:channel=default_value]];property2:[[*]]"
   *
   * @param {AlgComponent} target
   * @param {BinderParser} binderParser
   */
  static attributeIsStyle(target, binderParser) {
    do {
      const status = new ControllerStatus({ hasChannel: false});
      const controller = (typeof binderParser.controller === 'string')
        ? AlgController.controllers.get(binderParser.controller)
        : binderParser.controller;
      const property = binderParser.styleProperty;

      if (!controller) {
        target.style.setProperty(property, binderParser.value);
      } else {
        const channel = binderParser.getAutoStyleChannel(property);
        let value = binderParser.autoValue;
        if (channel) {
          value = value === '' ? null : value; // support attribute without value
          const entry = target.styleManager.define(property);
          value = controller.subscribe(channel, value, entry.receiverHandler, status);
          if (status.hasChannel) {
            entry.bindedChannel = channel;
            entry.bindedController = controller;
          }
        }
        if (value != null) {
          target.style.setProperty(property, value);
        }
      }
    } while (binderParser.next());
  }

  /**
   * Process attr="[[controller:channel=defaultValue]]" or
   * attr="{{controller:channel=defaultValue}}"
   *
   * @param {AlgComponent} target
   * @param {BinderParser} binderParser
   */
  static attributeIsBinder(target, binderParser) {
    const attrName = binderParser.attrName;
    const attributeManager = target.attributeManager
      .toAttribute(attrName);
    const entry = attributeManager.entry;
    const handler = entry.receiverHandler;
    const status = new ControllerStatus({ hasChannel: false });
    const controller = (typeof binderParser.controller === 'string')
      ? AlgController.controllers.get(binderParser.controller)
      : binderParser.controller;

    if (!controller || (entry.isLocal && !binderParser.isAttributeBinder)) {
      return entry.update(binderParser.value);
    }

    const channel = binderParser.autoChannel;
    let value = binderParser.autoValue;
    if (channel) {
      value = (value === '') ? null : value; // support attribute without value
      value = controller.subscribe(channel, value, handler, status);

      // Need for unsubscribe
      if (status.hasChannel) {
        entry.bindedChannel = channel;
        entry.bindedController = controller;
      }

      if (binderParser.isSync) attributeManager.reflect();
    }

    if (value === null) value = binderParser.autoValue; // support attribute without value
    if (!binderParser.isSync && status.hasChannel) {
      attributeManager.removeAttribute(attrName);
    }
    if (value != null) entry.update(value);
  }
}

export { AttributeManager };
