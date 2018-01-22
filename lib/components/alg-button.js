// @copyright 2017-2018 adalberto.lacruz@gmail.com

import { AlgComponent } from '../src/base/alg-component.js';

/**
 * Definition for alg-button component
 * <p>
 * button with id, defines by default 'on-click' = 'controller:ID_CLICK'
 *
 * @type {class}
 */
class AlgButton extends AlgComponent {
  /**
   * Attributes managed by the component
   * @override
   * @type {Array<String>}
   */
  static get observedAttributes() {
    return super.observedAttributes.concat(['color', 'text', 'on-click']);
  }

  /**
   * For Aria
   * @type {String}
   */
  get role() { return 'button'; }

  /**
   * Default events for the component
   * @override
   */
  addDefaultEventHandlers() {
    this.eventHandlers.set('click', null);
  }

  /**
   * Set binded style color attribute
   *
   * @param {String} attrName - Attribute Name
   * @param {String} value    - Color to set
   */
  bindedColor(attrName, value) {
    if (this.bindedAttributeSuper(attrName, value)) return;
    this.ids['in'].style.color = value;
  }

  /**
   * Set binded text attribute
   *
   * @param {String} attrName - Attribute Name
   * @param {String} value    - text to set
   */
  bindedText(attrName, value) {
    if (this.bindedAttributeSuper(attrName, value)) return;
    this.ids['in'].innerHTML = value;
  }

  /**
   * Build the static template for style
   * @override
   * @return {HTMLTemplateElement} The template Element with style
   */
  createTemplateStyle() {
    let template = super.createTemplateStyle();
    template.innerHTML = `
      <style>
        button {
          color: #cb6918;
          cursor: pointer;
        }
        #in {
          line-height: 2;
        }
      </style>
    `;
    return template;
  }

  /**
   * Build for the class (static) templateElement, templateStyle and templateIds.
   * @override
   * @return {HTMLTemplateElement} The template Element to be cloned in the shadow creation
   */
  createTemplate() {
    let template = super.createTemplate();
    template.innerHTML = `
      <button id="but"><slot></slot><span id="in"></span></button>
    `;
    this.selfClass.templateIds = this.searchTemplateIds(template.innerHTML);

    return template;
  }
}

window.customElements.define('alg-button', AlgButton);

export { AlgButton };
