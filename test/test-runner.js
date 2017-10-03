/* global mocha chai */
import { TestAlgComponent } from './cases/test-alg-component.js';
import { TestAlgLog } from './cases/test-alg-log.js';
import { TestBinderParser } from './cases/test-binder-parser.js';
import { TestObservable } from './cases/test-observable.js';
import { TestUtilStr } from './cases/test-util-str.js';

mocha.setup('bdd');

TestAlgLog();
TestObservable();
TestBinderParser();
TestAlgComponent();
TestUtilStr();

mocha.run();
