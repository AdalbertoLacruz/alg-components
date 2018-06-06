// @copyright 2017-2018 adalberto.lacruz@gmail.com

/**
 * Manages action in MessageManager
 * @class
 */
class ObservableAction {
  /** @constructor */
  constructor() {
    /** @type {Array<Function>} actions */
    this.handlers = [];
  }

  /**
   * Add a handler
   * @param {Function} handler
   * @return {ObservableAction}
   */
  subscribe(handler) {
    this.handlers.push(handler);
    return this;
  }

  /**
   * Execute the action. options:
   *  bool isLink - true execute immediately
   * @param {*} message
   * @param {*} options
   * @return {ObservableAction}
   */
  dispatch(message, options = {}) {
    const { isLink } = options;

    this.handlers.forEach((handler) => {
      isLink
        ? handler(message)
        : Promise.resolve().then(() => handler(message));
    });
    return this;
  }
}

export { ObservableAction };
