---
slug: typescript-datatypes-introduction
author:
  name: Martin Heller
description: 'Two to three sentences describing your guide.'
og_description: 'Two to three sentences describing your guide when shared on social media.'
keywords: ['list','of','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-09-27
modified_by:
  name: Linode
title: "Typescript Datatypes: An Introduction"
h1_title: "Typescript Datatypes: An Introduction"
enable_h1: true
contributor:
  name: Martin Heller
  link: https://twitter.com/meheller
external_resources:
- '[Link Title 1](http://www.example.com)'
- '[Link Title 2](http://www.example.net)'
---

Data types are essential to TypeScript, even though the underlying types are implemented in JavaScript. TypeScript adds safety through type-checking. When the compiler can’t infer a type, the programmer should declare it.

## Primitive Data Types

The three essential primitive data types in JavaScript and TypeScript are string, number, and boolean. Note that all three are spelled in lower-case. There are capitalized variants of these words that compile successfully in TypeScript, but they refer to boxed types, and there are very few contexts in which they are useful.

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

Note that when this block of code is compiled to JavaScript, all the type annotations are stripped out. If you’re targeting the lowest levels of JavaScript, both const and let are changed to var; if you’re targeting ES6(2015) or greater, they are left as written. In TypeScript and ES6+, let is a block-scoped version of var, and const creates a block-scoped variable that can’t be changed once it is bound.

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

You don’t actually get an immutable variable when you use const. To do that, declare an object member readonly.

## Any

A variable of type **any** can hold any type. The principal reason to use it is to tell TypeScript not to throw type-checking errors for that variable. *Think carefully before you do this*, considering the alternatives of explicit unions and narrowing. Leaving out the type annotation is enough to make the variable type any by default, or you could specifically declare it:

{{< file >}}
var a1: any;
{{</ file >}}

There’s a secondary reason to use any, which is to write a function that doesn’t care about its input type. It’s much better to use a Generic function for that, but should you wish you wish you can:

{{< file >}}
function wideOpen(x: any) {
//do something to x that doesn’t depend on its type
return x;
}
{{</ file >}}

By default, TypeScript infers an any type for any variable that has neither a declared type nor enough context to infer a type. To disable that, use the noImplicitAny TypeScript compiler flag:

    tsc --noImplicitAny my_file.ts

## Arrays

Arrays in TypeScript are denoted by square brackets. For example:

{{< file >}}
//arrays
let arr1: number[];         //declared
let arr2 = [1,2,3];         //inferred
let arr3 = ["one","two","three"];
{{</ file >}}

You can also declare arrays as generics, for example `Array<number>`.

## Object Types

In TypeScript you can create types from other types. The most common way to do so is with objects, denoted by curly brackets. Objects can be anonymous, type aliases, or interfaces. Note that the syntax for interfaces lacks an equals sign, but the syntax for types requires an equals sign.

{{< file >}}
//objects
interface IP4i {
    dns_name: string;
    ip_address: [number,number,number,number];
    protocol?: string;
}

type IP4t = {
    dns_name: string;
    ip_address: [number,number,number,number];
    protocol?: string;
}
{{</ file >}}

Optional properties are denoted with a question mark after the member name, as shown for the protocol members.

## Unions and Narrowing

Unions, denoted by a vertical bar, allow for more than one type, often as an input parameter to a function. You can’t apply type-dependent code to a union until you’ve used code to narrow down which of the allowed types you’ve been given.

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

When you run this, the log output you get is:

{{< output >}}
[LOG]: "Welcome lone traveler Moe"

[LOG]: "Hello, Moe and Larry and Curly"
{{</ output >}}
