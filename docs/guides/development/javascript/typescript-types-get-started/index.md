---
slug: typescript-types-get-started
description: 'TypeScript supports several types, including primitive types, arrays, and objects. This guide provides a brief introduction to TypeScript types with information on how to learn more.'
keywords: ['typescript types']
tags: ['typescript']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-10-29
modified_by:
  name: Linode
title: "Getting Started with TypeScript Types"
title_meta: "TypeScript Types: Get Started"
authors: ["Martin Heller"]
---
TypeScript supports various types including `string`, `number`, `boolean`, `enum`, `Array`, `tuple`, `void`, `null`, and `undefined`. These are the same types supported by JavaScript, however, TypeScript can also perform type checking. This guide provides an introduction to common TypeScript types with examples on how to create each type.

## Primitive Types

The three essential primitive types in JavaScript and TypeScript are `string`, `number`, and `boolean`.

{{< note respectIndent=false >}}
All three primitive types are spelled in lower-case. There are capitalized variants of these words that compile successfully in TypeScript. These are referred to as *boxed types*. When a primitive type is boxed it is "wrapped" in an object and can then behave like an object.
{{< /note >}}

The example TypeScript code below demonstrates how to assign values of all three primitive types to variables.

{{< file "example.ts" typescript>}}
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

{{< file "example.js" typescript>}}
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
  return (f - 32.)* 5. / 9.;
}
//booleans
var b1; //declared
var b2 = true; //inferred
var b3 = !true; //both
{{</ file >}}

{{< note respectIndent=false >}}
You don’t actually get an immutable variable when you use `const`. To do that, declare an object member `readonly`.
{{< /note >}}

## The Any Type

A variable of type `any` can store any type. The main reason to use the `any` type is to prevent TypeScript from throwing type-checking errors for that variable.

{{< note type="alert" respectIndent=false >}}
Before using `any`, consider the alternatives of explicit [unions](https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html) and [narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html).
{{< /note >}}

If you don't declare a type, and the type can't be inferred, the variable is set as the `any` type by default. The syntax to declare the `any` type is as follows:

    var a1: any;

There’s a secondary reason to use the `any` type; to write a function that accepts multiple types. It’s much better to use [Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html) to create a function that accepts different types instead of a single type, however, you can also use `any`, as shown in the following example:

{{< file "example.ts" typescript >}}
function wideOpen(x: any) {
  //do something to x that doesn't depend on its type
  return x;
}
{{</ file >}}

By default, TypeScript infers an `any` type for any variable that has neither a declared type nor enough context to infer a type. To disable that, use the `noImplicitAny` or `--strict` TypeScript compiler flag. You can refer to the full list of [TypeScript compiler options](https://www.typescriptlang.org/docs/handbook/compiler-options.html).

    tsc --noImplicitAny my_file.ts

## TypeScript Arrays

There are two ways you can declare an array in TypeScript. They are as follow:

1. Using square brackets.

        //arrays
        let arr1: number[];         //declared
        let arr2 = [1,2,3];         //inferred
        let arr3 = ["one","two","three"];

1. Using [Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html), i.e., the `Array<Type>` as shown below:

        let arr1: Array<string> = ['one', 'two', 'three'];

## Object Types

In TypeScript, you can create types from other types. The most common way to do this is with objects. Objects can be [*anonymous*](https://www.typescriptlang.org/docs/handbook/2/objects.html), [type *aliases*](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-aliases), or [*interfaces*](https://www.typescriptlang.org/docs/handbook/2/objects.html#interfaces-vs-intersections).

{{< note respectIndent=false >}}
Notice the difference in syntax when declaring an interface and a type alias. An interface declaration does not make use of the `=` sign.
{{< /note >}}

{{< file "object_types_example.ts" typescript >}}
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

Optional properties are denoted with a question mark (`?`) after the member name, as shown for the `protocol` members in the example above.

## Unions and Narrowing

Unions are denoted by a vertical bar ('`|`') and allow for more than one type, often as an input parameter to a function. You can’t apply type-dependent code to a union until your code narrows down which of the allowed types have been input. Consider the following example:

{{< file "unions_example.ts" typescript >}}
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

When you run the code, you get the following log output:

{{< output >}}
[LOG]: "Welcome lone traveler Moe"

[LOG]: "Hello, Moe and Larry and Curly"
{{</ output >}}

## More Information

This guide provides an introduction to commonly used types in TypeScript with brief examples to help you get started. To learn more about TypeScript types and their individual implementation details, refer to the [Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html) page on the TypeScript documentation site.
