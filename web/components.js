import {AlgLog} from '../lib/src/base/alg-log.js';
AlgLog.disabled = false;

import '../lib/import-all-styles.js';
// import './styles.js';
import { AppController } from './app-controller.js';
import '../lib/import-all-icons.js';
import '../lib/import-all-components.js';
import { Rules } from '../lib/styles/rules.js';

document.body.style.opacity = null;

Rules.applySheet();

document.querySelector('#btn-save')
  .addEventListener('click', (e) => AlgLog.save());
