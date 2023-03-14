---
slug: python-3-dictionaries
description: 'Dictionaries in Python 3 contain key-value pairs and support various built-in methods for common tasks. This guide shows you how to create, delete, and update a Python dictionary.'
keywords: ['get value from dictionary python','python define dictionary','python dictionary methods']
tags: ['Python']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-04-01
modified_by:
  name: Linode
title: "Use Dictionaries in Python 3"
title_meta: "How to Use Dictionaries in Python 3"
authors: ["John Mueller"]
---

A dictionary in Python is much like the dictionary you find online or the paper version you find on a shelf. It consists of a series of key-value pairs. A Python dictionary's keys are used to retrieve a dictionary entry along with its value. The act of assigning a key to a value is called *mapping*, so a Python dictionary is a *mapped data type*. This guide introduces you to the Python 3 dictionary data type and shows you how to use dictionaries in your Python code.

## Dictionary Syntax in Python 3

When you create a dictionary in Python 3, its syntax consists of a key-value pair in a mapped arrangement. You can create a Python dictionary in several ways. The sections below show you the different ways to create a Python dictionary. Each method has a use case in which it works best. A Python dictionary supports the use of tuples for keys. It’s also possible to define a dictionary using a *dictionary comprehension* to make the code significantly shorter.

### Python 3: Define a Dictionary

A dictionary always has a key that relies on an immutable type, such as: `int`, `float`, `decimal`, `string`, `tuple`, and `range`. Typically, you use the same data type for all of a dictionary's keys. However, a single dictionary can contain keys of different immutable types and its values can be of any type. For example:

    numbers = {'One' : 1, 'Two' : 'Two', 'Three' : 3.0}

If you print the value of the `numbers` dictionary created above, you see the following output:

{{< output >}}
{'One': 1, 'Two': 'Two', 'Three': 3.0}
    {{</ output >}}

As demonstrated above, dictionaries consist of the following syntax:

- Employ an opening brace (`{`) to start the dictionary
- Separate the keys from the values using a colon (`:`)
- Separate dictionary entries using a comma (`,`)
- Use a closing brace (`}`) to end the dictionary

The example dictionary additionally does the following:

- Uses the `string` data type for the keys, which consist of `'One'`, `'Two'`, and `'Three'`.
- Uses various data types for the values, which consist of `1`, `'Two'`, and `3.0`.

A dictionary can mix immutable data types in the keys. This means that the following dictionary is also acceptable:

    numbers = {1: 'One', 'Two': 'Two', 3.0: 'Three'}

However, accessing dictionary keys is much harder when using mixed data types.

### Alternative Dictionary Syntax

You can create a Python dictionary using the `dict()` constructor and a sequence of key-value pairs.

    numbers = dict([('One', 1), ('Two', 'Two'), ('Three', 3.0)])

Printing the `numbers` dictionary results in the following output:

{{< output >}}
{'One': 1, 'Two': 'Two', 'Three': 3.0}
{{</ output >}}

The examples below use the `dict()` constructor to create dictionaries using a variety of data types as keys and values. The example demonstrates that it’s unnecessary, in many cases, to convert your data's format before creating a dictionary.

    numbers = dict(zip(['One', 'Two', 'Three'], [1, 'Two', 3.0]))

Printing the `numbers` dictionary results in the following output:

{{< output >}}
{'One': 1, 'Two': 'Two', 'Three': 3.0}
{{</ output >}}

The example below shows that you can mix and match dictionary creating methods. It uses the `dict()` method to create the `numbers` dictionary. The `numbers` dictionary's first entry consists of another dictionary that is declared using the curly braces syntax. Mixing dictionary creating methods is especially useful when the data you're working with appears in more than one form.

    numbers = dict({'One' : 1, 'Three': 3.0}, Two = 'Two')

Printing the `numbers` dictionary results in the following output:

{{< output >}}
{'One': 1, 'Three': 3.0, 'Two': 'Two'}
{{</ output >}}

### Using Tuples as Dictionary Keys

A tuple is a built-in Python data structure that stores multiple comma-separated values. Tuples as dictionary keys are often used to store point coordinates used in maps or other applications that require coordinate data. For example, use a tuple to store a first and last name that maps to a telephone number. The example dictionary `map_coordinates` uses a tuple as its keys.

    map_coordinates = {(0,1): 100, (2,1): 200}

To learn more about the syntax of Python tuples and other topics, like built-in tuple methods, and tuple unpacking, see our guide [An Introduction to Python Tuples](/docs/guides/python-tuples/).

### Dictionary Comprehension

A *dictionary comprehension* creates a new dictionary and populates its keys or values based on an expression. The typical syntax for a dictionary comprehension is as follows:

    dictionary_name = {key:value for (key,value) in dictionary.items()}

