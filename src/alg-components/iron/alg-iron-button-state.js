// @copyright @polymer\iron-behaviors\iron-button-state.js
// @copyright 2017 ALG
// @ts-check

import { ObsBoolean } from '../types/obs-boolean.js';

class AlgIronButtonState {
  /**
   * Mixin, code injection to item.
   * @param {*} item - AlgIronComponent
   */
  constructor(item) {
    this.item = item;

    // -----------------------------        custom events
    item.customHandlers.add('change');

    // -----------------------------        properties

    // If true, the button toggles the active state with each tap or press of the spacebar.
    item.toggles = new ObsBoolean('toggles', false)
      .onChangeReflectToAttribute(item)
      .observe(() => this._activeChanged());

    // -----------------------------        Attribute change management

    item.bindedToggles = this.bindedToggles;

    // -----------------------------        handlers

    // If true, the button is a toggle and is currently in the active state.
    item.eventManager.register.set('active', {
      init: (local) => {
        local.data = new ObsBoolean('active', false)
          .onChangeReflectToAttribute(item)
          .onChangeFireMessage(item, 'change');
      }
    });
    item.eventManager
      .onCustom('active', () => this._activeChanged())
      .on('click', this._tapHandler.bind(this))
      .onChangeReflectToAttribute('pressed', item, 'pressed', true)
      .onKey('enter:keydown', () => this._asyncClick())
      .onKey('space:keyup', () => this._asyncClick())
      .subscribe(); // always, last
  }

  /**
   * aria-pressed attribute
   * @param {Boolean} active
   */
  _activeChanged() {
    const active = this.item.eventManager.getObservable('active').value;
    if (this.item.toggles.value) {
      this.item.setAttribute('aria-pressed', active ? 'true' : 'false');
    } else {
      this.item.removeAttribute('aria-pressed');
    }
  }

  /**
   * trigger click asynchronously, the asynchrony is useful to allow one
   * event handler to unwind before triggering another event
   */
  _asyncClick() {
    this.item.eventManager.fire('click'); // fire is async
  }

  /**
   * Toggles attribute change
   * @param {String} attrName - Attribute Name
   * @param {String} value
   */
  bindedToggles(attrName, value) {
    // @ts-ignore
    if (this.bindedAttributeSuper(attrName, value)) return;
    // @ts-ignore
    this.toggles.update(value !== null);
  }

  /**
   * Response to a click event or enter key
   */
  _tapHandler() {
    const active = this.item.eventManager.getObservable('active');
    if (this.item.toggles.value) {
      active.toggle();
    } else {
      active.update(false);
    }
  }
}

export { AlgIronButtonState };
