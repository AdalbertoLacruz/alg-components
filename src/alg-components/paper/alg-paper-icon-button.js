// @copyright @polymer\paper-icon-button\paper-icon-button.js
// @copyright 2017 ALG

import '../styles/default-theme.js';
import { AlgActionBehavior } from '../mixins/alg-action-behavior.js';
import { AlgIronButtonState } from '../mixins/alg-iron-button-state.js';
import { AlgIronIconBehavior } from '../iron/alg-iron-icon-behavior.js';
import { AlgPaperInkyFocusBehavior } from '../mixins/alg-paper-inky-focus-behavior.js';
import { AlgPaperRippleBehavior} from '../mixins/alg-paper-ripple-behavior.js';
import { mixinFactory } from '../util/mixins.js';

/**
 * alg-paper-icon-button is a button with an image placed at the center.
 * When the user touches the button, a ripple effect emanates from the center of the button.
 *
 * property vars:
 *  --paper-icon-button-ink-color
 *  --paper-icon-button-disabled-text
 *
 * Custom cssMixins:
 *  --paper-icon-button
 *  --paper-icon-button-disabled
 *  --paper-icon-button-hover
 *
 * Fires
 *  on-change
 *
 * @class
 */
class AlgPaperIconButton extends
  mixinFactory(AlgIronIconBehavior, AlgIronButtonState, AlgPaperRippleBehavior,
    AlgPaperInkyFocusBehavior, AlgActionBehavior) {
  // :host { -- from iron-icon --
  //   ${this.getRule('--layout-inline')}
  //   ${this.getRule('--layout-center-center')}
  //   vertical-align: middle;
  //   ${this.apply('--iron-icon') || '/*--iron-icon*/'}
  // }

  /**
   * Build the static template for style
   * @override
   * @return {HTMLTemplateElement} The template Element with style
   */
  createTemplateStyle() {
    let template = super.createTemplateStyle();
    template.innerHTML = `
      <style>
        :host {
          display: inline-block;
          position: relative;
          padding: 8px;
          outline: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          cursor: pointer;
          z-index: 0;
          line-height: 1;

          width: 40px;
          height: 40px;

          fill: var(--iron-icon-fill-color, currentcolor);
          stroke: var(--iron-icon-stroke-color, none);

          /* NOTE: Both values are needed, since some phones require the value to be \`transparent\`. */
          -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
          -webkit-tap-highlight-color: transparent;

          /* Because of polymer/2558, this style has lower specificity than * */
          box-sizing: border-box !important;

          ${this.apply('--paper-icon-button')}
        }

        :host #ink {
          color: var(--paper-icon-button-ink-color, var(--primary-text-color));
          opacity: 0.6;
        }

        :host([disabled]) {
          color: var(--paper-icon-button-disabled-text, var(--disabled-text-color));
          pointer-events: none;
          cursor: auto;

          ${this.apply('--paper-icon-button-disabled')}
        }

        :host([hidden]) {
          display: none;
        }

        :host(:hover) {
          ${this.apply('--paper-icon-button-hover')}
        }

      </style>
    `;
    return template;
  }

  /** For Aria @override @return {String} */
  get role() { return 'button'; }

  /**
   * Attributes managed by the component
   * @override
   * @type {Array<String>}
   */
  static get observedAttributes() {
    return super.observedAttributes.concat(['alt']);
  }

  /**
   * Specifies the alternate text for the button, for accessibility.
   * @param {String} attrName - Attribute Name
   * @param {String} value
   */
  bindedAlt(attrName, value) {
    if (this.bindedAttributeSuper(attrName, value)) return;

    const label = this.getAttribute('aria-label');

    // Don't stomp over a user-set aria-label.
    if (!label || value !== label) {
      this.setAttribute('aria-label', value);
    }
  }
}

window.customElements.define('alg-paper-icon-button', AlgPaperIconButton);

export { AlgPaperIconButton };
