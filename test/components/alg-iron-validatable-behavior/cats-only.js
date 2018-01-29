// @copyright @polymer\iron-validatable-behavior\demo\cats-only.js
// @copyright 2017-2018 adalberto.lacruz@gmail.com

import { ValidatorManager } from '../../../lib/src/types/validator-manager.js';

// validate(values)
ValidatorManager.define('cats-only', (values) => {
  if (typeof values === 'object') {
    return validateObject(values);
  } else {
    const value = Array.isArray(values) ? values.join('') : values;
    return value.match(/^(c|ca|cat|cats)?$/) !== null;
  }
});

function validateObject(obj) {
  let valid = true;
  for (let key in obj) {
    if (obj[key] !== 'cats') {
      valid = false;
      break;
    }
  }
  return valid;
}
