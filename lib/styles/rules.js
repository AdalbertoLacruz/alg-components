// @copyright 2017-2018 adalberto.lacruz@gmail.com

/**
 * css and stylesheets management
 */
export class Rules {
  //   /// group definitions done - see isDefined(group)
  //   static List < String > defined = <String>[];

  /**
   * rules/mixins storage
   * @type {Map<String, String>}
   */
  static get register() { return this._register || (this._register = new Map()); }

  /**
   * Recovers a css rule from the component style
   * Rules such as { rule1; rule2; } => rule1; rule2;
   * @param {HTMLElement} element
   * @param {String} id
   * @return {String}
   */
  static apply(element, id) {
    let rule = this.getComputedProperty(element, id);
    if (rule.startsWith('{')) { rule = rule.substring(1, rule.length - 1); }
    return rule;
  }

  /**
   * Define a css rule in the map
   * @param {String} id
   * @param {String} css
   */
  static define(id, css) {
    this.register.set(id, `/* ${id} */
    ${css} `);
  }

  /**
   * Define a css rule if not defined previously
   * @param {String} id
   * @param {String} css
   */
  static defineDefault(id, css) {
    if (!this.register.has(id)) this.define(id, css);
  }

  /**
   * Recovers a property value in the element computed style
   * @param {HTMLElement} element
   * @param {String} id
   * @return {String}
   */
  static getComputedProperty(element, id) {
    return getComputedStyle(element, null).getPropertyValue(id).trim();
  }

  //   ///
  //   /// Check if group is yet defined.
  //   ///
  //   static bool isDefined(String group) {
  //     if (defined.contains(group))
  //         return true;
  //     defined.add(group);
  // //    print('rules group added: $group');
  //     return false;
  //   }

  /**
   * Insert a style sheet into the dom
   * @param {String} id
   * @param {String} css
   */
  static sheet(id, css) {
    // check if id sheet exist
    if (document.head.querySelector(`#${id}`)) return;

    // Build it
    const _sheet = document.createElement('Style');
    _sheet.setAttribute('type', 'text/css');
    _sheet.setAttribute('id', id);
    _sheet.innerHTML = css;

    document.head.appendChild(_sheet);
  }

  /**
   * Recovers a css rule
   * @param {String} id
   * @return {String}
   */
  static use(id) {
    return this.register.get(id) || `/* ${id} */`;
  }
}

/**
 * A Rules Instance to use in components template styles.
 * Let know if the style changes when component is inserted in the dom.
 */
export class RulesInstance extends Rules {
  /**
   * @param {HTMLElement} element affected by css
   * @constructor
   */
  constructor(element = null) {
    super();
    this.element = element;

    /** No element supplied, but use of apply or calc */
    this.styleCouldBeCustom = false;

    /** element css is affected by dom position */
    this.styleIsCustom = false;
  }

  /**
   * Recovers a css rule [id] visible to the element.
   * If not element recovers a rule from the registry
   * @param {String} id
   * @return {String}
   */
  apply(id) {
    if (this.element) {
      let rule = Rules.apply(this.element, id);
      if (rule) {
        this.styleIsCustom = true;
        rule = `/* ${id} */ ${rule}`;
      } else {
        rule = Rules.use(id);
      }
      return rule;
    } else {
      this.styleCouldBeCustom = true;
      return Rules.use(id);
    }
  }

  /**
   * Use handler(id, isDefault) to define a css variable --id
   * @param {String} id
   * @param {Function} handler
   */
  calc(id, handler) {
    if (this.element) {
      this.styleIsCustom = true;
      return handler(id, { isDefault: false });
    } else {
      this.styleCouldBeCustom = true;
      return handler(id, { isDefault: true });
    }
  }

  /**
   * Recovers a css rule
   * @param {String} id
   * @return {String}
   */
  use(id) {
    return Rules.use(id);
  }
}
