import '../demo-pages.js';
import './style.js';

import { AlgIronImage } from '../../../src/alg-components/iron/alg-iron-image.js';
import { AlgPaperButton } from '../../../src/alg-components/paper/alg-paper-button.js';

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('body').style.visibility = '';
});

// @ts-ignore
window.load = (id) => {
  // document.getElementById(id).src = "./polymer.svg?" + Math.random(); // not supported property changes

  document.getElementById(id).setAttribute('src', './polymer.svg?');
};
