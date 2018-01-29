// @copyright @polymer\iron-icon\iron-icon.js
// @copyright 2017-2018 adalberto.lacruz@gmail.com

import { AlgIronIconBehavior } from '../src/behaviors/alg-iron-icon-behavior.js';
// eslint-disable-next-line
import { RulesInstance } from '../styles/rules.js';

class AlgIronIcon extends AlgIronIconBehavior {
  /**
   * Build the static template for style
   * @override
   * @param {RulesInstance} css
   * @return {HTMLTemplateElement} The template Element with style
   */
  createTemplateStyle(css) {
    let template = super.createTemplateStyle(css);
    template.innerHTML = `
      <style>
        :host {
          ${css.use('--layout-inline')}
          ${css.use('--layout-center-center')}
          position: relative;

          vertical-align: middle;

          fill: var(--iron-icon-fill-color, currentcolor);
          stroke: var(--iron-icon-stroke-color, none);

          width: var(--iron-icon-width, 24px);
          height: var(--iron-icon-height, 24px);

          ${css.apply('--iron-icon') || '/*--iron-icon*/'}
        }
        :host([hidden]) {
          display: none;
        }

      </style>
    `;
    return template;
  }

  /**
   * role, etc - none
   */
  addStandardAttributes() { }
}

window.customElements.define('alg-iron-icon', AlgIronIcon);

export { AlgIronIcon };
