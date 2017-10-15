// @copyright @polymer\paper-ripple\paper-ripple.js
// @copyright 2017 ALG
// @ts-check
/* global cssRules */

import { AlgPaperComponent } from './alg-paper-component.js';
import { EventManager } from '../types/event-manager.js';
import { ObsBoolean } from '../types/obs-boolean.js';
import { Ripple } from '../util/ripple.js';

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

  /** True when there are visible ripples animating within the element. @return {ObsBoolean} */
  get animating() {
    return this._animating || (this._animating = new ObsBoolean('animating', false)
      .onChangeReflectToAttribute(this));
  }

  /** If true, ripples will center inside its container. @return {Boolean} */
  get center() { return this._center || (this._center = false); }

  /** The initial opacity set on the wave. @return {Number} */
  get initialOpacity() { return this._initialOpacity || (this._initialOpacity = 0.25); }

  /**
   * If true, the ripple will remain in the "down" state until `holdDown` is set to false again.
   * @return {ObsBoolean}
   */
  get holdDown() {
    return this._holdDown || (this._holdDown = new ObsBoolean('holdDown', false)
      .observe(this._holdDownChanged.bind(this)));
  }

  /**
   * If true, the ripple will not generate a ripple effect via pointer interaction.
   * Calling ripple's imperative api like `simulatedRipple` will still generate the ripple effect.
   * @return {Boolean}
   */
  get noink() { return this._noink || (this._noink = false); }

  /** How fast (opacity per second) the wave fades out. @return {Number} */
  get opacityDecayVelocity() { return this._opacityDecayVelocity || (this._opacityDecayVelocity = 0.8); }

  /**
   * If true, ripples will exhibit a gravitational pull towards the center of
   * their container as they fade away.
   * @return {Boolean}
   */
  get recenters() { return this._recenters || (this._recenters = false); }

  /** A list of the visual ripples. @return {Array} */
  get ripples() { return this._ripples || (this._ripples = []); }

  /** @return {Boolean} */
  get shouldKeepAnimating() {
    for (let index = 0; index < this.ripples.length; ++index) {
      if (!this.ripples[index].isAnimationComplete) {
        return true;
      }
    }

    return false;
  }

  /**
   * Called every time the element is inserted into the DOM
   * @override
   */
  connectedCallback() {
    super.connectedCallback();
    // Set up a11yKeysBehavior to listen to key events on the target,
    // so that space and enter activate the ripple even if the target doesn't
    // handle key events. The key handlers deal with `noink` themselves.
    const keyEventTarget = this.keyEventTarget = (this.parentNode.nodeType === 11)
      // @ts-ignore
      ? this.getRootNode().host
      : this.parentNode;

    const eventManager /** @type {EventManager} */ = (keyEventTarget.eventManager != null)
      ? keyEventTarget.eventManager
      : new EventManager(keyEventTarget);
    eventManager
      .on('mousedown', (event) => {
        const ripple = this.addRipple();
        ripple.downAction(event);
        if (!this.animating.value) {
          this.animating.update(true);
          this.animate();
        }
      }).on('mouseup', () => {
        this.ripples.forEach((ripple) => { ripple.upAction(event); });

        this.animating.update(true);
        this.animate();
      }).subscribe();
  }

  /** no standard attributes @override */
  addStandardAttributes() {}

  addRipple() {
    const ripple = new Ripple(this);
    this.ids['waves'].appendChild(ripple.waveContainer);
    this.ids['background'].style.backgroundColor = ripple.color;
    this.ripples.push(ripple);

    this.animating.update(true);

    return ripple;
  }

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
      window.requestAnimationFrame(this.animate.bind(this));
    }
  }

  _holdDownChanged() {

  }

  onAnimationComplete() {
    this.animating.update(false);
    this.ids['background'].style.backgroundColor = null;
    // this.fire('transitionend');
  }

  removeRipple(ripple) {
    var rippleIndex = this.ripples.indexOf(ripple);

    if (rippleIndex < 0) return;

    this.ripples.splice(rippleIndex, 1);
    ripple.remove();

    if (!this.ripples.length) this.animating.update(false);
  }
}

window.customElements.define('alg-paper-ripple', AlgPaperRipple);

export { AlgPaperRipple };
