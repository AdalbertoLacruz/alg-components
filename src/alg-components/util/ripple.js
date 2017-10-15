// @copyright @polymer\paper-ripple\paper-ripple.js
// @copyright 2017 ALG
// @ts-check

const RIPPLE_MAX_RADIUS = 300;

class Ripple {
  /**
   * @param {HTMLElement} element
   * @constructor
   */
  constructor(element) {
    this.element = element;
    this.color = window.getComputedStyle(element).color;

    this.wave = document.createElement('div');
    this.waveContainer = document.createElement('div');
    this.wave.style.backgroundColor = this.color;
    this.wave.classList.add('wave');
    this.waveContainer.classList.add('wave-container');
    this.waveContainer.appendChild(this.wave);

    this.resetInteractionState();
  }

  /** @return {Boolean} */
  get center() { return this.element.center; }

  /** @return {Number} */
  get initialOpacity() { return this.element.initialOpacity; }

  /** @return {Boolean} */
  get isAnimationComplete() {
    return this.mouseUpStart ? this.isOpacityFullyDecayed : this.isRestingAtMaxRadius;
  }

  /** @return {Boolean} */
  get isMouseDown() {
    return this.mouseDownStart && !this.mouseUpStart;
  }

  /** @return {Boolean} */
  get isOpacityFullyDecayed() {
    return this.opacity < 0.01 &&
      this.radius >= Math.min(this.maxRadius, RIPPLE_MAX_RADIUS);
  }

  /** @return {Boolean} */
  get isRestingAtMaxRadius() {
    return this.opacity >= this.initialOpacity &&
      this.radius >= Math.min(this.maxRadius, RIPPLE_MAX_RADIUS);
  }

  /** @return {Number} */
  get mouseDownElapsed() {
    let elapsed;

    if (!this.mouseDownStart) return 0;

    elapsed = Utility.now() - this.mouseDownStart;

    if (this.mouseUpStart) {
      elapsed -= this.mouseUpElapsed;
    }

    return elapsed;
  }

  /** @return {Number} */
  get mouseDownElapsedSeconds() { return this.mouseDownElapsed / 1000; }

  /** @return {Number} */
  get mouseInteractionSeconds() {
    return this.mouseDownElapsedSeconds + this.mouseUpElapsedSeconds;
  }

  /** @return {Number} */
  get mouseUpElapsed() {
    return this.mouseUpStart ? Utility.now() - this.mouseUpStart : 0;
  }

  /** @return {Number} */
  get mouseUpElapsedSeconds() { return this.mouseUpElapsed / 1000; }

  /** @return {Number} */
  get opacity() {
    if (!this.mouseUpStart) return this.initialOpacity;

    return Math.max(
      0,
      this.initialOpacity - this.mouseUpElapsedSeconds * this.opacityDecayVelocity
    );
  }

  /** @return {Number} */
  get opacityDecayVelocity() { return this.element.opacityDecayVelocity; }

  /** @return {Number} */
  get outerOpacity() {
    // Linear increase in background opacity, capped at the opacity
    // of the wavefront (waveOpacity).
    const outerOpacity = this.mouseUpElapsedSeconds * 0.3;
    const waveOpacity = this.opacity;

    return Math.max(0, Math.min(outerOpacity, waveOpacity));
  }

  /** @return {Number} */
  get radius() {
    const width2 = this.containerMetrics.width * this.containerMetrics.width;
    const height2 = this.containerMetrics.height * this.containerMetrics.height;
    const waveRadius = Math.min(Math.sqrt(width2 + height2), RIPPLE_MAX_RADIUS) * 1.1 + 5;

    const duration = 1.1 - 0.2 * (waveRadius / RIPPLE_MAX_RADIUS);
    const timeNow = this.mouseInteractionSeconds / duration;
    const size = waveRadius * (1 - Math.pow(80, -timeNow));

    return Math.abs(size);
  }

  /** @return {Boolean} */
  get recenters() { return this.element.recenters; }

  /** @return {Number} */
  get translationFraction() {
    return Math.min(1, this.radius / this.containerMetrics.size * 2 / Math.sqrt(2));
  }

  /** @return {Number} */
  get xNow() {
    if (this.xEnd) {
      return this.xStart + this.translationFraction * (this.xEnd - this.xStart);
    }

    return this.xStart;
  }

  /** @return {Number} */
  get yNow() {
    if (this.yEnd) {
      return this.yStart + this.translationFraction * (this.yEnd - this.yStart);
    }

    return this.yStart;
  }

