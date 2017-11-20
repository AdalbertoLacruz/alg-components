// @copyright @polymer\paper-behaviors\paper-inky-focus-behavior.js
// @copyright 2017 ALG
// @ts-check

/**
 * Mixin Behavior
 *
 * receivedFocusFromKeyboard -> ripple behavior
 *
 * @param {*} base
 */
export const AlgPaperInkyFocusBehavior = (base) => class extends base {
  constructor() {
    // @ts-ignore
    super();
    this.eventManager
      .on('receivedFocusFromKeyboard', (value, event, context) => {
        if (value) this.ensureRipple();

        // if (this.hasRipple() && !this._ripple.noink) {
        //   this._ripple.holdDown.copy(event, value);
        // }

        if (this.hasRipple() &&
          (!this._ripple.noink ||
            !context.isLastEventPointer || // no mouse
            (context.isLastEventPointer && !value))) { // to remove ripple
          setTimeout(() => this._ripple.holdDown.copy(event, value), 1);
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
