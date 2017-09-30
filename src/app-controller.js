// @ts-check

import { AlgController } from './alg-components/controllers/alg-controller.js';
import { ObsNumber } from './alg-components/types/obsNumber.js';
import { ObsString } from './alg-components/types/obsString.js';

class AppController extends AlgController {
  /**
   * Controller Name
   * @override
   * @return {String}
   */
  get name() {
    return 'app-controller';
  }

  // @override
  defineBindings() {
    const bindings = super.defineBindings();
    bindings.set('btn1-color', this.btn1Color);
    bindings.set('btn1-text', this.btn1Text);
    bindings.set('btn1-style-margin', this.btn1StyleMargin);
    bindings.set('btn1-style-background-color', this.btn1StyleBackgroundColor);
    bindings.set('btn2-color', this.btn2Color);
    bindings.set('btn2-text', this.btn2Text);
    return bindings;
  }

  // TODO: btn as complex type?

  constructor() {
    super();

    // order is important
    this.btn1Text.initializer((value) => {
      let _value = Number.parseInt(value);
      if (!isNaN(_value)) this.btn1TextValue.init(_value);
    }).observe((value) => {
      this.btn2Color.set('blue');
      this.btn1Color.set('red');
      this.btn1StyleBackgroundColor.set('red');
    });

    this.btn1TextValue.observe((value) => {
      this.btn1Text.set(value.toString());
    }).init(4);

    this.btn2Text.initializer((value) => {
      let _value = Number.parseInt(value);
      if (!isNaN(_value)) this.btn2TextValue.init(_value);
    }).observe((value) => {
      this.btn2Color.set('red');
      this.btn1Color.set('blue');
      this.btn1StyleBackgroundColor.set('yellow');
    });

    this.btn2TextValue.observe((value) => {
      this.btn2Text.set(value.toString());
    }).init(15);

    window.addEventListener('load', () => {
      this.btn1Color.set('black');
      this.btn2Color.set('black');
      // this.btn1TextValue.set(3);
      // this.btn2TextValue.set(15);
    });
  }

  // observable btn1
  get btn1Color() {
    return this._btn1Color || (this._btn1Color = new ObsString('btn1Color').log());
  }

  get btn1TextValue() {
    return this._btn1TextValue || (this._btn1TextValue = new ObsNumber('btn1TextValue').log());
  }

  get btn1Text() {
    return this._btn1Text || (this._btn1Text = new ObsString('btn1Text').log());
  }

  get btn1StyleMargin() {
    return this._btn1StyleMargin || (this._btn1StyleMargin = new ObsString('btn1StyleMargin').log());
  }

  get btn1StyleBackgroundColor() {
    return this._btn1StyleBackgroundColor ||
      (this._btn1StyleBackgroundColor = new ObsString('btn1StyleBackgroundColor').log());
  }

  // observable btn2

  get btn2Color() {
    return this._btn2Color || (this._btn2Color = new ObsString('btn2Color').log());
  }

  get btn2TextValue() {
    return this._btn2TextValue || (this._btn2TextValue = new ObsNumber('btn2TextValue').log());
  }

  get btn2Text() {
    return this._btn2Text || (this._btn2Text = new ObsString().setName('btn2Text').log());
  }

  //
  fire(channel) {
    super.fire(channel);

    switch (channel) {
      case 'BTN1_CLICK':
        this.btn2TextValue.add(2);
        break;
      case 'BTN2_CLICK':
        this.btn1TextValue.add(3);
        break;
      default:
    }
  }
}

new AppController(); // to acces it: AlgController.controllers['app-controller']
document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('body').style.visibility = '';
});
export { AppController };
