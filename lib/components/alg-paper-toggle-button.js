// @copyright @polymer\paper-toggle-button\paper-toggle-button.js
// @copyright 2017-2018 adalberto.lacruz@gmail.com

import '../styles/color.js';
import '../styles/default-theme.js';
import * as FHtml from '../src/util/f-html.js';
import { mixinFactory } from '../src/util/mixins.js';
import { AlgGesturesMixin } from '../src/mixins/alg-gestures-mixin.js';
import { AlgPaperCheckedElementBehavior } from '../src/behaviors/alg-paper-checked-element-behavior.js';
// eslint-disable-next-line
import { RulesInstance } from '../styles/rules.js';

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
class AlgPaperToggleButton extends mixinFactory(AlgPaperCheckedElementBehavior, AlgGesturesMixin) {
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
        :host {
          display: inline-block;
          ${css.use('--layout-horizontal')}
          ${css.use('--layout-center')}
          ${css.use('--paper-font-common-base')}
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

          ${css.apply('--paper-toggle-button-unchecked-bar')}
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

          ${css.apply('--paper-toggle-button-unchecked-button')}
        }

        .toggle-button.dragging {
          -webkit-transition: none;
          transition: none;
        }

        :host([checked]:not([disabled])) .toggle-bar {
          opacity: 0.5;
          background-color: var(--paper-toggle-button-checked-bar-color, var(--primary-color));

          ${css.apply('--paper-toggle-button-checked-bar')}
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

          ${css.apply('--paper-toggle-button-checked-button')}
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

          ${css.apply('--paper-toggle-button-unchecked-ink')}
        }

        :host([checked]) .toggle-ink {
          color: var(--paper-toggle-button-checked-ink-color, var(--primary-color));

          ${css.apply('--paper-toggle-button-checked-ink')}
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

    return template;
  }

  /** @override */
  deferredConstructor() {
    super.deferredConstructor();

    const checked = this.attributeManager.get('checked');
    const active = this.attributeManager.get('active');

    this.eventManager
      .visibleTo('tap', ['trackStart', 'trackEnd'])
      .on('trackStart', (tEvent, context) => {
        tEvent.width = this.ids['toggleBar'].offsetWidth / 2;
        this.ids['toggleButton'].classList.add('dragging');
        tEvent.originalChecked = tEvent.trackChecked = checked.value;
        context._tap.disabled = true;
        changeMessage.delayed = true;
      }, { link: true })
      .on('trackMove', (tEvent, context) => {
        const dx = tEvent.posX;
        const x = Math.min(tEvent.width,
          Math.max(0, tEvent.originalChecked ? tEvent.width + dx : dx));
        FHtml.translate3d(this.ids['toggleButton'], x + 'px', 0, 0);
        tEvent.trackChecked = Boolean(x > (tEvent.width / 2));
        checked.update(tEvent.trackChecked);
      }, { link: true })
      .on('trackEnd', (tEvent, context) => {
        this.ids['toggleButton'].classList.remove('dragging');
        FHtml.transform(this.ids['toggleButton'], '');
        if (!tEvent.hasMovedX) tEvent.trackChecked = !tEvent.trackChecked; // toggle
        context._tap.disabled = false; // tap yet fired, no effect
        active.update(tEvent.trackChecked);
        changeMessage.delayed = false;
      }, { link: true });

    this.style['touch-action'] = 'pan-y';
    const changeMessage = this.messageManager.get('change');
  }

  /**
   * check for animated and add them if not defined
   */
  addStandardAttributes() {
    super.addStandardAttributes();
    if (!this.hasAttribute('aria-pressed')) this.setAttribute('aria-pressed', 'false');
  }

  // /**
  //  * Attributes managed by the component
  //  * @override
  //  * @type {Array<String>}
  //  */
  // static get observedAttributes() {
  //   return super.observedAttributes.concat(['on-click']);
  // }

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
