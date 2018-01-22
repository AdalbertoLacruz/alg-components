// @copyright @polymer\paper-ripple\paper-ripple.js
// @copyright 2017-2018 adalberto.lacruz@gmail.com

import { AlgPaperComponent } from '../src/base/alg-paper-component.js';
import { EventManager } from '../src/types/event-manager.js';
import { ObservableEvent } from '../src/types/observable-event.js';
import { Ripple } from '../src/util/ripple.js';

/**
 * Ripple effect
 *
 * External Properties: .noink = true | false
 * External Methods:    .simulateRipple()
 *
 * Trigger Event: 'transitionend'.
 *  with event == {node: Object} the animated node.
 *  Fired when the animation finishes. This is useful if you want to wait until
 *  the ripple animation finishes to perform some action.
 *
 * @class
 */
class AlgPaperRipple extends AlgPaperComponent {
  /**
     * Build the static template for style
     * @override
     * @return {HTMLTemplateElement} The template Element with style
     */
  createTemplateStyle() {
    let template = super.createTemplateStyle();
    template.innerHTML = `
      <style>
        :host {
          display: block;
          position: absolute;
          border-radius: inherit;
          overflow: hidden;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;

          /* See PolymerElements/paper-behaviors/issues/34. On non-Chrome browsers,
          * creating a node (with a position:absolute) in the middle of an event
          * handler "interrupts" that event handler (which happens when the
          * ripple is created on demand) */
          pointer-events: none;
        }

        :host([animating]) {
          /* This resolves a rendering issue in Chrome (as of 40) where the
            ripple is not properly clipped by its parent (which may have
            rounded corners). See: http://jsbin.com/temexa/4

            Note: We only apply this style conditionally. Otherwise, the browser
            will create a new compositing layer for every ripple element on the
            page, and that would be bad. */
          -webkit-transform: translate(0, 0);
          transform: translate3d(0, 0, 0);
        }

        #background,
        #waves,
        .wave-container,
        .wave {
          pointer-events: none;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        #background,
        .wave {
          opacity: 0;
        }

        #waves,
        .wave {
          overflow: hidden;
        }

        .wave-container,
        .wave {
          border-radius: 50%;
        }

        :host(.circle) #background,
        :host(.circle) #waves {
          border-radius: 50%;
        }

        :host(.circle) .wave-container {
          overflow: hidden;
        }
      </style>
    `;
    return template;
  }

  /**
   * Build for the class (static) templateElement, templateStyle and templateIds.
   * @override
   * @return {HTMLTemplateElement} The template Element to be cloned in the shadow creation
   */
  createTemplate() {
    let template = super.createTemplate();
    template.innerHTML = `
      <div id="background"></div>
      <div id="waves"></div>
    `;
    this.selfClass.templateIds = this.searchTemplateIds(template.innerHTML);

    return template;
  }

  // constructor() {
  //   super();
  // }

  /**
   * True when there are visible ripples animating within the element.
   * @type {ObservableEvent}
   */
  get animating() {
    return this._animating || (this._animating = new ObservableEvent('animating').setType('boolean')
      .onChangeReflectToAttribute(this));
  }

  /** If true, ripples will center inside its container. Used by Ripple(). @type {Boolean} */
  get center() { return this._center || (this._center = false); }
  set center(value) { this._center = value; }

  /** The initial opacity set on the wave. Used by Ripple(). @type {Number} */
  get initialOpacity() { return this._initialOpacity || (this._initialOpacity = 0.25); }

  /**
   * If true, the ripple will remain in the "down" state until `holdDown` is set to false again.
   * holdDown does not respect noink since it can be a focus based effect.
   * Changed outside the component.
   *
   * @type {ObservableEvent}
   */
  get holdDown() {
    return this._holdDown || (this._holdDown = new ObservableEvent('holdDown').setType('boolean')
      .observe((value, context) => {
        if (value) {
          this.async(this.downAction.bind(this, context.event), 200);
        } else {
          this.async(this.upAction.bind(this, context.event), 200);
        }
      })
    );
  }

  /**
   * If true, the ripple will not generate a ripple effect via pointer interaction.
   * Calling ripple's imperative api like `simulatedRipple` will still generate the ripple effect.
   * @type {Boolean}
   */
  get noink() { return this._noink || (this._noink = false); }
  set noink(value) { this._noink = value; }

  /**
   * Attributes managed by the component
   * @override
   * @type {Array<String>}
   */
  static get observedAttributes() {
    return super.observedAttributes.concat(['center', 'recenters']);
  }

  /** How fast (opacity per second) the wave fades out. @type {Number} */
  get opacityDecayVelocity() { return this._opacityDecayVelocity || (this._opacityDecayVelocity = 0.8); }

  /**
   * If true, ripples will exhibit a gravitational pull towards the center of
   * their container as they fade away.
   * @type {Boolean}
   */
  get recenters() { return this._recenters || (this._recenters = false); }
  set recenters(value) { this._recenters = value; }

  /** A list of the visual ripples. @type {Array} */
  get ripples() { return this._ripples || (this._ripples = []); }

  /** @type {Boolean} */
  get shouldKeepAnimating() {
    for (let index = 0; index < this.ripples.length; ++index) {
      if (!this.ripples[index].isAnimationComplete) {
        return true;
      }
    }
    return false;
  }

