// @copyright @polymer\paper-toggle-button\paper-toggle-button.js
// @copyright 2017 ALG
// @ts-check

import '../styles/color.js';
import '../styles/default-theme.js';
import { mixinFactory } from '../util/mixins.js';
import { AlgGestures } from '../mixins/alg-gestures.js';
import { AlgPaperCheckedElementBehavior } from './alg-paper-checked-element-behavior.js';

/**
 * Provides a ON/OFF switch that user can toggle the state by tapping or by dragging the switch.
 *
 * property vars:
 * --paper-toggle-button-unchecked-bar-color
 * --paper-toggle-button-unchecked-button-color
 * --paper-toggle-button-checked-bar-color
 * --paper-toggle-button-checked-button-color
 * --paper-toggle-button-unchecked-ink-color
 * --paper-toggle-button-checked-ink-color
 * --paper-toggle-button-label-spacing
 * --paper-toggle-button-label-color
 * --paper-toggle-button-invalid-bar-color
 * --paper-toggle-button-invalid-button-color
 * --paper-toggle-button-invalid-ink-color
 *
 * Custom cssMixins:
 * --paper-toggle-button-unchecked-bar
 * --paper-toggle-button-unchecked-button
 * --paper-toggle-button-checked-bar
 * --paper-toggle-button-checked-button
 * --paper-toggle-button-unchecked-ink
 * --paper-toggle-button-checked-ink
 *
 * fire:
 *   change
 *
 * mousedown -> trackStart -> tap(disabled)
 * mousemove -> trackMove -> checked
 * mouseup -> trackEnd -> active 🔥change
 *                        tap(enabled)
 *
 * @class
 * @extends {AlgPaperCheckedElementBehavior}
 */
