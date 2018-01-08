// @copyright @polymer\paper-behaviors\paper-button-behavior.js
// @copyright 2017 ALG

import { AlgActionBehavior } from '../mixins/alg-action-behavior.js';
import { AlgIronButtonState } from '../mixins/alg-iron-button-state.js';
import { AlgPaperComponent } from './alg-paper-component.js';
import { AlgPaperRippleBehavior } from '../mixins/alg-paper-ripple-behavior.js';
import { mixinFactory } from '../util/mixins.js';
import { ObservableEvent } from '../types/observable-event.js';

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
  mixinFactory(AlgPaperComponent, AlgIronButtonState, AlgPaperRippleBehavior, AlgActionBehavior) {
  //
  constructor() {
    // @ts-ignore
    super();

    const eventManager = this.eventManager;
    eventManager
      .on('active', this._calculateElevation.bind(this))
      .on('disabled', this._calculateElevation.bind(this))
      .on('focused', this._calculateElevation.bind(this))
      .on('pressed', this._calculateElevation.bind(this))
      .on('receivedFocusFromKeyboard', this._calculateElevation.bind(this))
      .onChangeReflectToClass('receivedFocusFromKeyboard', this, 'keyboard-focus')
      .subscribe();
  }

  /**
   * Attributes managed by the component
   * @override
   * @type {Array<String>}
   */
  static get observedAttributes() {
    return super.observedAttributes.concat(['on-click']);
  }

  /** @type {ObservableEvent} */
  get active() { return this.eventManager.getObservable('active'); }

  /** @type {ObservableEvent} */
  get disabled() { return this.eventManager.getObservable('disabled'); }

  /** @type {ObservableEvent} */
  get elevation() {
    return this._elevation || (this._elevation = new ObservableEvent('elevation').setType('number').setValue(0)
      .onChangeReflectToAttribute(this));
  }

  /**
   * If true, the user is currently holding down the button.
   * @type {ObservableEvent}
   */
  get pressed() { return this.eventManager.getObservable('pressed'); }

  /**
   * True if the input device that caused the element to receive focus was a keyboard.
   * @type {ObservableEvent}
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
