---
slug: typescript-types-introduction
author:
  name: Martin Heller
description: 'TypeScript supports several types, including primitive types, arrays, and objects. This guide provides a brief introduction to TypeScript types with information on how to learn more.'
keywords: ['list','of','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-09-27
modified_by:
  name: Linode
title: "Typescript Types: Get Started"
h1_title: "Typescript Types: An Introduction"
enable_h1: true
contributor:
  name: Martin Heller
  link: https://twitter.com/meheller
---

Data types are essential to TypeScript, even though the underlying types are implemented in JavaScript. TypeScript adds safety through type-checking. When the compiler can’t infer a type, you should declare a specific type. This guide provides an introduction to common TypeScript types with examples on how to create each type.

## Primitive Types

The three essential primitive data types in JavaScript and TypeScript are *string*, *number*, and *boolean*. The example TypeScript code below displays how to assign values of all three data types to variables.

{{< note >}}
All three primitive types are spelled in lower-case. There are capitalized variants of these words that compile successfully in TypeScript. These are referred to as *boxed types*. When a primitive type is boxed it is "wrapped" in an object and can then behave like an object.
{{</ note >}}

**TypeScript**

{{< file >}}
//strings
var s1: string;             //declared
const s2 = "Hello, world!"; //inferred
let s3: string = "Alice";   //both

//numbers
var n1: number;             //declared
const n2 = 42;              //inferred
const pi = 3.14159;         //inferred
let n3: number = n2 * pi;   //both

function FtoC (f: number) { //declared to enable input type checking
    return (f - 32.) * 5. / 9.
}

//booleans
var b1: boolean;            //declared
const b2 = true;            //inferred
let b3: boolean = !true;    //both (!true == false)
{{</ file >}}

When the TypeScript code is compiled to JavaScript, all the type annotations are stripped out, as shown in the JavaScript example below. If you’re targeting the lowest levels of JavaScript, both `const` and `let` are changed to `var`. If you’re targeting ES6(2015) or greater, they are left as written. In TypeScript and ES6+, `let` is a block-scoped version of `var`, and `const` creates a block-scoped variable that can’t be changed once it is bound.

**JavaScript**

{{< file >}}
//strings
var s1; //declared
var s2 = "Hello, world!"; //inferred
var s3 = "Alice"; //both
//numbers
var n1; //declared
var n2 = 42; //inferred
var pi = 3.14159; //inferred
var n3 = n2 * pi; //both
function FtoC(f) {
    return (f - 32.) * 5. / 9.;
}
//booleans
var b1; //declared
var b2 = true; //inferred
var b3 = !true; //both
{{</ file >}}

{{< note >}}
You don’t actually get an immutable variable when you use `const`. To do that, declare an object member `readonly`.
{{</ note >}}

## TypeScript Any Type

A variable of type **any** can hold any data type. The principal reason to use it is to tell TypeScript not to throw type-checking errors for that variable. *Think carefully before you do this* and consider the alternatives of explicit [unions](https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html) and [narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html). Leaving out the type annotation is enough to make the variable type `any` by default, or you could specifically declare it as follows:

{{< file >}}
var a1: any;
{{</ file >}}

There’s a secondary reason to use the `any` type; to write a function that accepts multiple types. It’s much better to use a [Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html) to create a function that accepts different types instead of a single type, however, you can also use `any`, as shown in the following example:

{{< file >}}
function wideOpen(x: any) {
//do something to x that doesn't depend on its type
return x;
}
{{</ file >}}

By default, TypeScript infers an `any` type for any variable that has neither a declared type nor enough context to infer a type. To disable that, use the `noImplicitAny` TypeScript compiler flag:

    tsc --noImplicitAny my_file.ts

## TypeScript Arrays

Arrays in TypeScript are denoted by square brackets. For example:

{{< file >}}
//arrays
let arr1: number[];         //declared
let arr2 = [1,2,3];         //inferred
let arr3 = ["one","two","three"];
{{</ file >}}

{{< note >}}
You can also declare arrays as a [Generic](https://www.typescriptlang.org/docs/handbook/2/generics.html), (i.e. `Array<Type>`).
{{</ note >}}

## Object Types

In TypeScript you can create types from other types. The most common way to do this is with objects. Objects can be [*anonymous*](https://www.typescriptlang.org/docs/handbook/2/objects.html), [type *aliases*](https://www.typescriptlang.org/docs/handbook/advanced-types.html#type-aliases), or [*interfaces*](https://www.typescriptlang.org/docs/handbook/interfaces.html).

{{< note >}}
The syntax for interfaces lacks an equals sign, but the syntax for types requires an equals sign.
{{</ note >}}

{{< file >}}
//objects

//interface
interface IP4i {
    dns_name: string;
    ip_address: [number,number,number,number];
    protocol?: string;
}

//type alias
type IP4t = {
    dns_name: string;
    ip_address: [number,number,number,number];
    protocol?: string;
}
{{</ file >}}

Optional properties are denoted with a question mark after the member name, as shown for the protocol members.

## Unions and Narrowing

Unions are denoted by a vertical bar and allow for more than one type, often as an input parameter to a function. You can’t apply type-dependent code to a union until your code narrows down which of the allowed types have been input. Take a look at the following example:

{{< file >}}
function welcomePeople(x: string[] | string) { //x is a union
	//Narrowing logic
  if (Array.isArray(x)) {
    // Here: 'x' is 'string[]'
    console.log("Hello, " + x.join(" and "));
  } else {
    // Here: 'x' is 'string'
    console.log("Welcome lone traveler " + x);
  }
}

welcomePeople("Moe");
welcomePeople(["Moe","Larry”,"Curly"]);
{{</ file >}}

When you run the code, the log output you get is:

{{< output >}}
[LOG]: "Welcome lone traveler Moe"

[LOG]: "Hello, Moe and Larry and Curly"
{{</ output >}}

## More Information

This guide provides an introduction to commonly used types in TypeScript with brief examples to help you get started. To learn more about TypeScript types and their individual implementation details, refer to the [Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html) page on the TypeScript documentation site.