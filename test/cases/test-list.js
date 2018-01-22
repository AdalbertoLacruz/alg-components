// @copyright 2017-2018 adalberto.lacruz@gmail.com
/* global mocha chai describe it before beforeEach */

import { List } from '../../lib/src/types/list.js';

let assert = chai.assert;

export function TestList() {
  describe('list', () => {
    it('stable sort (a3, b1, c3, d2) => (b1, d2, a3, c3)', () => {
      const items = new List();
      items.add({ name: 'a', pos: 3 });
      items.add({ name: 'b', pos: 1 });
      items.add({ name: 'c', pos: 3 });
      items.add({ name: 'd', pos: 2 });
      const sorted = items.stableSort((left, rigth) => left.pos > rigth.pos);
      assert.equal(sorted[0].name, 'b', '0');
      assert.equal(sorted[1].name, 'd', '1');
      assert.equal(sorted[2].name, 'a', '2');
      assert.equal(sorted[3].name, 'c', '3');
    });
  });
}
