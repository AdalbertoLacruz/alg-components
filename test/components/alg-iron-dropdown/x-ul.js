// @copyright @polymer
// @copyright 2017-2018 adalberto.lacruz@gmail.com

import { AlgPaperComponent } from '../../../lib/src/base/alg-paper-component.js';
// eslint-disable-next-line
import { RulesInstance } from '../../../lib/styles/rules.js';

/**
 *
 * @class
 */
class XUl extends AlgPaperComponent {
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
        ul {
          background-color: white;
          border: 1px solid #eee;
        }
        ul, li {
          display: block;
          position: relative;
          margin: 0;
          padding: 0;
        }
        a {
          display: block;
          position: relative;
          padding: 1em;
          text-decoration: none;
        }
        li:not(:last-of-type) {
          border-bottom: 1px solid #eee;
        }
        a:hover {
          text-decoration: underline;
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
      <ul>
        ${this.defineLi()}
      </ul>
    `;

    return template;
  }

  get data() {
    return [
      'allosaurus',
      'brontosaurus',
      'carcharodontosaurus',
      'diplodocus',
      'ekrixinatosaurus',
      'fukuiraptor',
      'gallimimus',
      'hadrosaurus',
      'iguanodon',
      'jainosaurus',
      'kritosaurus',
      'liaoceratops',
      'megalosaurus',
      'nemegtosaurus',
      'ornithomimus',
      'protoceratops',
      'quetecsaurus',
      'rajasaurus',
      'stegosaurus',
      'triceratops',
      'utahraptor',
      'vulcanodon',
      'wannanosaurus',
      'xenoceratops',
      'yandusaurus',
      'zephyrosaurus'
    ];
  }

  /**
   * Create li list
   */
  defineLi() {
    return this.data.reduce((result, value) => {
      result += `
        <li>
          <a href="javascript:void(0)">${value}</a>
        </li>
      `;
      return result;
    }, '');
  }
}

window.customElements.define('x-ul', XUl);

export { XUl };
