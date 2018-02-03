// @copyright @polymer\paper-icon-button\paper-icon-button.js
// @copyright 2017-2018 adalberto.lacruz@gmail.com

import '../styles/default-theme.js';
import { AlgActionMixin } from '../src/mixins/alg-action-mixin.js';
import { AlgIronButtonStateMixin } from '../src/mixins/alg-iron-button-state-mixin.js';
import { AlgIronIconBehavior } from '../src/behaviors/alg-iron-icon-behavior.js';
import { AlgPaperInkyFocusMixin } from '../src/mixins/alg-paper-inky-focus-mixin.js';
import { AlgPaperRippleMixin} from '../src/mixins/alg-paper-ripple-mixin.js';
import { mixinFactory } from '../src/util/mixins.js';
// eslint-disable-next-line
import { RulesInstance } from '../styles/rules.js';

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
 * @extends {AlgIronIconBehavior}
 * @class
 */
class AlgPaperIconButton extends
  mixinFactory(AlgIronIconBehavior, AlgIronButtonStateMixin, AlgPaperRippleMixin,
    AlgPaperInkyFocusMixin, AlgActionMixin) {
  // :host { -- from iron-icon --
  //   ${this.getRule('--layout-inline')}
  //   ${this.getRule('--layout-center-center')}
  //   vertical-align: middle;
  //   ${this.apply('--iron-icon') || '/*--iron-icon*/'}
  // }

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

          ${css.apply('--paper-icon-button')}
        }

        :host #ink {
          color: var(--paper-icon-button-ink-color, var(--primary-text-color));
          opacity: 0.6;
        }

        :host([disabled]) {
          color: var(--paper-icon-button-disabled-text, var(--disabled-text-color));
          pointer-events: none;
          cursor: auto;

          ${css.apply('--paper-icon-button-disabled')}
        }

        :host([hidden]) {
          display: none;
        }

        :host(:hover) {
          ${css.apply('--paper-icon-button-hover')}
        }
      </style>
    `;
    return template;
  }

  /** @override */
  deferredConstructor() {
    super.deferredConstructor();

    this.attributeManager
      // Specifies the alternate text for the button, for accessibility.
      .define('alt', 'string')
      .on((value) => {
        const label = this.getAttribute('aria-label');

        // Don't stomp over a user-set aria-label.
        if (!label || value !== label) {
          this.setAttribute('aria-label', value);
        }
      });
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
}

window.customElements.define('alg-paper-icon-button', AlgPaperIconButton);

export { AlgPaperIconButton };
