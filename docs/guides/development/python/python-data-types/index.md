---
slug: python-data-types
description: "Python may not be a statically-typed programming language, but data types still play an important role. Knowing what Python data types are and how to use them can make your programs more effective and efficient overall. Learn the basics of Python data types and their operations in this guide."
keywords: ['python data types', 'python data types check', 'python data types cheat sheet']
tags: ['python']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2023-04-04
modified_by:
  name: Nathaniel Stickman
title: "The Basics of Python Data Types"
external_resources:
- '[Python Documentation: Built-in Types](https://docs.python.org/3/library/stdtypes.html)'
- '[Real Python: Basic Data Types in Python](https://realpython.com/python-data-types/)'
- '[Programiz: Python Data Types](https://www.programiz.com/python-programming/variables-datatypes)'
- '[GeeksforGeeks: Python Data Types](https://www.geeksforgeeks.org/python-data-types/)'
authors: ["Nathaniel Stickman"]
---

Knowing about Python's data types helps to make your Python programs more effective, and helps you to avoid errors. This guide covers the most useful Python data types, providing knowledge of their fundamentals and giving a cheat sheet that you can refer to.

## What Are the Python Data Types?

Python has numerous data types, more than this guide can effectively cover. You can refer to the Python documentation linked at the end of this guide for a comprehensive list of Python data types.

This guide, instead, focuses on listing the most commonly used, and most useful data types. Doing so lets the guide provide more on these data types' usage and operations, helping you grasp the underlying concepts behind Python data types. The guide also acts as a Python data types cheat sheet for these most common data types.

### Boolean

Perhaps the simplest data type, a *Boolean* consists of only one of two values: `True` or `False`. Booleans are, at the same time, one of the most useful data types.

Most often, Booleans are useful as the result of evaluations in Boolean contexts. A Boolean context is one in which an expression is evaluated to determine its truthfulness.

Following are some example illustrations with inline code comments:

```command
# Mathematical comparisons.

21 > 0
# True

21 < 20
# False

2 + 2 == 4
# True

54 * -3 > 0
# False

# String comparisons.

string_variable = "This is a string variable."

string_variable == "This is a string variable."
# True

string_variable != "This is not a string variable."
# False

"is" in string_variable
# True

"are" in string_variable
# False
```

This feature of Booleans shines most when used for conditionals, like `if` and `while`:

```file {title="python_loop.py" lang="python"}
counter_variable = 0

# This while loop uses the Boolean for `counter_variable <= 3` to keep
# the loop going until the counter exceeds 9.
while counter_variable <= 9:
    # This if condition uses a Boolean that is only true when the
    # counter_variable's value is divisible by 2 and greater than 0.
    if counter_variable % 2 == 0 and counter_variable > 0:
        print(counter_variable)

    # Adds to the counter with each loop, so that the loop eventually ends.
    counter_variable += 1
```

```output
2
4
6
8
```

You can see some of the comparison operators and Boolean operations in the examples above. For a more complete list of these, take a look at Python's [Built-in Types](https://docs.python.org/3/library/stdtypes.html) documentation.

### Numbers

Python has three data types for numerical values: integers, floating-point numbers, and complex numbers.

Integers include only whole-value numbers, but they can be of any length, limited only by your system's memory.

```command
integer_variable = 8
another_integer_variable = 2095621
```

Floating-point numbers, or floats, include decimal places. A float must have at least one decimal place but can have as many as 15.

```command
float_variable = 8.0
another_float_variable 209.562149
```

Complex numbers consist of a combination of a real and an imaginary value. They take the format `{real value}+{imaginary value}j`.

```command
complex_variable = 2+3j
another_complex_variable = 1+2j
```

Python's numbers can be used in mathematical operations using Python's built-in operators. You can see a list of these operators in the section of Python's [Built-in Types](https://docs.python.org/3/library/stdtypes.html#numeric-types-int-float-complex) documentation on numeric types.

### Strings

Python strings hold sequences of characters contained within either double or single quotation marks. Strings allow you to work with text in your Python code. Like with integers, strings can be of any length, limited only by your system's available memory.

```file {title="python_string_print.py" lang="python"}
print("This is a string.")

string_variable = "This is a string variable."

print(string_variable)
```

```output
This is a string.
This is a string variable.
```