  /** @type {EventTarget} */
  get target() { return this.keyEventTarget; }

  /**
   * Called every time the element is inserted into the DOM
   * @override
   */
  connectedCallback() {
    super.connectedCallback();
    // Set up EventManager to listen to key events on the target,
    // so that space and enter activate the ripple even if the target doesn't
    // handle key events. The key handlers deal with `noink` themselves.

    /** @type {EventTarget} */
    const keyEventTarget = this.keyEventTarget = (this.parentNode.nodeType === 11)
      ? this.getRootNode().host
      : this.parentNode;

    /** @type {EventManager} */
    const parentEventManager = this._parentEventManager = (keyEventTarget.eventManager != null)
      ? keyEventTarget.eventManager
      : new EventManager(keyEventTarget); // Not alg-component (div, ...)

    parentEventManager
      .on('down', (value) => { this.uiDownAction(value); })
      .on('up', (value) => { this.uiUpAction(value); })
      .onKey('enter:keydown', () => {
        this.uiDownAction();
        this.async(this.uiUpAction, 1);
      })
      .onKey('space:keydown', () => {
        this.uiDownAction(); // don't pass event argument
      })
      .onKey('space:keyup', () => {
        this.uiUpAction(); // don't pass event argument
      })
      .subscribe();
  }

  /**
   * Called every time the element is removed from the DOM. Unsubscribe.
   * @override
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    // If we need reconnect the element, the parentEventManager must be different from component native
    this.keyEventTarget = null;
  }

  /** no standard attributes @override */
  addStandardAttributes() {}

  addRipple() {
    const ripple = new Ripple(this);

    this.ids['waves'].appendChild(ripple.waveContainer);
    this.ids['background'].style.backgroundColor = ripple.color;
    this.ripples.push(ripple);

    // this.animating.update(true);

    return ripple;
  }

  /**
   * This conflicts with Element#antimate().
   * https://developer.mozilla.org/en-US/docs/Web/API/Element/animate
   */
  animate() {
    if (!this.animating.value) return;

    for (let index = 0; index < this.ripples.length; ++index) {
      let ripple = this.ripples[index];

      ripple.draw();

      this.ids['background'].style.opacity = ripple.outerOpacity;

      if (ripple.isOpacityFullyDecayed && !ripple.isRestingAtMaxRadius) {
        this.removeRipple(ripple);
      }
    }

    if (!this.shouldKeepAnimating && this.ripples.length === 0) {
      this.onAnimationComplete();
    } else {
      window.requestAnimationFrame(this._boundAnimate());
    }
  }

  /**
   * Set center property
   * @param {String} attrName - Attribute Name
   * @param {String} value
   */
  bindedCenter(attrName, value) {
    if (this.bindedAttributeSuper(attrName, value)) return;
    this.center = this.toBoolean(value);
  }

  /**
   * Set Recenters property
   * @param {String} attrName - Attribute Name
   * @param {String} value
   */
  bindedRecenters(attrName, value) {
    if (this.bindedAttributeSuper(attrName, value)) return;
    this.recenters = this.toBoolean(value);
  }

  _boundAnimate() {
    return this.animate.bind(this);
  }

  /**
   * Provokes a ripple down effect via a UI event,
   * *not* respecting the `noink` property.
   * @param {UIEvent=} event
   */
  downAction(event) {
    if (this.holdDown.value && this.ripples.length > 0) return;

    const ripple = this.addRipple();
    ripple.downAction(event);

    if (!this.animating.value) {
      this.animating.update(true);
      this.animate();
    }
  }

  onAnimationComplete() {
    this.animating.update(false);
    this.ids['background'].style.backgroundColor = null;

    // 'transitionend' is a dom (transition) event.
    // Use eventManager.on to receive it, else we receive it twice
    this._parentEventManager.fire('transitionend', { node: this });
  }

  removeRipple(ripple) {
    var rippleIndex = this.ripples.indexOf(ripple);

    if (rippleIndex < 0) return;

    this.ripples.splice(rippleIndex, 1);
    ripple.remove();

    if (!this.ripples.length) this.animating.update(false);
  }

  /**
   * simulate a click onto element
   */
  simulateRipple() {
    this.downAction(null);
    this.async(this.upAction, 1);
  }

  /**
   * Provokes a ripple up effect via a UI event,
   * *not* respecting the `noink` property.
   * @param {UIEvent=} event
   */
  upAction(event) {
    if (this.holdDown.value) return;

    this.ripples.forEach((ripple) => { ripple.upAction(event); });

    this.animating.update(true);
    this.animate();
  }

  /**
   * Provokes a ripple down effect via a UI event,
   * respecting the `noink` property.
   * @param {UIEvent=} event
   */
  uiDownAction(event) {
    if (!this.noink) this.downAction(event);
  }

  /**
   * Provokes a ripple up effect via a UI event,
   * respecting the `noink` property.
   * @param {UIEvent=} event
   */
  uiUpAction(event) {
    if (!this.noink) this.upAction(event);
  }
}

window.customElements.define('alg-paper-ripple', AlgPaperRipple);

export { AlgPaperRipple };
