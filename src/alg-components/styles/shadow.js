// @copyright @polymer\paper-styles\shadow.js
// @copyright 2017 ALG
const cssRules = window.cssRules || (window.cssRules = new Map());

cssRules.set('--shadow-transition', `/* --shadow-transition */
  transition: box-shadow 0.28s cubic-bezier(0.4, 0, 0.2, 1);`);

cssRules.set('--shadow-none', `/* --shadow-none */
  box-shadow: none;`);

/* from http://codepen.io/shyndman/pen/c5394ddf2e8b2a5c9185904b57421cdb */

cssRules.set('--shadow-elevation-2dp', `/* --shadow-elevation-2dp */
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
              0 1px 5px 0 rgba(0, 0, 0, 0.12),
              0 3px 1px -2px rgba(0, 0, 0, 0.2);`);

cssRules.set('--shadow-elevation-3dp', `/* --shadow-elevation-3dp */
  box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.14),
              0 1px 8px 0 rgba(0, 0, 0, 0.12),
              0 3px 3px -2px rgba(0, 0, 0, 0.4);`);

cssRules.set('--shadow-elevation-4dp', `/* --shadow-elevation-4dp */
  box-shadow: 0 4px 5px 0 rgba(0, 0, 0, 0.14),
              0 1px 10px 0 rgba(0, 0, 0, 0.12),
              0 2px 4px -1px rgba(0, 0, 0, 0.4);`);

cssRules.set('--shadow-elevation-6dp', `/* --shadow-elevation-6dp */
  box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.14),
              0 1px 18px 0 rgba(0, 0, 0, 0.12),
              0 3px 5px -1px rgba(0, 0, 0, 0.4);`);

cssRules.set('--shadow-elevation-8dp', `/* --shadow-elevation-8dp */
  box-shadow: 0 8px 10px 1px rgba(0, 0, 0, 0.14),
              0 3px 14px 2px rgba(0, 0, 0, 0.12),
              0 5px 5px -3px rgba(0, 0, 0, 0.4);`);

cssRules.set('--shadow-elevation-12dp', `/* --shadow-elevation-12dp */
  box-shadow: 0 12px 16px 1px rgba(0, 0, 0, 0.14),
              0 4px 22px 3px rgba(0, 0, 0, 0.12),
              0 6px 7px -4px rgba(0, 0, 0, 0.4);`);

cssRules.set('--shadow-elevation-16dp', `/* --shadow-elevation-16dp */
  box-shadow: 0 16px 24px 2px rgba(0, 0, 0, 0.14),
              0  6px 30px 5px rgba(0, 0, 0, 0.12),
              0  8px 10px -5px rgba(0, 0, 0, 0.4);`);

cssRules.set('--shadow-elevation-24dp', `/* --shadow-elevation-24dp */
  box-shadow: 0 24px 38px 3px rgba(0, 0, 0, 0.14),
              0 9px 46px 8px rgba(0, 0, 0, 0.12),
              0 11px 15px -7px rgba(0, 0, 0, 0.4);`);

// cssRules.set('--', `/* -- */
// `);
