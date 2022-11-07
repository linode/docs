---
slug: python-priority-queue
author:
  name: Jeff Novotny
description: 'This guide discusses priority queues and the PriorityQueue class in Python 3. This data structure allows you to sort items in a queue and return them in a desired order.'
keywords: ['python queue','python priority queue','queue in python','get size of priority queue python']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-06-17
modified_by:
  name: Linode
title: "What is the Python Priority Queue?"
h1_title: "The Priority Queue in Python 3"
enable_h1: true
contributor:
  name: Jeff Novotny
external_resources:
- '[Wikipedia page on priority queues](https://en.wikipedia.org/wiki/Priority_queue)'
- '[Big O notation explanation](https://en.wikipedia.org/wiki/Big_O_notation)'
- '[Python queue documentation](https://docs.python.org/3/library/queue.html)'
- '[Python PriorityQueue documentation](https://docs.python.org/3/library/queue.html?highlight=priorityqueue#queue.PriorityQueue)'
- '[Python heapq documentation](https://docs.python.org/3/library/heapq.html#priority-queue-implementation-notes)'
---

In Python, queues are frequently used to process items using a *first in first out* (FIFO) strategy. However, it is often necessary to account for the priority of each item when determining processing order. A queue that retrieves and removes items based on their priority as well as their arrival time is called a [*priority queue*](https://en.wikipedia.org/wiki/Priority_queue). Prioritization can be complicated, but fortunately Python priority queues can be easily and efficiently implemented using a built-in module. This guide introduces the Python priority queue and explains how to implement it in Python 3.

## Queues in Python

### What is a Queue?

A queue is a fundamental [programming data structure](/docs/guides/data-structure/). Data structures are used to organize, manage, and store data. They make programs easier to understand and write, and often faster and more reliable too.

Conceptually, a queue represents data items as an ordered list. Items are removed from the list in the same order they arrived. Queues are a familiar concept in everyday life. Every time a group of people line up for something, they form a queue. For instance, a line of people at a bank or a coffee shop is a queue. The first person to arrive is at the front of the queue. They are the next person to be served. When a new customer arrives, they join the back of the queue.

In computer terms, queues are serviced using *push* and *pop* operations. Items are pushed onto the queue and are popped from the queue when they are due to be processed. The pop operation typically removes the item from the queue. However, it is sometimes possible to *peek* at the entry located at the front of the queue without removing it.

Python supports queues through its extensive libraries. Built-in classes and routines handle all regular processing. You only have to create a queue object and call the methods to add new items and remove the oldest entries. Queues are usually the best choice for activities including scheduling tasks and processing incoming requests.

The following example illustrates how queues operate on actual data.

- To start, items `A`, `B`, `C`, and `D` arrive in the presented order. All four items are added to the queue in the order they arrive.
- At this point, an item is chosen for processing. Item `A` is selected and removed from the queue. It is chosen because it arrived first and is at the front of the queue.
- Next, item `E` arrives. It is added to the back of the queue.
- Two more items are selected and removed. Items `B` and `C` are retrieved because they occupy the first two positions of the queue.
- There are now two items in the queue. Item `D` is at the front and would be the next scheduled item, followed by `E`. The next item to arrive would be added to the end of the queue, following `E`.

Queues can be contrasted with stacks. A stack is also a list-based data structure, but it uses a *last in first out* (LIFO) scheme. The most recent item to arrive is always the next item to be selected. Stacks are less obvious in day-to-day life, but are used whenever efficiency is preferred over strict fairness. For instance, stacks are used to store and retrieve non-perishable supplies. New supplies are placed on top of older orders. When more stock is necessary, the top items are removed first. In programming, most compilers extensively use stacks. They are also the best choice for evaluating mathematical expressions, because of the importance of order of operations.

### What is a Heap?

Queues are efficient in Python because they are implemented as heaps. A heap is a special type of tree-based data structure. Trees are hierarchical data structures containing a parent node, which is called the *root*. The root can have child nodes, and each child node can also have children. This allows trees to grow organically to multiple layers. Heaps are usually implemented as binary trees. In a binary tree, each node cannot have more than two children.

The two types of heaps are *max heaps* and *min heaps*. In a max heap, the value stored in the parent node is greater than the value stored in any of its child nodes. A min heap works in the opposite manner. The parent node contains a smaller value than any of its children. This relationship holds for each node at every level of the heap. This means values get progressively smaller at each lower layer in a max heap, or greater in a min heap.

Heaps are a very efficient method for manipulating ordered data. They are particularly useful for retrieving the item with the highest or lowest value. In general, the algorithms used on a heap have either a constant or a [logarithmic time complexity](https://en.wikipedia.org/wiki/Time_complexity#Logarithmic_time). This is very good because algorithmic growth increases fairly slowly as the size of the data set increases. And, of course, [constant-time algorithms](https://en.wikipedia.org/wiki/Time_complexity#Constant_time) do not increase at all.

{{< note >}}
In computer science, [Big O notation](https://en.wikipedia.org/wiki/Big_O_notation) is used to describe how execution time increases with the size of the data set. Most heap operations have an O(log n) time complexity.
{{< /note >}}

Although heaps are useful for ordering and organizing data, they have a downside. They must be kept balanced. This means extra work is necessary whenever nodes are added or removed. Heaps are more efficient with relatively static data sets, but can still be used when nodes are frequently added and deleted.

### What is Priority Queueing?

A basic FIFO queue is the easiest and simplest queue to use. It is sometimes referred to as a strict queue. In this case, the oldest item must always be removed first with no exceptions. At times, this limitation is too inflexible. However, it is possible to add prioritization to the queue structure. This allows an entry to jump to the front of the queue even though it was not the first to arrive.

A priority queue follows basic queueing principles, but maintains multiple sub-queues for the different priority levels. It pre-sorts the set of entries based on their priorities. The highest-priority entries are always serviced first, even if lower-priority items arrived earlier. In practice, the internal implementation of a priority queue does not usually construct multiple lists. Instead, the priority is used to determine where to insert the new item. This means the front of the queue is always serviced first, but new items do not automatically enter the queue at the back. In fact, it is possible for a very high priority item to be placed at the front of the queue.

Priority queues are useful in many real-life situations. For example, airlines enforce priority queuing when boarding an aircraft. Business class customers form the highest priority queue and are boarded first. One or more regular fare queues are prioritized next, followed by any standby or low fare passengers. If a business customer arrives after regular fare passengers are already boarding, they go to the front of the line. Priority queuing is also used for triage purposes at a hospital or for servicing maintenance requests.

In computing situations, multi-threaded operating systems use priority queues. Higher priority tasks are allocated first before background tasks. For example, mouse clicks take precedence over rendering a web page. In network routers, control traffic and routing updates are handled first before user traffic.

## The Python Priority Queue Class

In Python, it is possible to build your own priority queues using Python lists. However, it is better to use the built-in `PriorityQueue` class. This class supports all of the basic functions such as `put` and `get` in a very efficient manner. Python automatically inserts and removes entries based on their priority and maintains the internal structure of the queues.

A Python priority queue always removes and returns the highest-priority item in the queue. If two items have the same priority, Python removes the item that arrived first. For a tuple having both priority and data fields, Python first compares the priority and then the data item.

{{< note >}}
To avoid using the data field in the comparison, enclose the `PriorityQueue` class in a wrapper and override its default behavior. Consult the [Python PriorityQueue class documentation](https://docs.python.org/3/library/queue.html?highlight=priorityqueue#queue.PriorityQueue) for more details about this technique.
{{< /note >}}

Python's implementation of the PriorityQueue class extends the Python `heapq` module, which is based on a binary heap design. It is very easy to retrieve and remove the highest-priority item from a binary heap. Insertions and deletions have a time complexity of O(log n) even when re-balancing activities are accounted for. This means the `PriorityQueue` class remains quite efficient even with large data sets. In a max heap implementation, the highest-priority item at the front of the queue is always immediately accessible at the top of the heap. Inserting an item into the queue is somewhat more complex, but can still be accomplished in logarithmic time.

For more details about how Python internally implements its `PriorityQueue` class, see the [Python documentation](https://docs.python.org/3/library/heapq.html#priority-queue-implementation-notes).

### Importing PriorityQueue

The `PriorityQueue` class is part of the `queue` module. It is described in the [Python queue documentation](https://docs.python.org/3/library/queue.html), and can be imported using the following command.

    from queue import PriorityQueue

This allows the constructor and all the class methods to be directly accessed without prepending the name of the module. For example, a priority queue can be created using the following command.

    q = PriorityQueue()

If you require other functions in the `queue` library, it is possible to import the entire package.

    import queue

In this case, the name of the module must precede the `PriorityQueue` constructor. The following line creates the same priority queue the first example did.

    q = queue.PriorityQueue()

### How to Use the PriorityQueue Class

The `PriorityQueue` class shares most of the same methods as the parent `Queue` class. The [Python Queue Documentation](https://docs.python.org/3/library/queue.html?highlight=priorityqueue#queue.PriorityQueue) provides detailed information on the class constructor and all of the methods.

Developers can create a `PriorityQueue` object using the class constructor. At the same time, they can supply a parameter to set a maximum size for the queue. The following command creates a priority queue that can hold 100 objects.

    q = PriorityQueue(100)

{{< note >}}
The examples in this section assume the `PriorityQueue` class has already been imported using `from queue import PriorityQueue`.
{{< /note >}}

The `PriorityQueue` interface is fairly straightforward to use. The following list describes the most important methods.

- **empty**: This function returns `True` if the queue is empty and contains no items. Otherwise, it returns `False`. This function is often used to determine if more `get` operations are required to service the queue.
- **full**: This function returns `True` if the queue has reached its maximum size and has no more space for additional entries. A queue can typically only reach full capacity if a size limit has been configured. Otherwise, the queue size is bounded only by available memory.
- **get**: This removes and returns the highest priority item from the queue. Additional parameters can be supplied indicating whether Python should block waiting for an item and how long it must wait. The default for the `block` parameter is `True`, while `timeout` defaults to `None`. By default, a `get` request blocks waiting forever for the next item to arrive.
- **maxsize**: This method returns the maximum size of the queue. If there is no maximum size, it returns `0`.
- **put**: This method adds an item with the specified priority to the priority queue. Developers can add either a single value to function as the priority, or a tuple in the form `(priority_number, data)`. A Python tuple is an ordered and immutable list. Similarly to the `get` method, `block` and `timeout` parameters can be passed to the method. The defaults are `True` and `None`. If the queue is full, the `put` method blocks until it times out waiting for a slot to become available.
- **qsize**: This method returns the number of items currently in the queue.

{{< note >}}
Some of the `PriorityQueue` commands, including `empty`, `full`, and `qsize` can be subject to race conditions when multiple processes are used.
{{< /note >}}

A queue can be deleted using the `del` command.

    del q

### An Example of a Python Priority Queue

The example in this section demonstrates how to implement a Python priority queue for airline passengers using the `PriorityQueue` class. It explains how to create a queue, how to add and remove new entries, and how to remove all remaining items from the queue.

1.  Import the `PriorityQueue` package from the `queue` module.

        from queue import PriorityQueue

1.  Create a Python `PriorityQueue`, assigning the variable `q` to the object.

        q = PriorityQueue()

1.  Create three passengers using the `put` method. Customer Smith is in the business class, which is class 2, while customer Jones is in first class, designated as priority 1. The customer Wilson is in "standby" class 4. Each item is entered as a tuple, containing the priority along with the name of the customer. The tuple is enclosed in parentheses and is the only parameter passed to the `put()` method.

        q.put((2, "Smith"))
        q.put((1, "Jones"))
        q.put((4, "Wilson"))

1. Remove customer Jones, who is the highest priority customer from the queue. Even though Jones arrived after Smith, they have the highest priority because they are in class `1`.

        next = q.get()
        print(next)

    {{< output >}}
(1, 'Jones')
    {{< /output >}}

1. It is sometimes helpful to verify whether the queue is empty or if it is full. The `empty` method should return `False` because two entries still remain. In practice, the queue is of unlimited size, so `full` is `False` too.

        print(q.empty())

    {{< output >}}
False
    {{< /output >}}

        print(q.full())

    {{< output >}}
False
    {{< /output >}}

1.  Add customer Collins to the queue with "standard" class priority 3.

        q.put((3, "Collins"))

1.  Remove the next customer from the queue. This is customer Smith.

        print(q.get())

    {{< output >}}
(2, 'Smith')
    {{< /output >}}

1.  To remove all remaining entries from the priority queue, use a `while` loop. At the loop entrance, confirm whether the loop is empty or not. If the `empty` method returns false, then there are still entries remaining. In this scenario, the `get` method extracts the highest priority item from the queue. Collins has a higher priority and is popped from the queue before Wilson is.

    {{< note >}}
If `get` is used on an empty queue with default settings, it is blocked until an item is available. To avoid deadlocks, it is important to either set the `block` parameter to `False` or to first verify whether the queue still contains more items.
    {{< /note >}}

        while not q.empty():
            print(q.get())

    {{< output >}}
(3, 'Collins')
(4, 'Wilson')
    {{< /output >}}

1.  At this point, the queue should be empty.

        print(q.empty())

    {{< output >}}
True
    {{< /output >}}

These instructions can be combined together to form the program `pri_queue.py`.

{{< caution >}}
Do not name this program `queue.py`. This would conflict with the actual `queue` module and hide the actual interface. This bug generates the error `ImportError: cannot import name 'priorityQueue' from partially initialized module 'queue'` at runtime.
{{< /caution >}}

{{< file "pri_queue.py" python >}}
from queue import PriorityQueue
q = PriorityQueue()

q.put((2, "Smith"))
q.put((1, "Jones"))
q.put((4, "Wilson"))

next = q.get()
print(next)

print(q.empty())
print(q.full())

q.put((3, "Collins"))
print(q.get())

while not q.empty():
     print(q.get())

print(q.empty())
{{< /file >}}

You can run the file with the following command:

    python3 pri_queue.py

### Getting the Size of a Priority Queue in Python

To get the size of a Python queue, use the `qsize` command. The following example demonstrates how to determine the size of any queue in Python.

1.  Similarly to the previous example, import the `PriorityQueue` class and create a `PriorityQueue` object.

        from queue import PriorityQueue
        q = PriorityQueue()

1.  Add a couple of items to the queue with different priorities using the `put` routine.

        q.put(3)
        q.put(20)

1.  Verify the size of the priority queue using Python's `qsize` method.

        print(q.qsize())

    {{< output >}}
2
    {{< /output >}}

1.  Add a new item to the queue and confirm the queue size again. It has increased to `3`.

        q.put(11)
        print(q.qsize())

    {{< output >}}
3
    {{< /output >}}

1.  Remove an item from the queue using the `get` command. The `qsize` routine confirms the queue size is back to `2`.

        q.get()
        print(q.qsize())

    {{< output >}}
2
    {{< /output >}}

## Conclusion

Python queues are an important data structure that processes a list of items in a FIFO manner. Although traditional queues follow a strict FIFO algorithm, Python priority queues are able to prioritize the list entries. This allows high priority entries to be processed before lower-priority items that arrived earlier.

Python includes a priority queue implementation as part of its `queue` module. It manages priority queues using a heap data structure. In a max heap, the value of the parent node is greater than the value stored in any of its children. Heaps make it easy to access the highest-priority item, and even insertions are relatively efficient with a logarithmic time complexity. Python priority queues have a simple and easy-to-understand interface. Items can be inserted using `put`, and retrieved using `get`. For more information on Python queues, see the [official Python queue documentation](https://docs.python.org/3/library/queue.html).