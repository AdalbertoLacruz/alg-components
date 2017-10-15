// @copyright @polymer\paper-styles\typography.js
// @copyright 2017 ALG

import './roboto.js';

const cssRules = window.cssRules || (window.cssRules = new Map());

/* Shared Styles */

cssRules.set('--paper-font-common-base', `/* --paper-font-common-base */
  font-family: 'Roboto', 'Noto', sans-serif;
  -webkit-font-smoothing: antialiased;`);

cssRules.set('--paper-font-common-code', `/* --paper-font-common-code */
  font-family: 'Roboto Mono', 'Consolas', 'Menlo', monospace;
  -webkit-font-smoothing: antialiased;`);

cssRules.set('--paper-font-common-expensive-kerning', `/* --paper-font-common-expensive-kerning */
  text-rendering: optimizeLegibility;`);

cssRules.set('--paper-font-common-nowrap', `/* --paper-font-common-nowrap */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;`);

/* Material Font Styles */

cssRules.set('--paper-font-display4', `/* --paper-font-display4 */
  ${cssRules.get('--paper-font-common-base')}
  ${cssRules.get('--paper-font-common-nowrap')}
  font-size: 112px;
  font-weight: 300;
  letter-spacing: -.044em;
  line-height: 120px;`);

cssRules.set('--paper-font-display3', `/* --paper-font-display3 */
  ${cssRules.get('--paper-font-common-base')}
  ${cssRules.get('--paper-font-common-nowrap')}
  font-size: 56px;
  font-weight: 400;
  letter-spacing: -.026em;
  line-height: 60px;`);

cssRules.set('--paper-font-display2', `/* --paper-font-display2 */
  ${cssRules.get('--paper-font-common-base')}
  font-size: 45px;
  font-weight: 400;
  letter-spacing: -.018em;
  line-height: 48px;`);

cssRules.set('--paper-font-display1', `/* --paper-font-display1 */
  ${cssRules.get('--paper-font-common-base')}
  font-size: 34px;
  font-weight: 400;
  letter-spacing: -.01em;
  line-height: 40px;`);

cssRules.set('--paper-font-headline', `/* --paper-font-headline */
  ${cssRules.get('--paper-font-common-base')}
  font-size: 24px;
  font-weight: 400;
  letter-spacing: -.012em;
  line-height: 32px;`);

cssRules.set('--paper-font-title', `/* --paper-font-title */
  ${cssRules.get('--paper-font-common-base')}
  ${cssRules.get('--paper-font-common-nowrap')}
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;`);

cssRules.set('--paper-font-subhead', `/* --paper-font-subhead */
  ${cssRules.get('--paper-font-common-base')}
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;`);

cssRules.set('--paper-font-body2', `/* --paper-font-body2 */
  ${cssRules.get('--paper-font-common-base')}
  font-size: 14px;
  font-weight: 500;
  line-height: 24px;`);

cssRules.set('--paper-font-body1', `/* --paper-font-body1 */
  ${cssRules.get('--paper-font-common-base')}
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;`);

cssRules.set('--paper-font-caption', `/* --paper-font-caption */
  ${cssRules.get('--paper-font-common-base')}
  ${cssRules.get('--paper-font-common-nowrap')}
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0.011em;
  line-height: 20px;`);

cssRules.set('--paper-font-menu', `/* --paper-font-menu */
  ${cssRules.get('--paper-font-common-base')}
  ${cssRules.get('--paper-font-common-nowrap')}
  font-size: 13px;
  font-weight: 500;
  line-height: 24px;`);

cssRules.set('--paper-font-button', `/* --paper-font-button */
  ${cssRules.get('--paper-font-common-base')}
  ${cssRules.get('--paper-font-common-nowrap')}
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.018em;
  line-height: 24px;
  text-transform: uppercase;`);
cssRules.set('--paper-font-code2', `/* --paper-font-code2 */
  ${cssRules.get('--paper-font-common-code')}
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;`);

cssRules.set('--paper-font-code1', `/* --paper-font-code1 */
  ${cssRules.get('--paper-font-common-code')}
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;`);
