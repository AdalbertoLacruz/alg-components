// @copyright @polymer\iron-icon\iron-icon.js
// @copyright 2017-2018 adalberto.lacruz@gmail.com

import { AlgComponent } from '../base/alg-component.js';
import { AlgIronIconset } from '../base/alg-iron-iconset.js';

class AlgIronIconBehavior extends AlgComponent {
  /** @override */
  deferredConstructor() {
    super.deferredConstructor();

    // Minimize execution
    this.updateIconCounter = 0;

    const attributeManager = this.attributeManager;
    attributeManager
      // The name of the icon to use. The name should be of the form: `iconset_name:icon_name`.
      .define('icon', 'string')
      .onLink(() => this.updateIconCounter++)
      .on(this._updateIcon.bind(this))

      // If using iron-icon without an iconset, you can set the src to be
      // the URL of an individual icon image file. Note that this will take
      // precedence over a given icon attribute.
      .define('src', 'string')
      .onLink(() => this.updateIconCounter++)
      .on(this._updateIcon.bind(this));

    this.icon = attributeManager.get('icon');
    this.src = attributeManager.get('src');
  }

  /**
   * Attributes managed by the component
   * @override
   * @type {Array<String>}
   */
  static get observedAttributes() {
    return super.observedAttributes.concat(['icon', 'src']);
  }

  /**
   * Add the icon to the shadow
   */
  _updateIcon() {
    if (--this.updateIconCounter > 0) return;

    const icon = this.icon.value || '';
    const src = this.src.value || '';
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
