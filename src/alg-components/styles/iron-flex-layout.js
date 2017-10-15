// @copyright @polymer\iron-flex-layout\iron-flex-layout.js
// @copyright 2017 ALG

const cssRules = window.cssRules || (window.cssRules = new Map());

cssRules.set('--layout', `/* --layout */
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;`);

cssRules.set('--layout-inline', `/* --layout-inline */
  display: -ms-inline-flexbox;
  display: -webkit-inline-flex;
  display: inline-flex;`);

cssRules.set('--layout-horizontal', `/* --layout-horizontal */
  ${cssRules.get('--layout')}

  -ms-flex-direction: row;
  -webkit-flex-direction: row;
  flex-direction: row;`);

cssRules.set('--layout-horizontal-reverse', `/* --layout-horizontal-reverse */
  ${cssRules.get('--layout')}

  -ms-flex-direction: row-reverse;
  -webkit-flex-direction: row-reverse;
  flex-direction: row-reverse;`);

cssRules.set('--layout-vertical', `/* --layout-vertical */
  ${cssRules.get('--layout')}

  -ms-flex-direction: column;
  -webkit-flex-direction: column;
  flex-direction: column;`);

cssRules.set('--layout-vertical-reverse', `/* --layout-vertical-reverse */
  ${cssRules.get('--layout')}

  -ms-flex-direction: column-reverse;
  -webkit-flex-direction: column-reverse;
  flex-direction: column-reverse;`);

cssRules.set('--layout-wrap', `/* --layout-wrap */
  -ms-flex-wrap: wrap;
  -webkit-flex-wrap: wrap;
  flex-wrap: wrap;`);

cssRules.set('--layout-wrap-reverse', `/* --layout-wrap-reverse */
  -ms-flex-wrap: wrap-reverse;
  -webkit-flex-wrap: wrap-reverse;
  flex-wrap: wrap-reverse;`);

cssRules.set('--layout-flex-auto', `/* --layout-flex-auto */
  -ms-flex: 1 1 auto;
  -webkit-flex: 1 1 auto;
  flex: 1 1 auto;`);

cssRules.set('--layout-flex-none', `/* --layout-flex-none */
  -ms-flex: none;
  -webkit-flex: none;
  flex: none;`);

cssRules.set('--layout-flex', `/* --layout-flex */
  -ms-flex: 1 1 0.000000001px;
  -webkit-flex: 1;
  flex: 1;
  -webkit-flex-basis: 0.000000001px;
  flex-basis: 0.000000001px;`);

cssRules.set('--layout-flex-2', `/* --layout-flex-2 */
  -ms-flex: 2;
  -webkit-flex: 2;
  flex: 2;`);

cssRules.set('--layout-flex-3', `/* --layout-flex-3 */
  -ms-flex: 3;
  -webkit-flex: 3;
  flex: 3;`);

cssRules.set('--layout-flex-4', `/* --layout-flex-4 */
  -ms-flex: 4;
  -webkit-flex: 4;
  flex: 4;`);

cssRules.set('--layout-flex-5', `/* --layout-flex-5 */
  -ms-flex: 5;
  -webkit-flex: 5;
  flex: 5;`);

cssRules.set('--layout-flex-6', `/* --layout-flex-6 */
  -ms-flex: 6;
  -webkit-flex: 6;
  flex: 6;`);

cssRules.set('--layout-flex-7', `/* --layout-flex-7 */
  -ms-flex: 7;
  -webkit-flex: 7;
  flex: 7;`);

cssRules.set('--layout-flex-8', `/* --layout-flex-8 */
  -ms-flex: 8;
  -webkit-flex: 8;
  flex: 8;`);

cssRules.set('--layout-flex-9', `/* --layout-flex-9 */
  -ms-flex: 9;
  -webkit-flex: 9;
  flex: 9;`);

cssRules.set('--layout-flex-10', `/* --layout-flex-10 */
  -ms-flex: 10;
  -webkit-flex: 10;
  flex: 10;`);

cssRules.set('--layout-flex-11', `/* --layout-flex-11 */
  -ms-flex: 11;
  -webkit-flex: 11;
  flex: 11;`);

cssRules.set('--layout-flex-12', `/* --layout-flex-12 */
  -ms-flex: 12;
  -webkit-flex: 12;
  flex: 12;`);

/* alignment in cross axis */

cssRules.set('--layout-start', `/* --layout-start */
  -ms-flex-align: start;
  -webkit-align-items: flex-start;
  align-items: flex-start;`);

cssRules.set('--layout-center', `/* --layout-center */
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center;`);

cssRules.set('--layout-end', `/* --layout-end */
  -ms-flex-align: end;
  -webkit-align-items: flex-end;
  align-items: flex-end;`);

