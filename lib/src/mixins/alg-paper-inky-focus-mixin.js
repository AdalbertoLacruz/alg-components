// @copyright @polymer\paper-behaviors\paper-inky-focus-behavior.js
// @copyright 2017-2018 adalberto.lacruz@gmail.com

// REQUIRES: ****************
//  alg-paper-ripple-behavior
//  alg-iron-button-state
//  iron-control-state

/**
 * Mixin Behavior
 *
 * receivedFocusFromKeyboard -> ripple behavior
 *
 * @param {*} base
 */
export const AlgPaperInkyFocusMixin = (base) => class extends base {
  constructor() {
    // @ts-ignore
    super();
    this.eventManager
      .on('receivedFocusFromKeyboard', (value, context) => {
        if (value) this.ensureRipple();

        if (this.hasRipple() &&
          (!this._ripple.noink ||
            !context.isLastEventPointer || // no mouse
            (context.isLastEventPointer && !value))) { // to remove ripple
          setTimeout(() => {
            const holdDown = this._ripple.holdDown;
            holdDown.context.event = event;
            holdDown.update(value);
          }, 1);
        }
      });
  }

  _createRipple() {
    const ripple = super._createRipple();
    ripple.id = 'ink';
    ripple.setAttribute('center', '');
    ripple.classList.add('circle');

    return ripple;
  }
};
