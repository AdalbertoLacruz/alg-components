// @copyright 2017-2018 adalberto.lacruz@gmail.com
/* global mocha chai describe it before beforeEach */
import { BinderParser } from '../../lib/src/base/binder-parser.js';

let assert = chai.assert;

export function TestBinderParser() {
  describe('BinderParser', () => {
    describe('Event Binder (on-click=[[app-controller:BTN_CLICK]])', () => {
      let binder;
      before(() => {
        binder = new BinderParser('on-click', '[[app-controller:BTN_CLICK]]');
      });
      it('is Event Binder', () => {
        assert.equal(binder.isEventBinder, true);
      });
      it('handler name', () => {
        assert.equal(binder.handler, 'click', 'handler name must be click');
      });
      it('controller name', () => {
        assert.equal(binder.controller, 'app-controller');
      });
      it('channel name', () => {
        assert.equal(binder.channel, 'BTN_CLICK');
      });
    });

    describe('Attribute Binder (attribute=[[app-controller:btn2-label:15]])', () => {
      let binder;
      before(() => {
        binder = new BinderParser('attribute', '[[app-controller:btn2-label:15]]');
      });
      it('is Attribute Binder', () => {
        assert.equal(binder.isAttributeBinder, true);
      });
      it('no sync []', () => {
        assert.equal(binder.isSync, false);
      });
      it('default value', () => {
        assert.equal(binder.defaultValue, '15');
      });
    });

    describe('Style Binder (Style=property1:[[:channel1:value1]];property2:[[:channel2]])', () => {
      let binder;
      beforeEach(() => {
        binder = new BinderParser('Style', 'property1:[[:channel1:value1]];property2:[[:channel2]]', 'default-controller');
      });

      it('is Style Binder', () => {
        assert.equal(binder.isStyleBinder, true);
      });
      it('first property', () => {
        const property = binder.styleProperty;
        assert.equal(property, 'property1');
      });
      it('first channel', () => {
        assert.equal(binder.channel, 'channel1');
      });
      it('first value', () => {
        assert.equal(binder.defaultValue, 'value1');
      });

      it('second property', () => {
        binder.next();
        assert.equal(binder.styleProperty, 'property2');
      });
      it('second channel', () => {
        binder.next();
        assert.equal(binder.channel, 'channel2');
      });
      it('end style', () => {
        binder.next();
        assert.equal(binder.next(), false, 'no more style properties');
      });
      it('default controller', () => {
        assert.equal(binder.controller, 'default-controller');
      });
    });

    describe('Style without property (style=[[:channel1:value1]])', () => {
      let binder;
      before(() => {
        binder = new BinderParser('style', '[[:channel1:value1]]');
      });
      it('Property empty', () => {
        assert.equal(binder.styleProperty, '');
      });
      it('channel', () => {
        assert.equal(binder.channel, 'channel1');
      });
    });

    describe('Style with only property (style=property)', () => {
      let binder;
      before(() => {
        binder = new BinderParser('style', 'property');
      });
      it('property', () => {
        assert.equal(binder.styleProperty, 'property');
      });
    });

    describe('style with value (style=property:value)', () => {
      let binder;
      before(() => {
        binder = new BinderParser('style', 'property:value');
      });
      it('get property/value', () => {
        assert.equal(binder.styleProperty, 'property', 'get style property');
        assert.equal(binder.value, 'value', 'get style value');
      });
    });

    describe('Sync Attribute (attribute={{:btn2-label}})', () => {
      let binder;
      before(() => {
        binder = new BinderParser('attribute', '{{:btn2-label}}');
      });
      it('sync {}', () => {
        assert.equal(binder.isSync, true);
      });
    });

    describe('No Binding (attribute=value)', () => {
      let binder;
      before(() => {
        binder = new BinderParser('attribute', 'value');
      });
      it('no is', () => {
        const isBinding = binder.isEventBinder || binder.isAttributeBinder || binder.isStyleBinder;
        assert.equal(isBinding, false);
      });
      it('value', () => {
        assert.equal(binder.value, 'value');
      });
    });
  });
}
