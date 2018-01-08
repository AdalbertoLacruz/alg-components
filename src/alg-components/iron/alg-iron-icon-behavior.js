// @copyright @polymer\iron-icon\iron-icon.js
// @copyright 2017 ALG
// @ts-check

import { AlgIronIconset } from './alg-iron-iconset.js';
import { AlgPaperComponent } from '../paper/alg-paper-component.js';

class AlgIronIconBehavior extends AlgPaperComponent {
  /**
   * Attributes managed by the component
   * @override
   * @type {Array<String>}
   */
  static get observedAttributes() {
    return super.observedAttributes.concat(['icon', 'src']);
  }

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

export { AlgIronIconBehavior };
