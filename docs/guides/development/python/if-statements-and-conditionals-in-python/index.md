---
slug: if-statements-and-conditionals-in-python
description: 'This guide provides an introduction to conditional statements in Python 3. It covers how to use if, if else, and elif statements to create simple and complex conditionals.'
keywords: ['Python conditional','Python if else','Python if statement']
tags: ['python']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-02-04
modified_by:
  name: Linode
title: "If Statements and Chained Conditionals in Python 3"
title_meta: "Using If Statements and Chained Conditionals in Python 3"
external_resources:
- '[Python control flow documentation](https://docs.python.org/3/tutorial/controlflow.html)'
- '[PEP 8 Style Guidelines](https://www.python.org/dev/peps/pep-0008/)'
authors: ["Jeff Novotny"]
---

[Python](https://www.python.org/) programs must be able to run different branches of code in different situations. This is usually accomplished through the use of *conditional statements*, which determine the *control flow* through a program. Python's `if` statement is used to decide whether or not some code should run. This guide explains the `if` statement and other Python conditionals and demonstrates how to use them.

## An Introduction to Conditional Statements

Conditional statements are programming structures that can make decisions. Without conditionals and other control statements, a program would execute in a deterministic manner, one statement after the next, every time. Conditionals allow different inputs to directly affect the program's behavior. They allow programmers to construct more sophisticated, powerful, and useful programs, and are essential to computer science.

People make conditional decisions every day. If it is raining, they take an umbrella. If it is a workday, they get up early. Otherwise, they sleep in. Conditionals work the same way in computing. A conditional statement evaluates a *Boolean expression* and calculates whether it is true or false. This result affects the flow of the program. If the expression is true, the program runs a certain block of code. If necessary, it can execute a different block when the conditional is false.

{{< note >}}
In Python, the official keywords `True` and `False` represent the two Boolean truth values.
{{< /note >}}

A conditional statement typically follows an `if then` format. The `if` component is paired with a conditional expression and a block of code. If the conditional is true, the program runs the code inside the block. This code block is sometimes referred to as the *clause*. If the conditional is false, the block is not executed. Sometimes the conditional has an `if-then-else` format. The `else` branch contains a code block that only runs when the conditional is false.

A conditional statement can be used whenever different actions should be taken based on different input conditions. The list below includes some programming scenarios that lend themselves to conditional statements.

- An item should be displayed only if it falls within a specified price range.
- If a customer has been validated, then send them to a payment screen. Otherwise, ask for their credentials.
- A user is prompted to delete any documents that have not been updated within the last year.

In pseudocode, the structure of an `if then` conditional follows the pattern below:

    if (boolean expression) then
        clause
    end if

An `if then` conditional can be extended using the `else` option to form an `if then else` statement. There is no conditional expression associated with the `else` component. The program makes all decisions when it evaluates the `if` expression.

    if (boolean expression) then
        clause
    else
        clause
    end if

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

1. Ensure Python is properly installed on the Linode and you can launch and use the Python programming environment. To run Python on Ubuntu, use the command `python3`. For information on how to use Python, see our guide on [How to Install Python 3 on Ubuntu 20.04](/docs/guides/how-to-install-python-on-ubuntu-20-04/).

{{< note >}}
The steps in this guide are written for non-root users. Commands that require elevated privileges are prefixed with `sudo`. If you are not familiar with the `sudo` command, see the [Linux Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## Python Conditionals

To implement conditionals in Python, use the `if` statement. The Python `if` statement takes a variety of forms. It can be combined with an `elif` statement, which stands for "else if", or with an `else` option. The following sections explain how to best use the Python `if` statement in different circumstances.

### The Python If Statement

The Python `if` statement runs a block of code if and only if certain conditions are met. It is structured as a *compound statement*. This means it contains a *header* and an associated *suite*. The first line of the `if` statement is the header. The `if` header consists of the following three components, in the following order:

1. The `if` keyword begins the conditional statement.
1. A conditional expression, which evaluates to a Boolean value of `True` or `False`. The expression can optionally be enclosed in brackets.
1. The `:` symbol marks the end of the line and the end of the `if` statement header.

The suite follows the header. It contains one or more lines of code to execute and must be indented. This indented section is also known as the *code block* or the conditional *clause*. There is no limit to the length of this block, which is terminated by the next non-indented line. According to Python's [PEP 8](https://www.python.org/dev/peps/pep-0008/) style guidelines, four spaces should be used for the indentation.

The `if` statement evaluates the conditional. If the conditional is `True`, it runs the corresponding code block. If the conditional expression is `False`, it does not do anything. The indented block is not executed, and the control flow moves to the next non-indented line.

The conditional expression can be quite complex. Comparison operators including the equality `==` operator and the "greater than" `>` operator are commonly used. But the expression can include logical boolean operators like `and`, `or`, and `not`. It can also be the return value from a function. Any expression that evaluates to a Boolean value of `True` or `False` is permitted.

A simple Python `if` statement looks like this:

    if boolean_expression:
        command

When the Python interpreter encounters the `if` keyword, it evaluates the `boolean_expression`. If the result is `True`, Python runs the `command`.

####  Python if Example

The examples in this section demonstrate how to use the Python `if` command. The value of `temperature` is initially set to `75`. Inside the `if` statement, Python analyzes the Boolean expression, `temperature > 65` and decides it is `True`. Because the expression is `True`, Python executes the code block, which consists of two `print` statements. If the code block required more instructions, they would also be indented.

{{< file "if_temp1.py" python >}}
temperature = 75
print("The temperature is: ", temperature)
if temperature > 65:
    print("This is a nice day.")
    print("You should go outside.")
print("End of program")
{{< /file >}}

    python3 if_temp1.py

{{< output >}}
The temperature is:  75
This is a nice day.
You should go outside.
End of program
{{< /output >}}

The second example illustrates what happens when the conditional is `False`. The value of `temperature` is now only `55`, so the conditional expression evaluates to `False`. The conditional statement is not satisfied, the code block is not executed, and the statement about the nice day is not printed. The control flow passes directly to the final line of the program, which prints `End of program`.

{{< file "if_temp2.py" python >}}
temperature = 55
print("The temperature is: ", temperature)
if temperature > 65:
    print("This is a nice day.")
print("End of program")
{{< /file >}}

    python3 if_temp2.py

{{< output >}}
The temperature is:  55
End of program
{{< /output >}}

####  Python “if not” Example

There are occasions where a block of code should only run if a condition is not met. To accomplish this, precede the conditional expression with the `not` keyword and enclose the expression in brackets.

Python evaluates the entire expression, including the `not` operator, to determine the truth value. It first analyzes the expression inside the brackets. It then feeds the result to the `not` operator. This operator calculates a result of either `True` or `False`, which is the final result of the conditional expression. The subsequent code block is only executed if the conditional is satisfied.

In this example, the `if not` conditional is only true when `officer` is not set to `Detective`. The comparison `officer == "Detective"` is `False`. `not(officer == "Detective")` is therefore `True`. Python runs the code block and prints the line `the detective is not here`.

{{< file "ifnot1.py" python >}}
officer = "Constable"
if not(officer == "Detective"):
    print("The detective is not here.")
print("End of program")
{{< /file >}}

    python3 ifnot1.py

{{< output >}}
The detective is not here.
End of program
{{< /output >}}

In this case, `officer` is set to `detective`. `officer == "Detective"` is `True` and `not(officer == "Detective")` is `False`. Python does not run the code block, and `End of program` is printed.

{{< file "ifnot2.py" python >}}
officer = "Detective"
if not(officer == "Detective"):
    print("The detective is not here.")
print("End of program")
{{< /file >}}

    python3 ifnot2.py

{{< output >}}
End of program
{{< /output >}}

####  Python “and” Example

A conditional can be built up into a complex compound expression involving several operators and clauses. This allows for more complex decisions to be made. The `if` code block is only executed if two, three, or even more conditions are met.

In this example, the code block associated with the `if` statement is only executed if two conditions are both true. The program uses a logical `and` expression to verify both expressions are `True`. Brackets are used to pre-calculate both inputs for the `and` operator. The line `This is a nice day and the detective is not here` is only printed when both prerequisites are satisfied. If either condition is `False`, the line is not printed.

{{< file "if_and.py" python >}}
temperature = 75
officer = "Constable"
if (temperature > 65) and (not(officer == "Detective")):
    print("This is a nice day and the detective is not here.")
print("End of program")
{{< /file >}}

    python3 if_and.py

{{< output >}}
This is a nice day and the detective is not here.
End of program
{{< /output >}}

### Python If Else Statement

The Python `if else` statement allows a program to choose between one of two code paths. It adds an `else` code block that only runs when the conditional is `False`. In an `if else` statement, either the `if` code block or the `else` code block are executed, but not both. It is not possible to have a case where neither block is run. Each section must have at least one statement in the indentation block.

Technically, the `else` directive is not a conditional statement. The decision about what code block to run occurs in the `if` statement.

An `if else` statement in Python is structured like this:

    if boolean_expression:
        command_1
    else:
        command_2

The Python interpreter evaluates the `boolean_expression` associated with the `if` statement. If it is `True`, it runs `command_1` but does not run `command_2`. Otherwise, it skips directly to the `else` code block and executes `command_2`.

The following example modifies the original `if_temp2.py` file to add an `else` clause. If the value of `temperature` satisfies the conditional clause, the `if` code block is executed. However, if `temperature` falls too low, the conditional statement becomes `False`. In this case, an alternative statement about colder weather is printed. In this example, `temperature` is only `55`. The conditional statement `temperature > 65` is not satisfied, so the control flow falls through to the `else` block. Python prints the line `The weather is too cold"`.

{{< file "ifelse_temp.py" python >}}
temperature = 55
print("The temperature is: ", temperature)
if temperature > 65:
    print("This is a nice day.")
else:
    print("The weather is too cold")
print("End of program")
{{< /file >}}

    python3 ifelse_temp.py

{{< output >}}
The temperature is:  55
The weather is too cold
End of program
{{< /output >}}

### Python Chained Conditionals Using elif

The Python `elif` statement stands for "else if". It is used to evaluate multiple expressions and choose from one of several different code paths. It is always used in conjunction with the `if` statement, and is sometimes referred to as a *chained conditional*.

Python first evaluates the `if` conditional. If the `if` conditional is `False`, Python inspects each `elif` conditional in sequential order until one of them evaluates to `True`. It then runs the corresponding `elif` code block. If all the `elif` conditionals are `False`, Python does not run any of the `elif` code blocks.

A sequence of `elif` statements can be followed by an optional `else` directive, which terminates the chain. The `else` code block is only executed when the `if` conditional and all `elif` conditionals are `False`. There is no limit to the number of `elif` expressions that can be used, but only one code block can ever be executed.

The Python `if elif` statement follows this template. The final `else` directive and code block are optional.

    if boolean_expression:
        command_1
    elif boolean_expression2:
        command_2
    elif boolean_expression3:
        command_3
    else:
        command_4

The `ifelse_temp.py` file from the previous section can be modified to include an `elif` statement. This allows for more effective processing of middling temperatures which are neither warm nor cold. A `temperature` value of more than `65` satisfies the `if` conditional and is still "nice". However, a temperature of between `50` and `64` is now considered "okay". A value in this range fails the `if` conditional but passes the `elif` conditional. The "cold" designation is reserved for temperatures of `50` or below. "Cold" temperatures below `50` evaluate to `False` in both the `if` and `elif` conditionals. Processing falls through to the `else` code block. Adding more conditions allows the program to more accurately represent the data.

In the first example, a `temperature` of `55` fails the first conditional test because it is less than `65`. However, being greater than `50`, it satisfies the `elif` conditional. Therefore, the line `This is an okay day` is printed.

{{< file "ifelif_temp.py" python >}}
temperature = 55
print("The temperature is: ", temperature)
if temperature > 65:
    print("This is a nice day.")
elif temperature > 50:
    print("This is an okay day.")
else:
    print("The weather is too cold")
print("End of program")
{{< /file >}}

    python3 ifelif_temp.py

{{< output >}}
The temperature is:  55
This is an okay day.
End of program
{{< /output >}}

In a follow-up run, the temperature is set to `40`. Now both the `if` and `elif` conditionals evaluate to `False`. The control flow falls through to the `else` code block, where `The weather is too cold` is printed.

{{< file "ifelif2_temp.py" python >}}
temperature = 40
print("The temperature is: ", temperature)
if temperature > 65:
    print("This is a nice day.")
elif temperature > 50:
    print("This is an okay day.")
else:
    print("The weather is too cold")
print("End of program")
{{< /file >}}

    python3 ifelif2_temp.py

{{< output >}}
The temperature is:  40
The weather is too cold
End of program
{{< /output >}}

{{< note >}}
Python has recently introduced a `match` statement. This control structure compares an expression to a list of patterns using `case` blocks. A `match` statement might be more suitable than the `elif` statement under some circumstances. See the [*Python Control Flow Documentation*](https://docs.python.org/3/tutorial/controlflow.html#match-statements) for more details.
{{< /note >}}

"Nested if" statements are related but different. In a "nested if" statement, any of the `if`, `elif`, or `else` code blocks can also contain an `if` statement. Although this structure is more complicated to write and understand, the same principles apply. Try to avoid using deeply nested control structures because the code can become difficult to read and debug. If there are more than two nested `if` statements, consider rewriting the code using functions or compound conditionals.

## A Summary of Python Conditional Statements

The Python conditional statements play a central role in how the programming language is used. They allow a program to follow different paths under different conditions. Boolean expressions use Python's logical and comparison operators to calculate a truth value and make a decision regarding what code block to execute.

Python implements conditionals using the `if` statement. A Python `if` statement first determines whether its conditional expression is `True` or not. If the result is `True`, it runs the corresponding code block. If the result is `False`, it does nothing. The Python `if else` statement still executes the `if` code block if the conditional is `True`, but it runs the `else` code block when the conditional is `False`. One of the more optional `elif` statements, signifying "else if", can follow the `if` statement to allow for different code paths based on multiple comparisons. For more information on the Python control structures, see the [official Python documentation](https://docs.python.org/3/contents.html).