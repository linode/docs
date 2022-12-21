---
slug: python-tuples
author:
  name: Chelsea Troy
description: 'Learn to create a Python tuple by following this guide. You also learn the differences between lists and tuples, and how to convert a list into a tuple.'
keywords: ['python create tuple','python tuple vs list','python list to tuple']
tags: ['python']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-02-25
modified_by:
  name: Linode
title: "Creating and Using Python Tuples"
h1_title: "An Introduction to Python Tuples"
enable_h1: true
contributor:
  name: Chelsea Troy
  link: https://twitter.com/HeyChelseaTroy
---

A tuple is a built-in Python data structure that stores multiple comma-separated values. Tuples are an immutable *sequence* type that can store values of any data type. A mix of different data types can also be stored in a tuple. This guide describes the characteristics of tuples and shows you the various ways you can create a Python tuple.

{{< note >}}
You should have [Python 3.0 installed on your machine](/docs/guides/how-to-install-python-on-ubuntu-20-04/) to follow along with the examples in this guide.
{{</ note >}}

## Python Tuple Syntax

The syntax to create a Python tuple is made up of your tuple values that are comma separated and enclosed in parentheses. However, there are a few syntax quirks to keep in mind when working with tuples in Python. The section below covers the syntax for each way that you can create a Python tuple.

### Create a Python Tuple

A Python tuple can be created in the following ways:

- Create an empty tuple with an empty pair of parentheses:

        example_tuple = ()

- Create a tuple with multiple values that are separated with commas:

        example_tuple = (1, 2, 3)

    You can exclude the parentheses when creating a tuple with multiple values:

        example_tuple = 1, 2, 3

- Use the built-in `tuple()` method to create a new tuple:

        example_tuple = tuple([1,2,3])

    If you print `example_tuple`, the following is returned:

        print(example_tuple)

    {{< output >}}
    (1, 2, 3)
    {{</ output >}}

### Create a Tuple with a Single Value (Singleton)

To store a single value, or *singleton* in a tuple, you must include a comma when assigning the value to a variable. If you don't include the comma, Python does not store the value as a tuple. For example, create the following tuple to store a single string.

    day = ("monday",)

Use the `type()` function to display the `day` variable's type.

    type(day)

The Python interpreter confirms that `day` contains a tuple with a single value.

{{< output >}}
<class 'tuple'>
{{</ output >}}

Now, store the same value in the `day` variable, but exclude the trailing comma.

    day = ("monday")

Use the `type()` function to display the `day` variable's type.

    type(day)

The Python interpreter confirms that the `day` variable does **not** store a tuple, and instead stores a string:

{{< output >}}
<class 'str'>
{{</ output >}}

The difference occurs because the first example includes a trailing comma, while the second example does not.

## Converting Collection Types to a Tuple

The `tuple()` function converts the four Python collection types into a tuple. Python collection types include lists, tuples, sets, and dictionaries. The following sections show you how to convert Python's collection types into a tuple.

### Convert a List to a Tuple

In Python, a list contains comma-separated items wrapped in square brackets. For example:

    example_list = ["item_1", "item_2", "item_3"]

To convert `example_list` into a tuple, pass `example_list` as an argument of the `tuple()` method, and assign the result to a new variable.

    list_to_tuple_example = tuple(example_list)

Use the `type()` function to display the `list_to_tuple_example` variable's type.

    type(list_to_tuple_example)

The Python interpreter confirms that the `list_to_tuple_example` variable contains a tuple:

{{< output >}}
<class 'tuple'>
{{</ output >}}

## Convert a Dictionary to a Tuple

A Python dictionary is composed of a series of key-value pairs that are wrapped in curly braces. For example:

    example_dict = {
        'first': 'Jane',
        'last': 'Doe',
        'year': '2000'
    }

To convert `example_dict` into a tuple, pass `example_dict` as an argument of the `tuple()` method, and assign the result to a new variable.

    dict_to_tuple_example = tuple(example_dict)

Use the `type()` method to confirm that the `dict_to_tuple_example` variable contains a tuple:

    type(dict_to_tuple_example)

{{< output >}}
<class 'tuple'>
{{</ output >}}

However, if you print the value of `dict_to_tuple_example`, the tuple **only includes the keys** from the dictionary.

    print(dict_to_tuple_example)

