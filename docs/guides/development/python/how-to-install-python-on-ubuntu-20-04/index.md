---
slug: how-to-install-python-on-ubuntu-20-04
author:
  name: Linode Community
  email: docs@linode.com
description: 'This guide will walk you through Installing Python 3 on Ubuntu 20.04. Python 3 is the latest supported version of Python. On Ubuntu 20.04, Python 2 is no longer installed. This guide will also cover compatibility issues you may experience porting programs to Python 3 on Ubuntu 20.04'
og_description: 'Python 3 is the supported version of Python. This guide will show you how to verify the Python 3 installation on Ubuntu 20.04.'
keywords: ['How to Install Python on Ubuntu','Python','Python3','Python 2 end of life']
tags: ['python', 'ubuntu']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-10-06
modified_by:
  name: Linode
title: "How to Install Python 3 on Ubuntu 20.04"
h1_title: "Install Python 3 on Ubuntu 20.04"
contributor:
  name: Angel Guarisma
  link: https://github.com/Guaris/
relations:
    platform:
        key: how-to-install-python
        keywords:
            - distribution: Ubuntu 20.04
aliases: ['/development/python/how-to-install-python-on-ubuntu-20-04']
---

Python is a popular programming language built in 2000, by Guido van Rossum. It's useful for writing everything from small scripts to full-scale software. Python is also a commonly adopted programming language by people entering into the field of software development. A lot of its popularity is based on Python's high level of abstraction that makes writing and reading the code easier than other languages.

As of January 1, 2020, the official version of Python is Python 3. Python 2, is no longer a supported language. This guide walks you through installing the latest version of Python 3 on Ubuntu. If you are interested in porting your already existing Python 2 code to Python 3, please refer to the [official documentation](https://docs.python.org/3/howto/pyporting.html), on how to do so.

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started/) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide uses `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server/) to create a standard user account, harden SSH access, and remove unnecessary network services.

3.  Update your system:

        sudo apt-get update && sudo apt-get upgrade

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

This is because packages that depended on Python 2 labeled the Python 2 binary as `python`, and the Python 3 binary as `python3`. In previous versions of Ubuntu, there was a symbolic link between `python` and `/usr/bin/python`. You can restore this symbolic link to help fix compatibility issues by installing the `python-is-python3` package with the following command:

    sudo apt install python-is-python3

Verify the installation worked by using the `python` command in the shell. This launches the interpreter:

{{< output >}}
Python 3.8.2 (default, Jul 16 2020, 14:00:26)
[GCC 9.3.0] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>>
{{< /output >}}

This package creates a symbolic link between the Python 3 binary at `/usr/bin/python3` and `/usr/bin/python` where Python 2 used to be installed. This allows you to use Python with both the `python`, and `python3` commands. Most packages that rely on `python` to be installed in location `/usr/bin/python`, should now be able to be installed and run without error.
