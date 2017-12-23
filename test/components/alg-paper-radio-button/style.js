// @copyright @polymer
// @copyright 2017 ALG

import * as css from '../../../src/alg-components/util/css-style.js';

css.style('style', `
  .vertical-section-container {
    max-width: 630px;
  }

  alg-paper-radio-button {
    margin-right: 24px;
  }

  alg-paper-radio-button.red {
    --paper-radio-button-checked-color: var(--paper-red-500);
    --paper-radio-button-checked-ink-color: var(--paper-red-500);
    --paper-radio-button-unchecked-color: var(--paper-red-900);
    --paper-radio-button-unchecked-ink-color: var(--paper-red-900);
    --paper-radio-button-label-color: var(--paper-red-500);
  }

  alg-paper-radio-button.green {
    --paper-radio-button-checked-color: var(--paper-green-500);
    --paper-radio-button-checked-ink-color: var(--paper-green-500);
    --paper-radio-button-unchecked-color: var(--paper-green-900);
    --paper-radio-button-unchecked-ink-color: var(--paper-green-900);
    --paper-radio-button-label-color: var(--paper-green-500);
  }
`);
