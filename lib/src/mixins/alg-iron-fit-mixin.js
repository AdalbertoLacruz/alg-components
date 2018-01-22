// @copyright @polymer\iron-fit-behavior\iron-fit-behavior.js
// @copyright 2017-2018 adalberto.lacruz@gmail.com

/**
 * Mixin Behavior
 * Set the component Position
 *
 * @param {*} base
 */
export const AlgIronFitMixin = (base) => class extends base {
  constructor() {
    // @ts-ignore
    super();

    this.attributeManager
      // The orientation against which to align the dropdown content horizontally
      // relative to the dropdown trigger `positionTarget`.
      // Possible values are "left", "right", "auto".
      .define('horizontal-align', 'string')
      .on((value) => {
        this.fitImpl.horizontalAlign = value;
      })
      .reflect()
      .defaultAndUpdate('left')

      // A pixel value that will be added to the position calculated for the
      // given`horizontalAlign`, in the direction of alignment.You can think
      // of it as increasing or decreasing the distance to the side of the
      // screen given by`horizontalAlign`.
      //
      // If`horizontalAlign` is "left", this offset will increase or decrease
      // the distance to the left side of the screen: a negative offset will
      // move the dropdown to the left; a positive one, to the right.
      //
      // Conversely if `horizontalAlign` is "right", this offset will increase
      // or decrease the distance to the right side of the screen: a negative
      // offset will move the dropdown to the right; a positive one, to the left.
      .define('horizontal-offset', 'string')
      .on((value) => {
        this.fitImpl.horizontalOffset = Number.parseInt(value);
      })

      // The element that should be used to position the element. If not set, it will
      // default to the parent node.
      .define('positionTarget', 'object') // HTMLElement
      .on((value) => {
        this.fitImpl.positionTarget = value;
      })

      // The orientation against which to align the dropdown content
      // vertically relative to the dropdown trigger `positionTarget`.
      // Possible values are "top", "bottom", "auto".
      .define('vertical-align', 'string')
      .on((value) => {
        this.fitImpl.verticalAlign = value;
      })
      .reflect()
      .defaultAndUpdate('top')

      // A pixel value that will be added to the position calculated for the
      // given`verticalAlign`, in the direction of alignment.You can think
      // of it as increasing or decreasing the distance to the side of the
      // screen given by`verticalAlign`.
      //
      // If`verticalAlign` is "top", this offset will increase or decrease
      // the distance to the top side of the screen: a negative offset will
      // move the dropdown upwards; a positive one, downwards.
      //
      // Conversely if `verticalAlign` is "bottom", this offset will increase
      // or decrease the distance to the bottom side of the screen: a negative
      // offset will move the dropdown downwards; a positive one, upwards.
      .define('vertical-offset', 'string')
      .on((value) => {
        this.fitImpl.verticalOffset = Number.parseInt(value);
      });
  }

  connectedCallback() {
    super.connectedCallback();

    this.fitImpl.connectedCallback();
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this.fitImpl.disconnectedCallback();
  }

  /**
   * Attributes managed by the component
   * @override
   * @return {Array<String>}
   */
  static get observedAttributes() {
    return super.observedAttributes.concat(['horizontal-align', 'horizontal-offset',
      'vertical-align', 'vertical-offset']);
  }

  /** Path to class implementation */
  // @ts-ignore
  get fitImpl() { return this._fitImpl || (this._fitImpl = new AlgIronFitImpl(this)); }

  /**
   * Set to true to auto-fit on attach.
   * @param {Boolean} value
   */
  set autoFitOnAttach(value) { this.fitImpl.autoFitOnAttach = value; }

  /**
   * If true, it will use `horizontalAlign` and `verticalAlign` values as preferred alignment
   * and if there's not enough space, it will pick the values which minimize the cropping.
   * @param {Boolean} value
   */
  set dynamicAlign(value) { this.fitImpl.dynamicAlign = value; }

  /**
   * The element to fit `this` into.
   * @param {HTMLElement} value
   */
  set fitInto(value) { this.fitImpl.fitInto = value; }

  /**
   * Will position the element around the positionTarget without overlapping it.
   * @param {Boolean} value
   */
  set noOverlap(value) { this.fitImpl.noOverlap = value; }

  /**
   *
   * The element that will receive a `max-height`/`width`. By default it is the same as `this`,
   * but it can be set to a child element. This is useful, for example, for implementing a
   * scrolling region inside the element.
   * @param {HTMLElement} value
   */
  set sizingTarget(value) { this.fitImpl.sizingTarget = value; }

  /**
   * Centers horizontally and vertically if not already positioned. This also sets
   * `position:fixed`.
   */
  center() {
    this.fitImpl.center();
  }

  /**
   * Constrains the size of the element to `fitInto` by setting `max-height`
   * and/or `max-width`.
   */
  constrain() {
    this.fitImpl.constrain();
  }

  /**
   * Positions and fits the element into the `fitInto` element.
   */
  fit() {
    this.fitImpl.fit();
  }

  /**
   * Positions the element according to `horizontalAlign, verticalAlign`.
   */
  position() {
    this.fitImpl.position();
  }

  /**
   * Equivalent to calling `resetFit()` and `fit()`. Useful to call this after
   * the element or the `fitInto` element has been resized, or if any of the
   * positioning properties (e.g. `horizontalAlign, verticalAlign`) is updated.
   * It preserves the scroll position of the sizingTarget.
   */
  refit() {
    this.fitImpl.refit();
  }

  /**
   * Resets the target element's position and size constraints, and clear
   * the memoized data.
   */
  resetFit() {
    this.fitImpl.refit();
  }
};

