// @ts-check
import { Observable } from './observable.js';

/**
 * Observable Number
 *
 * @class
 */
class ObsBoolean extends Observable {
  /**
   * Set attribute in a value change
   * @param {*} item - Element to set attribute
   */
  onChangeReflectToAttribute(item) {
    this.observe((value) => {
      item.attributeToggle(this.name, value);
    });
    return this;
  }

  /**
   * If value is true, set to false and vice versa
   */
  toggle() {
    this.update(!this.value);
  }
}
// TODO: assure value is boolean

export { ObsBoolean };
