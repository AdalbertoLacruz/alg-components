// @copyright @polymer\font-roboto\roboto.js
// @copyright 2017-2018 adalberto.lacruz@gmail.com

import { Rules } from './rules.js';

const link = document.createElement('Link');
link.setAttribute('rel', 'stylesheet');
link.setAttribute('type', 'text/css');
link.setAttribute('href', 'https://fonts.googleapis.com/css?family=Roboto+Mono:400,700|Roboto:400,300,300italic,400italic,500,500italic,700,700italic');
link.setAttribute('crossorigin', 'anonymous');

Rules.insertInHead(link);
