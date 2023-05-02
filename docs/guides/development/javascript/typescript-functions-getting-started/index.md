---
slug: typescript-functions-getting-started
description: 'This guide provides an introduction to creating functions in TypeScript. It discusses some of the differences between functions in JavaScript and TypeScript'
keywords: ['typescript functions']
tags: ['typescript']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-10-29
modified_by:
  name: Linode
title: "Getting Started with TypeScript Functions"
title_meta: "TypeScript Functions: Getting Started"
authors: ["Martin Heller"]
---

## Declaring Functions

JavaScript supports both named and anonymous functions, and TypeScript inherits this syntax. The example below shows two ways you can create functions in JavaScript and TypeScript. To create a function use the `function` keyword and enclose the body of the function in curly brackets.

{{< file function_example.ts typescript>}}
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

Adding type annotations using TypeScript can make a huge difference in the stability of JavaScript code. Instead of hiding until run-time, many errors show up while editing with TypeScript supported editors, or during the compilation phase. For example, consider a simple function to convert degrees Fahrenheit to Celsius.

{{< file example_function.ts typescript>}}
function FtoC (f) {
    return (f - 32.) * 5. / 9.
}
{{</ file >}}

In the example above, the `f` parameter's type is `any` by default. This means you can call this function with any kind of value, for instance:

{{< file example_function.ts typescript>}}
function FtoC (f) {
    return (f - 32.) * 5. / 9.
}

FtoC(32);      // number
FtoC("hello");   // string
{{</ file >}}

The `FtoC()` function should not accept a value of type `string`. When declaring your function, you can assign the `number` type to the parameter. Doing so means that an error is generated when  calling the `FtoC()` function with a parameter of type `string`.

{{< file example_function.ts typescript>}}
function FtoC (f: number) {
    return (f - 32.) * 5. / 9.
}

FtoC(32);
FtoC("hello");
{{</ file >}}

You don’t need to annotate the return type, because the TypeScript compiler infers the correct type, `number`.

In a TypeScript supported editor such as **Visual Studio Code**, or in the **tsc** compiler, the second call, `FtoC("hello");` now generates an error message:

{{< output >}}
Argument of type 'string' is not assignable to parameter of type 'number'.ts(2345)
{{</ output >}}

{{< note respectIndent=false >}}
The transpiled **FtoC.js** can run even though the compiler generated an error. This is because all the TypeScript annotations are stripped out, and the TypeScript philosophy is to "report errors but trust the programmer". The second call generates a `NaN` when it tries to perform arithmetic, since “hello” is not a number, and the call returns `undefined`.
{{< /note >}}

## Using Generics

If you write a function with no type attributes, then the attribute types default to `any`. This can be convenient when a function's attribute types are not important. However, it may make things harder when you have code that needs to consume the function’s return value.

A way around this it o use [generics](https://www.typescriptlang.org/docs/handbook/2/functions.html#generic-functions). Generics are expressed with angle brackets, denoted by the type variable `<Type>`. You can use generics to tie the type of one value to another, as in the example below from the TypeScript documentation.

{{< file generics_example.ts typescript>}}
function firstElement<Type>(arr: Type[]): Type {
  return arr[0];
}

// s is of type 'string'
const s = firstElement(["a", "b", "c"]);

// n is of type 'number'
const n = firstElement([1, 2, 3]);
{{</ file >}}

In this example, TypeScript infers the type of `<Type>` from the input array and propagates that to the return value. `["a", "b", "c"]` is an array of strings, so `s` is a string. `[1, 2, 3]` is an array of numbers, so `n` is a number.

{{< note respectIndent=false >}}
You can also constrain generics using the [extends](https://www.typescriptlang.org/docs/handbook/2/functions.html#constraints) clause.
{{< /note >}}

## Optional Parameters

JavaScript lets you assign default values to function parameters. This makes the parameters optional when calling the function. TypeScript also lets you declare optional parameters without setting their default values. This is done by adding a `?` after the variable name, as shown in the example below:

{{< file optional_params_example.ts typescript>}}
function f(x?: number) {
    console.log(typeof x, x)
}
f(); // OK
f(10); // OK
{{</ file >}}

{{< note respectIndent=false >}}
You should not define optional parameters unless there are actual use cases where you would omit them.
{{< /note >}}

## Function Overloads

With [*function overloads*](https://www.typescriptlang.org/docs/handbook/2/functions.html#function-overloads) you can call a single function in different ways. However, writing good function overloads is tricky, since the implementation overload has to be compatible with all the overload signatures.

{{< file function_overload_example.ts typescript>}}
function len(s: string): number;
function len(arr: any[]): number;
function len(x: any) {
 return x.length;
}
{{</ file >}}

The function overloads in the example above can handle strings or arrays. Before writing function overloads, consider writing a function with union types for arguments, as shown in the following example:

{{< file function_overload_example.ts typescript>}}
function len(x: any[] | string) {
 return x.length;
}
{{</ file >}}

## Further Information

To learn more about functions, visit the [More on Functions](https://www.typescriptlang.org/docs/handbook/2/functions.html) page in the TypeScript documentation. You can also visit the [TypeScript playground](https://www.typescriptlang.org/play) to get some hands-on practice.