  /** @param {UIEvent=} event */
  downAction(event) {
    const xCenter = this.containerMetrics.width / 2;
    const yCenter = this.containerMetrics.height / 2;

    this.resetInteractionState();
    this.mouseDownStart = Utility.now(); // TODO:

    if (this.center) {
      this.xStart = xCenter;
      this.yStart = yCenter;
      this.slideDistance = Utility.distance(this.xStart, this.yStart, this.xEnd, this.yEnd);
    } else {
      this.xStart = event
        ? event.x - this.containerMetrics.boundingRect.left
        : this.containerMetrics.width / 2;
      this.yStart = event
        ? event.y - this.containerMetrics.boundingRect.top
        : this.containerMetrics.height / 2;
    }

    if (this.recenters) {
      this.xEnd = xCenter;
      this.yEnd = yCenter;
      this.slideDistance = Utility.distance(this.xStart, this.yStart, this.xEnd, this.yEnd);
    }

    this.maxRadius = this.containerMetrics.furthestCornerDistanceFrom(this.xStart, this.yStart);

    this.waveContainer.style.top =
      (this.containerMetrics.height - this.containerMetrics.size) / 2 + 'px';
    this.waveContainer.style.left =
      (this.containerMetrics.width - this.containerMetrics.size) / 2 + 'px';

    this.waveContainer.style.width = this.containerMetrics.size + 'px';
    this.waveContainer.style.height = this.containerMetrics.size + 'px';
  }

  draw() {
    this.wave.style.opacity = this.opacity.toString();

    const scale = this.radius / (this.containerMetrics.size / 2);
    const dx = this.xNow - (this.containerMetrics.width / 2);
    const dy = this.yNow - (this.containerMetrics.height / 2);

    // 2d transform for safari because of border-radius and overflow:hidden clipping bug.
    // https://bugs.webkit.org/show_bug.cgi?id=98538
    this.waveContainer.style.webkitTransform = 'translate(' + dx + 'px, ' + dy + 'px)';
    this.waveContainer.style.transform = 'translate3d(' + dx + 'px, ' + dy + 'px, 0)';
    this.wave.style.webkitTransform = 'scale(' + scale + ',' + scale + ')';
    this.wave.style.transform = 'scale3d(' + scale + ',' + scale + ',1)';
  }

  remove() {
    this.waveContainer.parentNode.removeChild(this.waveContainer);
  }

  resetInteractionState() {
    this.maxRadius = 0;
    this.mouseDownStart = 0;
    this.mouseUpStart = 0;

    this.xStart = 0;
    this.yStart = 0;
    this.xEnd = 0;
    this.yEnd = 0;
    this.slideDistance = 0;

    this.containerMetrics = new ElementMetrics(this.element);
  }

  /** @param {Event=} event */
  upAction(event) {
    if (!this.isMouseDown) return;

    this.mouseUpStart = Utility.now();
  }
}

class ElementMetrics {
  /**
   * @param {HTMLElement} element
   * @constructor
   */
  constructor(element) {
    this.element = element;
    this.width = this.boundingRect.width;
    this.height = this.boundingRect.height;

    this.size = Math.max(this.width, this.height);
  }

  /**
   * @return {ClientRect}
   */
  get boundingRect() {
    return this.element.getBoundingClientRect();
  }

  /**
   *
   * @param {Number} x
   * @param {Number} y
   * @return {Number}
   */
  furthestCornerDistanceFrom(x, y) {
    const topLeft = Utility.distance(x, y, 0, 0);
    const topRight = Utility.distance(x, y, this.width, 0);
    const bottomLeft = Utility.distance(x, y, 0, this.height);
    const bottomRight = Utility.distance(x, y, this.width, this.height);

    return Math.max(topLeft, topRight, bottomLeft, bottomRight);
  }
}

class Utility {
  /**
   *
   * @param {Number} x1
   * @param {Number} y1
   * @param {Number} x2
   * @param {Number} y2
   * @return {Number}
   */
  static distance(x1, y1, x2, y2) {
    const xDelta = (x1 - x2);
    const yDelta = (y1 - y2);

    return Math.sqrt(xDelta * xDelta + yDelta * yDelta);
  }

  /** @return {Number} */
  static now() {
    return window.performance && window.performance.now
      ? window.performance.now.bind(window.performance)()
      : Date.now();
  }
}

export { Ripple };
