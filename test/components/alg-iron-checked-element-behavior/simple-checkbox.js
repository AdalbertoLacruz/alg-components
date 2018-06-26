// @copyright @polymer\iron-checked-element-behavior\demo\simple-checkbox.js
// @copyright 2017-2018 adalberto.lacruz@gmail.com

import { AlgComponent } from '../../../lib/src/base/alg-component.js';
import { AlgIronCheckedElementMixin } from '../../../lib/src/mixins/alg-iron-checked-element-mixin.js';
import { AlgIronValidatableMixin } from '../../../lib/src/mixins/alg-iron-validatable-mixin.js';
import { AlgPaperButton } from '../../../lib/components/alg-paper-button.js';
import { EventManager } from '../../../lib/src/base/event-manager.js';
import { mixinFactory } from '../../../lib/src/util/mixins.js';
// eslint-disable-next-line
import { RulesInstance } from '../../../lib/styles/rules.js';
import { TYPE_STRING } from '../../../lib/src/util/constants.js';

/**
 * @extends {AlgComponent}
 * @class
 */
class SimpleCheckbox extends mixinFactory(AlgComponent,
  AlgIronValidatableMixin, AlgIronCheckedElementMixin) {
  //
  /**
   * Build the static template for style - static. this.apply let custom styles.
   * @override
   * @param {RulesInstance} css
   * @return {HTMLTemplateElement} The template Element with style
   */
  createTemplateStyle(css) {
    let template = super.createTemplateStyle(css);
    template.innerHTML = `
      <style>
        :host {
          display: block;
        }

        :host([invalid]) span {
          color: red;
        }

        #labelText {
          display: inline-block;
          width: 100px;
        }
      </style>
    `;
    return template;
  }

  /**
   * Build for the class (static) templateElement, templateStyle and templateIds.
   * @override
   * @return {HTMLTemplateElement} The template Element to be cloned in the shadow creation
   */
  createTemplate() {
    let template = super.createTemplate();
    template.innerHTML = `
      <input type="checkbox" id="checkbox">
      <span id="labelText"></span>
      <alg-paper-button id="button" raised="">validate</alg-paper-button>
    `;

    return template;
  }

  /** @override */
  deferredConstructor() {
    super.deferredConstructor();

    this.attributeManager
      .define('label', TYPE_STRING, { value: 'not validated' })
      .on((value) => {
        this.ids['labelText'].innerHTML = value;
      })
      .autoDispatch()
      .store((entry$) => { this.label$ = entry$; });

    this.ids['button'].messageManager
      .on('action', () => {
        // @ts-ignore
        this.validate(null);
        // @ts-ignore
        this.label$.update(this.invalid$.value ? 'is invalid' : 'is valid');
      });

    new EventManager(this.ids['checkbox'])
      .on('tap', () => {
        // @ts-ignore
        this.checked$.update(this.ids['checkbox'].checked);
      })
      .subscribe();
  }
}

window.customElements.define('simple-checkbox', SimpleCheckbox);

export { SimpleCheckbox };
