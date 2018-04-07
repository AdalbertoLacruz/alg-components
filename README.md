# alg-components
(A Light Group of Components)

Web applications complexity is growing, big frameworks have a stepping
learning curve, browsers are more skilled every time, so why not keep
things simple, using the best of each world?

Html is good to describe how components are related between them.
Css to stylize them and the code to glue all together.

In order to build web applications the standard html components need to
be extended with a set of modern components, that could be modified and
developed ad-hoc, as necessary. Google material design/Polymer are a
reference for style and behavior.

Web applications require complexity reducers, as is a reactive way to do
things, triggered by events and changes. Also is convenient concentrate
the state in controllers, avoiding dispersion in the dom. So observers
must be linked with components by bidirectional bindings and buses.

## Architecture

            ┌────────────┐
            │  Server    │
            └────────────┘
                  │
                  │ Services
                  │
            ┌────────────┐
            │ Controller │
            └────────────┘
                  │ Bus
          ───────────────────
          │                 │
    ┌────────────────────────────────┐
    │     │                 │        │
    │┌────────────┐   ┌────────────┐ │
    ││ Component  │   │ Component  │ │
    │└────────────┘   └────────────┘ │
    │            View                │
    └────────────────────────────────┘

Each component has a presentation layer and code for behavior and
controller binding.

## Component subsystems
In order to minimize the properties/methods at component level,
the internal architecture is based in a set of managers:

- TemplateManager
- AttributeManager
- StyleManager
- EventManager
- MessageManager

## StyleSheets

Css var and calc are great, but we don't have mixins. Polymer has
a polyfill for @apply.

Until then, Rules.define/Rules.use resolve the static mixins
creation/use and Rules.apply/Rules.calc the dynamic.
Each component is created with static style and if necessary the style
is recalculated after dom insertion.

If the styleSheet uses mixins, then must be created by code. Or in css
files with the syntax:

```css
selector {
    --mixin: @apply;
    ...
}

```

The css sheet must be referenced with apply attribute:
```html
<link rel="stylesheet" apply type="text/css" href="sheet.css">

<style apply> ... </style>
```

## Controller

A controller has data (in observables) and code. So it keep the state
and the application logic. Could be unique or have a global/page
distribution.

The controller don't know (bottom-up) the dependent components,
so the communication is by subscription/fire messages in the bus.

A component could act as a microcontroller with their subcomponents.
Usually is not necessary. It knows (top-down) what HtmlElement/components
includes and could access them by id, modifying
attributes/properties/managers.

## Attributes binding to controller

The basic attribute binding in HTML is:

```html
<component attrName="[[controller:channel=defaultValue]]" ... >
```

Where

* controller == controller name.
* channel == Observable variable to bind.
* defaultValue == value to initialize the variable.

Using `{{}}` instead of `[[]]` the attribute is reflected into the HTML.

It is possible to use default values for controller and channel:

```html
<body controller="defaultController">
 ...
 <component id="ID" attrName="[[:=defaultValue]]">
```

The binding would be with the variable ID-attrName in the defaultController.

And the simplest form:

```html
<component id="ID" attrName>
```

used to only receive the changes.

## StyleBindings

The full sytax is something like:
```html
<component style="color:[[:channel1=blue]];background-color:[[:channel2=red]]" ...>
```

That could be simplified to:
```html
<component id="ID" style="color=blue;background-color=red" ...>
```

And also to:
```html
<component id="ID" style="color;background-color" ...>
```

## Event Handlers

The syntax is like:
```html
<component on-event="controller:channel">
```

Some componets could have defined an event handler by default:
```html
<component-clickable id="ID">
```

This component would fire a ID_CLICK message to the controller.

## Observables

Observables are the core. They have subscribers, triggered by state
change. The subscribers could be synchronous (linkers) or asynchronous.
They Could modify an attribute on change, fire a message, etc.

An observable could be modified by a transformer in state change.

Observables Arrays have granularity at row level, with add, delete, update and create operations.


## AttributeManager

Is the interface with the component attributes. Receive the changes
and keep the state.

## EventManager

Is the interface with the event handlers at component level. Defines
derived events, like click -> tap, or simplify subscription to keyboard
events.

## Behaviors and class mixins

A behavior is the code part of the component. Only needs the templates
for a full component.

Each mixin, defines a sub-behavior. A component could have various mixins,
such as action, overlay, resizable, ...

## Component Lifecycle
- register -> once per class

And for instance:

- constructor: -> html & style

- connectedCallback:

    -- deferredConstructor

    -- addStandardAttributes

    -- postDeferredConstructor

- domLoaded: -> read all attributes

- attributeChangedCallback: -> subscribe to controller / modify attribute

- disconnectedCallback: -> unsubscribe

## Status
Browser compatibility: Chrome latest versions.

Development: Basic Components.


## [License](LICENSE)
Copyright (c):
- [Polymer](https://www.polymer-project.org/)
- 2017-2018 [Adalberto Lacruz](https://github.com/AdalbertoLacruz)

Licensed under the [Apache License](LICENSE).

