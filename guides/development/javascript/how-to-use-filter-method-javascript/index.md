---
slug: how-to-use-filter-method-javascript
title: "How to Use the filter Method for Arrays in JavaScript"
description: "Want to know what JavaScript’s filter array method is and how to use it? This guide gives you everything you need to understand what filter does and how to apply it in your JavaScript development."
authors: ["Nathaniel Stickman"]
contributors: ["Nathaniel Stickman"]
published: 2022-03-13
keywords: ['javascript filter array', 'javascript filter function', 'javascript filter method']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[MDN Web Docs: Array.prototype.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)'
---

JavaScript's arrays include a `filter` method, designed to conveniently create new arrays out of existing ones. So how does it work, and how can you start using it on your arrays? This guide explains JavaScript's `filter` method and how to use it to filter arrays containing numbers, strings, and even objects.

## What Is the JavaScript filter Method?

In JavaScript, arrays each come with a `filter` method, which can be used to generate a new array from the original given a set of criteria. The method accomplishes this by taking a function as an argument and applying that function to each item in the original array. Each item for which the function returns `true` gets added to a new array, which the `filter` method returns at the end.

To break that down, here is an example. Follow along with the comments in the example to see how each part works:

```file {title="filter_method_example.js" lang="javascript"}
// Start with an array.
const exampleArray = [1, 2, 3, 4, 5, 6];

// Create a new array by using a filter on the original array.
let newExampleArray = exampleArray.filter(function(item) {
    // Filter takes an anonymous function as an argument, and that function
    // gets an argument passed into it, named `item` here. That argument
    // contains an element from the array.

    // Logic gets tested for each item in the array. In this case, whether
    // the item divides by 2 without a remainder.
    return item % 2 === 0;
});

// The above results in a new array, `newExampleArray`, with these contents:
// [2, 4, 6]
```

## How to Use the filter Method

Above, you can see an example of the filter method in action. The sections that follow elaborate on this, showing you examples of three different kinds of arrays.

These are not the only kinds of arrays that the `filter` method works on, however. Any kind of array works. The kinds of arrays selected and shown here are meant to illustrate the `filter` method's capabilities on some of the most common array contents. That way, you have the understanding you need to be able to apply the method for any kind of array you might encounter.

### Using the filter Method for Arrays of Numbers

The best place to start is the simplest of the arrays: arrays containing only numbers. The `filter` method lets you create a new number array from an existing array based on the criteria you provide. Part of what makes a number array easier to start with is that the criteria typically use frequently-used and widely-known operators.

For instance, you can create a new array of all numbers below 20 in an existing array by filtering for `< 20`. This is exactly what is done for the `smallNumberArray` in the example below. The example then does the opposite for the `largeNumberArray`, filtering for numbers equal to or greater than 20, using `>= 20`.

You can branch out from there to more advanced operations. The last `filter` in the example below uses the remainder operator — `%` — to get an array of numbers that are multiples of nine.

```file {title="filter_array_of_numbers.js" lang="javascript"}
const numberArray = [9, 45, 27, 18, 36, 19];

let smallerNumberArray = numberArray.filter((item) => {
    return item > 20;
});
// [45, 27, 36]

let largerNumberArray = numberArray.filter((item) => {
    return item <= 20;
});
// [9, 18, 19]

let multipleOfNineArray = numberArray.filter((item) => {
    return item % 9 === 0;
});
// [9, 45, 27, 18, 36]
```

### Using the filter Method for Arrays of Strings

The same approach can be used for arrays containing strings. The only more complicated thing with these arrays is that the filtering uses string operations, which might not be as familiar.

Strings can be compared using the equality (`==`) or string equality (`===`) operators.

But you can also get a string's length using its `length` property, which you can then filter on like you would a number. You can check whether a string includes a given sub-string using the `includes` method. Both of these options are applied in the examples below.

And there are many more options, like the ability to pick a specific character (using `exampleString[0]` to get the first character).

Unless you want your strings to be case-sensitive, you should convert them to lowercase before evaluating them for sub-strings and the like. This is done in the `arrStringArray` example below, allowing the string `Array` to match for including `arr`.

```file {title="filter_array_of_strings.js" lang="javascript"}
const stringArray = ["An", "Array", "Of", "Strings"];

let longerStringArray = stringArray.filter((item) => {
    return item.length > 2;
});
// ["array", "strings"]

let shorterStringArray = stringArray.filter((item) => {
    return item.length <= 2;
});
// ["an", "of"]

let arrStringArray = stringArray.filter((item) => {
    return item.toLowerCase().includes("arr");
});
// ["array"]
```

### Using the filter Method for Arrays of Objects

Objects, though potentially much more complicated, actually do not present much more of a challenge for filtering in an array. Generally, you just want to access one or more properties in common across the array's objects. From there, the filtering works just as it would with number and string arrays.

You can see this in the first two examples below. The first, `consoleObjectArray`, checks for items with a `type` property that matches the string `console`. The second, `longerNameObjectArray`, checks for items with names longer than five characters.

The last example does a number comparison, but also adds a little more logic. It first checks the `type` attribute to make sure the item is a `console`, returning `false` if it is not. Only then, for the `console` items, does it filter by number. This is a good way to take advantage of objects' properties to apply multiple filters at the same time.

As a side note, you can do something similar on number and string arrays. For instance, on a string array, you can check for length and sub-string using a similar approach.

```file {title="filter_array_of_objects.js" lang="javascript"}
const objectArray = [
    {type: "console", name: "Playstation", year: 2020},
    {type: "console", name: "Switch", year: 2017},
    {type: "console", name: "Xbox", year: 2019},
    {type: "company", name: "Microsoft"},
    {type: "company", name: "Nintendo"},
    {type: "company", name: "Sony"}
];

let consoleObjectArray = objectArray.filter((item) => {
    return item.type.toLowerCase() === "console";
});
// [{type: "console", name: "Playstation"}, {type: "console", name: "Switch"}, {type: "console", name: "Xbox"}]

let longerNameObjectArray = objectArray.filter((item) => {
    return item.name.length > 5;
});
// [{type: "console", name: "Playstation"}, {type: "company", name: "Microsoft"}, {type: "company", name: "Nintendo"}]

let newerConsolesArray = objectArray.fitler((item) => {
    if (item.type === "console") {
        return item.year > 2017;
    } else {
        return false;
    }
});
// [{type: "console", name: "Playstation", year: 2020}, {type: "console", name: "Xbox", year: 2019}]
```

## Conclusion

With that, you have the basics you need for starting to use the array `filter` method in your JavaScript code. The above does not cover everything you can do with this versatile method. But it does show the possibilities and gives you a template you can use to explore and adapt.

Have more questions or want some help getting started? Feel free to reach out to our [Support](https://www.linode.com/support/) team.
