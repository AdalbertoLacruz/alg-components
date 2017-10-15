# alg-components

There are many components/frameworks for web development, so this is an experiment to design components with some features that shuld be native:

- Observable, natively in the types
- Binding support for observable suscription
- Horizontal message bus for channel fire/observation
- Javascript class mixins and properties
- Css mixins

## Architecture

File controller.js
  - Data (observable types)
  - Controller (application logical)

File html/component.js
  - View (HTML & component itself)

## Bindings
  The basic attribute binding in HTML is:

  `<component attrName="[[controller:channel:defaultValue]]" ... >`

  Where

    - controller == controller name.
    - channel == Observable variable to bind.
    - defaultValue == value to initialize the variable.

  Using {{}} instead of [[]] the attribute is reflected into the HTML.

  It is possible to use default values for controller and channel:

      <body controller="defaultController">
        ...
        <component id="ID" attrName="[[::defaultValue]]" >

  The binding would be with the variable ID-attrName in the defaultController.

  And the simplest form:

    <component id="ID" attrName>

  used to only receive the changes.

## StyleBindings
  The full sytax is something like:

  `<component style="color:[[:channel1:blue]];background-color:[[:channel2:red]]" ...>`

That could be simplified to:

  `<component id="ID" style="color:blue;background-color:red" ...>`

And also to:

  `<component id="ID" style="color;background-color" ...>`

## Event Handlers
  The syntax is like:

  `<component on-event="controller:channel">`

  Some componets could have defined an event handler by default:

  `<component-clickable id="ID">`

  The component would fire a ID_CLICK message to the controller.

## Observable Arrays
They have granularity at row level, with add, delete, update and create operations.

## Status
The actual version is very early. Only works in the latest vesions of Chrome.

## Acknowledgments
  - [Polymer](https://www.polymer-project.org/)
  - [how-to-components](https://github.com/GoogleChrome/howto-components)

## [License](LICENSE)

Copyright (c) 2017 [Adalberto Lacruz](https://github.com/AdalbertoLacruz)

Licensed under the [Apache License](LICENSE).

