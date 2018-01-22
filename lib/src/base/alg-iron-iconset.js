// @copyright @polymer\iron-iconset-svg\iron-iconset-svg.js
// @copyright 2017-2018 adalberto.lacruz@gmail.com

/**
 * Storage and management for icons
 */
class AlgIronIconset {
  /** Iconset by default @type {String} */
  static get defaultIconSet() { return 'icons'; }

  /**
   * iconset storage
   * @type {Map<String, Object>};
   */
  static get register() {
    return this._register || (this._register = new Map());
  }

  /**
   * Setup to load a base64 group.
   * use: AlgIronIconset.addIconsetBase64('iconset', 24).set('id', 'src.base64').set().set()...
   * @param {String} iconsetName
   * @param {Number} size
   * @return {Map}
   */
  static addIconsetBase64(iconsetName, size) {
    const type = 'base64';
    return this._getIconset(iconsetName, type, size).data;
  }

  // TODO: addIconsetMosaic
  /**
   * Load a svg icon group
   * @param {String} iconsetName ('icons', ...)
   * @param {Number} size (24)
   * @param {HTMLElement} definition (<div><svg><def> <g id><path>)
   */
  static addIconsetSvg(iconsetName, size, definition) {
    const type = 'svg';
    const data = this._getIconset(iconsetName, type, size).data;
    const iconGroup = /** @type {HTMLElement} */ (definition.firstChild.firstChild); // <defs><g><g>...

    for (let i = 0; i < iconGroup.childElementCount; i++) {
      const item = iconGroup.children[i];
      data.set(item.id, item);
    }
  }

  /**
   * Build an image element
   * @param {String} src
   * @return {HTMLImageElement}
   */
  static createImageElement(src) {
    const element = document.createElement('img');
    element.style.width = '100%';
    element.style.height = '100%';
    element.draggable = false;
    element.src = src;
    return element;
  }

  /**
   * Cretaes an Image element with the icon
   * @param {Object} data - {iconset, type, size, name, definition}
   * @return {HTMLImageElement}
   */
  static _getBase64Element(data) {
    return this.createImageElement(data.definition);
  }

  /**
   * Returns the icon definition
   * @param {String} name 'iconset:icon'
   * @return {Object} - {iconset, type, size, name, definition}
   */
  static _getIcon(name) {
    const values = name.split(':');
    if (values.length > 2) return null;

    const iconsetName = (values.length > 1 ? values[0] : this.defaultIconSet).trim();
    const iconName = values[values.length - 1].trim();

    const iconset = this._getIconset(iconsetName);
    const iconDefinition = iconset.data.get(iconName);
    if (iconDefinition == null) return null;

    return {
      iconset: iconsetName,
      type: iconset.type,
      size: iconset.size,
      name: iconName,
      definition: iconDefinition
    };
  }

  /**
   * Normal entry point to get an icon as an HTMLElement
   * @param {String} name 'iconset:icon'
   * @return {Element}
   */
  static getIconElement(name) {
    const iconDefinition = this._getIcon(name);
    if (iconDefinition == null) return null;

    if (iconDefinition.type === 'svg') return this._getSvgElement(iconDefinition);
    if (iconDefinition.type === 'base64') return this._getBase64Element(iconDefinition);
  }

  /**
   * Recover and create an iconset in the register if don't exist
   * @param {String} name
   * @param {String} type
   * @param {Number} size
   * @return {Object}
   */
  static _getIconset(name, type = 'svg', size = 24) {
    let iconset = this.register.get(name);
    if (iconset == null) {
      iconset = {
        'name': name,
        'type': type,
        'size': size,
        'data': new Map()
      };
      this.register.set(name, iconset);
    }
    return iconset;
  }

  /**
   * Creates an svg element with the icon
   * @param {Object} data - {iconset, type, size, name, definition}
   * @return {SVGElement}
   */
  static _getSvgElement(data) {
    const content = data.definition.cloneNode(true);
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const viewBox = `0 0 ${data.size} ${data.size}`;
    const cssText = 'pointer-events: none; display: block; width: 100%; height: 100%;';

    svg.setAttribute('viewBox', viewBox);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.setAttribute('focusable', 'false');
    svg.style.cssText = cssText;
    svg.appendChild(content).removeAttribute('id');

    return svg;
  }

  /**
   * returns the Array of iconsets in the registry
   * @return {Array<String>}
   */
  static listIconsets() {
    return Array.from(this.register.keys());
  }

  /**
   * For an iconset returns the array of icon names
   * @param {String} name
   * @return {Array<String>}
   */
  static listIconset(name) {
    const iconset = this.register.get(name);
    if (iconset == null) return null;
    return Array.from(iconset.data.keys());
  }
}

export { AlgIronIconset };
