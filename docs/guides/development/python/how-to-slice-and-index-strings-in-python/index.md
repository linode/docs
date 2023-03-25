---
slug: how-to-slice-and-index-strings-in-python
description: 'In Python, strings can be manipulated using built-in string methods. In this guide, learn how to slice and index strings in Python 3 to isolate specific characters.'
keywords: ['Python slice string','Python string index','How to slice a string in python','Python slice string from end']
tags: ['python']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-01-28
modified_by:
  name: Linode
title: "Slicing and Indexing Strings in Python"
title_meta: "How to Slice and Index Strings in Python"
external_resources:
- '[Python string documentation](https://docs.python.org/3/library/stdtypes.html#text-sequence-type-str)'
authors: ["Jeff Novotny"]
---

[Python](https://www.python.org/) has become one of the world's most popular programming languages due to its intuitive and straightforward nature. Among its attractive features is a powerful library for parsing and processing string objects. Python provides tools for indexing strings and creating substrings from larger strings, which is known as *slicing*. This tutorial discusses how to use Python string indexing and how to slice a string in Python.

## An Introduction to String Slicing in Python

All Python data structures, including strings, are objects. As an object, a string has a collection of built-in attributes and functions, also known as methods. A string is an array that consists of an ordered sequence of one or more characters. Because Python does not have a character or "char" data type, a single character is considered a string with a length of one. The characters in a string can be letters, numbers, spaces, or non-alphanumeric symbols.

It is possible to access any character in a Python string using array-based indexing. Strings can also be manipulated and transformed using the built-in string methods and operations. String slicing is a powerful operation for creating a substring from the original string. In addition to extracting a string consisting of consecutive characters, a string slice can select every nth letter or even work in reverse. Strings can be sliced in Python using either the `slice` object or string indexing.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access. **Do not** follow the *Configure a Firewall* section yet. This guide includes firewall rules specifically for an OpenVPN server.

1. Ensure Python is properly installed on the Linode and you can launch and use the Python programming environment. For information on how to use Python, see our guide on [How to Install Python 3](/docs/guides/how-to-install-python-on-ubuntu-20-04/).

{{< note >}}
The steps in this guide are written for non-root users. Commands that require elevated privileges are prefixed with `sudo`. If you are not familiar with the `sudo` command, see the [Linux Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## How Indexing Strings Works in Python 3

Python strings work like arrays. Individual characters within the string can be retrieved using a zero-based indexing system. This means the first character in an n-length string has position `0` and the final character has the index `n - 1`. To retrieve a character from a string based on its index, enclose the index of the character within square brackets, using the format `string[index]`. The index must always be an integer. This section describes how to retrieve characters from a string using either positive or negative indexing.

## Retrieve a Specific Character by Index

### Positive Indexing

The traditional method of string indexing is to count upwards from zero starting with the leftmost character in the string. The index increments by one with each character as the strings are read from left to right. This is referred to as *positive indexing*. The first character has an index of `0`, the character at position `x` has an index `x - 1`, and the last character in the string has an index of `string_length - 1`. If the index is greater than `string_length - 1`, Python returns the error `IndexError: string index out of range`. The following chart shows how the Python string index works using the six-character string `Linode` as an example.

| L | i | n | o | d | e |
|:-:|:-:|:-:|:-:|:-:|:-:|
| 0 | 1 | 2 | 3 | 4 | 5 |

- The first character of the string is `L`. It has an index of `0` and is accessed using `[0]`.
- The third character of the string is `n`. It has an index of `2` and is accessed using `[2]`.
- The final character of the string is `e`. It has an index of `5` and is accessed using `[5]`.

The following example illustrates how string indexing works using real Python code. Use string indexing to select the third character from `testString`. The character retrieved by the expression `testString[2]` is assigned to `indexChar` and printed out.

    testString = "Linode"
    indexChar = testString[2]
    print(indexChar)

{{< output >}}
n
{{< /output >}}

### Negative Indexing

The characters in a string can also be indexed counting back from the end of the string. This is known as *negative indexing*. The final character of the string has a negative index of `-1`. The second last character occupies position `-2`, and so on. If the index does not exist within the string, Python returns an error. The following chart describes how the string `Linode` is indexed using negative indexing.

| L | i | n | o | d | e |
|:-:|:-:|:-:|:-:|:-:|:-:|
| -6 | -5 | -4 | -3 | -2 | -1 |

Negative indexing uses the same notation as positive indexing. The second-last character is retrieved using `string[-2]`. The following example demonstrates how to use negative indexing.

    print(testString[-2])

{{< output >}}
d
{{< /output >}}

## How to Slice Strings in Python 3

Python string indexing can also be used to extract a substring from a larger string. This process is referred to as *slicing*.

### Create a Substring

To use Python to slice a string from a parent string, indicate the range of the slice using a start index and an end index. Separate the starting and ending indices with a colon and enclose the entire range in square brackets, using the format `string[start_index:end_index]`. The starting and ending indices use the same zero-based numbering system. Both arguments must be integers.

The starting position is inclusive. It marks the position where the substring begins and where the first character of the new string is located. The ending position is exclusive. It specifies the first character that is *not* part of the substring. The final character of the substring is located at the index immediately preceding the end index.

To slice a string with a range extending from position `2` to position `4`, use the notation `string[2:5]`. Because string notation is zero-based, the substring slice contains the third through the fifth character of the original string. Here are some examples:

To slice a substring from position `2` to position `4`, use the following syntax:

    testString = "Linode"
    print(testString[2:5])

{{< output >}}
nod
{{< /output >}}

A substring can include a space or a non-alphabetical character. In this example, the resulting substring contains a `!` and a space.

    testString2 = "Linode! System"
    print(testString2[4:10])

{{< output >}}
de! Sy
{{< /output >}}

To slice all characters from the start of the string to a specific point in the middle, omit the starting index. Supply the end index as usual. The range extends from the first character to the character right before the end index. The syntax for this notation is `string[:end_position]`. To slice the first five characters from a string, use `string[:5]`. This results in a substring that extends from index `0` to index `4`.

    testString2 = "Linode! System"
    print(testString2[:5])

{{< output >}}
Linod
{{< /output >}}

Python uses the same technique to slice a string from the end. Use the starting index to indicate the first character to include, and omit the end index. The syntax for this operation is `string[start_position:]`.

    testString2 = "Linode! System"
    print(testString2[5:])

{{< output >}}
e! System
{{< /output >}}

Slicing can also work with negative indexing. This is handy for extracting the second and third last characters from a string without performing a number of logical operations. Slicing with negative indices works exactly as it does with positive indexing. The starting position is inclusive and marks the start of the substring. The ending position is exclusive and marks the first character excluded from the new substring.

    testString2 = "Linode! System"
    print(testString2[-3:-1])

{{< output >}}
te
{{< /output >}}

### Implement Stride When Slicing a String

All of the examples so far have extracted a substring in sequential order, from left to right. However, it is also possible to reverse a string or create a substring from non-consecutive characters. This can be accomplished through the use of a *stride*. A stride of `n` returns every nth character. It specifies how Python should walk through the string while generating the substring. A stride of `2` tells Python to select every second character. A stride of `-2`, however, indicates that every second letter should be selected from right to left.

The stride is specified as an optional third argument to the slice operation using the format `string[starting_position:ending_postion:stride]`. The default stride is `1`, which results in the behavior seen in the previous slice operations.

The most common reason to use a negative stride in Python is to implement a reverse string slice. Specify a stride of `-1` and leave the starting and ending positions blank. The format for a straightforward string reversal is `string[::-1]`.

    testString2 = "Linode! System"
    print(testString2[::-1])

{{< output >}}
metsyS !edoniL
{{< /output >}}

A stride can be used together with start and end indices. The next example demonstrates how to build a substring out of every second character in the main string, starting at index `3`. Python appends the characters at positions `3`, `5`, and `7` to the substring and continues in this manner until it reaches the end of the string.

    testString2 = "Linode! System"
    print(testString2[3::2])

{{< output >}}
oe ytm
{{< /output >}}

For a deeper dive into reversing string in Python using slicing and other methods, see our guide [Reversing a String in Python](/docs/guides/how-to-reverse-a-string-in-python/)

## Use the Slice Object to Simplify Repetitive Tasks

Python allows programmers to define a `Slice` object using constants for the start index, end index, and stride. Programmers can apply this object in lieu of the usual slicing syntax. A slice object is particularly handy if the exact same slice operation is required in different circumstances. A predefined slice object helps avoid coding errors and assists with modularity and maintainability.

To create a substring using the Python slice function, first create a `slice` object using the `slice` constructor. Pass the start index, end index, and stride as arguments to the constructor. Enclose the slice object in square brackets `[]` and use it to generate a substring from the parent string as follows.

    testString2 = "Linode! System"
    sliceObj1 = slice(2,8,2)
    subString = testString2[sliceObj1]
    print(subString)

{{< output >}}
nd!
{{< /output >}}

## How to Combine Indexing with Other String Functions

String indexing and slicing are capable of even more powerful tasks when combined with other string functions. For instance, you can extract all characters occurring before or after a certain letter, or cut a string in half based on its length. Here are a few examples of how to combine indexing and slicing with other string functions.

The `len` function determines the length of a string. You can use it to slice a string to a specific fraction of its length. The following example generates a substring consisting of the second half of the parent string. The length of the initial string is calculated using `len` and divided by two to determine the midpoint. The midpoint becomes the start index for the slicing operation. This is a good example of how an index can be represented by a fairly complex expression.

{{< note >}}
The Python slice operator only accepts integer values. Consequently, the starting index must be converted to an integer before it can be used in a slicing operation. The `int` function rounds a real number down to the nearest integer, which is known as the *floor*. Because the starting point is inclusive, this substring is always guaranteed to be at least half the length of the original string. In recent versions of Python, you can use the `//` operator to perform integer division.
{{< /note >}}

    testString3 = "Linode! System is great"
    print(testString3[(int(len(testString3)/2)):])

{{< output >}}
tem is great
{{< /output >}}

The `string.find` method locates the first instance of a substring (of one or more characters) in the parent string. The index of the first instance of `char` in `string` can be found using `string.find(char)`. Used in conjunction with string slicing, `find` allows a substring to serve as a delimiter. The following example creates a slice out of all the letters preceding the `!` character. The end index is always exclusive, so the delimiter is excluded from the resulting substring.

{{< note >}}
`String.find` returns `-1` if the character is not found. This results in an empty string being sliced. You might also choose to implement special handling for this case. In any case, it is important to test corner cases in any production script.
{{< /note >}}

    testString3 = "Linode! System is great"
    print(testString3[:(testString3.find("!"))])

{{< output >}}
Linode
{{< /output >}}

Although Python's slicing operation is very powerful, it is important not to overuse it. There could be alternatives that are more suitable. For example, take the problem of determining how many instances of a particular character occur inside a string. This could potentially be written using string slicing, the `string.find` method, a loop, a counter, and a considerable amount of error handling. But there is a much easier and less error-prone way of doing this. The `string.count` method accepts a substring as a parameter and determines how many times it occurs inside `string`.

    testString3 = "Linode! System is great"
    count = testString3.count("e")
    print(count)

{{< output >}}
3
{{< /output >}}

For a full list of string methods, see the [Python organization's string documentation](https://docs.python.org/3/library/stdtypes.html#text-sequence-type-str).

## A Summary of Python String Indexing and Slicing

Python treats all strings, including single characters, as objects, with their own built-in collection of functions. A string object is an array of characters, which can be handled like other arrays. Python uses a string index to retrieve a specific character from a string using the syntax `string[n]`. All strings use zero-based indexing. Positive indexing increments the index from zero and from left to right. Negative indexing decrements the index from `-1` running from right to left.

Given starting and ending positions and optionally a stride, Python string slicing extracts a substring from a parent string using the format `string[start_position:end_postion:stride]`. The starting point is inclusive, while the endpoint is exclusive. Any of the three arguments can be eliminated, while a Python string can be reversed using a stride of `-1`. Python's slicing mechanism is frequently combined with other Python string functions. For more information, see the [Python Documentation](https://docs.python.org/3/contents.html).