class AlgPaperToggleButton extends mixinFactory(AlgPaperCheckedElementBehavior, AlgGestures) {
  /**
   * Build the static template for style - static. this.apply let custom styles.
   * @override
   * @return {HTMLTemplateElement} The template Element with style
   */
  createTemplateStyle() {
    let template = super.createTemplateStyle();
    template.innerHTML = `
      <style>
        :host {
          display: inline-block;
          ${this.getRule('--layout-horizontal')}
          ${this.getRule('--layout-center')}
          ${this.getRule('--paper-font-common-base')}
        }

        :host([disabled]) {
          pointer-events: none;
        }

        :host(:focus) {
          outline:none;
        }

        .toggle-bar {
          position: absolute;
          height: 100%;
          width: 100%;
          border-radius: 8px;
          pointer-events: none;
          opacity: 0.4;
          transition: background-color linear .08s;
          background-color: var(--paper-toggle-button-unchecked-bar-color, #000000);

          ${this.apply('--paper-toggle-button-unchecked-bar')}
        }

        .toggle-button {
          position: absolute;
          top: -3px;
          left: 0;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.6);
          transition: -webkit-transform linear .08s, background-color linear .08s;
          transition: transform linear .08s, background-color linear .08s;
          will-change: transform;
          background-color: var(--paper-toggle-button-unchecked-button-color, var(--paper-grey-50));

          ${this.apply('--paper-toggle-button-unchecked-button')}
        }

        .toggle-button.dragging {
          -webkit-transition: none;
          transition: none;
        }

        :host([checked]:not([disabled])) .toggle-bar {
          opacity: 0.5;
          background-color: var(--paper-toggle-button-checked-bar-color, var(--primary-color));

          ${this.apply('--paper-toggle-button-checked-bar')}
        }

        :host([disabled]) .toggle-bar {
          background-color: #000;
          opacity: 0.12;
        }

        :host([checked]) .toggle-button {
          -webkit-transform: translate(16px, 0);
          transform: translate(16px, 0);
        }

        :host([checked]:not([disabled])) .toggle-button {
          background-color: var(--paper-toggle-button-checked-button-color, var(--primary-color));

          ${this.apply('--paper-toggle-button-checked-button')}
        }

        :host([disabled]) .toggle-button {
          background-color: #bdbdbd;
          opacity: 1;
        }

        .toggle-ink {
          position: absolute;
          top: -14px;
          left: -14px;
          right: auto;
          bottom: auto;
          width: 48px;
          height: 48px;
          opacity: 0.5;
          pointer-events: none;
          color: var(--paper-toggle-button-unchecked-ink-color, var(--primary-text-color));

          ${this.apply('--paper-toggle-button-unchecked-ink')}
        }

        :host([checked]) .toggle-ink {
          color: var(--paper-toggle-button-checked-ink-color, var(--primary-color));

          ${this.apply('--paper-toggle-button-checked-ink')}
        }

        .toggle-container {
          display: inline-block;
          position: relative;
          width: 36px;
          height: 14px;
          /* The toggle button has an absolute position of -3px; The extra 1px
          /* accounts for the toggle button shadow box. */
          margin: 4px 1px;
        }

        .toggle-label {
          position: relative;
          display: inline-block;
          vertical-align: middle;
          padding-left: var(--paper-toggle-button-label-spacing, 8px);
          pointer-events: none;
          color: var(--paper-toggle-button-label-color, var(--primary-text-color));
        }

        /* invalid state */
        :host([invalid]) .toggle-bar {
          background-color: var(--paper-toggle-button-invalid-bar-color, var(--error-color));
        }

        :host([invalid]) .toggle-button {
          background-color: var(--paper-toggle-button-invalid-button-color, var(--error-color));
        }

        :host([invalid]) .toggle-ink {
          color: var(--paper-toggle-button-invalid-ink-color, var(--error-color));
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
    template.innerHTML = `
      <div class="toggle-container">
        <div id="toggleBar" class="toggle-bar"></div>
        <div id="toggleButton" class="toggle-button"></div>
      </div>

      <div class="toggle-label"><slot></slot></div>
    `;
    this.selfClass.templateIds = this.searchTemplateIds(template.innerHTML);

    return template;
  }

  // constructor

  /**
   * check for animated and add them if not defined
   */
  addStandardAttributes() {
    super.addStandardAttributes();
    if (!this.hasAttribute('aria-pressed')) this.setAttribute('aria-pressed', 'false');
  }

  /**
   * Attributes managed by the component
   * @override
   * @type {Array<String>}
   */
  static get observedAttributes() {
    return super.observedAttributes.concat(['on-click']);
  }

  constructor() {
    super();

    this.eventManager
      .visibleTo('checked', ['trackStart', 'trackMove'])
      .visibleTo('active', ['trackEnd'])
      .visibleTo('tap', ['trackStart', 'trackEnd'])
      .on('trackStart', (tEvent, raw, context) => {
        tEvent.width = this.ids['toggleBar'].offsetWidth / 2;
        this.ids['toggleButton'].classList.add('dragging');
        tEvent.trackChecked = context._checked.value;
        context._tap.disabled = true;
        // this.fireDisabled = true;
      })
      .on('trackMove', (tEvent, raw, context) => {
        const dx = tEvent.posX;
        const x = Math.min(tEvent.width,
          Math.max(0, tEvent.trackChecked ? tEvent.width + dx : dx));
        this.translate3d(x + 'px', 0, 0, this.ids['toggleButton']);
        tEvent.trackChecked = Boolean(x > (tEvent.width / 2));
        context._checked.update(tEvent.trackChecked);
      })
      .on('trackEnd', (tEvent, raw, context) => {
        this.ids['toggleButton'].classList.remove('dragging');
        this.transform('', this.ids['toggleButton']);
        if (!tEvent.hasMoved) tEvent.trackChecked = !tEvent.trackChecked; // toggle
        // this.fireDisabled = false;
        context._active.update(tEvent.trackChecked);
        context._tap.disabled = false; // tap yet fired, no effect
      });

    this.style['touch-action'] = 'pan-y';
  }

  _createRipple() {
    this.rippleContainer = this.ids['toggleButton'];
    // @ts-ignore
    const ripple = super._createRipple();
    ripple.id = 'ink';
    ripple.setAttribute('recenters', '');
    ripple.classList.add('circle', 'toggle-ink');
    return ripple;
  }
}

window.customElements.define('alg-paper-toggle-button', AlgPaperToggleButton);

export { AlgPaperToggleButton };
