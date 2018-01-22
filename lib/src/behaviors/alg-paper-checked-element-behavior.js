// @copyright @polymer\paper-behaviors\paper-checked-element-behavior.js
// @copyright 2017-2018 adalberto.lacruz@gmail.com

import { AlgIronButtonStateMixin } from '../mixins/alg-iron-button-state-mixin.js';
import { AlgIronCheckedElementMixin } from '../mixins/alg-iron-checked-element-mixin.js';
import { AlgPaperComponent } from '../base/alg-paper-component.js';
import { AlgPaperInkyFocusMixin } from '../mixins/alg-paper-inky-focus-mixin.js';
import { AlgPaperRippleMixin } from '../mixins/alg-paper-ripple-mixin.js';
import { mixinFactory } from '../util/mixins.js';
import * as FHtml from '../util/f-html.js';

/**
 * active -> [checked] -> 💢ripple (⛳checked)
 *
 * @extends {AlgPaperComponent}
 * @class
 */
class AlgPaperCheckedElementBehavior extends
  mixinFactory(AlgPaperComponent, AlgIronButtonStateMixin, AlgPaperRippleMixin,
    AlgPaperInkyFocusMixin, AlgIronCheckedElementMixin) {
  //
  constructor() {
    super();

    this.eventManager
      .onChangeReflectToEvent('active', 'checked')
      .on('checked', (value) => {
        // @ts-ignore
        if (this.hasRipple()) FHtml.attributeToggle(this._ripple, 'checked', value);
      });
  }

  /** For Aria @override @return {String} */
  get role() { return 'button'; }
}

export { AlgPaperCheckedElementBehavior };
