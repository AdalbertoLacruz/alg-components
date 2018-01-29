// @copyright @polymer
// @copyright 2017-2018 adalberto.lacruz@gmail.com

import {Rules} from '../../../lib/styles/rules.js';

Rules.sheet('style', `
    .redlines {
      background: linear-gradient(0deg, transparent, transparent 3.5px, rgba(255,0,0,0.2) 3.5px, rgba(255,0,0,0.2) 4px);
      background-size: 100% 4px;
    }
    body {
      --test: 'background-color: red;';
      var(--test);
    }

    .paper-font-display4 { ${Rules.use('--paper-font-display4')} }
    .paper-font-display3 { ${Rules.use('--paper-font-display3')} }
    .paper-font-display2 { ${Rules.use('--paper-font-display2')} }
    .paper-font-display1 { ${Rules.use('--paper-font-display1')} }
    .paper-font-headline { ${Rules.use('--paper-font-headline')} }
    .paper-font-title { ${Rules.use('--paper-font-title')} }
    .paper-font-subhead {  ${Rules.use('-paper-font-subhead')} }
    .paper-font-body2 { ${Rules.use('--paper-font-body2')} }
    .paper-font-body1 { ${Rules.use('--paper-font-body1')} }
    .paper-font-caption { ${Rules.use('--paper-font-caption')} }
    .paper-font-menu { ${Rules.use('--paper-font-menu')} }
    .paper-font-button { ${Rules.use('--paper-font-button')} }

    .shadow-2dp { ${Rules.use('--shadow-elevation-2dp')} }
    .shadow-3dp { ${Rules.use('--shadow-elevation-3dp')} }
    .shadow-4dp { ${Rules.use('--shadow-elevation-4dp')} }
    .shadow-6dp { ${Rules.use('--shadow-elevation-6dp')} }
    .shadow-8dp { ${Rules.use('--shadow-elevation-8dp')} }
    .shadow-12dp { ${Rules.use('--shadow-elevation-12dp')} }
    .shadow-16dp { ${Rules.use('--shadow-elevation-16dp')} }
    .shadow {
      display: inline-block;
      padding: 8px;
      margin: 16px;
      height: 50px;
      width: 50px;
    }

    .toolbar {
      height: 144px;
      padding: 16px;
      background: var(--default-primary-color);
      color: var(--text-primary-color);
      ${Rules.use('--paper-font-display1')}
    }

    .item, .disabled-item {
      position: relative;
      padding: 8px;
      border: 1px solid;
      border-color: var(--divider-color);
      border-top: 0;
    }

    .item .primary {
      color: var(--primary-text-color);
      ${Rules.use('--paper-font-body2')}
    }

    .item .secondary {
      color: var(--secondary-text-color);
      ${Rules.use('--paper-font-body1')}
    }

    .disabled-item {
      color: var(--disabled-text-color);
      ${Rules.use('--paper-font-body2')}
    }

    .fab {
      position: absolute;
      box-sizing: border-box;
      padding: 8px;
      width: 56px;
      height: 56px;
      right: 16px;
      top: -28px;
      border-radius: 50%;
      text-align: center;

      background: var(--accent-color);
      color: var(--text-primary-color);
      ${Rules.use('--paper-font-display1')}
    }

    ${Rules.use('paper-material-styles')}
    .paper-material {
      padding: 16px;
      margin: 0 16px;
      display: inline-block;
    }

    ${Rules.use('paper-item-styles')}
  ''');
`);
