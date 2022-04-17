---
slug: python-arrays
author:
  name: Linode Community
  email: docs@linode.com
description: "Python’s arrays are powerful tools for dealing with collections of data. In this tutorial, learn what exactly a Python array is, what sets it apart from a list, and how you can start using arrays in your Python code."
og_description: "Python’s arrays are powerful tools for dealing with collections of data. In this tutorial, learn what exactly a Python array is, what sets it apart from a list, and how you can start using arrays in your Python code."
keywords: ['python arrays','python arrays tutorial','python arrays vs lists']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-04-17
modified_by:
  name: Nathaniel Stickman
title: "Python Arrays: What They Are and How to Use Them"
h1_title: "Python Arrays: What They Are and How to Use Them"
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
external_resources:
- '[Python Docs: array — Efficient arrays of numeric values](https://docs.python.org/3/library/array.html)'
- '[W3 Schools: Python Arrays](https://www.w3schools.com/python/python_arrays.asp)'
- '[Tutorials Point: Python - Arrays](https://www.tutorialspoint.com/python/python_arrays.htm)'
- '[Programniz: Python Array](https://www.programiz.com/python-programming/array)'
- '[GeeksforGeeks: Python Arrays](https://www.geeksforgeeks.org/python-arrays/)'
---

Python arrays give you an effective way to store multiple values of the same type in a single variable. These ordered collections make elements navigable and, because of constraints on types, predictable.

In this tutorial, discover what Python arrays are, their differences from Python lists, and how use them. This includes everything you need to get started navigating, adding to, removing from, and combining arrays.

## What Are Arrays in Python?

In Python, an array is an ordered collection of objects, all of the same type. These characteristics give arrays two main benefits. First, items in an array can be consistently identified by their index, or location, within the array. Second, items in an array are assured to be of the same type.

Python has you indicate the type of data being stored by an array when creating the array. The available types are indicated using codes, which consist of the following:

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

Generally, though, for arrays containing numbers, you can focus on using just two of these. Use the `i` code for arrays containing integers. Use the `d` code for arrays containing floats.

