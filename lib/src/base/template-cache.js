// @copyright 2017-2018 adalberto.lacruz@gmail.com

import { RulesInstance } from '../../styles/rules.js';

/**
 * Storage for the components template information
 */
export class TemplateCache {
  /**
   * Storage
   * @type {Map<String, TemplateCacheItem>}
   */
  static get register() { return this._register || (this._register = new Map()); }

  /**
   * Recovers a cache item
   * @return {TemplateCacheItem}
   */
  static getItem(name) {
    return this.register.get(name);
  }

  /**
   * Recovers the template for component name.
   * If don't exist creates it with handler
   * @param {String} name
   * @param {Function} handler
   * @return {HTMLTemplateElement}
   */
  static getTemplate(name, handler) {
    let item = this.register.get(name);
    if (!item) {
      item = new TemplateCacheItem();
      this.register.set(name, item);
    }

    if (!item.template) item.template = handler();
    if (!item.templateIds) item.templateIds = this.searchTemplateIds(item.template.innerHTML);
    return item.template;
  }

  /**
   * Recovers the template id names for component name
   * @param {String} name
   * @return {Array<String>}
   */
  static getTemplateIds(name) {
    return this.register.get(name).templateIds;
  }

  /**
   * Recovers the template style for component name.
   * If don't exist creates it with handler()
   * @param {String} name
   * @param {Function} handler
   * @return {HTMLTemplateElement}
   */
  static getTemplateStyle(name, handler) {
    let item = this.register.get(name);
    if (!item) {
      item = new TemplateCacheItem();
      this.register.set(name, item);
    }

    if (!item.templateStyle) {
      const css = new RulesInstance(null);
      item.templateStyle = handler(css);
      item.styleCouldBeCustom = css.styleCouldBeCustom;
    }

    return item.templateStyle;
  }

  /**
   * Search for id="..."
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
}

/**
 * Each component in TemplateCache
 */
export class TemplateCacheItem {
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
