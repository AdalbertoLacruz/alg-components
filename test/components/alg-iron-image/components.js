import '../demo-pages.js';
import './style.js';
document.body.style.opacity = null;

import { AlgIronImage } from '../../../lib/components/alg-iron-image.js';

// @ts-ignore
window.load = (id) => {
  // document.getElementById(id).src = "./polymer.svg?" + Math.random(); // not supported property changes

  document.getElementById(id).setAttribute('src', './polymer.svg?');
};
