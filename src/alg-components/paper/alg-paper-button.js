// @copyright @polymer\paper-button\paper-button.js
// @copyright 2017 ALG
// @ts-check

import { AlgPaperButtonBehavior } from './alg-paper-button-behavior.js';
import { ObservableEvent } from '../types/observable-event.js';

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
   * Build the static template for style - static. this.apply let custom styles.
   * @override
   * @return {HTMLTemplateElement} The template Element with style
   */
  createTemplateStyle() {
    let template = super.createTemplateStyle();
    template.innerHTML = `
      <style>
        ${this.getRule('paper-material-styles')}
        :host {
          ${this.getRule('--layout-inline')}
          ${this.getRule('--layout-center-center')}
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

          ${this.getRule('--paper-font-common-base')}
          ${this.apply('--paper-button')}
        }

        :host([elevation="1"]) {
          ${this.getRule('--paper-material-elevation-1')}
        }

        :host([elevation="2"]) {
          ${this.getRule('--paper-material-elevation-2')}
        }

        :host([elevation="3"]) {
          ${this.getRule('--paper-material-elevation-3')}
        }

        :host([elevation="4"]) {
          ${this.getRule('--paper-material-elevation-4')}
        }

        :host([elevation="5"]) {
          ${this.getRule('--paper-material-elevation-5')}
        }

        :host([hidden]) {
          display: none !important;
        }

        :host([raised].keyboard-focus) {
          font-weight: bold;
          ${this.apply('--paper-button-raised-keyboard-focus')}
        }

        :host(:not([raised]).keyboard-focus) {
          font-weight: bold;
          ${this.apply('--paper-button-flat-keyboard-focus')}
        }

        :host([disabled]) {
          background: #eaeaea;
          color: #a8a8a8;
          cursor: auto;
          pointer-events: none;
          ${this.apply('--paper-button-disabled')}
        }

        :host([animated]) {
          ${this.getRule('--shadow-transition')}
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
    this.selfClass.templateIds = this.searchTemplateIds(template.innerHTML);

    return template;
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
   * Attribute, if true, the button should be styled with a shadow.
   * @type {ObservableEvent}
   */
  get raised() {
    return this._raised || (this._raised = new ObservableEvent('raised').setType('boolean')
      .observe(this._calculateElevation.bind(this)));
  }

  /**
   * If true, the button should be styled with a shadow.
   * @param {String} attrName - Attribute Name
   * @param {String} value
   */
  bindedRaised(attrName, value) {
    if (this.bindedAttributeSuper(attrName, value)) return;

    this.raised.update(value !== null);
  }

  /**
   * Calculate the item shadow
   * @override
   */
  _calculateElevation() {
    if (!this.raised.value) {
      this.elevation.update(0);
    } else {
      super._calculateElevation();
    }
  }
}

window.customElements.define('alg-paper-button', AlgPaperButton);

export { AlgPaperButton };
