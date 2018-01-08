// @copyright @polymer
// @copyright 2017-2018 ALG

import { AlgPaperComponent } from '../paper/alg-paper-component.js';

// import { mixinFactory } from '../../../src/alg-components/util/mixins.js';

/**
 * @extends { AlgPaperComponent}
 * @class
 */
// class TemplateComponent extends mixinFactory(AlgPaperComponent, mixin) {
class TemplateComponent extends AlgPaperComponent {
  /**
   * Build the static template for style - static. this.apply let custom styles.
   * @override
   * @return {HTMLTemplateElement} The template Element with style
   */
  createTemplateStyle() {
    let template = super.createTemplateStyle();
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
    this.selfClass.templateIds = this.searchTemplateIds(template.innerHTML);

    return template;
  }

  // constructor() {
  //   super();

  //   this.eventManager;
  //   this.attributeManager;
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
