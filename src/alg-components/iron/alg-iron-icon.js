// @copyright @polymer\iron-icon\iron-icon.js
// @copyright 2017 ALG
// @ts-check

import { AlgIronIconset } from './alg-iron-iconset.js';
import { AlgPaperComponent } from '../paper/alg-paper-component.js';

class AlgIronIcon extends AlgPaperComponent {
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
          ${this.getRule('--layout-inline')}
          ${this.getRule('--layout-center-center')}
          position: relative;

          vertical-align: middle;

          fill: var(--iron-icon-fill-color, currentcolor);
          stroke: var(--iron-icon-stroke-color, none);

          width: var(--iron-icon-width, 24px);
          height: var(--iron-icon-height, 24px);

          ${this.apply('--iron-icon') || '/*--iron-icon*/'}
        }
        :host([hidden]) {
          display: none;
        }

      </style>
    `;
    return template;
  }

  // constructor() {
  //   super();
  // }

  /**
   * Attributes managed by the component
   * @override
   * @return {Array<String>}
   */
  static get observedAttributes() {
    return super.observedAttributes.concat(['icon', 'src']);
  }

  /**
   * role, etc - none
   */
  addStandardAttributes() {}

  /**
   * The name of the icon to use. The name should be of the form: `iconset_name:icon_name`.
   * @param {String} attrName - Attribute Name
   * @param {String} value
   */
  bindedIcon(attrName, value) {
    if (this.bindedAttributeSuper(attrName, value)) return;
    this._updateIcon();
  }

  /**
   * If using iron-icon without an iconset, you can set the src to be
   * the URL of an individual icon image file. Note that this will take
   * precedence over a given icon attribute.
   * @param {String} attrName - Attribute Name
   * @param {String} value
   */
  bindedSrc(attrName, value) {
    if (this.bindedAttributeSuper(attrName, value)) return;
    this._updateIcon();
  }

  /**
   * Add the icon to the shadow
   */
  _updateIcon() {
    const icon = this.attributeRegister.get('icon');
    const src = this.attributeRegister.get('src');
    const usesIconset = icon || !src;

    this.restoreTemplate(); // remove previous icon
    let iconElement;
    if (usesIconset) {
      iconElement = AlgIronIconset.getIconElement(icon);
      if (iconElement == null) return;
    } else {
      iconElement = AlgIronIconset.createImageElement(src);
    }

    this.shadowRoot.appendChild(iconElement);
  }
}

window.customElements.define('alg-iron-icon', AlgIronIcon);

export { AlgIronIcon };
