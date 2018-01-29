// @copyright @polymer\paper-styles\typography.js
// @copyright 2017-2018 adalberto.lacruz@gmail.com

import { Rules } from './rules.js';
import './roboto.js';

/* Shared Styles */

Rules.define('--paper-font-common-base', `
  font-family: 'Roboto', 'Noto', sans-serif;
  -webkit-font-smoothing: antialiased;`);

Rules.define('--paper-font-common-code', `
  font-family: 'Roboto Mono', 'Consolas', 'Menlo', monospace;
  -webkit-font-smoothing: antialiased;`);

Rules.define('--paper-font-common-expensive-kerning', `/
  text-rendering: optimizeLegibility;`);

Rules.define('--paper-font-common-nowrap', `
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;`);

/* Material Font Styles */

Rules.define('--paper-font-display4', `
  ${Rules.use('--paper-font-common-base')}
  ${Rules.use('--paper-font-common-nowrap')}
  font-size: 112px;
  font-weight: 300;
  letter-spacing: -.044em;
  line-height: 120px;`);

Rules.define('--paper-font-display3', `
  ${Rules.use('--paper-font-common-base')}
  ${Rules.use('--paper-font-common-nowrap')}
  font-size: 56px;
  font-weight: 400;
  letter-spacing: -.026em;
  line-height: 60px;`);

Rules.define('--paper-font-display2', `
  ${Rules.use('--paper-font-common-base')}
  font-size: 45px;
  font-weight: 400;
  letter-spacing: -.018em;
  line-height: 48px;`);

Rules.define('--paper-font-display1', `
  ${Rules.use('--paper-font-common-base')}
  font-size: 34px;
  font-weight: 400;
  letter-spacing: -.01em;
  line-height: 40px;`);

Rules.define('--paper-font-headline', `
  ${Rules.use('--paper-font-common-base')}
  font-size: 24px;
  font-weight: 400;
  letter-spacing: -.012em;
  line-height: 32px;`);

Rules.define('--paper-font-title', `
  ${Rules.use('--paper-font-common-base')}
  ${Rules.use('--paper-font-common-nowrap')}
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;`);

Rules.define('--paper-font-subhead', `
  ${Rules.use('--paper-font-common-base')}
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;`);

Rules.define('--paper-font-body2', `
  ${Rules.use('--paper-font-common-base')}
  font-size: 14px;
  font-weight: 500;
  line-height: 24px;`);

Rules.define('--paper-font-body1', `
  ${Rules.use('--paper-font-common-base')}
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;`);

Rules.define('--paper-font-caption', `
  ${Rules.use('--paper-font-common-base')}
  ${Rules.use('--paper-font-common-nowrap')}
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0.011em;
  line-height: 20px;`);

Rules.define('--paper-font-menu', `
  ${Rules.use('--paper-font-common-base')}
  ${Rules.use('--paper-font-common-nowrap')}
  font-size: 13px;
  font-weight: 500;
  line-height: 24px;`);

Rules.define('--paper-font-button', `
  ${Rules.use('--paper-font-common-base')}
  ${Rules.use('--paper-font-common-nowrap')}
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.018em;
  line-height: 24px;
  text-transform: uppercase;`);
Rules.define('--paper-font-code2', `
  ${Rules.use('--paper-font-common-code')}
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;`);

Rules.define('--paper-font-code1', `
  ${Rules.use('--paper-font-common-code')}
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;`);
