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
  add(item, options = null) {
    if (options && options.unique) {
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
  addAll(items, options = null) {
    if (items == null) return this;
    if (options == null) return new List(this.concat(items));

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
   * Inserts item in the index position
   */
  insert(index, item) {
    this.splice(index, 0, item);
    return this;
  }

  /**
   * Merge two list, sorted by:
   *  (moveif(left, rigth) => left > right) descendent
   *  (moveif(left, rigth) => left < right) ascendent
   * @param {List} left
   * @param {List} right
   * @param {Function} moveif
   * @return {List}
   */
  _mergeStableSort(left, right, moveif) {
    const result = new List();

    while (left.isNotEmpty && right.isNotEmpty) {
      if (moveif(left.first, right.first)) {
        result.add(right.removeFirst());
      } else {
        result.add(left.removeFirst());
      }
    }
    return result.addAll(left).addAll(right);
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
   * Removes first item in the list and return it;
   * @return {*} item removed
   */
  removeFirst() {
    return this.shift();
  }

  /**
   * Returns a stable sorted list (keep original order at same sorted level. see a and c).
   * (a, 3) (b, 1) (c, 3) (d, 2) => (b, 1) (d, 2) (a, 3) (c, 3)
   * Array sort is not stable:
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
   * @param {Function} moveif compare(left, right) => left < right or left > rigth (true/false)
   * @return {List}
   */
  stableSort(moveif) {
    const len = this.length;
    if (len < 2) return this;

    const pivot = Math.ceil(len / 2);
    const left = this.sublist(0, pivot).stableSort(moveif);
    const right = this.sublist(pivot).stableSort(moveif);
    return this._mergeStableSort(left, right, moveif);
  }

  /**
   * Returns a list from start to end (exclusive). If end is ommited the length is used
   * @param {Number} start
   * @param {Number} end
   * @return {List}
   */
  sublist(start, end = null) {
    return (end != null) ? new List(this.slice(start, end)) : new List(this.slice(start));
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
