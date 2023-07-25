---
slug: how-to-install-python-on-ubuntu-20-04
description: "Python 3 is installed by default on Ubuntu 20.04. This guide shows how to invoke Python 3 on Ubuntu 20.04 and how to install the python-is-python3 package."
keywords: ['How to Install Python on Ubuntu','Python','Python3','Python 2 end of life']
tags: ['python', 'ubuntu']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-02-12
image: InstallPython3_Ubuntu2004.png
modified_by:
  name: Linode
title: "Install Python 3 on Ubuntu 20.04"
title_meta: "How to Install Python 3 on Ubuntu 20.04"
relations:
    platform:
        key: how-to-install-python
        keywords:
            - distribution: Ubuntu 20.04
authors: ["Angel Guarisma"]
---

Python is a popular programming language created in 2000, by Guido van Rossum. It's useful for writing everything from small scripts to full-scale software. Python is also a commonly adopted programming language by people entering into the field of software development. A lot of its popularity is based on Python's high level of abstraction. This abstraction makes writing and reading the code easier than other languages.

As of January 1, 2020, the official version of Python is Python 3. Python 2 is no longer a supported language. This guide walks you through installing the latest version of Python 3 on Ubuntu 20.04. If you are interested in porting your already existing Python 2 code to Python 3, please refer to the [official documentation](https://docs.python.org/3/howto/pyporting.html) on how to do so.

## Before You Begin

1.  This guide assumes that you have access to a server or workstation running Ubuntu 20.04 LTS. To provision a Linode running Ubuntu 20.04 LTS, follow our [Getting Started](/docs/products/platform/get-started/) guide.

1.  This guide uses `sudo` wherever possible. Complete the sections of our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) to create a standard user account, harden SSH access, and remove unnecessary network services.

1.  Update your system:

        sudo apt update && sudo apt upgrade

## How to Install Python 3

On brand new Ubuntu 20.04 installations, Python 3 is installed by default. You can verify by typing:

    python3 --version

{{< output >}}
Python 3.7.3
{{< /output >}}

You can also launch the Python Interpreter. The Python Interpreter, sometimes referred to as the Python Shell or the Python Interactive Shell, is a tool that lets you interact with Python from the command line. Try it by typing `python3` into the shell:

    python3

{{< output >}}
Python 3.8.2 (default, Jul 16 2020, 14:00:26)
[GCC 9.3.0] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>>
{{< /output >}}

The interpreter outputs the version number, the version of the C compiler that Python uses on Linux, and some initial commands to get started. The installed version of Python is `3.8.2`.

In the interpreter you can write Python code in real time. Try it by typing the following print statement:

    print('hello world')

The interpreter instantly returns the following output:

{{< output >}}
hello world
{{< /output >}}

You can exit the interpreter by typing the exit command:

    exit()

## Additional Information

When writing this guide, Ubuntu 20.04 was the latest LTS version of Ubuntu. It was also the first version where the previous version of Python, Python 2, was not installed by default. You may run into compatibility issues when installing applications that still use Python 2. These incompatibility issues mention errors such as:

{{< output >}}
This Package depends on python; however:
  Package python is not installed.
{{< /output >}}

This is because packages that depended on Python 2 labeled the Python 2 binary as `python`, and the Python 3 binary as `python3`.

On Ubuntu 20.04, the binary for Python 3 is located at `/usr/bin/python3`. In previous versions of Ubuntu, there was a symbolic link between `/usr/bin/python` and `/usr/bin/python3`. You can restore this symbolic link to help fix compatibility issues by installing the `python-is-python3` package with the following command:

    sudo apt install python-is-python3

Verify the installation worked by using the `python` command in the shell. This launches the interpreter:

{{< output >}}
Python 3.8.2 (default, Jul 16 2020, 14:00:26)
[GCC 9.3.0] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>>
{{< /output >}}

This allows you to use Python with both the `python` and `python3` commands. Most packages that rely on `python` to be installed in location `/usr/bin/python` should now be able to be installed and run without error.
