---
slug: javascript-basics
description: "Want to learn JavaScript basics? Our beginner’s guide explains the fundamentals you need to know including functions, loops, and objects. ✓ Learn more!"
keywords: ['javascript basics','javascript basic','javascript for beginners']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-02-16
modified_by:
  name: Nathaniel Stickman
title_meta: "JavaScript Basics: A Beginner’s Guide from Linode"
title: "JavaScript Guide for Beginners: The Basics You Should Know"
external_resources:
- '[MDN Web Docs: JavaScript Basics](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/JavaScript_basics)'
- '[JavaScript.info: JavaScript Fundamentals](https://javascript.info/first-steps)'
- '[Codecademy: Learn JavaScript](https://www.codecademy.com/learn/introduction-to-javascript)'
authors: ["Nathaniel Stickman"]
---

JavaScript is the programming language that makes the web dynamic. Almost any page you see with action and interactivity has JavaScript behind it. It is also an enormously versatile and capable language in its own right.

This JavaScript guide for beginners introduces you to the world of JavaScript. It aims to help you get started understanding JavaScript's capabilities and characteristics and how to use them. From here, you should be armed with what you need to spring into the wide field of JavaScript.

## What is JavaScript?

JavaScript has become the *de facto* programming language of the web. Where HTML gives web pages their structures, JavaScript makes them come alive. JavaScript gives the ability to make pages dynamic and interactive.

Part of JavaScript's power today is its ability to be run in the browser, without any more ado than a `<script>` tag in an HTML page.

You can learn more about adding JavaScript to HTML pages from our **An Essential Guide on How to Add JavaScript to HTML** guide.

### Where is JavaScript Used?

Mostly, JavaScript is used on the web, making web pages dynamic.

The web is a vast place, but you can find JavaScript in almost every corner of it. Any web page with dynamic or interactive content likely has JavaScript behind it.

### JavaScript Frameworks

Not every page uses the same approach to JavaScript. Numerous frameworks have arisen to enhance the ways JavaScript can be used.

This guide does not delve into any of these frameworks in detail. But, for reference, here is a brief list of some of the most popular JavaScript frameworks:

