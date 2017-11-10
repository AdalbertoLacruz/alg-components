// @copyright @polymer\paper-styles\demo-pages.js
// @copyright 2017 ALG
/* global cssRules */

import '../../src/alg-components/styles/iron-flex-layout.js';
import '../../src/alg-components/styles/color.js';
import '../../src/alg-components/styles/typography.js';
import '../../src/alg-components/styles/shadow.js';
import * as css from '../../src/alg-components/util/css-style.js';

css.setRule('--horizontal-section-container', `
    ${css.getRule('--layout-horizontal')}
    ${css.getRule('--layout-center-justified')}
    ${css.getRule('--layout-wrap')}
`);

css.style('demo-pages', `
  body {
    @apply --paper-font-common-base;
    ${css.getRule('--paper-font-common-base')}
    font-size: 14px;
    margin: 0;
    padding: 24px;
    background-color: var(--paper-grey-50);
  }

  .horizontal-section-container {
    ${css.getRule('--layout-horizontal')}
    ${css.getRule('--layout-center-justified')}
    ${css.getRule('--layout-wrap')}
  }

  .vertical-section-container {
    ${css.getRule('--layout-vertical')}
    ${css.getRule('--layout-center-justified')}
  }

  .horizontal-section {
    background-color: white;
    padding: 24px;
    margin-right: 24px;
    min-width: 200px;

    ${css.getRule('--shadow-elevation-2dp')}
  }

  .vertical-section {
    background-color: white;
    padding: 24px;
    margin: 0 24px 24px 24px;

    ${css.getRule('--shadow-elevation-2dp')}
  }

  .centered {
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }

  code {
    color: var(--google-grey-700);
  }

  body > div.layout.horizontal.center-justified {
    ${cssRules.get('--layout-wrap')}
  }

  .demo-snipped {
    display: block;
    border-bottom: 1px solid #e0e0e0;
    background-color: white;
    padding: 20px;
    ${css.getRule('--shadow-elevation-2dp')}
    margin-bottom: 40px;
    ${css.getRule('--horizontal-section-container')}
  }
`);