// @copyright @polymer\iron-image\iron-image.js 3.0.0-pre.1 20170822
// @copyright 2017-2018 ALG

import { AlgPaperComponent } from '../paper/alg-paper-component.js';
import { EventManager } from '../types/event-manager.js';
import * as FHtml from '../util/f-html.js';
import { resolveUrl } from '../util/resolve-url.js';

/**
 * iron-image is an element for displaying an image that provides useful sizing and preloading
 * options not found on the standard <img> tag.
 * The sizing option allows the image to be either cropped (cover) or letterboxed (contain)
 * to fill a fixed user-size placed on the element.
 * The preload option prevents the browser from rendering the image until the image is fully loaded.
 * In the interim, either the element's CSS background-color can be be used as the placeholder,
 * or the placeholder property can be set to a URL (preferably a data-URI, for instant rendering)
 * for an placeholder image.
 * The fade option (only valid when preload is set) will cause the placeholder image/color
 * to be faded out once the image is rendered.
 *
 * Mixins:
 *  --iron-image-placeholder
 *
 * Varaibles:
 *  --iron-image-height
 *  --iron-image-width
 *
 * @class
 */
class AlgIronImage extends AlgPaperComponent {
  /**
   * Build the static template for style - static. this.apply let custom styles.
   * @override
   * @return {HTMLTemplateElement} The template Element with style
   */
  createTemplateStyle() {
    let template = super.createTemplateStyle();
    template.innerHTML = `
      <style>
        :host {
          display: inline-block;
          overflow: hidden;
          position: relative;
        }

        #baseURIAnchor {
          display: none;
        }

        #sizedImgDiv {
          position: absolute;
          top: 0px;
          right: 0px;
          bottom: 0px;
          left: 0px;

          display: none;
        }

        #img {
          display: block;
          width: var(--iron-image-width, auto);
          height: var(--iron-image-height, auto);
        }

        :host([sizing]) #sizedImgDiv {
          display: block;
        }

        :host([sizing]) #img {
          display: none;
        }

        #placeholder {
          position: absolute;
          top: 0px;
          right: 0px;
          bottom: 0px;
          left: 0px;

          background-color: inherit;
          opacity: 1;

          ${this.apply('--iron-image-placeholder')}
        }

        #placeholder.faded-out {
          transition: opacity 0.5s linear;
          opacity: 0;
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
    /*
    <a id="baseURIAnchor" href="#"></a>
    <div id="sizedImgDiv" role="img" hidden\$="[[_computeImgDivHidden(sizing)]]" aria-hidden\$="[[_computeImgDivARIAHidden(alt)]]" aria-label\$="[[_computeImgDivARIALabel(alt, src)]]"></div>
    <img id="img" alt\$="[[alt]]" hidden\$="[[_computeImgHidden(sizing)]]" crossorigin\$="[[crossorigin]]" on-load="_imgOnLoad" on-error="_imgOnError">
    <div id="placeholder" hidden\$="[[_computePlaceholderHidden(preload, fade, loading, loaded)]]" class\$="[[_computePlaceholderClassName(preload, fade, loading, loaded)]]"></div>
    */
    template.innerHTML = `
      <a id="baseURIAnchor" href="#"></a>
      <div id="sizedImgDiv" role="img"></div>
      <img id="img">
      <div id="placeholder"></div>
    `;
    this.selfClass.templateIds = this.searchTemplateIds(template.innerHTML);

    return template;
  }

  constructor() {
    super();

    this._resolvedSrc = '';
    this.imgEventManager = new EventManager(this.ids['img'])
      .on('load', this._imgOnLoad.bind(this))
      .on('error', this._imgOnError.bind(this))
      .subscribe();

    this.attributeManager
      // A short text alternative for the image.
      .define('alt', 'string')
      .on((value) => {
        if (value != null) this.ids['img'].setAttribute('alt', value);
        FHtml.attributeToggle(this.ids['sizedImgDiv'], 'aria-hidden', value === '', { type: 'true-remove' });
      })
      .on(this._computeImgDivARIALabel.bind(this))
      .defaultAndUpdate(null)

      // CORS enabled images support: https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image
      .define('crossorigin', 'string')
      .on((value) => {
        if (value != null) this.ids['img'].setAttribute('crossorigin', value);
      })
      .defaultAndUpdate(null)

      // Read-only value that indicates that the last set `src` failed to load.
      .define('error', 'boolean')

      // When `preload` is true, setting `fade` to true will cause the image to
      // fade into place.
      .define('fade', 'boolean')
      .on(this._computePlaceholderHidden.bind(this))
      .on(this._computePlaceholderClassName.bind(this))

      // Can be used to set the height of image (e.g. via binding); size may also be
      // set via CSS.
      .define('height', 'string') // NUMBER
      .on((value) => {
        this.style.height = isNaN(value) ? value : value + 'px';
      })

      // Read-only value that is true when the image is loaded.
      .define('loaded', 'boolean')
      .on(this._computePlaceholderHidden.bind(this))
      .on(this._computePlaceholderClassName.bind(this))

      // Read-only value that tracks the loading state of the image when the `preload`
      // option is used.
      .define('loading', 'boolean')
      .on(this._computePlaceholderHidden.bind(this))
      .on(this._computePlaceholderClassName.bind(this))

      // This image will be used as a background/placeholder until the src image has
      // loaded.  Use of a data-URI for placeholder is encouraged for instant rendering.
      .define('placeholder', 'string')
      .on((value) => {
        this.ids['placeholder'].style.backgroundImage = value ? `url("${value}")` : '';
      })

      // When a sizing option is used (`cover` or `contain`), this determines
      // how the image is aligned within the element bounds.
      .define('position', 'string')
      .on(this._transformChanged.bind(this))
      .default('center')

      // When `true`, any change to the `src` property will cause the `placeholder`
      // image to be shown until the new image has loaded.
      .define('preload', 'boolean')
      .on(this._computePlaceholderHidden.bind(this))
      .on(this._computePlaceholderClassName.bind(this))

      // When true, the image is prevented from loading and any placeholder is
      // shown.This may be useful when a binding to the src property is known to
      // be invalid, to prevent 404 requests.
      .define('preventLoad', 'boolean')
      .on(this._loadStateObserver.bind(this))
      .default(false)

      // Sets a sizing option for the image.  Valid values are `contain` (full
      // aspect ratio of the image is contained within the element and
      // letterboxed) or`cover`(image is cropped in order to fully cover the
      // bounds of the element), or`null`(default: image takes natural size).
      .define('sizing', 'string')
      .reflect()
      .on(this._transformChanged.bind(this))
      .on((value) => {
        FHtml.attributeToggle(this.ids['img'], 'hidden', !!value, { type: '-remove' });
        FHtml.attributeToggle(this.ids['sizedImgDiv'], 'hidden', !value, { type: '-remove' });
      })
      .defaultAndUpdate(null) // Update because we have readed 'position'

      // The URL of an image.
      .define('src', 'string')
      .on(this._loadStateObserver.bind(this))
      .on(this._computeImgDivARIALabel.bind(this))
      .defaultAndUpdate('') // Update because we have readed 'preventLoad'

      // Can be used to set the width of image(e.g.via binding); size may also be
      // set via CSS.
      .define('width', 'string') // NUMBER
      .on((value) => {
        this.style.width = isNaN(value) ? value : value + 'px';
      });
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this.imgEventManager.unsubscribe();
  }

  /**
   * Attributes managed by the component
   * @override
   * @return {Array<String>}
   */
  static get observedAttributes() {
    return super.observedAttributes.concat(['alt', 'crossorigin', 'fade', 'height',
      'placeholder', 'position', 'preload', 'preventLoad', 'sizing', 'src', 'width']);
  }
  /**
   * No add anything
   */
  addStandardAttributes() {}

  _computeImgDivARIALabel() {
    const attributeManager = this.attributeManager;
    /** @type {String} */
    let ariaLabel;

    const alt = attributeManager.getValue('alt');
    const src = attributeManager.getValue('src');
    if (alt !== null) {
      ariaLabel = alt;
    } else if (src === '') {
      ariaLabel = '';
    } else {
      // NOTE: Use of `URL` was removed here because IE11 doesn't support constructing it.
      const resolved = this._resolveSrc(src);
      // Remove query parts, get file name.
      ariaLabel = resolved.replace(/[?|#].*/g, '').split('/').pop();
    }
    this.ids['sizedImgDiv'].setAttribute('aria-label', ariaLabel);
  }

  _computePlaceholderHidden() {
    const attributeManager = this.attributeManager;
    const hidden = !attributeManager.getValue('preload') ||
      (!attributeManager.getValue('fade') &&
        !attributeManager.getValue('loading') &&
        attributeManager.getValue('loaded'));

    FHtml.attributeToggle(this.ids['placeholder'], 'hidden', hidden, { type: '-remove' });
  }

  _computePlaceholderClassName() {
    const attributeManager = this.attributeManager;
    const classValue = attributeManager.getValue('preload') &&
      attributeManager.getValue('fade') &&
      !attributeManager.getValue('loading') &&
      attributeManager.getValue('loaded');
    this.ids['placeholder'].classList.toggle('faded-out', classValue);
  }

  _imgOnError() {
    const attributeManager = this.attributeManager;
    if (this.ids['img'].src !== this._resolveSrc(attributeManager.getValue('src'))) return;

    this.ids['img'].removeAttribute('src');
    this.ids['sizedImgDiv'].style.backgroundImage = '';

    attributeManager.change('loading', false);
    attributeManager.change('loaded', false);
    attributeManager.change('error', true);
  }

  _imgOnLoad() {
    const attributeManager = this.attributeManager;
    if (this.ids['img'].src !== this._resolveSrc(attributeManager.getValue('src'))) return;

    attributeManager.change('loading', false);
    attributeManager.change('loaded', true);
    attributeManager.change('error', false);
  }

  /**
   * load src image
   */
  _loadStateObserver() {
    const attributeManager = this.attributeManager;
    const src = this.attributeManager.getValue('src');
    const preventLoad = this.attributeManager.getValue('preventLoad');

    const newResolvedSrc = this._resolveSrc(src);
    if (newResolvedSrc === this._resolvedSrc) return;

    this._resolvedSrc = '';
    this.ids['img'].removeAttribute('src');
    this.ids['sizedImgDiv'].style.backgroundImage = '';

    if (src === '' || preventLoad) {
      attributeManager.change('loading', false);
      attributeManager.change('loaded', false);
      attributeManager.change('error', false);
    } else {
      this._resolvedSrc = newResolvedSrc;
      this.ids['img'].src = this._resolvedSrc;
      this.ids['sizedImgDiv'].style.backgroundImage = `url("${newResolvedSrc}")`;
      attributeManager.change('loading', true);
      attributeManager.change('loaded', false);
      attributeManager.change('error', false);
    }
  }

  /**
   *
   * @param {String} testSrc
   * @return {String}
   */
  _resolveSrc(testSrc) {
    let resolved = resolveUrl(testSrc, this.ids['baseURIAnchor'].href);

    // NOTE: Use of `URL` was removed here because IE11 doesn't support constructing it.
    if (resolved[0] === '/') {
      // In IE location.origin might not work
      // https://connect.microsoft.com/IE/feedback/details/1763802/location-origin-is-undefined-in-ie-11-on-windows-10-but-works-on-windows-7
      resolved = (location.origin || location.protocol + '//' + location.host) + resolved;
    }
    return resolved;
  }

  _transformChanged() {
    const attributeManager = this.attributeManager;
    const sizedImgDivStyle = this.ids['sizedImgDiv'].style;
    const placeholderStyle = this.ids['placeholder'].style;

    sizedImgDivStyle.backgroundSize = placeholderStyle.backgroundSize =
      attributeManager.getValue('sizing');

    sizedImgDivStyle.backgroundPosition = placeholderStyle.backgroundPosition =
      attributeManager.getValue('sizing') ? attributeManager.getValue('position') : '';

    sizedImgDivStyle.backgroundRepeat = placeholderStyle.backgroundRepeat =
      attributeManager.getValue('sizing') ? 'no-repeat' : '';
  }
}

window.customElements.define('alg-iron-image', AlgIronImage);

export { AlgIronImage };