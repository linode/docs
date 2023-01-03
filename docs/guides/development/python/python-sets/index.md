---
slug: python-sets
author:
  name: Linode Community
  email: docs@linode.com
description: "Sets in Python provide convenient unordered collections of unique data, and they are capable of applying mathematical set operations. This guide explains what sets are and gets you started using them."
keywords: ['python sets', 'python sets intersection', 'python sets operations']
tags: ['python']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-04-20
modified_by:
  name: Nathaniel Stickman
title: "Getting Started with Python Sets"
h1_title: "Introduction to Python Sets"
enable_h1: true
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
external_resources:
- '[Python Documentation: Built-in Types — Set Types](https://docs.python.org/3/library/stdtypes.html#set-types-set-frozenset)'
- '[W3 Schools: Python Sets](https://www.w3schools.com/python/python_sets.asp)'
- '[Toward Data Science: 10 Things You Should Know About Sets in Python](https://towardsdatascience.com/10-things-you-should-know-about-sets-in-python-9902828c0e80)'
- '[Programniz: Python Sets](https://www.programiz.com/python-programming/set)'
- '[GeeksforGeeks: Sets in Python](https://www.geeksforgeeks.org/sets-in-python/)'
---

Python's sets provide unordered collections modeled on mathematical sets, complete with mathematical sets' logical operations. Among the Python collection data types, sets stand out with unique features that make them especially useful in many contexts.

This guide gets you set up with everything you need to start using Python sets. It elaborates on what Python sets are, how to create them, how to modify them, and how to use their mathematical operations.

## What Are Sets in Python?

In Python, a set is an unordered collection of unique elements. Sets are also by nature highly efficient at checking for specific values. Additionally, they can perform mathematical set operations like union, intersection, and difference.

A Python set consists of a comma-separated list of unique values wrapped in curly braces as shown below:

    {2, 4, 6, 8}

Each element in a set must be not only unique within the set. It must also be of an immutable type. Integers and strings, for instance, are considered immutable types — `3` is always `3` and `example` is always `example`. But types like lists, dictionaries, and sets are not, because their contents can change.

## Creating a Python Set

Python provides two ways of creating sets. The first is through the simple variable assignment. Just use the set notation to assign a variable with a set.

``` python
example_set = {2, 4, 6, 8}
```

Alternatively, you can create a set from a list by using the `set` function. This function takes a list as input and returns a set.

``` python
example_set = set([2, 4, 6, 8])
```

The `set` function can be useful in particular scenarios. Lists have some convenient properties and operations in Python, and this function lets you leverage those to make sets.

## Python Set Operations

The operations for Python sets differ from those available for lists and arrays. Those differences mainly relate to sets' being unordered, meaning elements cannot be accessed by indices and sets' use of mathematical set operations.

If you are curious, you can learn more about lists in our [Python Lists and How to Use Them](/docs/guides/python-lists-and-how-to-use-them/) guide. And you can learn more about arrays in our **Python Arrays: What They Are and How to Use Them** guide.

These next sections introduce you to the most useful Python set operations. They include all of the Python set functions that you need to be able to start using sets effectively in your Python code.

### Fetch From a Set

Python sets are unordered, so elements cannot be accessed based on their indices. Instead, elements can be accessed using the `pop` method. This method returns an arbitrary value from the set while, at the same time, removing that value from the set.

``` python
example_set = {"a", 2, "c", 4, "b", 6}

example_set.pop()
print(example_set)
```

{{< output >}}
2
{'b', 4, 6, 'c', 'a'}
{{< /output >}}

You can check a set for a certain value, however, using Python's `in` operator. Expressions with this operator return `True` if the provided value is found in the set.

``` python
if 4 in example_set:
    print("Match found!")
```

{{< output >}}
Match found!
{{< /output >}}

Like lists and arrays, Python sets can be looped through. Using a `for` loop on a set, for instance, yields each item in the set iteratively, as you can see below:

``` python
for item in example_set:
    print(item)
```

{{< output >}}
4
a
6
c
b
{{< /output >}}

### Modify a Set

Python sets are *mutable*, meaning items can be added to and removed from them as needed. Python provides several methods for accomplishing these modifications, which you can see in the next two sections.

#### Add Elements to a Set

Python has a dedicated method for adding individual elements to a set using the `add` method. The method takes a value as an argument and adds that value to the set as an element.

``` python
example_set = {"this", "is", "a"}

example_set.add("set")

print(example_set)
```

{{< output >}}
{'a', 'this', 'is', 'set'}
{{< /output >}}

But if you instead need to add multiple values to a set, and want to add them all at the same time, use the `update` method. This method takes a list of values as an argument and adds any values from the list that are not already in the set.

``` python
example_set = {1, 3, 5, 7}

example_set.update([1, 2, 3, 4])

print(example_set)
```

{{< output >}}
{1, 2, 3, 4, 5, 7}
{{< /output >}}

Two features make `update` method especially noteworthy. First, as you can see above, it only adds unique values to the set, regardless of the method's input. This can conveniently save you from having to check the set's contents before trying to add values to the set. Second, it takes a list, which can be helpful because of all the tools Python has for dealing with lists.

#### Remove Elements From a Set

Above, you saw one method for removing an element from a set using the `pop` method. But that method removes and returns an arbitrary element. It does not let you remove a specific element based on its value.

Fortunately, Python sets have two methods for removing specific values.

Using the `remove` method, you can remove specific elements from a set. The method's argument is the value of the element to be removed.

``` python
example_set = {1, 3, 5, 7}

example_set.remove(3)

print(example_set)
```

{{< output >}}
{1, 5, 7}
{{< /output >}}

