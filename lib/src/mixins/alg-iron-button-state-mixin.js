// @copyright @polymer\iron-behaviors\iron-button-state.js
// @copyright 2017-2018 adalberto.lacruz@gmail.com

import * as FHtml from '../util/f-html.js';
import { TYPE_BOOL } from '../util/constants.js';

/**
 * Mixin behavior
 * Manages active state if present toggles attribute
 * Attribute: toggles
 * Fire: change
 *
 * active ⛳(active, aria-pressed) 🔥change
 * tap, enter, space ⛳pressed -> toggles ⛳
 *
 * @param {*} base
 */
export const AlgIronButtonStateMixin = (base) => class extends base {
  /** @override */
  deferredConstructor() {
    super.deferredConstructor();

    this.attributeManager
      .define('active', TYPE_BOOL) // updated by tap
      .reflect()
      .on(this._activeChanged.bind(this))
      .store((entry$) => { this.active$ = entry$; })

      .define('toggles', TYPE_BOOL, { isLocal: true })
      .reflect()
      .on(this._activeChanged.bind(this))
      .store((entry$) => { this.toggles$ = entry$; });

    this.eventManager
      .onChangeReflectToAttribute('pressed', { target: this })

      .on('tap', this._tapHandler.bind(this))

      .onKey('enter:keydown space:keyup', this._tapHandler.bind(this))

      .subscribe();

    this.messageManager
      .define('change', { toAttribute: 'active'}); // message: true/false
  }

  /**
   * Attributes managed by the component
   * @override
   * @type {Array<String>}
   */
  static get observedAttributes() {
    return super.observedAttributes.concat(['toggles', 'on-change']);
  }

  /**
   * aria-pressed attribute
   */
  _activeChanged() {
    if (this.toggles$.value) {
      FHtml.attributeToggle(this, 'aria-pressed', this.active$.value, { type: 'true-false'});
    } else {
      this.removeAttribute('aria-pressed');
    }
  }

  /**
   * Response to a click event or enter key
   */
  _tapHandler() {
    if (this.hasAttribute('frozen')) return; // Don't let changes

    if (this.toggles$.value) {
      this.active$.toggle();
    } else {
      this.active$.update(false);
    }
  }
};
