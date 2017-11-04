// @copyright 2017 ALG
/* global mocha chai describe it before beforeEach */
import { AlgLog } from '../../src/alg-components/alg-log.js';

let assert = chai.assert;

export function TestAlgLog() {
  describe('AlgLog', () => {
    const logMessage = 'test';
    const id = AlgLog.add(null, logMessage);

    it('id', () => {
      assert.equal(id, 0, 'id is 0');
    });

    it('message', () => {
      const message = AlgLog.register._value[0].message;
      assert.equal(message, logMessage, 'message stored in AlgLog.register');
    });
  });
}
