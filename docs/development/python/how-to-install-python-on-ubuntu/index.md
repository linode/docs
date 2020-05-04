---
author:
  name: Linode Community
  email: docs@linode.com
description: 'This guide will walk you through Installing Python 3 on Ubuntu 20.04. Python 3 is the latest supported version of Python. On Ubuntu 20.04, Python 2 is no longer installed. This guide will also cover compatibility issues you may experience porting programs to Python 3 on Ubuntu 20.04'
og_description: 'Python 3 is the supported version of Python. This guide will show you how to verify the Python 3 installation on Ubuntu 20.0.'
keywords: ['How to Install Python on Ubuntu','Python','Python3','Python 2 end of life']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-04-27
modified_by:
  name: Linode
title: "How to Install Python 3 on Ubuntu 20.04"
h1_title: "How to Install Python on Ubuntu 20.04"
contributor:
  name: Angel Guarisma
  link: https://github.com/Guaris/
---

Python is a popular programming language built in 2000, by Guido van Rossum. It's useful for writing everything from small scripts to full-scale software. Python is also a commonly adopted programming language by people entering into the field of software development. A lot of it's popularity is based on Python's high level of abstraction that makes writing and reading the code easier than other languages.

As of January 1, 2020, the official version of Python is Python 3. Python 2, is no longer a supported language. This guide will walk you through installing the latest version of Python 3 on Ubuntu. If you are interested in porting your already existing Python 2 code to Python 3, please refer to the [official documentation](https://docs.python.org/3/howto/pyporting.html), on how to do so.

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started/) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server/) to create a standard user account, harden SSH access and remove unnecessary network services. Do **not** follow the Configure a Firewall section yet--this guide includes firewall rules specifically for an OpenVPN server.

3.  Update your system:

        sudo apt-get update && sudo apt-get upgrade

## How to Install Python 3

On brand new Ubuntu 20.04 installations, Python 3 is installed by default. You can verify by typing:

    user@localhost:~$ python3

If Python 3 is installed you will be greeted by the Python interpreter and your output should match this:

{{< output >}}
Python 3.8.2 (default, Mar 13 2020, 10:14:16)
[GCC 9.3.0] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>>
{{< /output >}}

The interpreter outputs the version number, and the version of the C compiler that Python uses on Linux, and some initial commands to get started. The installed version of Python is `3.8.2`.

The Python Interpreter, sometimes referred to as the Python Shell, or the Python Interactive Shell, is a tool that lets you interact with Python from the command line. Try it, type:

    print('hello world')

And the interpreter will instantly return:
{{< output >}}
hello world
{{< /output >}}

You can exit the interpreter by typing:

    exit()

## Additional Information

Ubuntu 20.04 is the latest LTS version of Ubuntu. It's also the first version where the previous version of Python, Python 2, is not installed by default. You may run in to compatibility issues installing applications that are still using Python 2. These incompatibility issues will mention:

{{< output >}}
This Package depends on python; however:
  Package python is not installed.
{{< /output >}}

This is because packages that depended on Python 2, labeled the Python 2 binary as `python`, and the Python 3 binary as `python3`. In previous versions of Ubuntu, there existed a symbolic link between Python, `python` and `/usr/bin/python`. You can restore this symbolic link to help fix compatibility issues by installing the `python-is-python3` package.

    sudo apt install python-is-python3

You can verify the installation worked by using the `python` command in the shell. This will launch the interpreter:

{{< output >}}

Python 3.8.2 (default, Mar 13 2020, 10:14:16)
[GCC 9.3.0] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>>

{{< /output >}}

This package creates a symbolic link between the Python 3 binary at `/usr/bin/python3` and where Python 2 used to be installed `/usr/bin/python`. This allows you to use Python with both the `python`, and `python3` commands. Most important packages that rely on `python` to be installed in `/usr/bin/python`, will be able to install.
