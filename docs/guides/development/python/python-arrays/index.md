---
slug: python-arrays
author:
  name: Nathaniel Stickman
description: "Python arrays store collections of data. In this tutorial, learn what a Python array is, how it differs from a list, and how to add and remove elements from an array."
keywords: ['python arrays','python arrays tutorial','python arrays vs lists']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-06-17
modified_by:
  name: Linode
title: "Python Arrays: What They Are and How to Use Them"
h1_title: "Python Arrays: What They Are and How to Use Them"
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
external_resources:
- '[Python Docs: array — Efficient arrays of numeric values](https://docs.python.org/3/library/array.html)'
---

Python arrays provide an effective way to store multiple values of the same type in a single variable. In this tutorial, you learn what Python arrays are and how to use them, and the difference between Python lists and arrays. You also learn how to loop through an array, add and remove elements from an array, and how to combine the values stored in different arrays.

## What Are Arrays in Python?

In Python, an array is an ordered collection of objects, all of the same type. These characteristics give arrays two main benefits. First, items in an array can be consistently identified by their index, or location, within the array. Second, items in an array are assured to be of the same type.

When creating an array in Python, you must indicate the type of data to be stored. The available types are indicated using codes, which consist of the following:

| Type Code | C Type             | Python Type       | Min. Bytes |
| --------- | ------------------ | ----------------- | ---------- |
| 'b'       | signed char        | int               | 1          |
| 'B'       | unsigned char      | int               | 1          |
| 'u'       | wchar_t            | Unicode character | 2          |
| 'h'       | signed short       | int               | 2          |
| 'H'       | unsigned short     | int               | 2          |
| 'i'       | signed int         | int               | 2          |
| 'I'       | unsigned int       | int               | 2          |
| 'l'       | signed long        | int               | 4          |
| 'L'       | unsigned long      | int               | 4          |
| 'q'       | signed long long   | int               | 8          |
| 'Q'       | unsigned long long | int               | 8          |
| 'f'       | float              | float             | 4          |
| 'd'       | double             | float             | 8          |

Generally, though, for arrays containing numbers, you can focus on using just two of the available codes. Use the `i` code for arrays containing integers. Use the `d` code for arrays containing floating point numbers.

