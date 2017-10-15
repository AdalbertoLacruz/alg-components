// @copyright @polymer\paper-behaviors\paper-ripple-behavior.js
// @copyright 2017 ALG
// @ts-check

import './alg-paper-ripple.js';

class AlgPaperRippleBehavior {
  constructor(item) {
    this.item = item;
    // console.log(this.ripple);
    this.a = this.ripple; // TODO:
  }

  get ripple() {
    return this._ripple || (this._ripple = (() => {
      const element = document.createElement('alg-paper-ripple');
      element.controller = '';
      this.item.shadowRoot.appendChild(element);
      return element;
    })());
  }
}

export { AlgPaperRippleBehavior };
