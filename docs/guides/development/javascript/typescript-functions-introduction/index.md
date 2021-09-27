---
slug: typescript-functions-introduction
author:
  name: Martin Heller
description: 'Two to three sentences describing your guide.'
og_description: 'Two to three sentences describing your guide when shared on social media.'
keywords: ['list','of','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-09-24
modified_by:
  name: Linode
title: "Typescript Functions: An Introduction"
h1_title: "TypeScript Functions: An Introduction"
enable_h1: true
contributor:
  name: Martin Heller
  link: https://twitter.com/meheller
external_resources:
- '[Link Title 1](http://www.example.com)'
- '[Link Title 2](http://www.example.net)'
---

JavaScript supports functional programming, including closures, recursion, and lambdas (anonymous functions). Given JavaScript’s weak, dynamic typing, JavaScript functions are prone to several kinds of errors. For example, you can call a JavaScript function with arguments it doesn’t know how to handle, and it blithely tries to process them. The result might be that the function returns a nonsense result, or that it throws an error. Unfortunately, the error won’t usually be found until the program runs.

## Declaring Functions

JavaScript has both named and anonymous functions, and TypeScript inherits this syntax. TypeScript adds type declarations, which help to catch errors at compile time. Just to show you the basics, here are two simple JavaScript (and TypeScript) functions, which use the function keyword and enclose the body of the function in curly brackets:

{{< file >}}
// Named function
function add(x, y) {
 return x + y;
}

// Anonymous function
let myAdd = function (x, y) {
 return x + y;
};
{{</ file >}}

## Using TypeScript Types to Catch Bugs in Functions

Adding type annotations using TypeScript can make a huge difference in the stability of JavaScript code. Instead of hiding until run-time, many errors show up while editing with a TypeScript-aware editor or IDE, or during the compilation phase. For example, let’s consider a simple function to convert degrees Fahrenheit to Celsius.

{{< file >}}
function FtoC (f) {
    return (f - 32.) * 5. / 9.
}
{{</ file >}}

By default, the type of f is any. So you could call this function with any kind of value, for instance:

{{< file >}}
FtoC(32); 	    // reasonable
FtoC("duh");   // junk
{{</ file >}}

We can make the junk call generate an error prior to runtime simply by giving the FtoC parameter f a TypeScript type annotation of number:

{{< file >}}
function FtoC (f: number) {
    return (f - 32.) * 5. / 9.
}

FtoC(32);
FtoC("duh");
{{</ file >}}

We don’t need to annotate the return type, because the TypeScript compiler infers the correct type, number.

In a TypeScript-aware editor such as **Visual Studio Code**, or in the **tsc** compiler, the second call now generates an error message:

{{< output >}}
Argument of type 'string' is not assignable to parameter of type 'number'.ts(2345)
{{</ output >}}

The transpiled **FtoC.js** can run even though the compiler generated an error, because all the TypeScript annotations are stripped out, and the TypeScript philosophy is to report errors but trust the programmer. The second call generates a **NaN** when it tries to do arithmetic, since “duh” is not a number, and the call returns undefined.

## Using Generics

If you want to write a function with no type attributes, then (as we mentioned earlier) the types default to any. This can be convenient when the function doesn’t care about its variables, but it may make things harder for code that consumes the function’s return value.

There’s a way around this: [generics](https://www.typescriptlang.org/docs/handbook/2/functions.html#generic-functions), expressed with angle brackets. You can use generics to tie the type of one value to another, as in this example from the TypeScript documentation.

{{< file >}}
function firstElement<Type>(arr: Type[]): Type {
  return arr[0];
}

// s is of type 'string'
const s = firstElement(["a", "b", "c"]);
// n is of type 'number'
const n = firstElement([1, 2, 3]);
{{</ file >}}

In the example above, TypeScript infers the type of <Type> from the input array and propagates that to the return value. ["a", "b", "c"] is an array of strings, so s is a string. [1, 2, 3] is an array of numbers, so n is a number.

You can also constrain generics using an [extends](https://www.typescriptlang.org/docs/handbook/2/functions.html#constraints) clause.

## Optional Paremeters

JavaScript lets you give function parameters default values, which makes them optional. TypeScript supports that, but also lets you declare optional parameters without setting their default values. This is done by adding a ? after the variable name.

{{< file >}}
function f(x?: number) {
    console.log(typeof x, x)
}
f(); // OK
f(10); // OK
{{</ file >}}

For the first call to f() the type of x is "undefined" and the value is undefined.

Note that you should not define optional parameters unless there are actual use cases where you would omit them.

## Function Overloads

Sometimes you want to provide different ways to call a single function. The good news is that TypeScript supports function overloads. The bad news is that writing good ones is tricky, since the implementation overload has to be compatible with all the overload signatures.

{{< file >}}
function len(s: string): number;
function len(arr: any[]): number;
function len(x: any) {
 return x.length;
}
{{</ file >}}

This set of overloads can handle strings or arrays. It’s less than optimal. Before writing function overloads, consider writing a function with union types for arguments, for example:

{{< file >}}
function len(x: any[] | string) {
 return x.length;
}
{{</ file >}}

## Definitely Typed

Most JavaScript libraries can be used from TypeScript. The site [DefinitelyTyped](http://definitelytyped.org/) provides TypeScript type [declaration files](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html) for many of these. Declaration files have the suffix .d.ts, and the files contain function prototypes with the `export` keyword and TypeScript type annotations, for example:

{{< file >}}
export function getArrayLength(arr: any[]): number;
{{</ file >}}

## Further Information

If your curiosity is piqued, you can find more [documentation](https://www.typescriptlang.org/docs/handbook/2/functions.html) at TypeScript Language, or in its [playground](https://www.typescriptlang.org/play). You can also invoke the playground using the Try button in most of the example code.


