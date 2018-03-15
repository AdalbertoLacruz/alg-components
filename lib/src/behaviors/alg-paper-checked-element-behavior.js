// @copyright @polymer\paper-behaviors\paper-checked-element-behavior.js
// @copyright 2017-2018 adalberto.lacruz@gmail.com

import { AlgComponent } from '../base/alg-component.js';
import { AlgIronButtonStateMixin } from '../mixins/alg-iron-button-state-mixin.js';
import { AlgIronCheckedElementMixin } from '../mixins/alg-iron-checked-element-mixin.js';
import { AlgPaperInkyFocusMixin } from '../mixins/alg-paper-inky-focus-mixin.js';
import { AlgPaperRippleMixin } from '../mixins/alg-paper-ripple-mixin.js';
import * as FHtml from '../util/f-html.js';
import { mixinFactory } from '../util/mixins.js';

/**
 * active -> [checked] -> 💢ripple (⛳checked)
 *
 * @extends {AlgComponent}
 * @class
 */
class AlgPaperCheckedElementBehavior extends
  mixinFactory(AlgComponent, AlgIronButtonStateMixin, AlgPaperRippleMixin,
    AlgPaperInkyFocusMixin, AlgIronCheckedElementMixin) {
  /** @override */
  deferredConstructor() {
    super.deferredConstructor();

    this.attributeManager
      .toAttribute('active')
      .onChangeModify('checked')
      .on((value) => {
        // @ts-ignore
        if (this.hasRipple()) FHtml.attributeToggle(this._ripple, 'checked', value);
      });
  }

  /** For Aria @override @return {String} */
  get role() { return 'button'; }
}

export { AlgPaperCheckedElementBehavior };
