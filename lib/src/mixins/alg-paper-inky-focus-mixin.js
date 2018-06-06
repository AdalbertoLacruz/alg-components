// @copyright @polymer\paper-behaviors\paper-inky-focus-behavior.js
// @copyright 2017-2018 adalberto.lacruz@gmail.com

import { TYPE_BOOL, TYPE_STRING } from '../util/constants.js';

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
  /** @override */
  deferredConstructor() {
    super.deferredConstructor();

    this.attributeManager
      // ripple child attribute
      .define('ink-center', TYPE_BOOL, { value: true })
      // ripple clild class
      .define('ink-classbind', TYPE_STRING, { value: 'circle '});

    this.eventManager
      // Ripple effect on keyboard focus
      .onLink('receivedFocusFromKeyboard', (value, context) => {
        if (value) this.ensureRipple();

        if (this.hasRipple()) {
          if (!context.isLastEventPointer) { // key
            const inkHoldDown$ = this._ripple.holdDown$;
            inkHoldDown$.context.event = context.event;
            inkHoldDown$.update(value);
          }
        }
      });
  }
};
