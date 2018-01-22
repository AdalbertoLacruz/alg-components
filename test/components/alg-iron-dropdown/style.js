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

  [slot="dropdown-content"] {
    background-color: white;
    line-height: 20px;
    border-radius: 3px;
    box-shadow: 0px 2px 6px #ccc;
  }

  .random-content {
    padding: 1.5em 2em;
    max-width: 250px;
  }

  button {
    border: 1px solid #ccc;
    background-color: #eee;
    padding: 1em;
    border-radius: 3px;
    cursor: pointer;
  }

  button:focus {
    outline: none;
    border-color: blue;
  }

  alg-iron-image {
    padding: 1em;
    background-color: #fff;
    box-shadow: 0px 2px 6px #ccc;
    border-radius: 3px;
  }
`);
