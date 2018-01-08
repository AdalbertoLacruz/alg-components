// @copyright @polymer\iron-resizable-behavior\iron-resizable-behavior.js 3.0.0-pre.1 20170822
// @copyright 2017-2018 ALG

import { EventManager } from '../types/event-manager.js';
import { fireEvent, waitUntilDocumentReady } from '../util/f-html.js';
import { List } from '../types/list.js';

/**
 * Mixin Behavior
 *
 * IronResizableBehavior is a behavior that can be used in elements to coordinate
 * the flow of resize events between "resizers" (elements that control the size or hidden
 * state of their children) and "resizables" (elements that need to be notified when they
 * are resized or un-hidden by their parents in order to take action on their new measurements).
 *
 * Elements that perform measurement should add the IronResizableBehavior behavior
 * to their element definition and listen for the iron-resize event on themselves.
 * This event will be fired when they become showing after having been hidden,
 * when they are resized explicitly by another resizable, or when the window has been resized.
 *
 * @param {*} base
 */
export const AlgIronResizableBehavior = (base) => class extends base {
  constructor() {
    // @ts-ignore
    super();

    // Nodes to inform when a resize happens
    this._interestedResizables = new List();

    this.attributeManager
      // The closest ancestor element that implements `IronResizableBehavior`.
      .define('parentResizable', 'HTMLElement')
      .on((parentResizable) => {
        if (parentResizable) {
          // @ts-ignore
          EventManager.window.unsubscribeMe(this, 'resize');
        }
      });

    this.eventManager
      // listen children resizables
      .on('iron-request-resize-notifications', (event) => {
        const target = event.detail.node;
        if (target === this || event.cancelBubble) { return; }
        event.stopPropagation();

        target.assignParentResizable(this);
        this._interestedResizables.add(target, { unique: true });

        // console.log('iron-request received: ', event, this.me);
      }, { link: true }) // important! to stop bubble and sequential exec after fireEvent

      .on('resize', (event) => {
        // Inform to resizable subscribers
        this._interestedResizables.forEach((resizable) => {
          if (this.resizerShouldNotify(resizable)) {
            resizable.notifyResize(event);
          }
        });
      })
      .subscribe();
  }

  connectedCallback() {
    super.connectedCallback();

    // requestResizeNotifications - discover parent resizable
    // We must be in document 'complete' state to assure the tree let event bubbles up all nodes
    waitUntilDocumentReady().then(() => {
      // @ts-ignore
      fireEvent(this, 'iron-request-resize-notifications', {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: {
          node: this
        }
      });

      // Check if we are first resizable node in the tree/branch
      if (!this.attributeManager.getValue('parentResizable')) {
        EventManager.window
          .on('resize', (event) => {
            this.eventManager.fire('resize', event);
          }, { me: this })
          .subscribe();
      }
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    const parentResizable = this.attributeManager.get('parentResizable');
    if (parentResizable.value) {
      parentResizable.value.stopResizeNotificationsFor(this);
      parentResizable.update(null);
    } else {
      // @ts-ignore
      EventManager.window.unsubscribeMe(this, 'resize');
    }
  }

  // -------------- interface ----------

  /**
   * Used to assign the closest resizable ancestor to this resizable
   * if the ancestor detects a request for notifications.
   * @param {HTMLElement} parentResizable
   */
  assignParentResizable(parentResizable) {
    this.attributeManager.change('parentResizable', parentResizable);
  }

  /**
   * Can be called to manually notify a resizable and its descendant
   * resizables of a resize change.
   */
  notifyResize() {
    this.eventManager.fire('resize', { node: this });
  }

  /**
   * This method can be overridden to filter nested elements that should or
   * should not be notified by the current element. Return true if an element
   * should be notified, or false if it should not be notified.
   *
   * @param {HTMLElement} element A candidate descendant element that implements `IronResizableBehavior`.
   * @return {boolean} True if the `element` should be notified of resize.
   */
  resizerShouldNotify(element) { return true; }

  /**
   * Used to remove a resizable descendant from the list of descendants
   * that should be notified of a resize change.
   * @param {HTMLElement} target
   */
  stopResizeNotificationsFor(target) {
    if (this._interestedResizables.contains(target)) {
      this._interestedResizables.remove(target);
    }
  }
};
