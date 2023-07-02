---
slug: typescript-classes-get-started
description: 'This guide discusses TypeScript classes with information on initializers, constructors, member visibility, and more.'
keywords: ['typescript classes']
tags: ['typescript']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-10-29
modified_by:
  name: Linode
title: "Getting Started with Typescript Classes"
title_meta: "TypeScript Classes: Get Started"
authors: ["Martin Heller"]
---

TypeScript support for classes was introduced in [ECMAScript 6 (ES6)](https://github.com/lukehoban/es6features#readme). Classes allow programmers to write their code following object-oriented programming (OOP) principles. Class-driven OOP reduces code repetition due to class inheritance and the usage of objects.

## Class Declarations

To declare a class in TypeScript you must use the `class` keyword, provide a class name, and wrap the body of your class in curly braces. The body of the class includes any fields, class constructors, and functions. The example below displays the skeleton of a `Rectangle` class declaration in TypeScript:


{{< file "example.ts" typescript>}}
class Rectangle {
    //class fields, constructor, and functions
}
{{< /file >}}

### Fields

Fields (also called properties) are class members. They are public and writeable by default. The type declaration is optional, but if you omit it, the default class is `any`. The example below contains four fields, `x`, `y`, `width`, and `height`. Each field's is of type `number`.

{{< file "example.ts" typescript>}}
class Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}
{{< /file >}}

### Initializers

Class fields can be *initialized* to a specific value in a class declaration. Whenever the class is instantiated, the field is initialized to the specified value.
The field's type is inferred from the value of the initializer, so you can omit the type declaration. The example below initializes each field to `0`.

{{< file "example.ts" typescript>}}
class Rectangle {
  x = 0;
  y = 0;
  width = 0;
  height = 0;
}
{{< /file >}}

## Readonly Fields

If you prefix a field with the `readonly` modifier, you cannot assign a value to the field outside of the class constructor. The read-only members can only be assigned in an initializer or in a class constructor. The example below displays the `Rectangle` class with a readonly field named `pi`.

{{< file "example.ts" typescript>}}
class Rectangle {
  x = 0;
  y = 0;
  width = 0;
  height = 0;
  readonly pi: number = 3.14159;
}
{{< /file >}}

## Constructors

A constructor is a type of function that runs when a class is instantiated and initializes the new instance's variables. Constructors cannot have type parameters and always return the class instance type. The example `Rectangle` class contains parameters with default values

{{< file "example.ts" typescript>}}
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

const rect1 = new Rectangle(); //uses default constructor parameter values
const rect2 = new Rectangle(100, 200, 300, 400); //assigns new parameter values
{{</ file >}}