For example, the following dictionary comprehension uses the numbers `0` through `9` as keys and the squared values of those keys for values:

    squared_dict = {x: x ** 2 for x in range(10)}

Printing the `squared_dict` dictionary comprehension displays the dictionary that was created with the dictionary comprehension:

    print(squared_dict)

**Output:**

{{< output >}}
{0: 0, 1: 1, 2: 4, 3: 9, 4: 16, 5: 25, 6: 36, 7: 49, 8: 64, 9: 81}
{{</ output >}}

In addition to using an expression for the values, you can also use expressions to generate a dictionary's keys. For example, the following dictionary comprehension defines a dictionary with the characters `A` through `J` as keys:

    example_dict = {chr(x + 65): x ** 2 for x in range(10)}

Printing the `example_dict` dictionary comprehension displays the following dictionary:

    print(example_dict)

**Output:**

{{< output >}}
{'A': 0, 'B': 1, 'C': 4, 'D': 9, 'E': 16, 'F': 25, 'G': 36, 'H': 49, 'I': 64, 'J': 81}
{{</ output >}}

While dictionary comprehension generates the keys and values, the dictionary itself acts like any other Python dictionary.

Dictionary comprehensions require less typing due to its concise syntax. It also reduces the chance of errors and if written simply, it keeps your code more readable.

## How to Get a Value from a Dictionary in Python?

After creating a dictionary, you can access its values in several different ways. The two common methods for performing this task are to access the value directly or to access it as part of a loop. A dictionary often contains unwanted values, so using Python comprehensions can cut the dictionary down to size before you access its values. These techniques appear in the following sections.

If you are newer to for and while loops in Python, you can view several examples in our guide [For and While Loops in Python 3](/docs/guides/python-for-and-while-loops/).

### Access a Dictionary's Values

To provide access to its values, a dictionary relies on keys, not numeric indexes. When a dictionary uses well-defined keys, it is much easier to understand what type of data is stored in the dictionary.

The syntax for accessing a dictionary value using its key is as follows:

    example_var = example_dict['key']

Using the `numbers` dictionary from the beginning of this guide, you can access the value of key `One` as shown below:

    numbers = {'One' : 1, 'Two' : 'Two', 'Three' : 3.0}

    example_var = numbers['One']

When you print `example_var`, the value of the `'One'` key is returned, i.e., `1`:

    print(example_var)

**Output:**

{{< output >}}
1
{{</ output >}}

If you attempt to access a non-existent key from a dictionary, Python outputs a `KeyError` exception. This exception often happens when the key specified uses a different spelling or different case than the original key. For example, if you try to access the `'one'` key, instead of the `'One'` key, you receive a `KeyError` exception:

    print(numbers['one'])

{{< output >}}
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
KeyError: 'one'
{{</ output >}}

The `KeyError` exception is raised because the key is case-sensitive. To avoid this error, it’s possible to add code similar to the example below to validate the key:

    if "one" in myNumberValues:
       print("The key 'one' exists.")
    else:
       print("The key 'one' doesn't exist.")

### Iterate Through a Dictionary in Python

Python dictionaries have built-in support for iterating over its keys. To iterate over a Python dictionary and access all its keys, use a `for` loop:

    numbers = {'One' : 1, 'Two' : 'Two', 'Three' : 3.0}

    for key in numbers:
       print(key)

This generates the following output:

{{< output >}}
One
Two
Three
{{</ output >}}

If you'd like to access a dictionary's values instead of keys, modify the `for` loop as follows:

    for key in numbers:
        print(numbers[key])

This generates the following output:

{{< output >}}
1
Two
3.0
{{</ output >}}

Python provides several built-in methods that support accessing dictionary keys and values.

- `keys()`: Obtains all of the keys in a dictionary.
- `values()`: Obtains all of the values in a dictionary.
- `items()`: Creates tuples containing the dictionary's key-value pairs.

Using the built-in methods listed above, you can iterate over a dictionary's keys and values using the following `for` loop:

    for key, value in numbers.items():
       print(key, "contains", value)

Your output should resemble the following:

{{< output >}}
One contains 1
Two contains Two
Three contains 3.0
{{</ output >}}

## Create a Python Dictionary from Another Dictionary

You may need to create a new dictionary based on the keys and values from another dictionary. For these cases, Python comprehensions are very useful. For example, the comprehension below selects certain keys based on specific criteria.

    numbers = {'One' : 1, 'Two' : 'Two', 'Three' : 3.0}

    new_numbers = dict([ (k, v) for k, v in numbers.items()
                            if k[0] == "T" ])

    for key, value in new_numbers.items():
       print(key, "contains", value)

{{< output >}}
Two contains Two
Three contains 3.0
{{</ output >}}

