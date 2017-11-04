// @copyright 2017 ALG
/* global mocha chai describe it before beforeEach */
import { AlgComponent } from '../../src/alg-components/components/alg-component.js';
import { AlgController } from '../../src/alg-components/controllers/alg-controller.js';
import { ObsString } from '../../src/alg-components/types/obs-string.js';

let assert = chai.assert;

class Controller extends AlgController {
  get name() {
    return 'controller';
  }
  defineBindings() {
    const bindings = super.defineBindings();
    bindings.set('component-text', this.componentText);
    bindings.set('component-color', this.componentColor);
    return bindings;
  }

  get componentText() {
    return this._componentText || (this._componentText = new ObsString('componentText'));
  }

  get componentColor() {
    return this._componentColor || (this._componentColor = new ObsString('componentColor'));
  }
}

class Component extends AlgComponent {
  addDefaultEventHandlers() {
    this.eventHandlers.set('click', null);
  }

  get attributeHandlers() {
    return this._attributeHandlers || (this._attributeHandlers = super.attributeHandlers
      .set('text', this.bindedText)
      .set('color', this.bindedColor));
  }

  bindedColor(attrName, value) {
    if (this.bindedAttributeSuper(attrName, value)) return;
    this._color = value;
  }

  bindedText(attrName, value) {
    if (this.bindedAttributeSuper(attrName, value)) return;
    this._text = value;
  }
}
window.customElements.define('test-component', Component);

export function TestAlgComponent() {
  describe('alg-component', () => {
    let component;
    let appController;
    before(() => {
      appController = new Controller();
      component = document.createElement('test-component');
      component.loaded = true;
      component.controller = appController.name;
    });

    it('on-handler (on-click="[[controller:COMPONENT_CLICK]]")', () => {
      component.attributeChangedCallback('on-click', null, '[[controller:COMPONENT_CLICK]]');
      const handler = component.eventHandlers.get('click');
      const controller = handler.controller;
      const channel = handler.channel;

      assert.equal(controller, 'controller', 'controller name');
      assert.equal(channel, 'COMPONENT_CLICK', 'channel name');
    });

    it('attribute binder (text="[[controller:component-text:default-text]]")', () => {
      component.attributeChangedCallback('text', null, '[[controller:component-text:default-text]]');
      assert.equal(component._text, 'default-text');
    });
    it('attribute binder (color="{{controller:component-color:default-color}}")', () => {
      component.attributeChangedCallback('color', null, '{{controller:component-color:default-color}}');
      assert.equal(component.getAttribute('color'), 'default-color');
    });
    it('attribute static (text="text-value")', () => {
      component.attributeChangedCallback('text', null, 'text-value');
      assert.equal(component._text, 'text-value');
    });
    it('attribute style (style="color:[[controller:component-color:yellow]];background-color:red")', () => {
      component.attributeChangedCallback('style', null, 'color:[[controller:component-color:yellow]];background-color:red');
      assert.equal(component.style['color'], 'yellow', 'color style');
      assert.equal(component.style['background-color'], 'red', 'background-color style');
    });
  });
}
