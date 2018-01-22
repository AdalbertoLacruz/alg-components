// @copyright https://gist.github.com/sebmarkbage/fac0830dbb13ccbff596
// @copyright 2017-2018 adalberto.lacruz@gmail.com

/**
 * Mixins factory
 *
 * Order is importands, extends classes from left to right.
 * @param {*} baseClass
 * @param {Array} mixinFactories
 * @return {*} class extended from parameter classes
 */
export const mixinFactory = (baseClass, ...mixinFactories) => {
  let base = class extends baseClass { };
  for (let i = 0; i < mixinFactories.length; i++) {
    base = mixinFactories[i](base);
  }
  return base;
};

/*
// usage example

class FooBase {
  constructor() {
    console.log('Foo base');
  }
}

const Bar1 = (base) => class extends base {
  constructor() {
    super();
    console.log('Bar1');
  }
};

class Foo extends mixinFactory(FooBase, Bar1) {
  constructor() {
    super();
    console.log('Foo');
  }
}

new Foo();
*/
