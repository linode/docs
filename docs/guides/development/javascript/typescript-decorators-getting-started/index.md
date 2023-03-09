---
slug: typescript-decorators-getting-started
description: 'This guide discusses Decorators, an experimental TypeScript feature. You learn how to enable Decorators in TypeScript, and the syntax for creating Decorators.'
keywords: ['typescript decorators']
tags: ['typescript']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-10-28
modified_by:
  name: Linode
title: "Getting Started with TypeScript Decorators"
title_meta: "TypeScript Decorators: Getting Started"
authors: ["Martin Heller"]
---

[Decorators in TypeScript](https://www.typescriptlang.org/docs/handbook/decorators.html) provide a way to add both annotations and a meta-programming syntax for class declarations and members. They can annotate or modify classes or class members. Decorators can be chained or composed; that is, multiple decorators can be applied to a single declaration.

## What are Decorators?

Decorators are available in several object-oriented and functional programming languages, including Python, JavaScript ES6, and TypeScript. Decorators are a lightweight alternative to subclasses. In other languages, such as C++, C#, and Java, the decorator design pattern is implemented with wrapper classes.

In TypeScript, decorators are declared using an at sign (`@`) before the decorator name and have a matching function that implements the behavior. The file below contains an example of a class decorator (`@classDecorator`) applied to the class `Person`.

{{< file "class_decorator_example.ts" typescript>}}
const classDecorator = (target: Function) => {
  this.title = t;
}

@classDecorator  //class decorator
class Person {
  title: string;
}
{{</ file >}}

## How Do I Enable Decorators in TypeScript?

As of writing this guide, decorators are still an experimental feature in TypeScript. To enable this feature, set the `experimentalDecorators` compiler flag either on the command line or in your `tsconfig.json` file.

To enable the decorators feature from the command line, use the following command:

    tsc --target ES5 --experimentalDecorators

Decorators can be enabled by setting `experimentalDecorators` option to `true` in your `tsconfig.json` file as follows:

{{< file "tsconfig.json" >}}
{
  "compilerOptions": {
    "target": "ES5",
    "experimentalDecorators": true
  }
}
{{</ file >}}

## Where Can I Use Decorators in TypeScript?

Decorators can be attached to a class declaration, method, accessor, property, or parameter. The example of a [Class Decorator](https://www.typescriptlang.org/docs/handbook/decorators.html#class-decorators) given in the TypeScript documentation is shown below:

{{< file "class_decorator_example.ts" typescript>}}
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

JavaScript's [`Object.seal()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/seal) method changes the `configurable` property descriptor the object's parameter to `false`. That means you can’t delete any members of the object or extend the object with new members. The `Object.seal()` method doesn't affect the writability of the object; for that, you can instead use `Object.freeze()`.

You can find more examples for method, accessor, property, and parameter decorators in the [TypeScript documentation](https://www.typescriptlang.org/docs/handbook/decorators.html#method-decorators). The usage of decorators in TypeScript is fairly advanced and uses the experimental `reflect-metadata` package. See [Metadata](https://www.typescriptlang.org/docs/handbook/decorators.html#metadata) for more information about the `reflect-metadata` library.

## What is a Decorator Factory?

A decorator factory is a function that returns a function/expression that is called by the decorator at runtime. A decorator factory can be written as shown below:

    function enumerable(value: boolean) {
      return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        descriptor.enumerable = value;
      };
    }

The function `enumerable` accepts a parameter and returns another function that makes use of the parameter. In the above example, it modifies the `enumerable` property descriptor of the method. The `@enumerable` decorator applies this change to the example below.

{{< file decorator_factory_example.ts typescript>}}
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
