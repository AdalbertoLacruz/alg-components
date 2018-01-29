// @copyright @polymer\iron-selector\iron-selection.js
// @copyright 2017-2018 adalberto.lacruz@gmail.com

import { List } from './list.js';
import { valueByDefault } from '../util/misc.js';

/**
 * Manages the items in a selection.
 * Companion class for alg-iron-selectable-behavior
 *
 * @class
 */
class AlgIronSelection {
  // constructor() { }

  /**
   * If true, items can be deselected
   * @type {Boolean}
   */
  get allowEmptySelection() { return this._allowEmptySelection || false; }
  set allowEmptySelection(value) { this._allowEmptySelection = value; }

  /**
   * Attribute. If you want to use an attribute value or property of an element for
   * `selected` instead of the index, set this to the name of the attribute
   * or property.
   * @type {String}
   */
  get attrForSelected() { return this._attrForSelected; }
  set attrForSelected(value) { this._attrForSelected = value; }

  /**
   * Attribute. Default fallback if the selection based on selected with `attrForSelected` is not found.
   * @type {String}
   */
  get fallbackSelection() { return this._fallbackSelection; }
  set fallbackSelection(value) { this._fallbackSelection = value; }

  /**
   * Index for last selection in items.
   * @type {Number}
   */
  get indexLastSelected() { return this._indexLastSelected; }
  set indexLastSelected(index) { this._indexLastSelected = index; }

  /** item las selected */
  get itemLastSelected() { return this.items[valueByDefault(this.indexLastSelected, 0)]; }

  /**
   * Component Selectable Childs, these inside of <slot>...</slot>
   * @type {List} <HTMLElement>
   */
  get items() { return this._items || (this._items = new List()); }
  set items(value) {
    this._items = value;
    Promise.resolve().then(() => this._subscribeMutationObservers());
  }

  /**
   * Attribute. If true, multiple selections are allowed
   * @type {Boolean}
   */
  get multi() { return this._multi || false; }
  set multi(value) { this._multi = value; }

  /** Subscribe always the same handler to avoid duplicates responses. */
  get mutationHandlerBinded() { return this.mutationHandler.bind(this); }

  /** Defines the MutationObservers used to wath attribute modifications */
  get mutationObserver() {
    return this._mutationObserver || (this._mutationObserver = new MutationObserver(this.mutationHandlerBinded));
  }

  /**
   * items with modified attributes pending to process
   * @type {List}
   */
  get mutationQueue() { return this._mutationQueue || (this._mutationQueue = new List()); }

  /**
   * Attribute. Sets the selected element. Updated by attribute change
   * ex: selected="0" or selected="foo" or selected="2, 4"
   * @type {String}
   */
  get selected() { return this._selected || (this._selected = 0); }
  set selected(value) {
    this._selected = value;
    this._selectFromSelectedAttribute(value);
  }

  /**
   * The attribute to set on elements when selected. This is done in the calling class.
   * @type {String}
   */
  get selectedAttribute() { return this._selectedAttribute; }
  set selectedAttribute(value) { this._selectedAttribute = value; }

  /**
   * Selected items. Those items who agree with 'selected' index or modified by use
   * @type {List} <Element>
   */
  get selection() { return this._selection || (this._selection = new List()); }

  /**
   * Process the event (tap, ...) and resolve the item selected
   * @param {*} event
   */
  activateFromEvent(event) {
    if (event.captured && event.captured.length > 1) return; // processed elsewhere
    const items = this.items;

    let target = event.target;
    while (target && target !== this) {
      const index = items.indexOf(target);
      if (index > -1) {
        this.indexLastSelected = index;
        return this._select(target);
      }
      target = target.parentNode;
    }
  }

  /**
   * Clears all selection items except the ones indicated.
   * @param {List=} excludes items to be excluded.
   */
  _clearSelection(excludes) {
    this.selection.clone().forEach((item) => {
      if (!excludes || !excludes.contains(item)) {
        this._setItemSelectedState(item, false);
      }
    });
  }

  /**
   * Indicates if a given item is selected.
   * @param {Element} item The item whose selection state should be checked.
   * @return {Boolean} true if `item` is selected.
   */
  _isSelected(item) {
    return this.selection.contains(item);
  }

