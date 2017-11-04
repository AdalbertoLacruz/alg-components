// @copyright 2017 ALG
// @ts-check
import { Observable } from './observable.js';

/**
 * Observable Number
 *
 * @class
 */
class ObsNumber extends Observable {
  /**
   * add value to internal
   * @param  {Number} value {description}
   * @return {ObsNumber}
   */
  add(value) {
    this.update(this.value + value);
    return this;
  }
}
// TODO: assure value is number

export { ObsNumber };
