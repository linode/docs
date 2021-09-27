---
slug: typescript-classes-introduction
author:
  name: Martin Heller
description: 'Two to three sentences describing your guide.'
og_description: 'Two to three sentences describing your guide when shared on social media.'
keywords: ['list','of','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-09-27
modified_by:
  name: Linode
title: "Typescript Classes: An Introduction"
h1_title: "Typescript Classes: An Introduction"
enable_h1: true
contributor:
  name: Martin Heller
  link: https://twitter.com/meheller
external_resources:
- '[Link Title 1](http://www.example.com)'
- '[Link Title 2](http://www.example.net)'
---

TypeScript classes support the class keyword introduced in ES2015 (ES6). To explore classes we’ll start with an example of a Rectangle class.

## Class Declarations

### Fields

Fields (also called properties) are class members. They are public and writeable by default. If you omit the type declarations, the default class is any.

{{< file >}}
class Rectangle {
   x: number;
   y: number;
   width: number;
   height: number;
}
{{</ file >}}

### Initializers

You can initialize fields to values. The types will be inferred from the initial values, so you may omit them.

{{< file >}}
class Rectangle {
   x = 0;
   y = 0;
   width = 0;
   height = 0;
}
{{</ file >}}

Initializers run whenever the class is instantiated.

## Readonly

If you prefix a field with the readonly modifier, it can only be assigned in an initializer (an assignment within the declaration, as above) or in the class constructor (as in the next section).

{{< file >}}
readonly pi: number = 3.14159;
{{</ file >}}

## Constructors

A constructor is a function (method) that runs when the class is instantiated. Constructors don’t have type parameters, and always return the class instance type. Note that we are setting default values for the parameters in the constructor below.

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
const rect2 = new Rectangle(100, 200, 300, 400);
{{</ file >}}

You can also create multiple constructors for a class with different signatures, called [overloads](https://www.typescriptlang.org/docs/handbook/declaration-files/by-example.html#overloaded-functions).

## Methods

Methods are functions that belong to the class. In the example below, the move method affects the x and y values of a rectangle, but not the width or height. The “this.” qualifiers inside the method are required; an unqualified name in a method body will always refer to something in the enclosing scope.

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

You can derive one class from another using the extends keyword. The example below  adds a title attribute to a rectangle, which would be useful if we were turning the Rectangle class into a Window class. The call to `super()` is required before using the `this` qualifier in the derived class’ constructor. TypeScript will let you know if you forget the `super()` call.

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

A derived class can also override a base class field or property. The derived class must be a subtype of its base class. In the example above, the derived class `NamedRect` could re-implement the `move` method of its base class.

## Getters and Setters (Accessors)

TypeScript supports getters (get keyword) and setters (set keyword) in classes. They are rarely useful unless you need to add logic, such as range checks or type conversions on setters. Consider accessing a public property.

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

Like C#, TypeScript lacks multiple inheritance but has interfaces, which define characteristics such as structures or method names that must be implemented by classes that use them.

In the example below the Pingable interface requires a `ping()` method. The Sonar class implements it correctly; the Ball class does not.

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

- `public`: This is the default visibility. Public members can be accessed from anywhere.
- `protected`: Protected members can only be accessed from subclasses of the class where they are declared.
- `private`: Private members can only be accessed from the class where they are declared.
- `static`: Static members are common to all instances of a class, instead of being unique to each instance. TypeScript doesn’t have or need static classes: simply use a free (non-class) variable or function. The static attribute can be combined with any of the other visibility attributes.
- Generic Classes: Like functions and interfaces, classes may use generics, denoted by using a marker inside angle brackets after the class name:

    {{< file >}}
class Box<Type> {
  contents: Type;
  constructor(value: Type) {
    this.contents = value;
  }
}
const b = new Box("hello!");
    {{</ file >}}

    The type of `const b` is `Box<string>`. Note that the members of a generic class that use the type can’t be static. Generic classes are usually more efficient at runtime than classes that use variables of type any.

## Arrow Functions

The arrow function expression `=>` (a shortcut for an anonymous or lambda function) is sometimes used in classes instead of traditional method definitions.

{{< file >}}
class MyClass {
 name = "MyClass";
 getName = () => {
   return this.name;
 };
}
{{</ file >}}

One reason to do so is to make it simpler to use `this` correctly. You might benefit from reading about [this at Runtime in Classes](https://www.typescriptlang.org/docs/handbook/2/classes.html#this-at-runtime-in-classes) in the TypeScript documentation, since the underlying JavaScript behavior is deeply weird.

## Abstract Classes and Members

Abstract classes and members
As in C#, you can create abstract base classes in TypeScript that lack one or more method implementations, which are also marked abstract.

{{< file >}}
abstract class Base {
 abstract getName(): string;
  printName() {
   console.log("Hello, " + this.getName());
 }
}
{{</ file >}}

This forces you to create a derived class that implements the abstract members before you can instantiate the class. Using abstract classes well requires some fairly sophisticated design. A good example might be an abstract reader class that has derived classes for the various file types supported (text, csv, and so on); the base class provides a common interface for all the implementations.

## Further Information

To learn more, there’s plenty of [documentation available](https://www.typescriptlang.org/docs/handbook/2/classes.html) and you can visit [Playground](https://www.typescriptlang.org/play). You can also invoke the playground using the Try button in most of the example code.


