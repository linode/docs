---
slug: using-pyton-lists
author:
  name: Linode Community
  email: docs@linode.com
description: "Learn about Python lists, including how to add/append, remove, convert to string, and sort and reverse."
og_description: "Learn about Python lists, including how to add/append, remove, convert to string, and sort and reverse."
keywords: ['python list','python list append','python list sort']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-07-26
modified_by:
  name: Nathaniel Stickman
title: "Python Lists and How to Use Them"
h1_title: "Python Lists and How to Use Them"
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
external_resources:
- '[Python 3 Documentation: List Comprehensions](https://docs.python.org/3/tutorial/datastructures.html#list-comprehensions)'
- '[Stack Overflow: Understanding Slice Notation](https://stackoverflow.com/a/509295)'
- "[O'Reilly: How Do I Use the Slice Notation in Python?](https://www.oreilly.com/content/how-do-i-use-the-slice-notation-in-python/)"
---

Python comes with numerous tools that make it easy to work with lists. In this guide, find out what the most useful of those tools are and how to use them. They include everything from methods to add and remove items, operations to convert lists to strings, ways to sort and reverse, and more.

## Before You Begin

1. Familiarize yourself with our [Getting Started with Linode](/docs/getting-started/) guide, and complete the steps for setting your Linode's hostname and timezone.

1. This guide uses Python 3 syntax. Although there is some overlap, some of the code may not work with Python 2. To install Python 3, follow our [How to Install Python 3](/docs/guides/how-to-install-python-on-debian-10/) guide, using the **Distribution** drop down to select your Linux distribution.

1. All commands in this guide can be entered either in a Python script or in the Python interpreter (also known as the Python Interactive Shell). You can learn more about either method through the Python 3 installation guide linked above.

## How to Create a List in Python

Creating a list in Python is as easy as wrapping one or more comma-separated items in square brackets. Here is an example:

    example_list = ["item_1", "item_2", "item_3"]

You can see the results with:

    print(example_list)

{{< output >}}
['item_1', 'item_2', 'item_3']
{{< /output >}}

The items in a list can be integers, strings, or any kind of other object — even other lists. You can also mix and match different types within the same list.

### List Comprehensions

Python has **list comprehensions** that give you a succinct but advanced way of creating new lists from existing lists. A list comprehension creates a new list by applying a set of conditions and/or operations on each item in an existing list.

For example, the code below uses a list comprehension on the range of numbers between 0 and 9 (inclusive). (The `range` function returns a list.) It only selects even numbers in that range (`x % 2 == 0`) and multiplies each matching number by two (`x * 2`):

    example_list_comprehension = [(x * 2) for x in range(10) if x % 2 == 0]

    print(example_list_comprehension)

{{< output >}}
[0, 2, 4, 6, 8]
{{< /output >}}

List comprehensions can be useful for their succinct syntax. They let you quickly rework a list from complicated criteria, and do so on a single line.

## How to Add or Append to a List in Python

Lists in Python come with an `append` method that allows you to easily append an item to the end of an existing list. Using the `example_list` created in the section above:

    example_list.append("item_4")

    print(example_list)

{{< output >}}
['item_1', 'item_2', 'item_3', 'item_4']
{{< /output >}}

Python lists also come with an `insert` method. This method lets you add an item to a specific index position in the list. In the following example, an item is added to the beginning of our list, shoving the rest of the items to the right:

    example_list.insert(0, "item_0")

    print(example_list)

{{< output >}}
['item_0', 'item_1', 'item_2', 'item_3', 'item_4']
{{< /output >}}

Finally, you can also concatenate lists using the `+` operator. This operator is especially useful because it returns the resulting list, rather than modifying the list in place:

    new_example_list = example_list + ["item_5", "item_6", "item_7"]

    print(example_list)
    print(new_example_list)

{{< output >}}
['item_0', 'item_1', 'item_2', 'item_3', 'item_4']
['item_0', 'item_1', 'item_2', 'item_3', 'item_4', 'item_5', 'item_6', 'item_7']
{{< /output >}}

You can even use this operator to add an individual item to a list so long as that item is presented as a list:

    example_list = new_example_list + ["item_8"]

    print(example_list)

{{< output >}}
['item_0', 'item_1', 'item_2', 'item_3', 'item_4', 'item_5', 'item_6', 'item_7', 'item_8']
{{< /output >}}

## How to Remove an Item from a List in Python

Like with the `append` method, Python lists include a `remove` method for removing an item from a list. The method takes the contents of the item to be deleted as an argument:

    example_list.remove("item_0")

{{< output >}}
['item_1', 'item_2', 'item_3', 'item_4', 'item_5', 'item_6', 'item_7', 'item_8']
{{< /output >}}

Alternatively, you can use the `pop` method on a list to delete an item based on its index. Here, the item at index **3** (`item_4`) is removed:

    example_list.pop(3)

{{< output >}}
['item_1', 'item_2', 'item_3', 'item_5', 'item_6', 'item_7', 'item_8']
{{< /output >}}

One potentially useful feature of the `pop` method is that it returns the item it deletes:

    pop_output = example_list.pop(6)

    print(pop_output)
    print(example_list)

{{< output >}}
'item_8'
['item_1', 'item_2', 'item_3', 'item_5', 'item_6', 'item_7']
{{< /output >}}

Finally, Python has one other option for removing an item from a list, `del`. This option identifies the item or items to be deleted by using Python's *slice* notation. In the example below, the items from index **3** to the end of the list are deleted:

    del example_list[3:]

    print(example_list)

{{< output >}}
['item_1', 'item_2', 'item_3']
{{< /output >}}

