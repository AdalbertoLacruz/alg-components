// @copyright 2017-2018 adalberto.lacruz@gmail.com

import { AlgController } from '../lib/controller/alg-controller.js';
import { TYPE_NUM, TYPE_STRING } from '../lib/src/util/constants.js';

/**
 * @class
 */
class AppController extends AlgController {
  /**
   * @constructor
   */
  constructor() {
    super();

    this.define('btn1-text', TYPE_NUM, 5);
    this.define('btn1-color', TYPE_STRING, 'red');
    this.define('btn1-style-margin', TYPE_STRING);
    this.define('btn1-style-background-color', TYPE_STRING, 'black');
    this.define('btn1-classbind', TYPE_STRING, 'circle');

    this.define('btn2-text', TYPE_NUM, 10);
    this.define('btn2-color', TYPE_STRING, 'black');
    this.define('btn2-style-margin', TYPE_STRING);
    this.define('btn2-style-background-color', TYPE_STRING, 'black');
    this.define('btn2-classbind', TYPE_STRING, 'circle');

    this.register.get('bus')
      .observe((value) => {
        console.log(`BUS: ${value.channel} = `, value.message);
      });
  }

  /**
   * Controller Name
   * @override
   * @return {String}
   */
  get name() { return 'app-controller'; }

  /**
   * @override
   * @param {String} channel
   * @param {*} message
   */
  fire(channel, message) {
    super.fire(channel, message);

    switch (channel) {
      case 'BTN1_CLICK':
        this.btn2Push();
        this.btn1Relax();
        break;
      case 'BTN2_CLICK':
      case 'BTN2_ACTION':
        this.btn1Push();
        this.btn2Relax();
        break;
      default:
        break;
    }
  }

  btn1Push() {
    this.change('btn1-text', this.getValue('btn1-text') + 1);
    this.change('btn1-color', 'red');
    this.change('btn1-style-background-color', 'red');
    this.change('btn1-classbind', '+circle');
  }

  btn1Relax() {
    this.change('btn1-color', 'blue');
    this.change('btn1-style-background-color', 'yellow');
    this.change('btn1-classbind', '-circle');
  }

  btn2Push() {
    this.change('btn2-text', this.getValue('btn2-text') + 1);
    this.change('btn2-color', 'red');
    this.change('btn2-style-background-color', 'red');
    this.change('btn2-classbind', '+circle');
  }

  btn2Relax() {
    this.change('btn2-color', 'blue');
    this.change('btn2-style-background-color', 'yellow');
    this.change('btn2-classbind', '-circle');
  }
}

new AppController();

export { AppController };
