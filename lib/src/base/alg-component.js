// @copyright 2017-2018 adalberto.lacruz@gmail.com

import { BinderElement } from './binder-element.js';
import { RulesInstance } from '../../styles/rules.js';
import { TemplateCache } from './template-cache.js';

/**
 * Base class for AlgComponents
 * <p>
 * Process the templates to define ShadowElement with HTML and styles
 *
 * Lifecicle:
 *   constructor()
 *     ..async domLoaded
 *   connectedCallBack()
 *     ..deferredConstructor()
 *     ..attributeChangeCallBack()
 *   domLoaded()
 *
 * @class
 */
class AlgComponent extends BinderElement {
  /**
   * Component standar role (ex: button). To @override.
   * @type {String}
   */
  get role() { return ''; }

  /**
   * Build the template Element to be cloned in the shadow creation
   * @return {HTMLTemplateElement}
   */
  createTemplate() {
    const template = document.createElement('template');

    // Each component must fill innerHTML
    template.innerHTML = ``;

    return template;
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

  //  ******************* end overrides **********************

  constructor() {
    super();
    this.createShadowElement();
    this.insertStyle();
  }

  /**
   * Low priority constructor tasks
   */
  deferredConstructor() {
    super.deferredConstructor();

    this.addStandardAttributes();
  }

  // /**
  //  * Called every time the element is inserted into the DOM
  //  * @override
  //  */
  // connectedCallback() {
  //   super.connectedCallback();
  //   // this.addStandardAttributes();

  //   // Promise.resolve().then(this.modifyStyle.bind(this));
  // }

  /**
   * Dom has the components created
   */
  domLoaded() {
    super.domLoaded();

    this.modifyStyle();
  }

  // ids - Map<String, HTMLElement> - Access to component childs

  /**
   * HTMLElement template for the component
   * @type {HTMLTemplateElement}
   */
  get template() {
    return TemplateCache.getTemplate(this.localName, this.createTemplate.bind(this));
  }

  /** Template header info @type {Object} */
  get templateInfo() {
    return this._templateInfo || (this._templateInfo = (() => {
      const shadow = this.shadowRoot;
      return {
        header: {
          elements: shadow.childElementCount,
          total: shadow.childNodes.length
        }
      };
    })());
  }

  /**
   * HTMLElement template for <style></style> in the component
   * @type {HTMLTemplateElement}
   */
  get templateStyle() {
    return TemplateCache.getTemplateStyle(this.localName, this.createTemplateStyle.bind(this));
  }

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
   * Build the shadow element, and the reference to the id elements
   */
  createShadowElement() {
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(this.template.content.cloneNode(true));

    this.ids = TemplateCache.getTemplateIds(this.localName).reduce((result, id) => {
      result[id] = this.shadowRoot.querySelector(`#${id}`);
      return result;
    }, {});
  }

  /**
   * Build the style from the template and insert it in the shadowRoot
   */
  insertStyle() {
    this.shadowRoot.insertBefore(this.templateStyle.content.cloneNode(true), this.shadowRoot.firstChild);
  }

  /**
   * Analyze if the component style is affected by the dom position.
   * If so, replace it.
   */
  modifyStyle() {
    const item = TemplateCache.getItem(this.localName);
    if (!item.styleCouldBeCustom) return;

    const css = new RulesInstance(this);
    const styleElement = this.createTemplateStyle(css);

    if (!css.styleIsCustom) return;
    this.shadowRoot.querySelector('style').replaceWith(styleElement.content);
  }

  /**
   * Recover shadowRoot to the original element template
   * Removes all childs except style and template
   */
  restoreTemplate() {
    const nodes = this.shadowRoot.childNodes;
    const headerLength = this.templateInfo.header.total;
    let len = nodes.length;
    while (len > headerLength) {
      this.shadowRoot.removeChild(this.shadowRoot.lastChild);
      len = nodes.length;
    }
  }
}

export { AlgComponent };
