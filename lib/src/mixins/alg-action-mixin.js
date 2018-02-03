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
  /** @override */
  deferredConstructor() {
    super.deferredConstructor();

    this.messageManager
      .define('action', { toEvent: 'pressed', letRepeat: true})
      .trigger((value) => value); // message: true
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
