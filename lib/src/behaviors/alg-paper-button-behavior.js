// @copyright @polymer\paper-behaviors\paper-button-behavior.js
// @copyright 2017-2018 adalberto.lacruz@gmail.com

import { AlgActionMixin } from '../mixins/alg-action-mixin.js';
import { AlgComponent } from '../base/alg-component.js';
import { AlgIronButtonStateMixin } from '../mixins/alg-iron-button-state-mixin.js';
import { AlgPaperRippleMixin } from '../mixins/alg-paper-ripple-mixin.js';
import { mixinFactory } from '../util/mixins.js';

/**
 * Definition for alg-paper-button-behavior
 *
 * Event handlers
 *  on-click
 *  on-change (toggles)
 *  on-action (pressed = click or space)
 * @extends {AlgComponent}
 * @type {class}
 */
class AlgPaperButtonBehavior extends
  mixinFactory(AlgComponent, AlgIronButtonStateMixin, AlgPaperRippleMixin, AlgActionMixin) {
  /** @override */
  deferredConstructor() {
    super.deferredConstructor();

    const attributeManager = this.attributeManager;
    attributeManager
      .onChange('active', this._calculateElevation.bind(this))

      .onChange('disabled', this._calculateElevation.bind(this))

      .define('elevation', 'number')
      .defaultValue(0)
      .reflect();

    const eventManager = this.eventManager;
    eventManager
      .on('focused', this._calculateElevation.bind(this))

      // If true, the user is currently holding down the button.
      .on('pressed', this._calculateElevation.bind(this))

      // True if the input device that caused the element to receive focus was a keyboard.
      .on('receivedFocusFromKeyboard', this._calculateElevation.bind(this))
      .onChangeReflectToClass('receivedFocusFromKeyboard', { target: this, className: 'keyboard-focus'})
      .subscribe();

    this.active$ = attributeManager.get('active');
    this.elevation$ = attributeManager.get('elevation');
    this.disabled$ = attributeManager.get('disabled');
    this.pressed$ = eventManager.getObservable('pressed');
    this.receivedFocusFromKeyboard$ = this.eventManager.getObservable('receivedFocusFromKeyboard');
  }

  /**
   * Attributes managed by the component
   * @override
   * @type {Array<String>}
   */
  static get observedAttributes() {
    return super.observedAttributes.concat(['on-click']);
  }

  /** For Aria @override @type {String} */
  get role() { return 'button'; }

  /**
   * check for animated and add them if not defined
   */
  addStandardAttributes() {
    super.addStandardAttributes();
    if (!this.hasAttribute('animated')) this.setAttribute('animated', '');
  }

  /**
   * Calculate the item shadow
   * @override
   */
  _calculateElevation() {
    let elevation = 1;

    if (this.disabled$.value) {
      elevation = 0;
    } else if (this.active$.value || this.pressed$.value) {
      elevation = 4;
    } else if (this.receivedFocusFromKeyboard$.value) {
      elevation = 3;
    }

    this.elevation$.update(elevation);
  }
}

export { AlgPaperButtonBehavior };
