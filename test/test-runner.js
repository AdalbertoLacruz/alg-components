// @copyright 2017-2018 adalberto.lacruz@gmail.com
/* global mocha chai */

import { TestAlgComponent } from './cases/test-alg-component.js';
import { TestBinderParser } from './cases/test-binder-parser.js';
import { TestList } from './cases/test-list.js';
import { TestObservable } from './cases/test-observable.js';
import { TestUtilStr } from './cases/test-util-str.js';

// @ts-ignore
mocha.setup('bdd');

TestObservable();
TestBinderParser();
TestAlgComponent();
TestUtilStr();
TestList();

mocha.run();
