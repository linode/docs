---
slug: typescript-decorators-introduction
author:
  name: Martin Heller
description: 'This guide discusses Decorators, an experimental TypeScript feature. You learn how to enable Decorators in TypeScript, and the syntax for creating Decorators. '
keywords: ['list','of','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-09-24
modified_by:
  name: Linode
title: "Typescript Decorators: Getting Started"
h1_title: "TypeScript Decorators: An Introduction"
enable_h1: true
contributor:
  name: Martin Heller
  link: https://twitter.com/meheller
---

[Decorators in TypeScript](https://www.typescriptlang.org/docs/handbook/decorators.html) provide a way to add both annotations and a meta-programming syntax for class declarations and members. They can annotate or modify classes or class members. Decorators can be chained or composed; that is, multiple decorators can be applied to a single declaration. Decorators are used heavily in the Angular framework, among others.

## What are Decorators?

Decorators are a [design pattern](https://en.wikipedia.org/wiki/Design_Patterns) implemented in several object-oriented and functional programming languages as a language feature, including Python, JavaScript ES6, and TypeScript. Decorators are a lightweight alternative to subclasses. In other languages, such as C++, C#, and Java, the Decorator design pattern is implemented with wrapper classes.

In TypeScript, decorators are declared using an at sign (`@)` before the decorator name, and have a matching function that implements the behavior. For example:

## How Do I Enable Decorators in TypeScript

Decorators are still an experimental feature in TypeScript, so you need to use a compiler flag to enable them:

    tsc --target ES5 --experimentalDecorators

You can also [enable decorators in your tsconfig.json file](https://www.typescriptlang.org/docs/handbook/decorators.html).

{{< file "tsconfig.json" >}}
{
  "compilerOptions": {
    "target": "ES5",
    "experimentalDecorators": true
  }
}
{{</ file >}}

## Where Can I Use Decorators in TypeScript?

Decorators can be attached to a class declaration, method, accessor, property, or parameter. The example of a [class decorator](https://www.typescriptlang.org/docs/handbook/decorators.html#class-decorators) given in the TypeScript documentation is:

{{< file >}}
@sealed
class BugReport {
  type = "report";
  title: string;
  constructor(t: string) {
    this.title = t;
  }
}

function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}
{{</ file >}}

To understand this, you need to know that the JavaScript `Object.seal()` method changes the `configurable` property descriptor of its parameter to `false`. That means you can’t delete any members of the object or extend the object with new members. The `Object.seal()` method doesn't affect the writability of the object; for that, you can instead use `Object.freeze()`.

You can find more examples for method, accessor, property, and parameter decorators in the [TypeScript documentation](https://www.typescriptlang.org/docs/handbook/decorators.html#class-decorators). The usage of decorators in TypeScript is fairly advanced and uses the experimental `reflect-metadata` package.

## What is a Decorator Factory?

A decorator factory is a function that returns a function that in turn implements a decorator. For example:

{{< file >}}
function enumerable(value: boolean) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.enumerable = value;
  };
}
{{</ file >}}

The function `enumerable` has a parameter and returns another function that uses the parameter. In this example, it modifies the `enumerable` property descriptor of the method or member to which the `@enumerable` decorator applies. For example:

{{< file >}}
class Greeter {
  greeting: string;
  constructor(message: string) {
    this.greeting = message;
  }

  @enumerable(false)
  greet() {
    return "Hello, " + this.greeting;
  }
}
{{</ file >}}

Enumerating the `greet()` method in a for loop is not a good option, so this usage prevents users of the `Greeter` class from a harmless error.

## More Information

Decorators provide a way to annotate or modify a class or class member in TypeScript. However, Decorators are still an experimental feature of the language. To learn more about Decorators in TypeScript, visit the [Decorators proposal](https://github.com/tc39/proposal-decorators) page.