Generally, characters within a string are taken literally — you type `abc?!`, and that is exactly what the string contains. However, there are two main exceptions:

- Quotation marks that you attempt to include within a string may be interpreted as ending the string. You can fix that by, instead, wrapping the string in the opposite kind of quotation mark.

```file {title="python_string_variable_quotes.py" lang="python"}
string_variable = "This is a double quotation: " ."
# The above results in a syntax error.

string_variable = 'This is a double quotation: " .'
# This one works because the string is wrapped in single quotes, allowing
# the string to contain double quotes.

string_variable = 'This is a single quotation: ' .'
# The above results in another syntax error.

string_variable = "This is a single quotation: ' ."
# And this remedies the issue by using double quotes to wrap the string.
```

- The escape character, `\` can be used to either include a special character, like a quotation mark, as a literal character, or to include a special character like a new line.

```file {title="python_escape_character.py" lang="python"}
string_variable = "This is a double quotation: \" . And this is a backslash: \\ ."
# The above works because it escapes the double quote and the backslash.

string_variable = "This is\na multi-line\nstring."
# The above uses the \n sequence to create a string with several line breaks.
```

You can find a full list of escape sequences for Python strings in Python's [lexical analysis documentation](https://docs.python.org/3/reference/lexical_analysis.html#string-and-bytes-literals).

#### Strings as Collections

In the section above, strings are called sequences of characters. Strings act as a type of collection in Python. The next section discusses collections and some of the operations these data types are capable of.

Many of these operations can be used on strings as well. Using them can give you powerful tools for manipulating and extracting data from strings in Python.

To see these capabilities and learn more about them, take a look at our guide on [How to Slice and Index Strings in Python](/docs/guides/how-to-slice-and-index-strings-in-python/).

### Collections

Python has numerous collection data types, each of which can hold sequences of data. Strings are one such data type, but the following three are the ones most often used for their abilities to collect objects.

- **Tuples** are ordered and immutable collections of data. Each consists of a series of objects, separated by commas (with or without spaces), and wrapped in parentheses. A tuple is immutable, meaning that, once a tuple is created, it cannot be modified. Tuples are also ordered, meaning that elements in a tuple collection can be accessed using indices and slice notation.

```file {title="python_tuples.py" lang="python"}
tuple_variable = ("Value 1", 98, "Value 3", 2.3, 98)

# Elements can be accessed using indices.
tuple_variable[0]
# 'Value 1'

tuple_variable[3]
# 2.3
```

- **Lists** are also ordered collections, but they are mutable. A list contains a series of objects wrapped in square brackets. You can change the contents of a list at any time. And, as with tuples, elements of a list can be accessed using indices, and slice notation.

```file {title="python_lists.py" lang="python"}
list_variable = [4.2, "Value 4", 89, "Value 2", "Value 2"]

# Elements can be accessed using indices.
list_variable[0]
# 4.2

# And using slice notation.

list_variable[-2:]
# ['Value 2', 'Value 2']
```

- **Sets** are unordered collections of unique data. A set is a list of unique values, all wrapped in curly braces. Sets are mutable, like lists. But, because sets are unordered, elements cannot be accessed by indices, or slices. Instead, sets provide arbitrary but fast and efficient accesses to elements.

```file {title="python_sets.py" lang="python"}
set_variable = {"Value 5", 5.7, 75, "Value 6", 67}

# Elements are accessed arbitrarily, most often using pop, which removes
# the element from the set.

set_variable.pop()
# 'Value 6'

print(set_variable)
```

```output
{67, 5.7, 'Value 5', 75}
```

Python's collections are powerful but more complicated than most other data types. As such, they have many operations, more than we can cover here.

Instead, take a look at our other guides to learn more about the basics of Python collections. See our [Python Lists and How to Use Them](/docs/guides/python-lists-and-how-to-use-them/) guide. You may also want to refer to the guide on slicing and indexing strings, [How to Slice and Index Strings in Python](/docs/guides/how-to-slice-and-index-strings-in-python/), for an in-depth look at slice notation.

### Dictionaries

Python dictionaries, or *dicts*, are unordered collections, like sets. But unlike a set, a Python dictionary contains a collection of key-value pairs. Such collections can be useful for associating and organizing data based on specific keys.

Like sets, dictionaries are wrapped in curly braces. They consist of a list of key-value pairs. The keys can be of any immutable type, like strings, integers, and floats (not lists, sets, and other dictionaries).

```command
dict_variable = {"key1": "Value 1", "key2": 945, 4: "Value 3"}
```

Unlike sets, you can fetch a particular item from a dictionary, based on the item's key. In this way, each item is identified by its key. So, extending on the example code above, you can print the dictionary keys as follows:

```command
print(dict_variable[4])
print(dict_variable["key1"])
```

```output
Value 3
Value 1
```

Python dictionaries can be especially useful for creating variables with properties. And, if you apply the keys for these properties consistently across variables, these variables' properties can be compared effectively.

```file {text="python_dictionaries.py" lang="python"}
person_one = {"name": "Melissa", "age": 32, "height_inches": 68}
person_two = {"name": "Edgar", "age": 29, "height_inches": 65}

