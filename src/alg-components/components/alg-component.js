// @ts-check
import { BinderElement } from './binder-element.js';

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
   * @return {String}
   */
  get role() { return ''; }

  /**
   * Build for the class (static) templateElement, templateStyle and templateIds.
   * To @override
   * @return {HTMLTemplateElement} The template Element to be cloned in the shadow creation
   */
  createTemplate() {
    let template = this.selfClass.templateElement = document.createElement('template');

    // Each component must fill innerHTML
    template.innerHTML = `
    `;

    // Each component must search for templateIds:
    // this.selfClass.templateIds = this.searchTemplateIds(template.innerHTML);
    this.selfClass.templateIds = [];
    this.createTemplateStyle();
    return template;
  }

  /**
   * Build the basic static template for style
   * To @override
   * @return {HTMLTemplateElement} The template Element with style
   */
  createTemplateStyle() {
    let template = this.selfClass.templateStyle = document.createElement('template');

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
    this.shadowRoot.insertBefore(this.templateStyle.content.cloneNode(true), this.shadowRoot.firstChild);

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
   * @return {HTMLTemplateElement}
   */
  get template() {
    return this.selfClass.templateElement || this.createTemplate();
  }

  /**
   * id names in template = ["id1", ... "idn"], static bridge
   * @return {Array<String>}
   */
  get templateIds() {
    return this.selfClass.templateIds;
  }

  /**
   * HTMLElement teplate for <style></style> in the component
   * @return {HTMLTemplateElement}
   */
  get templateStyle() {
    return this.selfClass.templateStyle || this.createTemplateStyle();
  }

  /**
   * check for tabIndex, role, and add them if not defined
   */
  addStandardAttributes() {
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', this.role);
    }
    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '0');
    }
  }

  /**
   * Set or remove the attribute according to force.
   * If force is null, set the attribute if not exist and vice versa
   * @param {String} attrName
   * @param {Boolean} force
   */
  attributeToggle(attrName, force) {
    if (force !== null) {
      if (force) {
        this.setAttribute(attrName, '');
      } else {
        this.removeAttribute(attrName);
      }
    } else {
      if (this.hasAttribute(attrName)) {
        this.removeAttribute(attrName);
      } else {
        this.setAttribute(attrName, '');
      }
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
   * Search for id="..."
   *
   * @param  {String} html - template.innerHTML to search in
   * @return {Array<String>}  such as ['id1', ...'idn]
   */
  searchTemplateIds(html) {
    let result = [];
    let re = / id="([a-z]*)"/g;

    let match = re.exec(html);
    while (match) {
      result.push(match[1]);
      match = re.exec(html);
    }
    return result;
  }
}

export { AlgComponent };
