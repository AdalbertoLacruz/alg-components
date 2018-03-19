// @copyright @polymer\iron-resizable-behavior\demo\src\x-app.js
// @copyright 2017-2018 adalberto.lacruz@gmail.com

import { AlgIronResizableMixin } from '../../../lib/src/mixins/alg-iron-resizable-mixin.js';
import { AlgComponent } from '../../../lib/src/base/alg-component.js';
import { translate3d } from '../../../lib/src/util/f-html.js';
import { mixinFactory } from '../../../lib/src/util/mixins.js';
// eslint-disable-next-line
import { RulesInstance } from '../../../lib/styles/rules.js';

/**
 * @extends { AlgComponent}
 * @class
 */
class XPuck extends mixinFactory(AlgComponent, AlgIronResizableMixin) {
  /**
   * Build the static template for style - static. this.apply let custom styles.
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
          border: 3px solid lightblue;
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
      <b>I'm a resize-aware, thirdifying puck at (<span id="x"></span> x <span id ="y"></span>).</b>
    `;

    return template;
  }

  /** @override */
  deferredConstructor() {
    super.deferredConstructor();

    this.attributeManager
      .define('x', 'number')
      .on((value) => { this.ids['x'].innerHTML = value.toString(); })
      .defaultValue(0)

      .define('y', 'number')
      .on((value) => { this.ids['y'].innerHTML = value.toString(); })
      .defaultValue(0);

    this.eventManager
      .on('resize', () => {
        const x = Math.floor(this.parent.offsetWidth / 3);
        const y = Math.floor(this.parent.offsetHeight / 3);

        this.attributeManager
          .change('x', x)
          .change('y', y);

        translate3d(this, x + 'px', y + 'px', 0);
        // this.resizableImpl._requestResizeNotifications();
      });
  }

  connectedCallback() {
    super.connectedCallback();

    // @ts-ignore
    this.notifyResize();
  }

  /**
   * @type {HTMLElement}
   */
  get parent() {
    if (this.parentNode.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
      return /** @type {ShadowRoot} */ (this.parentNode).host;
    }

    return this.parentNode;
  }
}

window.customElements.define('x-puck', XPuck);

/**
 * @extends { AlgComponent}
 * @class
 */
class XApp extends mixinFactory(AlgComponent, AlgIronResizableMixin) {
  /**
   * Build the static template for style - static. this.apply let custom styles.
   * @override
   * @param {RulesInstance} css
   * @return {HTMLTemplateElement} The template Element with style
   */
  createTemplateStyle(css) {
    let template = super.createTemplateStyle(css);
    template.innerHTML = `
      <style>
        :host {
          display: block;
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
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
      <x-puck></x-puck>
    `;

    return template;
  }
}

window.customElements.define('x-app', XApp);

export { XApp };
