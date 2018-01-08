// @copyright 2017 ALG
// @ts-check
import { BinderElement } from './binder-element.js';
import * as css from '../util/css-style.js';

/**
 * Base class for AlgComponents
 * <p>
 * Process the templates to define ShadowElement with HTML and styles
 *
 * @type {class}
 */
class AlgComponent extends BinderElement {
  /**
   * Component standar role (ex: button). To @override.
   * @type {String}
   */
  get role() { return ''; }

  /**
   * The template style is dependent on css scope
   * @type {Boolean}
   */
  get styleCouldBeCustom() {
    return this.selfClass._styleCouldBeCustom || (this.selfClass._styleCouldBeCustom = false);
  }
  set styleCouldBeCustom(value) { this.selfClass._styleCouldBeCustom = value; }

  /**
   * The template style contains rules that depends of current css scope (--rule)
   * @type {Boolean}
   */
  get styleIsCustom() { return this._styleIsCustom || (this._styleIsCustom = false); }
  set styleIsCustom(value) { this._styleIsCustom = value; }

  /**
   * Build for the class (static) templateElement, templateStyle and templateIds.
   * To @override
   * @return {HTMLTemplateElement} The template Element to be cloned in the shadow creation
   */
  createTemplate() {
    let template = this.selfClass.templateElement = document.createElement('template');

    // Each component must fill innerHTML
    template.innerHTML = ``;

    // Each component must search for templateIds:
    // this.selfClass.templateIds = this.searchTemplateIds(template.innerHTML);
    this.selfClass.templateIds = [];
    return template;
  }

  /**
   * Build the basic static template for style
   * To @override
   * @return {HTMLTemplateElement} The template Element with style
   */
  createTemplateStyle() {
    let template = document.createElement('template');

    // Each component must fill innerHTML
    template.innerHTML = `
      <style>
      </style>
    `;

    return template;
  }

  //  ******************* end overrides **********************

  constructor() {
    super();
    // this.setHiden(true);
    this.createShadowElement();
  }

  /**
   * Called every time the element is inserted into the DOM
   * @override
   */
  connectedCallback() {
    // Apply Style
    this.insertStyle();

    super.connectedCallback();
    this.addStandardAttributes();
  }

  /**
   * Gate to static storage in the class. The class definition itselt
   */
  get selfClass() {
    return this._selfClass || (this._selfClass = window.customElements.get(this.localName));
  }

  /**
   * HTMLElement template for the component
   * @type {HTMLTemplateElement}
   */
  get template() {
    return this.selfClass.templateElement || this.createTemplate();
  }

  /**
   * id names in template = ["id1", ... "idn"], static bridge
   * @type {Array<String>}
   */
  get templateIds() {
    return this.selfClass.templateIds;
  }

  /** Template header info @type {Object} */
  get templateInfo() {
    return this._templateInfo || (this._templateInfo = (() => {
      const shadow = this.shadowRoot;
      return {
        header: {
          elements: shadow.childElementCount,
          total: shadow.childNodes.length
        }
      };
    })());
  }

  /**
   * HTMLElement teplate for <style></style> in the component
   * @type {HTMLTemplateElement}
   */
  get templateStyle() {
    return this.selfClass.templateStyle || (this.selfClass.templateStyle = this.createTemplateStyle());
  }

  /**
   * check for tabIndex, role, and add them if not defined
   */
  addStandardAttributes() {
    if (!this.hasAttribute('role') && this.role) {
      this.setAttribute('role', this.role);
    }
    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '0');
    }
  }

  /**
   * Recovers a css rule from the map or the css style.
   *
   * @param {String} id
   * @return {String}
   */
  apply(id) {
    if (this.selfClass.templateStyle) {
      // We are creating the custom style
      let rule = css.apply(this, id);
      if (rule) {
        this.styleIsCustom = true;
        rule = `/* ${id} */ ${rule} `;
      } else {
        rule = css.getRule(id);
      }
      return rule;
    } else {
      // We are creating static style
      this.styleCouldBeCustom = true;
      return css.getRule(id);
    }
  }

  /**
   * Uses handler(id, isDefault) to define a css variable --id
   *
   * @param {String} id
   * @param {Function} handler
   * @return {String}
   */
  applyCustomVariable(id, handler) {
    if (this.selfClass.templateStyle) {
      // We are creating the custom style
      this.styleIsCustom = true;
      return handler(id, false);
    } else {
      // We are creating static style
      this.styleCouldBeCustom = true;
      return handler(id, true);
    }
  }

  /**
   * Build the shadow element, and the reference to the id elements
   */
  createShadowElement() {
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(this.template.content.cloneNode(true));

    this.ids = this.templateIds.reduce((total, id) => {
      total[id] = this.shadowRoot.querySelector(`#${id}`);
      return total;
    }, {});
  }

  /**
   * Recovers a css rule from the map
   * @param {String} id
   * @return {String}
   */
  getRule(id) {
    return css.getRule(id);
  }

  /**
   * Build the style from the template and insert it in the shadowRoot
   */
  insertStyle() {
    let template = this.templateStyle; // update this.styleCouldBeCustom
    if (this.styleCouldBeCustom) {
      const custom = this.createTemplateStyle();
      if (this.styleIsCustom) {
        // Use the new style
        template = custom;
      }
    }
    this.shadowRoot.insertBefore(template.content.cloneNode(true), this.shadowRoot.firstChild);
  }

  /**
   * Recover shadowRoot to the original element template
   * Removes all childs except style and template
   */
  restoreTemplate() {
    const nodes = this.shadowRoot.childNodes;
    const headerLength = this.templateInfo.header.total;
    let len = nodes.length;
    while (len > headerLength) {
      this.shadowRoot.removeChild(this.shadowRoot.lastChild);
      len = nodes.length;
    }
  }

  /**
   * Search for id="..."
   *
   * @param  {String} html - template.innerHTML to search in
   * @return {Array<String>}  such as ['id1', ...'idn]
   */
  searchTemplateIds(html) {
    let result = [];
    let re = / id="([a-z]*)"/ig;

    let match = re.exec(html);
    while (match) {
      result.push(match[1]);
      match = re.exec(html);
    }
    return result;
  }
}

export { AlgComponent };
