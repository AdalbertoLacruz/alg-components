// @copyright @polymer\paper-styles\element-styles\paper-material-styles.js
// @copyright 2017 ALG
import './shadow.js';

const cssRules = window.cssRules || (window.cssRules = new Map());

cssRules.set('--paper-material', `/* --paper-material */
  display: block;
  position: relative;`);

cssRules.set('--paper-material-elevation-1', `/* --paper-material-elevation-1 */
  ${cssRules.get('--shadow-elevation-2dp')}`);

cssRules.set('--paper-material-elevation-2', `/* --paper-material-elevation-2 */
  ${cssRules.get('--shadow-elevation-4dp')}`);

cssRules.set('--paper-material-elevation-3', `/* --paper-material-elevation-3 */
  ${cssRules.get('--shadow-elevation-6dp')}`);

cssRules.set('--paper-material-elevation-4', `/* --paper-material-elevation-4 */
  ${cssRules.get('--shadow-elevation-8dp')}`);

cssRules.set('--paper-material-elevation-5', `/* --paper-material-elevation-5 */
  ${cssRules.get('--shadow-elevation-16dp')}`);

cssRules.set('paper-material-styles', `/* paper-material-styles */
  :host(.paper-material), .paper-material {
    ${cssRules.get('--paper-material')}
  }
  :host(.paper-material[elevation="1"]), .paper-material[elevation="1"] {
    ${cssRules.get('--paper-material-elevation-1')}
  }
  :host(.paper-material[elevation="2"]), .paper-material[elevation="2"] {
    ${cssRules.get('--paper-material-elevation-2')}
  }
  :host(.paper-material[elevation="3"]), .paper-material[elevation="3"] {
    ${cssRules.get('--paper-material-elevation-3')}
  }
  :host(.paper-material[elevation="4"]), .paper-material[elevation="4"] {
    ${cssRules.get('--paper-material-elevation-4')}
  }
  :host(.paper-material[elevation="5"]), .paper-material[elevation="5"] {
    ${cssRules.get('--paper-material-elevation-5')}
  }`);

// cssRules.set('--', `/* -- */
// `);