/**
 * AlgIronOverlayBehavior Implementation
 */
class AlgIronFitImpl {
  /**
   * @param {HTMLElement} me
   */
  constructor(me) {
    /** HTMLElement to move */
    this.me = me;

    /** @type {Boolean} */
    this.autoFitOnAttach = false;

    /** @type {Number} */
    this.__deferredFit = null;

    /** @type {Boolean} */
    this.dynamicAlign = false;

    /** @type {Object} */
    this._fitInfo = null;

    /** @type {HTMLElement|Window} */
    this.fitInto = window;

    /** @type {String} */
    this.horizontalAlign = null;

    /** @type {Number} */
    this.horizontalOffset = 0;

    /** @type {Boolean} */
    this._isRTL = window.getComputedStyle(this.me).direction === 'rtl';

    /** @type {Boolean} */
    this.noOverlap = false;

    /** @type {HTMLElement} */
    this.positionTarget = null;

    /** @type {HTMLElement} */
    this.sizingTarget = me;

    /** @type {String} */
    this.verticalAlign = null;

    /** @type {Number} */
    this.verticalOffset = 0;
  }

  connectedCallback() {
    this.positionTarget = this.positionTarget || this._defaultPositionTarget;

    if (this.autoFitOnAttach) {
      if (window.getComputedStyle(this.me).display === 'none') {
        setTimeout(() => { this.fit(); });
      } else {
        // // NOTE: shadydom applies distribution asynchronously
        // // for performance reasons webcomponents/shadydom#120
        // // Flush to get correct layout info.
        // window.ShadyDOM && ShadyDOM.flush();
        this.fit();
      }
    }
  }

  disconnectedCallback() {
    if (this.__deferredFit) {
      clearTimeout(this.__deferredFit);
      this.__deferredFit = null;
    }
  }

  /**
   * The element that should be used to position the element,
   * if no position target is configured.
   * @type {HTMLElement}
   */
  get _defaultPositionTarget() {
    let parent = this.me.parentNode;

    if (parent && parent.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
      parent = /** @type {ShadowRoot} */ (parent).host;
      // parent = parent.host;
    }

    return parent;
  }

  /** @type {Number} - not used? */
  get _fitHeight() {
    let fitHeight;
    if (this.fitInto === window) {
      fitHeight = this.fitInto.innerHeight;
    } else {
      fitHeight = /** @type {HTMLElement} */ (this.fitInto).getBoundingClientRect().height;
    }
    return fitHeight;
  }

  /** @type {Number} - not used? */
  get _fitLeft() {
    let fitLeft;
    if (this.fitInto === window) {
      fitLeft = 0;
    } else {
      fitLeft = /** @type {HTMLElement} */ (this.fitInto).getBoundingClientRect().left;
    }
    return fitLeft;
  }

