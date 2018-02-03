// @copyright @polymer\iron-dropdown\iron-dropdown.js
// @copyright 2017-2018 adalberto.lacruz@gmail.com

import { AlgIronFitMixin } from '../src/mixins/alg-iron-fit-mixin.js';
import { AlgIronResizableMixin } from '../src/mixins/alg-iron-resizable-mixin.js';
import { AlgIronOverlayMixin } from '../src/mixins/alg-iron-overlay-mixin.js';
import { AlgPaperComponent } from '../src/base/alg-paper-component.js';
import { mixinFactory } from '../src/util/mixins.js';
// eslint-disable-next-line
import { RulesInstance } from '../styles/rules.js';

// iron-resizable-behavior
// iron-control-state
// neon-animation-runner-behavior
// iron-dropdown-scroll-manager

/**
 * `<iron-dropdown>` is a generalized element that is useful when you have
 * hidden content (`dropdown-content`) that is revealed due to some change in
 * state that should cause it to do so.
 *
 * Note that this is a low-level element intended to be used as part of other
 * composite elements that cause dropdowns to be revealed.
 *
 * Examples of elements that might be implemented using an `iron-dropdown`
 * include comboboxes, menubuttons, selects. The list goes on.
 *
 * The `<iron-dropdown>` element exposes attributes that allow the position
 * of the `dropdown-content` relative to the `dropdown-trigger` to be
 * configured.
 *
 *     <iron-dropdown horizontal-align="right" vertical-align="top">
 *       <div slot="dropdown-content">Hello!</div>
 *     </iron-dropdown>
 *
 * In the above example, the `<div>` assigned to the `dropdown-content` slot will be
 * hidden until the dropdown element has `opened` set to true, or when the `open`
 * method is called on the element.
 *
 * @class
 * @extends {AlgPaperComponent}
 */
