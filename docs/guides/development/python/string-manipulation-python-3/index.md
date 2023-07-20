---
slug: string-manipulation-python-3
description: 'Strings are one of the most commonly used data types in Python. This guide will show how to create, manipulate, and format strings using Python 3.'
keywords: ["python", "string", "f string", "format string", "python 3"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-04-13
modified: 2018-04-13
modified_by:
  name: Linode
title: 'String Manipulation in Python 3'
external_resources:
- '[Official f-strings Documentation](https://docs.python.org/3.6/reference/lexical_analysis.html#f-strings)'
audiences: ["beginner"]
concentrations: ["Scripting, Automation, and Build Tools"]
languages: ["python"]
tags: ["python"]
aliases: ['/development/python/string-manipulation-python-3/']
authors: ["Jared Kobos"]
---

## Strings in Python

Strings are one of the most basic data types in Python, used to represent textual data. Almost every application involves working with strings, and Python's `str` class provides a number of methods to make string manipulation easy.

## Basic String Operations

### Define a String

Strings are denoted with either single or double quotes:

    string_1  = "Example string #1"
    string_2 = 'Example string #2'

Both methods are equivalent. If a string is delimited with double quotes, any double quotation marks within the string will need to be escaped with a backslash (`\`):

    "My teacher said \"Don't forget your homework.\""

Similarly, in single-quoted strings you will need to escape any apostrophes or single-quoted expressions:

    'This is Linode\'s documentation site.'

### Subset Strings

Python does not have a Character data type. To access individual characters within a string, use bracket notation. Like lists, Python strings are zero-indexed, so the first character of a string can be accessed with `[0]`:

    string_3 = "This is a string."
    first_letter = string_3[0]

To access a range of letters from a larger string, use slicing:

    string_3[0:4]

This will return all characters starting from the number before the colon (0, or the first character) up to but not including the index after the colon (4). In this case, the first four letters of the string are returned:

  {{< output >}}
'This'
{{< /output >}}

### String Operators

The `+` and `*` operators are overridden for the string class, making it possible to add and multiply strings. Strings in Python are immutable. They cannot be modified after being created.

Using the `add` operator to combine strings is called concatenation. The strings for first and last name remain unchanged. Concatenating the two strings returns a new string.

    first_name = "Abraham"
    last_name = " Lincoln"
    first_name + last_name

  {{< output >}}
Abraham Lincoln
{{< /output >}}

Multiplication can be used to generate multiple copies of strings:

    "a" * 10

  {{< output >}}
'aaaaaaaaaa'
{{< /output >}}

## String Methods

Many basic string manipulation tasks can be handled with built-in methods. For example, to convert a string to uppercase letters, use `upper`:

    'example string'.upper()

  {{< output >}}
EXAMPLE STRING
{{< /output >}}

To remove extra whitespace from the beginning or end of a string, use `strip`:

    'example '.strip()

  {{< output >}}
'example'
{{< /output >}}

Strings can be split into a list of substrings with `split`. By default, Python will use a blank space as a delimiter, which is useful for splitting a sentence into individual words:

    'This string has five words'.split()

  {{< output >}}
['This', 'string', 'has', 'five', 'words']
{{< /output >}}

Specify a different delimiter by passing the character(s) as an argument to `split`:

    'one,two,three,four,five'.split(',')

{{< output >}}
['one', 'two', 'three', 'four', 'five']
{{< /output >}}

The inverse operation of `split` is `join`, which will combine a list of strings into a single string. The `join` method must be called on a string that will be used to separate the list entries in the final string:

    ' '.join(['This', 'string', 'has', 'five', 'words'])

{{< output >}}
'This string has five words'
{{< /output >}}

    ','.join(['one', 'two', 'three', 'four', 'five'])

{{< output >}}
'one,two,three,four,five'
{{< /output >}}

For a full list of available string methods, see the [official documentation](https://docs.python.org/3/library/stdtypes.html#string-methods). Since there is no built-in string method to reverse a string, see our guide [Reversing a String in Python](/docs/guides/how-to-reverse-a-string-in-python/) to learn several ways to do so.

## String Formatting

Often strings need to be built on the fly, based on the state of the application. For example, you may want to customize an error message with information about the values that caused the error. There are several ways to accomplish this in Python; this section will review two of the most commonly used methods in Python 3.

### str.format()

Prior to Python 3.6, the `str.format()` method was arguably the easiest and most convenient way to format strings. Each string object has access to the `format` method, which allows substituting values into the string at designated locations:

    name, age = "Alice", 26
    string_template = 'My name is {0} and I am {1} years old.'
    string_template.format(name, age)

The `format` method is called on the `string_template` object. `format` takes as arguments a comma-separated list of variables to insert into the string calling the method. The variables will be substituted into the bracketed portions of the string. The first argument (`name` is argument zero, since Python lists are zero-indexed) is substituted into the string in place of `{0}`, and `age` is substituted for `{1}`. Any number of substitutions can be made in this way.

If numbers between the brackets are omitted, Python will substitute the variables in the order in which they are passed to `format`:

    snack, hobby = "avocado", "tail recursion"
    string_template = 'My name is {} and I am {} years old. I enjoy {} and {}.'
    string_template.format(name, age, snack, hobby)

This is equivalent to:

    'My name is {0} and I am {1} years old. I enjoy {2} and {3}.'

This syntax is often shortened by combining the string declaration and `str.format` method call into a single statement:

    'My name is {} and I am {} years old. I enjoy {} and {}.'.format(name, age, snack, hobby)

  {{< output >}}
'My name is Alice and I am 26 years old. I enjoy avocado and tail recursion.'
{{< /output >}}

Finally, recall that a variable is just one type of expression in Python, and other expressions can usually be used in place of a variable. This is true when formatting strings, where arbitrary expressions can be passed to `str.format`:

    fahrenheit = 54
    'The temperature is {} degrees F ({} degrees C).'.format(fahrenheit, int((fahrenheit - 32) * (5/9.0)))

### f-strings

Python 3.6 introduced a simpler way to format strings: formatted string literals, usually referred to as **f-strings**.

    ram, region = 4, 'us-east'
    f'This Linode has {ram}GB of RAM, and is located in the {region} region.'

  {{< output >}}
'This Linode has 4GB of RAM, and is located in the us-east region.'
{{< /output >}}

The `f` at the beginning of the above string designates it as an f-string. The syntax is similar to the `str.format()` method. Variable names can be placed directly inside the string itself enclosed in brackets rather than in a function call following the string. This makes f-strings more compact and readable.

Any Python expression can be placed inside the brackets in an f-string, giving them even more flexibility:

    orders = [14.99,19.99,10]
    f'You have {len(orders)} items in your cart, for a total cost of ${sum(orders)}.'

  {{< output >}}
'You have 3 items in your cart, for a total cost of $44.98.'
{{< /output >}}
