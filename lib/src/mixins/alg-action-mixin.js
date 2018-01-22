// @copyright 2017-2018 adalberto.lacruz@gmail.com

/**
 * Mixin behavior
 *
 * Implementents 'on-action'
 *
 * @param {*} base
 * @mixin
 */
export const AlgActionMixin = (base) => class extends base {
  constructor() {
    // @ts-ignore
    super();

    this.fireHandlers.add('action'); // fire with pressed true

    this.eventManager
      .onChangeFireMessage('pressed', this, 'action', { to: true })
      .subscribe();
  }

  /**
   * Attributes managed by the component
   * @override
   * @type {Array<String>}
   */
  static get observedAttributes() {
    return super.observedAttributes.concat(['on-action']);
  }
};