class AlgIronDropdown extends
  mixinFactory(AlgPaperComponent, AlgIronFitMixin, AlgIronOverlayMixin, AlgIronResizableMixin) {
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
          position: fixed;
        }

        #contentWrapper ::slotted(*) {
          overflow: auto;
        }

        #contentWrapper.animating ::slotted(*) {
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
      <div id="contentWrapper">
        <slot id="content" name="dropdown-content"></slot>
      </div>
    `;

    return template;
  }

  deferredConstructor() {
    super.deferredConstructor();

    // Memoized scrolling position, used to block scrolling outside.
    this._scrollTop = 0;
    this._scrollLeft = 0;

    // Used to perform a non-blocking refit on scroll.
    this._refitOnScrollRAF = null;

    this.attributeManager
      // By default, the dropdown will constrain scrolling on the page to itself when opened.
      // Set to true in order to prevent scroll from being constrained to the dropdown when it opens.
      .define('allowOutsideScroll', 'boolean')

      .onChange('horizontal-align', this._updateOverlayPosition.bind(this))
      .onChange('horizontal-offset', this._updateOverlayPosition.bind(this))

      // Set to true to disable animations when opening and closing the dropdown.
      .define('noAnimations', 'boolean')

      .onChange('positionTarget', this._updateOverlayPosition.bind(this))

      .define('scroll-action', 'string')
      .on((value) => { console.log('scroll-action', value); })

      .onChange('vertical-align', this._updateOverlayPosition.bind(this))
      .onChange('vertical-offset', this._updateOverlayPosition.bind(this));
  }

  /**
   * Attributes managed by the component
   * @override
   * @return {Array<String>}
   */
  static get observedAttributes() {
    return super.observedAttributes.concat(['allowOutsideScroll', 'noAnimations',
      'scroll-action']);
  }

  /**
   * An animation config. If provided, this will be used to animate the
   * closing of the dropdown. Pass an Array for multiple animations.
   * See `neon-animation` documentation for more animation configuration
   * details.
   * @type {Array<Object>}
   */
  get closeAnimationConfig() { return this._closeAnimationConfig || (this._closeAnimationConfig = []); }
  set closeAnimationConfig(value) { this._closeAnimationConfig = value; }

  /**
   * If provided, this will be the element that will be focused when
   * the dropdown opens.
   */
  get focusTarget() { return this._focusTarget; }
  set focusTarget(value) { this._focusTarget = value; }

  /**
   * An animation config. If provided, this will be used to animate the
   * opening of the dropdown. Pass an Array for multiple animations.
   * See `neon-animation` documentation for more animation configuration
   * details.
   * @type {Array<Object>}
   */
  get openAnimationConfig() { return this._openAnimationConfig || (this._openAnimationConfig = []); }
  set openAnimationConfig(value) { this._openAnimationConfig = value; }

  /**
   * Updates the overlay position based on configured horizontal and vertical alignment.
   */
  _updateOverlayPosition() {
    if (this.loadedComponent) {
      // This triggers iron-resize, and iron-overlay-behavior will call refit if needed.
      // @ts-ignore
      this.notifyResize();
    }
  }

//   /**
//    * Callback for scroll events.
//    * @type {Function}
//    * @private
//    */
//   _boundOnCaptureScroll: {
//     type: Function,
//     value: function() {
//       return this._onCaptureScroll.bind(this);
//     }
// }
//   },

// listeners: {
//   'neon-animation-finish': '_onNeonAnimationFinish'
// },

// observers: [
//   '_updateOverlayPosition(positionTarget, verticalAlign, horizontalAlign, verticalOffset, horizontalOffset)'
// ],

//   /**
//    * The element that is contained by the dropdown, if any.
//    */
//   get containedElement() {
//   // Polymer 2.x returns slot.assignedNodes which can contain text nodes.
//   var nodes = dom(this.$.content).getDistributedNodes();
//   for (var i = 0, l = nodes.length; i < l; i++) {
//     if (nodes[i].nodeType === Node.ELEMENT_NODE) {
//       return nodes[i];
//     }
//   }
// },

// attached: function () {
//   if (!this.sizingTarget || this.sizingTarget === this) {
//     this.sizingTarget = this.containedElement || this;
//   }
// },

// detached: function() {
//   this.cancelAnimation();
//   document.removeEventListener('scroll', this._boundOnCaptureScroll);
//   IronDropdownScrollManager.removeScrollLock(this);
// },

// /**
//  * Called when the value of `opened` changes.
//  * Overridden from `IronOverlayBehavior`
//  */
// _openedChanged: function() {
//   if (this.opened && this.disabled) {
//     this.cancel();
//   } else {
//     this.cancelAnimation();
//     this._updateAnimationConfig();
//     this._saveScrollPosition();
//     if (this.opened) {
//       document.addEventListener('scroll', this._boundOnCaptureScroll);
//       !this.allowOutsideScroll && IronDropdownScrollManager.pushScrollLock(this);
//     } else {
//       document.removeEventListener('scroll', this._boundOnCaptureScroll);
//       IronDropdownScrollManager.removeScrollLock(this);
//     }
//     IronOverlayBehaviorImpl._openedChanged.apply(this, arguments);
//   }
// },

// /**
//  * Overridden from `IronOverlayBehavior`.
//  */
// _renderOpened: function() {
//   if (!this.noAnimations && this.animationConfig.open) {
//     this.$.contentWrapper.classList.add('animating');
//     this.playAnimation('open');
//   } else {
//     IronOverlayBehaviorImpl._renderOpened.apply(this, arguments);
//   }
// },

// /**
//  * Overridden from `IronOverlayBehavior`.
//  */
// _renderClosed: function() {
//   if (!this.noAnimations && this.animationConfig.close) {
//     this.$.contentWrapper.classList.add('animating');
//     this.playAnimation('close');
//   } else {
//     IronOverlayBehaviorImpl._renderClosed.apply(this, arguments);
//   }
// },

// /**
//  * Called when animation finishes on the dropdown (when opening or
//  * closing). Responsible for "completing" the process of opening or
//  * closing the dropdown by positioning it or setting its display to
//  * none.
//  */
// _onNeonAnimationFinish: function() {
//   this.$.contentWrapper.classList.remove('animating');
//   if (this.opened) {
//     this._finishRenderOpened();
//   } else {
//     this._finishRenderClosed();
//   }
// },

// _onCaptureScroll: function() {
//   if (!this.allowOutsideScroll) {
//     this._restoreScrollPosition();
//   } else {
//     this._refitOnScrollRAF && window.cancelAnimationFrame(this._refitOnScrollRAF);
//     this._refitOnScrollRAF = window.requestAnimationFrame(this.refit.bind(this));
//   }
// },

// /**
//  * Memoizes the scroll position of the outside scrolling element.
//  * @private
//  */
// _saveScrollPosition: function() {
//   if (document.scrollingElement) {
//     this._scrollTop = document.scrollingElement.scrollTop;
//     this._scrollLeft = document.scrollingElement.scrollLeft;
//   } else {
//     // Since we don't know if is the body or html, get max.
//     this._scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
//     this._scrollLeft = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
//   }
// },

// /**
//  * Resets the scroll position of the outside scrolling element.
//  * @private
//  */
// _restoreScrollPosition: function() {
//   if (document.scrollingElement) {
//     document.scrollingElement.scrollTop = this._scrollTop;
//     document.scrollingElement.scrollLeft = this._scrollLeft;
//   } else {
//     // Since we don't know if is the body or html, set both.
//     document.documentElement.scrollTop = this._scrollTop;
//     document.documentElement.scrollLeft = this._scrollLeft;
//     document.body.scrollTop = this._scrollTop;
//     document.body.scrollLeft = this._scrollLeft;
//   }
// },

// /**
//  * Constructs the final animation config from different properties used
//  * to configure specific parts of the opening and closing animations.
//  */
// _updateAnimationConfig: function() {
//   // Update the animation node to be the containedElement.
//   var animationNode = this.containedElement;
//   var animations = [].concat(this.openAnimationConfig || []).concat(this.closeAnimationConfig || []);
//   for (var i = 0; i < animations.length; i++) {
//     animations[i].node = animationNode;
//   }
//   this.animationConfig = {
//     open: this.openAnimationConfig,
//     close: this.closeAnimationConfig
//   };
// },

// /**
//  * Apply focus to focusTarget or containedElement
//  */
// _applyFocus: function() {
//   var focusTarget = this.focusTarget || this.containedElement;
//   if (focusTarget && this.opened && !this.noAutoFocus) {
//     focusTarget.focus();
//   } else {
//     IronOverlayBehaviorImpl._applyFocus.apply(this, arguments);
//   }
// }
}

window.customElements.define('alg-iron-dropdown', AlgIronDropdown);

export { AlgIronDropdown };
