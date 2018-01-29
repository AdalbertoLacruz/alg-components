// @copyright @polymer\paper-radio-group\paper-radio-group.js
// @copyright 2017-2018 adalberto.lacruz@gmail.com

import { AlgIronSelectableBehavior } from '../src/behaviors/alg-iron-selectable-behavior.js';
// eslint-disable-next-line
import { RulesInstance } from '../styles/rules.js';

/**
 * alg-paper-radio-group allows user to select at most one radio button from a set.
 * Checking one radio button that belongs to a radio group unchecks any previously
 * checked radio button within the same group.
 * Use selected to get or set the selected radio button.
 *
 * The inside the group must have the name attribute set.
 *
 *
 * property vars:
 *  --paper-radio-group-item-padding
 *
 * @class
 */
class AlgPaperRadioGroup extends AlgIronSelectableBehavior {
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

        :host ::slotted(*) {
          padding: var(--paper-radio-group-item-padding, 12px);
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
      <slot></slot>
    `;

    return template;
  }

  /** @override */
  deferredConstructor() {
    // Must be before super
    this.attributeManager
      .defineDefault('attr-for-selected', 'name')
      .defineDefault('selected-attribute', 'checked')
      .defineDefault('activate-event', 'left, right, up, down')
      .defineDefault('selectable', 'alg-paper-radio-button');

    super.deferredConstructor();
  }

  /** For Aria @override @type {String} */
  get role() { return 'radiogroup'; }
}

window.customElements.define('alg-paper-radio-group', AlgPaperRadioGroup);

export { AlgPaperRadioGroup };
