// @copyright @polymer\iron-behaviors\demo\simple-button.js
// @copyright 2017-2018 adalberto.lacruz@gmail.com

import { AlgComponent } from '../../../lib/src/base/alg-component.js';
import { AlgIronButtonStateMixin } from '../../../lib/src/mixins/alg-iron-button-state-mixin.js';
import { mixinFactory } from '../../../lib/src/util/mixins.js';
// eslint-disable-next-line
import { RulesInstance } from '../../../lib/styles/rules.js';

/**
 * @extends { AlgComponent}
 * @class
 */
class SimpleButton extends mixinFactory(AlgComponent, AlgIronButtonStateMixin) {
  /**
   * Build the static template for style - static. this.apply let custom styles.
   * @override
   * @param {RulesInstance} css
   * @return {HTMLTemplateElement} The template Element with style
   */
  createTemplateStyle(css) {
    let template = super.createTemplateStyle(css);
    template.innerHTML = `
      <style>
        :host {
          display: inline-block;
          background-color: #4285F4;
          color: #fff;
          min-height: 8px;
          min-width: 8px;
          padding: 16px;
          text-transform: uppercase;
          border-radius: 3px;
          -moz-user-select: none;
          -ms-user-select: none;
          -webkit-user-select: none;
          user-select: none;
          cursor: pointer;
        }

        :host([disabled]) {
          opacity: 0.3;
          pointer-events: none;
        }

        :host([active]),
        :host([pressed]) {
          background-color: #3367D6;
          box-shadow: inset 0 3px 5px rgba(0,0,0,.2);
        }

        :host([focused]) {
          box-shadow: 0 16px 24px 2px rgba(0, 0, 0, 0.14),
                      0  6px 30px 5px rgba(0, 0, 0, 0.12),
                      0  8px 10px -5px rgba(0, 0, 0, 0.4);
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
      <slot></slot>
    `;

    return template;
  }

  /** For Aria @override @type {String} */
  get role() { return 'button'; }
}

window.customElements.define('simple-button', SimpleButton);

export { SimpleButton };
