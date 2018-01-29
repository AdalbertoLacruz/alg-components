// @copyright @polymer\iron-checked-element-behavior\demo\simple-checkbox.js
// @copyright 2017-2018 adalberto.lacruz@gmail.com

import { AlgIronCheckedElementMixin } from '../../../lib/src/mixins/alg-iron-checked-element-mixin.js';
import { AlgIronValidatableMixin } from '../../../lib/src/mixins/alg-iron-validatable-mixin.js';
import { AlgPaperButton } from '../../../lib/components/alg-paper-button.js';
import { AlgPaperComponent } from '../../../lib/src/base/alg-paper-component.js';
import { EventManager } from '../../../lib/src/types/event-manager.js';
import { mixinFactory } from '../../../lib/src/util/mixins.js';
// eslint-disable-next-line
import { RulesInstance } from '../../../lib/styles/rules.js';

/**
 * @extends {AlgPaperComponent}
 * @class
 */
class SimpleCheckbox extends mixinFactory(AlgPaperComponent,
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
      .defineDefault('label', 'not validated')
      .define('label', 'string')
      .on((value) => {
        this.ids['labelText'].innerHTML = value;
      })
      .read({alwaysUpdate: true});

    this.ids['button'].eventManager
      .on('click', () => {
        // @ts-ignore
        this.validate();
        label.update(invalid.value ? 'is invalid' : 'is valid');
      })
      .subscribe();

    new EventManager(this.ids['checkbox'])
      .on('tap', () => {
        checked.update(this.ids['checkbox'].checked);
      })
      .subscribe();

    const checked = this.attributeManager.get('checked');
    const invalid = this.attributeManager.get('invalid');
    const label = this.attributeManager.get('label');
  }
}

window.customElements.define('simple-checkbox', SimpleCheckbox);

export { SimpleCheckbox };
