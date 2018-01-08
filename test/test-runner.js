/* global mocha chai */
import { TestAlgComponent } from './cases/test-alg-component.js';
import { TestAlgLog } from './cases/test-alg-log.js';
import { TestBinderParser } from './cases/test-binder-parser.js';
import { TestList } from './cases/test-list.js';
import { TestObservable } from './cases/test-observable.js';
import { TestUtilStr } from './cases/test-util-str.js';

// @ts-ignore
mocha.setup('bdd');

TestAlgLog();
TestObservable();
TestBinderParser();
TestAlgComponent();
TestUtilStr();
TestList();

mocha.run();
