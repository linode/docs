---
slug: python-lists-and-how-to-use-them
description: "This guide shows you how to use the Lists feature in Python to append and remove items from a list, and then convert those list items into a sortable string."
keywords: ['python list','python list append','python list sort']
tags: ['python']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-08-20
modified_by:
  name: Nathaniel Stickman
title: "Python Lists and How to Use Their Built-In Methods"
title_meta: "Python Lists and How to Use Them"
external_resources:
- '[Python 3 Documentation: List Comprehensions](https://docs.python.org/3/tutorial/datastructures.html#list-comprehensions)'
- "[O'Reilly: How Do I Use the Slice Notation in Python?](https://www.oreilly.com/content/how-do-i-use-the-slice-notation-in-python/)"
authors: ["Nathaniel Stickman"]
---

Python includes many built-in methods and operations that help you manipulate lists. This guide shows you how to use the `append()`, `insert()`, and `remove()` built-in list methods. You also learn how to write a list comprehensions, and how to sort lists.

## Before You Begin

1. This guide uses Python 3 syntax. Although there is some overlap, some of the code may not work with Python 2. To install Python 3, follow our [How to Install Python 3](/docs/guides/how-to-install-python-on-debian-10/) guide, using the **Distribution** drop down to select your Linux distribution.

1. All commands in this guide can be entered either in a **Python script** or in the **Python interpreter** (also known as the Python Interactive Shell). You can learn more about either method through the Python 3 installation guide linked above.

## How to Create a List in Python

To create a list in Python wrap one or more comma-separated items in square brackets. Create a Python list as shown in the following example:

    example_list = ["item_1", "item_2", "item_3"]

To view the contents of the list, issue the following command:

    print(example_list)

{{< output >}}
['item_1', 'item_2', 'item_3']
{{< /output >}}

The items in a list can be integers, strings, or any kind of other objects — even other lists. You can also mix and match different types within the same list.

### List Comprehensions

Python **list comprehensions** give you a succinct but advanced way of creating new lists from existing lists. A list comprehension creates a new list by applying a set of conditions and/or operations on each item in an existing list.

For example, the code below uses a list comprehension on the range of numbers between zero and nine (inclusive). The `range` function's return value is a list. The list comprehension selects all even numbers (`x % 2 == 0`) in the range and multiplies each matching number by two (`x * 2`).

In your Python interpreter run the following code to create the example list comprehension:

    example_list = [(x * 2) for x in range(10) if x % 2 == 0]

Print the contents of `example_list` to view the result:

    print(example_list)

{{< output >}}
[0, 4, 8, 12, 16]
{{< /output >}}

A list comprehension's succinct syntax is convenient when writing code. It lets you quickly rework a list from complicated criteria, and do so using a single line of code.

## How to Add or Append to a List in Python

Lists in Python have a built-in `append()` method that allows you to append an item to the end of an existing list. Using the `example_list` created in the section above, issue the following command to add the string `item_4` to the end of the list.

    example_list.append("item_4")

Print the contents of the list to view the appended item:

    print(example_list)

{{< output >}}
[0, 4, 8, 12, 16, 'item_4']
{{< /output >}}

Python lists have a built-in `insert()` method. This method lets you add an item to a specific index position in a list. In the following example, an item is added to the beginning of the `example_list` list. The rest of the list items are moved one position to the right.

    example_list.insert(0, "item_0")

Print the contents of the list to view the inserted item:

    print(example_list)

{{< output >}}
['item_0', 0, 4, 8, 12, 16, 'item_4']
{{< /output >}}

Finally, you can also concatenate lists using the `+` operator. This allows you to create a new list, rather than modifying the existing list. Create a new list named `new_example_list` with the contents of `example_list`:

    new_example_list = example_list + ["item_5", "item_6", "item_7"]

Print the contents of `example_list` and `new_example_list`:
    print(example_list)
    print(new_example_list)

{{< output >}}
['item_0', 0, 4, 8, 12, 16, 'item_4']
['item_0', 0, 4, 8, 12, 16, 'item_4', 'item_5', 'item_6', 'item_7']
{{< /output >}}

You can also use the `+` operator to add an individual item to a list, as long as that item is presented as a list.

      example_list = new_example_list + ["item_8"]

