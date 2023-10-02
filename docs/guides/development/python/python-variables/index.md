---
slug: python-variables
description: "Variables form the backbone of programming. So how do they work and how do you use them effectively with Python? Find out in this guide covering Python variables from assignment through scope and type."
keywords: ['python variables', 'python variables naming convention', 'python variables case sensitive']
tags: ['python']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2023-04-04
modified_by:
  name: Nathaniel Stickman
title: "Getting Started with Python Variables"
external_resources:
- '[W3 Schools: Python Variables](https://www.w3schools.com/python/python_variables.asp)'
- '[Real Python: Variables in Python](https://realpython.com/python-variables/)'
- '[GeeksforGeeks: Python Variables](https://www.geeksforgeeks.org/python-variables/)'
- '[Tutorials Point: Python - Variable Types](https://www.tutorialspoint.com/python/python_variable_types.htm)'
authors: ["Nathaniel Stickman"]
---

Variables are what make programs capable of meaningful action and complexity. Understandably, you want to know how they work for any language you are working with.

Python variables are straightforward once you see their principles in action. This guide shows you the basics of Python variables, with everything from variable assignment to variable operations and scope.

## Assigning Variables

Python does not require variables to be declared ahead of time. Instead, you just need to assign a value to create a variable. You can do this simply with the `=` operator as shown in the example below:

```command
example_variable = "This is an example string variable."
```

Python automatically determines the type of the variable. In Python, you can also reassign a variable at any time, even to a different type. For instance, the following example reassigns the `example_variable` as an integer:

```command
example_variable = 5
```

You can also assign multiple variables simultaneously using commas to separate the variables and their respective values, like so:

```command
variable_one, variable_two, variable_three = 27, 8.3, "Example"

print(variable_one)
print(variable_two)
print(variable_three)
```

```output
27
8.3
Example
```

### Naming Conventions

In the section above, the variable names use a specific naming convention with underscores. You may also have seen variables named where each "word" after the first starts with an uppercase letter.

Python actually supports a wide range of possibilities for variable names, with the following being the only variable-naming rules enforced by Python:

- Python variables can be of any length

- Python variables can contain uppercase and lowercase letters, numbers, and underscores

- Python variables cannot begin with a number

- Python variable names are case sensitive

These naming rules give you a wide variety of ways to name variables in your Python code. However, best programming practices dictate that your code should adopt a single naming convention and apply it consistently throughout your codebase. Doing so tends to make code easier to read and navigate.

Python variables support three popular naming conventions:

- Camel case, where the first letter is lowercase and each subsequent word in a name begins with an uppercase letter.

    ```command
    exampleVariable = "This is a string variable."
    anotherExampleVariable = 31
    ```

- Snake case, where separate words are separated by underscores.

    ```command
    example_variable = "This is a string variable."
    another_example_variable = 31
    ```

- Pascal case, where each word in a variable name begins with an uppercase letter.

    ```command
    ExampleVariable = "This is a string variable."
    AnotherExampleVariable = 31
    ```

Python does not have an official naming convention, so you are free to choose between these.

However, if you are looking to align with more of the Python community, you may want to use the naming conventions of the PEP 8 standard. PEP standards are used frequently for Python development, and they provide the following naming conventions:

- Variable and function names should use *snake case*.

- Class names should use the *pascal case*.

## Working with Variables

Variables, once assigned, can be used almost anywhere within your Python code. For instance, the `print` function takes a string as an argument. As the example below shows, a variable containing a string can be substituted in place of a plain string.

```command
example_variable = "World"

print(example_variable)
```

```output
World
```

So, Python code can operate on variables just as it does directly on various data. Extending on the example above, here the string variable gets combined (or concatenated) with other strings, using the `+` operator's special role for strings. This allows you to use Python variables in strings:

```command
example_variable = "World"

print("Hello, " + example_variable + "!")
```

```output
Hello, World!
```

