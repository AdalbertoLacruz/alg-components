// @copyright @polymer\iron-icon\iron-icon.js
// @copyright 2017-2018 adalberto.lacruz@gmail.com

import { AlgComponent } from '../base/alg-component.js';
import { AlgIronIconset } from '../base/alg-iron-iconset.js';
import { TYPE_STRING } from '../util/constants.js';

class AlgIronIconBehavior extends AlgComponent {
  /** @override */
  deferredConstructor() {
    super.deferredConstructor();

    const attributeManager = this.attributeManager;
    attributeManager
      // The name of the icon to use. The name should be of the form: `iconset_name:icon_name`.
      .define('icon', TYPE_STRING)
      .on(this._updateIcon.bind(this))
      .defaultValue(null)

      // If using iron-icon without an iconset, you can set the src to be
      // the URL of an individual icon image file. Note that this will take
      // precedence over a given icon attribute.
      .define('src', TYPE_STRING)
      .on(this._updateIcon.bind(this))
      .read({alwaysUpdate: true});

    this.icon$ = attributeManager.get('icon');
    this.src$ = attributeManager.get('src');
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
    const icon = this.icon$.value || '';
    const src = this.src$.value || '';

    if (!icon && !src) return;

    const usesIconset = icon || !src;

    this.restoreTemplate(); // remove previous icon

    const iconElement = usesIconset
      ? AlgIronIconset.getIconElement(icon)
      : AlgIronIconset.createImageElement(src);
    if (iconElement == null) return;

    this.shadowRoot.appendChild(iconElement);
  }
}

export { AlgIronIconBehavior };