{{< output >}}
('first', 'last', 'year')
{{</ output >}}

A good way to preserve both your Python dictionary keys and values is to create a list of tuples. In order to achieved this, use the dictionary type's built-in `items()` method. The `items()` method returns a list of a dictionary's key-value pairs as tuples. Using `example_dict` from the beginning of this section, the example below converts the dictionary into a list of tuples:

    dict_to_tuple_example = example_dict.items()

Use the `print()` method to view the contents of `dict_to_tuple_example`:

    print(dict_to_tuple_example)

{{< output >}}
dict_items([('first', 'Jane'), ('last', 'Doe'), ('year', '2000')])
{{</ output >}}

Python dictionaries also support the use of tuples as a key. See our guide [How to use Dictionaries in Python 3](/docs/guides/python-3-dictionaries/) to learn more.

## Tuple Unpacking

Typically, when you create a tuple, you assign the tuple values to a single variable. For example:

    colors = ('red', 'violet', 'yellow-green')

*Tuple unpacking* is the action of extracting the values stored in a tuple and assigning each value to its own variable. Using the `colors` tuple from the example above, use the code below to assign each tuple value to a variable:

    (primary, secondary, tertiary) = colors

The tuple unpacking, assigns each value contained in the `colors` tuple to the values declared on the left side of the variable assignment declaration. Use the `print()` method to view the value of each new variable.

    print(primary)

{{< output >}}
red
{{</ output >}}

    print(secondary)

{{< output >}}
violet
{{</ output >}}

    print(tertiary)

{{< output >}}
yellow-green
{{</ output >}}

When tuple unpacking, the number of variables must be the same as the number of values stored within the tuple. Not including enough variables, generates a `ValueError: too many values to unpack` error. You may, however, only want to store some of your tuple values in separate variables. Python supports two ways of further manipulating how tuples are unpacked.

You can select which values in a tuple to store in individual variables and then store the rest of the tuple values in a list. For example, consider the following tuple:

    artists = ('carey', 'jackson', 'nin', 'butler')

To only unpack the first two tuple values, on the left side of the variable assignment declaration, include two variables in the same position as the tuple values that you want to store. Designate the name of the list that stores the remaining unassigned variables, using an asterisk and the desired list name.

    (mariah, janet, *writers) = artists

If you print the contents of the `writers` list you should see the remaining tuple values `nin` and `butler` are stored.

    print(writers)

{{< output >}}
['nin', 'butler']
{{</ output >}}

To skip assigning a tuple value to a variable during tuple unpacking, use an underscore in the same position `_` as the value that you want to skip. For example, to skip assigning a variable to the `nin` tuple value, use the following code:

    (mariah, janet, _, octavia) = artists

The `_` maintains the order of the variable to value assignment and indicates to anyone reading the code that a value assignment has been skipped.

You can also combine the asterisk and underscore to skip all unassigned values. For example, to assign a variable only to the first value and skip all the rest, use the following code:

    (mariah, *_) = artists

## Convert a Python Tuple to a List

To convert a tuple to a list use the `list()` method. Consider the following tuple:

    example_tuple = ('item_1', 'item_2', 'item_3', 'item_4')

Convert its values into a list in the following way:

    tuple_to_list_example = list(example_tuple)

Use the `type()` method to confirm that the `tuple_to_list_example` variable contains a list:

    type(tuple_to_list_example)

{{< output >}}
<class 'list'>
{{</ output >}}

