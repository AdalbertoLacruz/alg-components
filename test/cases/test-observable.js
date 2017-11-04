// @copyright 2017 ALG
/* global mocha chai describe it before beforeEach */
import { Observable } from '../../src/alg-components/types/observable.js';

let assert = chai.assert;

export function TestObservable() {
  describe('Observable', () => {
    const name = 'observableName';
    let initialValue;
    let observeValue;
    let subscribeValue;
    let value = 'VALUE';
    const observableVar = new Observable(name);
    const status = { hasChannel: false };

    observableVar.initializer((value) => {
      initialValue = value;
    }).observe((value) => {
      observeValue = value;
    });
    observableVar.subscribe(null, null, (value) => {
      subscribeValue = value;
    }, status);
    observableVar.init(value);

    it('name', () => {
      assert.equal(observableVar.name, name, 'Observable name');
    });

    it('init', () => {
      assert.equal(initialValue, value, 'initial value');
    });

    it('observe', () => {
      assert.equal(observeValue, value, 'observe value');
    });

    it('subscribe', () => {
      assert.equal(subscribeValue, value, 'subscribe value');
    });
  });
}
