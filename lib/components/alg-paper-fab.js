// @copyright @polymer\paper-fab\paper-fab.js
// @copyright 2017-2018 adalberto.lacruz@gmail.com

import '../styles/default-theme.js';
import * as FHtml from '../src/util/f-html.js';
import { AlgIronIcon } from './alg-iron-icon.js';
import { AlgPaperButtonBehavior } from '../src/behaviors/alg-paper-button-behavior.js';
// eslint-disable-next-line
import { RulesInstance } from '../styles/rules.js';

/**
 * Similar to alg-paper-button, except raised.
 * supports: icon, src, label, mini (only affects css)
 *
 * @class
 */
class AlgPaperFab extends AlgPaperButtonBehavior {
  /**
   * Build the static template for style - static. css.apply let custom styles.
   * @override
   * @param {RulesInstance} css
   * @return {HTMLTemplateElement} The template Element with style
   */
  createTemplateStyle(css) {
    let template = super.createTemplateStyle(css);
    template.innerHTML = `
      <style>
        ${css.use('paper-material-styles')}
        :host {
          ${css.use('--layout-vertical')}
          ${css.use('--layout-center-center')}

          background: var(--paper-fab-background, var(--accent-color));
          border-radius: 50%;
          box-sizing: border-box;
          color: var(--text-primary-color);
          cursor: pointer;
          height: 56px;
          min-width: 0;
          outline: none;
          padding: 14px;
          position: relative;
          -moz-user-select: none;
          -ms-user-select: none;
          -webkit-user-select: none;
          user-select: none;
          width: 56px;
          z-index: 0;

          /* NOTE: Both values are needed, since some phones require the value \`transparent\`. */
          -webkit-tap-highlight-color: rgba(0,0,0,0);
          -webkit-tap-highlight-color: transparent;

          ${css.apply('--paper-fab')}
        }

        [hidden] {
          display: none !important;
        }

        :host([mini]) {
          width: 40px;
          height: 40px;
          padding: 8px;

          ${css.apply('--paper-fab-mini')}
        }

        :host([disabled]) {
          color: var(--paper-fab-disabled-text, var(--paper-grey-500));
          background: var(--paper-fab-disabled-background, var(--paper-grey-300));

          ${css.apply('--paper-fab-disabled')}
        }

        alg-iron-icon {
          ${css.apply('--paper-fab-iron-icon')}
        }

        span {
          width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          text-align: center;

          ${css.apply('--paper-fab-label')}
        }

        :host(.keyboard-focus) {
          background: var(--paper-fab-keyboard-focus-background, var(--paper-pink-900));
        }

        :host([elevation="1"]) {
          ${css.use('--paper-material-elevation-1')}
        }

        :host([elevation="2"]) {
          ${css.use('--paper-material-elevation-2')}
        }

        :host([elevation="3"]) {
          ${css.use('--paper-material-elevation-3')}
        }

        :host([elevation="4"]) {
          ${css.use('--paper-material-elevation-4')}
        }

        :host([elevation="5"]) {
          ${css.use('--paper-material-elevation-5')}
        }
      </style>
    `;
    return template;
  }

  /**
   * Build for the class (static) templateElement, templateStyle and templateIds.
   * @override
   * @return {HTMLTemplateElement} The template Element to be cloned in the shadow creation
   */
  createTemplate() {
    let template = super.createTemplate();

    // <alg-iron-icon id="icon" -hidden- -src- -icon-></algiron-icon>
    // <span id="span" -hidden- > -label-</span>
    template.innerHTML = `
      <alg-iron-icon id="icon" hidden></alg-iron-icon>
      <span id="span" hidden></span>
    `;

    return template;
  }

  /** @override */
  deferredConstructor() {
    super.deferredConstructor();

    // Minimize _computeIsIconFab execution
    this.iconFabCounter = 0;

    this.attributeManager
      .define('aria-label', 'string')
      .reflect()

      // Specifies the icon name or index in the set of icons available in
      // the icon's icon set. If the icon property is specified,
      // the src property should not be.
      .define('icon', 'string')
      .onLink(() => { this.iconFabCounter++; })
      .on((value) => {
        this.ids['icon'].setAttribute('icon', value);
        this._computeIsIconFab();
      })

      // The label displayed in the badge. The label is centered, and ideally
      // should have very few characters.
      .define('label', 'string')
      .onChangeModify('aria-label')
      .onLink(() => { this.iconFabCounter++; })
      .on((value) => {
        this.ids['span'].innerHTML = value;
        this._computeIsIconFab();
      })

      // The URL of an image for the icon. If the src property is specified,
      // the icon property should not be.
      .define('src', 'string')
      .onLink(() => { this.iconFabCounter++; })
      .on((value) => {
        this.ids['icon'].setAttribute('src', value);
        this._computeIsIconFab();
      });
  }

  /**
   * Attributes managed by the component
   * @override
   * @type {Array<String>}
   */
  static get observedAttributes() {
    return super.observedAttributes.concat(['icon', 'label', 'src']); // & mini
  }

  _computeIsIconFab() {
    if (--this.iconFabCounter > 0) return;
    const spanHiden = Boolean(
      this.attributeManager.getValue('icon') ||
      this.attributeManager.getValue('src')
    );

    FHtml.attributeToggle(this.ids['span'], 'hidden', spanHiden);
    FHtml.attributeToggle(this.ids['icon'], 'hidden', !spanHiden);
  }
}

window.customElements.define('alg-paper-fab', AlgPaperFab);

export { AlgPaperFab };
