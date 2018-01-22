// @copyright @polymer\iron-selector\iron-selectable.js
// @copyright @polymer\iron-selector\iron-multi-selectable.js
// @copyright 2017-2018 adalberto.lacruz@gmail.com

import { AlgIronSelection } from '../types/alg-iron-selection.js';
import { AlgPaperComponent } from '../base/alg-paper-component.js';
import * as FHtml from '../util/f-html.js';
import { List } from '../types/list.js';

/**
 * Component with childs selectables
 *
 * Attribute:
 *  activate-event - Event that triggers selection (tap, space, enter, up, left, down, rigth)
 *  attr-for-selected - Attribute to set on elements when selected.
 *  fallback-selection - Attribute used to select if selected-attribute fails
 *  selectable - css selector to build the list of items selectables
 *  selected - Sets the selected element. The default is to use the index of the item. Ex. "1, 2, foo"
 *  selected-attribute - The attribute to set on elements when selected.
 *  selected-class - The class to set on elements when selected (iron-selected by default).
 *
 * Fire: change - when a item is selected or deselected
 *
 * @class
 */
class AlgIronSelectableBehavior extends AlgPaperComponent {
  constructor() {
    super();

    this.fireHandlers.add('change'); // fire with selected

    // selectable attribute load items by itself
    if (!this.getAttribute('selectable')) this.updateItems();

    this.eventManager
      .on('focus', (e) => {
        this.ironSelection.itemLastSelected.focus();
      })
      .subscribe();
  }

  /**
   * Attributes managed by the component
   * @override
   * @type {Array<String>}
   */
  static get observedAttributes() {
    return super.observedAttributes.concat(['allow-empty-selection', 'activate-event',
      'attr-for-selected', 'fallback-selection', 'multi', 'on-change', 'selectable',
      'selected', 'selected-attribute', 'selected-class']);
  }

  connectedCallback() {
    super.connectedCallback();
    this.subscribeToEvents(); // EventManager definitions
    this._subscribeMutationObserver();
  }

  /**
   * The event that fires from items when they are selected.
   * @type {Array<String>}
   */
  get activateEvent() { return this._activateEvent; }
  set activateEvent(eventList) { this._activateEvent = eventList; };

  /**
   * Manages the selection items
   * options = {
   *  isMutation = true, The selection comes from a MutationObserver
   * }
   * @type {AlgIronSelection}
   */
  get ironSelection() {
    return this._ironSelection || (this._ironSelection = new AlgIronSelection()
      .onSelect((item, isSelected, options = {}) => {
        // if (item.hasAttribute('disabled')) return;

        if (this.selectedClass) {
          item.classList.toggle(this.selectedClass, isSelected);
        }

        if (!options.isMutation && this.selectedAttribute) {
          FHtml.attributeToggle(item, this.selectedAttribute, isSelected);
        }

        if (isSelected) {
          item.focus();
        } else {
          item.blur();
        }

        this.fire('change', { select: isSelected, item: item });
      })
    );
  }

  /**
   * This is a CSS selector string.  If this is set, only items that match the CSS selector
   * are selectable.
   * @type {String}
   */
  get selectable() { return this._selectable; }
  set selectable(cssSelector) {
    this._selectable = cssSelector;
    this.updateItems();
  }

  /**
   * The attribute to set on elements when selected.
   * @type {String}
   */
  get selectedAttribute() { return this._selectedAttribute; }
  set selectedAttribute(newAttribute) {
    const oldAttribute = this._selectedAttribute;
    this._selectedAttribute = newAttribute;
    // If we have a selection, update
    this.ironSelection.selection.forEach((item) => {
      if (oldAttribute) FHtml.attributeToggle(item, oldAttribute, false);
      if (newAttribute) FHtml.attributeToggle(item, newAttribute, true);
    });
    this.ironSelection.selectedAttribute = newAttribute;
  }

  /**
   * The class to set on elements when selected.
   * @type {String}
   */
  get selectedClass() { return this._selectedClass || (this._selectedClass = 'iron-selected'); }
  set selectedClass(newClass) {
    const oldClass = this._selectedClass;
    this._selectedClass = newClass;
    // If we have a selection, update
    this.ironSelection.selection.forEach((item) => {
      if (oldClass) item.classList.toggle(oldClass, false);
      if (newClass) item.classList.toggle(newClass, true);
    });
  }

  /**
   * If true, items can be deselected
   * @param {String} attrName - Attribute Name
   * @param {String} value
   */
  bindedAllowEmptySelection(attrName, value) {
    if (this.bindedAttributeSuper(attrName, value)) return;
    this.ironSelection.allowEmptySelection = this.toBoolean(value);
  }

