// @copyright @polymer\paper-button\paper-button.js
// @copyright 2017-2018 adalberto.lacruz@gmail.com

import { AlgPaperButtonBehavior } from '../src/behaviors/alg-paper-button-behavior.js';
// eslint-disable-next-line
import { RulesInstance } from '../styles/rules.js';
import { TYPE_BOOL } from '../src/util/constants.js';

/**
 * Definition for alg-paper-button component
 * <p>
 * button with id, defines by default 'on-click' = 'controller:ID_CLICK'
 *
 * property vars:
 *  --paper-button-ink-color
 * Custom cssMixins:
 *  --paper-button
 *  --paper-button-disabled
 *  --paper-button-flat-keyboard-focus
 *  --paper-button-raised-keyboard-focus
 * Event handlers
 *  on-click
 *  on-change (toggles)
 *
 * @type {class}
 */
class AlgPaperButton extends AlgPaperButtonBehavior {
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
        ${css.use('paper-material-styles')}
        :host {
          ${css.use('--layout-inline')}
          ${css.use('--layout-center-center')}
          position: relative;
          box-sizing: border-box;
          min-width: 5.14em;
          margin: 0 0.29em;
          background: transparent;
          -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
          -webkit-tap-highlight-color: transparent;
          font: inherit;
          text-transform: uppercase;
          outline-width: 0;
          border-radius: 3px;
          -moz-user-select: none;
          -ms-user-select: none;
          -webkit-user-select: none;
          user-select: none;
          cursor: pointer;
          z-index: 0;
          padding: 0.7em 0.57em;

          ${css.use('--paper-font-common-base')}
          ${css.apply('--paper-button')}
        }

        :host([elevation="1"]) {
          ${css.use('--paper-material-elevation-1')}
        }

        :host([elevation="2"]) {
          ${css.use('--paper-material-elevation-2')}
        }

        :host([elevation="3"]) {
          ${css.use('--paper-material-elevation-3')}
        }

        :host([elevation="4"]) {
          ${css.use('--paper-material-elevation-4')}
        }

        :host([elevation="5"]) {
          ${css.use('--paper-material-elevation-5')}
        }

        :host([hidden]) {
          display: none !important;
        }

        :host([raised].keyboard-focus) {
          font-weight: bold;
          ${css.apply('--paper-button-raised-keyboard-focus')}
        }

        :host(:not([raised]).keyboard-focus) {
          font-weight: bold;
          ${css.apply('--paper-button-flat-keyboard-focus')}
        }

        :host([disabled]) {
          background: #eaeaea;
          color: #a8a8a8;
          cursor: auto;
          pointer-events: none;
          ${css.apply('--paper-button-disabled')}
        }

        :host([animated]) {
          ${css.use('--shadow-transition')}
        }

        paper-ripple {
          color: var(--paper-button-ink-color);
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

  /** @override */
  deferredConstructor() {
    super.deferredConstructor();

    this.attributeManager
      // If true, the button should be styled with a shadow.
      .define('raised', TYPE_BOOL, { isLocal: true})
      .on(this._calculateElevation.bind(this));

    this.raised$ = this.attributeManager.get('raised');
  }

  /**
   * Attributes managed by the component
   * @override
   * @return {Array<String>}
   */
  static get observedAttributes() {
    return super.observedAttributes.concat(['raised']);
  }

  /**
   * Calculate the item shadow
   * @override
   */
  _calculateElevation() {
    if (!this.raised$.value) {
      this.elevation$.update(0);
    } else {
      super._calculateElevation();
    }
  }
}

window.customElements.define('alg-paper-button', AlgPaperButton);

export { AlgPaperButton };
