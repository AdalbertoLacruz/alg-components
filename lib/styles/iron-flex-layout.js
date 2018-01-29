// @copyright @polymer\iron-flex-layout\iron-flex-layout.js
// @copyright 2017-2018 adalberto.lacruz@gmail.com

import { Rules } from './rules.js';

Rules.define('--layout', `
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;`);

Rules.define('--layout-inline', `
  display: -ms-inline-flexbox;
  display: -webkit-inline-flex;
  display: inline-flex;`);

Rules.define('--layout-horizontal', `
  ${Rules.use('--layout')}

  -ms-flex-direction: row;
  -webkit-flex-direction: row;
  flex-direction: row;`);

Rules.define('--layout-horizontal-reverse', `
  ${Rules.use('--layout')}

  -ms-flex-direction: row-reverse;
  -webkit-flex-direction: row-reverse;
  flex-direction: row-reverse;`);

Rules.define('--layout-vertical', `
  ${Rules.use('--layout')}

  -ms-flex-direction: column;
  -webkit-flex-direction: column;
  flex-direction: column;`);

Rules.define('--layout-vertical-reverse', `
  ${Rules.use('--layout')}

  -ms-flex-direction: column-reverse;
  -webkit-flex-direction: column-reverse;
  flex-direction: column-reverse;`);

Rules.define('--layout-wrap', `
  -ms-flex-wrap: wrap;
  -webkit-flex-wrap: wrap;
  flex-wrap: wrap;`);

Rules.define('--layout-wrap-reverse', `
  -ms-flex-wrap: wrap-reverse;
  -webkit-flex-wrap: wrap-reverse;
  flex-wrap: wrap-reverse;`);

Rules.define('--layout-flex-auto', `
  -ms-flex: 1 1 auto;
  -webkit-flex: 1 1 auto;
  flex: 1 1 auto;`);

Rules.define('--layout-flex-none', `
  -ms-flex: none;
  -webkit-flex: none;
  flex: none;`);

Rules.define('--layout-flex', `
  -ms-flex: 1 1 0.000000001px;
  -webkit-flex: 1;
  flex: 1;
  -webkit-flex-basis: 0.000000001px;
  flex-basis: 0.000000001px;`);

Rules.define('--layout-flex-2', `
  -ms-flex: 2;
  -webkit-flex: 2;
  flex: 2;`);

Rules.define('--layout-flex-3', `
  -ms-flex: 3;
  -webkit-flex: 3;
  flex: 3;`);

Rules.define('--layout-flex-4', `
  -ms-flex: 4;
  -webkit-flex: 4;
  flex: 4;`);

Rules.define('--layout-flex-5', `
  -ms-flex: 5;
  -webkit-flex: 5;
  flex: 5;`);

Rules.define('--layout-flex-6', `
  -ms-flex: 6;
  -webkit-flex: 6;
  flex: 6;`);

Rules.define('--layout-flex-7', `
  -ms-flex: 7;
  -webkit-flex: 7;
  flex: 7;`);

Rules.define('--layout-flex-8', `
  -ms-flex: 8;
  -webkit-flex: 8;
  flex: 8;`);

Rules.define('--layout-flex-9', `
  -ms-flex: 9;
  -webkit-flex: 9;
  flex: 9;`);

Rules.define('--layout-flex-10', `
  -ms-flex: 10;
  -webkit-flex: 10;
  flex: 10;`);

Rules.define('--layout-flex-11', `
  -ms-flex: 11;
  -webkit-flex: 11;
  flex: 11;`);

Rules.define('--layout-flex-12', `
  -ms-flex: 12;
  -webkit-flex: 12;
  flex: 12;`);

/* alignment in cross axis */

Rules.define('--layout-start', `
  -ms-flex-align: start;
  -webkit-align-items: flex-start;
  align-items: flex-start;`);

Rules.define('--layout-center', `
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center;`);