  /** @type {Number} - not used? */
  get _fitTop() {
    let fitTop;
    if (this.fitInto === window) {
      fitTop = 0;
    } else {
      fitTop = /** @type {HTMLElement} */ (this.fitInto).getBoundingClientRect().top;
    }
    return fitTop;
  }

  /** type {Number} -not used? */
  get _fitWidth() {
    let fitWidth;
    if (this.fitInto === window) {
      fitWidth = this.fitInto.innerWidth;
    } else {
      fitWidth = /** @type {HTMLElement} */ (this.fitInto).getBoundingClientRect().width;
    }
    return fitWidth;
  }

  /**
   * The horizontal align value, accounting for the RTL/LTR text direction.
   * @type {String}
   */
  get _localeHorizontalAlign() {
    if (this._isRTL) {
      // In RTL, "left" becomes "right".
      if (this.horizontalAlign === 'right') {
        return 'left';
      }
      if (this.horizontalAlign === 'left') {
        return 'right';
      }
    }
    return this.horizontalAlign;
  }

  /**
   * Centers horizontally and vertically if not already positioned. This also sets
   * `position:fixed`.
   */
  center() {
    if (this.horizontalAlign || this.verticalAlign) return;

    this._discoverInfo();

    const positionedBy = this._fitInfo.positionedBy;
    if (positionedBy.vertically && positionedBy.horizontally) {
      // Already positioned.
      return;
    }

    // Need position:fixed to center
    this.me.style.position = 'fixed';
    // Take into account the offset caused by parents that create stacking
    // contexts (e.g. with transform: translate3d). Translate to 0,0 and
    // measure the bounding rect.
    if (!positionedBy.vertically) {
      this.me.style.top = '0px';
    }
    if (!positionedBy.horizontally) {
      this.me.style.left = '0px';
    }

    // It will take in consideration margins and transforms
    var rect = this.me.getBoundingClientRect();
    var fitRect = this.__getNormalizedRect(this.fitInto);
    if (!positionedBy.vertically) {
      const top = fitRect.top - rect.top + (fitRect.height - rect.height) / 2;
      this.me.style.top = top + 'px';
    }
    if (!positionedBy.horizontally) {
      const left = fitRect.left - rect.left + (fitRect.width - rect.width) / 2;
      this.me.style.left = left + 'px';
    }
  }

  /**
   * Constrains the size of the element to `fitInto` by setting `max-height` and/or `max-width`.
   */
  constrain() {
    if (this.horizontalAlign || this.verticalAlign) return;

    this._discoverInfo();
    const info = this._fitInfo;

    // position at (0px, 0px) if not already positioned, so we can measure the natural size.
    if (!info.positionedBy.vertically) {
      this.me.style.position = 'fixed';
      this.me.style.top = '0px';
    }
    if (!info.positionedBy.horizontally) {
      this.me.style.position = 'fixed';
      this.me.style.left = '0px';
    }

    // need border-box for margin/padding
    this.sizingTarget.style.boxSizing = 'border-box';
    // constrain the width and height if not already set
    const rect = this.me.getBoundingClientRect();
    if (!info.sizedBy.height) {
      this.__sizeDimension(rect, info.positionedBy.vertically, 'top', 'bottom', 'Height');
    }
    if (!info.sizedBy.width) {
      this.__sizeDimension(rect, info.positionedBy.horizontally, 'left', 'right', 'Width');
    }
  }

  /**
   * Memorize information needed to position and size the target element.
   */
  _discoverInfo() {
    if (this._fitInfo) return;

    const target = window.getComputedStyle(this.me);
    const sizer = window.getComputedStyle(this.sizingTarget);

    this._fitInfo = {
      inlineStyle: {
        top: this.me.style.top || '',
        left: this.me.style.left || '',
        position: this.me.style.position || ''
      },
      sizerInlineStyle: {
        maxWidth: this.sizingTarget.style.maxWidth || '',
        maxHeight: this.sizingTarget.style.maxHeight || '',
        boxSizing: this.sizingTarget.style.boxSizing || ''
      },
      positionedBy: {
        vertically: target.top !== 'auto' ? 'top' : (target.bottom !== 'auto' ? 'bottom' : null),
        horizontally: target.left !== 'auto' ? 'left' : (target.right !== 'auto' ? 'right' : null)
      },
      sizedBy: {
        height: sizer.maxHeight !== 'none',
        width: sizer.maxWidth !== 'none',
        minWidth: parseInt(sizer.minWidth, 10) || 0,
        minHeight: parseInt(sizer.minHeight, 10) || 0
      },
      margin: {
        top: parseInt(target.marginTop, 10) || 0,
        right: parseInt(target.marginRight, 10) || 0,
        bottom: parseInt(target.marginBottom, 10) || 0,
        left: parseInt(target.marginLeft, 10) || 0
      }
    };
  }

