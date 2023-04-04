---
slug: python-stacks
description: "Ever wondered what the stack data structure does? Curious about how you could use it in Python? Learn all about stacks in Python in this tutorial. It covers what stacks are and how they work, as well as Python stack implementations you can start using."
keywords: ['python stack', 'stack python syntax', 'stack in python']
tags: ['python']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2023-04-04
modified_by:
  name: Nathaniel Stickman
title: "Stack in Python: A Practical Guide to Getting Started"
external_resources:
- '[Python Documentation: More on Lists](https://docs.python.org/3/tutorial/datastructures.html#more-on-lists)'
- '[GeeksforGeeks: Stack in Python](https://www.geeksforgeeks.org/stack-in-python/)'
- '[Real Python: How to Implement a Python Stack](https://realpython.com/how-to-implement-python-stack/)'
- '[Programiz: Stack Data Structure](https://www.programiz.com/dsa/stack)'
- '[Tutorials Point: Python Stack](https://www.tutorialspoint.com/python_data_structure/python_stack.htm)'
authors: ["Nathaniel Stickman"]
---

Stacks are convenient data structures, collecting items in a last-in-first-out order like you see with many activity histories. But you may be wondering how exactly stacks work. Or you may be curious how you can start implementing a stack in Python.

In this guide, you learn about what makes a stack data structure and how stack are implemented in Python.

## What Is a Stack Data Structure?

The stack data structure consists of a linear collection. The main distinguishing feature of a stack, however, is how data is stored and removed. Stacks use a Last-In-First-Out (LIFO) approach, where items are "popped" (retrieved and simultaneously removed) from newest to oldest.

An easy way to think about the stack data structure is through the undo list in a text editor. Typing in an editor adds a new action to a stack. When you then choose the "undo" action, the last item added to that stack gets removed from the stack. The action that item represents is then undone.

The diagram below illustrates this premise in action, using a character-by-character undo stack. The example shows two possible actions, each applying one of the core stack operations. Continuing to type "example" *pushes* a new item to the end of the stack. Taking the undo action, instead, *pops* the latest item off of the stack for processing by an undo function.

![Example of a character-by-character undo stack](stack-structure-example.png)

### Stack Operations

In the example above, you can see the two main stack operations: push and pop. These essentially mean "add" and "remove," respectively. However, the specific terms hint that there is more to these actions than just adding and removing.

- The *push* operation involves adding a new item to a stack. Push places the item at the end of the stack. This is important for stacks to work effectively, as newer items need to be consistently removed first, before older items.

- The *pop* operation removes an item from the end of the stack. At the same time, importantly, pop returns the item removed. This lets you perform some operations with each item as it gets removed.

It's worth reiterating that the pop operation is important for most stack implementations. The fact that pop returns the removed item means you can immediately start working with it. In the case of the undo stack example above, pop removes the "Type 'l'" item from the stack. But pop also returns that item so that the undo function can perform some operations with it.

## How to Implement a Stack in Python

The section above covers what the stack data structure is in general. But what does a stack look like in Python? What is the syntax for stacks in Python?

There are several ways of implementing the stack data structure in Python. Each of these next three sections show you a different to do this, each using a different Python module. Along the way, you can also see what sets each method apart, to help you decide between them.

Each of these sections includes code with examples. These code blocks are divided into three essential operations for working with stacks:

- Creating the initial stack

- Push, adding elements to the end of the stack

- Pop, removing and returning elements from the end of the stack

### Using a `list` to Create a Python Stack

The simplest Python stack implementation uses the built-in *list* type. Its simplicity comes from the fact that it is built in and frequently used. In the example below, instead of the `push()` function, you use the `append` function to add new items at the end of the stack. The `pop` function removes the elements from the end of the stack in LIFO. If you have worked with Python much, you have likely used lists before.

```command
# Creating a stack as a blank list.
example_stack = []

# Pushing elements to the stack using the append method.
example_stack.append("First Item")
example_stack.append("Second Item")
example_stack.append("Third Item")

# Poping an element from the stack using the pop method.
popped_item = example_stack.pop()

# Displaying the results
print("The stack now contains: " + ", ".join(example_stack) + ".")
print("The popped item is: " + popped_item + ".")
```

```output
The stack now contains: First Item, Second Item.
The popped item is: Third Item.
```

Using the list type for Python stacks has two drawbacks:

- The Python list was not designed for working as a stack, and it does not store items and retrieve items efficiently. This can make stack operations slower than expected sometimes.

- Python includes numerous methods for lists which, if used, would undermine your stacks' proper functioning. Take the `insert` method. It allows you to add an item to a list at a specific index. Using this method on a list operating as a stack could cause significant problems.

That said, lists can still support Python stacks well for most needs.

### Using `collections.deque` to Create a Python Stack

Python installations come with a `collections` module by default. This module includes `deque`, which is an excellent tool for creating and managing stacks in Python. `deque` is pronounced as "deck" and stands for "double-ended queue". As demonstrated in the list example above, you can use the same `append` and `pop` functions on deque.

```command
# Importing deque.
from collections import deque

# Creating a blank stack using deque.
example_stack = deque()

# Pushing elements to the stack using the append method.
example_stack.append("First Item")
example_stack.append("Second Item")
example_stack.append("Third Item")

# Poping an element from the stack using the pop method.
popped_item = example_stack.pop()

# Displaying the results
print("The stack now contains: " + ", ".join(example_stack) + ".")
print("The popped item is: " + popped_item + ".")
```

```output
The stack now contains: First Item, Second Item.
The popped item is: Third Item.
```

This example only differs from the list example in the first two lines — the requirement to import `deque` and the use of the `deque` function to initiate the stack.

The `deque` implementation is meant to specifically work with the stack data structure. `deque` stores items more consistently when performing for stack operations. It also avoids index-related list methods, which can disturb how a stack functions. That is especially nice to have in a team environment, where hard restrictions can help ensure consistent usage across developers.

### Using `queue.LifoQueue` to Create a Python Stack

Another module that comes with Python installations is a `queue`, which includes `LifoQueue` for thread-safe stacks. The use of the `LifoQueue` follows the same structure as seen with the `deque` above. However, note that `LifoQueue` uses `put` instead of `append` and `get` instead of `pop`.

```command
# Importing LifoQue.
from queue import LifoQueue

# Creating a blank stack using LifoQueue.
example_stack = LifoQueue()

# Pushing elements to the stack using the put method.
example_stack.put("First Item")
example_stack.put("Second Item")
example_stack.put("Third Item")

# Poping an element from the stack using the pop method.
popped_item = example_stack.get()

# Displaying the results
print("The stack now contains: " + ", ".join(example_stack.queue) + ".")
print("The popped item is: " + popped_item + ".")
```


```output
The stack now contains: First Item, Second Item.
The popped item is: Third Item.
```

The main reason to use `LifoQueue` is its thread safety. Lists are not thread-safe, and while the `append` and `pop` methods for `deque` may be, `deque` as a whole is not. So, if you need to implement a stack in a multi-threaded environment, you should opt to go with `LifoQueue` over the other two options.

## Conclusion

You now have what you need to get started with stacks in Python. This guide has covered what stacks are and Python stack implementations using lists , `deque` for better performance, and using `LifoQueue` for multi-threaded environments.