To learn how to convert a string to a tuple, see our guide [How to Convert Data Types in Python](/docs/guides/how-to-convert-datatypes-in-python/#converting-strings-to-tuples).

## Built-in Tuple Methods

Python's tuple sequence data type has two built-in methods: the `count()` method and the `index()` method. This section shows you how to use both built-in tuple methods.

### Return the Index of a Value in a Python Tuple

The `index()` method returns the index number of a specified element stored in a tuple. Its syntax is as follows:

    tuple.index(element, start, end)

The three possible arguments are used in the following way:

- **element** (required): the element to look for in the tuple.
- **start** (optional): the index position to start when searching for the provided element.
- **end** (optional): the index position to end the search for the provided element.

The example tuple below includes several string values:

    letters = ('r', 'a', 'd', 'a', 'r')

To find the index number of `violet`, use the `index()` method:

    letters.index('a')

The `index()` method returns the position of the first instance of the element, `a`:

{{< output >}}
1
{{</ output >}}

To search for the second occurrence of the string `a` include a `start` argument.

    letters.index('a', 2,)

The `index()` method returns the position of the second instance of the string `a`, since the start argument tells the method to start its search from index `2`.

{{< output >}}
3
{{</ output >}}

### The Tuple Count Method

The `count()` method returns the number of times that a particular element appears within a tuple. For example, to find the number of occurrences of the string `a` in the letters tuple, use the `count()` method as follows:

    letters = ('r', 'a', 'd', 'a', 'r')
    letters.count('a')

As expected, the `count()` method returns `2`

{{< output >}}
2
{{</ output >}}

### How to Sort a Tuple

Tuples are immutable, this means once a tuple is created it cannot be changed. For this reason, tuples are often used together with lists, a sequence type that is mutable, that is, it can be changed. To sort a tuple, use the `sorted()` method. The `sorted()` method takes in any iterable object, like a tuple, as an argument and returns a sorted list.

The syntax of the `sorted()` method is as follows:

    sorted(iterable, key=None, reverse=False)

The three possible arguments are used in the following way:

- **iterable** (required): iterable object to sort. This include sequence and collection types.
- **key** (optional): provide custom sorting behavior. The returned value of key is used to sort the iterable. For example, you can pass a built-in Python method or a custom method as the key. The default value for `key` is `None`.
- **reverse** (optional): The sort order to use for the iterable. A value of `True` sorts in descending order. The default value, `False`, sorts in ascending order.

As an example, this section shows you how to sort the tuple below:

    out_of_order = (4, 3, 7, 6, 1, 0, 2, 5)

Pass the `out_of_order` tuple as an argument to the `sorted()` method and store the returned list in a new variable.

    in_order = sorted(out_of_order)

Use the `print()` method to view the contents of the `in_order` list.

    print(in_order)

{{< output >}}
[0, 1, 2, 3, 4, 5, 6, 7]
{{</ output >}}

The values originally contained in the `out_of_order` tuple have now been sorted in ascending order.

To create a list with the tuple values sorted in descending order use the following code:

    in_order_descending = sorted(out_of_order, reverse=True)

Use the `print()` method to view the contents of the `in_order_descending` list.

    print(in_order_descending)

{{< output >}}
[7, 6, 5, 4, 3, 2, 1, 0]
{{</ output >}}

The values originally contained in the `out_of_order` tuple have now been sorted in descending order.

## Python Tuple vs. List

### Differences in Syntax

To create a list in Python, you must enclose your values using brackets (`[]`). Tuples, however, can be created by enclosing values with parentheses (`()`) or by using a comma-separated group of values. You can exclude the parentheses, but you must ensure each value is separated by a comma (`,`).

Tuples and lists can both store heterogeneous data types and are both ordered sequence types. This means that values for both tuples and lists can be accessed using index notation.

The example below includes a tuple and a list, respectively.

    letters_tuple = ('r', 'a', 'd', 'a', 'r')
    letters_list = ['r', 'a', 'd', 'a', 'r']

You an access the string in the third position of the tuple and the list using the following index notation:

    print(letters_tuple[2])

{{< output >}}
d
{{</ output >}}

    print(letters_list[2])

{{< output >}}
d
{{</ output >}}

### Immutable vs. Mutable

Lists can change after they are created; programs can add items, remove items, replace items, or reorder items. A list is *mutable*. This is not the case for a tuple. Tuples are *immutable*, which means that their values cannot change after the tuple is created. If a value needs to change in a tuple, you must create a new tuple with the change or convert the tuple to a list.

### Use Cases for Lists and Tuples

A tuple's immutability is convenient in cases where the values in a collection must stay the same. For example, you can represent rows of data as tuples and remain confident that each row of data remains unchanged. Tuple immutability also ensures tuple unpacking and that your Python code can track the value of each of the unpacked variables.

Tuples take up less memory than lists and instantiate faster, so in the case where speed needs to be considered, they can provide an advantage.

In cases where the collection needs regular modification, a list makes more sense. Because most programs require modification of dynamic data, it’s much more common to see lists used in Python programs.
