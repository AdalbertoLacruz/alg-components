// @copyright @polymer
// @copyright 2017-2018 adalberto.lacruz@gmail.com

import * as css from '../../../lib/styles/css-style.js';

css.style('style', `
  body {
    transition: opacity 0.4s linear;
  }

  .vertical-section-container {
    max-width: 500px;
  }

  alg-paper-button {
    margin-left: 10px;
    margin-right: 10px;
  }

  alg-paper-button.custom {
    --paper-button-ink-color: var(--paper-pink-a200);
    /* These could also be individually defined for each of the
      specific css classes, but we'll just do it once as an example */
    --paper-button-flat-keyboard-focus: {
      background-color: var(--paper-pink-a200);
      color: white !important;
    };
    --paper-button-raised-keyboard-focus: {
      background-color: var(--paper-pink-a200) !important;
      color: white !important;
    };
  }

  alg-paper-button.custom:hover {
    background-color: var(--paper-indigo-100);
  }

  alg-paper-button.pink {
    color: var(--paper-pink-a200);
  }

  alg-paper-button.indigo {
    background-color: var(--paper-indigo-500);
    color: white;
    --paper-button-raised-keyboard-focus: {
      background-color: var(--paper-pink-a200) !important;
      color: white !important;
    };
  }

  alg-paper-button.green {
    background-color: var(--paper-green-500);
    color: white;
  }

  alg-paper-button.green[active] {
    background-color: var(--paper-red-500);
  }

  alg-paper-button.disabled {
    color: white;
  }

  a alg-paper-button,
  a:active alg-paper-button,
  a:visited alg-paper-button {
    color: #000;
  }
`);