if person_one["height_inches"] > person_two["height_inches"]:
    print(person_one["name"] + " is taller than " + person_two["name"] + ".")
elif person_two["height_inches"] > person_one["height_inches"]:
    print(person_two["name"] + " is taller than " + person_one["name"] + ".")
else:
    print(person_one["name"] + " and " + person_two["name"] + "are the same height.")
```

```output
Melissa is taller than Edgar.
```

You can learn more about Python dictionaries and how to make the most of them by reading our [Using Dictionaries in Python 3](/docs/guides/python-3-dictionaries/) guide.

## Python Data Type Operations

You can see throughout the previous sections that each data type has its own operations. For example, numbers have mathematical operations, strings can be concatenated, and lists have slice notation.

But Python also includes some specific operations for working with data types in general. These let you see and manipulate how Python deals with data types for different objects.

### Checking Data Type

Python provides two functions for checking the data types of given objects. The most straightforward of these is the `type` function. Given an object, the `type` function tells you what that object's data type is.

```command lang="python"
type(True)
# <class 'bool'>

type(4)
# <class 'int'>

string_variable = "Example"
type(string_variable)
# <class 'str'>

type({"key": "value"})
# <class 'dict'>
```

The `type` function describes a given object's data type. However, if you want to verify whether an object is or is not of a specific type, you may use the `isinstance` function instead. This function takes an object and a data type identifier as arguments. It then provides you a Boolean: `True` if the object's data type matches the identifier and `False` otherwise.

```command lang="python"
isinstance(4, int)
# True

isinstance("Example", list)
# False

isinstance([2, 4, 6, 8], list)
# True
```

### Casting Data Types

Python provides several functions allowing you to convert one data type to another, an action called *casting*. Most often, this is used to convert numbers to strings and to convert strings containing numbers to numeric data types.

These functions are useful when your program needs to use an operation for one data type — say the `+` operation for strings — for two different types.

```file {title="python_casting_data_types.py" lang="python"}
string_variable = "The total is $"
int_variable = 15

print(string_variable + str(int_variable) + ".")
```

```output
The total is $15.
```

Python has three functions for casting between numbers and strings.

- The `int` function casts a float or string value as an integer. For floats, the function always rounds down, so float `5.6` becomes the integer `5`. The function only works on strings that consist of an integer value. So, it works for the string `"5"`, but not the strings `"5.6"` or `"This is 5"`.

- The `float` function works similarly, casting an integer or string value as a float. Integers simply have a decimal place added, as in `5` becoming `5.0`. The function works only on strings consisting of either an integer or float value, as in `"5"` or `"5.6"`.

- The `str` function casts an integer or float value as a string. The integer `5` becomes the string `"5"`, and the float `5.6` becomes the string `"5.6"`. This is most useful when working with numeric variables that you want to use in string operations, like in the example code above.

## Conclusion

You now have what you need to start working effectively with the most common data types in Python. Following this guide can help you get more familiar with everything from basic types like Boolean and integers to strings, collections, and dictionaries.

Looking to deepen your understanding? Then be sure to look at our other [guides on Python](/docs/guides/development/python/). A few of these have been linked throughout this guide, but here is a list gathering those together:

 - [How to Slice and Index Strings in Python](/docs/guides/how-to-slice-and-index-strings-in-python/)

- [Python Lists and How to Use Them](/docs/guides/python-lists-and-how-to-use-them/)

- **Getting Started with Python Sets**

- [Using Dictionaries in Python 3](/docs/guides/python-3-dictionaries/)