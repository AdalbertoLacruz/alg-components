// @copyright 2017-2018 adalberto.lacruz@gmail.com

import { AlgComponent } from '../src/base/alg-component.js';
// eslint-disable-next-line
import { RulesInstance } from '../styles/rules.js';

// import { mixinFactory } from '../../../lib/src/util/mixins.js';

/**
 * @extends { AlgComponent}
 * @class
 */
// class TemplateComponent extends mixinFactory(AlgPaperComponent, mixin) {
class TemplateComponent extends AlgComponent {
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
      <slot></slot>
    `;

    return template;
  }

  // /** @override */
  // deferredConstructor() {
  //   super.deferredConstructor();

  //   this.eventManager;
  //   this.attributeManager;
  //   this.messageManager;
  // }

  // /**
  //  * Attributes managed by the component
  //  * @override
  //  * @return {Array<String>}
  //  */
  // static get observedAttributes() {
  //   return super.observedAttributes.concat(['']);
  // }

  // /** For Aria @override @type {String} */
  // get role() { return 'button'; }

  // /**
  //  * check for animated and add them if not defined
  //  */
  // addStandardAttributes() {
  //   super.addStandardAttributes();
  //   if (!this.hasAttribute('animated')) this.setAttribute('animated', '');
  // }
}

// window.customElements.define('', TemplateComponent);

export { TemplateComponent };
