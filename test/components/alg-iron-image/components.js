import '../demo-pages.js';
import './style.js';

import { AlgIronImage } from '../../../lib/components/alg-iron-image.js';

document.body.style.opacity = null;

// @ts-ignore
window.load = (id) => {
  // document.getElementById(id).src = "./polymer.svg?" + Math.random(); // not supported property changes

  document.getElementById(id).setAttribute('src', './polymer.svg?');
};
