// @copyright 2017-2018 adalberto.lacruz@gmail.com
/* global mocha chai describe it before beforeEach */
import { AlgComponent } from '../../lib/src/base/alg-component.js';
import { AlgController } from '../../lib/controller/alg-controller.js';
// import { Observable } from '../../lib/src/types/observable.js';
import { TYPE_STRING } from '../../lib/src/util/constants.js';

let assert = chai.assert;

class Controller extends AlgController {
  get name() { return 'controller'; }

  constructor() {
    super();

    this.define('component-text', TYPE_STRING);
    this.define('component-color', TYPE_STRING);
  }

  // defineBindings() {
  //   const bindings = super.defineBindings();
  //   bindings.set('component-text', this.componentText);
  //   bindings.set('component-color', this.componentColor);
  //   return bindings;
  // }

  // get componentText() {
  //   return this._componentText || (this._componentText = new Observable('componentText').setType('string'));
  // }

  // get componentColor() {
  //   return this._componentColor || (this._componentColor = new Observable('componentColor').setType('string'));
  // }
}

class Component extends AlgComponent {
  deferredConstructor() {
    console.log('deferred');
    this.attributeManager
      .define('color', TYPE_STRING)

      .define('text', TYPE_STRING);

    this.messageManager
      .define('click', { toEvent: true, isPreBinded: true });
  }

  // addDefaultEventHandlers() {
  //   this.eventHandlers.set('click', null);
  // }

  // get attributeHandlers() {
  //   return this._attributeHandlers || (this._attributeHandlers = super.attributeHandlers
  //     .set('text', this.bindedText)
  //     .set('color', this.bindedColor));
  // }

  // bindedColor(attrName, value) {
  //   if (this.bindedAttributeSuper(attrName, value)) return;
  //   this._color = value;
  // }

  // bindedText(attrName, value) {
  //   if (this.bindedAttributeSuper(attrName, value)) return;
  //   this._text = value;
  // }
}
window.customElements.define('test-component', Component);

export function TestAlgComponent() {
  describe('alg-component', () => {
    /** @type {AlgComponent} */
    let component;

    /** @type {AlgController} */
    let appController;

    before(() => {
      appController = new Controller();
      component = /**  @type {AlgComponent} */ (document.createElement('test-component'));
      component.deferredConstructor();
      component.controller = appController.name;
      component.domLoaded();
    });

    it('on-handler (on-click="[[controller:COMPONENT_CLICK]]")', () => {
      component.attributeChangedCallback('on-click', null, '[[controller:COMPONENT_CLICK]]');
      const message = component.messageManager.get('click');
      const channel = message.channel;
      const controller = message.controllerHandler.name;

      assert.equal(controller, 'controller', 'controller name');
      assert.equal(channel, 'COMPONENT_CLICK', 'channel name');
    });

    it('attribute binder (text="[[controller:component-text=default-text]]")', () => {
      component.attributeChangedCallback('text', null, '[[controller:component-text=default-text]]');
      const text = component.attributeManager.getValue('text');
      assert.equal(text, 'default-text');
    });
    it('attribute binder (color="{{controller:component-color=default-color}}")', () => {
      component.attributeChangedCallback('color', null, '{{controller:component-color=default-color}}');
      const color = component.attributeManager.getValue('color');
      assert.equal(color, 'default-color');
    });
    it('attribute static (text="text-value")', () => {
      component.attributeChangedCallback('text', null, 'text-value');
      const text = component.attributeManager.getValue('text');
      assert.equal(text, 'text-value');
    });
    it('attribute style (style="color:[[controller:component-color=yellow]];background-color=red")', () => {
      component.attributeChangedCallback('style', null, 'color:[[controller:component-color=yellow]];background-color=red');
      assert.equal(component.style['color'], 'yellow', 'color style');
      assert.equal(component.style['background-color'], 'red', 'background-color style');
    });
  });
}
