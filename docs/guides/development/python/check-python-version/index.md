---
slug: check-python-version
description: "Knowing your Python version can make the difference between an application running or frustratingly failing. Thankfully, there is a quick command, and even some Python script, to check your currently installed Python version. Find out all you need to know about getting your Python version in this guide."
keywords: ['check python version','how to check python version','python version command']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-08-15
modified_by:
  name: Nathaniel Stickman
title: "Check Your Python Version"
title_meta: "How to Check Which Python Version Is Installed"
external_resources:
- '[phoenixNAP: How to Check Python Version in Linux, Mac, & Windows](https://phoenixnap.com/kb/check-python-version)'
- '[LearnPython: How to Check Your Python Version](https://learnpython.com/blog/check-python-version/)'
authors: ["Nathaniel Stickman"]
---

Python reigns as one of the most popular programming languages, with a wide range of programs and developer tools relying on it. In fact, your system likely already has at least one version of Python installed.

Many tools and Python development libraries require a particular version of Python. Thus, you may want to know where you can find information on your installed Python version. This can help you make decisions about compatibility, upgrades, and more.

This tutorial shows you how to check your Python version, for both Python 2 and Python 3. Here, you can find the command line method as well as a Python script method for retrieving the current Python version.

## How to Check the Python Version from the Command Line

The Python command comes with a command line option of `--version` that allows you to see your installed version.

It works just as straightforwardly as it sounds. Enter the following command from your command line, and you should get an output similar to the one shown below:

    python --version

{{< output >}}
Python 3.8.10
{{< /output >}}

### Python 2 vs Python 3

Some systems distinguish between Python 2 and Python 3 installations. In these cases, to check your version of Python 3, you need to use the command `python3` instead of `python`.

In fact, some systems use the `python3` command even when they do not have Python 2 installed alongside Python 3. In these cases, you only have the `python3` command.

The command for checking the installed version of Python 3 remains otherwise the same - just use `python3` with the `--version` option:

    python3 --version

## How to Check the Python Version from Python

You can also check your installed Python version from within Python itself. Using either a script or the Python shell, you can use one of the code snippets below to print your Python version.

Both options work equally well regardless of your system. The choice of which option to use really comes down to what format you want the output in.

### Using sys

The `sys` module has a variable you can reference to get the current Python version. Below you can see an example of how the `sys` module's `version` variable renders the current Python version. This code first imports the `sys` module then prints out the contents of the `version` variable:

```python
import sys

print(sys.version)
```

{{< output >}}
3.8.10 (default, Jun 22 2022, 20:18:18)
[GCC 9.4.0]
{{< /output >}}

As you can see, the `sys.version` variable contains more information about your installed Python version than just the number. For that reason, `sys` is a good module to turn to when you want more verbose version information.

### Using platform

The `platform` module includes a function that fetches the current version of Python. The example code below uses this function to print the current Python version number. It first imports the `platform` module; then, the `python_version` function returns the version number to the `print` function:

```python
import platform

print(platform.python_version())
```

{{< output >}}
3.8.10
{{< /output >}}

The output from the `platform.python_version` is more minimal compared to the `sys` module's `version` variable. This makes the `platform` module more useful for cases when you only need the version number. For example, this method helps when you want to design a program to parse the Python version and act accordingly.

## Conclusion

With that, you have everything you need for checking your current Python version. The steps above cover you whether you need to see the Python version from the command line or from within a Python script.

You can continue learning about Python with our collection of [Python guides](/docs/guides/development/python/). We cover everything from fundamental Python concepts to building Python web applications.
