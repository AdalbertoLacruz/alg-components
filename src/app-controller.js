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
    bindings.set('btn1-label', this.btn1Label);
    bindings.set('btn2-color', this.btn2Color);
    bindings.set('btn2-label', this.btn2Label);
    return bindings;
  }

  constructor() {
    super();

    // order is important
    this.btn1Label.initializer((value) => {
      this.btn1LabelValue.init(Number.parseInt(value));
    }).observe((value) => {
      this.btn2Color.set('blue');
      this.btn1Color.set('red');
    });

    this.btn1LabelValue.observe((value) => {
      this.btn1Label.set(value.toString());
    }).init(4);

    this.btn2Label.initializer((value) => {
      this.btn2LabelValue.init(Number.parseInt(value));
    }).observe((value) => {
      this.btn2Color.set('red');
      this.btn1Color.set('blue');
    });

    this.btn2LabelValue.observe((value) => {
      this.btn2Label.set(value.toString());
    }).init(15);

    window.addEventListener('load', () => {
      this.btn1Color.set('black');
      this.btn2Color.set('black');
    });
  }

  // observable btn1
  get btn1Color() {
    return this._btn1Color || (this._btn1Color = new ObsString('btn1Color').log());
  }

  get btn1LabelValue() {
    return this._btn1LabelValue || (this._btn1LabelValue = new ObsNumber('btn1LabelValue').log());
  }

  get btn1Label() {
    return this._btn1Label || (this._btn1Label = new ObsString('btn1Label').log());
  }

  // observable btn2

  get btn2Color() {
    return this._btn2Color || (this._btn2Color = new ObsString('btn2Color').log());
  }

  get btn2LabelValue() {
    return this._btn2LabelValue || (this._btn2LabelValue = new ObsNumber('btn2LabelValue').log());
  }

  get btn2Label() {
    return this._btn2Label || (this._btn2Label = new ObsString().setName('btn2Label').log());
  }

  //
  fire(channel) {
    super.fire(channel);

    switch (channel) {
      case 'BTN1_CLICK':
        this.btn2LabelValue.add(2);
        break;
      case 'BTN2_CLICK':
        this.btn1LabelValue.add(3);
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
