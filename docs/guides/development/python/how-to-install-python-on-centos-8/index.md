---
slug: how-to-install-python-on-centos-8
description: 'CentOS 8 does not come with Python installed. This guide shows how to install Python 3.9 from source, or Python 3.6 from the CentOS package repository.'
keywords: ['How to Install Python on CentOS 8','Python','Python 3','Python 2 end of life']
tags: ['python', 'centos']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-02-12
image: InstallPython3_CentOS8.png
modified_by:
  name: Linode
title: "Installing Python 3 on CentOS 8"
title_meta: "How to Install Python 3 on CentOS 8"
relations:
    platform:
        key: how-to-install-python
        keywords:
            - distribution: CentOS 8
authors: ["Angel Guarisma"]
---

Python is a popular programming language created in 2000, by Guido van Rossum. It's useful for writing everything from small scripts to full-scale software. Python is also a commonly adopted programming language by people entering into the field of software development. A lot of its popularity is based on Python's high level of abstraction. This abstraction makes writing and reading the code easier than other languages.

As of January 1, 2020, the official version of Python is Python 3. Python 2 is no longer a supported language. This guide walks you through installing the latest version of Python 3 on Debian 10. If you are interested in porting your already existing Python 2 code to Python 3, please refer to the [official documentation](https://docs.python.org/3/howto/pyporting.html) on how to do so.

Unlike other Linux distributions, CentOS 8 does not come with a version of Python installed. Currently Python 3.9 is the latest major version of Python. This guide shows two options for installing Python 3 on CentOS 8:

- [How to install Python 3.6](#how-to-install-python-36) from the CentOS package repository. Python 3.6 is the most recent version of Python in the CentOS package repository is Python 3.6.

- [How to build and install Python 3.9](#how-to-install-python-39) from the source code. Python 3.9 includes support for many [major changes](https://docs.python.org/3/whatsnew/3.9.html) in the Python programming language.

## Before You Begin

1.  This guide assumes that you have access to a server or workstation running CentOS 8. To provision a Linode running CentOS 8, follow our [Getting Started](/docs/products/platform/get-started/) guide.

1.  This guide uses `sudo` wherever possible. Complete the sections of our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) to create a standard user account, harden SSH access, and remove unnecessary network services.

1.  Update your system:

        sudo yum update

## How to Install Python 3.9

You need to build Python 3.9 from source to install it on CentOS 8.

1. Download the dependencies to build the package:

        sudo dnf groupinstall 'development tools'
        sudo dnf install wget openssl-devel bzip2-devel libffi-devel

1. Download Python version 3.9:

        sudo curl https://www.python.org/ftp/python/3.9.1/Python-3.9.1.tgz -O

1. Extract the Python package:

        tar -xvf Python-3.9.1.tgz

1.  Change into the Python directory:

        cd Python-3.9.1

1. Run the configuration script and run the build process:

        sudo ./configure --enable-optimizations
        sudo make install

    {{< note respectIndent=false >}}
If you have an already existing Python binary installed at `/usr/bin/python` or `/usr/bin/python3`, you should run `sudo make altinstall` instead.
{{< /note >}}

1.  After the installation is finished, you can run the command `python3 -V` and verify the installation:

        python3 -V

    The output looks like this:

    {{< output >}}
Python 3.9.1
{{< /output >}}

## How to Install Python 3.6

If you do not need the latest version of Python, you can install Python 3.6 using the CentOS repository. This version is included in the CentOS repository by default. While this installation method is easier than the previous *from source* method, it is not the latest version. Install version 3.6 by running the following command:

    sudo dnf install python3

If you haven't installed any other version of Python, you can verify this installation by typing:

    python3 -V

And the shell returns:
{{< output >}}
Python 3.6.8
{{< /output >}}

## Additional Information

Installing multiple versions of Python 3 is not recommended. It's best to manage multiple versions with tools like [pyenv](https://github.com/pyenv/pyenv) or [anaconda](https://www.anaconda.com/).

If you installed Python 3.9 by compiling from source, the installed binary is located at `/usr/local/bin/python3`. If you installed Python 3.8 from the CentOS package repository, the installed binary is located at `/usr/bin/python3`.

### How to Install Python 2

You may require Python 2 as a dependency for older code or software. If this is the case, you can install it with the following command:

    sudo dnf install python2

Run `python2 -V` to check the version:

    python2 -V

The output looks like the following:

{{< output >}}
Python 2.7.17
{{< /output >}}

It's important to remember that Python2 is no longer supported by the Python foundation. Therefore, there are no new updates or fixes. Applications are making the switch to Python 3, and distributions like Ubuntu 20.04 and CentOS 8 are no longer shipping with Python 2 by default.
