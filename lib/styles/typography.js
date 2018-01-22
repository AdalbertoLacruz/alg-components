// @copyright @polymer\paper-styles\typography.js
// @copyright 2017-2018 adalberto.lacruz@gmail.com

import * as css from './css-style.js';
import './roboto.js';

/* Shared Styles */

css.setRule('--paper-font-common-base', `
  font-family: 'Roboto', 'Noto', sans-serif;
  -webkit-font-smoothing: antialiased;`);

css.setRule('--paper-font-common-code', `
  font-family: 'Roboto Mono', 'Consolas', 'Menlo', monospace;
  -webkit-font-smoothing: antialiased;`);

css.setRule('--paper-font-common-expensive-kerning', `/
  text-rendering: optimizeLegibility;`);

css.setRule('--paper-font-common-nowrap', `
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;`);

/* Material Font Styles */

css.setRule('--paper-font-display4', `
  ${css.getRule('--paper-font-common-base')}
  ${css.getRule('--paper-font-common-nowrap')}
  font-size: 112px;
  font-weight: 300;
  letter-spacing: -.044em;
  line-height: 120px;`);

css.setRule('--paper-font-display3', `
  ${css.getRule('--paper-font-common-base')}
  ${css.getRule('--paper-font-common-nowrap')}
  font-size: 56px;
  font-weight: 400;
  letter-spacing: -.026em;
  line-height: 60px;`);

css.setRule('--paper-font-display2', `
  ${css.getRule('--paper-font-common-base')}
  font-size: 45px;
  font-weight: 400;
  letter-spacing: -.018em;
  line-height: 48px;`);

css.setRule('--paper-font-display1', `
  ${css.getRule('--paper-font-common-base')}
  font-size: 34px;
  font-weight: 400;
  letter-spacing: -.01em;
  line-height: 40px;`);

css.setRule('--paper-font-headline', `
  ${css.getRule('--paper-font-common-base')}
  font-size: 24px;
  font-weight: 400;
  letter-spacing: -.012em;
  line-height: 32px;`);

css.setRule('--paper-font-title', `
  ${css.getRule('--paper-font-common-base')}
  ${css.getRule('--paper-font-common-nowrap')}
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;`);

css.setRule('--paper-font-subhead', `
  ${css.getRule('--paper-font-common-base')}
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;`);

css.setRule('--paper-font-body2', `
  ${css.getRule('--paper-font-common-base')}
  font-size: 14px;
  font-weight: 500;
  line-height: 24px;`);

css.setRule('--paper-font-body1', `
  ${css.getRule('--paper-font-common-base')}
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;`);

css.setRule('--paper-font-caption', `
  ${css.getRule('--paper-font-common-base')}
  ${css.getRule('--paper-font-common-nowrap')}
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0.011em;
  line-height: 20px;`);

css.setRule('--paper-font-menu', `
  ${css.getRule('--paper-font-common-base')}
  ${css.getRule('--paper-font-common-nowrap')}
  font-size: 13px;
  font-weight: 500;
  line-height: 24px;`);

css.setRule('--paper-font-button', `
  ${css.getRule('--paper-font-common-base')}
  ${css.getRule('--paper-font-common-nowrap')}
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.018em;
  line-height: 24px;
  text-transform: uppercase;`);
css.setRule('--paper-font-code2', `
  ${css.getRule('--paper-font-common-code')}
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;`);

css.setRule('--paper-font-code1', `
  ${css.getRule('--paper-font-common-code')}
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;`);
