// @ts-check
import { ObsBoolean } from './obs-boolean.js';
import { Observable } from './observable.js';

class EventManager {
  constructor(target) {
    this.target = target;
  }

  /**
   * Storage for event definition and data.
   * 'eventName': {
   *    data: Observable,
   *    init: function to create data,
   *    handler: event function, (item == value definition object associate with that eventName)
   *    listener: handler function binded for unsubscribe
   * }
   * @return {Map<String, Object>}
   */
  get register() {
    return this._register || (this._register = new Map()
      .set('click', {
        init: (item) => { item.data = new Observable('click', null); },
        handler: (item, e) => { item.data.update(e); }
      }))
      .set('mousedown', {
        init: (item) => { item.data = new Observable('mousedown', null); },
        handler: (item, e) => { item.data.update(e); }
      })
      .set('mouseup', {
        init: (item) => { item.data = new Observable('mouseup', null); },
        handler: (item, e) => { item.data.update(e); }
      })
      // true if mouse button is pressed
      .set('mousehold', {
        init: (item) => {
          item.data = new ObsBoolean('mousehold', false);
          this.on('mousedown', () => { item.data.update(true); });
          this.on('mouseup', () => { item.data.update(false); });
        },
        handler: null
      });
  }

  /**
   * External subscription to the event
   * @param {String} eventName - click, ...
   * @param {Function} handler - code to execute on event
   * @return {EventManager}
   */
  on(eventName, handler) {
    const item = this.register.get(eventName);
    if (item) {
      if (!item.data) item.init(item);
      item.data.observe(handler);
    }
    return this;
  }

  /**
   * After on(...), subscribe the events to the target. Supports multiple calls
   * @param {HTMLElement} target
   * @return {EventManager}
   */
  subscribe() {
    const target = this.target;
    for (const [event, item] of this.register) {
      if (item.data != null && item.handler != null && item.listener == null) {
        item.listener = item.handler.bind(this, item);
        target.addEventListener(event, item.listener);
      }
    }
    return this;
  }

  /**
   * Remove the target event listeners
   * @return {EventManager}
   */
  unsubscribe() {
    for (const [event, item] of this.register) {
      if (item.listener != null) {
        this.target.removeEventListener(event, item.listener);
      }
    }
    return this;
  }
}

export { EventManager };
