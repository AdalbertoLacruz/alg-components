// @copyright @polymer\iron-overlay-behavior\iron-overlay-backdrop.js
// @copyright 2017 ALG

import { AlgPaperComponent } from '../paper/alg-paper-component.js';
import { ObservableEvent } from '../types/observable-event.js';

class AlgIronOverlayBackdrop extends AlgPaperComponent {
  /**
   * Build the static template for style
   * @override
   * @return {HTMLTemplateElement} The template Element with style
   */
  createTemplateStyle() {
    let template = super.createTemplateStyle();
    template.innerHTML = `
      <style>
        :host {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: var(--iron-overlay-backdrop-background-color, #000);
          opacity: 0;
          transition: opacity 0.2s;
          pointer-events: none;
          ${this.apply('--iron-overlay-backdrop')}
        }

        :host(.opened) {
          opacity: var(--iron-overlay-backdrop-opacity, 0.6);
          pointer-events: auto;
          ${this.apply('--iron-overlay-backdrop-opened')}
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
      <slot></slot>
    `;
    this.selfClass.templateIds = this.searchTemplateIds(template.innerHTML);

    return template;
  }

  constructor() {
    super();

    this.__openedRaf = null;
    this.eventManager
      .on('transitionend', (event) => {
        if (event && event.target === this) {
          this.complete();
        }
      })
      .subscribe();
  }

  connectedCallback() {
    super.connectedCallback();

    this.opened.value && this._openedChanged(this.opened.value);
  }

  /**
   * Attributes managed by the component
   * @override
   * @type {Array<String>}
   */
  static get observedAttributes() {
    return super.observedAttributes.concat(['opened']);
  }

  /**
   * @type {ObservableEvent}
   */
  get opened() {
    return this._opened || (this._opened = new ObservableEvent('opened').setType('boolean')
      .onChangeReflectToAttribute(this)
      .observe((opened) => { this._openedChanged(opened); })
    );
  }

  // Used to cancel previous requestAnimationFrame calls when opened changes.
  // __openedRaf - requestAnimationFrame ID

  /**
   * Toggles attribute change
   * @param {String} attrName - Attribute Name
   * @param {String} value
   */
  bindedOpened(attrName, value) {
    if (this.bindedAttributeSuper(attrName, value)) return;

    this.opened.update(this.toBoolean(value));
  }

  /**
   * Hides the backdrop.
   */
  close() {
    this.opened.update(false);
  }

  /**
   * Removes the backdrop from document body if needed.
   */
  complete() {
    if (!this.opened.value && this.parentNode === document.body) {
      this.parentNode.removeChild(this);
    }
  }

  /**
   * Shows the backdrop.
   */
  open() {
    this.opened.update(true);
  }

  /**
   *
   * @param {Boolean} opened
   */
  _openedChanged(opened) {
    if (opened) {
      // Auto-attach.
      this.prepare();
    } else {
      // Animation might be disabled via the mixin or opacity custom property.
      // If it is disabled in other ways, it's up to the user to call complete.
      const cs = window.getComputedStyle(this);
      if (cs.transitionDuration === '0s' || cs.opacity === '0') {
        this.complete();
      }
    }

    if (!this.loaded) return;

    // Always cancel previous requestAnimationFrame.
    if (this.__openedRaf) {
      window.cancelAnimationFrame(this.__openedRaf);
      this.__openedRaf = null;
    }

    // Force relayout to ensure proper transitions.
    this.scrollTop = this.scrollTop;
    this.__openedRaf = window.requestAnimationFrame(() => {
      this.__openedRaf = null;
      this.classList.toggle('opened', this.opened.value);
    });
  }

  /**
   * Appends the backdrop to document body if needed.
   */
  prepare() {
    if (this.opened.value && !this.parentNode) {
      document.body.appendChild(this);
    }
  }
}

window.customElements.define('alg-iron-overlay-backdrop', AlgIronOverlayBackdrop);

export { AlgIronOverlayBackdrop };
