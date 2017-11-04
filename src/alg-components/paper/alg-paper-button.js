// @copyright @polymer\paper-button\paper-button.js
// @copyright @polymer\paper-behaviors\paper-button-behavior.js
// @copyright 2017 ALG
// @ts-check
/* global cssRules */

import { AlgIronButtonState } from '../iron/alg-iron-button-state.js';
import { AlgPaperComponent } from './alg-paper-component.js';
import { AlgPaperRippleBehavior } from './alg-paper-ripple-behavior.js';
import { ObsBoolean } from '../types/obs-boolean.js';
import { ObsNumber } from '../types/obs-number.js';

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
class AlgPaperButton extends AlgPaperComponent {
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

  constructor() {
    super();
    this.ironButtonState = new AlgIronButtonState(this); // mixin. Order is important
    this.AlgPaperRippleBehavior = new AlgPaperRippleBehavior(this);

    const eventManager = this.eventManager;
    eventManager
      .onCustom('active', this._calculateElevation.bind(this))
      .onCustom('disabled', this._calculateElevation.bind(this))
      .onCustom('focused', this._calculateElevation.bind(this))
      .onCustom('pressed', this._calculateElevation.bind(this))
      .onCustom('receivedFocusFromKeyboard', this._calculateElevation.bind(this))
      .onChangeReflectToClass('receivedFocusFromKeyboard', this, 'keyboard-focus', true)
      .subscribe();
  }

  /**
   * Attributes managed by the component
   * @override
   * @return {Array<String>}
   */
  static get observedAttributes() {
    return super.observedAttributes.concat(['noink', 'raised', 'toggles', 'on-change', 'on-click']);
  }

  get active() {
    return this._active ||
      (this._active = /** @type {ObsBoolean} */ (this.eventManager.getObservable('active')));
  }

  get disabled() {
    return this._pressed ||
      (this._disabled = /** @type {ObsBoolean} */ (this.eventManager.getObservable('disabled')));
  }

  get elevation() {
    return this._elevation || (this._elevation = new ObsNumber('elevation', 0)
      .onChangeReflectToAttribute(this));
  }

  /**
   * If true, the user is currently holding down the button.
   * @return {ObsBoolean}
   */
  get pressed() {
    return this._pressed ||
      (this._pressed = /** @type {ObsBoolean} */ (this.eventManager.getObservable('pressed')));
  }

  /**
   * Attribute, if true, the button should be styled with a shadow.
   * @return {ObsBoolean}
   */
  get raised() {
    return this._raised || (this._raised = new ObsBoolean('raised', false)
      .observe(this._calculateElevation.bind(this)));
  }

  /**
   * True if the input device that caused the element to receive focus was a keyboard.
   * @return {ObsBoolean}
   */
  get receivedFocusFromKeyboard() {
    return this._receivedFocusFromKeyboard || (this._receivedFocusFromKeyboard =
      /** @type {ObsBoolean} */ (this.eventManager.getObservable('receivedFocusFromKeyboard')));
  }

  /** For Aria @override @return {String} */
  get role() { return 'button'; }

  // /**
  //  * Default events for the component
  //  * @override
  //  */
  // addDefaultEventHandlers() {
  //   // this.eventHandlers.set('click', null);
  //   // this.customHandlers.add('change'); // on alg-iron-button-state
  // }

  /**
   * check for animated and add them if not defined
   */
  addStandardAttributes() {
    super.addStandardAttributes();
    if (!this.hasAttribute('animated')) this.setAttribute('animated', '');
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
    let elevation = 1;

    if (!this.raised.value) {
      elevation = 0;
    } else {
      if (this.disabled.value) {
        elevation = 0;
      } else if (this.active.value || this.pressed.value) {
        elevation = 4;
      } else if (this.receivedFocusFromKeyboard.value) {
        elevation = 3;
      }
    }
    this.elevation.update(elevation);
  }
}

window.customElements.define('alg-paper-button', AlgPaperButton);

export { AlgPaperButton };
