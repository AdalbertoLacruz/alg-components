// @ts-check
import { AlgController } from '../controllers/alg-controller.js';

/**
 * Base class for AlgComponents
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
 *
 * @type {class}
 */
class AlgComponent extends HTMLElement {
  /* **************** to override *************** */

  /**
   * Contains the functions to update the binded attributes. To @override.
   * @return {Map<String, Function>}
   */
  get attributeHandlers() {
    return this._attributeHandlers || (this._attributeHandlers = new Map()
      .set('disabled', this.setDisabled));
  }

  /**
   * Attributes managed by the component. To @override.
   * @return {Array<String>}
   */
  static get observedAttributes() {
    return ['disabled'];
  }

  /**
   * Component standar role (ex: button). To @override.
   * @return {String}
   */
  get role() {
    return '';
  }

  /**
   * Default events for the component.
   * To @override
   */
  addDefaultEventHandlers() {
    // this.handlers.set('click', null);
  }

  /**
   * Build for the class (static) templateElement, templateStyle and templateIds.
   * To @override
   * @return {HTMLTemplateElement} The template Element to be cloned in the shadow creation
   */
  createTemplate() {
    let template = this.selfClass.templateElement = document.createElement('template');
    // Each component must fill innerHTML
    template.innerHTML = `
    `;
    // Each component must search for templateIds:
    // this.selfClass.templateIds = this.searchTemplateIds(template.innerHTML);
    this.selfClass.templateIds = [];
    this.createTemplateStyle();
    return template;
  }

  /**
   * Build the basic static template for style
   * To @override
   * @return {HTMLTemplateElement} The template Element with style
   */
  createTemplateStyle() {
    let template = this.selfClass.templateStyle = document.createElement('template');
    // Each component must fill innerHTML
    template.innerHTML = `
      <style>
      </style>
    `;
    return template;
  }

  //  ******************* end overrides **********************

