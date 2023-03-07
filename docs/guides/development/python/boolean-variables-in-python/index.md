---
slug: boolean-variables-in-python
description: 'Learn about Boolean logic in Python 3. This guide includes examples for Boolean variables, comparison and logical operators, and conditional statements.'
keywords: ['Python Boolean operators','Python logical operators','Python logical and','Python logical or']
tags: ['python']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-02-04
modified_by:
  name: Linode
title: "Boolean Variables, Operators, and Conditional Statements in Python"
title_meta: "Using Boolean Variables, Operators, and Conditional Statements in Python"
external_resources:
- '[Python Documentation on Value Comparisons](https://docs.python.org/3/reference/expressions.html#value-comparisons)'
- '[Python documentation for compound statements](https://docs.python.org/3/reference/compound_stmts.html)'
authors: ["Jeff Novotny"]
---

*Boolean logic* is at the heart of [Python](https://www.python.org/) and most programming languages. It allows programmers to make comparisons, execute conditional statements, and implement common algorithms. The "greater than" (`>`) and "equals to" (`==`) symbols are examples of Python comparison operators, while `and` and `or` are some of Python's logical operators. This tutorial explains Boolean logic and expressions and discusses how to use Python's Boolean operators.

## An Introduction To Boolean Logic and Boolean Values

A Boolean data type can have one of two *Boolean values*, "true" or "false". These values are sometimes represented by the binary digits "1" and "0". "True" is equivalent to "1" or "on", while "False" aligns with "0" and "off". Boolean values are named after the mathematician George Boole, who pioneered the system of logical algebra. Because it is named after a person, the word "Boolean" is always capitalized.

Wherever it appears as an adjective, Boolean indicates a binary true/false attribute. The item being discussed is either on or off, not both, and not some other value. So a Boolean circuit has binary logic gates, and in Boolean algebra, the variables are restricted to the two truth values. In terms of programming, the most useful Boolean concept is the [*Boolean expression*](https://en.wikipedia.org/wiki/Boolean_expression). A Boolean expression results in a Boolean value when it is evaluated. It can be composed of Boolean values, operators, or functions. Most people understand this intuitively. `2 + 2 = 4` is true, while `2 + 2 = 5` is false. Boolean logic and Boolean expressions are more rigorous expansions of this concept.

Python uses a built-in data type named `bool` to represent Boolean values. The `bool` type inherits its properties from the `int` type. Through an odd quirk of language design, `bool` is not a built-in value and can be redefined, although this is a very bad idea. A Python `bool` variable has two possible values, `True` and `False`. In Python 3, these values actually are Python keywords and are capitalized. Therefore, they cannot be used as variables and cannot be assigned different values. `True` and `False` can be assigned to any variable, which then becomes a `bool`. Python expands this concept to numerical values and other data types. A non-zero integer is `True`, while `0` evaluates to `False`.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

1. Ensure Python is properly installed on the Linode and you can launch and use the Python programming environment. To run Python on Ubuntu, use the command `python3`. For information on how to use Python, see our guide on [How to Install Python 3 on Ubuntu 20.04](/docs/guides/how-to-install-python-on-ubuntu-20-04/).

{{< note respectIndent=false >}}
The steps in this guide are written for non-root users. Commands that require elevated privileges are prefixed with `sudo`. If you are not familiar with the `sudo` command, see the [Linux Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## Python Boolean Operators

Python supplies a complete selection of Boolean operators for use in Boolean expressions. These operators allow an expression to be evaluated as either `True` or `False`, permitting the result to be used in conditional statements and other control structures. There are two main types of Boolean operators in Python.

- **Comparison Operators:** Python comparison operators compare two values of the same type and return a Boolean value of `True` or `False`.
- **Logical Operators:** Python logical operators combine the results of other expressions and return `True` or `False`.

In addition to the comparison and logical operators, Python has a `bool` type. Any variable assigned the value of `True` or `False` has a type of `bool`. It is possible to confirm the type of a variable using the built-in `type` function.

    a = True
    type(a)

{{< output >}}
<class 'bool'>
{{< /output >}}

If "True" is enclosed in quotes, then it is a string containing the character sequence "True".

    a = "True"
    type(a)

{{< output >}}
<class 'str'>
{{< /output >}}

Variables can be converted to a different type when they are assigned a new value. This is known as *implicit type conversion*.

    a = "True"
    type(a)

{{< output >}}
<class 'str'>
{{< /output >}}

    a = True
    type(a)

{{< output >}}
<class 'bool'>
{{< /output >}}

The Python `bool` function lets programmers evaluate any variable, expression, or object as a Boolean value. This function always returns `True` or `False`. Python uses its own set of rules to determine the truth value of a variable. Some of the less obvious rules guiding whether something is `True` or `False` are included in the list below. Consult the [Python documentation for the bool function](https://docs.python.org/3/library/functions.html#bool) for more information.

- A positive or negative integer or real number of any size is always `True`. The values `0` and `0.0` are `False`.
- Rounding errors resulting from mathematical operations on real numbers can cause confusing or misleading results. Even if the variable "should" be zero, rounding operations could mean it holds a very small non-zero value. This would evaluate as `True`.
- An empty string, list, set, or dictionary evaluates to `False`. Non-empty strings or data structures are `True`.
- The special Python value `None` is `False`.
- The special numbers `inf`, `-inf`, and `NaN` (for undefined or non-representable values) are all `True`.
- A function is always `True`.

A non-zero integer is always `True`.

    a = 1
    print(bool(a))

{{< output >}}
True
{{< /output >}}

An integer with a value of `0` is `False`.

    b = 0
    print(bool(b))

{{< output >}}
False
{{< /output >}}

### Comparison Operators in Python

Python comparison operators compare two items, but they can only be used on items that are comparable. For instance, two integers can be compared for equality, as can two strings. But two items with different types, such as an integer and a string, cannot be compared. If such comparisons are attempted, an error similar to `TypeError: '<' not supported between instances of 'int' and 'str'` is returned. The items being compared can be either constants or variables.

There are several different comparison operators, which typically return Boolean values. Not all operators make sense for all types. The most common of these operators include:

- **`==`:** The "equal to" operator.
- **`!=`:** The "not equal to" operator.
- **`<`:** The "less than" operator.
- **`>`:** The "greater than" operator.
- **`<=`:** The "less than or equal to" operator.
- **`>=`:** The "greater than or equal to" operator.

Some of these operators are mirror images to one another and some are a convenient shorthand for an operation that would otherwise require two comparisons.

#### The Equal To and Not Equal To Operators in Python

The `==` operator tests for equality. `x == y` returns `True` if the values of `x` and `y` are equal or if they refer to the same object. The equality operator can be used on most types. Two strings are equal if they both contain the same sequence of characters in the same order. Two built-in collections, such as lists, are equal if they have the same type, the same length, and each corresponding element is equal. The typing restriction means a list can never be equal to a set, even if both collections contain the exact same elements.

The `!=` operator is used to determine whether two elements are unequal. `x != y` returns `True` if `x` and `y` have different values or reference different objects. Lists and Sets are different if they have different types or lengths, or if the corresponding elements at any position are different. All equality operators are symmetric. If `x == y` is `True`, then `y == x` is also `True`. The same relationship holds for `x != y`.

For more information, see the [Python Documentation on Value Comparisons](https://docs.python.org/3/reference/expressions.html#value-comparisons).

 The example below demonstrates how the `==` operator can be used to test `a` and `b` for equality. Because the two items are indeed equal, Python returns `True`.

{{< note respectIndent=false >}}
Throughout these examples, do not mix up the assignment operator `=` with the equality operator `==`. Substituting the `=` operator in place of the `==` leads to strange and misleading bugs.
{{< /note >}}

    a = 4
    b = 4
    print(a == b)

{{< output >}}
True
{{< /output >}}

If the same two variables are tested for inequality, Python returns a Boolean value of `False`.

    print(a != b)

{{< output >}}
False
{{< /output >}}

The two items being compared do not have to be variables. A variable can be compared to a hard-coded constant. In this case, `a` is equal to `4`, so the comparison is `False`.

    print(a == 5)

{{< output >}}
False
{{< /output >}}

Strings must be identical in case and length to be considered equal in Python. The string `Linode` is not the same as `linode`.

    a = "Linode"
    b = "linode"
    c = "linode"
    print(a == b)

{{< output >}}
False
{{< /output >}}

    print(b == c)

{{< output >}}
True
{{< /output >}}

These operators can also test collections for equivalence. In this case, `list1` has the same values as `list3`, but is different from `list2`, which has a different length. So `list1 == list3` returns `True`, but `list1 == list2` is `False`.

    list1 = [1, 2, 3]
    list2 = [1, 2, 3, 4]
    list3 = [1, 2, 3]
    print(list1 == list3)

{{< output >}}
True
{{< /output >}}

    print(list1 == list2)

{{< output >}}
False
{{< /output >}}

#### The Less Than and Greater Than Operators in Python

The `<` operator stands for "Less Than". The comparison `a < b` returns `True` only in the case where `a` is less than `b`. Likewise, the "Greater Than" comparison is symbolized by the `>` operator. `a > b` returns `True` if the first item has a larger value. These two comparison operators are symmetric. In other words, `a < b` implies `b > a`.

When these operators are used on strings, the strings are evaluated based on the ASCII values of the letters. This maps to alphabetical order within either upper or lower case. However, capital letters have smaller ASCII values than their lower case counterparts. So a string beginning with a capital letter is always "less than" a lower case one.

Not all types and objects can be compared using these operators. In some other cases, the comparisons might be non-intuitive. For example, when these operators are used to compare lists, they make a decision based on the first unequal list elements. This might not be the behavior you want.

To test whether `a` is greater than `b`, use the `>` operator.

    a = 5
    b = 3
    print(a > b)

{{< output >}}
True
{{< /output >}}

Use the `<` comparison to determine whether `a` is less than `b`.

    a = 5
    b = 3
    print(a < b)

{{< output >}}
False
{{< /output >}}

The same comparisons can be done on strings. The string `linode` is considered to be less than `system` because "l" comes before "s" in the alphabet. `Linode` is also less than `System`, but `linode` is not less than `System` because capitalized characters have a lower value.

    a = "linode"
    b = "system"
    c = "Linode"
    d = "System"
    print(a < b)

{{< output >}}
True
{{< /output >}}

    print(c < d)

{{< output >}}
True
{{< /output >}}

    print(a < d)

{{< output >}}
False
{{< /output >}}

#### The Less Than or Equal To and Greater Than or Equal To Operators in Python

The `<=` and `>=` operators add a test for equality to the `<` and `>` operators. `a <= b` is `True` if either `a < b` or `a == b` is `True`. Meanwhile, if either `a > b` or `a == b` is `True`, then `a >= b` is also `True`. The same rules used to measure equality or make comparisons with the different types apply here as well.

The following example explains how the `<=` comparison works in practice. The `>=` operator works similarly.

    a = 5
    b = 3
    print(a <= b)

{{< output >}}
False
{{< /output >}}

    a = 3
    print(a <= b)

{{< output >}}
True
{{< /output >}}

### Logical Operators in Python

Python's logical operators are used to evaluate Boolean expressions. They perform simple Boolean arithmetic on one or two inputs and return either `True` or `False`. Logical operators can be chained together to form even longer expressions.

The logic of each operator can be demonstrated using a *Truth Table*. The truth table for a given operation lists the output for each possible combination of inputs. It is used to analyze Boolean functions in an easy-to-understand format. Boolean expressions can be created in Python from the three main logical operators.

- **`and`**: This is the Python "logical and" operator. It returns `True` if both expressions are `True` and `False` otherwise.
- **`or`**: The Python "logical or" operator returns `True` if either expression is `True` and `False` otherwise.
- **`not`**: Python's "logical not" operator returns `True` only if the expression it is evaluating is `False`.

#### The and Operator in Python

The `and` operator verifies whether both expressions are `True`. The expression `a and b` evaluate to `True` only in the case where `a` is `True` and `b` is also `True`, and `False` otherwise. `a` and `b` are usually both expressions as well. They are sometimes known as *inner expressions*. The inner expressions are evaluated first and become the inputs to the main logical expression.

A simple truth table can express how `a and b` are calculated given different values of `a` and `b`. The table below displays the result of `a and b` for each of the four possible combinations.

| a | and | b | a and b |
|:-:|:-:|:-:|:-:|
| True | and | True | True |
| True | and | False | False |
| False | and | True | False |
| False | and | False | False |

The `and` operator is frequently used between two comparison operators, but `a` and `b` can take the form of any expression that evaluates to a Boolean value. Here is an example illustrating how the `and` operator is used. Because `a` is equal to `b` and `c` is equal to `d`, the result of the `and` operation is `True`. After the value of `b` changes, it is no longer equal to `a`. `a == b` is now `False`, and therefore the result of the whole `and` operation is `False`.

    a = 3
    b = 3
    c = 4
    d = 4
    print((a == b) and (c == d))

{{< output >}}
True
{{< /output >}}

    b = 4
    print((a == b) and (c == d))

{{< output >}}
False
{{< /output >}}

#### The Or Operator in Python

For the result of an `or` operator to be `True`, one or both of the expressions must be `True`. The `or` operator uses "inclusive or" logic. Therefore `a or b` is `True` if `a` is `True`, `b` is `True`, or if both `a` and `b` are `True`. If `a` and `b` are both determined to be `False`, then `a or b` is `False` too.

The following truth table demonstrates how the result of the `or` operation changes with different inputs.

| a | or | b | a or b |
|:-:|:-:|:-:|:-:|
| True | or | True | True |
| True | or | False | True |
| False | or | True | True |
| False | or | False | False |

{{< note respectIndent=false >}}
Python does not have an "exclusive or" operator, also known as a "xor". To satisfy an "exclusive or" test, one but not both of the arguments must be `True`. Certain Python libraries provide this function. A "xor" function can also be derived from the other operators.
{{< /note >}}

    a = 3
    b = 3
    c = 4
    d = 5
    print((a == b) or (c == d))

{{< output >}}
True
{{< /output >}}

    b = 4
    print((a == b) or (c == d))

{{< output >}}
False
{{< /output >}}

#### The not Operator in Python

The `not` operator is the easiest operator to understand. It accepts one Boolean expression and returns the opposite Boolean value. The expression `not a` is `True` if `a` is `False`, and `False` if `a` is `True`. The truth table for `not` is extremely simple.

| not| a | not a |
|:-:|:-:|:-:|
| not | True | False |
| not | False | True |

The following examples demonstrate how to use the `not` operator. They take advantage of the fact that a non-zero integer evaluates to `True`, while zero is `False`. When `a` is `3`, `not a` is `False`. But when `a` is set to `0`, `not a` becomes `True`.

    a = 3
    print(not(a))

{{< output >}}
False
{{< /output >}}

    a = 0
    print(not(a))

{{< output >}}
True
{{< /output >}}

{{< note respectIndent=false >}}
Sometimes Python logical operators can return a result without evaluating both inputs. This is known as *short-circuiting*. For instance, when evaluating an `or` expression, Python can return `True` as soon as any expression evaluates to `True`. This guarantees the `or` expression is `True` no matter what the second argument is. This optimization speeds up execution. Unfortunately, it can also lead to subtle bugs, such as crashes that only occur when the second clause is evaluated.
{{< /note >}}

Do not confuse the Python logical operators with the bitwise operators. These operators perform logical operations on the individual bits of two numbers or two-bit fields. The "bitwise and" operator is `&`. It evaluates to `1` if both bits are set to `1`. They are often used to *mask out*, or ignore certain values. Here is a list of all of the bitwise operators.

- **`&`:** Bitwise and.
- **`|`:** Bitwise or.
- **`^`:** Bitwise xor. It evaluates to `True` if exactly one of the two bits is `True`.
- **`~`:** Bitwise not. This operator is used to negate each bit for the purpose of "bit flipping".

There are a couple of other logical operators that are useful in certain circumstances. The `is` operator is used to confirm whether two entities refer to the same object. `x is y` is `True` if `x` and `y` are the same object. The `in` operator verifies membership and is typically used with collections such as Lists and Sets. If `x in y` is `True`, it means `x` is one of the entries in the list `y`.

## Using Boolean Operators in Conditional Statements

The most important role for Boolean operators is for their use in *conditional statements*. When a Boolean expression evaluates to `True` or `False`, it can be used to control the flow of a program. Boolean expressions are used in `if` and `else` statements as well as in loops.

The conditional statement typically precedes a *clause*, which is a block of one or more lines of code. The Boolean value of the conditional statement determines the clause to be executed if any. For more information on the various conditional statements, see the [Python documentation for compound statements](https://docs.python.org/3/reference/compound_stmts.html).

### If or Else in Python

The `if` and `else` statements are common place in any program. If the result of the conditional statement following the `if` keyword is `True`, the associated code block is entered and executed. The `if` conditional can be followed by one or more `elif` statements, which stands for "else if". Each `elif` conditional is tested in turn until one evaluates to `True`. The corresponding `elif` code block is then executed. As soon as Python reaches an `else` statement, it automatically executes the `else` code block. If all of the `if` and `elif` statements are `False` and there is no `else` statement, nothing is executed. Program control skips over to the next line of code.

The example below demonstrates how the `if` statement works with a conditional. The `if` statement evaluates the conditional operator `humidity > 80`. In this case, `humidity` is greater than `80`, so the conditional is `True`. Control passes to the indented code block and the line `It is a humid day` is printed.

    humidity = 85
    if humidity > 80:
    ... print("It is a humid day")

{{< output >}}
It is a humid day
{{< /output >}}

A more complicated series of conditional statements are shown in the `py_temp.py` file below. A `for` loop processes a list of three humidity readings. The `if` conditional statement subsequently processes each value. If the reading is greater than `80`, it satisfies the `if` statement, and Python prints `This humidity is too high`. If not, the `elif` statement tests whether `humidity` is under `60`. If it is, Python prints `This humidity is too low`. In all other cases, control passes to the `else` statement and Python prints the line `This humidity is just right`.

The following example demonstrates how the program works using a list of `[50, 70, 90]`. The first value satisfies the `elif` conditional, while the final value passes the `if` conditional. The second value is `False` for both tests, so control passes to the `else` clause.

{{< file "py_temp.py" python >}}
humidities = [50, 70, 90]

for humidity in humidities:
    if humidity > 80:
        print(humidity, ": This humidity is too high")
    elif humidity < 60:
        print(humidity, ": This humidity is too low")
    else:
        print(humidity, ": This humidity is just right")
{{< /file >}}

{{< output >}}
50 : This humidity is too low
70 : This humidity is just right
90 : This humidity is too high
{{< /output >}}

Although these examples use the `if` statement, other control structures can also use conditional statements. For example, the `while (condition)` statement continues to loop through the subsequent block of code as long as `condition` continues to evaluate to `True`.

## A Summary of Python's Boolean Operators and Conditionals

Boolean expressions and operators are indispensable when writing a Python program. The two Boolean values in Python are `True` and `False`, and a Python Boolean expression always evaluates one of those two values. Python's `bool` operator can be used to determine the Boolean value of an expression. Python maintains certain rules for determining the truth of an expression. For example, a non-zero integer is always `True`.

Python provides a full selection of comparison and logical operators. Python's comparison operators compare two values. They include the equality `==`, inequality `!=`, greater than `>`, greater or equal to `>=`, less than `<`, and less than or equal to `<=` operators. Python logical operators perform Boolean logic on Boolean values. The `and` operator returns `True` only in the case where both expressions are also `True`. However, the `or` operator returns only `False` when both expressions are `False`. The `not` operator inverts the value of its input. Boolean operators are frequently used as input for conditional statements like `if`, `elif`, and `while`.

For more information about Boolean values and expressions in Python, see the [Python Language Reference](https://docs.python.org/3/reference/index.html).