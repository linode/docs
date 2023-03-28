---
slug: python-for-and-while-loops
description: 'This guide covers using for and while loops in Python 3 and includes examples for looping through dictionaries and lists, and constructing do while loops.'
keywords: ['Python for loop', 'Python while loop', 'Python for loop range', 'Python loop through dictionary']
tags: ['python']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-02-04
modified_by:
  name: Linode
title: "For and While Loops in Python 3"
title_meta: "Using For and While Loops in Python 3"
external_resources:
- '[Python control flow documentation](https://docs.python.org/3/tutorial/controlflow.html)'
- '[Python compound statements](https://docs.python.org/3/reference/compound_stmts.html)'
- '[PEP 8 Style Guidelines](https://www.python.org/dev/peps/pep-0008/)'
authors: ["Jeff Novotny"]
---

Programs often have to run the same commands over and over again. [Python](https://www.python.org/) provides two types of loop statements to handle two different situations. The Python `for` loop is used when the number of iterations is known before the loop starts running. In contrast, the Python `while` loop repeats as long as a certain condition is true. This tutorial describes how to use both types of loops and explains how to use Python for common scenarios like looping through a dictionary.

## An Introduction to Python for and while Loops

The Python `for` statement is a control flow statement that executes a specific block of code a certain number of times. Without this command, programming would be tedious and much less useful. Each `for` loop contains a sequencer that determines how many times the loop should run. Some loops use the `range` function to delimit the starting and stopping points. Other loops use a sequential data structure, such as a list, string, or dictionary, to define the sequence. In this case, the length of the data structure determines the range. The loop repeats once for each item in the structure.

A `for` loop is used whenever the loop should run a certain number of times. Under normal circumstances, changes inside the loop do not cause the loop to terminate early. However, the `break` statement allows for early termination of the loop under unexpected or adverse conditions. Here are some cases when a loop might be useful.

- Count how many times each letter grade appears in a student transcript.
- Given a list of employees, determine how many did not complete the mandatory ethics course.
- Update a macro-economic model for each of the next ten years.

In these cases, the program can determine the range of the loop before it begins looping. In the first case, a finite list of grades is used as a sequencer for the loop. If the list is `['A', 'B', 'C', 'D', 'F']`, then the loop iterates five times, once for each grade.

The Python `while` statement continues to execute a block of code as long as a test condition is true. The loop stops running when the condition no longer holds. Therefore, it is impossible to tell in advance how many times the loop might run. To determine whether the loop should iterate again, Python calculates the Boolean value of the statement's *conditional expression*. An example of this type of expression is `num_attempts < max_attempts`. If the expression evaluates to `True`, then Python executes the loop again. If it is `False`, then Python stops running the loop. Control flow passes to the next statement after the loop.

As long as its expression continues to be `True`, a `while` loop can keep running indefinitely. For the loop to terminate, the conditional expression must change to `False` at some point. This means at least one of the variables used in the expression must be updated somewhere within the code block. A conditional expression that can never change to `False` leads to an *infinite loop*. This type of loop is defined as an endlessly repeating sequence of instructions. There are a few cases where this is desirable, for instance, in the kernel of an operating system. But most of the time, this is a bug. Always ensure the conditional expression can change given the correct exit conditions.

In certain situations, it is sensible to add a *guard condition* to a conditional expression. For example, a loop that validates a user password should limit the number of attempts. The guard often takes the form of a loop counter that increments with every iteration.

Here are a few examples of cases where a `while` statement could be used:

- A user is repeatedly prompted for a password until they enter it correctly.
- A program accepts and processes new input until the user enters an escape sequence.
- A function continues reading data from a stream as long as the connection remains open.

To summarize, a `for` statement is used when the maximum number of iterations is known in advance. Use a `while` statement when the loop should keep running until something changes.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

1. Ensure Python is properly installed on the Linode and you can launch and use the Python programming environment. To run Python on Ubuntu, use the command `python3`. For information on how to use Python, see our guide on [How to Install Python 3 on Ubuntu 20.04](/docs/guides/how-to-install-python-on-ubuntu-20-04/).

{{< note respectIndent=false >}}
The steps in this guide are written for non-root users. Commands that require elevated privileges are prefixed with `sudo`. If you are not familiar with the `sudo` command, see the [Linux Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## Python Loops

### The Python for Loop

The Python `for` statement is a *compound statement*. It consists of a *header* and a block of code. The first line of the statement, up until the `:` symbol, is the header. The header contains the following components:

1. The `for` keyword, which begins the statement.
1. A loop variable, which is also known as the *iterator*. This variable is incremented or decremented with each new iteration of the loop. It is not necessary to define the loop variable beforehand. Python creates this variable when it is first used.
1. The keyword `in`.
1. A sequence to constrain how many times the loop executes. This is supplied using either the `range` function or a sequential data object. The built-in `range` function accepts up to three integers. These stand for the starting position, the ending position, and the `step` for the sequence. The sequential data type can be a String, List, Set, Tuple, or Dictionary. More details are provided in the following sections.
1. A `:` symbol that terminates the statement header.

Each `for` statement is paired with a block of executable code, known as the *suite*. The code block consists of one or more indented lines of code. The first non-indented line of code terminates the code block. According to Python's [PEP 8](https://www.python.org/dev/peps/pep-0008/) style guidelines, the indentation should be four spaces long.

At the beginning of each loop, Python increments the value of the iterator and verifies whether the loop should continue. If so, Python executes the code block again.

#### Using the Python for Loop with a Range

The Python `for` statement is frequently used with the `range` keyword. When the `range` function is used to calculate the sequence, the loop keeps running as long as the iterator falls within the range. When used with the `range` function, the syntax for a Python `for` loop follows the format below:

    for iterator in range(start, end, step):
        statements

The `range` operator accepts up to three integer parameters:

-  `start`: This serves as the initial value of the `iterator` and the starting point of the `range`. If the `start` value is omitted, it defaults to `0`. It is inclusive, which means the `iterator` is set to this value for the first instance of the loop.
-  `end`: This mandatory value determines the end position of the `range`. A comparison is made between the value of the `iterator` and the endpoint at the start of the loop. If the `iterator` is still within the range, the loop continues to iterate. This value is exclusive, so if `end` and the `iterator` are equal, the loop stops running.
-  `step`: The `step` indicates how much the `iterator` should increment each cycle. It is optional, and has a default value of `1`. If a `step` is used, all three values must be specified.

To illustrate how these values work together, `range(0,5)` increments the iterator from `0` to `4` and runs five times. `range(1,5,2)` sets the iterator to `1` to start off and increments it by `2` with each iteration. It only runs two times, because the third time the iterator is `5`, which is equal to the `end` value.

The following program demonstrates how to use the `range` function to constrain a Python `for` loop. The `range` uses the default `start` value and an `end` point of 5. The iterator `i` is set to zero at the start of the loop and continues to increment each cycle. The loop continues to run while `i` is less than `5`. The code block prints out the new value of the iterator each time it runs.

{{< file "loop1.py" python >}}
for i in range(5):
    print("The value of i is", i)
print("The loop has ended.")
{{< /file >}}

    python3 loop1.py

{{< output >}}
The value of i is 0
The value of i is 1
The value of i is 2
The value of i is 3
The value of i is 4
The loop has ended.
{{< /output >}}

In the next example, the loop initializes `i` to `1` and adds `2` to `i` each loop, up to an upper limit of `7`. When `i` is `5`, the loop executes again. When it increments to `7`, it is no longer less than the `end` value, so the loop terminates. Control passes to the next statement outside the loop.

{{< file "loop2.py" python >}}
for i in range(1,7,2):
    print("The value of i is", i)
print("The loop has ended.")
{{< /file >}}

    python3 loop2.py

{{< output >}}
The value of i is 1
The value of i is 3
The value of i is 5
The loop has ended.
{{< /output >}}

Negative values can be used for `start` or `end` points and for the `step`. When the step is negative, Python verifies whether the iterator is still greater than the `end` value. The following example decrements the iterator by `10` each time the loop begins.

{{< file "loop3.py" python >}}
for i in range(5,-30,-10):
    print("The value of i is", i)
print("The loop has ended.")
{{< /file >}}

    python3 loop3.py

{{< output >}}
The value of i is 5
The value of i is -5
The value of i is -15
The value of i is -25
The loop has ended.
{{< /output >}}

A `for` loop can also have an `else` statement, although it is not used too often. The code associated with the `else` statement runs after the loop ends. It can be used for post-loop processing or for situations when the loop does not run at all.

{{< file "loop_else.py" python >}}
for i in range(5):
    print("The value of i is", i)
else:
    print("The for condition is false.")
print("The loop has ended.")
{{< /file >}}

    python3 loop_else.py

{{< output >}}
The value of i is 0
The value of i is 1
The value of i is 2
The value of i is 3
The value of i is 4
The for condition is false.
The loop has ended.
{{< /output >}}

{{< note respectIndent=false >}}
The iterator continues to execute when the loop terminates. But it is not considered good programming practice to use it outside the loop. This behavior might vary between different versions and releases of Python.
{{< /note >}}

#### Using the Python for Loop with Sequential Data Types

The Python `for` loop can also be used with sequential data structures such as Strings, Lists, Tuples, and Dictionaries. In these cases, the length of the data structure defines the range of the sequence. The loop continues to iterate while there are more items. For example, if a `for` loop uses a list containing five items, the loop iterates five times. Each item in the data structure is assigned in turn to the iterator.

When a `for` loop is used with a sequential data type, the syntax changes slightly. The `range` function is no longer used, but the structure is much the same otherwise.

    for iterator in sequence:
        statements

#### How to Loop Through a List in Python

Python uses the List's built-in `__iter__` function to step through the List. Each new loop assigns the next item in the List to the iterator variable. The `for` loop is guaranteed to iterate through all items in the List in sequential order. It continues to iterate as long as the List contains more items.

The following example demonstrates how to use the Python `for` statement to loop through a List. In this case, the program defines a List named `cities`. The line `for city in cities` iterates through the `cities` List. At the start of each loop, it assigns the next item in the List to `city`. Upon each new loop, `city` contains the name of the next city. Within the code block, each city is printed on a new line.

{{< file "loop_list.py" python >}}
cities = ['Chicago', 'Detroit', 'New York', 'Miami']
for city in cities:
    print("The next city is", city)
print("The loop has ended.")
{{< /file >}}

    python3 loop_list.py

{{< output >}}
The next city is Chicago
The next city is Detroit
The next city is New York
The next city is Miami
The loop has ended.
{{< /output >}}

#### How to Loop Through a Dictionary in Python

Python can loop through a dictionary in much the same way it loops through a List. However, the structure of a dictionary is more complicated. A dictionary maps keys to values. Each dictionary item is a *key-value pair* which uses the key as its index. To be valid, a key must be comparable to other keys and cannot change. However, a value can be of any Python type, and types can be mixed within the same dictionary. A value can also be a sequential data type, such as a List or Tuple, or even another Dictionary.

Beginning with release 3.6, Python iterates over dictionary keys in the same order the entries were created. The `for` loop provides the name of the next key, not the value. However, the value can be accessed using the indexing operator `[]`. To use the indexing operator, specify the name of the dictionary and append the indexing operator, placing the name of the key inside. The syntax for this operation is `dictionary_name[key]`. For example, if a dictionary named `citystates` contains a key named `Miami`, the associated value of `Miami` is retrieved using `citystates[Miami]`.

{{< note respectIndent=false >}}
Earlier releases of Python often order dictionary entries differently.
{{< /note >}}

The `lopp_dcit.py` file demonstrates how to loop through a Dictionary named `citystates`. In this Dictionary, the key is the name of the city while the value is the name of the state. More specifically, `city` contains the name of the city, and `citystates[city]` contains the name of the corresponding state. The code block prints both variables. Because the Dictionary contains four entries, the `for` loop iterates four times.

{{< file "loop_dict.py" python >}}
citystates = {'Chicago' : 'Illinois', 'Detroit' : 'Michigan', 'New York' : 'New York', 'Miami' : 'Florida'}
for city in citystates:
    print("The name of the city is", city, "and the name of the state is", citystates[city])
print("The loop has ended.")
{{< /file >}}

    python3 loop_dict.py

{{< output >}}
The name of the city is Chicago and the name of the state is Illinois
The name of the city is Detroit and the name of the state is Michigan
The name of the city is New York and the name of the state is New York
The name of the city is Miami and the name of the state is Florida
The loop has ended.
{{< /output >}}

Every Python Dictionary has a built-in method named `.values`. To use the `.values` method, append an empty arguments list `()`. This function supplies a *view object* containing all the values from the Dictionary without the corresponding keys. This method is useful when a program does not require the keys, only the Dictionary values. Although a view object is not actually a List, a `for` loop can process it in the same way. The `for` loop iterates through the view, supplying the next value in the view each time the loop runs.

{{< note respectIndent=false >}}
A view object is dynamic because it changes when the underlying object changes. However, it is possible to cast a view object into a non-dynamic List.
{{< /note >}}

The following example loops through the Dictionary values. The loop retrieves each subsequent item in `citystates.values()`. It then prints the value, which is the name of the state. The key is never retrieved or used, and the indexing operator is not required. In this case, the loop iterates through a view object of the Dictionary values, not the Dictionary itself.

{{< file "loop2_dict.py" python >}}
citystates = {'Chicago' : 'Illinois', 'Detroit' : 'Michigan', 'New York' : 'New York', 'Miami' : 'Florida'}
for state in citystates.values():
    print("The name of the state is", state)
print("The loop has ended.")
{{< /file >}}

    python3 loop2_dict.py

{{< output >}}
The name of the state is Illinois
The name of the state is Michigan
The name of the state is New York
The name of the state is Florida
The loop has ended.
{{< /output >}}

{{< note respectIndent=false >}}
There is also a corresponding `.keys()` method that generates a view object containing the Dictionary's keys. Using this view is almost the same as using the default method for iterating through a Dictionary. The Dictionary values are still accessed using the indexing operator.
{{< /note >}}

The built-in `items` method generates a view object containing all the key-value pairs from a Python dictionary. Each pair is a *tuple* object. The values in a tuple can be separated using a technique known as *tuple unpacking*. To unpack a tuple, assign the tuple to a sequence of variables, separated by commas. The number of variables must match the number of items in the tuple. To assign the values of the two-item tuple `myTuple` to the variables `x` and `y`, use the statement `x, y = myTuple`. This assigns the first value in `myTuple` to `x` and the second value to `y`.

{{< note respectIndent=false >}}
A tuple is an immutable collection of objects separated by commas. To learn more about Python tuples, see the [Python data structures documentation](https://docs.python.org/3/tutorial/datastructures.html#tuples-and-sequences).
{{< /note >}}

A `for` loop can be paired with the `.items` method to iterate through all key-value pairs in a Python dictionary. Upon each iteration through the view object, the next key-value tuple is extracted and unpacked to the loop variables. The following example assigns the key and value from `citystates` to the `city` and `state` variables. When this method is used, the indexing operator is no longer required to access the value.

{{< file "loop3_dict.py" python >}}
citystates = {'Chicago' : 'Illinois', 'Detroit' : 'Michigan', 'New York' : 'New York', 'Miami' : 'Florida'}
for city, state in citystates.items():
    print("The name of the city is", city, "and the name of the state is", state)
print("The loop has ended.")
{{< /file >}}

    python3 loop3_dict.py

{{< output >}}
The name of the city is Chicago and the name of the state is Illinois
The name of the city is Detroit and the name of the state is Michigan
The name of the city is New York and the name of the state is New York
The name of the city is Miami and the name of the state is Florida
{{< /output >}}

Built-in Python dictionary methods, like `items()` can be used to efficiently loop over a Python dictionary. To learn about these built-in dictionary methods, see our guide [How to Use Dictionaries in Python 3](/docs/guides/python-3-dictionaries/).

### How to Break or Exit from a For Loop in Python

The Python `break` statement immediately breaks out of the innermost `for` loop. It is often used to handle unexpected conditions or errors. For example, a loop might read data from a file and write it to a database. If the database suddenly becomes inaccessible, a `break` statement can immediately end the loop. Otherwise, the program would repeatedly keep timing out. It is better to give prompt feedback that something is not working.

In the `loop_break.py` example file, the `break` statement terminates the loop when the factorial of the iterator exceeds `5000`. Based on the `start` and `end` values, the program is expected to loop through the code block five times. However, it stops after three cycles because the factorial of `7` is greater than the guard value of `5000`.

{{< note respectIndent=false >}}
This program imports the built-in Python `math` module and uses the module's `factorial` function.
{{< /note >}}

{{< file "loop_break.py" python >}}
import math
for i in range(5,10):
    print("The factorial of", i, "is", math.factorial(i))
    if math.factorial(i) > 5000:
        print("The limit of 5000 is exceeded.")
        break
print("The loop has ended.")
{{< /file >}}

    python3 loop_break.py

{{< output >}}
The factorial of 5 is 120
The factorial of 6 is 720
The factorial of 7 is 5040
The limit of 5000 is exceeded.
The loop has ended.
{{< /output >}}

### The Python while Loop

The Python `while` loop is similar to the `for` loop, but it is used in slightly different circumstances. It works best in situations where the number of iterations is not known when the program first begins to loop. A good example is a guessing game. The game ends when the player guesses the correct number. So the loop keeps running until the correct number is chosen.

Like the Python `for` loop, the Python `while` statement is structured as a *compound statement*. It also contains a *header* and an associated code block. This code block is executed every time the loop iterates. The entire code block must be indented, so the first non-indented line signifies the end of the block. The indentation should be four spaces.

The header for a `while` statement is somewhat simpler than the `for` loop header. It contains the following items:

1. The `while` keyword.
1. A *conditional expression*, which must evaluate to a Boolean value of either `True` or `False`. If the expression is `True`, Python executes the corresponding code block.
1. A `:` symbol, terminating the header and introducing the code block.

A `while` loop does not have an iterator or a range and does not assign any variables. It does not lend itself to handling a sequential data structure. It can be thought of as an "indefinite" `if` statement. Upon each iteration, Python evaluates the Boolean expression. If it is `True`, the code block is executed. If it is `False`, the `while` loop terminates and control flow passes to the first non-indented line following its code block. The conditional expression can use any of Python's logical or comparison operators, including `==`, `<=`, or `and`. If the expression is `False` the first time through the `while` loop, the loop never runs at all.

As long as the Boolean expression remains `True`, the `while` statement keeps looping. To avoid an infinite loop, one of two events must happen. Either the conditional expression must eventually evaluate as `False`, or a `break` statement must be used inside the code block. For the expression to change, the code block must change one of the values used in the expression.

{{< note respectIndent=false >}}
To forcibly break out of an infinite loop in a Python program, enter `Ctrl-C`. This only works when running in interactive mode or running a Python program from the command line.
{{< /note >}}

The syntax for a `while` loop is structured as follows:

    while (Boolean_expression):
        statements

In this example, the `while` statement is used to validate a password. The program defines the `password` and then queries the user for their password. The user input is assigned to `guess`. If `password != guess` the loop continues to run. If the user does not remember their password, they can get stuck in an infinite loop. Therefore, it is good practice to add a guard counter to a `while` loop.

The following `while` statement keeps looping while the password is wrong and the user has made fewer than ten attempts to guess it. Inside the loop, the program increments the counter and prompts the user to guess the password. If the `guess` equals the `password`, the program tells the user they are right. Program control flow passes back to the start of the loop to see if the block should run again. However, this time `password != guess` is `False` and the loop terminates.

{{< file "while.py" python >}}
password = 'linode'
guess = ''
counter = 0
while (password != guess) and (counter < 5):
    counter += 1
    print("Please enter your password: Attempt", counter)
    guess = input()
    if guess == password:
        print("The password is correct on attempt", counter)
{{< /file >}}

    python3 while.py

{{< output >}}
Please enter your password: Attempt 1
yes
Please enter your password: Attempt 2
password
Please enter your password: Attempt 3
linode
The password is correct on attempt 3
{{< /output >}}

If the user never guesses the password in five attempts, the program ends gracefully.

{{< output >}}
Please enter your password: Attempt 1
a
Please enter your password: Attempt 2
b
Please enter your password: Attempt 3
c
Please enter your password: Attempt 4
d
Please enter your password: Attempt 5
e
{{< /output >}}

#### How to Break or Exit from a While Loop in Python

The `break` statement is used more frequently inside a `while` loop than in a `for` loop. A `break` statement could be used when a special character or a control sequence can terminate a loop. Instead of setting a flag and then determining if the flag is set in the `while` conditional, it is easier to exit the loop immediately.

Python also supports a `while else` loop. This structure works the same way the `for else` statement does. The `else` clause is executed if the `while` statement conditional is `False`. This is used for post-processing or clean-up tasks when the precondition is reached. For example, it can be used for a good-bye message when the user enters a certain sequence. It is also commonly used when a positive response breaks the loop. In this case, the `else` statement only executes when the attempt fails.

The use of a `break` statement and an `else` directive make the preceding program more efficient. The program already compares `password` and `guess` when deciding whether to display a success message. Therefore, a `break` statement can be added right after the message, causing the loop to immediately terminate. The unnecessary comparison at the start of the next loop does not have to be performed.

Additionally, the conditional expression can be simplified. It only has to compare `counter` to the guard value. The program does not have to compare `guess` to `password` because it knows the two values are different. If the user had guessed correctly, making `guess` and `password` the same, the `break` statement would have been used. Therefore, `password != guess` is already known to be `True` and does not have to be re-evaluated. The only time when the conditional fails are when the maximum number of guesses has been made. This implies the user never entered the password, so the `else` clause can confidently display an error message.

{{< file "while_break.py " python >}}
password = 'linode'
guess = ''
counter = 0
while counter < 5:
    counter += 1
    print("Please enter your password: Attempt", counter)
    guess = input()
    if guess == password:
        print("The password is correct on attempt", counter)
        break
else:
    print("The password was not entered correctly.")
{{< /file >}}

    python3 while_break.py

{{< output >}}
Please enter your password: Attempt 1
a
Please enter your password: Attempt 2
linode
The password is correct on attempt 2
{{< /output >}}

If the user fails to guess correctly, the error statement is printed.

{{< output >}}
Please enter your password: Attempt 1
a
Please enter your password: Attempt 2
b
Please enter your password: Attempt 3
c
Please enter your password: Attempt 4
d
Please enter your password: Attempt 5
e
The password was not entered correctly.
{{< /output >}}

#### The "do while" Loop in Python

Unlike the `while` loop, a `do while` loop evaluates the conditional expression at the end of the loop. Therefore it always executes the code block at least once. If the expression evaluates to `True`, the loop runs again.

Python does not support the `do while` loop structure even though it is available in many other languages. However, the equivalent logic can be implemented in Python using the statement `while True:` along with one or more `break` statements. The expression `True` is always `True` so the loop is guaranteed to run once. In fact, it runs until a `break` statement is encountered within the loop. A `if` statement inside the loop is used to determine when to break out of the loop. The code block must contain a `break` statement to terminate the loop. Otherwise, an infinite loop is formed.

Here is a basic outline demonstrating how a `do while` loop might be implemented in Python. This example breaks out of the loop on the tenth cycle.

{{< file "do_while.py" python >}}
guard_limit = 10
i = 0
while True:
    i += 1
    print(i)
    if i == guard_limit:
        print("The break condition has been reached.")
        break
{{< /file >}}

    python3 do_while.py

{{< output >}}
1
2
3
4
5
6
7
8
9
10
The break condition has been reached.
{{< /output >}}

## Summarizing the Python for and while Loops

Two Python statements are used to create loops. The Python `for` statement iterates for a fixed number of times. In contrast, a `while` statement keeps running as long as a conditional expression is satisfied. Both statements supply a block of code, which runs each time the loop iterates.

The `for` statement is often used with a `range` indicator that specifies the starting and ending points of the loop sequence. The range determines how many times the loop iterates. However, a `for` loop is also used to iterate through sequential data structures, including Lists and Dictionaries. At the start of each loop, either the next item in the structure or the next value in the sequence is assigned to the iterator.

A conditional expression constrains the Python `while` statement. If the expression evaluates to `True`, Python runs the corresponding code block. If it is `False`, the loop terminates. Unless the expression can change based on updates within the code block, it is possible to get trapped in an infinite loop.

Both the `for` and `while` statements can be paired with an `else` directive that only executes when the loop terminates. In addition, the Python `break` statement in the code block can be used to forcibly break out of the loop. This technique is handy for dealing with unexpected error conditions. For more information about the Python `for` and `while` statements, consult the [Python documentation](https://docs.python.org/3/contents.html).