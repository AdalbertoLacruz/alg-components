// @ts-check
import { AlgComponent } from './alg-component.js';
// import { AlgLog} from './alg-log.js';

/**
 * Definition for alg-button component
 * <p>
 * button with id, defines by default 'on-click' = 'controller:ID_CLICK'
 *
 * @type {class}
 */
class AlgButton extends AlgComponent {
  /**
   * Methods to update each attribute
   * @override
   * @return {Map<String, Function>}
   */
  get attributeHandlers() {
    return this._attributeHandlers || (this._attributeHandlers = super.attributeHandlers
      .set('color', this.setColor)
      .set('text', this.setText));
  }
  // TODO: avoid this

  /**
   * Attributes managed by the component
   * @override
   * @return {Array<String>}
   */
  static get observedAttributes() {
    return super.observedAttributes.concat(['color', 'text', 'on-click']);
  }

  /**
   * For Aria
   * @override
   * @return {String}
   */
  get role() {
    return 'button';
  }

  /**
   * Default events for the component
   * @override
   */
  addDefaultEventHandlers() {
    this.handlers.set('click', null);
  }

  /**
   * Build the static template for style
   * @override
   * @return {HTMLTemplateElement} The template Element with style
   */
  createTemplateStyle() {
    let template = super.createTemplateStyle();
    template.innerHTML = `
      <style>
        button {
          color: #cb6918;
          cursor: pointer;
        }
        #in {
          line-height: 2;
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
      <button id="but"><slot></slot><span id="in"></span></button>
    `;
    this.selfClass.templateIds = this.searchTemplateIds(template.innerHTML);

    return template;
  }

  /**
   * Set Style color attribute
   *
   * @param {String} attrName - Attribute Name
   * @param {String} value    - Color to set
   */
  setColor(attrName, value) {
    if (this.setAttributeSuper(attrName, value)) return;
    this.ids['in'].style.color = value;
  }
  // TODO: updateColor

  /**
   * Set Text attribute
   *
   * @param {String} attrName - Attribute Name
   * @param {String} value    - text to set
   */
  setText(attrName, value) {
    if (this.setAttributeSuper(attrName, value)) return;
    this.ids['in'].innerHTML = value;
  }
  // TODO: UpdateText
}

window.customElements.define('alg-button', AlgButton);

export { AlgButton };
