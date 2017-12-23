// @copyright @polymer
// @copyright 2017 ALG
// @ts-check
// Auxiliary functions for HTML Handling

/**
 * Set or remove the attribute according to force.
 * If force is null, set the attribute if not exist and vice versa.
 *
 * options.type =
 *  null '-remove' => attribute=""
 *  'true-false'   => attribute="true", attribute="false"
 *  'true-remove'  => attribute="true"
 *
 * @param {*} element
 * @param {String} attrName
 * @param {Boolean} force
 * @param {Object} options
 */
export const attributeToggle = (element, attrName, force, options = {}) => {
  const type = options.type || '-remove';
  const types = type.split('-');
  const on = types[0].trim().toLowerCase();
  const off = types[1].trim().toLowerCase();
  const value = force != null ? force : !element.hasAttribute(attrName);
  const attrValue = element.getAttribute(attrName);

  if (value) {
    if (attrValue !== on) element.setAttribute(attrName, on);
  } else {
    if (off === 'remove') {
      if (element.hasAttribute(attrName)) element.removeAttribute(attrName);
    } else {
      if (attrValue !== off) element.setAttribute(attrName, off);
    }
  }
};

// export const reflectToAttribute = (element, attribute, options, value) => {
//   attributeToggle(element, attribute, value, options);
// };

/**
 * Helper for setting an element's CSS `transform` property
 * @param {HTMLElement} node node Element to apply the transform to.
 * @param {String} transformText Transform setting.
 */
export const transform = (node, transformText) => {
  node.style.webkitTransform = transformText;
  node.style.transform = transformText;
};

/**
 * Helper for setting an element's CSS `translate3d` property.
 * @param {HTMLElement} node Element to apply the transform to.
 * @param {Number | String} x X offset.
 * @param {Number | String} y Y offset.
 * @param {Number | String} z Z offset.
 */
export const translate3d = (node, x, y, z) => {
  transform(node, `translate3d(${x}, ${y}, ${z})`);
};
