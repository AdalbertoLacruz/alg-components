// @copyright @polymer\iron-behaviors\iron-button-state.js
// @copyright 2017 ALG
// @ts-check

import { ObsBoolean } from '../types/obs-boolean.js';
import { EventManager } from '../types/event-manager.js';

class AlgIronButtonState {
  /** Mixin, code injection to item. @param {AlgIronComponent} */
  constructor(item) { //
    this.item = item;

    // -----------------------------        custom events
    item.customHandlers.add('change');

    // -----------------------------        properties

    // If true, the button is a toggle and is currently in the active state.
    item.active = new ObsBoolean('active', false)
      .onChangeReflectToAttribute(item)
      .observe(this._activeChanged.bind(item))
      .onChangeFireMessage(item, 'change');

    item.focused.observe(this._focusChanged.bind(item));

    // True if the element is currently being pressed by a "pointer," which is loosely
    // defined as mouse or touch input (but specifically excluding keyboard input).
    item.pointerDown = new ObsBoolean('pointerDown', false);

    // If true, the user is currently holding down the button.
    item.pressed = new ObsBoolean('pressed', false)
      .onChangeReflectToAttribute(item);

    // True if the input device that caused the element to receive focus was a keyboard.
    item.receivedFocusFromKeyboard = new ObsBoolean('receivedFocusFromKeyboard', false);

    // If true, the button toggles the active state with each tap or press of the spacebar.
    item.toggles = new ObsBoolean('toggles', false)
      .onChangeReflectToAttribute(item);

    // -----------------------------        Attribute change management

    item.bindedToggles = this.bindedToggles;

    // -----------------------------        handlers

    item.eventManager = new EventManager(item)
      // .on('click', this._tapHandler.bind(item))
      .on('click', () => {
        if (item.toggles.value) {
          item.active.toggle();
        } else {
          item.active.update(false);
        }
      }).on('mousehold', (value) => {
        item.pointerDown.update(value);
        item.pressed.update(value);
      }).subscribe(); // always, last
  }

  _activeChanged(active) {
  //   if(this.toggles) {
  //     this.setAttribute(this.ariaActiveAttribute,
  //       active ? 'true' : 'false');
  //   } else {
  //     this.removeAttribute(this.ariaActiveAttribute);
  //   }
  //   this._changedButtonState();
  }

  // Toggles attribute change
  bindedToggles(attrName, value) {
    if (this.bindedAttributeSuper(attrName, value)) return;
    this.toggles.update(value !== null);
  }

  // _downHandler() {
  //   this.pointerDown.update(true);
  //   this.pressed.update(true);
  //   this.receivedFocusFromKeyboard.update(false); // TODO: pte
  // }

  _focusChanged(focused) {
    // this._detectKeyboardFocus(focused);

    // if (!focused) {
    //   this._setPressed(false);
    // }
  }

  /**
   * toggles management
   */
  // _tapHandler() {
  //   if (this.toggles.value) {
  //     this.active.toggle();
  //   } else {
  //     this.active.update(false);
  //   }
  // }

  // _upHandler() {
  //   this.pointerDown.update(false);
  //   this.pressed.update(false);
  // }
}

export { AlgIronButtonState };