cssRules.set('--layout-baseline', `/* --layout-baseline */
  -ms-flex-align: baseline;
  -webkit-align-items: baseline;
  align-items: baseline;`);

/* alignment in main axis */

cssRules.set('--layout-start-justified', `/* --layout-start-justified */
  -ms-flex-pack: start;
  -webkit-justify-content: flex-start;
  justify-content: flex-start;`);

cssRules.set('--layout-center-justified', `/* --layout-center-justified */
  -ms-flex-pack: center;
  -webkit-justify-content: center;
  justify-content: center;`);

cssRules.set('--layout-end-justified', `/* --layout-end-justified */
  -ms-flex-pack: end;
  -webkit-justify-content: flex-end;
  justify-content: flex-end;`);

cssRules.set('--layout-around-justified', `/* --layout-around-justified */
  -ms-flex-pack: distribute;
  -webkit-justify-content: space-around;
  justify-content: space-around;`);

cssRules.set('--layout-justified', `/* --layout-justified */
  -ms-flex-pack: justify;
  -webkit-justify-content: space-between;
  justify-content: space-between;`);

cssRules.set('--layout-center-center', `/* --layout-center-center */
  ${cssRules.get('--layout-center')}
  ${cssRules.get('--layout-center-justified')}`);

/* self alignment */

cssRules.set('--layout-self-start', `/* --layout-self-start */
  -ms-align-self: flex-start;
  -webkit-align-self: flex-start;
  align-self: flex-start;`);

cssRules.set('--layout-self-center', `/* --layout-self-center */
  -ms-align-self: center;
  -webkit-align-self: center;
  align-self: center;`);

cssRules.set('--layout-self-end', `/* --layout-self-end */
  -ms-align-self: flex-end;
  -webkit-align-self: flex-end;
  align-self: flex-end;`);

cssRules.set('--layout-self-stretch', `/* --layout-self-stretch */
  -ms-align-self: stretch;
  -webkit-align-self: stretch;
  align-self: stretch;`);

cssRules.set('--layout-self-baseline', `/* --layout-self-baseline */
  -ms-align-self: baseline;
  -webkit-align-self: baseline;
  align-self: baseline;`);

/* multi-line alignment in main axis */

cssRules.set('--layout-start-aligned', `/* --layout-start-aligned */
  -ms-flex-line-pack: start;  /* IE10 */
  -ms-align-content: flex-start;
  -webkit-align-content: flex-start;
  align-content: flex-start;`);

cssRules.set('--layout-end-aligned', `/* --layout-end-aligned */
  -ms-flex-line-pack: end;  /* IE10 */
  -ms-align-content: flex-end;
  -webkit-align-content: flex-end;
  align-content: flex-end;`);

cssRules.set('--layout-center-aligned', `/* --layout-center-aligned */
  -ms-flex-line-pack: center;  /* IE10 */
  -ms-align-content: center;
  -webkit-align-content: center;
  align-content: center;`);

cssRules.set('--layout-between-aligned', `/* --layout-between-aligned */
  -ms-flex-line-pack: justify;  /* IE10 */
  -ms-align-content: space-between;
  -webkit-align-content: space-between;
  align-content: space-between;`);

cssRules.set('--layout-around-aligned', `/* --layout-around-aligned */
  -ms-flex-line-pack: distribute;  /* IE10 */
  -ms-align-content: space-around;
  -webkit-align-content: space-around;
  align-content: space-around;`);

/*******************************
          Other Layout
 *******************************/

cssRules.set('--layout-block', `/* --layout-block */
  display: block;`);

cssRules.set('--layout-invisible', `/* --layout-invisible */
  visibility: hidden !important;`);

cssRules.set('--layout-relative', `/* --layout-relative */
  position: relative;`);

cssRules.set('--layout-fit', `/* --layout-fit */
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;`);

cssRules.set('--layout-scroll', `/* --layout-scroll */
  -webkit-overflow-scrolling: touch;
  overflow: auto;`);

cssRules.set('--layout-fullbleed', `/* --layout-fullbleed */
  margin: 0;
  height: 100vh;`);

/* fixed position */

cssRules.set('--layout-fixed-top', `/* --layout-fixed-top */
  position: fixed;
  top: 0;
  left: 0;
  right: 0;`);

cssRules.set('--layout-fixed-right', `/* --layout-fixed-right */
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;`);

cssRules.set('--layout-fixed-bottom', `/* --layout-fixed-bottom */
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;`);

cssRules.set('--layout-fixed-left', `/* --layout-fixed-left */
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;`);

// cssRules.set('--', `/* -- */
// `);
