---
slug: how-to-install-python-on-centos-8
author:
  name: Linode Community
  email: docs@linode.com
description: 'CentOS 8 does not come with Python installed. Python 3 is the only supported version of Python. This guide walks you through installing Python 3.8, the latest major release of Python, from source. And Installing Python 3.6 on CentOS 8 from the repository.'
og_description: 'This guide walks you through Installing Python 3 on CentOS 8'
keywords: ['How to Install Python on CentOS 8','Python','Python3','Python 2 end of life']
tags: ['python', 'centos']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-10-06
modified_by:
  name: Linode
title: "How to Install Python 3 on CentOS 8"
h1_title: "Installing Python 3 on CentOS 8"
contributor:
  name: Angel Guarisma
  link: https://github.com/Guaris/
relations:
    platform:
        key: how-to-install-python
        keywords:
            - distribution: CentOS 8
aliases: ['/development/python/how-to-install-python-on-centos8/']
---

Python is a popular programming language created in 2000, by Guido van Rossum. It's useful for writing everything from small scripts to full-scale software. Python is also a commonly adopted programming language by people entering into the field of software development. A lot of its popularity is based on Python's high level of abstraction which makes writing and reading the code easier than other languages.

As of January 1, 2020, the official version of Python is Python 3. Python 2, is no longer a supported language. This guide walks you through installing the latest version of Python 3 on CentOS 8. If you are interested in porting your already existing Python 2 code to Python 3, please refer to the [official documentation](https://docs.python.org/3/howto/pyporting.html), on how to do so.

Unlike other Linux distributions, CentOS 8 does not come with a version of Python installed. Currently Python 3.8 is the latest major version of Python. The CentOS package repository includes Python 3.6, but Python 3.8 includes support for many major changes in the Python programming language. This guide walks you through installing Python 3.8 on CentOS from source as well as how to install Python 3.6 from the CentOS repository.

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started/) guide and complete the steps for setting your Linode's hostname and timezone.

2.  Update your system:

        sudo yum update

## Installing Python 3.8

You need to build Python 3.8 from source to install it on CentOS 8.

1. Download the dependencies to build the package:

        sudo dnf groupinstall 'development tools'
        sudo dnf install wget openssl-devel bzip2-devel libffi-devel

2. Download Python version 3.8:

        sudo wget https://www.python.org/ftp/python/3.8.2/Python-3.8.2.tgz

3. Extract the Python package:

        tar -xvf Python-3.8.2.tgz

1.  Change into the Python directory:

        cd Python-3.8.2

4. Run the configuration script and run the build process:

        sudo ./configure --enable-optimizations
        sudo make install

    {{< note >}}
If you have an already existing Python binary installed at `/usr/bin/python` or `/usr/bin/python3`, you should run `sudo make altinstall` instead.
{{< /note >}}

1.  After the installation is finished, you can run the command `python3 -V` and verify the installation:

        python3 -V

    The output looks like this:

    {{< output >}}
Python 3.8.2
{{< /output >}}



## Additional Information

If you do not need the latest version of Python, you can install Python 3.6 using the CentOS repository. This version is included in the CentOS repository by default. While this installation method is easier than the previous *from source* method, it is not the latest version. Install version 3.6 by running the following command:

    sudo dnf install python3

If you haven't installed any other version of Python, you can verify this installation by typing:

    Python -V

And the shell returns:
{{< output >}}
Python 3.6.8
{{< /output >}}

{{< caution >}}
Installing multiple versions of Python 3 is not recommended. It's best to manage multiple versions with tools like [pyenv](https://github.com/pyenv/pyenv) or [anaconda](https://www.anaconda.com/).
{{< /caution >}}

### Python 2

You may require Python 2 for as a dependency for older code or software. If this is the case, you can install it with the following command:

    sudo dnf install python2

Run `python2 -V` to check the version:

    python2 -V

The output looks like the following:

{{< output >}}
Python 2.7.17
{{< /output >}}

It's important to remember that Python2 is no longer supported by the Python foundation. Therefore, there are no new updates, or fixes. Applications are making the switch to Python 3, and distributions like Ubuntu 20.04 and CentOS 8 are no longer shipping with Python 2 by default.
