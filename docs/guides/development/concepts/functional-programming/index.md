---
slug: functional-programming
author:
  name: Linode Community
  email: docs@linode.com
description: "What is functional programming and why should you use it? Our article answers these questions and highlights key concepts you should know. ✓ Get started!"
og_description: "What is functional programming and why should you use it? Our article answers these questions and highlights key concepts you should know. ✓ Get started!"
keywords: [functional programming','what is functional programming','function programming']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-02-03
modified_by:
  name: Nathaniel Stickman
title: "Functional Programming: Paradigm for Application & Composition"
h1_title: "Functional Programming: What It Is and Key Concepts to Keep in Mind"
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
external_resources:
- '[Towards Data Science: Why Developers Are Falling in Love with Functional Programming](https://towardsdatascience.com/why-developers-are-falling-in-love-with-functional-programming-13514df4048e)'
- '[GeeksforGeeks: Functional Programming Paradigm](https://www.geeksforgeeks.org/functional-programming-paradigm/)'
- '[JavaScript Scene: Master the JavaScript Interview: What Is Functional Programming?](https://medium.com/javascript-scene/master-the-javascript-interview-what-is-functional-programming-7f218c68b3a0)'
- '[InfoWorld: What is Functional Programming? A Practical Guide](https://www.infoworld.com/article/3613715/what-is-functional-programming-a-practical-guide.html)'
---

Functional programming has gone in recent years from niche to mainstream, with widespread adoption especially within the JavaScript community. Why is this, and what makes functional programming stand out for many developers?

In this tutorial, you can find out. Learn what functional programming is and what sets it apart. Discover the principles that draw people to this paradigm, and see what languages offer its features.

## What is Functional Programming?

Functional programming is a programming paradigm based on the ideas of lambda calculus. In functional programming, everything is built on functions and with the idea of avoiding side effects.

Because functional programming is a *declarative* paradigm, it is concerned with what programs are doing, the logic of an application. This is in contrast to *imperative* paradigms, like object-oriented programming, which are concerned with how programs do what they do.

Think of functional programming in contrast to object-oriented programming. With object-oriented programming, programs are concerned with objects and the states those objects maintain, with behaviors responding to these objects' states.

With functional programming, on the other hand, program behavior, the logic of functions is at the center. Programs should be entirely without state, with everything being determined by the flow of functions.

The guide delves into these further on, but to provide more of a foundation, here are the principles functional programming puts at the forefront:

- Functions are first-class citizens, treated as any other value or data type

- Pure functions are the norm, these being functions in which only explicit input has any effect on the output

- Values should be immutable, meaning that, once set, values cannot be altered

These principles center on functional programming's goals of having everything be built on functions and avoiding or eliminating side effects. Accomplishing these, advocates of functional programming say, makes program logic more transparent and predictable.

### What is a Functional Language?

Modern languages tend to cover multiple paradigms. This fortunately means that many of the languages you are likely already familiar with support functional programming principles. Some languages, however, do so to a wider extent than others, and these few are great examples:

- JavaScript

- Python

- Scala

In fact, JavaScript has seen a boom in functional programming practices. It has been the JavaScript community in large part that has elevated functional programming to the mainstream recently. The React framework, for example, is one of the most popular JavaScript frameworks and is built on functional programming concepts.

Scala also brings up an interesting point. The language is fundamentally object oriented — everything in Scala is an object. However, it is exemplary in its support of functional practices. Functions are first-class citizens, it has extensive support of maps and other higher-order functions, and it promotes ways of maintaining immutability.

There are also a set of languages considered more purely functional. These are languages that are fundamentally built on functional programming principles and are designed for all programs to follow them. Here are some considerable examples:

- Haskell

- Clojure

- Elixir

- F#

While Haskell is mostly used for research, you can find a couple of these languages gaining traction in application development. F# has gained a foothold for some financial computing, and Elixir has shown its remarkable capabilities when it comes to web applications that need concurrency.

## Why Functional Programming?

Above, the guide alluded to a couple of the benefits of functional programming, specifically predictability.

Functional programming brings an array of benefits that can be appreciated in a wide range of programming contexts.

- Predictability. Functional programming promotes immutability and the use of pure functions. Together, these make it clearer what each part of your program is doing and easier to anticipate each part's response.

- Testing. The use of pure functions in functional programming can significantly streamline testing. When you want to run tests or to debug, you can do so on a function-by-function basis, knowing that each function only responds to its explicit inputs.

- Concurrency. The lack of side effects makes functional programming excellent for parallel processing. Because each of function is only affected by its explicit input, functions can often be run concurrent, without having to worry about a shared state that could be getting altered by other functions.

- Clarity. Functional programming aims to make every part of your program more transparent. Every function behaves predictably, and there is no shared state floating around that you have to guess at the permutations of. Additionally, its clarity often makes it easier for compilers and interpreters to catch errors early, reducing run-time errors.

As a down side, functional programming does often require more memory. The nature of its recursive and higher-order functions and immutability can result in higher memory usage than in object-oriented and procedural counterparts.

## Functional Programming Concepts

Above, the guide has touched on functional programming's principles. These next several sections elaborate on them along with some key concepts that derive from those principles.

This list is not intended to be exhaustive. However, it does cover some of the most relevant and useful topics related to functional programming.

### Pure Functions

Previous sections already mentioned that pure functions are functions in which the output is solely determined by the input. Doing so eliminates side effects and increases predictability.

To put this in perspective, compare it with functions, or methods, in object-oriented programming:

``` javascript
class ClassA {
    constructor() {
        this.stateValueY = 2;
    }

    methodA(inputX) {
        var outputZ = inputX * stateValueY;
        return outputZ;
    }
}

```

- A method, `methodA`, takes `inputX` and produces `outputZ`. The method calculates the value of `outputZ` by doing `inputX * stateValueY`, where `stateValueY` is a value assigned on the same object as `methodA`.

- Say that `stateValueY` defaults to `2`. Thus, the method starts predictably — when `inputX = 4`, you can expect to get `outputZ = 8`. But the value of `stateValueY` may change, at which point the method becomes unpredictable. You cannot reliably predict the method's output without knowing everywhere in your program that could alter `stateValueY`.

- The issue is most apparent when the method needs to be called from another part of the program, say by `methodB`. When `methodB` calls `methodA`, it has no way of reliably anticipating the nature of the value returned.

    For instance, say `methodB` is initially designed with the assumption that `stateValueY` is only ever a positive integer. But, subsequently, another part of the program modifies `stateValueY` in such a way as to allow negative integers.

    Suddenly, `methodB` becomes a time bomb. The program may run fine and as expected until events occur that modify `stateValueY` to a negative integer.

    The fix may be easy enough in this example. But that becomes less and less the case as the program's size grows and as the values and calculations become more complex.

Now, take a look at a similar scenario using pure functions:

``` javascript
function functionA(inputX, inputY) {
    const outputZ = inputX * inputY;
    return outputZ;
}

```

- A function, `functionA`, takes `inputX` and `inputY` to produce `outputZ`. It calculates the value of `outputZ` as `inputX * inputY`.

- Because of this, the value is at base easy to predict. The input values are always explicitly provided to the function, so the output does not come as a surprise. And, as a consequence, the program becomes less likely to run-time errors.

- Pure functions like this shine when it comes to testing. You can, for instance, run a series of `inputX` and `inputY` values through `functionA` to verify its behavior. Any subsequent function that uses `functionA` can then be independently tested, trusting `functionA` to do its part.

### Avoiding Side Effects

Side effects are changes to a program's state, the global and local values that exist independently of functions. To avoid side effects thus entails preventing changes to these values.

You can see in the section on pure functions above how these functions contribute to limiting side effects in functional programs. A pure function only operates on its own input to produce a given output, and it does not interfere with external values.

Functional programming also promotes immutability to practically eliminate side effects. With immutability, a value, once set, does not change.

Immutability continues on the advantages of pure functions. For instance, say you have a `stateValueX` that starts as `10`. A program without immutability may allow that value to change to `-3` or even `-3.4` in the course of various operations. Suddenly, a function may receive a negative float-type value where it had expected a positive integer value.

### Recursion

Functional programming does not use traditional loops. Instead, it uses a combination of conditions and recursive functions.

A recursive function is a function that calls itself to iterate through data collections like lists. The function continues to call itself, operating on its input in some way with each iteration until it reaches the last element.

Here is an example in JavaScript. It uses two recursive functions — `recursiveFibonacci` and `listFibonacci` — to list the Fibonacci numbers out to a given length:

``` javascript
// Gets a Fibonacci number at a given position in the sequence.
function recursiveFibonacci(x) {
    // Ensures an end to the recursive loop by handling the last iterations
    // with a set number rather than further recursion.
    if (x < 2) {
        return 1;
    }

    // Call the function again, with lower and lower input values. The
    // results are combined with each recursion, and this combined result
    // gets returned when all of the recursions resolve.
    else {
        return recursiveFibonacci(x - 2) + recursiveFibonacci(x - 1)
    }
}

// Creates a string listing the Fibonacci numbers to a given length. When
// the funciton gets called, `result` should be an empty string. That
// parameter, instead, gets used in the recursive process.
function listFibonacci(y, result) {
    // Ensures an end to the recursive loop by handling the last iteration.
    if (y < 0) {
        return result;
    }

    // Call the function again, using a lower input value each time. With
    // each recursion, the `result` string gets expanded until it is
    // returned on the final recursion, in the `if` statement above.
    else {
        return listFibonacci(y - 1, recursiveFibonacci(y).toString() + " " + result)
    }
}

listFibonacci(5, "")
```

{{< output >}}
'1 1 2 3 5 8 '
{{< /output >}}

Incidentally, the `listFibonacci` function above is an example of *function composition*. This is a functional programming concept in which two or more functions are combined to perform some logic.

### Referential Transparency

Referential transparency is another quality of functional programming, related to the idea of functions as first-class citizens. It refers to the fact that, in a functional programming environment, you can replace any expression, including a function, with its value.

Take the `recursiveFibonacci` function defined above as an example. This function returns `8` when its input value is `5`. Because the program is functional and uses only pure functions and immutability, it has referential transparency. Thus, you could replace `recursiveFibonaci(5)` with `8`:

``` javascript
const functionValue = recursiveFinonacci(5);
const plainValue = 8;

if (functionValue === plainValue) {
    console.log("We have referential transparency!");
}

```

{{< output >}}
We have referential transparency!
{{< /output >}}

### Higher-order Functions

Higher-order functions either take other functions as input arguments, return functions as output, or both.

Higher-order functions serve the purpose of abstracting program behavior. Whereas object-oriented programming abstracts data, using classes, functional programming abstracts behavior through higher-order functions.

Maps are perhaps the mostly widely used kind of higher-order function in functional programming. These functions take a collection, like a list, and a function as arguments. They then apply the function to each item in the list and return a new list of the results:

``` javascript
// Start with a list.
const listValue = [1, 3, 5];

// Create a new list using the map. In JavaScript, the map function belongs
// to the list you want to apply the map on.
const newListValue = listValue.map(item => {
    return item * 10;
});

console.log(newListValue);

{{< output >}}
[10, 30, 50]
{{< /output >}}
```

## Conclusion

With that, you have a foundation to start using the functional programming paradigm. This tutorial explained what functional programming is and elaborated on its principles with examples to help you see them in action.

To take a look at another paradigm, check out our guide [A Comprehensive Guide to Object Oriented Programming](/docs/guides/object-oriented-programming/). Object-oriented programming provides a remarkable contrast to functional programming, and it can be illuminating to study the two in comparison.

Have more questions or want some help getting started? Feel free to reach out to our [Support](https://www.linode.com/support/) team.
