// @copyright @polymer\iron-icons\demo\index.html
// @copyright 2017 ALG
// @ts-check
/* global cssRules */

import { AlgIronIconset } from '../../../src/alg-components/iron/alg-iron-iconset.js';
import { AlgPaperComponent } from '../../../src/alg-components/paper/alg-paper-component.js';

class AppDemo extends AlgPaperComponent {
  createTemplateStyle() {
    let template = super.createTemplateStyle();
    template.innerHTML = `
      <style>
        h2 {
          text-transform: capitalize;
        }

        alg-iron-icon {
          transition: all 0.2s;
          -webkit-transition: all 0.2s;
        }

        alg-iron-icon:hover {
          fill: var(--google-yellow-700);
        }

        .set {
          display: block;
          text-align: center;
          margin: auto;
          padding: 1em 0;
          border-bottom: 1px solid silver;
        }

        .set:last-of-type {
          border-bottom: none;
        }

        .set:nth-of-type(4n-3) {
          color: var(--paper-grey-700);
        }

        .set:nth-of-type(4n-2) {
          color: var(--paper-pink-500);
        }

        .set:nth-of-type(4n-1) {
          color: var(--google-green-500);
        }

        .set:nth-of-type(4n) {
          color: var(--google-blue-500);
        }

        .container {
          display: inline-block;
          width: 10em;
          margin: 1em 0.5em;
          text-align: center;
        }

        .container > div {
          margin-top: 0.5em;
          color: black;
          font-size: 10px;
        }
      </style>
    `;
    return template;
  }

  createTemplate() {
    let template = super.createTemplate();

    template.innerHTML = AlgIronIconset.listIconsets().map((iconsetName) => `
      <h2>${iconsetName}</h2>
      <div class="set">
      ${AlgIronIconset.listIconset(iconsetName).map((iconName) => `
        <span class="container">
          <alg-iron-icon icon="${iconsetName}:${iconName}"></alg-iron-icon>
          <div>${iconName}</div>
        </span>
      `).join('')}
      </div>
    `).join('');

    return template;
  }

  addStandardAttributes() { }
}

window.customElements.define('app-demo', AppDemo);

export { AppDemo };
