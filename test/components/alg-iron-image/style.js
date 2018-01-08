// @copyright @polymer
// @copyright 2017 ALG

import * as css from '../../../src/alg-components/util/css-style.js';

css.style('style', `
  .vertical-section-container {
    max-width: 630px;
  }

  .example {
    margin: 4px;
    flex: 1;
  }

  code {
    white-space: nowrap;
  }

  #example-sizing-cover {
    width: 150px;
    height: 150px;
    background: #ddd;
  }

  #example-sizing-contain {
    width: 150px;
    height: 150px;
    background: #ddd;
  }

  #example-full-width-container {
    width: 200px;
    border: 2px solid #444;
    background: #444;
  }

  #example-full-width-container alg-iron-image {
    background: #ddd;
  }

  #example-full-width {
    width: 100%;
    --iron-image-width: 100%;
  }

  #example-half-width {
    width: 50%;
    --iron-image-width: 100%;
  }

  #example-full-height-container {
    height: 150px;
    border: 2px solid #444;
    background: #444;
  }

  #example-full-height-container alg-iron-image{
    background: #ddd;
  }

  #example-full-height {
    height: 100%;
    --iron-image-height: 100%;
  }

  #example-half-height {
    height: 50%;
    --iron-image-height: 100%;
  }

  .example.without-preload alg-iron-image {
    width: 150px;
    height: 150px;
    background: #ddd;
  }

  .example.preload alg-iron-image {
    width: 150px;
    height: 150px;
    background: #ddd;
    --iron-image-placeholder: {
      background: #939ed5;
    };
  }

  .example.preload-image alg-iron-image {
    width: 150px;
    height: 150px;
    background: #ddd;
  }
`);
