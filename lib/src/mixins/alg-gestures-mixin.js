// @copyright @polymer\polymer\lib\utils\gestures.js
// @copyright 2017-2018 adalberto.lacruz@gmail.com

import { ObservableEvent } from '../types/observable-event.js';

/**
 * Mixin behavior
 * Manages track movements
 *
 * mousedown -> [trackStart]
 * mousemove -> [trackMove]
 * mouseup   -> [trackEnd]
 *
 * @param {*} base
 */
export const AlgGesturesMixin = (base) => class extends base {
  constructor() {
    // @ts-ignore
    super();

    this.eventManager
      .define('trackStart', new ObservableEvent('trackStart'), ['mousedown'])
      .define('trackMove', new ObservableEvent('trackMove'), ['mousemove'])
      .define('trackEnd', new ObservableEvent('trackEnd'), ['mouseup'])
      .visibleTo('mouseup', ['mousemove'])
      .on('mousedown', (event, context) => {
        if (this.hasAttribute('frozen')) return;
        this._trackEvent = null; // reset values
        context._trackStart.update(this.trackEvent); // event
        this.eventManager.subscribeSwitch('mousemove');
      })
      .on('mousemove', (event, context) => {
        if (event.buttons === 0) { // if lose up event
          context._mouseup.update(event);
        } else {
          context._trackMove.update(this.updateTrackEvent(event), {force: true});
        }
      })
      .on('mouseup', (event, context) => {
        this.eventManager.unsubscribeSwitch('mousemove');
        context._trackEnd.update(this.trackEvent);
      })
      .subscribe();
  }

  get trackEvent() {
    return this._trackEvent || (this._trackEvent = {
      posX: 0, // movements accumulateds, including this
      posY: 0,
      dx: 0, // this movement
      dy: 0,
      hasMoved: false // if any mousemove is received
    });
  }

  updateTrackEvent(event) {
    const tEvent = this.trackEvent;
    tEvent.hasMoved = true;
    tEvent.dx = event.movementX;
    tEvent.dy = event.movementY;
    tEvent.posX = tEvent.posX + tEvent.dx;
    tEvent.posY = tEvent.posY + tEvent.dy;

    return tEvent;
  }
};
