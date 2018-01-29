// @copyright @polymer
// @copyright 2017-2018 adalberto.lacruz@gmail.com

import {Rules} from '../../../lib/styles/rules.js';

Rules.sheet('style', `
  body {
    transition: opacity 0.4s linear;
  }

  .centered {
    max-width: 550px;
  }

  alg-paper-fab {
    margin-left: 10px;
    margin-right: 10px;
  }

  alg-paper-fab.label {
    font-size: 20px;
  }

  alg-paper-fab[mini].label {
    font-size: 14px;
  }

  alg-paper-fab.blue {
    --paper-fab-background: var(--paper-light-blue-500);
    --paper-fab-keyboard-focus-background: var(--paper-light-blue-900);
  }
  alg-paper-fab.orange {
    --paper-fab-background: var(--paper-orange-500);
    --paper-fab-keyboard-focus-background: var(--paper-orange-900);
  }
`);
