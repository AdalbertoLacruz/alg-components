// @copyright @polymer
// @copyright 2017 ALG

import * as css from '../../../src/alg-components/util/css-style.js';

css.style('style', `
  .vertical-section-container {
    max-width: 500px;
  }

  alg-paper-icon-button {
    margin-left: 10px;
    margin-right: 10px;
  }

  alg-paper-icon-button.pink {
    color: var(--paper-pink-500);
    --paper-icon-button-ink-color: var(--paper-indigo-500);
  }

  alg-paper-icon-button.pink:hover {
    background-color: var(--paper-pink-500);
    color: white;
  }

  alg-paper-icon-button.blue {
    --paper-icon-button-ink-color: var(--paper-orange-500);
    background-color: var(--paper-light-blue-500);
    color: white;
    border-radius: 3px;
    padding: 2px;
  }

  alg-paper-icon-button.giant {
    width: 100px;
    height: 100px;
  }

  a alg-paper-icon-button,
  a:active alg-paper-icon-button,
  a:visited alg-paper-icon-button {
    color: #000000;
  }
`);
