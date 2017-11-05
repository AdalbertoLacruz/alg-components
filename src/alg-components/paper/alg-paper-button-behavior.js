// @copyright @polymer\paper-behaviors\paper-button-behavior.js
// @copyright 2017 ALG
// @ts-check

import { AlgIronButtonState } from '../iron/alg-iron-button-state.js';
import { AlgPaperComponent } from './alg-paper-component.js';
import { AlgPaperRippleBehavior } from './alg-paper-ripple-behavior.js';
import { ObsBoolean } from '../types/obs-boolean.js'; // eslint-disable-line
import { ObsNumber } from '../types/obs-number.js';

/**
 * Definition for alg-paper-button-behavior
 *
 * Event handlers
 *  on-click
 *  on-change (toggles)
 *
 * @type {class}
 */
class AlgPaperButtonBehavior extends AlgPaperComponent {
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
    return super.observedAttributes.concat(['noink', 'toggles', 'on-change', 'on-click']);
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
   * True if the input device that caused the element to receive focus was a keyboard.
   * @return {ObsBoolean}
   */
  get receivedFocusFromKeyboard() {
    return this._receivedFocusFromKeyboard || (this._receivedFocusFromKeyboard =
      /** @type {ObsBoolean} */ (this.eventManager.getObservable('receivedFocusFromKeyboard')));
  }

  /** For Aria @override @return {String} */
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
