---
slug: how-to-write-and-run-python-script
description: 'This guide explains how to write and run a Python script. It explains how to install and use modules and how to incorporate important Python features.'
keywords: ['python', 'how to write a python script', 'how to run a python script', 'understanding python']
tags: ['python']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2023-04-03
modified_by:
  name: Linode
title: "How to Write and Run a Python Script"
external_resources:
- '[Python.org web site](https://www.python.org/)'
- '[Python documentation](https://docs.python.org/3/contents.html)'
- '[Python Beginner Guide](https://wiki.python.org/moin/BeginnersGuide)'
- '[Python downloads page](https://www.python.org/downloads/)'
- '[Python data structure documentation](https://docs.python.org/3/tutorial/datastructures.html)'
- '[Python top-level code environment documentation](https://docs.python.org/3/library/__main__.html)'
- '[Python module documenation](https://docs.python.org/3/tutorial/modules.html)'
authors: ["Jeff Novotny"]
---

[Python](https://www.python.org/) is one of the most popular programming languages due to its ease of use and a large selection of built-in features. This guide describes the basic concepts behind Python, including how to install and use Python modules. It also explains how to write and run a Python script.

## Understanding How Python Works

Python is a good example of a modern high-level programming language. It is open source and is designed for general use, capable of working in many domains. Python is simple and easy to use and is highly readable, so it is considered a good language for beginners. Python is packed with useful built-in features, but it can also be extended through the use of modules. Python is dynamically-typed, platform-independent, and supports *Object-Oriented Programming* (OOP) techniques. Check the [More Information](/docs/guides/how-to-write-and-run-python-script/#more-information) section of this guide for some of the Python tutorials and reference materials.

Python is an interpreted language that allows users to write and run scripts interactively. Interpreted languages are processed by an interpreter, not compiled. Users can run a program as soon as they write it, with no intermediate steps. Python interpreters evaluate Python scripts. Scripts are plain text files that are written in a text editor or an interactive development environment. Every script contains a sequence of commands written in the Python programming language. Due to Python's interpreted nature, Python scripts are completely portable from one system to another. Only the source code and a Python interpreter are required to run a Python script.

The current iteration of the Python interpreter is Python 3, which was introduced in 2008. This is the version installed on most Linux distributions. Python 3 is not compatible with earlier releases and some older scripts require Python release 2. The specific release of the Python interpreter to use can be specified from the command line using either `python3` or `python2`. A Shebang on the first line of a Python script can also identify which interpreter to use.

{{< note >}}
Python 2 is now deprecated, so this guide focuses mainly on Python 3.
{{< /note >}}

The Python interpreter follows the *Python Execution Model*. It deciphers each line at runtime and executes the command. This differs from compiled languages like C/C++. The Python compilation stage happens at runtime and is hidden from the user. Python initially compiles a program to low-level *bytecode*. The *Python Virtual Machine* (PVM) then interprets and executes the bytecode. The PVM is platform-specific. Each platform must use its own version of the PVM. A Linux system must use the Linux variant of the interpreter to run Python scripts.

Python makes heavy use of external modules. Unlike a script, a module is not a stand-alone program. It contains functions and variables that are designed to be used in other programs.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note >}}
The steps in this guide are written for non-root users. Commands that require elevated privileges are prefixed with `sudo`. If you are not familiar with the `sudo` command, see the [Linux Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

{{< note >}}
The instructions in this guide are geared toward Ubuntu users but are generally valid for all Linux distributions. The Python interpreter is also available for Windows and macOS operating systems. The Python interpreter and interactive shell work in much the same way on these systems. However, some of the system commands and operational instructions might vary.
{{< /note >}}

## How to Install Python

Before running any Python programs, Python must be installed on the system. On most modern Linux distributions, Python is already pre-installed. To determine whether the interpreter is installed and up-to-date, use the `-V` option to verify the release number.

```command
python3 -V
```

```output
Python 3.10.4
```

If the `python3` command is not recognized, Python is not installed. This might be the case if the system has not been upgraded recently or if Python has been uninstalled at some point. To install Python release 3, run the following commands:

```command
sudo apt update && sudo apt upgrade
sudo apt install python3
```

## How to Install and Use Python Modules

After Python is installed, it is possible to use the Python `pip` package manager to download and install new modules and packages. `pip` is not installed by default and must be downloaded first. To download `pip`, use the command below:

```command
sudo apt install python3-pip
```

The `pip install` command downloads and installs new modules. The following command installs the Python-Markdown library. This module converts Markdown code to HTML. After it completes the installation process, `pip` provides a confirmation message.

{{< note >}}
Both Python 2 and Python 3 have their own version of `pip`. If both releases of Python are installed on the system, use the `pip3` command to install Python 3 modules. Otherwise, the `pip` command can be used because there is only one instance of Python and no chance of installing the incorrect module.
{{< /note >}}

```command
pip install markdown
```

```output
Successfully installed markdown-3.4.1
```

To access the parameters, classes, and methods from a module, use the `import` command. This command takes the form `import module_name`. Both third-party and built-in Python modules can be imported. `import` directives are traditionally near the top of a Python script. The example below demonstrates how to source and use the `markdown` module.

```command
import markdown
markdown.markdown('## Work Tasks')
```

```output
'<h2>Work Tasks</h2>'
```

For more detailed information on modules, see our [How to Install and Import Python Modules](/docs/guides/installing-and-importing-modules-in-python-3/) guide.

Development environments with many Python projects, packages and modules are often complicated to manage. Package conflicts can occur when new releases of existing packages overwrite older releases. Python *virtual environments* help manage these dependencies and avoid conflicts. For more information, review the Linode guide on [Managing Python Packages and Versions on Linux](/docs/guides/how-to-manage-packages-and-virtual-environments-on-linux/).

## How to Write a Python Script

Python scripts are plain text files ending with the extension `.py`. You can use any text editor or IDE to write a Python script. Python does not require any type of specialized or proprietary development environment.

Some Python programs include a *Shebang* as the first line. A Shebang begins with the characters `#!`. In a Python file, a Shebang tells the system which version of the interpreter to use. The Shebang `#!/usr/bin/env python3` indicates the `python3` interpreter should run the program. This ensures the correct Python interpreter is always used and avoids running a script with an incompatible interpreter. If a script does not contain a Shebang, the default interpreter is used.

In most cases, a simple Python script consists of the following elements:

- An optional Shebang, if used, must be the first line of the file.
- Optional `import` statements to source additional modules and classes.
- An optional list of constants. Python does not require programmers to declare variables before use. However, global variables are typically initialized here.
- A list of function definitions.
- The main body of the script. This section of code calls any supporting functions or class methods it requires.

The following is an example of a short demo program demonstrating some of the key components of a Python script. It accepts an input value from the user, takes the square root of the number, and multiplies it with a constant. It begins with a Shebang that guarantees the program uses the Python 3 compiler, and imports the `math` and `sys` modules. It declares the `square_and_multiply` function, accepts a value from the user, validates the value, and calls the function with the input value. It then prints the result to standard output.

```file {title="sqrt_multiply.py"}
#!/usr/bin/env python3

import math
import sys

MULTIPLIER = 5

def square_and_multiply(num):
    return math.sqrt(num) * MULTIPLIER

user_val = input("Enter a positive numerical value: ")
try:
    user_val = float(user_val)
except:
    sys.exit("The input is not a number")
if (user_val < 0):
    sys.exit("Negative numbers are not allowed")
res = square_and_multiply(user_val)
print("The result after taking the square root of the number and multiplying it is:", res)
```

{{< note >}}
Real-world Python applications should perform input validation and error handling. In this case, the `try` command handles any errors with non-numerical input.
{{< /note >}}

In most large programs, the main code block in the file consists solely of the conditional expression `if __name__ == "__main__"`. This expression only evaluates to `True` in the top-level environment of the program. A top-level environment occurs inside the interactive Python prompt, or inside a script that is passed as a file argument to the `python3` command. For the command `python3 program.py`, the top-level environment includes the code space inside the `program.py` file.

If this conditional evaluates to `True`, the script calls the "real" `main()` function. The `main()` function is only ever called in this situation. This technique prevents the program code from running when the script is sourced by the `import` command. `main()` contains the main block of program code. In a well-structured application `main()` primarily consists of calls to more specialized and modular functions. The supporting functions or classes contain most of the actual functionality.

Following is an example demonstrating how to implement this technique.

```file {title="program.py" lang="python"}
def main():
# Main body of code. Other functions and class methods are called from main.

if __name__ == "__main__":
    main()
```

{{< note >}}
`__name__` is also set to `"__main__"` under some other circumstances. It happens when a module is passed to the Python interpreter with the `-m` option and inside the `__main__.py` file of a Python package. For a full explanation of the technical details surrounding `__name__`, see the [Python top-level environment documentation](https://docs.python.org/3/library/__main__.html).

It is possible to give the `main()` function another name. However, following established conventions allows other developers to understand the script.
{{< /note >}}

### How to Use Common Python Control and Data Structures

Python programs are built out of fundamental control and data structures. Without these features, Python programs would be static and relatively trivial.

A control structure controls the execution flow of a program. Operators are used to making logical decisions. Data structures store and organize data, and often provide mechanisms to retrieve and manipulate the data.

- **Comparison Operations**: These operators are used to compare two variables or a variable and a constant. The `==` operator tests for equality, while `!=` tests for inequality. The `<` ("less than") and `>` ("greater than") symbols are relational comparators. For convenience, Python also provides the `<=` ("less than or equal") and `>=` ("greater than or equal") operators. Python allows programs to use comparison operators on strings, characters, and other objects. However, not all operations are valid on all objects. The Linode guide to [ Boolean Variables, Operators, and Conditional Statements in Python](/docs/guides/boolean-variables-in-python/) provides more options.
- **Conditional Statements**: Conditional statements use *Boolean expressions* to make decisions. These decisions determine the control flow of the program. If the result of the Boolean expression is *True*, the program runs a sequence of commands. If the result is *False*, it might run other lines of code, or it might do nothing at all. In Python, the most important conditional statement is the `if` statement, along with the `if not` and `if else` variants. For more information, see the Linode guide to [If Statements and Chained Conditionals](/docs/guides/if-statements-and-conditionals-in-python/).
- **Logical Operators**: Logical operators combine several comparison operations into larger compound statements. The main logical operators are `and`, `or`, and `not`. The expression` a and b` means `a` must be `True` and `b` must also be `True`. The expression `a or b` is `True` if either `a` or `b` is `True`, or if both are `True`. `not a` is only `True` when `a` evaluates to `False`. The Linode guide to [Boolean Variables, Operators, and Conditional Statements in Python](/docs/guides/boolean-variables-in-python/#logical-operators-in-python) introduces the logical operators.
- **Loop Statements**: Python loop statements execute a block of code zero or more times. A `for` loop is used when the number of repetitions is known before entering the loop. The `while` statement is better for situations where a loop keeps running until some condition is met. Loops can also iterate across a sequential data type such as a list or dictionary. The Linode guide to [For and While Loops](/docs/guides/python-for-and-while-loops/) provides more information.

Many programs use data structures to contain and organize a series of values. Simple data structures like strings and arrays are extremely commonplace. More complex data structures including stacks, queues, graphs, trees, and hash tables are used in specialized situations. The Linode guide to [Data Structures in Computer Programming](/docs/guides/data-structure/) explains data structures in more depth.

Python also features a large number of built-in data structures, including a list, set, and dictionary. Each data structure has its own built-in methods to implement core operations for the structure. Python modules provide access to more specialized data structures. Pre-existing data structures are ready-to-use. They help programmers save development and test time and avoid errors. See the [Python data structure documentation](https://docs.python.org/3/tutorial/datastructures.html) for additional information about the built-in types.

### How to Use Python Functions and Methods

Python programs can be as simple as a single block of code within a single text file. However, when programs grow more complex, a more modular design is encouraged. Modular programs prevent code duplication and are easier to write, test, debug, maintain, and enhance.

In Python, functions and methods are used to enhance modularity. A function is a stand-alone block of code that is not part of the main program. The code inside a function only runs when it is called. Functions accept arguments from the calling code and often return a value. The same function can be called from many different places in the code.

A Python function begins with the `def` keyword. Each line of the function body must be indented. The return value is preceded by the keyword `return`. A Python function looks like the following:

```file {title="function_demo.py"}
def sample_function(arg1, arg2):
    # Body of function
    return result
```

The calling code invokes a function by specifying the name of the function and passing the arguments in parentheses. A comma separates each argument. If there are no arguments to pass, the parentheses are left empty. To invoke `sample_function` and assign the result to `value`, use the following command:

```command
value = sample_function(param1, param2)
```

A method is very similar to a function, but it is bound to a class definition. A regular function is not associated with a class. Class methods are usually invoked differently. The name of the class must be explicitly stated along with the name of the method, using the format `value = class.class_method(param)`. Functions that are imported as part of a module are invoked in the same way. The name of the module or package precedes the function name. Following is an example demonstrating how to import the `math` module and use the module function `math.sqrt`.

```file {title="math_import.py"}
import math
result = math.sqrt(16)
print(result)
```

```output
4.0
```

## How to Run a Python Script

There are several ways to execute a Python script. One approach is to use the Python interactive shell. This is useful for developing scripts or for debugging problems. The interactive shell makes it possible to enter commands one at a time and review the results. The contents of an interactive session are only temporary. The session results and history are lost at the end of the session. However, the output from the session is often still visible in the terminal window.

Users can also launch Python scripts from the command line interface. For this method, use the `python3` command to run the script from the terminal. This launches the Python interpreter, which then executes the script. The script potentially prompts the user for information and displays the results to standard output.

### How to Use the Python Interactive Shell

To enter the Python interactive shell, use the command `python3`. The Python interactive prompt `>>>` should appear.

```command
python3
```

```output
Python 3.10.4 (main, Jun 29 2022, 12:14:53) [GCC 11.2.0] on linux
...
>>>
```

At this point, enter the Python commands one at a time. For example, the following command prints `Welcome to Python`.

```command
print("Welcome to Python")
```

```output
Welcome to Python
```

The interactive shell does not limit developers to simple print statements. It allows users to define and manipulate variables, run loops and conditional statements, and call functions. The following sequence defines variable `x` and sets it to `10`. It then sets `x` to `x + 2` and prints the resulting value. To display a value in the interactive print, enter the name of the variable. The value of `x` could also be printed using the command `print(x)`.

```command
x = 10
x = x + 2
x
```

```output
12
```

The interactive shell allows users to enter multiline statements like conditionals and loops. First, enter the conditional or iterative statement, then add all the commands within the associated code block, which is also known as a *suite*. All lines in the suite must be indented. The indented lines within a suite are known as *continuation lines*. Python changes the interactive prompt to three dots `...` to indicate the current command is a continuation line. After reaching the end of the block, use a backspace to terminate the block.

Following is an example of how to use a `for` loop in the Python interactive shell. The value of `val` increments by `2` ten times and increases from `2` to `22`.

```command
val = 2
for i in range(10):
...     val = val + 2

print(val)
```

```output
22
```

To exit an interactive session, enter the command `exit()` or `quit()`. On most systems, the command `CTRL-D` also terminates the session.

```command
exit()
```

### How to Run a Python Program Interactively

When using the Python interactive shell, users often enter lines one at a time. However, the interactive shell also allows the interactive execution of modules, functions, and methods using the `import` and `importlib` libraries.

The `import` command loads the specified module, but it also runs the module after loading it. Most built-in and third-party modules only consist of variables and methods/functions and do not display any output. However, when a script is imported, the Python interpreter processes it like it normally would. This means it requests user input and displays and outputs the same way it does when the script runs from the command line.

Python only runs the script the first time it is imported. For this technique to work, the script must be found either in the current working directory or somewhere within the *Python Module Search Path* (PMSP). The PMSP comprehensively lists all of the locations where Python scripts and modules might be found.

{{< note >}}
To see the directories in the PMSP, import the `sys` module and use the `sys.path` method.
{{< /note >}}

The example below imports the `sqrt_multiply` from the script that was used earlier in the guide. It immediately runs and prompts the user for a number.

```file {title="import_sqrt_multiply"}
import sqrt_multiply
```

```output
Enter a positive numerical value:
```

The `importlib` module provides a way to run a script multiple times. To use the `importlib` module inside the interactive shell, follow the steps below:

1.  Import the `importlib` module.

    ```command
    import importlib
    ```

1.  Use the `import_module` method to import and run a script. The example below uses `import_module` to import `sqrt_multiply`.

    ```command
    importlib.import_module('sqrt_multiply')
    ```

    ```output
    Enter a positive numerical value:
    ...
    <module 'sqrt_multiply' from '/home/testuser/sqrt_multiply.py'>
    ```

1.  To reload and run the script again, import the module and then use the `importlib.reload` method. Do not enclose the name of the script or module in quotes. This is because `reload` accepts the name of an object, not a string. The module object is created when the module is imported.

    ``command
    import sqrt_multiply
    importlib.reload(sqrt_multiply)
    ```

    ```output
    Enter a positive numerical value:
    ...
    <module 'sqrt_multiply' from '/home/testuser/sqrt_multiply.py'>
    ```

{{< note >}}
To find and run a Python module without importing it, use the built-in `runpy` module. The `run_module` and `run_path` methods in `runpy` are powerful but somewhat complicated. Consult the [Python runpy Documentation](https://docs.python.org/3/library/runpy.html) for more information.
{{< /note >}}

### How to Run a Python Program from the Command Line

Users can run any Python program non-interactively using the Python interpreter. To run a Python script from the terminal, use the `python3` command and the filename of a Python script. The interpreter processes the file contents and executes the instructions. The basic format of this command is `python3 python_program.py`.

For instance, the following program runs the program `py_v3.py`. The program below displays the current release of the Python interpreter.

```command
python3 py_v3.py
```

```output
This version of Python is:
3.10.4 (main, Jun 29 2022, 12:14:53) [GCC 11.2.0]
```

If a Python script includes a Shebang on the first line, it is not necessary to include the `python3` or `python2` keyword. The Shebang indicates the interpreter. Specify the full path of the file containing the Shebang to run the script. To use this method, the file must be executable. Use the `chmod +x` command to make the file executable.

```command
chmod +x py_v3.py
./py_v3.py
```

```output
This version of Python is:
3.10.4 (main, Jun 29 2022, 12:14:53) [GCC 11.2.0]
```

When running a Python script using the command line interface, `print` statements are redirected to the terminal window. However, sometimes users might want to save the output to a file. To redirect the standard output to a file, use the `>` symbol. The following command redirects the output from `py_v3.py` to `py_output.txt`. To append the output to an existing file, use the `>>` symbol instead.

```command
python3 py_v3.py > py_output.txt
```

Most modules are designed as libraries, not self-standing programs. However, it is possible to use the Python interpreter to run certain modules. To run a Python module like a program, use the `-m` option. However, this technique does not work on all modules.

### Running a Python Script Using Other Methods

The previous examples demonstrate how to run Python scripts from the command line. But there are some other ways to launch a Python program. Many of these methods require the Python file to use a Shebang and have the execute permission set.

- Scripts can be launched from an *integrated development environment* (IDE). These environments are common in professional software development. They make it easier to track, develop, and maintain larger applications. An IDE can launch a Python script using a button, icon, or link.
- Some text editors can run a script from inside the text editor window.
- File managers allow users to run Python scripts like any other application. Double-click on the filename of the script to run it. The script must be executable.
- A Python script can be executed as a cron job or invoked from a shell script or another application.

## Conclusion

Python is a powerful and flexible language that is easy to write and use. Python is an interpreted language, so Python scripts do not have to be compiled. Instead, a Python interpreter reads the script and translates it into bytecode at runtime. A Python interpreter must be installed on the system to run Python scripts.

To write a Python script, use an ordinary plain text file and add Python instructions. Scripts often make use of Python modules, which contain external functions, classes, and variables. The Python `pip` package manager can download and install modules, while the `import` command is used to access the contents of a module.

There are several ways to run a Python script. The Python interactive shell can execute individual commands or run entire scripts. This is a good method for development and testing, but all contents are lost when the shell is closed. The `python3` command is used to run Python scripts from the command line. For more information about writing and running Python scripts, see the [Official Python documentation](https://docs.python.org/3/contents.html).