// @copyright @polymer\paper-radio-button\paper-radio-button.js
// @copyright 2017 ALG
// @ts-check

import '../styles/color.js';
import '../styles/default-theme.js';
import { AlgPaperCheckedElementBehavior } from './alg-paper-checked-element-behavior.js';
import * as css from '../util/css-style.js';

/**
 * Button that can be either checked or unchecked. Use a <alg-paper-radio-group> to group
 * a set of radio buttons. When radio buttons are inside a radio group, exactly one radio
 * button in the group can be checked at any time.
 *
 * property vars:
 *  --paper-radio-button-size
 *  --paper-radio-button-ink-size
 *  --paper-radio-button-unchecked-ink-color
 *  --paper-radio-button-checked-ink-color
 *  --paper-radio-button-unchecked-color
 *  --paper-radio-button-unchecked-background-color
 *  --paper-radio-button-checked-color
 *  --paper-radio-button-label-spacing
 *  --paper-radio-button-label-color
 *
 * Custom cssMixins:
 *  --paper-radio-button-radio-container
 *  --paper-radio-button-label
 *  --paper-radio-button-label-checked
 *
 * fire:
 *   change
 *
 * @class
 */
class AlgPaperRadioButton extends AlgPaperCheckedElementBehavior {
  /**
   * Build the static template for style - static. this.apply let custom styles.
   * @override
   * @return {HTMLTemplateElement} The template Element with style
   */
  createTemplateStyle() {
    let template = super.createTemplateStyle();
    template.innerHTML = `
      <style>
        :host {
          display: inline-block;
          line-height: 0;
          white-space: nowrap;
          cursor: pointer;
          ${this.getRule('--paper-font-common-base')}
          --calculated-paper-radio-button-size: var(--paper-radio-button-size, 16px);
          ${this.applyCustomVariable('--paper-radio-button-ink-size', this.calculateInkSize.bind(this))}
          --calculated-paper-radio-button-ink-size: var(--paper-radio-button-ink-size, 48px);
        }

        :host(:focus) {
          outline: none;
        }

        #radioContainer {
          ${this.getRule('--layout-inline')}
          ${this.getRule('--layout-center-center')}
          position: relative;
          width: var(--calculated-paper-radio-button-size);
          height: var(--calculated-paper-radio-button-size);
          vertical-align: middle;

          ${this.apply('--paper-radio-button-radio-container')}
        }

        #ink {
          position: absolute;
          top: 50%;
          left: 50%;
          right: auto;
          width: var(--calculated-paper-radio-button-ink-size);
          height: var(--calculated-paper-radio-button-ink-size);
          color: var(--paper-radio-button-unchecked-ink-color, var(--primary-text-color));
          opacity: 0.6;
          pointer-events: none;
          -webkit-transform: translate(-50%, -50%);
          transform: translate(-50%, -50%);
        }

        #ink[checked] {
          color: var(--paper-radio-button-checked-ink-color, var(--primary-color));
        }

        #offRadio, #onRadio {
          position: absolute;
          box-sizing: border-box;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }

        #offRadio {
          border: 2px solid var(--paper-radio-button-unchecked-color, var(--primary-text-color));
          background-color: var(--paper-radio-button-unchecked-background-color, transparent);
          transition: border-color 0.28s;
        }

        #onRadio {
          background-color: var(--paper-radio-button-checked-color, var(--primary-color));
          -webkit-transform: scale(0);
          transform: scale(0);
          transition: -webkit-transform ease 0.28s;
          transition: transform ease 0.28s;
          will-change: transform;
        }

        :host([checked]) #offRadio {
          border-color: var(--paper-radio-button-checked-color, var(--primary-color));
        }

        :host([checked]) #onRadio {
          -webkit-transform: scale(0.5);
          transform: scale(0.5);
        }

        #radioLabel {
          line-height: normal;
          position: relative;
          display: inline-block;
          vertical-align: middle;
          margin-left: var(--paper-radio-button-label-spacing, 10px);
          white-space: normal;
          color: var(--paper-radio-button-label-color, var(--primary-text-color));

          ${this.apply('--paper-radio-button-label')}
        }

        :host([checked]) #radioLabel {
          ${this.apply('--paper-radio-button-label-checked')}
        }

        :host-context([dir="rtl"]) #radioLabel {
          margin-left: 0;
          margin-right: var(--paper-radio-button-label-spacing, 10px);
        }

        #radioLabel[hidden] {
          display: none;
        }

        /* disabled state */

        :host([disabled]) #offRadio {
          border-color: var(--paper-radio-button-unchecked-color, var(--primary-text-color));
          opacity: 0.5;
        }

        :host([disabled][checked]) #onRadio {
          background-color: var(--paper-radio-button-unchecked-color, var(--primary-text-color));
          opacity: 0.5;
        }

        :host([disabled]) #radioLabel {
          /* slightly darker than the button, so that it's readable */
          opacity: 0.65;
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
      <div id="radioContainer">
        <div id="offRadio"></div>
        <div id="onRadio"></div>
      </div>

      <div id="radioLabel"><slot></slot></div>
    `;
    this.selfClass.templateIds = this.searchTemplateIds(template.innerHTML);

    return template;
  }

  // constructor

  // /**
  //  * add attributes
  //  */
  // addStandardAttributes() {
  //   super.addStandardAttributes();
  //   // if (!this.hasAttribute('aria-checked')) this.setAttribute('aria-checked', 'false');
  // }

  /**
   * Called every time the element is inserted into the DOM
   * @override
   */
  connectedCallback() {
    super.connectedCallback();
    this.rippleContainer = this.ids['radioContainer'];
  }

  /**
   * Calculate --paper-radio-button-ink-size
   * @param {Boolean} isDefault
   * @return {String}
   */
  calculateInkSize(id, isDefault) {
    if (isDefault) return `/* ${id} */`;

    let inkSize = css.getComputedProperty(this, '--paper-radio-button-ink-size');
    if (!inkSize) {
      let size = parseFloat(css.getComputedProperty(this, '--paper-radio-button-size') || '16px');
      let defaultInkSize = Math.floor(3 * size);

      // The button and ripple need to have the same parity so that their centers align.
      if (defaultInkSize % 2 !== size % 2) defaultInkSize++;
      return `${id}: ${defaultInkSize.toString()}px;`;
    }
    return `/* ${id} yet defined */`;
  }
}

window.customElements.define('alg-paper-radio-button', AlgPaperRadioButton);

export { AlgPaperRadioButton };
