---
slug: how-to-convert-datatypes-in-python
author:
  name: Jeff Novotny
description: 'Learn how to convert various data types to other data types in Python using built in functions. For example, learn to convert a string to an int in Python.'
keywords: ['convert data type python','How to convert data types in python','convert string to int python']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-06-03
modified_by:
  name: Linode
title: "Converting Data Types in Python"
h1_title: "How to Convert Data Types in Python"
enable_h1: true
contributor:
  name: Jeff Novotny
external_resources:
- '[Python String documentation](https://docs.python.org/3/library/string.html)'
- '[Standard Python types](https://docs.python.org/3/library/stdtypes.html)'
- '[Advanced Python types](https://docs.python.org/3/library/datatypes.html)'
---

Python is a dynamically typed language, so programmers might not always consider the type of each variable they create. However, the type of a variable is often important, and it might be necessary to convert it to another data type. This guide explains how typecasting works and illustrates how to convert data types in Python. It covers several common examples, such as how to convert an integer to a string.

## Convert Data Types in Python: An Introduction

Python, like most programming languages, supports a wide range of *data types*. Python is considered a *strongly typed* language, so each variable always has a type. The type of a variable governs the data it can represent and constrains how it can be used. Some common Python data types include integer, float, string, list, dictionary, and set. In Python, an object's type defines its methods and the set of operations it supports. For instance, it is possible to calculate the exponent of an integer, but not of a string. For more information about Python data types, see the [*documentation for standard types*](https://docs.python.org/3/library/stdtypes.html) and [*advanced types*](https://docs.python.org/3/library/datatypes.html).

In addition to being strongly typed, Python is also *dynamically typed*. This means the type of a variable is determined only at run time. The Python interpreter does not perform any type checking in advance. In addition, the type of a Python variable can change over the course of a program. Statically typed languages such as C++ do not permit this.

It is possible to change the data type of a variable in Python through *datatype conversion*. Datatype conversion allows variables to be used more effectively within the program. For example, an integer can be converted into a string, allowing it to be appended to another string. There are two different methods used to convert data types in Python.

**Implicit type conversion**: Python automatically performs implicit type conversion without user intervention. It can elevate a lower-order data type, such as an integer, to a higher-order type like a float. Python can initiate this conversion because any integer can be unambiguously represented as a float. There is no chance of misinterpreting the intent of this operation. Implicit conversion avoids the loss of any data and is highly convenient. However, it does not work in all cases.

**Explicit type conversion**: This is also known as *typecasting*. An explicit conversion must be performed manually using one of Python's built-in methods. This is necessary when the conversion is not straightforward and the intent of the operation is not clear. Some explicit type conversions can cause data loss.

The Python `type` function is used to determine the type of the data. In this example, `x` is of type `int`, while `y` is of type `float`.

    x = 10
    y = 10.01
    print(type(x))
{{< output >}}
<class 'int'>
{{< /output >}}

    print(type(y))
{{< output >}}
<class 'float'>
{{< /output >}}

## Before You Begin

Ensure Python is already installed on your machine and you understand how to launch and use the Python programming environment. To run Python on Ubuntu, use the command `python3`. For more information regarding how to use Python, see the [Linode guide to Python](/docs/guides/how-to-install-python-on-ubuntu-20-04/).

## Converting Integers and Floats in Python

Both floats and integers represent numerical values. A float number has a decimal point, while an integer does not. A float can more precisely represent a number, but integers make more sense when dealing with countable values. An integer can always be represented as a float, but most floats cannot be represented as integers without a loss of precision.

This process of converting between integers and floats is relatively straightforward, because both types represent numerical data. Additional methods exist to convert integers to other formats, such as hexadecimal strings. The following examples illustrate the main methods used to convert numerical data types in Python.

### Converting Integers to Floats

The built-in Python function `float()` converts an integer to a float. It accepts a single integer and returns its float equivalent in the proper format, complete with a decimal point.

    x = 10
    z = float(x)
    print("z is", z, "and is of type", type(z))
{{< output >}}
z is 10.0 and is of type <class 'float'>
{{< /output >}}

Python can automatically elevate an integer to a float using implicit type conversion. Therefore, if the result of `float(x)` is reassigned to `x`, `x` changes type and becomes a float.

    x = 10
    x = float(x)
    print("x is", x, "and is of type", type(x))
{{< output >}}
x is 10.0 and is of type <class 'float'>
{{< /output >}}