You can use the `discard` method similarly. This method differs from `remove` in that it does not give you an error if the value provided is not in the set.

``` python
example_set = {1, 3, 5, 7}

# This gives an error, since the value `2` is not in the set.
example_set.remove(2)

# This does not give an error, even though the value is not in the set.
example_set.discard(2)

example_set.discard(1)

print(example_set)
```

{{< output >}}
{3, 5, 7}
{{< /output >}}

### Combine Sets

One of the benefits of Python sets is their ability to use mathematical set operations like union, intersection, and difference. These logical operations are powerful tools for working with mathematical sets. Having them available for Python sets makes the set data type even more helpful.

These next sections cover each of the logical operations available for Python sets. These operations can be implemented using either a method call or an operator, both of which are shown below.

The examples that follow use two sets, which you can create using the following Python code. These sets consist of, first, a list of four mammals and, second, a list of four insectivores (animals that eat insects).

``` python
mammal_set = {"wolves", "giraffes", "anteaters", "armadillos"}
insectivore_set = {"frogs", "lizards", "anteaters", "armadillos"}
```

#### Union

A *union* includes all of the contents of two sets, overlapping and non-overlapping. You can see this in the below Venn diagram:

![Venn diagram of set union](python-sets-venn-union.png)

In this case, the new union set would include everything from both of the original sets. The union for the example sets has both mammals and insectivores.

``` python
# Using the union operator, |.
mammals_and_insectivores_set = (mammal_set | insectivore_set)


# Using the union method.
mammals_and_insectivores_set = mammal_set.union(insectivore_set)

print(mammals_and_insectivores_set)
```

{{< output >}}
{'lizards', 'anteaters', 'giraffes', 'wolves', 'frogs', 'armadillos'}
{{< /output >}}

#### Intersection

An *intersection* includes only the elements shared between two sets, the elements that overlap between two sets.

![Venn diagram of set intersection](python-sets-venn-intersection.png)

This gives a new intersection set with only the elements held in common between the original two sets. For the two example sets, this results in a set of mammals that are insectivores. It excludes mammals that do not eat insects and non-mammals that do.

``` python
# Using the intersection operator, &.
insectivore_mammals_set = (mammal_set & insectivore_set)

# Using the intersection method.
insectivore_mammals_set = mammal_set.intersection(insectivore_set)

print(insectivore_mammals_set)
```

{{< output >}}
{'armadillos', 'anteaters'}
{{< /output >}}

#### Difference

A *difference* includes all elements that are in one set but not in another. It excludes the overlap.

The difference operation relies on excluding one set from another, so there are two possibilities when you are working with two sets.

![Venn diagram of set difference for `mammal_set`](python-sets-venn-difference-1.png)

![Venn diagram of set difference for `insectivore_set`](python-sets-venn-difference-2.png)

As you see, you can have either a set of mammals that are not insectivores or a set of insectivores that are not mammals.

``` python
# Using the difference operator, -, to get mammals that are not insectivores.
mammals_not_insectivores_set = mammal_set - insectivore_set

# Using the difference method to get insectivores that are not mammals.
insectivores_not_mammals_set = insectivore_set.difference(mammal_set)

print(mammals_not_insectivores_set)
print(insectivores_not_mammals_set)
```

{{< output >}}
{'giraffes', 'wolves'}
{'lizards', 'frogs'}
{{< /output >}}

#### Symmetric Difference

A *symmetric difference* includes all elements that are not shared in common between two sets. In other words, a symmetric difference is everything in the sets except for the overlap.

![Venn diagram of set symmetric difference](python-sets-venn-symmetric-difference.png)

For example, this gets you a set that contains both non-insectivore mammals and non-mammalian insectivores. You can think of it as the combination of both differences, or as the opposite of the intersection.

``` python
# Using the symmetric difference operator, ^.
symmetric_difference_set = mammal_set ^ insectivore_set

# Using the symmetric_difference method.
symmetric_difference_set = mammal_set.symmetric_difference(insectivore_set)

print(symmetric_difference_set)
```

{{< output >}}
{'lizards', 'giraffes', 'frogs', 'wolves'}
{{< /output >}}

### Checking Set Relationships

Another way that Python sets resemble mathematical sets is through the comparative operations subset, superset, and disjoint. Each of these operations allows you to check on the relationship between two sets.

- A *subset* is a set in which all of the elements can be found in another set. In this example, `set_A` is a subset of `set_B`. You can verify this using the `issubset` method on `set_A`.

``` python
set_A = {"a", "b", "c"}
set_B = {"a", "b", "c", "d", "e", "f", "g"}

set_A.issubset(set_B)
```

{{< output >}}
True
{{< /output >}}

- A *superset* is a set that contains all of the elements of another set. In other words, it is the inverse of a subset. In the example above, `set_B` is a superset of `set_A`. This is the case as well in the example that follows, verified using the `issuperset` method on `set_B`.

``` python
set_A = {1, 2, 3, 4}
set_B = {1, 2, 3, 4, 5, 6, 7, 8, 9, 0}

set_B.issuperset(set_A)
```

{{< output >}}
True
{{< /output >}}

- A *disjoint* occurs when two sets share no elements in common. You can verify whether this is the case using the `isdisjoint` method, which you can use on either set.

``` python
set_A = {"a", "b", "c", "d"}
set_B = {1, 2, 3, 4}

set_A.isdisjoint(set_B)
```

{{< output >}}
True
{{< /output >}}

## Conclusion

With this, you have what you need to get started with Python sets. This guide covers everything you need to begin effectively using sets, from fetching and modifying their contents to using mathematical set operations on them.

Have more questions or want some help getting started? Feel free to reach out to our [Support](https://www.linode.com/support/) team.
