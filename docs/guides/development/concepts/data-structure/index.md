---
slug: data-structure
description: 'What is a data structure? Read our guide to learn about why data structures are important and how to choose the correct data structure for your projects.'
keywords: ['data structure','data structures definition','what are data structures','computer data structures']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-06-10
modified_by:
  name: Linode
title: "Data Structures in Computer Programming"
title_meta: "Understanding Data Structures: Definition, Uses & Benefits"
external_resources:
- '[Python core data structures](https://docs.python.org/3/tutorial/datastructures.html)'
- '[Wikipedia page on data structures](https://en.wikipedia.org/wiki/Data_structure)'
- '[Big O notation](https://en.wikipedia.org/wiki/Big_O_notation)'

authors: ["Jeff Novotny"]
---

Data structures are used to create efficient, clear, and organized programs. Among the best known [data structures](https://en.wikipedia.org/wiki/Data_structure) are lists and arrays. This guide introduces and defines data structures and explains why they are important. It also highlights the most important data structures and clarifies when and how each one can be used.

## What are Data Structures?

In computer science, a data structure is a format that organizes, manages, and stores data. For a data structure to be practical, it must be relevant to the task and easy to use. Programmers should be able to quickly and efficiently store and retrieve data using the structure. Additionally, the data must be arranged in a sensible way within the context of the program. A data structure must also support useful and usable algorithms.

The following three components define a data structure:

- **Relationships**: In a data structure, elements are related or connected in some way. They follow a sequence, or are arranged in a certain format. This contrasts with an assortment of different but unrelated variables. For example, three stand-alone integers do not necessarily share any relationship.
- **Operations**: Each data structure is associated with a collection of functions that can implement and manipulate it. These integrated algorithms are used to interact with the actual data. Most data structures support operations such as adding or deleting an item. However, other operations are only meaningful in certain situations. For instance, it might make sense to sort an array, but not a hash table.
- **Data Values and Type**: The definition of a data structure also includes the values it contains and the type of data it allows. In some data structures, all values must have the same type, while others do not enforce any restrictions.

Data structures are central to a logical model known as an *abstract data type* (ADT). While a data structure is designed and analyzed from the developer's perspective, the ADT model is user-centric. For the user, the values and operations the ADT supports and its behavior in various situations are more important. These two perspectives do not always align, and the user is almost never aware of the internal implementation.

Data structures are also central to *Object Oriented Programming* (OOP). In OOP, both the data structure and its operations are defined together in the class definition. These operations include the constructor, destructor, and methods of the class, and the API/interface. Each object encapsulates its own set of values, along with the relationships, operations, and type information from the class definition. This means every instance of a class is also a type of user-defined data structure.

Data structures can be built into a language or developer defined. For instance, Python provides documentation about its [core data structures](https://docs.python.org/3/tutorial/datastructures.html). Low-level languages usually support only the most basic of built-in structures. But higher-level languages provide libraries for very advanced and complex data structures, including graphs and maps.

Technically, even primary data types, such as integers, can be considered data structures. However, in everyday use, the term is reserved for compound data types, which might contain multiple items. These data structures are constructed from core data types including integers, characters, Booleans, and pointers. In most cases, a data structure includes a set of pre-defined procedures or methods to manipulate the structure. However, developers can add their own algorithms to the core data structure.

Many essential data structures take advantage of pointers and pointer arithmetic to store and retrieve data. This aligns with the internal hardware model of the underlying system and is a very fast and efficient way to manage data. Depending on the programming language, some data types can be accessed using either a more user-friendly array subscript or the underlying memory space. A good example of this design is an array in the C programming language.

## Why are Data Structures Important?

Data structures are essential whenever primary data types are insufficient to organize and process the data. For example, if a program is only using three pieces of data, then three separate variables are sufficient. However, if the program must handle thousands of values, it is impractical to use a different variable for each one. The program would be messy, confusing, and unmanageable. In this case, a compound data structure such as a list, array, or hash table must be used to manage the data. To generalize, data structures encourage more formal programming techniques and are indispensable for larger programs. Here are some of the main advantages of data structures.

- Data structures allow developers to organize their data and present it in a logical manner. Because the data is handled cleanly and clearly, this results in more manageable programs containing fewer variables.
- Data structures are programmatic building blocks that naturally encourage modular program design and professional coding practices. It is easy to develop interfaces and to pass data between functions using data structures.
- It is often faster and more memory-efficient to use data structures. The algorithms associated with each data structure are optimized for speed and utility. For example, certain types of trees allow developers to quickly find a specific entry based on a search key.
- Data structures lend themselves to standardized and established solutions. In many cases, the best known algorithm for a given task requires a specific data structure. The best routing algorithms all use some type of graph data structures. This reduces development and test efforts.
- They are a shared convention between programmers. For example, most experienced developers know what trees and hash tables are and when to use them.
- They are more readable and more maintainable.

Data structures are widely used in computing, but they are particularly useful in the situations listed below. In certain cases, data structures were designed to solve a particular type of problem.

- **Searching**: Many data structures support efficient algorithms to find a specific entry from within a longer list.
- **Storage/Scaling**: Using data structures, large amounts of data can be effectively structured, organized, and stored. Several data structures are designed to interact with relational database management systems.
- **Indexing**: Hash tables and some tree structures can index a long list of entries.
- **Sorting**: A classic data structure called a binary search tree is often used to sort a list of unordered data into alphabetical order or some other arrangement.
- **Listing**: Simple data structures such as arrays can retrieve any data items matching a set of criteria.
- **Data Transfer**: Data structures are a good choice to share information through an interface or API because both client and server have a common understanding of the data. The transfer might occur between classes or functions, or between a client and a server.

## Types of Data Structures

A handful of common data structures are used repeatedly in many circumstances, but there are many more specific alternatives. All data structures are built out of the base data types, including integers, floats, characters, pointers, and strings. Data structures can be classified as either linear or non-linear.

### Linear Data Structure Types

In a linear data type, the individual components within the structure are arranged in sequential order. The items might be sorted based on a particular index or when they were received. Linear data types are usually straightforward to understand and implement. A program can walk through the data structure to retrieve each item. Unfortunately, linear data types are not always the most efficient choice. Their performance can degrade quickly as the size of the data set increases.

In many cases, programming languages already provide an implementation for many of these types. Libraries can also provide additional algorithms and support for more elaborate data structures. For instance, the core Python package provides support for lists, sets, and dictionaries. However, it also has library files for stacks and queues. Here are some of the essential linear data types:

- **String**: Many developers consider a string to be a basic data type, because strings are universally supported. However, they are actually a linear data type formed from individual characters. Strings are very simple to use and essential to almost every program. Although the names of variables are also strings, they are identifiers and are not a data type.
- **Array**: An array is a list of items in sequential order. Almost every language supports some type of array, but in most cases, all items must be of the same type. Arrays can be either immutable and fixed, or mutable and able to be changed. Some implementations allow the size of the array to change so items can be added or removed. In most languages, an array subscript is used to access the individual items. This usually involves some type of bracketing mechanism. The brackets enclose the position of the item within the array, for example `[6]`.
- **Stack**: A stack is a list that is written and read in a *last in first out* (LIFO) order. Each new item is "pushed" onto the top of the stack. When the stack is later accessed, the most recent entry is "popped" off the stack. Stacks can be implemented using a basic array, but they can also use another format. They are especially useful for evaluating mathematical expressions and in compilers.
- **Queue**: Queues are very similar to stacks, except they follow a *first in first out* (FIFO) format. The next item to be popped from a queue is always the oldest item. Queues are the best option for scheduling purposes and for processing incoming client requests. Some applications use multiple queues for scheduling items of differing priorities. The high-priority queue is serviced first, even if items in the lower-priority queues have been waiting longer.
- **Linked List**: Linked lists are a versatile and memory-efficient data structure. In addition to storing data, each node also points to the next node. This is accomplished through the use of *pointers* containing the memory address of the next entry. Linked lists can easily expand and shrink to accommodate lists of variable lengths. However, it is difficult and time-consuming to access a specific item. In the worst case, which occurs when the item is the last entry, every node must be visited. Some linked lists are bidirectional, so the items can also be traversed in reverse order.

### Non-Linear Data Structure Types

Non-linear data structures are organized around the relationships between the individual nodes. The collection of items do not share a consistent sequence. These relationships are often hierarchical. Each parent entry has one or more children. However, some non-linear data types summarize relationships without any hierarchy.

These data structures are more complicated and are often more difficult to work with. They are not as frequently built into a language, so a library or user-based implementation might be required. However, these data structures can store information efficiently and find individual entries very quickly. The run time for any algorithms operating on these data structures does not change dramatically as the number of items increases. They can therefore be applied to very large data sets. Here are some of the more common non-linear data structures.

- **Graph**: Graphs describe the connections between individual entries, known as vertices. Each vertex is connected to one or more other vertices by edges. Related vertices share an edge, while unrelated vertices do not. The edges might have weights, indicating the cost, distance, or intensity of the relationship. The map of vertices and edges fully describes the topography of the domain. Graphs are often used for routing and mapping. A *spanning tree* is an important internal graphing structure. It connects all nodes in the graph together without any cycles.
- **Tree**: A tree is a particular type of graph where there is only one possible path between any two nodes. This means trees cannot contain loops, nor is it possible to visit each node on a tree without extensive backtracking. Trees have a unidirectional hierarchical structure. At the top level, a parent "root" vertex has one or more children. Each of those child nodes can also have children. Trees are frequently used to represent directories or to sort and search data. There are many types of trees including binary search trees, AVL trees, B-trees, and red-black trees. Many domain-specific trees have been developed. For instance, a *trie* is a type of tree for storing prefixes. It is used for dictionaries and for finding items.
- **Heap**: A heap is a special type of tree. The value stored in the parent node is either less or more than all of its children. This relationship holds for each node at every level of the heap. Heaps are a good choice for ordering and organizing data. But they frequently have to be rebalanced when nodes are added or removed. So they are better suited for relatively static data sets.
- **Record**: A record is a list of key-value pairs. Each of the keys, or fields, contains a value. The different values are not required to have the same type. However, a value can potentially be another record, leading to a nested structure. Records can potentially support a large number of fields, but they can become inefficient as the number of pairs grow. Records are used in databases and can serve as a container for related information. A good example might be all relevant information about a customer or an employee. In object-oriented programming, each instance of a class is technically a record.
- **Hash Table**: A hash table is an associative array. Each key, or index, inside a hash table maps to a set of values, known as a bucket. The key for each entry is calculated using a hash function. Hash functions vary in complexity. A number might be hashed by dividing it by a smaller number and taking the remainder as the hash key. Some hash tables assign each entry to its own bucket, but many implementations allow collisions where more than one key has the same index. There is always a tradeoff between the size of the table and the speed of entry lookups, but certain formulas are known to approximate the best compromise. Hash tables have many uses including database indexing, compilers, and caches.

## How to Choose a Data Structure for Your Next Project

Each data structure is best suited to a certain set of tasks, and should complement the necessary data operations. A mismatch between the task and the structure might make a program less efficient or more confusing, so it is important to choose correctly. Additionally, the same information can be represented using various data structures. For instance, an ordered list can be structured as an array, or some variant of a tree. The tree is more efficient, but for a small data set, an array might be easier to use.

Some data structures are very common in certain contexts. For example, compilers almost always use hash tables to look up the type and current value of variables. Some data structures were originally designed for a single task. Here are some issues to consider when choosing a data structure.

- **Storage capacity**: Certain data structures are very convenient and easy to use, but use up more memory. In a memory-constrained environment, minimalist data structures like linked lists are more useful.
- **Performance requirements**: Arrays are simple, but it can take longer to search for an individual item. Pointer-based tree structures or hash tables are often quicker. Developers must always consider the performance requirements for their application. There are often trade-offs to be made, but inefficient data structures and algorithms can quickly become unusable. This issue is related to [Big O notation](https://en.wikipedia.org/wiki/Big_O_notation). The Big O value of an algorithm describes how the execution time increases as the size of the data set grows.
- **The type of data**: The type and nature of the data often dictates the data structure. Ordered and unordered data benefit from different structures. Simple data items such as a series of integers can be stored in an array. However, a graph can better handle a list of connections between items.
- **How the data is used**: It is important to consider how the data is used when selecting a data structure. If the data is repeatedly accessed or updated, a more efficient data structure is required.
- **Ease of use**: Some data structures are easy for inexperienced programmers to implement and use. For simple internal applications without stringent performance requirements, it is usually better to use straightforward structures.
- **Permanence**: Transient information that should not be saved might be stored in an efficient manner. Stored data is best handled using a data structure that promotes easy access.

A decision about what data structure to use is often based on several factors. In many cases, there is not one perfect choice. Below are a couple of examples demonstrating how a data structure can be chosen.

If all items from an unordered list must be read and later processed once, then an array is an effective and simple choice. Arrays are quite fast in this context, they can scale, and they are easy to use.

However, if the relationships between these items are of great significance, then the more complicated graph data structure is the only reasonable choice. Graphs are designed to illustrate the connections between items in a fast and memory-efficient manner. Unfortunately, they are one of the more complicated data structures and it takes some practice to effectively use them.

## Conclusion

The definition of a data structure is "a data format that helps developers organize, manage, and store information". Computer data structures are described by the relationships between the items, the operations supported by the structure, and the actual values of the items. Developers often create new data structures and algorithms for an application, but many structures are built into the main programming languages.

Some data structures are linear. This means the items are arranged in sequential order. Others are non-linear and should be used when the relationships between items is important. The most widely-used data structures include arrays, stacks, queues, records, trees, graphs, linked lists, and hash tables. There are many factors involved in choosing a data structure to use. However, memory use, performance, and ease of use are the most important. If you'd like to try out some of the data structures discussed in this guide, visit our documentation library's [Python section](/docs/guides/development/python/). This section includes guides on various primary data types and linear data types in Python.