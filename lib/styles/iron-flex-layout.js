// @copyright @polymer\iron-flex-layout\iron-flex-layout.js
// @copyright 2017-2018 adalberto.lacruz@gmail.com

import * as css from './css-style.js';

css.setRule('--layout', `
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;`);

css.setRule('--layout-inline', `
  display: -ms-inline-flexbox;
  display: -webkit-inline-flex;
  display: inline-flex;`);

css.setRule('--layout-horizontal', `
  ${css.getRule('--layout')}

  -ms-flex-direction: row;
  -webkit-flex-direction: row;
  flex-direction: row;`);

css.setRule('--layout-horizontal-reverse', `
  ${css.getRule('--layout')}

  -ms-flex-direction: row-reverse;
  -webkit-flex-direction: row-reverse;
  flex-direction: row-reverse;`);

css.setRule('--layout-vertical', `
  ${css.getRule('--layout')}

  -ms-flex-direction: column;
  -webkit-flex-direction: column;
  flex-direction: column;`);

css.setRule('--layout-vertical-reverse', `
  ${css.getRule('--layout')}

  -ms-flex-direction: column-reverse;
  -webkit-flex-direction: column-reverse;
  flex-direction: column-reverse;`);

css.setRule('--layout-wrap', `
  -ms-flex-wrap: wrap;
  -webkit-flex-wrap: wrap;
  flex-wrap: wrap;`);

css.setRule('--layout-wrap-reverse', `
  -ms-flex-wrap: wrap-reverse;
  -webkit-flex-wrap: wrap-reverse;
  flex-wrap: wrap-reverse;`);

css.setRule('--layout-flex-auto', `
  -ms-flex: 1 1 auto;
  -webkit-flex: 1 1 auto;
  flex: 1 1 auto;`);

css.setRule('--layout-flex-none', `
  -ms-flex: none;
  -webkit-flex: none;
  flex: none;`);

css.setRule('--layout-flex', `
  -ms-flex: 1 1 0.000000001px;
  -webkit-flex: 1;
  flex: 1;
  -webkit-flex-basis: 0.000000001px;
  flex-basis: 0.000000001px;`);

css.setRule('--layout-flex-2', `
  -ms-flex: 2;
  -webkit-flex: 2;
  flex: 2;`);

css.setRule('--layout-flex-3', `
  -ms-flex: 3;
  -webkit-flex: 3;
  flex: 3;`);

css.setRule('--layout-flex-4', `
  -ms-flex: 4;
  -webkit-flex: 4;
  flex: 4;`);

css.setRule('--layout-flex-5', `
  -ms-flex: 5;
  -webkit-flex: 5;
  flex: 5;`);

css.setRule('--layout-flex-6', `
  -ms-flex: 6;
  -webkit-flex: 6;
  flex: 6;`);

css.setRule('--layout-flex-7', `
  -ms-flex: 7;
  -webkit-flex: 7;
  flex: 7;`);

css.setRule('--layout-flex-8', `
  -ms-flex: 8;
  -webkit-flex: 8;
  flex: 8;`);

css.setRule('--layout-flex-9', `
  -ms-flex: 9;
  -webkit-flex: 9;
  flex: 9;`);

css.setRule('--layout-flex-10', `
  -ms-flex: 10;
  -webkit-flex: 10;
  flex: 10;`);

css.setRule('--layout-flex-11', `
  -ms-flex: 11;
  -webkit-flex: 11;
  flex: 11;`);

css.setRule('--layout-flex-12', `
  -ms-flex: 12;
  -webkit-flex: 12;
  flex: 12;`);

/* alignment in cross axis */

css.setRule('--layout-start', `
  -ms-flex-align: start;
  -webkit-align-items: flex-start;
  align-items: flex-start;`);

css.setRule('--layout-center', `
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center;`);

css.setRule('--layout-end', `
  -ms-flex-align: end;
  -webkit-align-items: flex-end;
  align-items: flex-end;`);

css.setRule('--layout-baseline', `
  -ms-flex-align: baseline;
  -webkit-align-items: baseline;
  align-items: baseline;`);

/* alignment in main axis */

css.setRule('--layout-start-justified', `
  -ms-flex-pack: start;
  -webkit-justify-content: flex-start;
  justify-content: flex-start;`);

css.setRule('--layout-center-justified', `
  -ms-flex-pack: center;
  -webkit-justify-content: center;
  justify-content: center;`);

css.setRule('--layout-end-justified', `
  -ms-flex-pack: end;
  -webkit-justify-content: flex-end;
  justify-content: flex-end;`);

css.setRule('--layout-around-justified', `
  -ms-flex-pack: distribute;
  -webkit-justify-content: space-around;
  justify-content: space-around;`);

css.setRule('--layout-justified', `
  -ms-flex-pack: justify;
  -webkit-justify-content: space-between;
  justify-content: space-between;`);

css.setRule('--layout-center-center', `
  ${css.getRule('--layout-center')}
  ${css.getRule('--layout-center-justified')}`);

/* self alignment */

css.setRule('--layout-self-start', `
  -ms-align-self: flex-start;
  -webkit-align-self: flex-start;
  align-self: flex-start;`);

css.setRule('--layout-self-center', `
  -ms-align-self: center;
  -webkit-align-self: center;
  align-self: center;`);

css.setRule('--layout-self-end', `
  -ms-align-self: flex-end;
  -webkit-align-self: flex-end;
  align-self: flex-end;`);

css.setRule('--layout-self-stretch', `
  -ms-align-self: stretch;
  -webkit-align-self: stretch;
  align-self: stretch;`);

css.setRule('--layout-self-baseline', `
  -ms-align-self: baseline;
  -webkit-align-self: baseline;
  align-self: baseline;`);

/* multi-line alignment in main axis */

css.setRule('--layout-start-aligned', `
  -ms-flex-line-pack: start;  /* IE10 */
  -ms-align-content: flex-start;
  -webkit-align-content: flex-start;
  align-content: flex-start;`);

css.setRule('--layout-end-aligned', `
  -ms-flex-line-pack: end;  /* IE10 */
  -ms-align-content: flex-end;
  -webkit-align-content: flex-end;
  align-content: flex-end;`);

css.setRule('--layout-center-aligned', `
  -ms-flex-line-pack: center;  /* IE10 */
  -ms-align-content: center;
  -webkit-align-content: center;
  align-content: center;`);

css.setRule('--layout-between-aligned', `
  -ms-flex-line-pack: justify;  /* IE10 */
  -ms-align-content: space-between;
  -webkit-align-content: space-between;
  align-content: space-between;`);

css.setRule('--layout-around-aligned', `
  -ms-flex-line-pack: distribute;  /* IE10 */
  -ms-align-content: space-around;
  -webkit-align-content: space-around;
  align-content: space-around;`);

/*******************************
          Other Layout
 *******************************/

css.setRule('--layout-block', `
  display: block;`);

css.setRule('--layout-invisible', `
  visibility: hidden !important;`);

css.setRule('--layout-relative', `
  position: relative;`);

css.setRule('--layout-fit', `
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;`);

css.setRule('--layout-scroll', `
  -webkit-overflow-scrolling: touch;
  overflow: auto;`);

css.setRule('--layout-fullbleed', `
  margin: 0;
  height: 100vh;`);

/* fixed position */

css.setRule('--layout-fixed-top', `
  position: fixed;
  top: 0;
  left: 0;
  right: 0;`);

css.setRule('--layout-fixed-right', `
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;`);

css.setRule('--layout-fixed-bottom', `
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;`);

css.setRule('--layout-fixed-left', `
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;`);