  constructor() {
    super();
    this.loaded = false;
    // this.setHiden(true);
    this.createShadowElement();
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

    if (newVal == null) return; // happens in attribute removal

    if (this.attributeRegister.has(attrName)) {
      this.attributeUpdate(attrName, newVal);
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
    // Apply Style
    this.shadowRoot.insertBefore(this.templateStyle.content.cloneNode(true), this.shadowRoot.firstChild);

    this.setDefaultController();
    this.updateDefaultHandlers();
    this.loaded = true;
    this.executeTaskQueue();
    this.addEventHandlers();
    this.addStandardAttributes();
    // this.setHiden(false);
  }

  // Called every time the element is removed from the DOM
  // @override
  // disconnectedCallback() {
  //   // this.removeEventListener
  // }

  // ******************* own class members **********************

  /**
   * Contains the last value of a attribute. This meaning that has been checked for binding
   * @return {Map<String, String>}
   */
  get attributeRegister() {
    return this._attributeRegister || (this._attributeRegister = new Map());
  }

  /**
   * Store the list of attributes what must be synchronize with html {{}}
   * @return {Set<String>}
   */
  get attributeSync() {
    return this._attributeSync || (this._attributeSync = new Set());
  }

  /**
   * Controller Name associate to the component
   * @return {String}
   */
  get controller() {
    return this._controller;
  }

  /**
   * Controller Name associate to the component
   * @param  {String} value
   */
  set controller(value) {
    this._controller = value;
  }

  /**
   * Attributes that define a handler as:<br>
   *     on-click="[[app-controller:BTN2_CLICK]]"
   *
   * @return {Map<String, Object>} - handlerName, {controller, channel}
   */
  get handlers() {
    return this._handlers || (this._handlers = new Map());
  }

  /**
   * Gate to static storage in the class. The class definition itselt
   */
  get selfClass() {
    return this._selfClass || (this._selfClass = window.customElements.get(this.localName));
  }

  /**
   * List of Functions pending execution.
   * @Return {Set<Function>}
   */
  get taskQueue() {
    return this._taskQueue || (this._taskQueue = new Set());
  }

  // TODO: repeat structures in the template (CreateDocumentFragment?)

  /**
   * HTMLElement template for the component
   * @return {HTMLTemplateElement}
   */
  get template() {
    return this.selfClass.templateElement || this.createTemplate();
  }

  /**
   * id names in template = ["id1", ... "idn"], static bridge
   * @return {Array<String>}
   */
  get templateIds() {
    return this.selfClass.templateIds;
  }

  /**
   * HTMLElement teplate for <style></style> in the component
   * @return {HTMLTemplateElement}
   */
  get templateStyle() {
    return this.selfClass.templateStyle || this.createTemplateStyle();
  }

  /**
   * addEventListener's for the component, using this.handlers.<br>
   * 'event': { controller: '...', channel: '...' }
   */
  addEventHandlers() {
    this.handlers.forEach((value, key) => {
      const controller = AlgController.controllers.get(value.controller);
      const channel = value.channel;
      this.addEventListener(key, () => {
        controller.fire(channel);
      });
    });
  }

  /**
   * check for tabIndex, role, and add them if not defined
   */
  addStandardAttributes() {
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', this.role);
    }
    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '0');
    }
  }

  /**
   * In the html page we have: &lt;alg-component attrName="value" ...<p><p>
   *
   * Checks if value is coded as:<p>
   *
   *    '[[controller:channel:defaultValue]]'<br>
   *    or<br>
   *    '{{controller:channel:defaultValue}}'
   *
   * @param  {String} attrName - Attribute Name
   * @param  {String} value    - Specifies final value o pattern for subscription
   * @return {Boolean} True if binder pattern found
   */
  attributeIsBinder(attrName, value) {
    const binder = this.getAttributeBinder(value);
    if (!binder) return false;

    const controller = AlgController.controllers.get(binder.controller);
    if (!controller) return false;

    const attributeHandler = this.attributeHandlers.get(attrName);
    if (attributeHandler != null) {
      if (binder.sync) this.attributeSync.add(attrName); // order is important
      const value = controller.subscribe(binder.channel, binder.defaultValue,
        attributeHandler.bind(this, attrName));
      // value !== null we could be late for dispatch, assure the attribute value
      if (value !== null) this.attributeUpdate(attrName, value);
    } else {
      return false;
    }

    if (!binder.sync) this.removeAttribute(attrName);
    return true;
  }

  /**
   * checks for 'on-handler'. If true, update handlers and remove attribute.
   *
   * @param  {String} attrName - Attribute Name, such 'on-click'
   * @param  {String}  val      - binder such [[controller:ID_CHANNEL]]
   * @return {Boolean}         - true is event handler
   */
  attributeIsHandler(attrName, val) {
    const re = /^on-(\w+)/g;
    const match = re.exec(attrName);
    if (!match) return false;

    const handler = match[1];
    const binder = this.getAttributeBinder(val);
    if (!binder) return false;

    this.handlers.set(handler, {
      'controller': binder.controller,
      'channel': binder.channel
    });

    this.removeAttribute(attrName);
    return true;
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

    const _val = value.trim();

    if (this.attributeIsHandler(attrName, _val)) return;
    if (this.attributeIsBinder(attrName, _val)) return;

    this.attributeUpdate(attrName, _val);
  }

  /**
   * Call the function defined to update the attribute. Used if not binder.
   *
   * @param  {String} attrName - Attribute Name
   * @param  {String} value    - value to update
   */
  attributeUpdate(attrName, value) {
    const attributeHandler = this.attributeHandlers.get(attrName);
    if (attributeHandler != null) attributeHandler.bind(this, attrName)(value);
  }

  /**
   * Build the shadow element, and the reference to the id elements
   */
  createShadowElement() {
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(this.template.content.cloneNode(true));

    this.ids = this.templateIds.reduce((total, id) => {
      total[id] = this.shadowRoot.querySelector(`#${id}`);
      return total;
    }, {});
  }

  /**
   * Run the pending tasks (delayed before this.loaded).
   */
  executeTaskQueue() {
    let tasks = this.taskQueue;
    tasks.forEach((task) => {
      task();
      tasks.delete(task);
    });
  }

  /**
   * Checks String value for '[[controller:channel:defaultValue]]' or {{ ... }}.
   * <br>
   * Support omit controller and defaultValue: [[:channel]]
   *
   * @param  {String} value - to check for pattern
   * @return {Object}       controller, channel, defaultValue, sync
   */
  getAttributeBinder(value) {
    const re = /^[[{]{2}([a-z-_\d]*):{1}([a-z-_\d)]+):{0,1}([a-z-_\d)]+)*[\]}]{2}/ig;
    const match = re.exec(value);
    if (!match) return;

    const controllerName = match[1] ? match[1] : this.controller;
    return {
      'controller': controllerName,
      'channel': match[2],
      'defaultValue': match[3],
      'sync': value.startsWith('{')
    };
  }

  /**
   * Search for id="..."
   *
   * @param  {String} html - template.innerHTML to search in
   * @return {Array<String>}  such as ['id1', ...'idn]
   */
  searchTemplateIds(html) {
    let result = [];
    let re = / id="([a-z]*)"/g;

    let match = re.exec(html);
    while (match) {
      result.push(match[1]);
      match = re.exec(html);
    }
    return result;
  }

  /**
   * Common task to set a attribute value, with or not sync
   *
   * @param {String} attrName - Attribute Name
   * @param {String} value    - Attribute value
   * @return {Boolean} true if nothing more to do
   */
  setAttributeSuper(attrName, value) {
    if ((value === null) || (this.attributeRegister.get(attrName) === value)) return true;
    this.attributeRegister.set(attrName, value);
    if (this.attributeSync.has(attrName)) this.setAttribute(attrName, value);
    return false;
  }

  /**
   * Stamp this component and the upper tree with this.controller = controllerName
   * defined with the attribute controller="..." in upper scope.
   * If not found, use the first controller instantiated.
   */
  setDefaultController() {
    if (this.controller) return;

    const elementsToSet = new Set();
    let element = this;
    let controllerName;

    while ((element.localName !== 'html') && !controllerName) {
      if (element.controller) {
        controllerName = element.controller;
      } else {
        elementsToSet.add(element);
        if (element.hasAttribute('controller')) {
          controllerName = element.getAttribute('controller');
        } else {
          // @ts-ignore
          element = element.parentElement;
        }
      }
    }

    if (!controllerName) controllerName = AlgController.controllers.keys().next().value; // first key

    elementsToSet.forEach((element) => {
      element.controller = controllerName;
    });
  }

  /**
   * Set Disabled attribute
   *
   * @param {String} attrName - Attribute Name
   * @param {*} value    - true => set, false => remove
   */
  setDisabled(attrName, value) {
    if (this.setAttributeSuper(attrName, value)) return;
    if (value) {
      this.setAttribute('disabled', '');
    } else {
      this.removeAttribute('disabled');
    }
  }

  /**
   * Hide/Unhide the component
   *
   * @param {Boolean} value - true hide the component
   */
  setHiden(value) {
    if (value) this.style.visibility = 'hidden';
    if (!value) this.style.visibility = '';
  }

  /**
   * Update event handlers with the default information.
   * Only if we have a handler name and no controller/channel defined.
   */
  updateDefaultHandlers() {
    const id = this.id;
    const controller = this.controller;

    this.handlers.forEach((value, key) => {
      if (!value) {
        const channel = id ? `${id}_${key}`.toUpperCase() : null;
        if (!channel || !controller) {
          this.handlers.delete(key);
        } else {
          this.handlers.set(key, {
            'controller': controller,
            'channel': channel
          });
        }
      }
    });
  }
}

export { AlgComponent };
