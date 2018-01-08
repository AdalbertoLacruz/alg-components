// @copyright @polymer\iron-selector\iron-selector.js
// @copyright 2017 ALG

import { AlgIronSelectableBehavior } from './alg-iron-selectable-behavior.js';

class AlgIronSelector extends AlgIronSelectableBehavior {
  /**
   * Build the static template for style
   * @override
   * @return {HTMLTemplateElement} The template Element with style
   */
  createTemplateStyle() {
    let template = super.createTemplateStyle();
    // template.innerHTML = `
    //   <style>
    //   </style>
    // `;
    template.innerHTML = ``;
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
      <slot></slot>
    `;
    this.selfClass.templateIds = this.searchTemplateIds(template.innerHTML);

    return template;
  }
}

window.customElements.define('alg-iron-selector', AlgIronSelector);

export { AlgIronSelector };