Similarly, variables can be used in number operations. Variables can even be assigned values based on number operations and also other operations.

```command
example_variable_one = 9
example_variable_two = 4

another_example_variable_one = example_variable_one * 3
another_example_variable_two = example_variable_two // 2

last_example_variable = another_example_variable_one + another_example_variable_two

print(another_example_variable_one)
print(another_example_variable_two)
print(last_example_variable)
```

```output
27
2
29
```

## Variable Scope

Like in many programming languages, Python variables have specific scopes. A variable's scope defines where in the code a variable can be accessed from. Usually, a variable's scope depends on where in the code the variable was declared/assigned, and this is the case in Python.

Variables have two different scopes in Python:

- Global scope: Any variable declared outside of a function or loop, at the "top level," is in the global scope. Global variables can be accessed anywhere within the Python code.

- Local scope: Any variable declared inside of a function or loop is in a local scope. Local variables can only be accessed within their local scope — within the function or loop where the variable was declared.

To illustrate, the following is an example that makes use of a global variable and two local variables. Follow along with the comments in the code for explanations of each part:

```file {title="python_variable_scope.py" lang="python"}
# Global variable, declared at the "top level," outside of any function or loop.
global_variable = "Hello, "

def some_function():
    # Local variable, declared within a function and accessible only within
    # that function.
    local_variable_one = "World"

    # A loop until the length of the local variable string is greater than 5.
    while len(local_variable_one) < 6:
        # Local variable, declared within a loop. The variable can only be
        # accessed within this loop, not within the surrounding function.
        local_variable_two = "!"

        # However, variables local to the surrounding scope, the function,
        # can be accessed within any contained loop or function.
        local_variable_one += local_variable_two

    # This statement has access to both the global variable and the local
    # variable for the function, but not the local variable for the loop.
    print(global_variable + local_variable_one)
```

## Variable Types

The examples above show how variables can vary in their data types. For instance, `example_variable_one` and `example_variable_two` in the [Working with Variables](#working-with-variables) section above use the *integer* data type. Meanwhile, `local_variable_one` and `local_variable_two` in the [Variable Scope](#variable-scope) section use the *string* data type.

Python is a dynamically-typed language, which means, in part, that you do not have to explicitly indicate the variable type. The program automatically, and dynamically infers the variable type. Nevertheless, understanding variables' types are crucial for making sure your code performs as desired.

Consider the following example. Running this code produces a type error. Why is that? It is because the code attempts to combine `example_variable_one`, a string, and `example_variable_two`, an integer. Each of these data types uses the `+` operator, but not for operations across data types.

```command
example_variable_one = "Hello, "
example_variable_two = 5

print(example_variable_one + example_variable_two)
```

```output
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
TypeError: can only concatenate str (not "int") to str
```

There are many more data types than integers and strings, and much more to know about them. To keep learning more, take a look at our [The Basics of Python Data Types](/docs/guides/python-data-types/) guide.

### Casting Variables

There is a way to easily remedy the code example shown above. You can *cast* many variables into the type you need for a given operation. In Python, casting means using a particular function to render one type as another.

The guide to Python data types linked above covers casting in more detail and depth. But, for now, you can see how to use it to effectively handle interactions between integers, and strings. This is perhaps the most common use case for casting.

The following rework of the example code above uses casting. The `str` method casts the integer variable, `example_variable_two`, as a string. Doing so allows number variables to be used as strings.

```command
example_variable_one = "Hello, "
example_variable_two = 5

print(example_variable_one + str(example_variable_two) + "!")
```

```output
Hello, 5!
```

## Conclusion

This guide has covered the foundations you need to start working with variables in Python, including variable assignment, variable operations, types, and scopes.

In addition to this guide, you may be interested in [The Basics of Python Data Types](/docs/guides/python-data-types/), or our other [guides on Python development](/docs/guides/development/python/). These can give you tools to elevate your Python skills and start making your Python code more effective.