You can see an example showing how to use a code to initiate an array at the beginning of the [How to Use Arrays in Python](/docs/guides/python-arrays/#how-to-use-arrays-in-python) section of this guide.

### Python Arrays vs. Lists

Often, people talking about arrays in Python are actually referring to [Python *lists*](/docs/guides/python-lists-and-how-to-use-them/). While lists and arrays share some similarities in Python, they are two distinct types of collections.

The main difference between lists and arrays is that arrays constrain the object type it can store. Lists do not give you a way to limit the types of objects they contain. When using an array, you can be sure that it only contains the type that was specified upon creation.

A single Python list can simultaneously store integers, strings, and dictionaries. You can even add more elements of still other types to an existing list. By contrast, elements in a Python array can only be of one type. An array of integers can only contain integers and can only have other integers added to it.

Aside from this difference, however, you can generally navigate and modify arrays and lists in the same way. All of the operations detailed below for arrays, except for the `array()` function itself, can be applied to lists as well.

## How to Use Arrays in Python

The next few sections of this guide show you how to work with arrays in Python. Python has a wide variety of operations that can help you effectively make use of arrays. The sections below demonstrate the most common operations you might need to perform on arrays.

All of the examples to follow work off of a simple integer array created using the following Python code:

    from array import *
    example_array = array("i", [2, 4, 6, 8])


{{< note >}}
The [array module](https://docs.python.org/3/library/array.html) is not loaded by default in Python. Instead, you need to import the module to start working with arrays.
{{< /note >}}

### Navigating Python Arrays

There are two ways you can interact with the contents of an array: either through Python's indexing notation or through looping. Each of these is covered in the sections that follow.

#### Python Array Indices and Slices

The individual elements of an array can be accessed using indices. Array indices begin at `0`. This means that the first element of an array is assigned an index of `0`, and each subsequent element's index progresses from there.

So, to access the first, second, and third elements of the `example_array`, you use the following index notation:

    example_array[0]

{{< output >}}
2
{{< /output >}}

    example_array[1]

{{< output >}}
4
{{< /output >}}

    example_array[2]

{{< output >}}
6
{{< /output >}}

You can also use negative numbers as indices. When you use a negative number as an index, Python counts backwards through the array, starting with `-1` as the last item in the array. The following example accesses the last value stored in `example_array`:

    example_array[-1]

{{< output >}}
8
{{< /output >}}

Python supports more advanced indexing through its *slice* notation. Slicing allows you to select a range of elements from an array.

The syntax for slice notation is the following:

    [start:stop:step]

`start` defines the first index of the range and `stop` defines the last. The `step` portion is optional. It is used to define how many elements to progress through while moving over the range `start` and `stop` range. By default, the value of `set` is `1`.

The next example slices the range from index `0` through index `3`. It progresses through this range using `2` steps at a time, meaning it skips every other item:

    example_array[0:3:2]

{{< output >}}
array('i', [2, 6])
{{< /output >}}

Python's slice notation is a powerful tool that can be used to perform many more complicated operations than demonstrated in this guide. To see more examples with in-depth explanations, check out our guides [How to Slice and Index Strings in Python](/docs/guides/how-to-slice-and-index-strings-in-python/) and [Python Lists and How to Use Them](/docs/guides/python-lists-and-how-to-use-them/). While these guides do not deal directly with Python arrays, the concepts apply equally well.

#### Looping Over Array Elements

Python arrays can be iterated over using `for` loops. This provides a convenient way to take an action on each element in an array. Each loop yields a variable — `item` in the example — corresponding to an element in the array:


    for item in example_array:
        print(item)

The output returns the value of every element in the array.

{{< output >}}
2
4
6
8
{{< /output >}}

Using the `enumerate` function, you simultaneously loop through the elements and their indices:

    for i, item in enumerate(test_array):
        print(str(i + 1) + ": " + str(item))

The `enumerate()` function returns the count of the current iteration (stored in the `i` variable) and the value of the current iteration (stored in the `item` variable). Since array indexes begin at `0`, the statement inside the loop adds `1` to the value of the `i` counter to calculate the current index.

{{< output >}}
1: 2
2: 4
3: 6
4: 8
{{< /output >}}

The output returns the index number of the current element in the array along with the value itself. The index and the value are separated by a `:` as indicated in the `enumerate()` function's print statement.

### Modifying Python Arrays

Python also provides ways of modifying the contents of an array, whether you need to add elements or remove them. There is even a way to combine multiple arrays. These next sections show you how to do all of these operations, working with the same example array as above.

#### Add an Element to an Array

Python arrays include two built-in methods for adding new elements. Which method you use depends on where within the array you want the new element to be added.

Use the `append()` method to add a new element to the end of an array. The example below adds the integer `10` as a new element at the end of `example_array`:

    example_array.append(10)
    print(example_array)

The array `example_array` now also contains the `10` integer.

{{< output >}}
array('i', [2, 4, 6, 8, 10])
{{< /output >}}

Use the `insert()` method to add a new element to a specific position within an array. The method accepts two parameters; the first parameter is the index where the element should be inserted and the second is the element to insert into the array.

The example below uses the `insert()` method to place the integer `7` in `example_array` index position `3`.

    example_array.insert(3, 7)
    print(example_array)

Printing the array confirms that it now contains integer `7` in index position `3`:

{{< output >}}
array('i', [2, 4, 6, 7, 8, 10])
{{< /output >}}

#### Remove an Element from an Array

Python arrays include two built-in methods that you can use to remove elements from an array. The method you choose depends on whether you want to remove an element based on a given value or a given index.

The `remove()` method takes as a parameter the value to remove from the array. In the following example, the `remove()` method removes integer `7` from `example_array`. This integer was added to the array in the previous section.

    example_array.remove(7)
    print(example_array)

The output confirms that `example_array` no longer contains `7`.

{{< output >}}
array('i', [2, 4, 6, 8, 10])
{{< /output >}}

The `pop()` method, on the other hand, can be used to remove elements based on index. This next example uses the `-1` index to remove the last element in the array, which was one of the elements added in the previous section:

    example_array.pop(-1)
    print(example_array)

{{< output >}}
10
array('i', [2, 4, 6, 8])
{{< /output >}}

The `pop()` method returns the value of the element that has been removed. This is why the output displays the integer `10`. This is useful if, for example, you want to store the value of the removed element in a new variable.

### Combining Arrays

Python arrays can be combined, or concatenated, using the `+` operator. There are other ways to go about combining arrays — using a loop, for instance. But the `+` operator provides the most convenient method if your goal is simply to join two or more arrays.

In the example below, the `example_array` is combined with a new array, `another_array`, and stored in `combined_array`.

    example_array = array("i", [2, 4, 6, 8])
    another_array = array("i", [20, 40, 60, 80])
    combined_array = example_array + another_array
    print(combined_array)

Printing `combined_array` confirms that it now contains all the values stored in the two concatenated arrays.

{{< output >}}
array('i', [2, 4, 6, 8, 20, 40, 60, 80])
{{< /output >}}

## Conclusion

Python arrays are a collection type that can store multiple values. Each value can be accessed using index notation. While a Python array is similar to a list, it differs in that you can only store values of the same type in an array. Arrays also have built-in methods that help you add and remove elements. You can also combine two arrays using the `+` operator.



