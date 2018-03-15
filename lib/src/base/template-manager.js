// @copyright 2017-2018 adalberto.lacruz@gmail.com

import { AlgComponent } from './alg-component.js';
import { RulesInstance } from '../../styles/rules.js';

/**
 * Storage and Management for the components template information
 */
export class TemplateManager {
  /**
   * Storage
   * @type {Map<String, TemplateItem>}
   */
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
    target.shadowRoot.querySelector('style').replaceWith(styleElement.content);
  }
}

/**
 * Each component cached in TemplateManager
 */
export class TemplateItem {
  constructor() {
    /**
     * style could be different when inserted in dom, affected by other css
     */
    this.styleCouldBeCustom = false;

    /**
     * template body
     * @type {HTMLTemplateElement}
     */
    this.template = null;

    /**
     * id names in template = ["id1", ... "idn"]
     * @type {Array<String>}
     */
    this.templateIds = null;

    /**
     * template for <style>...</style>
     * @type {HTMLTemplateElement}
     */
    this.templateStyle = null;
  }
}
