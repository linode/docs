---
slug: how-to-use-javascript-map-function
description: "Learn how to use JavaScript's map() function to manipulate and transform arrays in this beginner's tutorial."
og_description: "Learn how to use JavaScript's map() function to manipulate and transform arrays in this beginner's tutorial."
keywords: ['JavaScript map function','How to use JavaScript map function','what is map function']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2023-04-03
modified_by:
  name: Linode
title_meta: "How to Use the JavaScript Map() Function to Transform Arrays"
title: "Using the JavaScript map() Function: A Comprehensive Guide for Beginners"
authors: ['Jeff Novotny']
external_resources:
- '[Mozilla Developers documentation for Array.map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)'
---

This tutorial shows how to use the JavaScript `map()` function, which applies a transformation to the data in an array and constructs a second parallel array. Using the `map()` function to transform an array is an alternative to using the `for` keyword or the `forEach()` function. An example of using the JavaScript `map()` function looks like:

```
anArray.map(function(value, index, array) { /* function body */ })
```

This guide explains:

- [What the JavaScript map() function is](#what-is-the-javascript-map-function)
- [What the syntax for the JavaScript map() function is](#javascript-map-function-syntax)
- [How to use the JavaScript map() function in practice](#how-to-use-the-javascript-map-function), using examples for numerical transformation, string processing, and HTML generation.
- [How the JavaScript map() function compares to using for loops and the forEach function](#a-comparison-between-javascript-map-function-and-forforeach)
- [When and why to use the JavaScript map() function](#usage-notes-for-the-javascript-map-function)

{{< note >}}
The JavaScript `map()` method is not the same as the [JavaScript `Map` object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map), which stores an ordered sequence of key-value pairs.
{{< /note >}}

## What is the JavaScript map() Function?

The JavaScript `map()` function is a built-in method belonging to the Array [object prototype](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Object_prototypes). It is one of JavaScript's iterators and is designed to work in conjunction with a functional programming model. The `map()` function is invoked on an instance of a [JavaScript `Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array).

{{< note >}}
Throughout the text of the guide, references to the `map()` method are shorthand for `Array.prototype.map()`.
{{< /note >}}

To understand how `map()` works, consider this basic example for invoking it on an array named `anArray`:

```file
const newArray = anArray.map(function(value, index, array) { /* function body */ })
```

- `map()` calls a designated helper function once for every item in the array, processing the items sequentially in their original order.
- `map()` passes the current value, index, and the original array to the function. For some use cases, only the value is required. In these cases, the index and array parameters can be omitted from the helper function's definition.
- The helper function transforms or processes the original data to generate a return value.
- The `map()` method uses the return values to build a new array. It returns this array to the code that called `map()`. In the example code above, this new array is stored in `newArray`.

Unlike some JavaScript iterators, the `map()` method is non-mutating. It does not alter the original array. The return value from `map()` is an entirely new array object. The `map()` method is an ECMAScript5 (ES5) feature and is supported by all modern browsers. It can act upon any JavaScript array, even an empty array or one containing undefined items.

{{< note title="`map()` execution sequence" >}}
The execution path for the `map()` method follows these steps:

1.  `map()` calls the helper function for the first item in the array. It passes three parameters to the function:
    - The value of the first array item.
    - The index of the item (optional parameter).
    - The original array object (optional parameter).
1.  The function runs to completion and returns a value derived from the input.
1.  The `map()` method appends the return value to the new array it is building.
1.  It then calls the function for the next item of the array, receives a return value and appends it to the new array.
1.  `map()` repeats this process for each array item until there are no more items remaining. It does not call the function for an empty array element.
1.  `map()` uses the new array as its return value. The initial array remains intact unless the helper function has altered any of its values.
{{< /note >}}

## JavaScript map() Function Syntax

The `map()` method can follow one of several formats, depending on the definition of the helper function. In each case, the `map()` method works the same way:

- **Inline function**: The associated function is defined inline as an argument to `map()`. The function accepts up to three values.

    ```file
    const newArray = anArray.map(function(value, index, array) { /* function body */ })
    ```

- **Callback function**: The associated function is explicitly defined elsewhere in the code. In the example code below, this is referenced as `callbackFn`. `map()` accepts the name of the function as its parameter. The function can specify the `value`, `index` and `array` as potential parameters.

    ```file
    function callbackFn(value, index, array) {
        /* function body */
    }

    const newArray = anArray.map(callbackFn)
    ```

- **Arrow function**: The associated function is defined inline as an *arrow function*. An arrow function uses a simplified notation that is handy for short, concise functions. Although the syntax is pared down, this is similar to the inline function syntax.

    ```file
    const newArray = anArray.map((element, index, array) => { /* function body */ })
    ```

    {{< note >}}
    Arrow functions behave differently from a regular function expressions in a few ways, as described in the [MDN web documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions).
    {{< /note >}}

In many cases, the `array` argument is not required and is not included as a parameter. Without the third argument, the inline function syntax is structured as follows:

```file
const newArray = anArray.map(function(value, index) { /* function body */ })
```

It is also possible to pass the `this` keyword to the `map()` method. In practice, the `this` argument is not typically used. If it is used, `this` is the passed as the second parameter to the `map()` method, after the callback function:

```file
const newArray = anArray.map(function(value, index, array) { /* function body */ }, this)
```

## How to Use the JavaScript map() Function

Using the `map()` function is a good approach whenever an algorithm must derive a second array from the initial set of values. Some examples of typical use cases include transforming numerical data, manipulating strings, and generating HTML code. The following examples illustrate some common use cases.

### Using JavaScript map() Function for Numerical Transformation

The example below uses the JavaScript `map()` function for numerical processing. It accepts an array containing the salaries of a group of employees. The example code applies a 20% raise to the employees' salaries:

```file
const salaries = [60000, 55000, 75000, 65000];
let newSalaries = salaries.map(function(nextValue){
    return nextValue * 1.2;
});
console.log(salaries);
console.log(newSalaries);
```

Executing this code results in the following output:

```output
[ 60000, 55000, 75000, 65000 ]
[ 72000, 66000, 90000, 78000 ]
```

- The `salaries` array, which contains the employees' original salaries, does not change when this code is executed. The old set of values is retained and can be used to reference the employees' historical salaries.
- `map()` is invoked using an inline function. The inline function only uses the value of each item, so it only has one parameter. The optional index and array arguments are omitted.
- The new array returned by `map()` is stored in the `newSalaries` array.

{{< note title="Test the example in your browser">}}
The JavaScript code example can be tested in a web browser debugger. To run a small amount of JavaScript code without embedding it in a web page, use the browser developer tools. For instance, in Firefox choose **Tools** -> **Browser Tools** -> **Web Developer Tools**. Then select the **Debugger** tab. Enter the JavaScript commands at the `>>` prompt.

Several third-party web applications also allow users to write and test JavaScript code using a JavaScript emulator.
{{< /note >}}

The inline function from the code example can be rewritten using an arrow function. The following is an example of how to convert the original inline function to an arrow function:

```file
const salaries = [60000, 55000, 75000, 65000];
let newSalaries = salaries.map((nextValue) => nextValue * 1.2);
console.log(salaries);
console.log(newSalaries);
```

The results should be the same as before:

```output
[ 60000, 55000, 75000, 65000 ]
[ 72000, 66000, 90000, 78000 ]
```

If the salary raise transformation is used in several places, define it as a callback function. This improves the clarity of the code and promotes maintainability and quality control:

```file
const raiseSalary = nextValue => nextValue * 1.2;

const salaries = [60000, 55000, 75000, 65000];
let newSalaries = salaries.map(raiseSalary);
console.log(salaries);
console.log(newSalaries);
```

`map()` now calls the `raiseSalary` function, rather than an inline function. This code also generates the same results as the other two examples earlier in this section.

### Using JavaScript map() Function for String Processing

Another common use for the `map()` function is to process a series of strings. The strings can be concatenated or reformatted. The example below processes an array representing a queue of customers. For each person, the `map()` function generates a new string combining their last and first names along with their position in the queue:

```file
const customers = [
    {givenName : "Johan", surname: "Doe"},
    {givenName : "Jane", surname: "Client"},
    {givenName : "Bobby", surname: "Person"}
];

let queueEntries = customers.map(function(nextValue, index){
    return(`${index} : ${nextValue.givenName} ${nextValue.surname}`);
});
console.log(customers);
console.log(queueEntries);
```

Executing the JavaScript code above results in the following output:

```output
[{
    givenName: "Johan",
        surname: "Doe",
}, {
    givenName: "Jane",
    surname: "Client"
}, {
    givenName: "Bobby",
    surname: "Person"
}]

["0 : Johan Doe", "1 : Jane Client", "2 : Bobby Person"]
```

The inline function in this example uses the [template literal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) syntax to build the string. Each new string is added to the `queueEntries` array.

{{< note >}}
A template literal constructs a string inside the backtick symbols. It allows variables to be inserted in place using the `$` notation.
{{< /note >}}

### Using JavaScript map() Function for HTML Generation

JavaScript is widely used on web pages, where it is often responsible for building HTML markup. In this example, `map()` is used to wrap data in HTML.

```
const customers = [
    {givenName : "Johan", surname: "Doe", score: "75"},
    {givenName : "Jane", surname: "Client", score: "100"},
    {givenName : "Bobby", surname: "Person", score: "82"}
];

let queueEntries = customers.map(function(nextValue){
    return `<h2>${nextValue.givenName} ${nextValue.surname}</h2>
    <p>${nextValue.score}</p>`
});
document.body.innerHTML = queueEntries;
```

When this code is run in a web browser developer console, the body of the page is updated with the following markup:

```output
<body>
    <h2>Johan Doe</h2>
    <p>75</p>
    ,
    <h2>Jane Client</h2>
    <p>100</p>
    ,
    <h2>Bobby Person</h2>
    <p>82</p>
</body>
```

## A Comparison Between JavaScript map() Function and for/forEach()

`for` loops and the `forEach` function are two other ways to manipulate data in an array:

- A `for` loop can be written that visits each index in an array.
- Like the `map()` function, the `forEach()` function is also invoked on array objects. It accepts a helper function argument that is executed on the elements in the array. However, the `forEach()` function does not return a value, unlike the `map()` function.

The behavior of a JavaScript `for` loop is defined inside the body of the loop. However, it does not automatically generate a new array either. Any new data structures must be deliberately created or modified inside the body of the loop.

In practice, a distinction between `map()` and the `forEach()` is that the helper function passed to `map()` generally does not alter the original array. Code that uses the `forEach()` function sometimes modifies the original array, instead of creating a new data structure.

Use `map()` to retain the original array and create a new array derived from the values of the first array. `forEach()` or a `for` loop can be used to permanently modify the original array, or to discard the newly-calculated values after use. `forEach()` and `for` are also better choices for operations where the original array is not modified, including logging or printing.

## Usage Notes for the JavaScript map() Function

There are a few additional considerations to keep in mind when using the `map()` method:

- Concurrent modification of the original array is strongly discouraged. In other words, do not add or delete any array elements inside the helper function. Although the `map()` function has rules regarding these situations, the resulting code is typically confusing and hard to debug.

- Do not use functions that can take additional optional parameters directly as callback functions. The `index` element could be accidentally passed to the function as a second parameter, leading to errors or confusing results.

- Use the `map()` method when both arrays must be retained. Do not use `map()` if the program has no further use for the new array or if the original data can be discarded.

- The helper function must return a new value with each iteration of the loop. If the function does not return anything, do not use it with `map()`.

See the [MDN web documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) for further information.

## Conclusion

The JavaScript `map()` method is a handy tool for array processing. It applies a transformation to the data in an array to create a new array, leaving the original array untouched. The `map()` method accepts an inline, arrow, or callback function as a parameter. It calls this function once for each item in the array, passing in data about the array and receiving a return value in reply.

Programmers can use the JavaScript `map()` procedure for numerical processing, string manipulation, HTML generation, and other purposes. `map()` is an alternative to the `forEach()` function and `for` loop. Code that uses `forEach` and `for` can alter the original data and does not necessarily create a new array. For more information about the `map()` method, consult the [MDN web documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map).