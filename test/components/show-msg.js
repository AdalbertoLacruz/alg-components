// @copyright 2017-2018 adalberto.lacruz@gmail.com

import { AlgComponent } from '../../lib/src/base/alg-component.js';
// eslint-disable-next-line
import { RulesInstance } from '../../lib/styles/rules.js';

// import { mixinFactory } from '../../../lib/src/util/mixins.js';

/**
 * @extends { AlgComponent}
 * @class
 */
// class TemplateComponent extends mixinFactory(AlgPaperComponent, mixin) {
class ShowMsg extends AlgComponent {
  /**
   * Build the static template for style - static. this.apply let custom styles.
   * @override
   * @param {RulesInstance} css
   * @return {HTMLTemplateElement} The template Element with style
   */
  createTemplateStyle(css) {
    let template = super.createTemplateStyle(css);
    template.innerHTML = `
      <style>
        :host {
          position: relative;
          width: 100%;
          height: 180px;
          outline: none;
        }

        :host:active {
          background-color: red;
        }

        #msg {
          border: solid grey 1px;
          position: absolute;
          top: 70px;
          bottom: 5px;
          overflow-y: scroll;
          left: 5px;
          right: 5px;
        }

        #msg > span {
          display: block;
          padding: 5px 0px 0px 5px;
        }
      </style>
    `;
    return template;
  }

  /**
   * Build for the class (static) templateElement, templateStyle and templateIds.
   * @override
   * @return {HTMLTemplateElement} The template Element to be cloned in the shadow creation
   */
  createTemplate() {
    let template = super.createTemplate();
    template.innerHTML = `
      <slot></slot>
      <div id="msg">
      </div>
    `;

    return template;
  }

  constructor() {
    super();

    this.controller = this;
  }

  /** @override */
  deferredConstructor() {
    super.deferredConstructor();

    // this.displayMessage('message 0');
    // this.displayMessage('message 1');
    // this.displayMessage('message 1');
    // this.displayMessage('message 1');
    // this.displayMessage('message 1');
    // this.displayMessage('message 1');
    // this.displayMessage('message 1');
    // this.displayMessage('message 1');
    // this.displayMessage('message 1');
  }

  /**
   * Show a message
   * @param {String} text
   */
  displayMessage(text) {
    this.ids['msg'].innerHTML += `<span>${text}</span>`;
  }

  // CONTROLLER

  fire(channel, message) {
    const msg = this.ids['msg'];

    const timeNow = new Date(Date.now());
    const stamp = `${timeNow.toLocaleTimeString()}.${timeNow.getMilliseconds().toString().padStart(3, '0')}`;

    msg.innerHTML += `<span>${stamp} ${channel} = ${message}</span>`;
    msg.scrollTop = msg.scrollHeight;
  }

  /**
   * Associates an action with a channel
   *
   * @param  {String} channel
   * @param  {any} defaultValue - if no null, set the value in channel
   * @param  {Function} action - to process a change in dispatch - handler
   * @param  {Object} status - channel information
   * @return {any} - value
   */
  subscribe(channel, defaultValue, action, status) {
    // const bind = this.getBinding(channel);
    // if (!bind) {
    //   status.hasChannel = false;
    //   return defaultValue;
    // }
    // return bind.subscribe(channel, defaultValue, action, status);
    console.log('controller subscribe:', channel);
    status.hasChannel = false;
    return null;
  }
}

window.customElements.define('show-msg', ShowMsg);

export { ShowMsg };
