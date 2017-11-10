// @copyright @polymer\paper-behaviors\paper-button-behavior.js
// @copyright 2017 ALG
// @ts-check

import { AlgIronButtonState } from '../mixins/alg-iron-button-state.js';
import { AlgPaperComponent } from './alg-paper-component.js';
import { AlgPaperRippleBehavior } from '../mixins/alg-paper-ripple-behavior.js';
import { mixinFactory } from '../util/mixins.js';
import { ObsBoolean } from '../types/obs-boolean.js'; // eslint-disable-line
import { ObsNumber } from '../types/obs-number.js';

/**
 * Definition for alg-paper-button-behavior
 *
 * Event handlers
 *  on-click
 *  on-change (toggles)
 *  on-action (pressed = click or space)
 *
 * @type {class}
 */
class AlgPaperButtonBehavior extends
  mixinFactory(AlgPaperComponent, AlgIronButtonState, AlgPaperRippleBehavior) {
  //
  constructor() {
    // @ts-ignore
    super();

    this.fireHandlers.add('action'); // fire with pressed true

    const eventManager = this.eventManager;
    eventManager
      .onCustom('active', this._calculateElevation.bind(this))
      .onCustom('disabled', this._calculateElevation.bind(this))
      .onCustom('focused', this._calculateElevation.bind(this))
      .onCustom('pressed', this._calculateElevation.bind(this))
      .onChangeFireMessage('pressed', this, 'action', null, true)
      .onCustom('receivedFocusFromKeyboard', this._calculateElevation.bind(this))
      .onChangeReflectToClass('receivedFocusFromKeyboard', this, 'keyboard-focus', true)
      .subscribe();
  }

  /**
   * Attributes managed by the component
   * @override
   * @type {Array<String>}
   */
  static get observedAttributes() {
    return super.observedAttributes.concat(['on-click', 'on-action']);
  }

  /** @type {ObsBoolean} */
  get active() { return this.eventManager.getObservable('active'); }

  /** @type {ObsBoolean} */
  get disabled() { return this.eventManager.getObservable('disabled'); }

  /** @type {ObsNumber} */
  get elevation() {
    return this._elevation || (this._elevation = new ObsNumber('elevation', 0)
      .onChangeReflectToAttribute(this));
  }

  /**
   * If true, the user is currently holding down the button.
   * @type {ObsBoolean}
   */
  get pressed() { return this.eventManager.getObservable('pressed'); }

  /**
   * True if the input device that caused the element to receive focus was a keyboard.
   * @type {ObsBoolean}
   */
  get receivedFocusFromKeyboard() { return this.eventManager.getObservable('receivedFocusFromKeyboard'); }

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

    if (this.disabled.value) {
      elevation = 0;
    } else if (this.active.value || this.pressed.value) {
      elevation = 4;
    } else if (this.receivedFocusFromKeyboard.value) {
      elevation = 3;
    }

    this.elevation.update(elevation);
  }
}

export { AlgPaperButtonBehavior };
