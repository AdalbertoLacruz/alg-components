// @copyright @polymer\iron-checked-element-behavior\iron-checked-element-behavior.js
// @copyright 2017 ALG
// @ts-check

import { EventManager } from '../types/event-manager.js'; // eslint-disable-line
import { ObsBoolean } from '../types/obs-boolean.js';
import { ObsString } from '../types/obs-string.js';

// TODO: validate, form. Review active/check relation
/**
 * [checked ⛳]
 * [required ⛳aria-required]
 * [toggles ⛳]
 * [value 💰on]
 *
 * @param {*} base
 */
export const AlgIronCheckedElementBehavior = (base) => class extends base {
  constructor() {
    // @ts-ignore
    super();

    this.fireHandlers.add('change'); // fire with checked

    const eventManager = /** @type {EventManager} */ (this.eventManager);

    // If true, the button toggles the active state with each tap or press of the spacebar.
    if (eventManager.isDefined('toggles')) {
      eventManager.getObservable('toggles').update(true);
    } else {
      eventManager.define('toggles', new ObsBoolean('toggles', true)
        .onChangeReflectToAttribute(this)
      );
    }

    eventManager
      // Gets or sets the state, `true` is checked and `false` is unchecked.
      .define('checked', new ObsBoolean('checked', false)
        .onChangeReflectToAttribute(this)
        // .onChangeFireMessage(this, 'change') // in active
      )
      .define('required', new ObsBoolean('required', false)
        // TODO: review
        .observe((value) => {
          if (value) this.setAttribute('aria-required', 'true'); else this.removeAttribute('aria-required');
        })
      )
      .define('value', new ObsString('value', null)
        .onNullSet('on')
      );
  }

  /**
   * Attributes managed by the component
   * @override
   * @type {Array<String>}
   */
  static get observedAttributes() {
    return super.observedAttributes.concat(['checked', 'on-change', 'required']);
  }

  /**
   * Checked attribute change
   * @param {String} attrName - Attribute Name
   * @param {String} value
   */
  bindedChecked(attrName, value) {
    if (this.bindedAttributeSuper(attrName, value)) return;

    this.eventManager.getObservable('active').update(this.toBoolean(value));
  }

  /**
   * Required attribute change
   * @param {String} attrName - Attribute Name
   * @param {String} value
   */
  bindedRequired(attrName, value) {
    if (this.bindedAttributeSuper(attrName, value)) return;
    this.eventManager.getObservable('required').update(this.toBoolean(value));
  }
};
