// @copyright @polymer\iron-dropdown\demo\x-select.js
// @copyright 2017-2018 adalberto.lacruz@gmail.com

import { AlgComponent } from '../../../lib/src/base/alg-component.js';
import * as FHtml from '../../../lib/src/util/f-html.js';
// eslint-disable-next-line
import { RulesInstance } from '../../../lib/styles/rules.js';

/**
 * @class
 */
class XSelect extends AlgComponent {
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
        :host {
          display: inline-block;
          margin: 1em;
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
      <div id="open">
        <slot name="dropdown-trigger"></slot>
      </div>
      <alg-iron-dropdown id="dropdown">
        <slot name="dropdown-content" slot="dropdown-content"></slot>
      </alg-iron-dropdown>
    `;

    // <alg-iron-dropdown id="dropdown"
    //   vertical-align="[[verticalAlign]]"
    //   horizontal-align="[[horizontalAlign]]"
    //   disabled="[[disabled]]"
    //   open-animation-config="[[openAnimationConfig]]"
    //   close-animation-config="[[closeAnimationConfig]]">
    // </alg-iron-dropdown>

    return template;
  }

  /** @override */
  deferredConstructor() {
    super.deferredConstructor();

    this.attributeManager
      .define('disabled', 'boolean')
      .on((value) => {
        FHtml.attributeToggle(this.ids['dropdown'], 'disabled', value, { type: '-remove' });
      })

      .define('horizontal-align', 'string')
      .on((value) => {
        this.ids['dropdown'].setAttribute('horizontal-align', value);
      })

      .define('scroll-action', 'string')
      .on((value) => {
        this.ids['dropdown'].setAttribute('scroll-action', value);
      })

      .define('vertical-align', 'string')
      .on((value) => {
        this.ids['dropdown'].setAttribute('vertical-align', value);
      });

    this.eventManager
      .on('tap', (e) => {
        this.ids['dropdown'].open();
      })
      .subscribe();
  }

  /**
   * Attributes managed by the component
   * @override
   * @return {Array<String>}
   */
  static get observedAttributes() {
    return super.observedAttributes.concat(['disabled', 'horizontal-align',
      'scroll-action', 'vertical-align']);
  }

  connectedCallback() {
    super.connectedCallback();

    this.ids['dropdown'].openAnimationConfig =
      [{
        name: 'fade-in-animation',
        timing: {
          delay: 150,
          duration: 50
        }
      }, {
        name: 'expand-animation',
        timing: {
          delay: 150,
          duration: 200
        }
      }];

    this.ids['dropdown'].closeAnimationConfig =
      [{
        name: 'fade-out-animation',
        timing: {
          duration: 200
        }
      }];
  }
}

window.customElements.define('x-select', XSelect);

export { XSelect };
