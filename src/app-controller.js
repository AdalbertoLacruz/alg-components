// @ts-check

import { AlgController } from './alg-components/controllers/alg-controller.js';
import { ObsNumber } from './alg-components/types/obs-number.js';
import { ObsString } from './alg-components/types/obs-string.js';
import * as Str from './alg-components/util/util-str.js';

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
    this._isLog = true;

    window.addEventListener('load', () => {
      this.btn1.init(5);
      this.btn2.init(10);
    });
  }

  get btn1() {
    return this._btn1 || (this._btn1 = new ButtonObservable('btn1', this._isLog));
  }

  get btn2() {
    return this._btn2 || (this._btn2 = new ButtonObservable('btn2', this._isLog));
  }

  get logData() {
    // @ts-ignore
    return this._logData || (this._logData = window.AlgLog.register);
  }

  //
  fire(channel, message) {
    console.log('app-controller channel:', channel, 'message:', message);
    super.fire(channel, message);

    switch (channel) {
      case 'BTN1_CLICK':
        this.btn2.push();
        this.btn1.relax();
        break;
      case 'BTN2_CLICK':
        this.btn1.push();
        this.btn2.relax();
        break;
      default:
    }
  }
}

class ButtonObservable {
  constructor(name = '', isLog = false) {
    this._name = name;
    this._isLog = isLog;
    // order is important
    this.btnText.initializer((value) => {
      let _value = Number.parseInt(value);
      if (!isNaN(_value)) this.btnTextValue.init(_value);
    });
    this.btnTextValue.observe((value) => {
      this.btnText.update(value.toString());
    }).init(0);
  }

  get btnColor() {
    return this._btnColor || (this._btnColor = new ObsString(`${this._name}Color`).log(this._isLog));
  }

  get btnTextValue() {
    return this._btnTextValue || (this._btnTextValue = new ObsNumber(`${this._name}TextValue`).log(this._isLog));
  }

  get btnText() {
    return this._btnText || (this._btnText = new ObsString(`${this._name}Text`).log(this._isLog));
  }

  get btnStyleMargin() {
    return this._btnStyleMargin || (this._btnStyleMargin = new ObsString(`${this._name}StyleMargin`).log(this._isLog));
  }

  get btnStyleBackgroundColor() {
    return this._btnStyleBackgroundColor ||
      (this._btnStyleBackgroundColor = new ObsString(`${this._name}StyleBackgroundColor`).log(this._isLog));
  }

  get bindings() {
    return this._bindings || (this._bindings = new Map());
  }

  init(value) {
    this.btnTextValue.update(value);
    this.btnColor.update('black');
    this.btnStyleBackgroundColor.update('black');
    return this;
  }

  push() {
    this.btnTextValue.add(1);
    this.btnColor.update('red');
    this.btnStyleBackgroundColor.update('red');
  }

  relax() {
    this.btnColor.update('blue');
    this.btnStyleBackgroundColor.update('yellow');
  }

  /**
   * Associates an action with a channel
   *
   * @param  {String} channel
   * @param  {any} defaultValue - if no null, set the value in channel
   * @param  {Function} action - to process a change in dispatch
   * @param  {Object} status - channel information
   * @return {any} - value
   */
  subscribe(channel, defaultValue, action, status) {
    const bind = this.getBinding(channel);
    if (!bind) {
      status.hasChannel = false;
      return defaultValue;
    }
    this.bindings.set(action, bind);
    return bind.subscribe(channel, defaultValue, action, status);
  }

  /**
   * Remove the susbscriber
   * @param {Function} handler
   */
  unSubscribe(handler) {
    const bind = this.bindings.get(handler);
    if (bind) bind.unSubscribe(handler);
  };

  /**
   * Search a channel as observable
   * channel is like btn1-style-margin and must search for btnStyleMargin
   * @param {String} channel
   * @return {*} Observable
   */
  getBinding(channel) {
    let value = Str.dashReplace(channel, 'btn', 0);
    value = Str.dashToCamelString(value);

    return this[value];
  }
}

new AppController(); // to acces it: AlgController.controllers['app-controller']
document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('body').style.visibility = '';
});

export { AppController };
