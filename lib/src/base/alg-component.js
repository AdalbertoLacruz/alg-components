// @copyright 2017-2018 adalberto.lacruz@gmail.com

import '../../styles/iron-flex-layout.js';
import '../../styles/paper-material-styles.js';

import { AttributeManager } from './attribute-manager.js';
import { executeTaskQueue } from '../util/misc.js';
import { EventManager } from './event-manager.js';
import { MessageManager } from './message-manager.js';
// eslint-disable-next-line
import { RulesInstance } from '../../styles/rules.js';
import { StyleManager } from './style-manager.js';
import { TemplateManager } from './template-manager.js';

/**
 * Base class for AlgComponents.
 *
 * Process the templates to define ShadowElement with HTML and styles
 * Add bindings to the component.
 *
 * Lifecicle:
 *   constructor()
 *     ..async domLoaded
 *   connectedCallBack()
 *     ..deferredConstructor()
 *     ..postDeferredConstructor()
 *   domLoaded()
 *     ..attributeChangeCallBack()
 *   disconnectedCallback()
 *
 * @class
 */
class AlgComponent extends HTMLElement {
  // ------------------------------------------------- Static

  /**
   * Attributes managed by the component. To @override.
   * @type {Array<String>}
   */
  static get observedAttributes() { return ['disabled', 'style']; }

  /** @type {Number} */
  static get hashIndex() { return this._hashIndex || (this._hashIndex = 0); }
  static set hashIndex(value) { this._hashIndex = value; }

  // ------------------------------------------------- Lifecycle

  constructor() {
    super();

    /** @type {String | Object} Controller associate to the component */
    this.controller = null;

    /** @type {Object} Controller instance */
    this.controllerHandler = null;

    /** @type {String} universal id */
    this.hash = (++AlgComponent.hashIndex).toString().padStart(4, '0');

    /** @type {Map<String, HTMLElement>} children ids defined in createShadowElement */
    this.ids = null;

    /** @type {Boolean} True if component inserted in a stable dom */
    this.loadedComponent = false;

    /** @type {Number} cache for tabIndex when disabled */
    this._oldTabIndex = null;

    TemplateManager.createShadowElement(this);
    TemplateManager.insertStyle(this);
    TemplateManager.saveTemplateInfo(this);

    Promise.resolve().then(this.domLoaded.bind(this));
  }

  /**
   * Component inserted into the tree (attached)
   */
  connectedCallback() {
    if (!this.loadedComponent) {
      this.deferredConstructor();
      this.postDeferredConstructor();
    }
  }

  /**
   * First task in connectedCallback, executed once.
   * It is called before attributeChange in the taskQueue
   * Simplify constructor and place here Low priority constructor tasks,
   * such as attributeManager, eventManager, ...
   */
  deferredConstructor() {
    this.addStandardAttributes();
  }

  /**
   * Tasks to execute after deferredConstructor
   */
  postDeferredConstructor() {

  }

  /**
   * Dom has the components created
   */
  domLoaded() {
    this.loadedComponent = true;

    TemplateManager.modifyStyle(this);
    AttributeManager.findController(this);
    executeTaskQueue(this.taskQueue); // same as initialReadAllAttributes

    if (this._messageManager) {
      this.messageManager.updatePrebinded();
      this.messageManager.subscribeTo();
    }

    if (this._attributeManager) this.attributeManager.updatePreBinded();
  }

  /**
   * Respond to attribute changes, for observed and not removed attributes.
   * If possible, it subscribes to the controller in the first time.
   * The behavior is delayed until the component is loaded.
   * @override
   * @param  {String} attrName - Attribute Name
   * @param  {string} oldVal   - Old Value
   * @param  {String} newVal   - New Value
   */
  attributeChangedCallback(attrName, oldVal, newVal) {
    if (!this.loadedComponent) {
      this.taskQueue.add(this.attributeChangedCallback.bind(this, attrName, oldVal, newVal));
      return;
    }

    if (newVal == null && this.attributeManager.isRemoved(attrName)) return; // happens in attribute removal

    if (newVal == null || this.attributeManager.isSubscriptionTried(attrName)) {
      this.attributeManager.change(attrName, newVal);
    } else {
      AttributeManager.subscribeBindings(this, attrName, newVal);
    }
  }

  /**
   * Component removed from the tree. (detached)
   * @override
   */
  disconnectedCallback() {
    if (this._attributeManager != null) this.attributeManager.unsubscribe();
    if (this._eventManager != null) this.eventManager.unsubscribe();
    if (this._styleManager != null) this.styleManager.unsubscribe();
  }

  // ------------------------------------------------- Properties

  /** @type {AttributeManager} */
  get attributeManager() { // Attribute input/output and binding
    return this._attributeManager || (this._attributeManager = new AttributeManager(this));
  }

  /** @type {EventManager} */
  get eventManager() { return this._eventManager || (this._eventManager = new EventManager(this)); }

  /** @type {MessageManager} */
  get messageManager() { return this._messageManager || (this._messageManager = new MessageManager(this)); }

  /**
   * Component standard role(ex: button). To @override.
   * @type { String }
   */
  get role() { return ''; }

  /** @type {StyleManager} */
  get styleManager() { return this._styleManager || (this._styleManager = new StyleManager(this)); }

  /**
   * List of Functions pending execution.
   * @type {Set<Function>}
   */
  get taskQueue() { return this._taskQueue || (this._taskQueue = new Set()); }

  /**
   * HTMLElement template for the component
   * @type {HTMLTemplateElement}
   */
  get template() {
    return TemplateManager.getTemplate(this.localName, this.createTemplate.bind(this));
  }

  /**
   * HTMLElement template for <style></style> in the component
   * @type {HTMLTemplateElement}
   */
  get templateStyle() {
    return TemplateManager.getTemplateStyle(this.localName, this.createTemplateStyle.bind(this));
  }

  // ------------------------------------------------- Methods

  /**
   * check for tabIndex, role, and add them if not defined
   */
  addStandardAttributes() {
    if (!this.hasAttribute('role') && this.role) {
      this.setAttribute('role', this.role);
    }

    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '0');
    }
  }

  /**
   * Delayed execution of fn
   * @param {Function} fn
   * @param {Number} delay
   * @return {Number} id
   */
  async(fn, delay = 0) { // TODO: deprecated
    console.log('AlgComponent.async deprecated');
    return setTimeout(fn.bind(this), delay);
  }

  /**
   * Build the template Element to be cloned in the shadow creation
   * @return {HTMLTemplateElement}
   */
  createTemplate() {
    return document.createElement('template');
  }

  /**
   * Build the basic static template for style
   * @param {RulesInstance} css
   * @return {HTMLTemplateElement}
   */
  createTemplateStyle(css) {
    const template = document.createElement('template');
    template.innerHTML = `<style></style>`;

    return template;
  }

  /**
   * Send a message to the controller
   * @param {String} channel
   * @param {*} message
   */
  fireMessage(channel, message) {
    this.messageManager.fire(channel, message);
  }

  /**
   * Recover shadowRoot to the original element template
   * Removes all childs except style and template
   */
  restoreTemplate() {
    TemplateManager.restoreTemplate(this);
  }

  // TODO: subscribe
}

export { AlgComponent };
