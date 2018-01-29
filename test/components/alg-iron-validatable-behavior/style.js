// @copyright @polymer
// @copyright 2017-2018 adalberto.lacruz@gmail.com

import {Rules} from '../../../lib/styles/rules.js';

Rules.sheet('style', `
  body {
    transition: opacity 0.4s linear;
  }

  validatable-input {
    border: 1px solid var(--google-green-500);
    color: var(--google-green-500);
  }

  validatable-input[invalid] {
    border: 1px solid var(--google-red-500);
    color: var(--google-red-500);
  }
`);
