---
slug: creating-and-using-python-tuples
author:
  name: Chelsea Troy
description: 'Learn to create a Python tuple by following this guide. This guide also discusses the differences between lists and tuples, and shows you how to convert a list into a tuple.'
keywords: ['python create tuple','python tuple vs list','python list to tuple']
tags: ['python']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-12-06
modified_by:
  name: Linode
title: "Creating and Using Python Tuples"
h1_title: "An Introduction to Python Tuples"
enable_h1: true
contributor:
  name: Chelsea Troy
  link: https://twitter.com/HeyChelseaTroy
---

A tuple is a built-in Python data structure that stores multiple comma-separated values. Tuples are an immutable *sequence* type. Tuples can contain values of any data type, and they can also mix different types in the same tuple. You can create Python tuples in several different ways. This guide describes the characteristics of tuples and shows you the various ways you can create a Python tuple.

{{< note >}}
You should have [Python 3.0 installed on your machine](/docs/guides/how-to-install-python-on-ubuntu-20-04/) to follow along with the examples in this guide.
{{</ note >}}

## Python Tuple Syntax

### Create a Python Tuple

To create a Python tuple, add a comma-separated collection of values inside of parentheses and assign it to a variable as shown in the example below:

    integers = (1, 3, 4)

The above example stores a collection of integers.

You can create a tuple with a mixed collection of data types as show below:

    >>> mixed = ("who", 2, "where")

The `mixed` tuple contains number and string values.

{{< note >}}
The parentheses are not required when creating a tuple. You can also create a tuple without enclosing parentheses.

    >>> lucky_numbers = 7, 14, 31, 50, 75, 100
{{</ note >}}

### Create a Tuple with a Single Value

To store a single value, or *singleton* in a tuple, you must include a comma when assigning the value to a variable. If you don't include the comma, Python does not store the value as a tuple.

    >>> name = ("chelsea",)

## Converting to a Tuple

The `tuple()` function can convert any of the other collection types (list, set, and dictionary) in Python into a tuple.

### Convert a List to a Tuple

The following example uses the `tuple()` function to convert a list of integers into a tuple of integers.

    list_to_tuple_example = tuple([1, 2, 3])

If you check the type of `list_to_tuple_example`, Python returns a type of `tuple`.

    >>> type(list_to_tuple_example)
    <class 'tuple'>

## Convert a Dictionary to a Tuple

Use the `tuple()` function to convert a dictionary to a tuple.

    >>> tuple({"a": 1, "b": 2, "c": 3})
    ('a', 'b', 'c')

{{< note >}}
Converting a dictionary to a tuple **only includes the keys** from the dictionary.
{{</ note >}}

## Tuple Unpacking

Typically, when you create a tuple, you assign it to a single value. When you call that variable, Python returns a single tuple containing those return values. However, you can assign the tuple values to their own individual variables. This is called *tuple unpacking*.

    >>> colors = ("red", "violet", "yellow-green")
    >>> (primary, secondary, tertiary ) = colors
    >>> print(primary)
    red
    >>> print(secondary)
    violet
    >>> print(tertiary)
    yellow-green

## Convert a Python Tuple to a List

Converting a tuple to a List works the reverse way that converting a List to a tuple does.

    >>> atuple = (1, 2, 3)
    >>> alist = list(atuple)
    >>> type(alist)
    <class 'list'>

## Built-in Tuple Methods

### Return the Index of a Value in a Python Tuple

You can reference tuple values with indices or index slices. This section shows you how to use indices and slices.

The example below references the first index (`atuple[0]`) of the `atuple` tuple.

    >>> atuple = (1, 2, 3)
    >>> atuple[0]
    1

The example below *slices* `atuple` and returns all values starting from index `0` and ending at index `3`.

    >>> atuple = (1, 2, 3, 4)
    >>> atuple[0:3]
    (1,2,3)

You can return the index number of a tuple's value using the `index()` method.

    >>> colors = ("red", "violet", "yellow-green")
    >>> colors.index("yellow-green")
    2

{{< note >}}
Tuples are ordered collections, so they can contain duplicate values. If a tuple contains a duplicate value, the `index()` method returns the lowest-index instance of the value.
{{</ note >}}

### How to Sort a Tuple

Tuples cannot be sorted in place because they are immutable—once it is created, the items inside it cannot change. However, it is possible to take the elements of one tuple and create another one with it. The `sorted()` function takes in a tuple as an argument and returns a list with the sorted elements of the original tuple.

    >>> out_of_order = (4, 3, 7, 6, 1, 0, 2, 5)
    >>> in_order = sorted(out_of_order)
    >>> print(in_order)
    [0, 1, 2, 3, 4, 5, 6, 7]
    >>> type(in_order)
    <class 'list'>

The return value of `in_order` is a List. To make it a tuple, convert the result.

    >>> new_tuple = tuple(in_order)

## Python Tuple vs. List

### Differences in Syntax

To create a List in Python, you must enclose your values using brackets (`[]`). Tuples, however, can be created by enclosing values with parentheses (`()`) or by using a comma-separated collection of values. You can exclude the parentheses, but you must ensure each value is separated by a comma (`,`).

### Immutable vs. Mutable

Lists can change after they are created; programs can add items, remove items, replace items, or reorder items. A List is *mutable*. This is not the case for a tuple. Tuples are *immutable*, which means that their values cannot change after the tuple is created. If a value needs to change in a tuple, you must create a new tuple with the change.

### Use cases for Lists and Tuples

A tuple's immutability is convenient in cases where the values in a collection must stay the same. For example, you can represent rows of data as tuples and remain confident that each row of data remains unchanged. Tuple immutability also ensures tuple unpacking, that the program can track the value of each of the unpacked variables.

Finally, tuples take up less memory than Lists and instantiate faster, so in the rare case where speed is of the essence, they can provide an advantage.

In cases where the collection needs regular modification, a List makes more sense. Because most programs require modification of dynamic data, it’s much more common to see Lists used in Python programs.
