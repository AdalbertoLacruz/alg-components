// @copyright @polymer\paper-styles\element-styles\paper-material-styles.js
// @copyright 2017 ALG

import * as css from '../util/css-style.js';
import './shadow.js';

css.setRule('--paper-material', `
  display: block;
  position: relative;`);

css.setRule('--paper-material-elevation-1', `
  ${css.getRule('--shadow-elevation-2dp')}`);

css.setRule('--paper-material-elevation-2', `
  ${css.getRule('--shadow-elevation-4dp')}`);

css.setRule('--paper-material-elevation-3', `
  ${css.getRule('--shadow-elevation-6dp')}`);

css.setRule('--paper-material-elevation-4', `
  ${css.getRule('--shadow-elevation-8dp')}`);

css.setRule('--paper-material-elevation-5', `
  ${css.getRule('--shadow-elevation-16dp')}`);

css.setRule('paper-material-styles', `
  :host(.paper-material), .paper-material {
    ${css.getRule('--paper-material')}
  }
  :host(.paper-material[elevation="1"]), .paper-material[elevation="1"] {
    ${css.getRule('--paper-material-elevation-1')}
  }
  :host(.paper-material[elevation="2"]), .paper-material[elevation="2"] {
    ${css.getRule('--paper-material-elevation-2')}
  }
  :host(.paper-material[elevation="3"]), .paper-material[elevation="3"] {
    ${css.getRule('--paper-material-elevation-3')}
  }
  :host(.paper-material[elevation="4"]), .paper-material[elevation="4"] {
    ${css.getRule('--paper-material-elevation-4')}
  }
  :host(.paper-material[elevation="5"]), .paper-material[elevation="5"] {
    ${css.getRule('--paper-material-elevation-5')}
  }`);
