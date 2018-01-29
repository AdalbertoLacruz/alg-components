// @copyright @polymer\iron-selector\iron-selector.js
// @copyright 2017-2018 adalberto.lacruz@gmail.com

import { AlgIronSelectableBehavior } from '../src/behaviors/alg-iron-selectable-behavior.js';
// eslint-disable-next-line
import { RulesInstance } from '../styles/rules.js';

/**
 * If the selector contins active elements as alg-paper-radio-button,
 * alg-paper-toggle-button, ..., the tap event is ignored, but better use `activate-event=""`
 */
class AlgIronSelector extends AlgIronSelectableBehavior {
  /**
   * Build the static template for style
   * @override
   * @param {RulesInstance} css
   * @return {HTMLTemplateElement} The template Element with style
   */
  createTemplateStyle(css) {
    let template = super.createTemplateStyle(css);
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

    return template;
  }
}

window.customElements.define('alg-iron-selector', AlgIronSelector);

export { AlgIronSelector };
