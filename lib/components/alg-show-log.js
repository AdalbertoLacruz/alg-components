// @copyright 2017-2018 adalberto.lacruz@gmail.com

import { AlgDataComponent } from './alg-data-component.js';
// eslint-disable-next-line
import { RulesInstance } from '../styles/rules.js';

class AlgShowLog extends AlgDataComponent {
  /**
   * For Aria
   * @override @return {String}
   */
  get role() { return 'note'; }

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
          width: 700px;
          font-size: 16px;
        }
        span {
          float: left;
          padding: 0 10px;
        }
        div {
          clear: both;
          width: 100%;
          margin: 0;
        }
        .header {
          text-decoration: underline black;
          color: darkblue;
          background-color: yellow;
        }
        #time {
          width: 120px;
        }
        #id {
          width: 50px;
        }
        #message {
          width: 300px;
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
      <div class="header"><span id="time">Time</span><span id="id">Id</span>
      <span id="message">Message</span></div>
    `;

    return template;
  }

  /**
   * Create Template for Row.
   * @overrun
   * @return {HTMLTemplateElement}
   */
  createRowTemplate() {
    const row = document.createElement('template');
    row.innerHTML = `
    <div><span id="time"></span><span id="id"></span><span id="message"></span></div>
    `;
    return row;
  }
}

window.customElements.define('alg-show-log', AlgShowLog);

export { AlgShowLog };
