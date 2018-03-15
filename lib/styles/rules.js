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
   * Search for something like `--change-rule: @apply;`
   * in the head style rule and replaces it, until no more found.
   * NOTE: `@apply --change-rule;` would be better syntax, but css system remove it in cssRules.
   * For efficiency, the head sheets must have `apply` ATTRIBUTE to be processed.
   */
  static applySheet() {
    const re = /(--[\w-]+): @apply;/;
    let match;

    document.head.querySelectorAll('[apply]').forEach((/** @type {HTMLStyleElement} */ sheetDocument) => {
      const sheet = /** @type {CSSStyleSheet} */ (sheetDocument.sheet);
      const rules = sheet.cssRules;

      // @ts-ignore
      new Array(...rules).forEach((rule, i) => {
        let cssText = rule.cssText;
        do {
          match = re.exec(cssText);
          if (match) {
            const index = match.index;
            cssText = cssText.substr(0, index) + this.use(match[1]) + cssText.substr(index + match[0].length);
            this.cssRuleReplace(sheet, i, cssText);
          }
        } while (match);
      });
    });
  }

  /**
   * Replaces the cssText in a styleSheet rule
   * @param {CSSStyleSheet} sheet
   * @param {Number} index
   * @param {String} cssText
   */
  static cssRuleReplace(sheet, index, cssText) {
    sheet.deleteRule(index);
    sheet.insertRule(cssText, index);
  }

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
