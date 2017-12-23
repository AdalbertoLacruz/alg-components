// @copyright @polymer\paper-radio-group\paper-radio-group.js
// @copyright 2017 ALG

import { AlgIronSelectableBehavior } from '../iron/alg-iron-selectable-behavior.js';

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
   * @return {HTMLTemplateElement} The template Element with style
   */
  createTemplateStyle() {
    let template = super.createTemplateStyle();
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
    this.selfClass.templateIds = this.searchTemplateIds(template.innerHTML);

    return template;
  }

  constructor() {
    super();
    this.bindedAttrForSelected('attr-for-selected', 'name');
    this.bindedSelectedAttribute('selected-attribute', 'checked');
    this.bindedSelectable('selectable', 'alg-paper-radio-button');
    this.bindedActivateEvent('activate-event', 'left, right, up, down');
  }

  /** For Aria @override @type {String} */
  get role() { return 'radiogroup'; }
}

window.customElements.define('alg-paper-radio-group', AlgPaperRadioGroup);

export { AlgPaperRadioGroup };