  /**
   * If you want to use an attribute value or property of an element for
   * `selected` instead of the index, set this to the name of the attribute
   * or property.
   * @param {String} attrName - Attribute Name
   * @param {String} value
   */
  bindedAttrForSelected(attrName, value) {
    if (this.bindedAttributeSuper(attrName, value)) return;
    this.ironSelection.attrForSelected = value;
  }

  /**
   * The event that fires from items when they are selected. Selectable
   * will listen for this event from items and update the selection state.
   * Set to empty string to listen to no events.
   * @param {String} attrName - Attribute Name
   * @param {String} value
   */
  bindedActivateEvent(attrName, value) {
    if (this.bindedAttributeSuper(attrName, value)) return;
    this.activateEvent = value.split(',').map((value) => value.trim());
  }

  /**
   * Default fallback if the selection based on selected with `attrForSelected`
   * is not found.
   * @param {String} attrName - Attribute Name
   * @param {String} value
   */
  bindedFallbackSelection(attrName, value) {
    if (this.bindedAttributeSuper(attrName, value)) return;
    this.ironSelection.fallbackSelection = value;
  }

  /**
   * If true, multiple selections are allowed.
   * @param {String} attrName - Attribute Name
   * @param {String} value
   */
  bindedMulti(attrName, value) {
    if (this.bindedAttributeSuper(attrName, value)) return;
    this.ironSelection.multi = this.toBoolean(value);
  }

  /**
   * This is a CSS selector string.  If this is set, only items that match the CSS selector
   * are selectable.
   * @param {String} attrName - Attribute Name
   * @param {String} value
   */
  bindedSelectable(attrName, value) {
    if (this.bindedAttributeSuper(attrName, value)) return;
    this.selectable = value;
  }

  /**
   * Sets the selected element. The default is to use the index of the item.
   * @param {String} attrName - Attribute Name
   * @param {String} value
   */
  bindedSelected(attrName, value) {
    if (this.bindedAttributeSuper(attrName, value)) return;

    // Wait until other attributes are processed. This must be the last
    this.async(() => { this.ironSelection.selected = value; });
  }

  /**
   * The attribute to set on elements when selected.
   * Ex.: selected-attribute="attributeName"
   * @param {String} attrName - Attribute Name
   * @param {String} value
   */
  bindedSelectedAttribute(attrName, value) {
    if (this.bindedAttributeSuper(attrName, value)) return;
    this.selectedAttribute = value;
  }

  /**
   * The class to set on elements when selected.
   * Ex.: selected-clas="className"
   * @param {String} attrName - Attribute Name
   * @param {String} value
   */
  bindedSelectedClass(attrName, value) {
    if (this.bindedAttributeSuper(attrName, value)) return;
    this.selectedClass = value;
  }

  /**
   * Watch for childs variations, and update the items list
   */
  _subscribeMutationObserver() {
    const options = { childList: true };

    new MutationObserver((mutations) => {
      this.updateItems();
    }).observe(this, options);
  }

  /**
   * According to activate-event subscribe to EventManager
   */
  subscribeToEvents() {
    let eventList = this.activateEvent;
    if (eventList == null) eventList = ['tap']; // default value
    const eventManager = this.eventManager;

    eventList.forEach((event) => {
      let handler;
      let eventName;

      switch (event) {
        case 'tap':
          eventName = null;
          handler = this.ironSelection.activateFromEvent.bind(this.ironSelection);
          eventManager.on('tap', handler);
          break;
        case 'space':
          eventName = 'space:keydown';
          handler = this.ironSelection.activateFromEvent.bind(this.ironSelection);
          break;
        case 'enter':
          eventName = 'enter:keydown';
          handler = this.ironSelection.activateFromEvent.bind(this.ironSelection);
          break;
        case 'up':
          eventName = 'up:keydown';
          handler = this.ironSelection.selectPrevious.bind(this.ironSelection);
          break;
        case 'left':
          eventName = 'left:keydown';
          handler = this.ironSelection.selectPrevious.bind(this.ironSelection); // rtl??
          break;
        case 'down':
          eventName = 'down:keydown';
          handler = this.ironSelection.selectNext.bind(this.ironSelection);
          break;
        case 'right':
          eventName = 'right:keydown';
          handler = this.ironSelection.selectNext.bind(this.ironSelection); // rtl??
          break;
        default:
          break;
      }
      if (eventName != null) eventManager.onKey(eventName, handler);
    });
    eventManager.subscribe();
  }

  /**
   * Build the items array where to select.
   * If selectable is defined, perform a css query to build it.
   */
  updateItems() {
    if (!this.selectable) {
      this.ironSelection.items = new List(this.children);
    } else {
      this.ironSelection.items = new List(this.querySelectorAll(this.selectable));
    }
  }
};

export { AlgIronSelectableBehavior };
