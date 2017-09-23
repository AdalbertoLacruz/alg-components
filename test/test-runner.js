/* global mocha chai */
import { TestAlgLog } from './cases/test-alg-log.js';
import { TestObservable } from './cases/test-observable.js';

mocha.setup('bdd');

TestAlgLog();
TestObservable();

mocha.run();
