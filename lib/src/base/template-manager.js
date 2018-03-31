// @copyright 2017-2018 adalberto.lacruz@gmail.com

import { AlgComponent } from './alg-component.js';
import { RulesInstance } from '../../styles/rules.js';

/**
 * Storage and Management for the components template information
 */
export class TemplateManager {
  /** @type {Map<String, TemplateItem>} Storage */
  static get register() { return this._register || (this._register = new Map()); }

  /**
   * Get an item from the TemplateManager register
   * @return {TemplateItem}
   */
  static getItem(name) {
    return TemplateManager.register.get(name);
  }

  /**
   * Recovers the template for component name.
   * If don't exist creates it with handler()
   * @param {String} name
   * @param {Function} handler
   * @return {HTMLTemplateElement}
   */
  static getTemplate(name, handler) {
    let item = TemplateManager.register.get(name);
    if (!item) {
      item = new TemplateItem();
      TemplateManager.register.set(name, item);
    }

    if (!item.template) item.template = handler();
    if (!item.templateIds) item.templateIds = TemplateManager.searchTemplateIds(item.template.innerHTML);
    return item.template;
  }

  /**
   * Recovers the template id names for component name
   * @param {String} name
   * @return {Array<String>}
   */
  static getTemplateIds(name) {
    return TemplateManager.register.get(name).templateIds;
  }

  /**
   * Recovers the template style for component name.
   * If don't exist creates it with handler()
   * @param {String} name
   * @param {Function} handler
   * @return {HTMLTemplateElement}
   */
  static getTemplateStyle(name, handler) {
    let item = TemplateManager.register.get(name);
    if (!item) {
      item = new TemplateItem();
      TemplateManager.register.set(name, item);
    }

    if (!item.templateStyle) {
      const css = new RulesInstance(null);
      item.templateStyle = handler(css);
      item.styleCouldBeCustom = css.styleCouldBeCustom;
    }

    return item.templateStyle;
  }

  /**
   * Search for id="..." in inner template html
   * @param {String} html - template.innerHTML to search in
   * @return {Array<String>}  such as ['id1', ...'idn']
   */
  static searchTemplateIds(html) {
    let result = [];
    let re = / id="([a-z]*)"/ig;

    let match = re.exec(html);
    while (match) {
      result.push(match[1]);
      match = re.exec(html);
    }
    return result;
  }

  // ------------------------------------------------- Component creation

  /**
   * Build the shadow element, and the reference to the id elements
   * @param {AlgComponent} target
   */
  static createShadowElement(target) {
    target.attachShadow({ mode: 'open' });
    target.shadowRoot.appendChild(target.template.content.cloneNode(true));

    // ids
    target.ids = TemplateManager.getTemplateIds(target.localName).reduce((result, id) => {
      result[id] = target.shadowRoot.querySelector(`#${id}`);
      return result;
    }, new Map());
  }

  /**
   * Build the style from the template and insert it in the shadowRoot
   * @param {AlgComponent} target
   */
  static insertStyle(target) {
    target.shadowRoot.insertBefore(
      target.templateStyle.content.cloneNode(true),
      target.shadowRoot.firstChild);
  }

  /**
   * Analyze if the component style is affected by the dom position.
   * If so, replace it.
   * @param {AlgComponent} target
   */
  static modifyStyle(target) {
    const item = TemplateManager.getItem(target.localName);
    if (!item.styleCouldBeCustom) return;

    const css = new RulesInstance(target);
    const styleElement = target.createTemplateStyle(css);

    if (!css.styleIsCustom) return;

    // only replace style, to keep header count
    target.shadowRoot.querySelector('style').replaceWith(styleElement.content.children[0]);
  }

  /**
   * Recover shadowRoot to the original element template
   * Removes all childs except style and template
   * @param {AlgComponent} target
   */
  static restoreTemplate(target) {
    const shadowRoot = target.shadowRoot;
    const nodes = shadowRoot.childNodes;
    const headerTotal = this.getItem(target.localName).headerTotal;

    while (nodes.length > headerTotal) {
      shadowRoot.removeChild(shadowRoot.lastChild);
    }
  }

  /**
   * Save original template info
   * @param {AlgComponent} target
   */
  static saveTemplateInfo(target) {
    const item = this.getItem(target.localName);

    item.headerElements = target.shadowRoot.childElementCount;
    item.headerTotal = target.shadowRoot.childNodes.length;
  }
}

/**
 * Each component cached in TemplateManager
 */
export class TemplateItem {
  constructor() {
    /** @type {Number} Elements count in original template (header) */
    this.headerElements = 0;

    /** @type {Number} Total count in original template (header) */
    this.headerTotal = 0;

    /** @type {Boolean} style could be different when inserted in dom, affected by other css */
    this.styleCouldBeCustom = false;

    /** @type {HTMLTemplateElement} template body */
    this.template = null;

    /** @type {Array<String>} id names in template = ["id1", ... "idn"] */
    this.templateIds = null;

    /** @type {HTMLTemplateElement} template for <style>...</style> */
    this.templateStyle = null;
  }
}
