// @copyright @polymer\paper-ripple\paper-ripple.js
// @copyright 2017-2018 adalberto.lacruz@gmail.com

import { AlgComponent } from './alg-component.js';
import { AttributeManager } from './attribute-manager.js';
import { EventManager } from './event-manager.js';
import { Ripple } from '../types/ripple.js';
// eslint-disable-next-line
import { RulesInstance } from '../../styles/rules.js';
import { TYPE_BOOL, TYPE_STRING } from '../util/constants.js';

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
class AlgPaperRipple extends AlgComponent {
  /**
     * Build the static template for style
     * @override
     * @param {RulesInstance} css
     * @return {HTMLTemplateElement} The template Element with style
     */
  createTemplateStyle(css) {
    let template = super.createTemplateStyle(css);
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

    return template;
  }

  /** @override */
  deferredConstructor() {
    super.deferredConstructor();

    /** @type {Number} The initial opacity set on the wave. Used by Ripple(). */
    this.initialOpacity = 0.25;

    /** @type {Number} How fast (opacity per second) the wave fades out. */
    this.opacityDecayVelocity = 0.8;

    /** @type {Array<Ripple>} A list of the visual ripples. */
    this.ripples = [];

    this.attributeManager
      // True when there are visible ripples animating within the element.
      .define('animating', TYPE_BOOL)
      .reflect()

      .define('center', TYPE_BOOL, { isPreBinded: true })

      .define('classbind', TYPE_STRING, { isPreBinded: true })
      .on((value) => {
        AttributeManager.classUpdate(this, value);
      })

      // If true, the ripple will remain in the "down" state until `holdDown` is set to false again.
      // holdDown does not respect noink since it can be a focus based effect.
      // Changed outside the component.
      .define('holdDown', TYPE_BOOL)
      .onLink((value, context) => {
        const event = context.event;
        value
          ? Promise.resolve().then(() => this.downAction(event))
          : Promise.resolve().then(() => this.upAction(event));
      })

      //  If true, the ripple will not generate a ripple effect via pointer interaction.
      //  Calling ripple's imperative api like `simulatedRipple` will still generate the ripple effect.
      .define('noink', TYPE_BOOL, { isPreBinded: true })

      .define('recenters', TYPE_BOOL, { isPreBinded: true });

    this.animating$ = this.attributeManager.get('animating');
    this.center$ = this.attributeManager.get('center');
    this.holdDown$ = this.attributeManager.get('holdDown');
    this.noink$ = this.attributeManager.get('noink');
    this.recenters$ = this.attributeManager.get('recenters');

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
        Promise.resolve().then(() => this.uiUpAction(null));
      })
      .onKey('space:keydown', () => {
        this.uiDownAction(); // don't pass event argument
      })
      .onKey('space:keyup', () => {
        this.uiUpAction(); // don't pass event argument
      })
      .subscribe();

    this.messageManager
      .from('ripple-simulate', (_) => { this.simulateRipple(); })
      .from('ripple-start', (event) => { this.uiDownAction(event); })
      .from('ripple-end', (event) => { this.uiUpAction(event); })
      .export('noink', this.noink$)
      .export('holdDown', this.holdDown$);
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

  /**
   * Attributes managed by the component
   * @override
   * @type {Array<String>}
   */
  static get observedAttributes() {
    return super.observedAttributes.concat(['center', 'noink', 'recenters']);
  }

  /** no standard attributes @override */
  addStandardAttributes() { }

  /**
   * If true, ripples will center inside its container. Used by Ripple().
   * @type {Boolean}
   */
  get center() { return this.center$.value; }

  /**
   * If true, ripples will exhibit a gravitational pull towards the center of
   * their container as they fade away.
   * @type {Boolean}
   */
  get recenters() { return this.recenters$.value; }

  /** @type {Boolean} */
  get shouldKeepAnimating() {
    this.ripples.forEach((ripple) => {
      if (!ripple.isAnimationComplete) return true;
    });
    return false;
  }

  /** @type {EventTarget} */
  get target() { return this.keyEventTarget; }

  /** @type {Ripple} */
  addRipple() {
    const ripple = new Ripple(this);

    this.ids['waves'].appendChild(ripple.waveContainer);
    this.ids['background'].style.backgroundColor = ripple.color;
    this.ripples.push(ripple);

    return ripple;
  }

  /**
   * Original animate() conflicts with Element#antimate().
   * https://developer.mozilla.org/en-US/docs/Web/API/Element/animate
   */
  animateRipple(timeStamp) {
    if (!this.animating$.value) return;

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
      window.requestAnimationFrame(this.animateRipple.bind(this));
    }
  }

  /**
   * Provokes a ripple down effect via a UI event,
   * *not* respecting the `noink` property.
   * @param {UIEvent=} event
   */
  downAction(event) {
    if (this.holdDown$.value && this.ripples.length > 0) return;

    this.addRipple()
      .downAction(event);

    if (!this.animating$.value) {
      this.animating$.update(true);
      this.animateRipple();
    }
  }

  /** */
  onAnimationComplete() {
    this.animating$.update(false);
    this.ids['background'].style.backgroundColor = null;

    // 'transitionend' is a dom (transition) event.
    // Use eventManager.on to receive it, else we receive it twice
    // this._parentEventManager.fire('transitionend', { node: this });
    this._parentEventManager.fire('transitionend', new CustomEvent('transitionend'));
  }

  /** */
  removeRipple(ripple) {
    var rippleIndex = this.ripples.indexOf(ripple);

    if (rippleIndex < 0) return;

    this.ripples.splice(rippleIndex, 1);
    ripple.remove();

    if (!this.ripples.length) this.animating$.update(false);
  }

  /**
   * simulate a click onto element
   */
  simulateRipple() {
    this.downAction(null);
    Promise.resolve().then(() => this.upAction(null));
  }

  /**
   * Provokes a ripple down effect via a UI event,
   * respecting the `noink` property.
   * @param {UIEvent=} event
   */
  uiDownAction(event) {
    if (!this.noink$.value) this.downAction(event);
  }

  /**
   * Provokes a ripple up effect via a UI event,
   * respecting the `noink` property.
   * @param {UIEvent=} event
   */
  uiUpAction(event) {
    if (!this.noink$.value) this.upAction(event);
  }

  /**
   * Provokes a ripple up effect via a UI event,
   * *not* respecting the `noink` property.
   * @param {UIEvent=} event
   */
  upAction(event) {
    if (this.holdDown$.value) return;

    this.ripples.forEach((ripple) => { ripple.upAction(event); });

    this.animating$.update(true);
    this.animateRipple();
  }
}

window.customElements.define('alg-paper-ripple', AlgPaperRipple);

export { AlgPaperRipple };
