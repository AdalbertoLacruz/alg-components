// @copyright 2017-2018 adalberto.lacruz@gmail.com

import { AlgComponent } from '../src/base/alg-component.js';
import { AttributeManager } from '../src/base/attribute-manager.js';
// eslint-disable-next-line
import { RulesInstance } from '../styles/rules.js';
import { TYPE_NUM, TYPE_STRING } from '../src/util/constants.js';

/**
 * Definition for alg-button component
 * button with id, defines by default 'on-click' = 'controller:ID_CLICK'
 *
 * @type {class}
 */
class AlgButton extends AlgComponent {
  deferredConstructor() {
    super.deferredConstructor();

    this.attributeManager
      .define('classbind', TYPE_STRING, { isPreBinded: true })
      .on((value) => {
        AttributeManager.classUpdate(this, value);
      })

      .define('color', TYPE_STRING)
      .on((color) => {
        this.ids['in'].style.color = color;
      })

      .define('text', TYPE_NUM, { isPreBinded: true })
      .on((value) => {
        this.ids['in'].innerHTML = value.toString();
      });

    this.messageManager
      .define('click', { toEvent: true, isPreBinded: true });
  }

  /**
   * Build the static template for style
   * @override
   * @param {RulesInstance} css
   * @return {HTMLTemplateElement} The template Element with style
   */
  createTemplateStyle(css) {
    let template = super.createTemplateStyle(css);
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

    return template;
  }

  /**
   * Attributes managed by the component
   * @override
   * @type {Array<String>}
   */
  static get observedAttributes() {
    return super.observedAttributes.concat(['classbind', 'color', 'text', 'on-click']);
  }

  /**
   * For Aria
   * @type {String}
   */
  get role() { return 'button'; }
}

window.customElements.define('alg-button', AlgButton);

export { AlgButton };
