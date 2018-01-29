// @copyright @polymer
// @copyright 2017-2018 adalberto.lacruz@gmail.com

import {Rules} from '../../../lib/styles/rules.js';

Rules.sheet('style', `
    .demo-snippet {
      padding: 0;
    }

    .centered {
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    .container {
      background-color: #ccc;
      padding: 5px;
      margin: 0;
    }

    .container > div {
      padding: 15px;
      margin: 5px;
      background-color: white;
      min-height: 20px;
    }

    .flex {
      ${Rules.use('--layout-horizontal')}
    }

    .flex-horizontal {
      ${Rules.use('--layout-horizontal')}
    }

    .flexchild {
      ${Rules.use('--layout-flex')}
    }

    .flex-vertical {
      ${Rules.use('--layout-vertical')}
      height: 220px;
    }

    .flexchild-vertical {
      ${Rules.use('--layout-flex')}
    }

    .flex-horizontal-with-ratios {
      ${Rules.use('--layout-horizontal')}
    }

    .flex2child {
      ${Rules.use('--layout-flex-2')}
    }

    .flex3child {
      ${Rules.use('--layout-flex-3')}
    }

    .flex-stretch-align {
      ${Rules.use('--layout-horizontal')}
      height: 120px;
    }

    .flex-center-align {
      ${Rules.use('--layout-horizontal')}
      ${Rules.use('--layout-center')}
      height: 120px;
    }

    .flex-start-align {
      ${Rules.use('--layout-horizontal')}
      ${Rules.use('--layout-start')}
      height: 120px;
    }

    .flex-end-align {
      ${Rules.use('--layout-horizontal')}
      ${Rules.use('--layout-end')}
      height: 120px;
    }

    .flex-start-justified {
      ${Rules.use('--layout-horizontal')}
      ${Rules.use('--layout-start-justified')}
    }

    .flex-center-justified {
      ${Rules.use('--layout-horizontal')}
      ${Rules.use('--layout-center-justified')}
    }

    .flex-end-justified {
      ${Rules.use('--layout-horizontal')}
      ${Rules.use('--layout-end-justified')}
    }

    .flex-equal-justified {
      ${Rules.use('--layout-horizontal')}
      ${Rules.use('--layout-justified')}
    }

    .flex-equal-around-justified {
      ${Rules.use('--layout-horizontal')}
      ${Rules.use('--layout-around-justified')}
    }

    .flex-self-align {
      ${Rules.use('--layout-horizontal')}
      ${Rules.use('--layout-justified')}
      height: 120px;
    }

    .flex-self-align div {
      ${Rules.use('--layout-flex')}
    }

    .child1 {
      ${Rules.use('--layout-self-start')}
    }

    .child2 {
      ${Rules.use('--layout-self-center')}
    }

    .child3 {
      ${Rules.use('--layout-self-end')}
    }

    .child4 {
      ${Rules.use('--layout-self-stretch')}
    }

    .flex-wrap {
      ${Rules.use('--layout-horizontal')}
      ${Rules.use('--layout-wrap')}
      width: 200px;
    }

    .flex-reversed {
      ${Rules.use('--layout-horizontal-reverse')}
    }

    .general {
      width: 100%;
    }

    .general > div {
      background-color: #ccc;
      padding: 4px;
      margin: 12px;
    }

    .block {
      ${Rules.use('--layout-block')}
    }

    .invisible {
      ${Rules.use('--layout-invisible')}
    }

    .relative {
      ${Rules.use('--layout-relative')}
    }

    .fit {
      ${Rules.use('--layout-fit')}
    }
`);
