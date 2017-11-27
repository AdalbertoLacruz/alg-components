// @copyright 2017 ALG
// @ts-check
// String handling functions

/**
 * Converts 'str' to 'Str'
 * @param {String} str
 * @return {String}
 */
export const capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.substring(1);

/**
 * Replace (str) in a dash string (str1-str2-str3) in the position (1) returning (str1-str-str3)
 * @param {String} dash
 * @param {String} replace
 * @param {Number} position
 * @return {String}
 */
export const dashReplace = (dash, replace, position) => {
  const values = dash.split('-');
  if (position < 0 || position > values.length - 1) return dash;
  values[position] = replace;
  return values.join('-');
};

/**
 * Converts a dash string (str1-str2-str3) to camel (str1Str2Str3)
 * @param {String} dash
 * @return {String}
 */
export const dashToCamelString = (dash) =>
  dash.split('-').reduce((acc, value) => acc + capitalizeFirst(value));

/**
 * converts str1-str2-str3 to str1Str2Str3
 * @param {String} dash
 * @return {Array<String>}
 */
export const dashToCamelList = (dash) =>
  dash.split('-').reduce((results, value, i) => {
    results.push((i === 0) ? value : results[i - 1] + capitalizeFirst(value));
    return results;
  }, []);