Rules.define('--layout-end', `
  -ms-flex-align: end;
  -webkit-align-items: flex-end;
  align-items: flex-end;`);

Rules.define('--layout-baseline', `
  -ms-flex-align: baseline;
  -webkit-align-items: baseline;
  align-items: baseline;`);

/* alignment in main axis */

Rules.define('--layout-start-justified', `
  -ms-flex-pack: start;
  -webkit-justify-content: flex-start;
  justify-content: flex-start;`);

Rules.define('--layout-center-justified', `
  -ms-flex-pack: center;
  -webkit-justify-content: center;
  justify-content: center;`);

Rules.define('--layout-end-justified', `
  -ms-flex-pack: end;
  -webkit-justify-content: flex-end;
  justify-content: flex-end;`);

Rules.define('--layout-around-justified', `
  -ms-flex-pack: distribute;
  -webkit-justify-content: space-around;
  justify-content: space-around;`);

Rules.define('--layout-justified', `
  -ms-flex-pack: justify;
  -webkit-justify-content: space-between;
  justify-content: space-between;`);

Rules.define('--layout-center-center', `
  ${Rules.use('--layout-center')}
  ${Rules.use('--layout-center-justified')}`);

/* self alignment */

Rules.define('--layout-self-start', `
  -ms-align-self: flex-start;
  -webkit-align-self: flex-start;
  align-self: flex-start;`);

Rules.define('--layout-self-center', `
  -ms-align-self: center;
  -webkit-align-self: center;
  align-self: center;`);

Rules.define('--layout-self-end', `
  -ms-align-self: flex-end;
  -webkit-align-self: flex-end;
  align-self: flex-end;`);

Rules.define('--layout-self-stretch', `
  -ms-align-self: stretch;
  -webkit-align-self: stretch;
  align-self: stretch;`);

Rules.define('--layout-self-baseline', `
  -ms-align-self: baseline;
  -webkit-align-self: baseline;
  align-self: baseline;`);

/* multi-line alignment in main axis */

Rules.define('--layout-start-aligned', `
  -ms-flex-line-pack: start;  /* IE10 */
  -ms-align-content: flex-start;
  -webkit-align-content: flex-start;
  align-content: flex-start;`);

Rules.define('--layout-end-aligned', `
  -ms-flex-line-pack: end;  /* IE10 */
  -ms-align-content: flex-end;
  -webkit-align-content: flex-end;
  align-content: flex-end;`);

Rules.define('--layout-center-aligned', `
  -ms-flex-line-pack: center;  /* IE10 */
  -ms-align-content: center;
  -webkit-align-content: center;
  align-content: center;`);

Rules.define('--layout-between-aligned', `
  -ms-flex-line-pack: justify;  /* IE10 */
  -ms-align-content: space-between;
  -webkit-align-content: space-between;
  align-content: space-between;`);

Rules.define('--layout-around-aligned', `
  -ms-flex-line-pack: distribute;  /* IE10 */
  -ms-align-content: space-around;
  -webkit-align-content: space-around;
  align-content: space-around;`);

/*******************************
          Other Layout
 *******************************/

Rules.define('--layout-block', `
  display: block;`);

Rules.define('--layout-invisible', `
  visibility: hidden !important;`);

Rules.define('--layout-relative', `
  position: relative;`);

Rules.define('--layout-fit', `
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;`);

Rules.define('--layout-scroll', `
  -webkit-overflow-scrolling: touch;
  overflow: auto;`);

Rules.define('--layout-fullbleed', `
  margin: 0;
  height: 100vh;`);

/* fixed position */

Rules.define('--layout-fixed-top', `
  position: fixed;
  top: 0;
  left: 0;
  right: 0;`);

Rules.define('--layout-fixed-right', `
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;`);

Rules.define('--layout-fixed-bottom', `
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;`);

Rules.define('--layout-fixed-left', `
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;`);