  /**
   * Add items with attribute modified for further processing
   * @param {Array<MutationRecord>} mutations
   */
  mutationHandler(mutations) {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes') this.mutationQueue.add(mutation.target, {unique: true});
    });
    Promise.resolve().then(() => this.processMutationQueue());
  }

  /**
   * Process the items with modified attributes
   */
  processMutationQueue() {
    const queue = this.mutationQueue;
    const selection = this.selection;
    if (queue.isEmpty) return;

    queue.clone().forEach((item, index, _queue) => {
      const hasAttribute = item.hasAttribute(this.selectedAttribute);
      if (selection.contains(item)) { // selected previously
        if (hasAttribute) {

        } else {
          this._setItemSelectedState(item, false, { isMutation: true });
        }
      } else {
        if (hasAttribute) {
          this._select(item, { isMutation: true});
          this.indexLastSelected = this.items.indexOf(item);
        } else {

        }
      }
      queue.remove(item);
    });
    this._updateFrozen();
  }

  /**
   * Defines Callback function, when selection changes
   * @param {Function} handler (HTMLElement item, Boolean isSelected,
   *  Object options = { isMutation: true/false/null})
   * @return {AlgIronSelection}
   */
  onSelect(handler) {
    this.selectCallback = handler;
    return this;
  }

  /**
   * Sets the selection state for a given item. If the `multi` property
   * is true, then the selected state of `item` will be toggled; otherwise
   * the `item` will be selected.
   * @param {Element} item - The item to select.
   * @param {Object} options = {isMutation - The selection comes from a MutationObserver}
   */
  _select(item, options = {}) {
    if (item && item.hasAttribute('disabled')) return;
    if (this.allowEmptySelection && this.selection.containsOnly(item)) item = null; // let deselect

    if (this.multi) {
      this._toggle(item, options);
    } else if (this.selection.first !== item) { // empty is null, ok
      this._setItemSelectedState(this.selection[0], false);
      this._setItemSelectedState(item, true, options);
    }
    this._updateFrozen();
  }

  /**
   * Search for items according to selected atrribute.
   * Used on select attribute change or items childs mutation observer
   * @param {String} selected
   */
  _selectFromSelectedAttribute(selected) {
    if (this.items.isEmpty) return;

    const _selected = this.stringToList(selected); // ['1', '2', 'foo']

    let items = this._valuesToItems(_selected); // [<div>...<div>]
    if (!items && this.attrForSelected && this.fallbackSelection) {
      items = this._valuesToItems(List.fromSingle(this.fallbackSelection));
    }

    if (this.multi) {
      if (items) items.forEach((item) => this._select(item));
    } else {
      if (items) {
        this._select(items.first);
      } else {
        this._clearSelection();
      }
    }
  }

  /**
   * Select next item, avoiding 'disabled'. Triggered from key (right, down)
   * @param {*} event
   */
  selectNext(event) {
    if (event && event.keyboardEvent) event.keyboardEvent.preventDefault();

    const length = this.items.length;
    const oldIndex = valueByDefault(this.indexLastSelected, -1);

    for (let i = 1; i < length + 1; i++) {
      const newIndex = (oldIndex + i) % length;
      const item = this.items[newIndex];
      if (!item.hasAttribute('disabled')) {
        this.indexLastSelected = newIndex;
        this._select(item);
        return;
      }
    }
  }

  /**
   * Select previous item, avoiding 'disabled'. Triggered from key (left, up)
   * @param {*} event
   */
  selectPrevious(event) {
    if (event && event.keyboardEvent) event.keyboardEvent.preventDefault();

    const length = this.items.length;
    let oldIndex = valueByDefault(this.indexLastSelected, 0);

    for (let i = 1; i < length + 1; i++) {
      const newIndex = (oldIndex - i + length) % length;
      const item = this.items[newIndex];
      if (!item.hasAttribute('disabled')) {
        this.indexLastSelected = newIndex;
        this._select(item);
        return;
      }
    }
  }

  /**
   * Sets the selection state for a given item to either selected or deselected.
   * @param {Element} item The item to select.
   * @param {Boolean} isSelected True for selected, false for deselected.
   * @param {Object} options {isMutation: true, The selection comes from a MutationObserver}
   */
  _setItemSelectedState(item, isSelected, options = {}) {
    if (item != null) {
      if (isSelected !== this._isSelected(item)) {
        // proceed to update selection only if requested state differs from current
        if (isSelected) {
          this.selection.add(item);
        } else {
          if (item.hasAttribute('frozen')) item.removeAttribute('frozen');
          this.selection.remove(item);
        }
      }
      if (this.selectCallback) this.selectCallback(item, isSelected, options);
    }
  }

  /**
   * Transform a str like '1, 2, 3' to ['1', '2', '3']
   * @param {String} str
   * @return {List}
   */
  stringToList(str) {
    return new List(str.split(',')).trim();
  }

  /**
   * Subscribe each element on items to a MutationObserver, if has selectedAttribute.
   * In this case the selection is done by the elememnt itself, changing the attribute.
   * If the handler is the same, the subscription could be done several times.
   */
  _subscribeMutationObservers() {
    if (!this.selectedAttribute) return;

    const options = {
      attributes: true,
      attributeFilter: [this.selectedAttribute]
    };

    const mutationObserver = this.mutationObserver;
    this.items.forEach((item) => {
      mutationObserver.observe(item, options);
    });
  }

  /**
   * Toggles the selection state for `item`.
   * @param {Element} item The item to toggle.
   * @param {Object} options = {isMutation - The selection comes from a MutationObserver}
   */
  _toggle(item, options = {}) {
    if (!this.allowEmptySelection && this.selection.containsOnly(item)) return;
    this._setItemSelectedState(item, !this._isSelected(item), options);
  }

  /**
   * In alg components the frozen attribute avoid modify the active/checked state.
   * frozen is set on components to !allow-empty-selection
   */
  _updateFrozen() {
    if (this.allowEmptySelection || !this.selectedAttribute || this.selection.isEmpty) return;

    if (this.selection.length > 1) {
      this.selection.forEach((item) => item.removeAttribute('frozen'));
    } else {
      this.selection.first.setAttribute('frozen', '');
    }
  }

  /**
   * Get the items that match with values
   * @param {List} values ['1', '2', 'foo']
   * @return {List} <Element> [<div>, <div>] or null if not found
   */
  _valuesToItems(values) {
    let indexList = values.reduce((indexList, value) =>
      indexList.addAll(this._valueToIndexes(value), {unique: true}), new List());

    if (indexList.isNotEmpty) {
      this.indexLastSelected = indexList.last;
      return indexList.map((index) => this.items[index]);
    }
    return null;
  }

  /**
   * Returns the array positions for items that match the value
   * @param {String} value '0', or 'foo'
   * @return {List} <Number>
   */
  _valueToIndexes(value) {
    if (this.attrForSelected) {
      return this.items.reduce((indexes, item, i) => {
        if (item.getAttribute(this.attrForSelected) === value) indexes.add(i);
        return indexes;
      }, new List());
    } else {
      return List.fromSingle(Number(value)); // '0'
    }
  }
};

export { AlgIronSelection };
