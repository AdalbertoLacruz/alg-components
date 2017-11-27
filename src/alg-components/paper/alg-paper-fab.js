// @copyright @polymer\paper-fab\paper-fab.js
// @copyright 2017 ALG
// @ts-check

import '../styles/default-theme.js';
import * as FHtml from '../util/f-html.js';
import { AlgIronIcon } from '../iron/alg-iron-icon.js';
import { AlgPaperButtonBehavior } from './alg-paper-button-behavior.js';

/**
 * Similar to alg-paper-button, except raised.
 * supports: icon, src, label, mini
 * @class
 */
class AlgPaperFab extends AlgPaperButtonBehavior {
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
          ${this.getRule('--layout-vertical')}
          ${this.getRule('--layout-center-center')}

          background: var(--paper-fab-background, var(--accent-color));
          border-radius: 50%;
          box-sizing: border-box;
          color: var(--text-primary-color);
          cursor: pointer;
          height: 56px;
          min-width: 0;
          outline: none;
          padding: 14px;
          position: relative;
          -moz-user-select: none;
          -ms-user-select: none;
          -webkit-user-select: none;
          user-select: none;
          width: 56px;
          z-index: 0;

          /* NOTE: Both values are needed, since some phones require the value \`transparent\`. */
          -webkit-tap-highlight-color: rgba(0,0,0,0);
          -webkit-tap-highlight-color: transparent;

          ${this.apply('--paper-fab')}
        }

        [hidden] {
          display: none !important;
        }

        :host([mini]) {
          width: 40px;
          height: 40px;
          padding: 8px;

          ${this.apply('--paper-fab-mini')}
        }

        :host([disabled]) {
          color: var(--paper-fab-disabled-text, var(--paper-grey-500));
          background: var(--paper-fab-disabled-background, var(--paper-grey-300));

          ${this.apply('--paper-fab-disabled')}
        }

        alg-iron-icon {
          ${this.apply('--paper-fab-iron-icon')}
        }

        span {
          width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          text-align: center;

          ${this.apply('--paper-fab-label')}
        }

        :host(.keyboard-focus) {
          background: var(--paper-fab-keyboard-focus-background, var(--paper-pink-900));
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

    // <alg-iron-icon id="icon" -hidden- -src- -icon-></algiron-icon>
    // <span id="span" -hidden- > -label-</span>
    template.innerHTML = `
      <alg-iron-icon id="icon" hidden></alg-iron-icon>
      <span id="span" hidden></span>
    `;
    this.selfClass.templateIds = this.searchTemplateIds(template.innerHTML);

    return template;
  }

  /**
   * Attributes managed by the component
   * @override
   * @type {Array<String>}
   */
  static get observedAttributes() {
    return super.observedAttributes.concat(['icon', 'label', 'src']); // & mini
  }

  /**
   * Specifies the icon name or index in the set of icons available in
   * the icon's icon set. If the icon property is specified,
   * the src property should not be.
   * @param {String} attrName - Attribute Name
   * @param {String} value
   */
  bindedIcon(attrName, value) {
    if (this.bindedAttributeSuper(attrName, value)) return;

    this.ids['icon'].setAttribute(attrName, value);
    this._computeIsIconFab();
  }

  /**
   * The label displayed in the badge. The label is centered, and ideally
   * should have very few characters.
   * @param {String} attrName - Attribute Name
   * @param {String} value
   */
  bindedLabel(attrName, value) {
    if (this.bindedAttributeSuper(attrName, value)) return;

    this.ids['span'].innerHTML = value;
    this.setAttribute('aria-label', value);
    this._computeIsIconFab();
  }

  // Set this to true to style this is a "mini" FAB. only affects css.
  // bindedMini

  /**
   * The URL of an image for the icon. If the src property is specified,
   * the icon property should not be.
   * @param {String} attrName - Attribute Name
   * @param {String} value
   */
  bindedSrc(attrName, value) {
    if (this.bindedAttributeSuper(attrName, value)) return;

    this.ids['icon'].setAttribute(attrName, value);
    this._computeIsIconFab();
  }

  _computeIsIconFab() {
    const spanHiden = Boolean(this.attributeRegister.get('icon') || this.attributeRegister.get('src'));

    FHtml.attributeToggle(this.ids['span'], 'hidden', spanHiden);
    FHtml.attributeToggle(this.ids['icon'], 'hidden', !spanHiden);
  }
}

window.customElements.define('alg-paper-fab', AlgPaperFab);

export { AlgPaperFab };
