// @copyright @polymer
// @copyright 2017-2018 adalberto.lacruz@gmail.com

import {Rules} from '../../../lib/styles/rules.js';

Rules.sheet('style', `
  body {
    transition: opacity 0.4s linear;
  }

  .vertical-section-container {
    max-width: 500px;
  }

  alg-paper-toggle-button {
    margin-left: 10px;
    margin-right: 10px;
  }

  alg-paper-toggle-button.green {
    --paper-toggle-button-checked-bar-color:  var(--paper-green-500);
    --paper-toggle-button-checked-button-color:  var(--paper-green-500);
    --paper-toggle-button-checked-ink-color: var(--paper-green-500);
    --paper-toggle-button-unchecked-bar-color:  var(--paper-teal-500);
    --paper-toggle-button-unchecked-button-color:  var(--paper-teal-500);
    --paper-toggle-button-unchecked-ink-color: var(--paper-teal-500);
  }

  alg-paper-toggle-button.pink {
    --paper-toggle-button-checked-bar-color:  var(--paper-pink-500);
    --paper-toggle-button-checked-button-color:  var(--paper-pink-500);
    --paper-toggle-button-checked-ink-color: var(--paper-pink-500);
    --paper-toggle-button-unchecked-bar-color:  var(--paper-indigo-900);
    --paper-toggle-button-unchecked-button-color:  var(--paper-indigo-900);
    --paper-toggle-button-unchecked-ink-color: var(--paper-indigo-900);
  }
`);