View the contents of `example_list`:

      print(example_list)

{{< output >}}
['item_0', 0, 4, 8, 12, 16, 'item_4', 'item_5', 'item_6', 'item_7', 'item_8']
{{< /output >}}

## How to Remove an Item from a List in Python

Like with the `append()` method, Python lists include a `remove()` method that removes an item from a list. The method takes the contents of the item to be deleted as an argument. For example, remove `item_0` from `example_list`:

    example_list.remove("item_0")

View the contents of `example_list`:

    print(example_list)

{{< output >}}
[0, 4, 8, 12, 16, 'item_4', 'item_5', 'item_6', 'item_7', 'item_8']
{{< /output >}}

Alternatively, you can use the `pop()` method on a list to delete an item based on its index. In the example below, the item at index **3** (`12`) is removed.

    example_list.pop(3)

Print the contents of `example_list`:

    print(example_list)

{{< output >}}
[0, 4, 8, 16, 'item_4', 'item_5', 'item_6', 'item_7', 'item_8']
{{< /output >}}

One useful feature of the `pop()` method is that it returns the item it deletes. This means you can assign the deleted value to a variable. For example, remove the item at index **6** and assign it to the variable `pop_output`:

    pop_output = example_list.pop(6)

Print the values of `pop_output` and `example_list`:

    print(pop_output)
    print(example_list)

{{< output >}}
'item_6'
[0, 4, 8, 16, 'item_4', 'item_5', 'item_7', 'item_8']
{{< /output >}}

Finally, Python has one other option for removing an item from a list, `del` keyword. This option identifies the item or items to be deleted by using Python's *slice* notation. In the example below, the items from index **3** to the end of the list are deleted.

    del example_list[3:]

Print the remaining items in `example_list`:

    print(example_list)

{{< output >}}
[0, 4, 8]
{{< /output >}}

You can learn more about Python's slice notation in the [Reverse a List](/docs/guides/python-lists-and-how-to-use-them/#reverse-a-list) section below. The links provided at the end of this guide also provide more information.

## How to Sort a List in Python

### Sort a List

Python lists include a `sort()` method dedicated to sorting the content of lists in place. In the example below, a list of fruits is sorted alphabetically, in ascending order (default):

    example_fruit_list = ["strawberry", "apricot", "cranberry", "banana"]
    example_fruit_list.sort()

Print the contents of `example_fruit_list`:

    print(example_fruit_list)

{{< output >}}
['apricot', 'banana', 'cranberry', 'strawberry']
{{< /output >}}

The `sort` method has two optional arguments. First, a `key` argument allows you to reference a function to use when sorting the list. Second, a `reverse` option which, if set to `True`, allows you to sort the list in descending order.

In this next example, a `length_sort()` function is defined to return the length of an item. Referencing the `length_sort()` function as the `key` argument causes `sort()` to order the list by the length of fruit names. Setting `reverse=True` has `sort()` use a descending order, from longest name to shortest name.

Create the `length_sort()` function:

    def length_sort(item):
        return len(item)

Sort `example_fruit_list` using `length_sort()` as the key:

    example_fruit_list.sort(key=length_sort, reverse=True)

Print the newly sorted contents of `example_fruit_list`:

    print(example_fruit_list)

{{< output >}}
['strawberry', 'cranberry', 'apricot', 'banana']
{{< /output >}}

Python also has a `sorted()` function. The function takes an iterable (like a list) and returns a sorted list. It even includes the same optional arguments as the `sort()` method (`key` and `reverse`). This function is useful when you want to create a new list from the sort, rather than sorting a list in place. The example below, creates a new list named `new_example_fruit_list` that is sorted in the same way as the previous example:

        new_example_fruit_list = sorted(example_fruit_list, key=length_sort)

Print the contents of both lists:

        print(example_fruit_list)
        print(new_example_fruit_list)

{{< output >}}
['strawberry', 'cranberry', 'apricot', 'banana']
['banana', 'apricot', 'cranberry', 'strawberry']
{{< /output >}}

Both `sort` and `sorted` can work on lists containing either numbers or strings. However, neither works on lists containing a mixture of numbers and strings.

    sorted([198, "strawberry", 46.8, "apricot"])