You can see an example showing how to use a code to initiate an array at the beginning of the [How to Use Arrays in Python](/docs/guides/python-arrays/#how-to-use-arrays-in-python) section further below.

### Python Arrays vs Lists

Often, people talking about arrays in Python are actually referring to Python *lists*. While lists and arrays share some similarities in Python, they are two distinct types of collections.

The main difference between lists and arrays are the constraints put on the collections' types. Lists do not give you a way to limit the types of objects they contain. Arrays, by contrast, can assure you that they contain only one type of object.

So, for instance, you can have a Python list with integer, strings, and dictionaries simultaneously. You can even add more elements of still other types to such a list. But elements in a Python array can only be of one type. An array of integers can only contain integers and can only have other integers added to it.

Aside from this difference, however, you can generally use arrays and lists in the same way, as far as how you navigate and modify them. All of the operations detailed below for arrays, except for the `array` function itself, can be applied to lists as well.

## How to Use Arrays in Python

The next few sections of this guide show you how to work with arrays in Python. Python has a wide variety of operations that can help you effectively make use of arrays. Below, you can see the most useful of these in action.

All of the examples to follow work off of a simple integer array created using this Python code:

``` python
from array import *

example_array = array("i", [2, 4, 6, 8])
```

{{< note >}}
The array module is not loaded by default in Python. Instead, like above, you need to be sure to import the module to start working with arrays.
{{< /note >}}

### Navigating Arrays

There are two ways you can interact with the contents of an array: either through Python's indexing notation or through looping. Each of these is covered in the sections that follow.

#### Array Indices and Slices

Individual elements of arrays can be accessed using indices. Like lists, Python begins array indices at `0`. This means that the first element of an array is assigned an index of `0`, and each subsequent element's index progresses from there.

So, to access the first, second, and third elements of the `example_array`, you can use:

``` python
example_array[0]
example_array[1]
example_array[2]
```

{{< output >}}
2
4
6
{{< /output >}}

Additionally, Python allows you to provide negative numbers as indices. Negative numbers count backward through the array, starting with `-1` as the last item in the array:

``` python
example_array[-1]
```

{{< output >}}
8
{{< /output >}}

Python supports more advanced indexing through its *slice* notation. Slicing allows you to select a range of elements from an array.

Essentially, slice notation looks like: `[start:stop:step]`. Here, `start` defines the first index of the range and `stop` defines the last. The `step` portion is optional, but, when used, it defines how many elements to progress while moving through the range.

This next example slices the range from index `0` through index `3`. It progresses through this range using `2` steps at a time, meaning it skips every other item:

``` python
example_array[0:3:2]
```

{{< output >}}
array('i', [2, 6])
{{< /output >}}

Python's slice notation is a powerful tool, but it can be difficult to learn at first. To see more examples and explanations of it, check out our guides [How to Slice and Index Strings in Python](/docs/guides/how-to-slice-and-index-strings-in-python/) and [Python Lists and How to Use Them](/docs/guides/python-lists-and-how-to-use-them/). While these guides do not deal directly with Python arrays, the concepts apply equally well.

#### Looping Arrays

Python arrays can be iterated over using `for` loops. This provides a convenient way to take an action on each element in an array. Each loop yields a variable — `item` in the example — corresponding to an element in the array:

``` python
for item in example_array:
    print(item)
```

{{< output >}}
2
4
6
8
{{< /output >}}

Using the `enumerate` function, you simultaneously loop through the elements and their indices:

``` python
for i, item in enumerate(test_array):
    print(str(i + 1) + ": " + str(item))
```

{{< output >}}
1: 2
2: 4
3: 6
4: 8
{{< /output >}}

Usually, the plain `for` loop works when you want to work on each of the elements of an array. But the `enumerate` function has particular contexts where it can be especially helpful, so keep it in mind when you have more complex array operations.

### Modifying Arrays

Python also provides ways of modifying the contents of arrays, whether you need to add elements or remove them. There is even a way to combine multiple arrays. These next sections show you how to do all of these operations, working with the same example array as above.

#### Add to Array

Python arrays come with two methods for adding new elements. Which method you use depends on where you want the new element added.

Use the `append` method to add a new element to the end of an array. This example adds `10` as a new element at the end of `example_array`:

``` python
example_array.append(10)

print(example_array)
```

{{< output >}}
array('i', [2, 4, 6, 8, 10])
{{< /output >}}

Use the `insert` method to add a new element to a specific position within an array. This method takes an index to indicate where the new element should be placed. Here you can see `7` added as a new element with an index of `3` to the `example_array`:

``` python
example_array.insert(3, 7)

print(example_array)
```

{{< output >}}
array('i', [2, 4, 6, 7, 8, 10])
{{< /output >}}

#### Remove from Array

Similarly, Python arrays include two methods that you can use for removing elements. Which one you use depends on whether you want to remove based on a given value or a given index.

The `remove` method takes a value and removes the element with that value from the array. In this example, the element `7` that was added to the array above gets removed:

``` python
example_array.remove(7)

print(example_array)
```

{{< output >}}
array('i', [2, 4, 6, 8, 10])
{{< /output >}}

The `pop` method, on the other hand, can be used to remove elements based on index. This next example uses the `-1` index to remove the last element in the array, which was one of the elements added in the section above:

``` python
example_array.pop(-1)

print(example_array)
```

{{< output >}}
10
array('i', [2, 4, 6, 8])
{{< /output >}}

As you can see from the output above, this method actually does more than just remove the element — it returns its value back to you. That distinct feature of this method can be quite useful sometimes.

### Combining Arrays

Python arrays can be easily combined, or concatenated, using the `+` operator. There are other ways to go about combining arrays — using a loop, for instance. But the `+` operator provides the most convenient method if you goal is simply to join two or more arrays.

Here, the `example_array` worked on in the sections above gets combined with a new array, `another_array`:

``` python
another_array = array("i", [20, 40, 60, 80])
combined_array = example_array + another_array

print(combined_array)
```

{{< output >}}
array('i', [2, 4, 6, 8, 20, 40, 60, 80])
{{< /output >}}

## Conclusion

This guide has covered everything you need to get started using Python arrays. From what they are to what separates them from Python lists, from navigating arrays to adding and removing elements and combining arrays. You can apply what you have learned here to make effective use of arrays in your Python code.

Be sure to check out the links provided above to our related guides, which include coverage of lists and slices. Reading those guides alongside this one gives you a strong foundation to work effectively with Python's index notation.

Have more questions or want some help getting started? Feel free to reach out to our [Support](https://www.linode.com/support/) team.
