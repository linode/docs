---
slug: installing-and-importing-modules-in-python-3
description: 'Learn how to install modules in Python 3 and import them using `import`, `from import`, and `import as`.'
keywords: ['Python import module', 'Python modules', 'Python install module', 'Python math']
tags: ['python']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-01-28
modified_by:
  name: Linode
title: "Install and Import Modules in Python 3"
title_meta: "How to Install and Import Modules in Python 3"
external_resources:
- '[Python Documentation on Modules](https://docs.python.org/3/tutorial/modules.html)'
- '[List of Python Built-in Modules](https://docs.python.org/3/py-modindex.html)'
authors: ["Jeff Novotny"]
---

Except for very short and simple programs, most [Python](https://www.python.org/) applications contain code from many files, directories, and packages. Related functions and attributes are often grouped together as part of a Python *module*. A programmer can *import* this module and use its functions and variables in their application. This guide provides an introduction to Python modules and explains how to install and import modules in Python.

## An Introduction To Python Modules

A Python module is a file containing Python code. This file can potentially include functions, variables, classes, constants, and executable code. Most applications and development projects use modules. As the name suggests, modules are self-contained, and are designed to be reused by other applications. The Python `pip` utility is used to install a module, but the `import` command is used to actually import the module.

Python includes some built-in standard modules. These modules are part of the [*Python Standard Library*](https://docs.python.org/3/library/), also known as the Library Reference. Some popular modules include the Python `os` module, `time` module, and `math` module. But programmers can also build their own modules or use modules from other developers. Python modules can be imported into the main module or other stand-alone modules.

Python modules are named the same way as other Python files. The filename for a module consists of the module name followed by the `.py` extension, for example, `module_name.py`. A module maintains its own [symbol table](https://docs.python.org/3/library/symtable.html), which serves as the global symbol table inside the module. Each module is also a Python namespace.

{{< note respectIndent=false >}}
A Python namespace is a dictionary of the object names and the actual objects.
{{< /note >}}

When an application imports a module, it has access to the entire contents of the module. It can use the module's functions and variables the same way as any other Python code. No further processing of the code is required.

Some of the reasons to use Python modules include the following:

- They allow for the reuse of code, which speeds up development.
- Modules make it easier to structure code in an organized and efficient manner. Similar functions and variables can be grouped within a module.
- A modular structure assists with maintainability.
- Modules help reduce the size of the local symbol table.
- They allow individual functions to be imported without the rest of the module.
- Modules reduce the chance of accidental naming collisions with local or global variables.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

1.  Ensure Python is properly installed on the Linode and you can launch and use the Python programming environment. To run Python on Ubuntu, use the command `python3`. For information on how to use Python, see our guide on [How to Install Python 3 on Ubuntu](/docs/guides/how-to-install-python-on-ubuntu-20-04/).

{{< note respectIndent=false >}}
The steps in this guide are written for non-root users. Commands that require elevated privileges are prefixed with `sudo`. If you are not familiar with the `sudo` command, see the [Linux Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## Install Modules in Python 3

The `pip` package manager is the best way to install Python 3 modules. However, modules that do not support `pip` can still be installed locally as long as they provide a `setup.py` file.

Python includes a large number of useful standard modules, which are known as the Library Reference. These modules do not have to be installed and are available to import and use as long as Python is installed on your system. A good example of a standard Python module is the `math` module.

These instructions are geared toward Ubuntu users but are generally applicable for most Linux distributions.

### Install Modules with pip

1. Ensure the `pip` module is already installed. `pip` can be installed using the [APT package manger](/docs/guides/apt-package-manager/).

        sudo apt install python3-pip

1. Verify the release of `pip` to ensure it is installed correctly.

        pip3 --version

    {{< output >}}
pip 20.0.2 from /usr/lib/python3/dist-packages/pip (python 3.8)
{{< /output >}}

1. Install the new Python module using the command `pip install <module-name>`. The following example demonstrates how to install the `ffmpeg-python` module, which is used for media processing tasks.

        pip install ffmpeg-python

    {{< output >}}
Successfully installed ffmpeg-python-0.2.0
{{< /output >}}

1. To list all installed Python modules and packages, use the `pip list` command.

        pip list

    {{< output >}}
Package                Version
---------------------- --------------------
attrs                  19.3.0
Automat                0.8.0
...
zope.interface         4.7.1
    {{< /output >}}

### Install Modules Locally

If a module cannot be installed using `pip`, there is almost always a way to install it locally. To install a module locally, download it and run the associated `setup.py` script.

The following example explains how to install the Python [kubernetes-client](https://github.com/kubernetes-client/python) module without using `pip`.

{{< note respectIndent=false >}}
Like most modules nowadays, this module is also available through `pip`. It can be installed using `pip install kubernetes`. It is always worth verifying whether a module is available through `pip` first. The following instructions are provided as a resource for cases where the module can only be installed locally.
{{< /note >}}

1. Download the package and extract it into a local directory. This particular example uses `git`, but different modules provide different download instructions.

        git clone --recursive https://github.com/kubernetes-client/python.git

1. Consult the installation directives for the module to determine the location of the `setup.py` file. In this case, it is located in the `python` directory.

    {{< note respectIndent=false >}}
If the module does not have a `setup.py` file, consult the instructions on the Python site. See the sections on [Custom Installation](https://docs.python.org/3/install/#custom-installation) and [Modifying Python’s Search Path](https://docs.python.org/3/install/#modifying-python-s-search-path).
    {{< /note >}}

        cd python
1. Install the module using the `python install` command.

    {{< note respectIndent=false >}}
This particular module also requires the `requests` module. It is not uncommon for locally-installed modules to require the installation of other modules before they can be used.
    {{< /note >}}

        python setup.py install --user

## Import Modules in Python 3

All modules, whether they are installed using `pip` or are part of the Library Reference, must be imported before they can be used in a file. A Python file can import an entire module or individual functions from a file.

### Import a Module Using “import”

The `import` directive is used to import an entire Python module. Python can import a built-in module, third-party modules, or a module you have created.

To import a module, add the line `import module_name` near the top of the file. When a module is imported, the Python interpreter first searches for a built-in module sharing the same name. If it does not find one, it then searches through the locations listed in `sys.path`. `sys.path` always includes the directory of the input script.

The following example shows how to import the Python `math` module using the interactive console.

    import math

As soon as a file has imported a module, it can use any of the module's functions. To use a function from the module, specify the name of the module, along with the `.` symbol and then the function name. This notation is required because Python considers the new module to be a separate namespace. In this example, `math.factorial` references the `factorial` function from `math`.

    math.factorial(9)
{{< output >}}
362880
{{< /output >}}

To see a list of imported modules, use the `dir` command. It displays all the currently-defined names inside the current namespace.

    dir()
{{< output >}}
['__builtins__', '__doc__', '__name__', '__package__', 'math']
{{< /output >}}

To see what functions are available in a module, use the `dir` function and enclose the name of the module in brackets. The module must be imported before this command can be used.

    dir(math)
{{< output >}}
['__doc__', '__name__', '__package__', 'acos', 'acosh', 'asin', 'asinh', 'atan', 'atan2', 'atanh', 'ceil', 'copysign', 'cos', 'cosh', 'degrees', 'e', 'erf', 'erfc', 'exp', 'expm1', 'fabs', 'factorial', 'floor', 'fmod', 'frexp', 'fsum', 'gamma', 'hypot', 'isinf', 'isnan', 'ldexp', 'lgamma', 'log', 'log10', 'log1p', 'modf', 'pi', 'pow', 'radians', 'sin', 'sinh', 'sqrt', 'tan', 'tanh', 'trunc']
{{< /output >}}

The same approach is used to import and use a module inside a file. Here is a sample file containing the same functionality:

{{< file "factorial.py" python >}}
import math

n = math.factorial(9)
print(n)
{{< /file >}}

There are a few additional issues to keep in mind when importing and using modules.

-  Functions and variables in submodules are accessed the same way, with a `.` between the module and submodule. Use the syntax `module.submodule.function`.
-  If the module does not exist, Python displays the error `ImportError: No module named modulename`.
- An `AttributeError` error is displayed if a function that does not exist within the referenced module.
- When creating and importing a module, do not give it the same name as another module. This hides the original module, which means its attributes are no longer accessible. This is referred to as *shadowing* and is almost always undesirable.
- For the reasons of readability and maintainability, place all `import` statements at the start of the module.
- [*PEP 8*](https://www.python.org/dev/peps/pep-0008/) style guidelines recommend importing each module on a separate line, even though it is possible to separate module names using a comma. The guidelines also recommend ordering modules alphabetically within groups. Standard library modules should be listed first, followed by third-party modules, and then local applications.
- Within a module, the global variable `__name__` contains the name of the module.
- If a Python module contains executable code, it can run as a script using `python module_name.py`. Under these circumstances, `__name__` is set to `__main__` instead of the name of the module.
- Importing a module adds the module name to the importing module's symbol table, but it does not add the individual functions or variables.
- Each module is only imported once per session. If the library changes during interactive development, reload it using `importlib.reload(modulename)`, or by exiting and restarting Python.
- For more information about importing and using modules, see the [Official Python Documentation on Modules](https://docs.python.org/3/tutorial/modules.html).

To see a complete list of all built-in Python modules, consult the [Python Module Index](https://docs.python.org/3/py-modindex.html).

### Import a Module Using “import from”

Python also provides programmers with the ability to import individual functions from a module without importing the module itself. Each function imported this way is added to the importing module's symbol table. This method allows the function to be invoked directly without using "dot notation". The module name is no longer required in front of the function name. However, this approach does not provide access to other functions in the module or even the module itself.

To import an individual function from a module, add the line `from <module_name> import <function_name>` to the file. The following instructions demonstrate how to import and use the `factorial` function from the `math` module. Python's interactive mode is used for this example.

    from math import factorial

To use `factorial`, call the function directly the same way as a local function.

    print(factorial(8))
{{< output >}}
40320
{{< /output >}}

It is possible to import every single function from a module without importing the actual module using the "wildcard import" technique. The syntax for this command is `from module_name import *`. This technique can be useful in interactive mode or during script development to save time. However, the PEP 8 style guide does not consider this to be a good programming practice. It can hide functions that are already defined in the program and bloat the local symbol table.

It is also possible to give a function an easier name to avoid retyping the module name. Import the entire module, and reassign the function name using `new_func_name = module_name.old_func_name`. This creates a new entry in the symbol table and overwrites any pre-existing function sharing the same name, so use this technique carefully.

### Import a Module Using “import as”

The `import as` command allows programmers to supply a module or a function with an alias when it is imported. This technique is also referred to as *aliasing* a module. This strategy shortens the name of the module to make it easier to type. It can also reconcile naming conflicts with other modules or local functions and variables.

To import and alias a module, use the syntax `import <module_name> as <alias>`. From then on, use the alias to refer to the module. The following example demonstrates how to import the Python `time` module and give it the alias `t`.

    import time as t

To use the functions inside `time`, use the alias `t` along with "dot notation" and the function name. The following call to `t.time` displays the system time in seconds as a floating-point number.

    print(t.time())
{{< output >}}
1637324618.8210588
{{< /output >}}

Functions can also be aliased in this manner. To apply the alias `rint` to `random.randint`, use the `from ... import ... as` construction. The alias is then used to refer to the imported function whenever it is required.

    from random import randint as rint
    print(rint(1,10))
{{< output >}}
2
{{< /output >}}

### Import Variables, Functions, and Classes Using Import

The same methods that apply to modules are also used with variables, functions, and classes. Functions are typically imported as part of an entire module or through the use of the `import ... from` directive. Classes are typically imported using the `from` command.

The following example explains how to import the `config` class from the `kubernetes` module. The `kubernetes` module can be installed using the command `pip install kubernetes`.

    from kubernetes import config

The `config` class can now be used in the local program as if it were defined locally.

## Concluding Thoughts About Python Modules

Python modules are used to organize and structure larger programs. Some modules are built-in and are part of the Python library. Other third-party modules must be installed first. Python's `pip` utility is used to install most modules. If a module is not available via `pip`, it can be installed locally.

To make use of the functions in a module, Python must import the module first. The `import` command is used to import an entire module. Specific functions can be imported from a module using the `from <module> import <function>` command. When a module or function is imported, it becomes part of the local symbol table and can be used as a local object. Modules or functions can be given an alias using the `from ... import ... as` directive. The alias can then be used to refer to the imported object. For more information on Python modules, consult the [Python documentation on modules](https://docs.python.org/3/tutorial/modules.html).