The example code obtains the key-value pairs in the `numbers` dictionary using the `items()` method. Then it verifies whether the first character of the key is a `T`. If it is, then the key-value pair appears in a tuple that is then used to create a new dictionary using the `dict()` method.

## How to Set a Dictionary Value in Python

The example below demonstrates the syntax to add a *new* key-value pair to an *existing* Python dictionary.

    dictionary['key'] = value

To add a new key-value pair to the `numbers` dictionary used throughout this guide, use the following code:

    numbers['Four'] = 4

    print(numbers['Four'])

{{< output >}}
4
{{</ output >}}

You can also modify an existing dictionary value. You should ensure that the value you are modifying actually exists in the dictionary. For this reason, the following code is a safe approach:

    if 'One' in numbers.keys():
        numbers['One'] = 1.00001

This code is safer because it uses the `if` clause to make sure the updated value is added to your dictionary only if the key `One` exists. Without the `if` clause, if the key `One` did not exist, you would unintentionally add a new entry to the `numbers` dictionary.

## How to Delete a Dictionary Value in Python

There are various ways to delete a dictionary value in Python. The first method is using the `del` keyword followed by the key that stores the value you want to delete.

    del numbers['One']

When you use the `del` keyword, Python does not return the modified dictionary. This makes it difficult to know how the operation affected the existing dictionary. A safer method of removing values from a dictionary is to use the `pop()` method, as shown below:

    if 'One' in numbers.keys():
        removed = numbers.pop('One')
        print("Removed", removed)

{{< output >}}
Removed 1.00001
{{</ output >}}

This version of the code has several advantages, one of which is that the `pop()` method returns the value that is removed from the dictionary. This enables you to store the value in a variable. The second advantage is that `pop()` is clearer in its intent. Similarly, storing the value in a variable enables you to add the value back to your dictionary, if needed.

If you need to remove the last value from a dictionary, use the `popitem()` method instead. The function returns both the key and the value from the dictionary.

    key, value = numbers.popitem()
    print(key,value)

{{< output >}}
Four 4
{{</ output >}}

Since the key and the value are both returned, it’s possible to recover from an accidental removal. You can also let the user know precisely what was removed from the dictionary.

Python also makes it possible to clear the dictionary entirely using the `clear()` method. In this case, the method doesn't return anything, so the only recovery option is to make a copy of the dictionary before clearing it.

    numbers.clear()
    print(numbers)

{{< output >}}
{}
{{</ output >}}

## How to Get the Length of a Dictionary in Python

To find the length of a dictionary in Python, use the `len()` method, as follows:

    numbers = {'One' : 1, 'Two' : 'Two', 'Three' : 3.0}
    len(numbers)

{{< output >}}
3
{{</ output >}}

The returned value displays the number of key-value pairs that exist in the `numbers` dictionary.

## Python's Built-in Dictionary Methods

Python dictionaries support several built-in methods that you can use for a variety of tasks. The list below contains the Python dictionary methods not covered elsewhere in this guide.

- `copy()`: Creates a [shallow copy](https://docs.python.org/3/library/copy.html) of the dictionary. The fact that the copy is shallow is only important when working with compound objects. A shallow copy provides references to objects found within a compound object, rather than creating new objects for the copied compound object.

- `fromkeys()`: Creates a copy of a dictionary’s keys in a new dictionary, but with the values set to `None`. For example, the code `numbers_copy = numbers.fromkeys(numbers.keys())` creates a copy of just the keys in the `numbers` dictionary and places them in `numbers_copy`, but the values in `numbers_copy` are all set to `None`.

- `get()`: Obtains the value for the specified key. If the specified key does not exist, the `get()` method returns a default value. When there is no default value, then `get()` returns `None`. This function never returns a key error. For example, in the following code, `numbers.get('Eight', 8.0)`, the `get()` function returns a value of `8.0` assuming that the `Eight` key does not exist.

- `setdefault()`: Provides a default value for a specific key when it’s known in advance that a dictionary must contain the specified key. If the default value isn’t provided, then Python inserts `None` in place of a value. For example, when making this method call: `numbers.setdefault('Eight', 8.0)`, the dictionary `numbers` contains a key of `Eight` with a value of `8.0` after the call when the key doesn't already exist. In all cases, the function returns the current value of the key upon exit. If the key does already exist, the `setdefault()` function returns its current value, rather than creating a new key with a new value.

- `update()`: Merges two dictionaries together. The key-value pairs from the `update()` method's dictionary appear at the end of the existing dictionary. Consequently, with the example of `numbers.update({'Five': 5, 'Six': 6})`, keys `'Five'` and `'Six'` are added to the end of the `numbers` dictionary. If the keys already exist, their values are updated with the values from the updated dictionary.