import {AlgLog} from '../lib/src/base/alg-log.js';
AlgLog.disabled = false;

import { AppController } from './app-controller.js';
import '../../../lib/alg-components-library.js';

document.body.style.opacity = null;

document.querySelector('#btn-save')
  .addEventListener('click', (e) => AlgLog.save());
