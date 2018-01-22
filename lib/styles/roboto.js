// @copyright @polymer\font-roboto\roboto.js
// @copyright 2017-2018 adalberto.lacruz@gmail.com

const templateLink = document.createElement('Link');
templateLink.setAttribute('rel', 'stylesheet');
templateLink.setAttribute('type', 'text/css');
templateLink.setAttribute('href', 'https://fonts.googleapis.com/css?family=Roboto+Mono:400,700|Roboto:400,300,300italic,400italic,500,500italic,700,700italic');
templateLink.setAttribute('crossorigin', 'anonymous');

document.head.appendChild(templateLink);
