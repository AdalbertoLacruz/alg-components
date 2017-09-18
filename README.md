# alg-components

There are many components/frameworks for web development, so this is a experiment to design components with some features that shuld be native:

- Observable natively in the types
- Binding support for observable suscription
- Horizontal bus for message fire/observation

## Architecture

File controller.js
  - Data (observable types)
  - Controller (application logical)

File html/component.js
  - View (HTML & component itself)

## Bindings
  - in html component: attribute="[[controller:message:defaultValue]]".
  - With {{}} the attribute is reflected in the HTML.
  - Support for missing controller, if defined abode the HTML tree, with controller="controllerName".
  - defaultValue could be ommited.

  * example: [[:message]]

## StyleBindings
  - some like: style="color:[[:message1:blue]];background-color:[[:message2:red]]"

## Status
The actual version is very early. Pending to code:
  - observable types
  - style attribute binding

## Acknowledgments
  - [Polymer](https://www.polymer-project.org/)
  - [how-to-components](https://github.com/GoogleChrome/howto-components)

## [License](LICENSE)

Copyright (c) 2017 [Adalberto Lacruz](https://github.com/AdalbertoLacruz)

Licensed under the [Apache License](LICENSE).
