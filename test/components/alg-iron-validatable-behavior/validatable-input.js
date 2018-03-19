// @copyright @polymer\iron-validatable-behavior\demo\validatable-input.js
// @copyright 2017-2018 adalberto.lacruz@gmail.com

import { AlgComponent } from '../../../lib/src/base/alg-component.js';
import { AlgIronValidatableMixin } from '../../../lib/src/mixins/alg-iron-validatable-mixin.js';
import { EventManager } from '../../../lib/src/base/event-manager.js';
import { mixinFactory } from '../../../lib/src/util/mixins.js';
// eslint-disable-next-line
import { RulesInstance } from '../../../lib/styles/rules.js';

/**
 * @extends { AlgComponent}
 * @class
 */
class ValidatableInput extends mixinFactory(AlgComponent, AlgIronValidatableMixin) {
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
          display: inline-block;
        }
        input {
          padding: 0.4em;
          font-size: 16px;
          margin: 5px;
          color: inherit;
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
      <input id="input">
    `;

    return template;
  }

  /** @override */
  deferredConstructor() {
    super.deferredConstructor();

    new EventManager(this.ids['input'])
      .on('input', () => {
        // @ts-ignore
        this.validate(this.ids['input'].value);
      })
      .subscribe();
  }
}

window.customElements.define('validatable-input', ValidatableInput);

export { ValidatableInput };