- [Angular](https://angular.io/); learn more about it in our [An Angular Tutorial for Beginners](/docs/guides/angular-tutorial-for-beginners/) guide

- [React](https://reactjs.org/); get started with it using our [Deploying a React Application](/docs/guides/how-to-deploy-a-react-app-on-ubuntu-18-04/) guide

- [VueJS](https://vuejs.org/); check out our [Building and Using VueJS Components](/docs/guides/how-to-build-and-use-vuejs-components/) guide to find out more about it

Whatever framework you use, or if you are working on JavaScript without a framework, the concepts covered in the rest of this guide are essential. They apply across the wide JavaScript landscape.

### JavaScript on the Back End

JavaScript has become more than the programming language of dynamic web pages. Today, you can also use JavaScript for server-side programming.

This is thanks in large part to [Node.js](https://nodejs.org/). With Node.js, you can do everything from writing web servers to creating desktop applications using JavaScript.

To start learning more about Node.js, take a look at our [How to Install Node.js](/docs/guides/how-to-install-nodejs/) guide.

## Understanding JavaScript: The Fundamentals

What follows is coverage of some of the basics you need to work effectively with JavaScript. The list is not exhaustive, but it includes the core concepts for understanding and improving JavaScript.

Many of these are related to core programming concepts, but some are more specific to JavaScript itself. Keep an eye out for references to our other guides. These can help you whenever you want to dive deeper into a concept.

### Variables

A variable is a name or symbol that holds data. Once a variable has been declared and assigned, its data can be conveniently referenced using only the variable name or symbol.

Variables form one of the fundamental constructs of programming, allowing you to make programs dealing with complex and changing data.

You can learn more about variables in our **Basic Programming Concepts and Methodology** guide.

In JavaScript, there are a few ways to declare variables. Each of these affects the variables' scope. You may want to jump ahead and read more about [Scope](/docs/guides/javascript-basics/#scope) in the section below.

-   The `var` keyword:

    ```command
    var firstVariable = "text data";
    ```

    This keyword was long the standard for declaring JavaScript variables. It scopes a variable to the function holding it, or globally if the variable is not declared within a function

-   The `let` keyword:

    ```command
    let secondVariable = 17;
    ```

    This keyword was introduced to deal with issues and confusion around the scoping of `var`. `let`, in contrast, scopes a variable to the containing block, or, like `var`, globally when it is outside of a block.

    Recently, it has become more common to see the `let` keyword used for declaring variables. The exception is when the program specifically needs the functionality offered by the `var` keyword, but this is rare.

-   The `const` keyword:

    ```command
    const thirdVariable = true;
    ```

    This keyword declares a *constant*, that is, a variable that is set once and not changed after. Like `let` variables, `const` variables are block-scoped.

The following information helps you decide when to use each keyword:

- Use `const` whenever declaring a variable that you expect never to change in the course of your program.

- Use `let` for variables that you do expect to change.

- Use `var` for variables that need function scoping rather than block scoping.

### Conditionals

A conditional is a kind of control structure that executes a particular set of statements if a condition is true. Usually, conditionals also include a path for when the condition is false.

Learn more about conditionals in our **Basic Programming Concepts and Methodology** guide.

The most common conditional in JavaScript — and generally — is the `if` statement. You can often see this statement accompanied by an `else` statement to handle the false condition.

Here is an example of an `if ... else` conditional pair:

```file {title="if_else_example.js" lang="javascript"}
const conditionalVariable = 1;

if (conditionalVariable === 1) {
    console.log("The condition is true.");
} else {
    console.log("The condition is not true.");
}
```

```output
The condition is true.
```

If the conditions for the `if` statement are met, the contents of the `if` block get executed. Otherwise, the contents of the `else` block get executed.

The condition portion most often uses comparison operators. You can find a full list of these in [Mozilla's documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators#comparison_operators). But, to get you started, here are the three most useful operators:

- `===`: Tests if both sides of the operator are of equal value and the same type.

- `<`, `>`: Tests if the left side of the operator is less than or greater than, respectively the right. Add an equals sign (as in `<=` or `>=`) for "less than or equal to" and "greater than or equal to."

- `!=`: Tests if both sides of the operator are not equal.

### Functions

A function defines a program's behavior, and it forms an essential part of almost every JavaScript. A function collects a set of actions and executes them whenever the function gets called.

You can get more in-depth coverage of functions in our **Basic Programming Concepts and Methodology** guide.

JavaScript provides two means of creating functions:

-   Using the `function` keyword. This is the traditional way of creating functions, and still provides the widest functionality.

    ```file {title="functions_keyword_example.js" lang="javascript"}
    function traditionalFunction(x) {
        console.log(x * 2);
    }

    traditionalFunction(4);
    ```

    ```output
    8
    ```

-   Using arrow notation. This provides a concise way to define functions. While it lacks some of the functionality of the `function` keyword, it still fits most of the usual cases where you would declare a function.

    ```file {title="functions_arrow_notation_example.js" lang="javascript"}
    const arrowFunction = (x) => {
        console.log(x * 2);
    }

    arrowFunction(8)
    ```

    ```output
    16
    ```

As you can see from the examples above, functions can take *arguments* (`x` in these cases). An argument can be provided whenever the function is called, letting functions adapt and provide versatile behavior.

### Scope

Scope describes the current context in which code is executed. Variables, including functions in this case, can only be accessed from within their scope.

Typically, the scope is divided into two broad categories:

- *Global scope*, for variables declared outside of blocks

- *Local scope*, for variables declared inside of a particular block

In JavaScript, you can usually identify when code is within a local scope based on the curly braces (`{ }`). Anything inside these is typically within a local scope.

It is entirely possible to have local scopes nested within other local scopes, like a conditional statement within a function. A nested block can access the local variables of the scope it is within. However, the containing block cannot access the local variables of its nested blocks.

To demonstrate, the code below includes some global variables and local ones to show how they work. Look through the comments in the code for explanations of each part.

```file {title="javascript_scope_example.js" lang="javascript"}
// Declares and assigns a global variable.
const globalVariableOne = 12;

// Declares a global variable. Even though it is unassigned, it remains global.
const globalVariableTwo;

// Defines a function in the global scope.
function globalFunctionOne(x) {
    // Now begins the function's local scope.

    let localVariable = x * 2;

    return localVariable;
}

function globalFunctionTwo() {
    // Now begins the function's local scope.

    // Local scope can access global variables, or even variables from the
    // surrounding local scope if there is one.
    return globalVariableOne + globalVariableTwo;
}


if (globalVariableOne > 0) {
    // Now begins the local scope of a conditional.

    // Recall that globalVariableTwo was declared globally. Even if it gets
    // assigned locally, it remains a global variable.
    globalVariableTwo = globalFunctionOne(globalVariableOne);
}

console.log(globalFunctionTwo());
```

On executing the file above, the output would be:

```output
36
```

### Arrays

Arrays are a data type consisting of a collection of values. Arrays keep all of their values in a given order, usually based on the order they are in when added to the array.

To learn more about arrays and other data types, take a look at our **Basic Programming Concepts and Methodology** guide.

In JavaScript, an array is assigned simply by listing elements in square brackets — `[ ]`. For example:

```command
let arrayVariable = [27, "nine", 55, "turtle", true];
```

You can access elements in an array based on their indices. Keep in mind that JavaScript starts indices at zero. Thus, this example prints the first item in the array created above:

```command
console.log(arrayVariable[0]);
```

```output
27
```

Arrays come with a `push` method that allows you to add additional elements. This puts the new item at the end of the array:

```command
arrayVariable.push(98);
```

Another built-in method, `concat`, allows you to combine two separate arrays. Here is an example that first creates a new array then adds the array above to it.

```command
let newArrayVariable = ["hippopotamus"];
newArrayVariable.concat(arrayVariable);

console.log(newArrayVariable);
```

```output
["hippopotamus", 27, "nine", 55, "turtle", true, 98]
```

### Loops

A loop is a kind of control structure that executes a given set of statements iteratively based on a given condition. Loops are useful when you need your program to complete the same tasks a given number of times or on each item in an array.

To get more details on loops, be sure to check out our **Basic Programming Concepts and Methodology** guide.

JavaScript primarily uses two kinds of loops, `while` loops and `for` loops:

-   A `while` loop executes a given set of statements iteratively until the `while` condition is no longer true:

    ```file {title="javascript_loops_example.js" lang="javascript"}
    // Create a variable to use for the `while` condition.
    var loopCounter = 1;

    // Define a loop that continues until the counter variable
    // reaches 10.
    while (loopCounter <= 10) {
        // Do something with the variable. This lets your program do
        // something different with each iteration.
        console.log(loopCounter);

        // Advance te variable to eventually end the loop.
        loopCounter = loopCounter + 1;
    }
    ```
    On executing the file above, the output would be:

    ```output
    1
    2
    3
    4
    5
    6
    7
    8
    9
    10
    ```

-   A `for` loop executes a given set of statements for a certain range. The `for` loop's condition starts with a variable, defines an endpoint, and expresses how to progress through the range:

    ```file {title="javascript_for_loop_example.js" lang="javascript"}
    // Create a loop over a range beginning at 0, ending at before 10,
    // and progressing one step at a time.
    for (let i = 0; i < 10; i++) {
        // Create a condition to only react when `i` is divisible
        // by 2.
        if (i % 2 === 0) {
            console.log(i * 10)
        }
    }
    ```

    On executing the file above, the output would be:

    ```output
    20
    40
    60
    80
    ```

    JavaScript has an additional variant of the `for` loop. Arrays in JavaScript come with a `forEach` method. This method takes a function as an argument and iteratively applies it to each item in the array. The function provided can receive both the contents of the current array element and its index.

    ```file {title="javascript_foreach_loop_example.js" lang="javascript"}
    let anArray = ["aardvark", "badger", "capybara"];

    anArray.forEach( (value, index) => {
        let valueToPrint = index.toString() + ": " + value;
        console.log(valueToPrint);
    });
    ```
    On executing the file above, the output would be:

    ```output
    1: aardvark
    2: badger
    3: capybara
    ```

### Objects

Objects make up the fundamental data type in JavaScript outside of primitive data types like integers and strings.

A JavaScript object is, essentially, a collection of properties. And properties can be just about anything, from primitive data types to functions, to other objects.

Refer to our **JavaScript Objects Tutorial** for more in-depth coverage of objects in JavaScript. You may also want to reference our **Object Oriented Programming - OOP Meaning** guide to learn more about the object-oriented programming paradigm that JavaScript leverages.

As the guide on JavaScript objects referenced above shows, there are numerous ways of creating objects in JavaScript. This guide, however, focuses on just one to give you an idea of how objects can be used.

This example shows two objects, `firstCar` and `secondCar`, that use the same property names. Because these objects are built on a similar model, the program can effectively compare them:

```file {title="javascript_objects_example.js" lang="javascript"}
// Create the car objects. Alternatively, the program could use a function
// or one of the methods in the guide referenced above to create multiple
// objects from the same model, further ensuring consistency.
const firstCar = {
    make: "Toyota",
    model: "Camry",
    year: 1999,
    color: "gray"
}

const secondCar = {
    make: "Honda",
    model: "Civic",
    year: 1997,
    color: "blue"
}

// Create a function to compare two car objects.
function compareCarYears(carOne, carTwo) {

    // These variables give names more convenient for printing.
    const carOneName = carOne.make + " " + carOne.model;
    const carTwoName = carTwo.make + " " + carTwo.model;

    // Use a conditional to determine whether carOne is older, younger, or
    // the same age as carTwo, and take actions appropriately.
    if (carTwo.year > carOne.year) {
        carOneYearsOlder = carTwo.year - carOne.year;

        console.log("The " + carOneName + " is " + carOneYearsOlder + " years older than the " + carTwoName + ".");
    } else if (carTwo.year < carOne.year {
        carTwoYearsOlder = carOne.year - carTwo.year;

        console.log("The " + carTwoName + " is " + carTwoYearsOlder + " years older than the " + carOneName + ".");
    } else {
        console.log("The " + carOneName + " is as old as the " + carTwoName + ".");
    }
}

comparCarYears(firstCar, secondCar);
```

On executing the file above, the output would be:

```output
The Honda Civic is 2 years older than the Toyota Camry.
```

Objects are versatile tools for adding structure and consistency when constructing JavaScript applications. This is especially the case as programs grow in size and complexity.

## Conclusion

Throughout this guide, you have seen the basics of JavaScript. Everything you need to get started working with JavaScript programming, you can find a jumping-off point in this guide.

This guide has also referenced some of our other guides related to programming basics and JavaScript that you should go back and check out. These are sure to take you deeper into the world of JavaScript, and programming generally.

You may also want to look at our **Introduction to the DOM** and **JavaScript Events: A Tutorial** guide to go even deeper into the world of web programming and JavaScript.

Have more questions or want some help getting started? Feel free to reach out to our [Support](https://www.linode.com/support/) team.
