// @ts-check

import { AlgController, TYPE_NUMBER } from './alg-components/controllers/alg-controller.js';

class AppController extends AlgController {
  /**
   * Controller Name
   * @override
   * @return {String}
   */
  get name() {
    return 'app-controller';
  }

  constructor() {
    super();

    // TODO: init()
    this.setRegisterType('btn1-label', TYPE_NUMBER);
    this.setRegisterType('btn2-label', TYPE_NUMBER);

    this.btn1ColorValue = 'blue';
    this.btn1LabelValue = 0;
    this.btn2ColorValue = 'blue';
    this.btn2LabelValue = 0;
  }

  set btn1ColorValue(value) {
    this.setRegisterValue(null, 'btn1-color', value, true, true);
  }

  get btn1LabelValue() {
    return this.getRegisterItem('btn1-label').value;
  }

  set btn1LabelValue(value) {
    this.setRegisterValue(null, 'btn1-label', value, true, true);
  }

  set btn2ColorValue(value) {
    this.setRegisterValue(null, 'btn2-color', value, true, true);
  }

  get btn2LabelValue() {
    return this.getRegisterItem('btn2-label').value;
  }

  set btn2LabelValue(value) {
    this.setRegisterValue(null, 'btn2-label', value, true, true);
  }

  //
  fire(message) {
    // TODO: directorio de message/function
    super.fire(message);

    switch (message) {
      case 'BTN1_CLICK':
        this.btn2LabelValue = this.btn2LabelValue + 1;
        this.btn1ColorValue = 'red';
        this.btn2ColorValue = 'blue';
        break;
      case 'BTN2_CLICK':
        this.btn1LabelValue = this.btn1LabelValue + 1;
        this.btn2ColorValue = 'red';
        this.btn1ColorValue = 'blue';
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
