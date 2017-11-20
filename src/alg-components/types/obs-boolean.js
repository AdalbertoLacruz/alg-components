// @copyright 2017 ALG
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
   * @param {String} attrName - attribute to set
   */
  onChangeReflectToAttribute(item, attrName = null) {
    if (attrName == null) attrName = this.name;
    this.observe((value) => {
      item.attributeToggle(attrName, value);
    });
    if (this.value != null) item.attributeToggle(attrName, this.value);
    return this;
  }

  /**
   * Set class in a value change
   * @param {*} item
   * @param {String} className
   */
  onChangeReflectToClass(item, className) {
    this.observe((value) => {
      item.classList.toggle(className, value);
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