  /**
   * Positions and fits the element into the `fitInto` element.
   */
  fit() {
    this.position();
    this.constrain();
    this.center();
  }

  __getCroppedArea(position, size, fitRect) {
    const verticalCrop = Math.min(0, position.top) + Math.min(0, fitRect.bottom - (position.top + size.height));
    const horizontalCrop = Math.min(0, position.left) + Math.min(0, fitRect.right - (position.left + size.width));
    return Math.abs(verticalCrop) * size.width + Math.abs(horizontalCrop) * size.height;
  }

  __getNormalizedRect(target) {
    if (target === document.documentElement || target === window) {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
        right: window.innerWidth,
        bottom: window.innerHeight
      };
    }
    return target.getBoundingClientRect();
  }

  __getPosition(hAlign, vAlign, size, positionRect, fitRect) {
    // All the possible configurations.
    // Ordered as top-left, top-right, bottom-left, bottom-right.
    const positions = [{
      verticalAlign: 'top',
      horizontalAlign: 'left',
      top: positionRect.top + this.verticalOffset,
      left: positionRect.left + this.horizontalOffset
    }, {
      verticalAlign: 'top',
      horizontalAlign: 'right',
      top: positionRect.top + this.verticalOffset,
      left: positionRect.right - size.width - this.horizontalOffset
    }, {
      verticalAlign: 'bottom',
      horizontalAlign: 'left',
      top: positionRect.bottom - size.height - this.verticalOffset,
      left: positionRect.left + this.horizontalOffset
    }, {
      verticalAlign: 'bottom',
      horizontalAlign: 'right',
      top: positionRect.bottom - size.height - this.verticalOffset,
      left: positionRect.right - size.width - this.horizontalOffset
    }];

    if (this.noOverlap) {
      // Duplicate.
      for (let i = 0, l = positions.length; i < l; i++) {
        const copy = {};
        for (const key in positions[i]) {
          copy[key] = positions[i][key];
        }
        // @ts-ignore
        positions.push(copy);
      }
      // Horizontal overlap only.
      positions[0].top = positions[1].top += positionRect.height;
      positions[2].top = positions[3].top -= positionRect.height;
      // Vertical overlap only.
      positions[4].left = positions[6].left += positionRect.width;
      positions[5].left = positions[7].left -= positionRect.width;
    }

    // Consider auto as null for coding convenience.
    vAlign = vAlign === 'auto' ? null : vAlign;
    hAlign = hAlign === 'auto' ? null : hAlign;

    let position;
    for (let i = 0; i < positions.length; i++) {
      const pos = positions[i];

      // If both vAlign and hAlign are defined, return exact match.
      // For dynamicAlign and noOverlap we'll have more than one candidate, so
      // we'll have to check the croppedArea to make the best choice.
      if (!this.dynamicAlign && !this.noOverlap &&
        pos.verticalAlign === vAlign && pos.horizontalAlign === hAlign) {
        position = pos;
        break;
      }

      // Align is ok if alignment preferences are respected. If no preferences,
      // it is considered ok.
      const alignOk = (!vAlign || pos.verticalAlign === vAlign) &&
        (!hAlign || pos.horizontalAlign === hAlign);

      // Filter out elements that don't match the alignment (if defined).
      // With dynamicAlign, we need to consider all the positions to find the
      // one that minimizes the cropped area.
      if (!this.dynamicAlign && !alignOk) continue;

      position = position || pos;
      pos.croppedArea = this.__getCroppedArea(pos, size, fitRect);
      const diff = pos.croppedArea - position.croppedArea;
      // Check which crops less. If it crops equally, check if align is ok.
      if (diff < 0 || (diff === 0 && alignOk)) position = pos;

      // If not cropped and respects the align requirements, keep it.
      // This allows to prefer positions overlapping horizontally over the
      // ones overlapping vertically.
      if (position.croppedArea === 0 && alignOk) break;
    }

    return position;
  }

  /**
   * Positions the element according to `horizontalAlign, verticalAlign`.
   */
  position() {
    // needs to be centered, and it is done after constrain.
    if (!this.horizontalAlign && !this.verticalAlign) return;

    this._discoverInfo();

    this.me.style.position = 'fixed';
    // Need border-box for margin/padding.
    this.sizingTarget.style.boxSizing = 'border-box';
    // Set to 0, 0 in order to discover any offset caused by parent stacking contexts.
    this.me.style.left = '0px';
    this.me.style.top = '0px';

    const rect = this.me.getBoundingClientRect();
    const positionRect = this.__getNormalizedRect(this.positionTarget);
    const fitRect = this.__getNormalizedRect(this.fitInto);

    const margin = this._fitInfo.margin;

    // Consider the margin as part of the size for position calculations.
    const size = {
      width: rect.width + margin.left + margin.right,
      height: rect.height + margin.top + margin.bottom
    };

    var position = this.__getPosition(this._localeHorizontalAlign, this.verticalAlign, size, positionRect, fitRect);

    let left = position.left + margin.left;
    let top = position.top + margin.top;

    // We first limit right/bottom within fitInto respecting the margin,
    // then use those values to limit top/left.
    const right = Math.min(fitRect.right - margin.right, left + rect.width);
    const bottom = Math.min(fitRect.bottom - margin.bottom, top + rect.height);

    // Keep left/top within fitInto respecting the margin.
    left = Math.max(fitRect.left + margin.left, Math.min(left, right - this._fitInfo.sizedBy.minWidth));
    top = Math.max(fitRect.top + margin.top, Math.min(top, bottom - this._fitInfo.sizedBy.minHeight));

    // Use right/bottom to set maxWidth/maxHeight, and respect minWidth/minHeight.
    this.sizingTarget.style.maxWidth = Math.max(right - left, this._fitInfo.sizedBy.minWidth) + 'px';
    this.sizingTarget.style.maxHeight = Math.max(bottom - top, this._fitInfo.sizedBy.minHeight) + 'px';

    // Remove the offset caused by any stacking context.
    this.me.style.left = (left - rect.left) + 'px';
    this.me.style.top = (top - rect.top) + 'px';
  }

  /**
   * Equivalent to calling `resetFit()` and `fit()`. Useful to call this after
   * the element or the `fitInto` element has been resized, or if any of the
   * positioning properties (e.g. `horizontalAlign, verticalAlign`) is updated.
   * It preserves the scroll position of the sizingTarget.
   */
  refit() {
    const scrollLeft = this.sizingTarget.scrollLeft;
    const scrollTop = this.sizingTarget.scrollTop;
    this.resetFit();
    this.fit();
    this.sizingTarget.scrollLeft = scrollLeft;
    this.sizingTarget.scrollTop = scrollTop;
  }

  /**
   * Resets the target element's position and size constraints, and clear
   * the memorized data.
   */
  resetFit() {
    const info = this._fitInfo || {};

    for (const property in info.sizerInlineStyle) {
      this.sizingTarget.style[property] = info.sizerInlineStyle[property];
    }

    for (const property in info.inlineStyle) {
      this.me.style[property] = info.inlineStyle[property];
    }

    this._fitInfo = null;
  }

  __sizeDimension(rect, positionedBy, start, end, extent) {
    const info = this._fitInfo;
    const fitRect = this.__getNormalizedRect(this.fitInto);
    const max = extent === 'Width' ? fitRect.width : fitRect.height;
    const flip = (positionedBy === end);
    const offset = flip ? max - rect[end] : rect[start];
    const margin = info.margin[flip ? start : end];
    const offsetExtent = 'offset' + extent;
    const sizingOffset = this[offsetExtent] - this.sizingTarget[offsetExtent];
    this.sizingTarget.style['max' + extent] = (max - margin - offset - sizingOffset) + 'px';
  }
}
