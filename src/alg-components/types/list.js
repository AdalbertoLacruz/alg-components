// @copyright 2017 ALG
// @ts-check

/**
 * Extends array class
 * @extends Array
 * @class
 */
export class List extends Array {
  /**
   * @param {*} array - array like object
   */
  constructor(array = null) {
    super();
    if (array != null) {
      for (let i = 0; i < array.length; i++) this.push(array[i]);
    }
  }

  /**
   * Constructor from a single item.
   * Ex. const list = List.fromSingle('a');
   * @param {*} item
   */
  static fromSingle(item) {
    return new List().add(item);
  }

  /** Returns the first element in the list. If empty, return null */
  get first() { return this[0]; }

  /** True if the list has not elements */
  get isEmpty() { return this.length < 1; }

  /** True if the list contains elements */
  get isNotEmpty() { return this.length > 0; }

  /** Returns the last element in the list. If empty, return null */
  get last() { return this[this.length - 1]; }

  /** True if the list has only one element */
  get single() { return this.length === 1; }

  /**
   * push an item at the end of the list. Could be null.
   * options = {unique: true}
   * @param {*} item
   * @param {Object} options
   */
  add(item, options = {}) {
    if (options.unique) {
      if (!this.contains(item)) this.push(item);
    } else {
      this.push(item);
    }
    return this;
  }

  /**
   * All all the items at the end of the list.
   * options = {unique: true}
   * @param {*} items
   * @param {Object} options
   */
  addAll(items, options) {
    if (items == null) return this;
    for (let i = 0; i < items.length; i++) {
      this.add(items[i], options);
    }
    return this;
  }

  /**
   * Returns a list new copy
   */
  clone() {
    return this.slice();
  }

  /**
   * True if item is in the list
   * @param {*} item
   * @return {Boolean}
   */
  contains(item) {
    return this.indexOf(item) > -1;
  }

  /**
   * True if item is the only element in the list
   * @param {*} item
   */
  containsOnly(item) {
    return (this.length === 1) &&
      this.indexOf(item) > -1;
  }

  /**
   * Removes the first occurrend of item in the list
   * @param {*} item
   */
  remove(item) {
    if (this.isEmpty) return this;
    const i = this.indexOf(item);
    if (i > -1) this.splice(i, 1);
    return this;
  }

  /**
   * Removes the item in the index position
   * @param {Number} index
   */
  removeAt(index) {
    if (index < 0 || index > this.length - 1) return this;
    this.splice(index, 1);
    return this;
  }

  /**
   * Remove spaces left and right for string elements.
   * If one element is not string throws an error.
   */
  trim() {
    for (let i = 0; i < this.length; i++) {
      this[i] = this[i].trim();
    }
    return this;
  }
};