You can also create multiple constructors for a class with the same name and different function signatures (parameter type and return types). This concept is called [Overloaded Functions](https://www.typescriptlang.org/docs/handbook/declaration-files/by-example.html#overloaded-functions).

## Methods

Methods are functions that belong to the class. In the example below, the `move` method affects the `x` and `y` values of a rectangle, but not the `width`, or `height`. The members of the class can be accessed by using the `this.` qualifier; an unqualified name in a method body always refers to something in the enclosing scope.

{{< file "example.ts" typescript>}}
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

You can derive one class from another using the `extends` keyword. The example below adds a `title` attribute to a rectangle, which would be useful if we were turning the `Rectangle` class into a `Window` class. The call to `super()` is required before using the `this` qualifier in the derived class’ constructor. TypeScript lets you know if you forget the `super()` call.

{{< file "example.ts" typescript>}}
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

## Getters and Setters

TypeScript supports getters (`get` keyword) and setters (`set` keyword) in classes. They are rarely useful unless you need to add logic, such as range checks or type conversions on setters. A getter is also called an *Accessor* and a setter is also called a *Mutator*. The below example demonstrates how to access a public property of the `Thing` class.

{{< file "example2.ts" typescript>}}
class Thing {
    _size = 0;

    // Getter method to return size of Thing class
    get size(): number {
        return this._size;
    }

    // Setter method to set the value of size
    set size(value: string | number | boolean) {
        let num = Number(value);

        // Don't allow NaN, Infinity, etc

        if (!Number.isFinite(num)) {
            this._size = 0;
            return;
        }

        // Setter call
        // Access the public property _size of the Thing class
        this._size = num;
    }
}
{{</ file >}}

In the above example, you can notice that the call to the setter method does not have parentheses like a regular method. When you call `this._size`, the `size` setter method is invoked and value is assigned.

## Interfaces and Implementations

Like C#, TypeScript lacks multiple inheritance but has interfaces, which define characteristics such as structures or method names that must be implemented by classes that use them.

In the example below, the `Pingable` interface requires a `ping()` method. The `Sonar` class implements it correctly; the `Ball` class does not.

{{< file "example3.ts" typescript>}}
interface Pingable {
  ping(): void;
}

class Sonar implements Pingable {
  ping() {
    console.log("ping!");
  }
}
class Ball implements Pingable {

  // error here
  pong() {
    console.log("pong!");
  }
}
{{</ file >}}

Here, the `Pingable` interface is implemented in the `Sonar` and `Ball` classes using the `implements` keyword. The implementing classes should strictly define the properties and the function with the same signatures. If not, the compiler throws an error.

Running the above `example3.ts` displays the following error:

{{< output >}}
Class 'Ball' incorrectly implements interface 'Pingable'.
Property 'ping' is missing in type 'Ball' but required in type 'Pingable'.
{{< /output >}}

## Member Visibility

You can control the visibility of the TypeScript methods or properties using the TypeScript data or access modifiers. Following are the different access modifiers in TypeScript:

- `public`: This is the default visibility. Public members can be accessed from anywhere.
- `protected`: Protected members can only be accessed from subclasses of the class where they are declared.
- `private`: Private members can only be accessed from the class where they are declared.
- `static`: Static members are common to all instances of a class, instead of being unique to each instance. TypeScript doesn't have or need static classes: simply use a free (non-class) variable or function. The static attribute can be combined with any of the other visibility attributes.
- Generic Classes (Generics): Like functions and interfaces, classes may use generics, denoted by the type variable `<Type>` or `<T>` after the class name. `<Type>` or `<T>` is a special kind of variable that denotes types.

{{< file "example4.ts" typescript>}}
class Box<Type> {
  contents: Type;
  constructor(value: Type) {
    this.contents = value;
  }
}
const b = new Box("hello!");
{{</ file >}}

Using Generics, you can create reusable components that can work with any data type without restricting to one data type. In the above example, the type of `const b` is `Box<string>`.

{{< note respectIndent=false >}}
The members of a generic class that use the type can’t be "static". Generic classes are usually more efficient at runtime than classes that use variables of type `any`.
{{< /note >}}

## Arrow Functions

The arrow function expression `=>` (a shortcut for an anonymous or lambda function) is sometimes used in classes instead of traditional method definitions.

{{< file "example5.ts" typescript>}}
class MyClass {
  name = "MyClass";
  getName = () => {
    return this.name;
  };
}
{{</ file >}}

One reason to do so is to make it simpler to use `this` correctly. You might benefit from reading about [`this` at Runtime in Classes](https://www.typescriptlang.org/docs/handbook/2/classes.html#this-at-runtime-in-classes) in the TypeScript documentation since the underlying JavaScript behavior is deeply weird.

## Abstract Classes and Members

As in C#, you can create abstract base classes in TypeScript that lack one or more method implementations, which are also marked abstract.

{{< file "example6.ts" typescript>}}
abstract class Base {
  abstract getName(): string;
  printName() {
    console.log("Hello, " + this.getName());
  }
}
{{</ file >}}

This forces you to create a derived class that implements the abstract members before you can instantiate the class. Using abstract classes well requires some fairly sophisticated design. A good example might be an abstract reader class that has derived classes for the various file types supported (text, csv, and so on); the base class provides a common interface for all the implementations.

## Further Information

To learn more, there’s plenty of [TypeScript documentation](https://www.typescriptlang.org/docs/handbook/2/classes.html) available and the [TypeScript Playground](https://www.typescriptlang.org/play) gives you the flexibility to write and learn TypeScript.
