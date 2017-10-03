/* global mocha chai describe it before beforeEach */
import * as Str from '../../src/alg-components/util/util-str.js';

let assert = chai.assert;

export function TestUtilStr() {
  describe('util-str', () => {
    it('capitalizeFirst', () => {
      assert.equal(Str.capitalizeFirst('data'), 'Data');
    });
    it('dashReplace', () => {
      assert.equal(Str.dashReplace('str1-str2-str3', 'str', 1), 'str1-str-str3');
    });
    it('dashToCamelString', () => {
      assert.equal(Str.dashToCamelString('str1-str2-str3'), 'str1Str2Str3');
    });
    it('dashToCamelList', () => {
      const result = Str.dashToCamelList('str1-str2-str3');
      assert.equal(result.length, 3, 'length');
      assert.equal(result[0], 'str1', 'first');
      assert.equal(result[2], 'str1Str2Str3', 'last');
    });
  });
}
