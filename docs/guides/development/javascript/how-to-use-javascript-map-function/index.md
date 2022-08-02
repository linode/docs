---
slug: how-to-use-javascript-map-function
author:
  name: Linode Community
  email: docs@linode.com
description: 'This guide explains how the JavaScript map method works on an array and how to use it in a variety of contexts'
og_description: 'This guide explains how the JavaScript map method works on an array and how to use it in a variety of contexts'
keywords: ['JavaScript map function','How to use JavaScript map function','what is map function']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-07-28
modified_by:
  name: Linode
title: "How to Use the JavaScript Map Function | Linode"
h1_title: "How to Use the JavaScript Map Function"
enable_h1: true
contributor:
  name: Jeff Novotny
external_resources:
- '[Mozilla Developers documentation for array.map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)'
---

Although the JavaScript `for` loop and `forEach()` function are both widely used, the `Array.map()` method is a more efficient and useful way to process some arrays. The JavaScript `map()` method applies a transformation to the original data to construct a second parallel array. This guide explains how the `map()` method works and how and when it should be used. It also includes examples illustrating some common use cases.

## What is the JavaScript map() Function?

The JavaScript `map()` function is a built-in method belonging to the array object. It is one of JavaScript's iterators, and is designed to work in conjunction with a functional programming model.

{{< note >}}
Throughout the guide, the `map()` method refers to the `Array.map()` method.
{{< /note >}}

`map()` calls a designated helper function once for every item in the array, processing the items sequentially in their original order. `map()` passes the current value, index, and the original array to the function. The helper function transforms or processes the original data to generate a return value. The `map()` method uses the return values to build a new array, which serves as its own return value.

Unlike some JavaScript iterators, the `map()` method is non-mutating. It does not alter the original array. The return value from `map()` is an entirely new array object.

The `map()` method is an ECMAScript5 (ES5) feature and is supported by all modern browsers. It can act upon any JavaScript array, even an empty array or one containing undefined items.

The execution path for the `Array.map()` method follows these steps.

1.  `map()` calls the helper function for the first item in the array. It passes three parameters to the function:
    - The value of the first array item.
    - The index of the item. This is an optional parameter.
    - The original array object. This is also optional.
2.  The function runs to completion and returns a value derived from the input.
3.  The `map()` method appends the return value to the new array it is building.
4.  It then calls the function for the next item of the array, receives a return value and appends it to the new array.
5.  `map()` repeats this process for each array item until there are no more items remaining. It does not call the function for an empty array element.
6.  `map()` uses the new array as its return value. The initial array remains intact, unless the helper function has altered any of its values.

The `Array.map()` method can follow one of several formats, depending on the definition of the helper function. In each case, the `map()` method works the same way. It calls the helper function and receives a value back. `map()` can potentially pass up to three values to the function, representing the value, index, and array. However, in many cases, only the value is required, and the remaining parameters are not explicitly defined.

Here are the three versions for the `map()` command.

- **Inline Function**: In this approach, the associated function is defined inline as an argument to `Array.map`. The function accepts up to three values.

        Array.map(function(value, index, array) { /* function body */ })
- **Callback function**: In this case, the `callbackFunct()` is explicitly defined elsewhere. `Array.map` accepts the name of the function as its parameter. The `callbackFunct` can specify the `value`, `index` and `array` as potential parameters. The callback format uses this pattern.

        Array.map(callbackFn)
- **Arrow Function**: An arrow function uses a simplified notation that is handy for short, concise functions. Although the syntax is pared down, this method is functionally equivalent to the inline approach.

        Array.map((element, index, array) => { /* function body */ })

In many cases the `array` argument is not required and is not included as a parameter. Without the third argument, the inline function technique is structured like this.

    Array.map(function(value, index) { /* function body */ })

It is also possible to pass a `this` object to the helper function, whether it is defined inline or is in callback form. In practice, the `this` object is not typically used. If it is used, `this` serves as the second parameter to the `map()` method.

    Array.map(function(value, index, array) { /* function body */ }, this)

{{< note >}}
Do not confuse the JavaScript `Array.map()` method with the JavaScript `Map` object, which stores an ordered sequence of key-value pairs.
{{< /note >}}

## How to Use the JavaScript map() Function

The `map()` function is a good approach whenever an algorithm must derive a second array from the initial set of values. Some examples of typical use cases include transforming data, manipulating strings, and auto-generating HTML code. These examples illustrate some common use cases.

### Using Array.map() for Numerical Transformation

This example uses the JavaScript map function for numerical processing. It accepts an array containing the brightness of a series of background elements. It then generates a new array of values that are 20% brighter. The old set of values are retained, and can be potentially reapplied in the future.

