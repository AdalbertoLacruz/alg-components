// @copyright @polymer\polymer\lib\utils\gestures.js
// @copyright 2017 ALG
// @ts-check

import { EventManager } from '../types/event-manager.js'; // eslint-disable-line
import { Observable } from '../types/observable.js';

/**
 * Mixin behavior
 * Manages track movements
 *
 * mousedown -> trackStart
 * mousemove -> trackMove
 * mouseup   -> trackEnd
 *
 * @param {*} base
 */
export const AlgGestures = (base) => class extends base {
  constructor() {
    // @ts-ignore
    super();

    const eventManager = /** @type {EventManager} */ (this.eventManager);

    eventManager.register.set('mousemove', {
      init: (item) => { item.data = new Observable('mousemove', null, item); },
      handler: (item, e) => { item.data.update(e); },
      switch: true
    });

    eventManager
      .define('trackStart', new Observable('trackStart', null), ['mousedown'])
      .define('trackMove', new Observable('trackMove', null), ['mousemove'])
      .define('trackEnd', new Observable('trackEnd', null), ['mouseup'])
      .visibleTo('mouseup', ['mousemove'])
      .on('mousedown', (event, raw, context) => {
        this._trackEvent = null; // reset values
        context._trackStart.update(this.trackEvent); // event
        this.eventManager.subscribeSwitch('mousemove');
      })
      .on('mousemove', (event, raw, context) => {
        if (event.buttons === 0) { // if lose up event
          context._mouseup.update(event);
        } else {
          context._trackMove.update(this.updateTrackEvent(event), {force: true});
        }
      })
      .on('mouseup', (event, raw, context) => {
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
    // tEvent.hasMoved = tEvent.hasMoved ||
    //   Math.abs(tEvent.posX) > TRACK_DISTANCE ||
    //   Math.abs(tEvent.posY) > TRACK_DISTANCE;
    tEvent.dx = event.movementX;
    tEvent.dy = event.movementY;
    tEvent.posX = tEvent.posX + tEvent.dx;
    tEvent.posY = tEvent.posY + tEvent.dy;

    return tEvent;
  }
};

// const TRACK_DISTANCE = 2;