When an integer and a float are added or multiplied together, the result is a float.

    x = 10
    y = 5.2
    z = x + y
    print("z is", z, "and is of type", type(z))
{{< output >}}
z is 15.2 and is of type <class 'float'>
{{< /output >}}

This occurs even if the answer can be perfectly represented as an integer. In this example, the result is `52`, but it is represented as a float containing the value `52.0`.

    z = x * y
    print("z is", z, "and is of type", type(z))
{{< output >}}
z is 52.0 and is of type <class 'float'>
{{< /output >}}

As of Python 3, when two integers are divided, the result is a float. The numerator and denominator are both internally pre-converted to floats before the operation. This means the result is a float even if the modulus is zero.

{{< note >}}
Python 2 returns an integer in this case.
{{< /note >}}

    x = 6
    y = 3
    z = x / y
    print("z is", z, "and is of type", type(z))
{{< output >}}
z is 2.0 and is of type <class 'float'>
{{< /output >}}

{{< note >}}
The closely-related `hex()` and `oct()` methods can convert an integer to its hexadecimal or octal string equivalent.
{{< /note >}}

### Converting Floats to Integers

To convert a float data type to an integer in Python, use the `int()` function. This function removes the fractional component of the float, also known as the [mantissa](https://en.wikipedia.org/wiki/Significand), during the conversion.

    x = 50.8
    x = int(x)
    print("x is", x, "and is of type", type(x))
{{< output >}}
x is 50 and is of type <class 'int'>
{{< /output >}}

This conversion leads to some data loss. The truncated portion is not recovered even if the variable is converted back to a float.

    x = float(x)
    print("x is", x, "and is of type", type(x))
{{< output >}}
x is 50.0 and is of type <class 'float'>
{{< /output >}}

To convert a float to the **nearest** integer, use the `round()` function instead.

    x = 50.8
    x = round(x)
    print("x is", x, "and is of type", type(x))
{{< output >}}
x is 51 and is of type <class 'int'>
{{< /output >}}

{{< note >}}
Some information is permanently lost whenever a float is converted to an integer. This can have drastic effects on the accuracy of future calculations. Ensure you understand the implications of this data loss within the context of your program before proceeding. When in doubt, create a new variable to store the converted value.
{{< /note >}}

## Converting Strings in Python

A Python string consists of an immutable sequence of Unicode characters, and is represented internally as an array. The individual characters in a string can be accessed using *string indexing*, which is similar to [how list items are accessed](/docs/guides/python-lists-and-how-to-use-them/). Python string indexing is zero-based, so the index `[1]` refers to the second character in the string. Python provides a number of built-in methods for use in string processing and manipulation.

Integers can be converted to strings and vice versa. Strings can also be converted to complex data types including lists, sets, and tuples. For more information on strings, see the [*Python documentation*](https://docs.python.org/3/library/string.html).

### Converting Int to String in Python

Adding an integer and a string is more complicated than adding two numbers. The integer could potentially be treated as a string, but the string could also be converted to an integer. For instance, should the operation `14 + "12"` result in the string `1412` or the numerical value `26`? To resolve any confusion, a Python string and integer cannot be added together or concatenated. Both entities must have the same type. Either the integer must be changed to a string, or the string must be converted to an integer. In the following example, adding a string to an integer results in an error.

    x = 12
    y = "23"
    z = x + y
{{< output >}}
Traceback (most recent call last):
File "<stdin>", line 1, in <module>
TypeError: unsupported operand type(s) for +: 'int' and 'str'
{{< /output >}}

To convert an `int` to a string in Python, use the built-in function `str()`. When an integer is passed to the `str()` function, it is converted to a text representation of the number. The following example uses the `str()` function to perform type conversion on the integer variable `x`, allowing it to be concatenated to another string. The end result of the operation is another string.

    x = 12
    y = "23"
    z = str(x) + y
    print("z is", z, "and is of type", type(z))
{{< output >}}
z is 1223 and is of type <class 'str'>
{{< /output >}}

This approach is frequently used to print text consisting of both strings and numbers. The numerical component is converted to a string when it is passed to the `print()` function.

    print(str(x) + y)
{{< output >}}
1223
{{< /output >}}

The `str()` function can also be used to convert other data types, such as a float, to strings. This function accepts a floating point number and converts it to a string, with the decimal point and fractional component still intact.

### Convert String to Int in Python

Mathematical operations cannot be performed on string objects. They must be converted to numbers first. Fortunately, Python's built-in `int()` function is very flexible and can convert several data types to integers. This function accepts any string that can be converted to an integer, and returns an integer representation. If the string cannot represent an integer, Python throws an error. The following example demonstrates how to convert a string to an `int` in Python.

    x = "101"
    z = int(x)
    print("z is", z, "and is of type", type(z))
{{< output >}}
z is 101 and is of type <class 'int'>
{{< /output >}}

This function can be used to add a string representation of an integer to an actual integer. This code sample converts the string to an integer, allowing the two numbers to be added together. This contrasts with the earlier example, which used `str()` to perform a string concatenation.

    x = 12
    y = "23"
    z = x + int(y)
    print("z is", z, "and is of type", type(z))
{{< output >}}
z is 35 and is of type <class 'int'>
{{< /output >}}

When passing a string to `int()`, it is possible to add an optional argument indicating the base of the number. For instance, `int("101", 2)` indicates the binary string `101` is equivalent to `5` in decimal notation. It is not the integer `101`. If a base is not provided, Python assumes it is a base-10 decimal number.

    x = "101"
    z = int(x,2)
    print("z is", z, "and is of type", type(z))
{{< output >}}
z is 5 and is of type <class 'int'>
{{< /output >}}

Strings can also be converted to floats using the `float()` function. Python cannot automatically convert a float-like string to an integer. This function must be used if the string has a decimal point, and the string must represent a float.

    x = "10.00"
    z = float(x)
    print("z is", z, "and is of type", type(z))
{{< output >}}
z is 10.0 and is of type <class 'float'>
{{< /output >}}

{{< note >}}
Do not confuse the `int()` function with `ord()`. `ord()` converts a character to its ASCII integer representation. This function uses the [*character to ASCII conversion table*](https://www.ibm.com/docs/en/sdse/6.4.0?topic=configuration-ascii-characters-from-33-126) to determine the ASCII values.
{{< /note >}}

### Converting Strings to Lists

In Python, a *list* is an ordered array of objects. The items are mutable, so they can be changed. Items can be added, removed, or modified. Lists also have a large collection of built-in methods, providing advanced processing features. A list is enclosed in square brackets `[ ]` with commas separating the items. An example of a list is `['aa', 'bb', 'cc']`.

Lists and strings are conceptually very similar. Both are ordered sequences, and the individual items are accessed the same way. This makes it easy to convert a string to a list. The first letter in the string becomes item `[0]` in the list. The second letter becomes the second list item, and so on.

{{< note >}}
The elements of a list can be strings or numbers, or even compound objects. However, strings can only contain a sequence of Unicode characters. [Lists can also be converted to strings in Python](/docs/guides/python-lists-and-how-to-use-them/#convert-a-python-list-to-a-string), but the steps are more complicated.
{{< /note >}}

To convert a Python string to a list, use the `list()` function and provide the string as input. This results in a list containing the characters in the original string, formatted in list notation.

    x = "test"
    z = list(x)
    print("z is", z, "and is of type", type(z))
{{< output >}}
z is ['t', 'e', 's', 't'] and is of type <class 'list'>
{{< /output >}}

### Converting Strings to Tuples

Strings are also easily converted to tuples. A Python *tuple* is almost the same as a list, except it is immutable. This means it cannot be changed after it is created. A tuple is always enclosed by parentheses `( )`. It is sometimes a more efficient data structure for string processing because it includes more built-in functions.

To convert a string to a tuple, use the `tuple()` function. The characters in the string become the ordered elements of the tuple.

    x = "test"
    z = tuple(x)
    print("z is", z, "and is of type", type(z))
{{< output >}}
z is ('t', 'e', 's', 't') and is of type <class 'tuple'>
{{< /output >}}

{{< note >}}
Although it is relatively uncommon, a string can also be converted to a *set*. A set is an unordered collection of unique elements. Use the function `set()` and provide the string as a parameter.
{{< /note >}}

To learn more about Python tuples, see our guide [An Introduction to Python Tuples](/docs/guides/python-tuples/#convert-a-python-tuple-to-a-list).

## Conclusion

Although Python is a dynamically-typed language, type conversion is still very important. Python frequently uses implicit type conversion to elevate an integer to a float, making certain operations easier. However, developers often have to use explicit type conversion, changing a type using Python's built-in functions.

This guide explains how to convert data types in Python. It is possible to convert a string to an integer in Python using the `int()` function, while the `str()` function converts an integer to a string. Integers can be converted to floats using `float()`, and floats can be changed to integers, although this can cause data loss. Other functions allow strings to be converted to array formats such as lists, tuples, and sets.