`map()` stores the new values in the `brightened` array. The `lightLevels` array, which contains the original values, does not change. In this example, `lightLevels.map` is invoked using an inline function. The inline function only uses the value of each item, so it only has one parameter. The index and array are unused. The first approach demonstrates how to use the `map()` method with an inline function. To test this JavaScript code, type it into the browser debugger.

{{< note >}}
To run a small amount of JavaScript code without embedding it in a web page, use the browser developer tools. For instance, in Firefox choose **Tools** -> **Browser Tools** -> **Web Developer Tools**. Then select the **Debugger** tab. Enter the JavaScript commands at the `>>` prompt.

A number of third party web applications also allow users to write and test JavaScript code using a JavaScript emulator.
{{< /note >}}

    const lightLevels = [2, 5, 7, 11];
    let brightened = lightLevels.map(function(nextValue){
        return nextValue * 1.2;
    });
    console.log(lightLevels);
    console.log(brightened);

{{< output >}}
[2, 5, 7, 11]
[2.4, 6, 8.4, 13.2]
{{< /output >}}

Because the function is so simple, it is easy to rewrite it using an arrow function. Here is an example of how to convert the original inline function to an arrow function.

    const lightLevels = [2,5,7,11];
    let brightened = lightLevels.map((nextValue) => nextValue * 1.2);
    console.log(lightLevels);
    console.log(brightened);

The results should be the same as before.

{{< output >}}
[2, 5, 7, 11]
[2.4, 6, 8.4, 13.2]
{{< /output >}}

If the brighten transformation is used in several places, define it as a callback function. This improves the clarity of the code and promotes maintainability and quality control. `lightLevels.map` now calls the `brightenElement` function rather than running the inline code. The following code sample generates the same results as the other two examples.

    const brightenElement = nextValue => nextValue * 1.2;

    const lightLevels = [2,5,7,11];
    let brightened = lightLevels.map(brightenElement);
    console.log(lightLevels);
    console.log(brightened);

### Using Array.map() for String Processing

Another common use for the `map()` method is to process a series of strings. The strings can be concatenated or be reformatted. This example processes an array representing a queue of customers. For each person, the `map()` function generates a new string combining their last and first names along with their position in the queue. The inline function uses the template literal approach to build the string. Each new string is added to the `queueEntries` array.

{{< note >}}
A template literal constructs a string inside the backtick symbols. It allows variables to be inserted in place using the `$` notation.
{{< /note >}}

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

{{< output >}}
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
{{< /output >}}

### Using Array.map() for HTML Generation

JavaScript is widely used on web pages, where it is often responsible for building HTML markup. In this example, `map()` is used to wrap data in HTML.

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

## A Comparison Between Array.map() and for/forEach()

A crucial distinction between `map()` and the `forEach()` function is that the `map()` method does not alter the original array. The `forEach()` function often modifies the original array. It does not create a new data structure. The behavior of a JavaScript `for` loop is defined inside the body of the loop. However, it does not automatically generate a new array either. Any new data structures must be deliberately created or modified inside the body of the loop. Neither the `for` loop nor the `forEach()` method return a value, whereas the `map()` method returns a new array.

Use `Array.map()` to retain the original array and create a new array derived from the values of the first array. Use `forEach()` or a `for` loop to permanently modify the original array, or to discard the newly-calculated values after use. These are also better choices for operations where the original array is not modified, including logging or printing.

## Usage Notes for Array.map()

There are a few additional considerations to keep in mind when using the `Array.map()` method.

- Concurrent modification of the original array is strongly discouraged. In other words, do not add or delete any array elements inside the helper function. Although the `map` function has rules regarding these situations, the resulting code is typically confusing and hard to debug.
- Do not use functions that can take additional optional parameters directly as callback functions. The `index` element could be accidentally passed to the function as a second parameter, leading to errors or confusing results.
- Only use the `map()` method when both arrays must be retained. Do not use `map()` if the program has no further use for the new array or if the original data can be discarded.
- The helper function must return a new value with each iteration of the loop. If the function does not return anything, do not use it with `map()`.

See the [Mozilla developer notes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) for further information.

## Conclusion

The JavaScript `Array.map()` method is a handy tool for array processing. It applies a transformation to the data to create a new array, leaving the original array untouched. The `map()` method accepts an inline, arrow, or callback function as a parameter. It calls this function once for each item in the array, passing in data about the array and receiving a return value in reply.

Programmers can use the JavaScript `map()` procedure for numerical processing, string manipulation, HTML generation, and other purposes. `map()` can be contrasted with the `foreach()` function and `for` loop. Both of these choices do not necessarily create a new array, and both can alter the original data. For more information about the `map()` method, consult the [documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map).