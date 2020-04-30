---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Python 3 is the supported version of Python. This guide will show you how to verify the Python 3 installation on Debian 10, how to upgrade Python from 3.7 to 3.8, and how to locate the individual binaries for each installation'
og_description: 'This guide will walk you through Installing Python 3 on Debian 10'
keywords: ['How to Install Python on Debian','Python','Python3','Python 2 end of life']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-04-27
modified_by:
  name: Linode
title: "How to Install Python 3 on Debian 10"
h1_title: "How to Install Python on Debian 10"
contributor:
  name: Angel Guarisma
  link: Github.com/Guaris
---

Python is a popular programming language created in 2000, by Guido van Rossum. It's useful for writing everything from small scripts to full-scale software. Python is also a commonly taught programming language for people entering into the field of software development. A lot of it's poplularity is based on Python's high level of abstraction that makes writing and reading the code easier than other languages.

As of January 1, 2020, the official version of Python is Python 3. Python 2, is no longer a supported language. This guide will walk you through installing the latest version of Python 3 on Debian 10. If you are interested in porting your already existing Python 2 code to Python 3, please refer to the [official documentation](https://docs.python.org/3/howto/pyporting.html), on how to do so.

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started/) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server/) to create a standard user account, harden SSH access and remove unnecessary network services. Do **not** follow the Configure a Firewall section yet--this guide includes firewall rules specifically for an OpenVPN server.

3.  Update your system:

        sudo apt-get update && sudo apt-get upgrade

## How to Install Python 3

A fresh Debian 10 installation has both Python 2 and Python 3 installed by default. You can verify the specific versions of each by appending `--version` after typing `python` or `python3` in the shell.

For Python 2:

    python --version

{{< output >}}
Python 2.7.16
{{< /output>}}

or for Python 3:

    python3 --version

{{< output >}}
Python 3.7.3
{{< /output >}}

You can also launch the Python Interpreter, that will let you interact with Python from the command line. Try it by typing `python3` into the shell:

{{< output >}}
Python 3.7.3 (default, Dec 20 2019, 18:57:59)
[GCC 8.3.0] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>>
{{< /output >}}

In the interpreter you can write Python code in real time, like this:

    print('hello world')

And the interpreter will instantly return:

{{< output >}}
hello world
{{< /output >}}

You can exit the interpreter by typing:

    exit()

## How to Upgrade from Python 3.7 to 3.8

The latest stable version of Python 3 is 3.8. On a fresh Debian 10 install, the installed version of Python 3 is 3.7. There were a lot of [major changes](https://docs.python.org/3/whatsnew/3.8.html) between Python 3.7 and 3.8 that could be useful to take advantage of when writing code. Python 3.8 may become a dependency for certain applications running on your system as well. To upgrade our version of Python 3.7 to 3.8, we will need to add the ability to use Debian's testing repositories.

1. Open the `/etc/apt/sources.list` file with:

        sudo nano /etc/apt/sources.list

2. Add the testing repo by adding this text to the file:

        deb http://http.us.debian.org/debian/ testing non-free contrib main


    Your file should match this:


    {{< file "/etc/apt/sources.list" yaml>}}

# deb cdrom:[Debian GNU/Linux 10.3.0 _Buster_ - Official amd64 NETINST 20200208-12:07]/ buster main

#deb cdrom:[Debian GNU/Linux 10.3.0 _Buster_ - Official amd64 NETINST 20200208-12:07]/ buster main

deb http://mirrors.linode.com/debian buster main
deb-src http://mirrors.linode.com/debian buster main

deb http://mirrors.linode.com/debian-security buster/updates main
deb-src http://mirrors.linode.com/debian-security buster/updates main

# buster-updates, previously known as 'volatile'
deb http://mirrors.linode.com/debian buster-updates main
deb-src http://mirrors.linode.com/debian buster-updates main

# Debian Testing Non-Free

deb http://http.us.debian.org/debian/ testing non-free contrib main

# This system was installed using small removable media
# (e.g. netinst, live or single CD). The matching "deb cdrom"
# entries were disabled at the end of the installation process.
# For information about how to configure apt package sources,
# see the sources.list(5) manual.
{{< /file >}}

3. After editing the file, download the information for all of the packages available:

        sudo apt update

4. Upgrade Python 3:

        sudo apt upgrade Python3

    {{< note >}}
   Because Python3 requires a lot of dependencies you will be prompted to allow Debian to restart certain services. If you are not running any active proccesses, this is okay. Otherwise, you may decide to restart the services yourself.
   {{< /note >}}

5. Verify the Python version:

        python3 --version

    {{< output >}}
Python 3.8.2
{{< /output >}}


Now your Debian 10 system has the latest version of Python 3 installed. Because of Debian's commitment to stability, Python 2 is still installed on the system, there will be default packages that depend on Python 2. On Debian 10, Python 2 will continue to be supported past the EOL date of Python 2. It is not recommended to remove the Python 2 binary from your sytem, but instead interact with Python 3 using the `python3` command.

## Additional Information

On Debian 10, the binary for Python 2 is located at `/usr/bin/python`, and the binary for Python3 is located at `/usr/local/bin/python3`.

In this guide, you updated from Python 3.7 to Python 3.8 using the Debian Testing repository. There is another method that invovles compiling the binary from source. Both are acceptable methods, but compiling from source may introduce complexity if your previous version of Python had modules installed already. If you are compiling from source, it is important to understand that all public, meaning modules you want to use across your system, must be installed in the Python 3 Modules directiory: `/usr/lib/python3/dist-packages`.

