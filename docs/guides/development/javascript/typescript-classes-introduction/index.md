---
slug: typescript-classes-introduction
author:
  name: Martin Heller
description: 'This guide discusses TypeScript classes with information on initializers, constructors, member visibility, and more.'
keywords: ['list','of','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-09-27
modified_by:
  name: Linode
title: "Typescript Classes: Get Started"
h1_title: "Typescript Classes: An Introduction"
enable_h1: true
contributor:
  name: Martin Heller
  link: https://twitter.com/meheller
---

TypeScript classes support the `class` keyword introduced in ES2015 (ES6). To explore classes this guide uses an example Rectangle class.

## Class Declarations

### Properties

Properties are class members. They are public and writeable by default. If you omit the type declarations, the default class is of [type `any`](typescript-types-introduction). The example below declares a new class named `Rectangle`. The `Rectangle` class has contains four different properties, `x`, `y`, `width`, and `height`.

{{< file >}}
class Rectangle {
   x: number;
   y: number;
   width: number;
   height: number;
}
{{</ file >}}

### Initializers

You can initialize properties to values. The types for each property are inferred from the initial values, so you may omit them. Given the example `Rectangle` initializers below, the inferred type is `number`.

{{< file >}}
class Rectangle {
   x = 0;
   y = 0;
   width = 0;
   height = 0;
}
{{</ file >}}

{{< note >}}
Initializers run whenever the class is instantiated.
{{</ note >}}

## Readonly

If you prefix a property with the `readonly` modifier, it can only be assigned when initialized (as in the example above) or in the class constructor. Class constructors are discussed in the next section. The example below uses the `readonly` keyword when initializing the `pi` property.

{{< file >}}
class Rectangle {
   x: number;
   y: number;
   width: number;
   height: number;
   readonly pi: number = 3.14159;
}
{{</ file >}}

## Constructors

A constructor is a function (method) that creates a new instance of a specific class. Constructors don’t have type parameters, and always return the class instance type. The example below sets default values for the parameters in the constructor.

{{< file >}}
class Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;

   constructor(x = 0, y = 0, width = 100, height = 100) {
       this.x = x;
       this.y = y;
       this.width = width;
       this.height = height;
   }
}

const rect1 = new Rectangle(); //uses defaults, so 0, 0, 100, 100
const rect2 = new Rectangle(100, 200, 300, 400); //uses the input parameter values
{{</ file >}}

You can also create multiple constructors for a class with different signatures. These are called [*overloads*](https://www.typescriptlang.org/docs/handbook/declaration-files/by-example.html#overloaded-functions).

## Methods

Methods are functions that belong to a class. In the example below, the `move` method affects the `x` and `y` values of an instance of the `Rectangle` class. The `this` keywords inside the method are required and denote that the properties are members of the class.

{{< file >}}
class Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;

   constructor(x = 0, y = 0, width = 100, height = 100) {
       this.x = x;
       this.y = y;
       this.width = width;
       this.height = height;
   }

   move(dx: number, dy: number) {
       this.x += dx;
       this.y += dy;
   }
}

const rect1 = new Rectangle();  //uses defaults, so 0, 0, 100, 100
const rect2 = new Rectangle(100, 200, 300, 400);

rect1.move(10, 10);
{{</ file >}}

## Derived Classes

You can derive one class from another using the `extends` keyword. The example below  adds a `title` property to a new class declaration named `NamedRect`. The call to `super()` is required before using the `this` keyword in the derived class constructor.

{{< file >}}
class Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;

   constructor(x = 0, y = 0, width = 100, height = 100) {
       this.x = x;
       this.y = y;
       this.width = width;
       this.height = height;
   }

   move(dx: number, dy: number) {
       this.x += dx;
       this.y += dy;
   }
}

class NamedRect extends Rectangle {
    title: string;

    constructor(title = "default", x = 0, y = 0, width = 100, height = 100) {
       super();
       this.title = title;
       this.x = x;
       this.y = y;
       this.width = width;
       this.height = height;
    }
}

const rect1 = new Rectangle();  //uses defaults, so 0, 0, 100, 100
const rect2 = new Rectangle(100, 200, 300, 400);
const nr = new NamedRect("window", 10, 20, 30, 40);

rect1.move(10, 10);
nr.move(20, 20);
{{</ file >}}

## Method Overrides

A derived class can also override a base class property. The derived class must be a subtype of its base class. In the example above, the derived class `NamedRect` could re-implement the `move` method of its base class.

## Getters and Setters (Accessors)

TypeScript supports getters (`get` keyword) and setters (`set` keyword) in classes. They are useful when you need to add logic or a specific behavior to a property of your class. For example, you can use them to add range checks or type conversions on setters as done in the example below.

{{< file >}}
class Thing {
    _size = 0;

    get size(): number {
        return this._size;
    }

    set size(value: string | number | boolean) {
        let num = Number(value);

        // Don't allow NaN, Infinity, etc

        if (!Number.isFinite(num)) {
            this._size = 0;
            return;
        }

        this._size = num;
    }
}
{{</ file >}}

## Interfaces and Implementations

Like C#, TypeScript lacks multiple inheritance but support *interfaces*. Interfaces define characteristics such as structures or method names that must be implemented by classes that use them.

In the example below the `Pingable` interface requires a `ping()` method. The `Sonar` class implements it correctly; the `Ball` class does not.

{{< file >}}
interface Pingable {
  ping(): void;
}

class Sonar implements Pingable {
  ping() {
    console.log("ping!");
  }
}
class Ball implements Pingable {

// the following two lines are error messages
Class 'Ball' incorrectly implements interface 'Pingable'.
  Property 'ping' is missing in type 'Ball' but required in type 'Pingable'.

  pong() {
    console.log("pong!");
  }
}
{{</ file >}}

## Member Visibility

TypeScript supports three types of class member visibility:

1. `public`: This is the default visibility. Public members can be accessed from anywhere.
1. `protected`: Protected members can only be accessed from subclasses of the class where they are declared.
1. `private`: Private members can only be accessed from the class where they are declared.

- In TypeScript, classes can have [`static` members](https://www.typescriptlang.org/docs/handbook/2/classes.html#static-members). Static members are common to all instances of a class, instead of being unique to each instance.

- Like functions and interfaces, classes may use generics. These are denoted by using a marker inside angle brackets after the class name, as show in the example below:

    {{< file >}}
class Box<Type> {
  contents: Type;
  constructor(value: Type) {
    this.contents = value;
  }
}
const b = new Box("hello!");
    {{</ file >}}

    The type of `const b` is `Box<string>`. Members of a generic class that use the type can’t be `static`. Generic classes are usually more efficient at runtime than classes that use variables of type `any`.

## Abstract Classes and Members

As in C#, you can create abstract base classes in TypeScript that lack one or more method implementations. Abstract classes cannot be instantiated, but other classes may be derived from it. The example below creates an abstract class named `Base`.

{{< file >}}
abstract class Base {
 abstract getName(): string;
  printName() {
   console.log("Hello, " + this.getName());
 }
}
{{</ file >}}

The example code forces you to create a derived class that implements the abstract members before you can instantiate the class.

## More Information

To learn more about implementation details, refer to the [Classes](https://www.typescriptlang.org/docs/handbook/2/classes.html) documentation on the TypeScript site. You can also visit the [TypeScript playground](https://www.typescriptlang.org/play) to get some hands on experience with TypeScript classes.



