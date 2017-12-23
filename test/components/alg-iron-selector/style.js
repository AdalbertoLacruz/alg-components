// @copyright @polymer
// @copyright 2017 ALG

import * as css from '../../../src/alg-components/util/css-style.js';

css.style('style', `
  .vertical-section-container {
    max-width: 630px;
  }

  alg-iron-selector > * {
    padding: 8px;
  }

  .iron-selected {
    background-color: var(--google-blue-500);
    color: white;
  }

  alg-paper-radio-button {
    margin-right: 24px;
  }

  alg-paper-radio-button.iron-selected {
    --paper-radio-button-checked-color: white;
    --paper-radio-button-checked-ink-color: white;
    --paper-radio-button-label-color: white;
  }

  alg-paper-toggle-button.iron-selected {
    --paper-toggle-button-checked-bar-color:  white;
    --paper-toggle-button-checked-button-color:  white;
    --paper-toggle-button-checked-ink-color: white;
    --paper-toggle-button-label-color: white;
  }
`);
