// @copyright @polymer\paper-behaviors\paper-checked-element-behavior.js
// @copyright 2017 ALG
// @ts-check

import { AlgIronButtonState } from '../mixins/alg-iron-button-state.js';
import { AlgIronCheckedElementBehavior } from '../mixins/alg-iron-checked-element-behavior.js';
import { AlgPaperComponent } from './alg-paper-component.js';
import { AlgPaperInkyFocusBehavior } from '../mixins/alg-paper-inky-focus-behavior.js';
import { AlgPaperRippleBehavior } from '../mixins/alg-paper-ripple-behavior.js';
import { EventManager } from '../types/event-manager.js'; // eslint-disable-line
import { mixinFactory } from '../util/mixins.js';

/**
 * active -> [checked] -> 💢ripple (⛳checked)
 *
 * @extends {AlgPaperComponent}
 * @class
 */
class AlgPaperCheckedElementBehavior extends
  mixinFactory(AlgPaperComponent, AlgIronButtonState, AlgPaperRippleBehavior,
    AlgPaperInkyFocusBehavior, AlgIronCheckedElementBehavior) {
  //
  constructor() {
    super();

    this.eventManager
      .onChangeReflectToEvent('active', 'checked')
      .on('checked', (value) => {
        // @ts-ignore
        if (this.hasRipple()) this._ripple.attributeToggle('checked', value);
      });
  }

  /** For Aria @override @return {String} */
  get role() { return 'button'; }
}

export { AlgPaperCheckedElementBehavior };
