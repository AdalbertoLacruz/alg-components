// @copyright @polymer\iron-selector\iron-selectable.js
// @copyright @polymer\iron-selector\iron-multi-selectable.js
// @copyright 2017-2018 adalberto.lacruz@gmail.com

import { AlgComponent } from '../base/alg-component.js';
import { AlgIronSelection } from '../types/alg-iron-selection.js';
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
class AlgIronSelectableBehavior extends AlgComponent {
  /** @override */
  deferredConstructor() {
    super.deferredConstructor();

    // ORDER IS IMPORTANT
    this.attributeManager
      // If true, items can be deselected
      .define('allow-empty-selection', 'boolean')
      .onLink((value) => {
        this.ironSelection.allowEmptySelection = value;
      })
      .read()

      // The event that fires from items when they are selected. Selectable
      // will listen for this event from items and update the selection state.
      // Set to empty string to listen to no events.
      .define('activate-event', 'string')
      .onLink((value, context) => {
        context.activateEvent = value.split(',').map((value) => value.trim());
      })
      .read()

      // If you want to use an attribute value or property of an element for `selected`
      // instead of the index, set this to the name of the attribute or property.
      .define('attr-for-selected', 'string')
      .onLink((value) => {
        this.ironSelection.attrForSelected = value;
      })
      .read()

      // Default fallback if the selection based on selected with `attrForSelected`
      // is not found.
      .define('fallback-selection', 'string')
      .onLink((value) => {
        this.ironSelection.fallbackSelection = value;
      })
      .read()

      // If true, multiple selections are allowed.
      .define('multi', 'boolean')
      .onLink((value) => {
        this.ironSelection.multi = value;
      })
      .read()

      // The attribute to set on elements when selected.
      // Ex.: selected-attribute="attributeName"
      .define('selected-attribute', 'string')
      .on((newAttribute, context) => { // TODO: link
        const oldAttribute = context.old;
        // If we have a selection, update
        this.ironSelection.selection.forEach((item) => {
          if (oldAttribute) FHtml.attributeToggle(item, oldAttribute, false);
          if (newAttribute) FHtml.attributeToggle(item, newAttribute, true);
        });
        this.ironSelection.selectedAttribute = newAttribute;
      })
      .read()

      // The class to set on elements when selected.
      // Ex.: selected-clas="className"
      .define('selected-class', 'string')
      .on((newClass, context) => { // TODO: link
        const oldClass = context.old;
        // If we have a selection, update
        this.ironSelection.selection.forEach((item) => {
          if (oldClass) item.classList.toggle(oldClass, false);
          if (newClass) item.classList.toggle(newClass, true);
        });
      })
      .defaultValue('iron-selected')

      // This is a CSS selector string. If this is set, only items that match the
      // CSS selector are selectable.
      .define('selectable', 'string')
      .on((value) => {
        this.updateItems(); // valid, because children are by now in the dom
      })
      .read({alwaysUpdate: true})

      // Sets the selected element. The default is to use the index of the item.
      // Wait until other attributes are processed. This must be the  *** LAST ***
      .define('selected', 'string')
      .on((value) => {
        this.ironSelection.selected = value;
      });

    this.eventManager
      .on('focus', (e) => {
        if (this.ironSelection.itemLastSelected) {
          this.ironSelection.itemLastSelected.focus();
        }
      })
      .subscribe();

    this.messageManager
      .define('change');

    this.subscribeToEvents(); // EventManager definitions
    this._subscribeMutationObserver();
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

  /** @type {Array<String>} */
  get activateEvent() { return this.attributeManager.get('activate-event').context.activateEvent; }

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

        this.fireMessage('change', { select: isSelected, item: item });
      })
    );
  }

  /** @type {String}  */
  get selectable() { return this.attributeManager.getValue('selectable'); }

  /** @type {String} */
  get selectedAttribute() { return this.attributeManager.getValue('selected-attribute'); }

  /** @type {String} */
  get selectedClass() { return this.attributeManager.getValue('selected-class'); }

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
    const eventList = this.activateEvent || ['tap'];
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