{{< output >}}
TypeError: '<' not supported between instances of 'int' and 'str'
{{< /output >}}

### Reverse a List

Reversing a list in Python can be achieved by using *slice* notation. The example below, creates a list, then creates a new version of the list in reversed order:

    example_list = ["item_1", "item_2", "item_3", "item_4]

    reversed_example_list = example_list[::-1]

Print the two lists to view their difference in order:

    print(example_list)
    print(reversed_example_list)

{{< output >}}
['item_1', 'item_2', 'item_3', 'item_4']
['item_4', 'item_3', 'item_2', 'item_1']
{{< /output >}}

Python's slice notation allows you to select a sub-list or a reordered version of a list. It follows the following format: `[start:stop:step]`

The `start` portion defines what index to begin with. The `stop` portion indicates the index to end with. Leaving these values empty defaults to the beginning and ending of the list, respectively. The optional `step` portion defines how many items to step at a time. It defaults to `1`, meaning each item is captured, whereas `2` would capture every other item.

Each portion can take a negative number. For `start` and `stop`, negative numbers identify items starting from the end of the list, `-1` being the last item, `-2` the next to last, etc. For `step`, negative numbers mean stepping backward through the list, from the end to the beginning.

So, in the example above, the slice notation — `[::-1]` — returns the whole list but steps through it in reverse order. This results in a reversed version of the list.

## Convert a Python List to a String

Several approaches are available in Python for converting a list to a string. However, the `join()` method is probably the most versatile and convenient.

The `join()` method is invoked on a string and takes a list as an argument. The string becomes the separator for each item in the list as these items are concatenated into a new string. The example below uses the `join()` method to convert `example_list` into a string:

    example_list = ["This", "string", "was", "a", "list"]
    example_string_from_list = " ".join(example_list)

View the created string stored in the `example_string_from_list` variable:

    print(example_string_from_list)

{{< output >}}
This string was a list
{{< /output >}}

If your list contains numbers rather than strings, you need to first convert the numbers to strings. You can do this in the same line using a simple list comprehension, as shown below:

    example_list = [1, 2, 3, 4, 5]
    example_string_from_list = " ".join([str(x) for x in example_list])

Print the strings stored in the `example_string_from_list` variable:

    print(example_string_from_list)

{{< output >}}
1 2 3 4 5
{{< /output >}}

To learn how to convert a string to a list, see our guide [How to Convert Data Types in Python](/docs/guides/how-to-convert-datatypes-in-python/#converting-strings-to-lists).

## How to Find an Item in a List in Python

You have a few options at your disposal for searching a list in Python.

You can use the `in` syntax if you just want Python to tell you whether a certain value is in a list. The example below prints true if the value `3` is in `example_list`.

    example_list = [1, 2, 3, 4, 1, 2, 3, 4]

    print(3 in example_list)

{{< output >}}
True
{{< /output >}}

If you want to know the index of a particular value in a list, use the list's `index()` method. It takes the desired value as an argument and returns its index in the list, or an error if it cannot find the value. This method only returns the first index it finds with the matching value. For example, to find index for the number `2` in `example_list` use the following code:

    print(example_list.index(2))

{{< output >}}
1
{{< /output >}}

If you want the indices for all matching items in a list, you can use a list comprehension like in the example below:

    print([key for key, value in enumerate(example_list) if value == 2])

{{< output >}}
[1, 5]
{{< /output >}}

All the above operations work no matter what type the value has — integer, string, another list, etc. However, these options only work for exact matches.

    example_fruit_list = ["strawberry", "apricot", "cranberry", "banana"]

    print("straw" in example_fruit_list)
    print("strawberry" in example_fruit_list)

{{< output >}}
False
True
{{< /output >}}

To find partial-string matches, you can use another list comprehension. This one iterates through the list and returns the indices of strings containing the desired substring — `straw` in this example.

    matching_items = [key for key, value in enumerate(example_fruit_list) if value.find("straw") != -1]

    print(matching_items)

    for item in matching_items:
        print(example_fruit_list[item])

{{< output >}}
[0]
strawberry
{{< /output >}}