You can learn more about Python's slice notation and how to use it in the [Reversing a List](/docs/guides/using-pyton-lists/#reversing-a-list) section below and in the links provided at the end of this guide.

## How to Sort a List in Python

### Sorting a List

Python lists include a `sort` method dedicated to sorting the content of lists in place. Here, a list of fruits is sorted alphabetically, in ascending order (the default):

    example_fruit_list = ["strawberry", "apricot", "cranberry", "banana"]
    example_fruit_list.sort()

    print(example_fruit_list)

{{< output >}}
['apricot', 'banana', 'cranberry', 'strawberry']
{{< /output >}}

The `sort` method has two optional arguments. First, a `key` argument allows you to reference a function to use in sorting the list. Second, a `reverse` option which, if set to `True`, allows you to sort the list in descending order.

In this next example, a `length_sort` function is defined to return the length of an item. Referencing it in the `key` argument has `sort` order the list by the length of fruit names. Setting `reverse=True` has `sort` use descending order, from longest name to shortest name:

    def length_sort(item):
        return len(item)

    example_fruit_list.sort(key=length_sort, reverse=True)

    print(example_fruit_list)

{{< output >}}
['strawberry', 'cranberry', 'apricot', 'banana']
{{< /output >}}

Python also has a `sorted` function. The function takes an iterable (like a list) and returns a sorted list. It even includes the same optional arguments as the `sort` method (`key` and `reverse`). This function is useful when you want to create a new list from the sort, rather than sorting a list in place:

        new_example_fruit_list = sorted(example_fruit_list, key=length_sort)

        print(example_fruit_list)
        print(new_example_fruit_list)

{{< output >}}
['strawberry', 'cranberry', 'apricot', 'banana']
['banana', 'apricot', 'cranberry', 'strawberry']
{{< /output >}}

Both `sort` and `sorted` can work on lists containing either numbers or strings. However, neither works on lists containing a mixture of numbers and strings:

    sorted([198, "strawberry", 46.8, "apricot"])

{{< output >}}
TypeError: '<' not supported between instances of 'int' and 'str'
{{< /output >}}

### Reversing a List

Reversing a list in Python is made easy using its *slice* notation. Here is an example, creating a list, creating a reversed version of it, and printing the two lists side by side:

    example_list = ["item_1", "item_2", "item_3", "item_4]

    reversed_example_list = example_list[::-1]

    print(example_list)
    print(reversed_example_list)

{{< output >}}
['item_1', 'item_2', 'item_3', 'item_4']
['item_4', 'item_3', 'item_2', 'item_1']
{{< /output >}}

Python's slice notation allows you to select a sub-list or a reordered version of a list. It follows the format `[start:stop:step]`.

The `start` portion defines what index to begin with, the `stop` portion what index to end with. Leaving these portions empty defaults to the beginning and ending of the list, respectively. The optional `step` portion defines how many items to step at a time. It defaults to `1`, meaning each item is captured, whereas `2` would capture every other item.

Each portion can take a negative number. For `start` and `stop`, negative numbers identify items starting from the end of the list, `-1` being the last item, `-2` the next to last, etc. For `step`, negative numbers mean stepping backward through the list, from the end to the beginning.

So, in the example above, the slice notation — `[::-1]` — returns the whole list but steps through it in reverse. This results in a reversed version of the list.

## Converting a Python List to a String

Several approaches are available in Python for converting a list to a string. However, the `join` method is probably the most versatile and convenient.

The `join` method is invoked on a string and takes a list as an argument. The string becomes the separator for each item in the list as these items are concatenated into a new string:

    example_list = ["This", "string", "was", "a", "list"]
    example_string_from_list = " ".join(example_list)

    print(example_string_from_list)

{{< output >}}
This string was a list
{{< /output >}}

If you list contains numbers rather than strings, you need to convert them first. You can do this in the same line using a simple list comprehension:

    example_list = [1, 2, 3, 4, 5]
    example_string_from_list = " ".join([str(x) for x in example_list])

    print(example_string_from_list)

{{< output >}}
1 2 3 4 5
{{< /output >}}

## How to Find an Item in a List in Python

You have a few options at your disposal for searching a list in Python.

For starters, you can use the `in` syntax if you just want Python to tell you whether a certain value — `3` in the example below — is in a list:

    example_list = [1, 2, 3, 4, 1, 2, 3, 4]

    print(3 in example_list)

{{< output >}}
True
{{< /output >}}

If you want to know the index of a particular value in a list, use the list's `index` method. It takes the desired value as an argument and returns its index in the list, or an error if it cannot find the value. Note that this method only returns the first index it finds with the matching value:

    print(example_list.index(2))

{{< output >}}
1
{{< /output >}}

If you want the indices for all matching items in a list, you can use a list comprehension like this:

    print([key for key, value in enumerate(example_list) if value == 2])

{{< output >}}
[1, 5]
{{< /output >}}

The operations above all work no matter what type the value has — integer, string, another list, etc. However, these options only work for exact matches:

    example_fruit_list = ["strawberry", "apricot", "cranberry", "banana"]

    print("straw" in example_fruit_list)
    print("strawberry" in example_fruit_list)

{{< output >}}
False
True
{{< /output >}}

To find partial string matches, you can use another list comprehension. This one iterates through the list and returns the indices of strings containing the desired substring — `straw` in this example:

    matching_items = [key for key, value in enumerate(example_fruit_list) if value.find("straw") != -1]

    print(matching_items)

    for item in matching_items:
        print(example_fruit_list[item])

{{< output >}}
[0]
strawberry
{{< /output >}}
