// @copyright 2017 ALG
// @ts-check

// @ts-ignore
const cssRules = window.cssRules || (window.cssRules = new Map());

/**
 * Recovers a css rule from the component style
 * Rules such as { rule1; rule2; } => rule1; rule2;
 * @param {HTMLElement} element
 * @param {String} id
 * @return {String}
 */
export const apply = (element, id) => {
  let rule = getComputedStyle(element, null).getPropertyValue(id).trim();
  if (rule.startsWith('{')) rule = rule.substring(1, rule.length - 1);
  return rule;
};

/**
 * Recovers a property value in the element computed style
 * @param {HTMLElement} element
 * @param {String} id
 * @return {String}
 */
export const getComputedProperty = (element, id) =>
  getComputedStyle(element, null).getPropertyValue(id).trim();

/**
 * Recovers a css rule from the map
 * @param {String} id
 * @return {String}
 */
export const getRule = (id) => cssRules.get(id) || `/* ${id} */`;

/**
 * Define a css rule in the map
 * @param {String} id
 * @param {String} css
 */
export const setRule = (id, css) => {
  cssRules.set(id, `/* ${id} */
    ${css} `);
};

/**
 * Insert a style sheet into the dom
 * @param {String} id
 * @param {String} css
 */
export const style = (id, css) => {
  const templateStyle = document.createElement('Style');
  templateStyle.setAttribute('type', 'text/css');
  templateStyle.setAttribute('id', id);

  templateStyle.innerHTML = css;

  document.head.appendChild(templateStyle);
};
